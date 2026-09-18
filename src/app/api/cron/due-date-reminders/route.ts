import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  sendDailyManifestTelegramNotification,
  sendDueDateTelegramNotification,
  sendDeliveryGroupRequest,
} from "@/lib/telegram";
import { formatCustomerFulfillmentWindow } from "@/lib/fulfillment-windows";

export const maxDuration = 60;

// Bookings in these statuses still need their delivery/pick-up handled by us.
const ACTIVE_STATUSES = ["paid", "delivering", "active", "returning"];

function madridDateString(date: Date) {
  // en-CA gives YYYY-MM-DD, which matches Postgres `date` string comparisons.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);
}

function madridWindowLabel(date: Date) {
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${dateLabel} · ${formatCustomerFulfillmentWindow(time)}`;
}

type BookingRow = {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_phone: string | null;
  status: string;
  fulfillment_mode: string | null;
  delivery_address: string | null;
  collection_address: string | null;
  delivery_zone_id: string | null;
  collection_zone_id: string | null;
  rental_start_at: string | null;
  rental_end_at: string | null;
  product: { name: string } | { name: string }[] | null;
};

function resolveProductName(product: BookingRow["product"]) {
  if (!product) return "Rental item";
  const row = Array.isArray(product) ? product[0] : product;
  return row?.name || "Rental item";
}

async function hasAlreadyNotified(
  supabase: ReturnType<typeof createAdminClient>,
  bookingId: string,
  eventType: "delivery" | "pickup",
  eventDate: string,
) {
  const { data, error } = await supabase
    .from("booking_reminder_notifications")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("event_type", eventType)
    .eq("event_date", eventDate)
    .eq("channel", "telegram");

  if (error) throw error;
  return Boolean(data && data.length > 0);
}

async function recordNotification(
  supabase: ReturnType<typeof createAdminClient>,
  bookingId: string,
  eventType: "delivery" | "pickup",
  eventDate: string,
) {
  const { error } = await supabase
    .from("booking_reminder_notifications")
    .insert({ booking_id: bookingId, event_type: eventType, event_date: eventDate, channel: "telegram" });

  if (error) throw error;
}

async function hasDailyManifestBeenSent(
  supabase: ReturnType<typeof createAdminClient>,
  manifestDate: string,
) {
  const { data, error } = await supabase
    .from("daily_operation_manifests")
    .select("id")
    .eq("manifest_date", manifestDate)
    .eq("channel", "telegram")
    .limit(1);

  if (error) throw error;
  return Boolean(data && data.length > 0);
}

async function recordDailyManifest(
  supabase: ReturnType<typeof createAdminClient>,
  manifestDate: string,
) {
  const { error } = await supabase
    .from("daily_operation_manifests")
    .insert({ manifest_date: manifestDate, channel: "telegram" });

  if (error) throw error;
}

// Posts one claimable request per event to the courier group; idempotent per day.
async function dispatchGroupRequest(
  supabase: ReturnType<typeof createAdminClient>,
  booking: BookingRow,
  eventType: "delivery" | "pickup",
  eventDate: string,
  productName: string,
  zoneNames: Map<string, string>,
) {
  if (!process.env.TELEGRAM_DELIVERY_GROUP_ID) return false;

  const { data: inserted, error: insertError } = await supabase
    .from("delivery_requests")
    .upsert(
      { booking_id: booking.id, event_type: eventType, event_date: eventDate },
      { onConflict: "booking_id,event_type,event_date", ignoreDuplicates: true },
    )
    .select("id");

  if (insertError) throw insertError;
  const request = inserted?.[0];
  if (!request) return false;

  const zoneId = eventType === "delivery" ? booking.delivery_zone_id : booking.collection_zone_id;
  const eventAt = new Date((eventType === "delivery" ? booking.rental_start_at : booking.rental_end_at) as string);
  const sent = await sendDeliveryGroupRequest({
    requestId: request.id,
    bookingRef: booking.booking_ref,
    eventType,
    productName,
    windowLabel: madridWindowLabel(eventAt),
    area: (zoneId && zoneNames.get(zoneId)) || "Valencia",
  });

  if (!sent.ok) {
    await supabase.from("delivery_requests").delete().eq("id", request.id);
    throw new Error(sent.error || "Failed to post request to the courier group");
  }

  await supabase
    .from("delivery_requests")
    .update({ group_chat_id: process.env.TELEGRAM_DELIVERY_GROUP_ID, group_message_id: sent.messageId || null })
    .eq("id", request.id);
  return true;
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = madridDateString(new Date());

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id,booking_ref,customer_name,customer_phone,status,fulfillment_mode,delivery_address,collection_address,delivery_zone_id,collection_zone_id,rental_start_at,rental_end_at,product:products(name)",
    )
    .in("status", ACTIVE_STATUSES);

  if (error) {
    return NextResponse.json({ error: "Failed to load bookings due today", details: error.message }, { status: 500 });
  }

  const bookingRows = (bookings || []) as BookingRow[];
  const zoneIds = [...new Set(bookingRows.flatMap((booking) => [booking.delivery_zone_id, booking.collection_zone_id]).filter(Boolean))] as string[];
  const zoneNames = new Map<string, string>();
  if (zoneIds.length > 0) {
    const { data: zones } = await supabase.from("service_zones").select("id,name").in("id", zoneIds);
    for (const zone of (zones || []) as { id: string; name: string }[]) zoneNames.set(zone.id, zone.name);
  }

  const results = {
    deliveriesSent: 0,
    pickupsSent: 0,
    groupRequestsSent: 0,
    skippedAlreadySent: 0,
    manifestSent: false,
    manifestSkippedAlreadySent: false,
    errors: [] as string[],
  };
  const manifest = {
    date: today,
    deliveries: [] as Array<{ bookingRef: string; productName: string; area: string }>,
    pickups: [] as Array<{ bookingRef: string; productName: string; area: string }>,
  };

  for (const booking of bookingRows) {
    const productName = resolveProductName(booking.product);

    // Delivery due: we drop the item off with the customer today.
    if (
      booking.rental_start_at &&
      madridDateString(new Date(booking.rental_start_at)) === today &&
      (booking.fulfillment_mode === "delivery_only" || booking.fulfillment_mode === "delivery_and_collection") &&
      booking.delivery_address
    ) {
      const area = (booking.delivery_zone_id && zoneNames.get(booking.delivery_zone_id)) || "Valencia";
      manifest.deliveries.push({ bookingRef: booking.booking_ref, productName, area });
      try {
        const alreadySent = await hasAlreadyNotified(supabase, booking.id, "delivery", today);
        if (alreadySent) {
          results.skippedAlreadySent += 1;
        } else {
          const sent = await sendDueDateTelegramNotification({
            bookingId: booking.id,
            bookingRef: booking.booking_ref,
            eventType: "delivery",
            productName,
            customerName: booking.customer_name,
            customerPhone: booking.customer_phone,
            address: booking.delivery_address,
          });
          if (!sent.ok) results.errors.push(`Delivery reminder for ${booking.booking_ref}: ${sent.error}`);
          else {
            await recordNotification(supabase, booking.id, "delivery", today);
            results.deliveriesSent += 1;
          }
        }

        try {
          if (await dispatchGroupRequest(supabase, booking, "delivery", today, productName, zoneNames)) {
            results.groupRequestsSent += 1;
          }
        } catch (groupErr) {
          results.errors.push(`Group delivery request for ${booking.booking_ref}: ${groupErr instanceof Error ? groupErr.message : String(groupErr)}`);
        }
      } catch (err) {
        results.errors.push(`Delivery reminder for ${booking.booking_ref}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Pick-up due: we collect the item back from the customer today.
    if (
      booking.rental_end_at &&
      madridDateString(new Date(booking.rental_end_at)) === today &&
      booking.fulfillment_mode === "delivery_and_collection"
    ) {
      const address = booking.collection_address || booking.delivery_address;
      if (address) {
        const area = (booking.collection_zone_id && zoneNames.get(booking.collection_zone_id)) || "Valencia";
        manifest.pickups.push({ bookingRef: booking.booking_ref, productName, area });
        try {
          const alreadySent = await hasAlreadyNotified(supabase, booking.id, "pickup", today);
          if (alreadySent) {
            results.skippedAlreadySent += 1;
          } else {
            const sent = await sendDueDateTelegramNotification({
              bookingId: booking.id,
              bookingRef: booking.booking_ref,
              eventType: "pickup",
              productName,
              customerName: booking.customer_name,
              customerPhone: booking.customer_phone,
              address,
            });
            if (!sent.ok) results.errors.push(`Pick-up reminder for ${booking.booking_ref}: ${sent.error}`);
            else {
              await recordNotification(supabase, booking.id, "pickup", today);
              results.pickupsSent += 1;
            }
          }

          try {
            if (await dispatchGroupRequest(supabase, booking, "pickup", today, productName, zoneNames)) {
              results.groupRequestsSent += 1;
            }
          } catch (groupErr) {
            results.errors.push(`Group pick-up request for ${booking.booking_ref}: ${groupErr instanceof Error ? groupErr.message : String(groupErr)}`);
          }
        } catch (err) {
          results.errors.push(`Pick-up reminder for ${booking.booking_ref}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  }

  try {
    if (await hasDailyManifestBeenSent(supabase, today)) {
      results.manifestSkippedAlreadySent = true;
    } else {
      const sent = await sendDailyManifestTelegramNotification(manifest);
      if (!sent.ok) {
        results.errors.push(`Daily manifest: ${sent.error}`);
      } else {
        await recordDailyManifest(supabase, today);
        results.manifestSent = true;
      }
    }
  } catch (err) {
    results.errors.push(`Daily manifest: ${err instanceof Error ? err.message : String(err)}`);
  }

  return NextResponse.json({ date: today, ...results });
}
