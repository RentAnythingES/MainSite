import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendDueDateTelegramNotification } from "@/lib/telegram";

export const maxDuration = 60;

// Bookings in these statuses still need their delivery/pick-up handled by us.
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
  rental_start_at: string | null;
  rental_end_at: string | null;
  product: { name: string } | { name: string }[] | null;
};

function resolveProductName(product: BookingRow["product"]) {
  if (!product) return "Rental item";
  const row = Array.isArray(product) ? product[0] : product;
  return row?.name || "Rental item";
}

async function alreadyNotified(
  supabase: ReturnType<typeof createAdminClient>,
  bookingId: string,
  eventType: "delivery" | "pickup",
  eventDate: string,
) {
  const { data, error } = await supabase
    .from("booking_reminder_notifications")
    .upsert(
      { booking_id: bookingId, event_type: eventType, event_date: eventDate, channel: "telegram" },
      { onConflict: "booking_id,event_type,event_date,channel", ignoreDuplicates: true },
    )
    .select("id");

  if (error) throw error;
  // If the row already existed, the ignored insert returns no rows.
  return !data || data.length === 0;
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
      "id,booking_ref,customer_name,customer_phone,status,fulfillment_mode,delivery_address,collection_address,rental_start_at,rental_end_at,product:products(name)",
    )
    .in("status", ACTIVE_STATUSES);

  if (error) {
    return NextResponse.json({ error: "Failed to load bookings due today", details: error.message }, { status: 500 });
  }

  const results = { deliveriesSent: 0, pickupsSent: 0, skippedAlreadySent: 0, errors: [] as string[] };

  for (const booking of (bookings || []) as BookingRow[]) {
    const productName = resolveProductName(booking.product);

    // Delivery due: we drop the item off with the customer today.
    if (
      booking.rental_start_at &&
      madridDateString(new Date(booking.rental_start_at)) === today &&
      (booking.fulfillment_mode === "delivery_only" || booking.fulfillment_mode === "delivery_and_collection") &&
      booking.delivery_address
    ) {
      try {
        const isNew = await alreadyNotified(supabase, booking.id, "delivery", today);
        if (!isNew) {
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
          else results.deliveriesSent += 1;
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
        try {
          const isNew = await alreadyNotified(supabase, booking.id, "pickup", today);
          if (!isNew) {
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
            else results.pickupsSent += 1;
          }
        } catch (err) {
          results.errors.push(`Pick-up reminder for ${booking.booking_ref}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  }

  return NextResponse.json({ date: today, ...results });
}
