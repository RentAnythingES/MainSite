const ADMIN_BOOKINGS_URL = "https://rentandroll.com/admin/bookings";

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
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && getTelegramChatIds().length > 0);
}

export function getTelegramBookingConfigurationIssues() {
  return REQUIRED_VARS.filter((name) => {
    if (name === "TELEGRAM_NOTIFY_CHAT_ID") return getTelegramChatIds().length === 0;
    return !process.env[name];
  });
}

async function sendTelegramText(
  text: string,
  logLabel: string,
  replyMarkup?: { inline_keyboard: { text: string; callback_data: string }[][] },
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = getTelegramChatIds();
  const threadId = process.env.TELEGRAM_NOTIFY_THREAD_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";

  if (!botToken || chatIds.length === 0) return { ok: false, error: "Telegram bot token or chat id is not configured" };

  try {
    const failures: string[] = [];
    let successfulDeliveries = 0;
    for (const chatId of chatIds) {
      const response = await fetch(`${apiBase}/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          ...(threadId ? { message_thread_id: Number(threadId) } : {}),
          ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
        }),
      });

      if (!response.ok) {
        failures.push(`chat ${chatId}: Telegram Bot API returned ${response.status}: ${await response.text()}`);
      } else {
        successfulDeliveries += 1;
      }
    }

    if (successfulDeliveries === 0) {
      throw new Error(failures.join("; "));
    }

    if (failures.length > 0) {
      console.error(`[telegram] ${logLabel} notification was delivered to ${successfulDeliveries} recipient(s), but failed for: ${failures.join("; ")}`);
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[telegram] Failed to send ${logLabel} notification`, error);
    return { ok: false, error: message };
  }
}

export async function sendBookingPaidTelegramNotification(data: BookingPaidTelegramData) {
  return sendTelegramText(buildMessageText(data), "booking-paid");
}

export interface DueDateTelegramData {
  bookingId?: string | null;
  bookingRef: string;
  eventType: "delivery" | "pickup";
  productName: string;
  customerName: string;
  customerPhone?: string | null;
  address: string;
}

function buildGoogleMapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildDueDateMessageText(data: DueDateTelegramData) {
  const heading = data.eventType === "delivery" ? "📦 <b>Delivery due today</b>" : "🚚 <b>Pick-up due today</b>";
  const lines = [
    heading,
    `<b>Ref:</b> ${escapeTelegramHtml(data.bookingRef)}`,
    `<b>Item:</b> ${escapeTelegramHtml(data.productName)}`,
    `<b>Customer:</b> ${escapeTelegramHtml(data.customerName)}`,
    data.customerPhone ? `<b>Phone:</b> ${escapeTelegramHtml(data.customerPhone)}` : null,
    `<b>Address:</b> ${escapeTelegramHtml(data.address)}`,
    `<b>Map:</b> ${escapeTelegramHtml(buildGoogleMapsLink(data.address))}`,
    `<b>Admin:</b> ${escapeTelegramHtml(buildAdminUrl(data.bookingId))}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function sendDueDateTelegramNotification(data: DueDateTelegramData) {
  return sendTelegramText(buildDueDateMessageText(data), `due-date-${data.eventType}`);
}

export interface DailyManifestTelegramData {
  date: string;
  deliveries: Array<{ bookingRef: string; productName: string; area: string }>;
  pickups: Array<{ bookingRef: string; productName: string; area: string }>;
}

function buildDailyManifestMessageText(data: DailyManifestTelegramData) {
  const lines = [
    "📋 <b>Daily operations manifest</b>",
    `<b>Date:</b> ${escapeTelegramHtml(data.date)}`,
    `<b>Deliveries:</b> ${data.deliveries.length}`,
    ...data.deliveries.map((item) => `• 📦 ${escapeTelegramHtml(item.bookingRef)} — ${escapeTelegramHtml(item.productName)} (${escapeTelegramHtml(item.area)})`),
    `<b>Pick-ups:</b> ${data.pickups.length}`,
    ...data.pickups.map((item) => `• 🚚 ${escapeTelegramHtml(item.bookingRef)} — ${escapeTelegramHtml(item.productName)} (${escapeTelegramHtml(item.area)})`),
    "",
    "Individual reminders and courier requests are sent separately.",
  ];
  return lines.join("\n");
}

export async function sendDailyManifestTelegramNotification(data: DailyManifestTelegramData) {
  return sendTelegramText(buildDailyManifestMessageText(data), "daily-manifest");
}

export interface ShortNoticeBookingTelegramData {
  bookingId: string;
  bookingRef: string;
  customerName: string;
  customerPhone?: string | null;
  productName: string;
  quantity: number;
  startDate: string;
  fulfillmentLabel?: string | null;
  address?: string | null;
}

function buildShortNoticeMessageText(data: ShortNoticeBookingTelegramData) {
  const lines = [
    "⚡ <b>Short-notice booking — confirmation needed</b>",
    `<b>Ref:</b> ${escapeTelegramHtml(data.bookingRef)}`,
    `<b>Item:</b> ${escapeTelegramHtml(`${data.quantity} x ${data.productName}`)}`,
    `<b>Customer:</b> ${escapeTelegramHtml(data.customerName)}`,
    data.customerPhone ? `<b>Phone:</b> ${escapeTelegramHtml(data.customerPhone)}` : null,
    `<b>Start:</b> ${escapeTelegramHtml(data.startDate)}`,
    data.fulfillmentLabel ? `<b>Fulfillment:</b> ${escapeTelegramHtml(data.fulfillmentLabel)}` : null,
    data.address ? `<b>Address:</b> ${escapeTelegramHtml(data.address)}` : null,
    `<b>Admin:</b> ${escapeTelegramHtml(buildAdminUrl(data.bookingId))}`,
    "",
    "This booking is less than 24h away and was paid, but needs a quick confirm/reject (target: within 2h during opening hours).",
  ].filter(Boolean);

  return lines.join("\n");
}

export async function sendShortNoticeBookingTelegramNotification(data: ShortNoticeBookingTelegramData) {
  return sendTelegramText(buildShortNoticeMessageText(data), "short-notice-booking", {
    inline_keyboard: [[
      { text: "✅ Confirm", callback_data: `bkconfirm:${data.bookingId}` },
      { text: "❌ Reject", callback_data: `bkreject:${data.bookingId}` },
    ]],
  });
}

export async function answerTelegramCallbackQuery(callbackQueryId: string, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken) return;
  await fetch(`${apiBase}/bot${botToken}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: false }),
  }).catch(() => undefined);
}

export async function editTelegramMessageText(chatId: number | string, messageId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken) return;
  await fetch(`${apiBase}/bot${botToken}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "HTML" }),
  }).catch(() => undefined);
}

export async function sendTelegramToChatId(
  chatId: string,
  text: string,
  replyMarkup?: { inline_keyboard: { text: string; callback_data: string }[][] },
): Promise<{ ok: boolean; messageId?: number; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken) return { ok: false, error: "Telegram bot token is not configured" };

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      }),
    });
    const payload = await response.json() as { ok?: boolean; result?: { message_id?: number }; description?: string };
    if (!response.ok || !payload.ok) {
      return { ok: false, error: payload.description || `Telegram Bot API returned ${response.status}` };
    }
    return { ok: true, messageId: payload.result?.message_id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export interface DeliveryGroupRequestData {
  requestId: string;
  eventType: "delivery" | "pickup";
  windowLabel: string;
  postalCode: string;
}

function buildDeliveryGroupRequestText(data: DeliveryGroupRequestData) {
  const heading = data.eventType === "delivery" ? "🚚 <b>New delivery request</b>" : "📦 <b>New pick-up request</b>";
  const lines = [
    heading,
    `<b>When:</b> ${escapeTelegramHtml(data.windowLabel)}`,
    `<b>Postcode:</b> ${escapeTelegramHtml(data.postalCode)}`,
    "",
    "First courier to accept receives the full address and instructions in a private message.",
  ];
  return lines.join("\n");
}

export async function sendDeliveryGroupRequest(data: DeliveryGroupRequestData) {
  const groupChatId = process.env.TELEGRAM_DELIVERY_GROUP_ID;
  if (!groupChatId) return { ok: false as const, error: "TELEGRAM_DELIVERY_GROUP_ID is not configured" };

  return sendTelegramToChatId(groupChatId, buildDeliveryGroupRequestText(data), {
    inline_keyboard: [[
      { text: "✅ I'll take it", callback_data: `dvclaim:${data.requestId}` },
      { text: "❌ I can't", callback_data: `dvskip:${data.requestId}` },
    ]],
  });
}

export async function isTelegramDeliveryGroupMember(telegramUserId: number): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_DELIVERY_GROUP_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken || !groupChatId) return false;

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/getChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: groupChatId, user_id: telegramUserId }),
    });
    const payload = await response.json() as { ok?: boolean; result?: { status?: string; is_member?: boolean } };
    if (!response.ok || !payload.ok) return false;
    const status = payload.result?.status;
    return status === "member" || status === "administrator" || status === "creator" || status === "owner"
      || (status === "restricted" && payload.result?.is_member === true);
  } catch {
    return false;
  }
}

export interface DeliveryDetailsData {
  bookingId?: string | null;
  bookingRef: string;
  eventType: "delivery" | "pickup";
  productName: string;
  customerName: string;
  customerPhone?: string | null;
  address: string;
  notes?: string | null;
}

function buildDeliveryDetailsText(data: DeliveryDetailsData) {
  const heading = data.eventType === "delivery"
    ? "🚚 <b>Delivery assigned to you</b>"
    : "📦 <b>Pick-up assigned to you</b>";
  const lines = [
    heading,
    `<b>Ref:</b> ${escapeTelegramHtml(data.bookingRef)}`,
    `<b>Item:</b> ${escapeTelegramHtml(data.productName)}`,
    `<b>Customer:</b> ${escapeTelegramHtml(data.customerName)}`,
    data.customerPhone ? `<b>Phone:</b> ${escapeTelegramHtml(data.customerPhone)}` : null,
    `<b>Address:</b> ${escapeTelegramHtml(data.address)}`,
    `<b>Map:</b> ${escapeTelegramHtml(buildGoogleMapsLink(data.address))}`,
    data.notes ? `<b>Notes:</b> ${escapeTelegramHtml(data.notes)}` : null,
    `<b>Admin:</b> ${escapeTelegramHtml(buildAdminUrl(data.bookingId))}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function sendDeliveryDetailsDirectMessage(telegramUserId: number, data: DeliveryDetailsData) {
  return sendTelegramToChatId(String(telegramUserId), buildDeliveryDetailsText(data));
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

function getTelegramChatIds() {
  const configured = process.env.TELEGRAM_NOTIFY_CHAT_IDS || process.env.TELEGRAM_NOTIFY_CHAT_ID || "";
  return [...new Set(configured.split(",").map((value) => value.trim()).filter(Boolean))];
}

export async function createDeliveryDriverInviteLink(name: string): Promise<{ ok: boolean; inviteLink?: string; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_DELIVERY_GROUP_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken || !groupChatId) return { ok: false, error: "Telegram delivery group is not configured" };

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/createChatInviteLink`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: groupChatId,
        name: `Driver: ${name.slice(0, 24)}`,
        member_limit: 1,
        expire_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      }),
    });
    const payload = await response.json() as { ok?: boolean; result?: { invite_link?: string }; description?: string };
    if (!response.ok || !payload.ok || !payload.result?.invite_link) {
      return { ok: false, error: payload.description || `Telegram Bot API returned ${response.status}` };
    }
    return { ok: true, inviteLink: payload.result.invite_link };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function removeDeliveryDriverFromGroup(telegramUserId: number): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_DELIVERY_GROUP_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  if (!botToken || !groupChatId) return { ok: false, error: "Telegram delivery group is not configured" };

  try {
    const response = await fetch(`${apiBase}/bot${botToken}/banChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: groupChatId, user_id: telegramUserId }),
    });
    const payload = await response.json() as { ok?: boolean; description?: string };
    return response.ok && payload.ok
      ? { ok: true }
      : { ok: false, error: payload.description || `Telegram Bot API returned ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
