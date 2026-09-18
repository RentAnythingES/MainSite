/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only check of today's due work and durable Telegram-send records.
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function madridDate(value) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date(value));
}

async function database(pathAndQuery) {
  const response = await fetch(`${baseUrl}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
  return response.json();
}

async function main() {
  if (!baseUrl || !serviceKey) throw new Error("Supabase service credentials are not configured");
  const today = madridDate(new Date());
  const [bookings, reminderNotifications, manifests] = await Promise.all([
    database("bookings?select=booking_ref,status,fulfillment_mode,rental_start_at,rental_end_at,delivery_address,collection_address&status=in.(paid,delivering,active,returning)"),
    database(`booking_reminder_notifications?select=event_type,event_date,sent_at&event_date=eq.${today}`),
    database(`daily_operation_manifests?select=manifest_date,sent_at&manifest_date=eq.${today}&channel=eq.telegram`),
  ]);

  const due = bookings.flatMap((booking) => {
    const events = [];
    if (booking.rental_start_at && madridDate(booking.rental_start_at) === today && ["delivery_only", "delivery_and_collection"].includes(booking.fulfillment_mode) && booking.delivery_address) {
      events.push({ bookingRef: booking.booking_ref, eventType: "delivery", status: booking.status });
    }
    if (booking.rental_end_at && madridDate(booking.rental_end_at) === today && booking.fulfillment_mode === "delivery_and_collection" && (booking.collection_address || booking.delivery_address)) {
      events.push({ bookingRef: booking.booking_ref, eventType: "pickup", status: booking.status });
    }
    return events;
  });

  console.log(JSON.stringify({
    date: today,
    due,
    reminderNotifications: reminderNotifications.map((item) => ({ eventType: item.event_type, sentAt: item.sent_at })),
    manifestSent: manifests.length > 0,
    manifestSentAt: manifests[0]?.sent_at || null,
  }, null, 2));
}

main().catch((error) => {
  console.error(`Daily operations audit failed: ${error.message}`);
  process.exit(1);
});
