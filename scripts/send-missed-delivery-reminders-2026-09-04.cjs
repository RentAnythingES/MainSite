/* eslint-disable @typescript-eslint/no-require-imports */
// One-off recovery: the due-date-reminders cron silently failed every day since
// 2026-09-01 because the booking_reminder_notifications table didn't exist yet
// (migration was never applied to prod). This resends today's missed reminders
// and records them in booking_reminder_notifications so the cron won't double-send.
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_NOTIFY_CHAT_ID;

function madridDateString(date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);
}

function escapeHtml(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function mapsLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

async function sendTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram send failed: ${res.status} ${await res.text()}`);
}

async function supaFetch(pathAndQuery, init) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init && init.headers),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${pathAndQuery} failed: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function markNotified(bookingId, eventType, eventDate) {
  const rows = await supaFetch("booking_reminder_notifications?on_conflict=booking_id,event_type,event_date,channel", {
    method: "POST",
    headers: { Prefer: "return=representation,resolution=ignore-duplicates" },
    body: JSON.stringify({ booking_id: bookingId, event_type: eventType, event_date: eventDate, channel: "telegram" }),
  });
  return Array.isArray(rows) && rows.length > 0;
}

async function main() {
  const today = madridDateString(new Date());
  const bookings = await supaFetch(
    `bookings?select=id,booking_ref,customer_name,customer_phone,status,fulfillment_mode,delivery_address,collection_address,rental_start_at,rental_end_at,product:products(name)&status=in.(paid,delivering,active,returning)`,
  );

  const results = { deliveriesSent: 0, skipped: 0, errors: [] };

  for (const booking of bookings) {
    const productName = (Array.isArray(booking.product) ? booking.product[0] : booking.product)?.name || "Rental item";
    const isDeliveryDueToday =
      booking.rental_start_at &&
      madridDateString(new Date(booking.rental_start_at)) === today &&
      (booking.fulfillment_mode === "delivery_only" || booking.fulfillment_mode === "delivery_and_collection") &&
      booking.delivery_address;

    if (!isDeliveryDueToday) continue;

    try {
      const isNew = await markNotified(booking.id, "delivery", today);
      if (!isNew) {
        results.skipped += 1;
        continue;
      }
      const lines = [
        "📦 <b>Delivery due today</b>",
        `<b>Ref:</b> ${escapeHtml(booking.booking_ref)}`,
        `<b>Item:</b> ${escapeHtml(productName)}`,
        `<b>Customer:</b> ${escapeHtml(booking.customer_name)}`,
        booking.customer_phone ? `<b>Phone:</b> ${escapeHtml(booking.customer_phone)}` : null,
        `<b>Address:</b> ${escapeHtml(booking.delivery_address)}`,
        `<b>Map:</b> ${escapeHtml(mapsLink(booking.delivery_address))}`,
        `<b>Admin:</b> https://rentandroll.com/admin/bookings/${booking.id}`,
      ].filter(Boolean);
      await sendTelegram(lines.join("\n"));
      results.deliveriesSent += 1;
      console.log(`Sent delivery reminder for ${booking.booking_ref}`);
    } catch (err) {
      results.errors.push(`${booking.booking_ref}: ${err.message}`);
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
