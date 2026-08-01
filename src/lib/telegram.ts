const ADMIN_BOOKINGS_URL = "https://rentanything.es/admin/bookings";

export interface BookingPaidTelegramData {
  bookingId?: string | null;
  bookingRef: string;
  customerName: string;
  customerPhone?: string | null;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalCents: number;
  fulfillmentLabel?: string | null;
  deliveryAddress?: string | null;
}

const REQUIRED_VARS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_NOTIFY_CHAT_ID",
] as const;

type TelegramChat = {
  id: number | string;
  type?: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramMessage = {
  message_id?: number;
  date?: number;
  text?: string;
  message_thread_id?: number;
  chat?: TelegramChat;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  channel_post?: TelegramMessage;
};

function formatEuros(cents: number) {
  return `EUR ${(cents / 100).toFixed(2)}`;
}

function formatRentalWindow(startDate: string, endDate: string) {
  const start = new Date(startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const end = new Date(endDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${start} -> ${end}`;
}

function buildAdminUrl(bookingId: string | null | undefined) {
  return bookingId ? `${ADMIN_BOOKINGS_URL}/${bookingId}` : ADMIN_BOOKINGS_URL;
}

function escapeTelegramHtml(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildMessageText(data: BookingPaidTelegramData) {
  const lines = [
    "<b>New paid booking</b>",
    `<b>Ref:</b> ${escapeTelegramHtml(data.bookingRef)}`,
    `<b>Customer:</b> ${escapeTelegramHtml(data.customerName)}`,
    data.customerPhone ? `<b>Phone:</b> ${escapeTelegramHtml(data.customerPhone)}` : null,
    `<b>Item:</b> ${escapeTelegramHtml(`${data.quantity} x ${data.productName}`)}`,
    `<b>Dates:</b> ${escapeTelegramHtml(formatRentalWindow(data.startDate, data.endDate))}`,
    `<b>Total:</b> ${escapeTelegramHtml(formatEuros(data.totalCents))}`,
    data.fulfillmentLabel ? `<b>Fulfillment:</b> ${escapeTelegramHtml(data.fulfillmentLabel)}` : null,
    data.deliveryAddress ? `<b>Address:</b> ${escapeTelegramHtml(data.deliveryAddress)}` : null,
    `<b>Admin:</b> ${escapeTelegramHtml(buildAdminUrl(data.bookingId))}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function isTelegramBookingNotificationConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_NOTIFY_CHAT_ID);
}

export function getTelegramBookingConfigurationIssues() {
  return REQUIRED_VARS.filter((name) => !process.env[name]);
}

export async function sendBookingPaidTelegramNotification(data: BookingPaidTelegramData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  const threadId = process.env.TELEGRAM_NOTIFY_THREAD_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";

  if (!botToken || !chatId) return false;

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessageText(data),
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(threadId ? { message_thread_id: Number(threadId) } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram Bot API returned ${response.status}: ${body}`);
    }

    return true;
  } catch (error) {
    console.error("[telegram] Failed to send booking-paid notification", error);
    return false;
  }
}

export async function sendTestBookingPaidTelegramNotification() {
  return sendBookingPaidTelegramNotification({
    bookingId: "telegram-test-booking",
    bookingRef: "TEST-TG-BOOKING",
    customerName: "Test Customer",
    customerPhone: "+34600000000",
    productName: "Portable Air Conditioner",
    quantity: 1,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    totalCents: 14900,
    fulfillmentLabel: "Delivery",
    deliveryAddress: "Test address, Valencia",
  });
}

export async function getTelegramRecentChatCandidates(limit = 20) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const response = await fetch(`${apiBase}/bot${botToken}/getUpdates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram Bot API returned ${response.status}: ${body}`);
  }

  const payload = await response.json() as { ok?: boolean; result?: TelegramUpdate[]; description?: string };
  if (!payload.ok) {
    throw new Error(payload.description || "Telegram getUpdates failed");
  }

  const candidates = new Map<string, {
    chatId: string;
    type: string;
    title: string | null;
    username: string | null;
    threadId: number | null;
    lastMessageAt: string | null;
    sampleText: string | null;
    updateId: number;
  }>();

  for (const update of payload.result || []) {
    const message = update.message || update.channel_post;
    const chat = message?.chat;
    if (!chat?.id) continue;

    const chatId = String(chat.id);
    const threadId = message?.message_thread_id || null;
    const key = `${chatId}:${threadId || "main"}`;
    const existing = candidates.get(key);
    const next = {
      chatId,
      type: chat.type || "unknown",
      title: chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || null,
      username: chat.username || null,
      threadId,
      lastMessageAt: message?.date ? new Date(message.date * 1000).toISOString() : null,
      sampleText: message?.text || null,
      updateId: update.update_id,
    };

    if (!existing || existing.updateId < update.update_id) {
      candidates.set(key, next);
    }
  }

  return Array.from(candidates.values())
    .sort((left, right) => right.updateId - left.updateId)
    .slice(0, limit);
}