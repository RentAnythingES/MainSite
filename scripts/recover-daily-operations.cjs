/* eslint-disable @typescript-eslint/no-require-imports */
// Manual, idempotent recovery for a missed daily Telegram operations run.
const fs = require("fs");
const path = require("path");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = [...new Set((process.env.TELEGRAM_NOTIFY_CHAT_IDS || process.env.TELEGRAM_NOTIFY_CHAT_ID || "").split(",").map((value) => value.trim()).filter(Boolean))];

function madridDate(value) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function database(pathAndQuery, init = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${body}`);
  return body ? JSON.parse(body) : null;
}

async function sendTelegram(text) {
  const results = [];
  for (const chatId of chatIds) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      });
      const payload = await response.json();
      results.push({ chatId, ok: Boolean(response.ok && payload.ok), error: payload.description || null });
    } catch (error) {
      results.push({ chatId, ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  if (!results.some((result) => result.ok)) throw new Error(results.map((result) => `${result.chatId}: ${result.error || "send failed"}`).join("; "));
  return results;
}

async function main() {
  if (!supabaseUrl || !serviceKey || !botToken || chatIds.length === 0) throw new Error("Production Supabase or Telegram configuration is incomplete");
  const today = madridDate(new Date());
  const bookings = await database("bookings?select=id,booking_ref,customer_name,customer_phone,status,fulfillment_mode,delivery_address,collection_address,rental_start_at,rental_end_at,product:products(name)&status=in.(paid,delivering,active,returning)");
  const due = [];
  for (const booking of bookings) {
    const productName = (Array.isArray(booking.product) ? booking.product[0] : booking.product)?.name || "Rental item";
    if (booking.rental_start_at && madridDate(booking.rental_start_at) === today && ["delivery_only", "delivery_and_collection"].includes(booking.fulfillment_mode) && booking.delivery_address) {
      due.push({ booking, type: "delivery", address: booking.delivery_address, productName });
    }
    const collectionAddress = booking.collection_address || booking.delivery_address;
    if (booking.rental_end_at && madridDate(booking.rental_end_at) === today && booking.fulfillment_mode === "delivery_and_collection" && collectionAddress) {
      due.push({ booking, type: "pickup", address: collectionAddress, productName });
    }
  }

  const existingManifests = await database(`daily_operation_manifests?select=id&manifest_date=eq.${today}&channel=eq.telegram`);
  let manifestSent = false;
  if (existingManifests.length === 0) {
    const deliveries = due.filter((item) => item.type === "delivery");
    const returnCollections = due.filter((item) => item.type === "pickup");
    if (!process.argv.includes("--record-manifest-only")) await sendTelegram([
      "📋 <b>Daily operations manifest</b>",
      `<b>Date:</b> ${today}`,
      `<b>Deliveries:</b> ${deliveries.length}`,
      ...deliveries.map((item) => `• 📦 ${escapeHtml(item.booking.booking_ref)} — ${escapeHtml(item.productName)} (Valencia)`),
      `<b>Return collections:</b> ${returnCollections.length}`,
      ...returnCollections.map((item) => `• 🚚 ${escapeHtml(item.booking.booking_ref)} — ${escapeHtml(item.productName)} (Valencia)`),
      "",
      "Recovery send: the scheduled job did not complete this morning.",
    ].join("\n"));
    await database("daily_operation_manifests", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ manifest_date: today, channel: "telegram" }) });
    manifestSent = true;
  }

  if (process.argv.includes("--manifest-only")) {
    console.log(JSON.stringify({ date: today, manifestSent, dueEvents: due.length, remindersSent: 0 }, null, 2));
    return;
  }

  let remindersSent = 0;
  for (const item of due) {
    const existing = await database(`booking_reminder_notifications?select=id&booking_id=eq.${item.booking.id}&event_type=eq.${item.type}&event_date=eq.${today}&channel=eq.telegram`);
    if (existing.length > 0) continue;
    const heading = item.type === "delivery" ? "📦 <b>Delivery due today</b>" : "🚚 <b>Return collection due today</b>";
    await sendTelegram([
      heading,
      `<b>Ref:</b> ${escapeHtml(item.booking.booking_ref)}`,
      `<b>Item:</b> ${escapeHtml(item.productName)}`,
      `<b>Customer:</b> ${escapeHtml(item.booking.customer_name)}`,
      item.booking.customer_phone ? `<b>Phone:</b> ${escapeHtml(item.booking.customer_phone)}` : null,
      `<b>Address:</b> ${escapeHtml(item.address)}`,
      `<b>Map:</b> ${escapeHtml(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`)}`,
    ].filter(Boolean).join("\n"));
    await database("booking_reminder_notifications", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ booking_id: item.booking.id, event_type: item.type, event_date: today, channel: "telegram" }) });
    remindersSent += 1;
  }

  console.log(JSON.stringify({ date: today, manifestSent, dueEvents: due.length, remindersSent }, null, 2));
}

main().catch((error) => { console.error(`Daily operations recovery failed: ${error.message}`); process.exit(1); });
