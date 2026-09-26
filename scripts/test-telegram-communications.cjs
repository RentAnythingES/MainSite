/* eslint-disable @typescript-eslint/no-require-imports */
// Sends a clearly marked operational test to every configured admin recipient plus
// the Bookings chat. It deliberately does not create a booking or reminder record.
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
const bookingsChatId = "3956998068";
const configuredChatIds = (process.env.TELEGRAM_NOTIFY_CHAT_IDS || process.env.TELEGRAM_NOTIFY_CHAT_ID || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const chatIds = [...new Set([...configuredChatIds, bookingsChatId])];

async function telegram(method, body) {
  const response = await fetch(`${apiBase}/bot${botToken}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.description || `Telegram ${method} failed (${response.status})`);
  return payload.result;
}

async function main() {
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  if (chatIds.length === 0) throw new Error("No Telegram chat recipients are configured");

  const [bot, webhook] = await Promise.all([
    telegram("getMe"),
    telegram("getWebhookInfo"),
  ]);
  const updates = webhook.url ? [] : await telegram("getUpdates", { limit: 20 });
  const deliveries = [];
  for (const chatId of chatIds) {
    try {
      const sent = await telegram("sendMessage", {
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text: [
          "🧪 <b>Telegram operations test</b>",
          "Daily booking, due-delivery and manifest notifications are being checked.",
          "This is a test message — no customer action is required.",
        ].join("\n"),
      });
      deliveries.push({ chatId, ok: true, messageId: sent.message_id });
    } catch (error) {
      deliveries.push({ chatId, ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  let confirmationTest = null;
  try {
    const testId = `telegram-test-confirmation-${Date.now()}`;
    const sent = await telegram("sendMessage", {
      chat_id: bookingsChatId,
      parse_mode: "HTML",
      text: [
        "🧪 <b>Short-notice confirmation test</b>",
        "Tap Confirm to verify that Telegram can reach the booking confirmation webhook.",
        "This test does not change a booking or send a customer email.",
      ].join("\n"),
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Confirm test", callback_data: `bkconfirm:${testId}` },
          { text: "❌ Reject test", callback_data: `bkreject:${testId}` },
        ]],
      },
    });
    confirmationTest = { ok: true, messageId: sent.message_id };
  } catch (error) {
    confirmationTest = { ok: false, error: error instanceof Error ? error.message : String(error) };
  }

  console.log(JSON.stringify({
    botUsername: bot.username || null,
    webhookConfigured: Boolean(webhook.url),
    webhookPendingUpdates: webhook.pending_update_count || 0,
    webhookLastError: webhook.last_error_message || null,
    recentUpdateChatIds: [...new Set(updates.map((update) => String((update.message || update.channel_post)?.chat?.id || "")).filter(Boolean))],
    configuredRecipients: configuredChatIds,
    testDeliveries: deliveries,
    confirmationTest,
  }, null, 2));

  if (deliveries.some((delivery) => !delivery.ok) || !confirmationTest?.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Telegram communication test failed: ${error.message}`);
  process.exit(1);
});
