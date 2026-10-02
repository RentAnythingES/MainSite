import { buildDailyOperationsManifest, getBookingProductName, getOperationsDate } from "@/lib/booking-operations";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  sendDailyManifestTelegramNotification,
  sendDueDateTelegramNotification,
} from "@/lib/telegram";

export const maxDuration = 60;

// Bookings in these statuses still need delivery or return collection handled by us.
const ACTIVE_STATUSES = ["paid", "delivering", "active", "returning"];

function madridDateString(date: Date) {
  // en-CA gives YYYY-MM-DD, which matches Postgres `date` string comparisons.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);
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
  pickup_location_id: string | null;
  start_date: string | null;
  end_date: string | null;
  rental_start_at: string | null;
  rental_end_at: string | null;
  pricing_snapshot?: unknown;
  product: { name: string } | { name: string }[] | null;
};

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

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = madridDateString(new Date());

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id,booking_ref,customer_name,customer_phone,status,fulfillment_mode,delivery_address,collection_address,delivery_zone_id,collection_zone_id,pickup_location_id,start_date,end_date,rental_start_at,rental_end_at,pricing_snapshot,product:products(name)",
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
  const pickupLocationIds = [...new Set(bookingRows.map((booking) => booking.pickup_location_id).filter(Boolean))] as string[];
  const pickupLocationNames = new Map<string, string>();
  if (pickupLocationIds.length > 0) {
    const { data: pickupLocations } = await supabase.from("pickup_locations").select("id,name").in("id", pickupLocationIds);
    for (const location of (pickupLocations || []) as { id: string; name: string }[]) pickupLocationNames.set(location.id, location.name);
  }

  const results = {
    deliveriesSent: 0,
    returnCollectionsSent: 0,
    skippedAlreadySent: 0,
    manifestSent: false,
    manifestSkippedAlreadySent: false,
    errors: [] as string[],
  };
  const manifest = buildDailyOperationsManifest(bookingRows, today, pickupLocationNames, zoneNames);

  for (const booking of bookingRows) {
    const productName = getBookingProductName(booking);
    const startDate = getOperationsDate(booking.rental_start_at, booking.start_date);
    const endDate = getOperationsDate(booking.rental_end_at, booking.end_date);

    // Delivery due: we drop the item off with the customer today.
    if (
      startDate === today &&
      (booking.fulfillment_mode === "delivery_only" || booking.fulfillment_mode === "delivery_and_collection") &&
      booking.delivery_address
    ) {
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

      } catch (err) {
        results.errors.push(`Delivery reminder for ${booking.booking_ref}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Return collection due: we collect the rented item back from the customer today.
    if (
      endDate === today &&
      booking.fulfillment_mode === "delivery_and_collection"
    ) {
      const address = booking.collection_address || booking.delivery_address;
      if (address) {
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
            if (!sent.ok) results.errors.push(`Return collection reminder for ${booking.booking_ref}: ${sent.error}`);
            else {
              await recordNotification(supabase, booking.id, "pickup", today);
              results.returnCollectionsSent += 1;
            }
          }

        } catch (err) {
          results.errors.push(`Return collection reminder for ${booking.booking_ref}: ${err instanceof Error ? err.message : String(err)}`);
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
