const ADMIN_BOOKINGS_URL = "https://rentandroll.com/admin/bookings";

export interface BookingPaidWhatsAppData {
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

type WhatsAppMode = "webhook" | "meta_template";

const META_TEMPLATE_REQUIRED_VARS = [
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_NOTIFY_TO",
  "WHATSAPP_BOOKING_TEMPLATE_NAME",
] as const;

const WEBHOOK_REQUIRED_VARS = [
  "WHATSAPP_NOTIFY_WEBHOOK_URL",
] as const;

function getWhatsAppMode(): WhatsAppMode | null {
  if (process.env.WHATSAPP_NOTIFY_WEBHOOK_URL) return "webhook";

  if (
    process.env.WHATSAPP_ACCESS_TOKEN
    && process.env.WHATSAPP_PHONE_NUMBER_ID
    && process.env.WHATSAPP_NOTIFY_TO
    && process.env.WHATSAPP_BOOKING_TEMPLATE_NAME
  ) {
    return "meta_template";
  }

  return null;
}

export function getWhatsAppNotificationMode() {
  return getWhatsAppMode();
}

export function isWhatsAppBookingNotificationConfigured() {
  return getWhatsAppMode() !== null;
}

export function getWhatsAppBookingConfigurationIssues() {
  const mode = getWhatsAppMode();
  if (mode === "webhook") {
    return WEBHOOK_REQUIRED_VARS.filter((name) => !process.env[name]);
  }
  if (mode === "meta_template") {
    return META_TEMPLATE_REQUIRED_VARS.filter((name) => !process.env[name]);
  }

  const webhookMissing = WEBHOOK_REQUIRED_VARS.filter((name) => !process.env[name]);
  const metaMissing = META_TEMPLATE_REQUIRED_VARS.filter((name) => !process.env[name]);
  return [
    `Provide ${WEBHOOK_REQUIRED_VARS.join(", ")} for webhook mode, or all of: ${META_TEMPLATE_REQUIRED_VARS.join(", ")} for Meta template mode.`,
    ...webhookMissing.map((name) => `missing:${name}`),
    ...metaMissing.map((name) => `missing:${name}`),
  ];
}

function normalizePhoneNumber(value: string | null | undefined) {
  const normalized = String(value || "").replace(/[^\d+]/g, "").trim();
  if (!normalized) return "";
  return normalized.startsWith("+") ? normalized.slice(1) : normalized;
}

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

function buildMessageText(data: BookingPaidWhatsAppData) {
  const lines = [
    "New paid booking",
    `Ref: ${data.bookingRef}`,
    `Customer: ${data.customerName}`,
    data.customerPhone ? `Phone: ${data.customerPhone}` : null,
    `Item: ${data.quantity} x ${data.productName}`,
    `Dates: ${formatRentalWindow(data.startDate, data.endDate)}`,
    `Total: ${formatEuros(data.totalCents)}`,
    data.fulfillmentLabel ? `Fulfillment: ${data.fulfillmentLabel}` : null,
    data.deliveryAddress ? `Address: ${data.deliveryAddress}` : null,
    `Admin: ${buildAdminUrl(data.bookingId)}`,
  ].filter(Boolean);

  return lines.join("\n");
}

async function sendViaWebhook(data: BookingPaidWhatsAppData) {
  const webhookUrl = process.env.WHATSAPP_NOTIFY_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WHATSAPP_NOTIFY_WEBHOOK_SECRET
        ? { "x-rentanything-webhook-secret": process.env.WHATSAPP_NOTIFY_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({
      event: "booking.paid",
      channel: "whatsapp",
      text: buildMessageText(data),
      booking: {
        id: data.bookingId || null,
        ref: data.bookingRef,
        customerName: data.customerName,
        customerPhone: data.customerPhone || null,
        productName: data.productName,
        quantity: data.quantity,
        startDate: data.startDate,
        endDate: data.endDate,
        totalCents: data.totalCents,
        fulfillmentLabel: data.fulfillmentLabel || null,
        deliveryAddress: data.deliveryAddress || null,
        adminUrl: buildAdminUrl(data.bookingId),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`);
  }

  return true;
}

async function sendViaMetaTemplate(data: BookingPaidWhatsAppData) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyTo = normalizePhoneNumber(process.env.WHATSAPP_NOTIFY_TO);
  const templateName = process.env.WHATSAPP_BOOKING_TEMPLATE_NAME;
  const templateLanguage = process.env.WHATSAPP_BOOKING_TEMPLATE_LANG || "en";

  if (!accessToken || !phoneNumberId || !notifyTo || !templateName) return false;

  const fulfillment = [data.fulfillmentLabel, data.deliveryAddress].filter(Boolean).join(" - ") || "Not specified";
  const response = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: notifyTo,
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLanguage },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: data.bookingRef },
              { type: "text", text: data.customerName },
              { type: "text", text: `${data.quantity} x ${data.productName}` },
              { type: "text", text: formatRentalWindow(data.startDate, data.endDate) },
              { type: "text", text: formatEuros(data.totalCents) },
              { type: "text", text: fulfillment },
              { type: "text", text: buildAdminUrl(data.bookingId) },
            ],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WhatsApp Cloud API returned ${response.status}: ${body}`);
  }

  return true;
}

export async function sendBookingPaidWhatsAppNotification(data: BookingPaidWhatsAppData) {
  const mode = getWhatsAppMode();
  if (!mode) return false;

  try {
    if (mode === "webhook") return await sendViaWebhook(data);
    return await sendViaMetaTemplate(data);
  } catch (error) {
    console.error("[whatsapp] Failed to send booking-paid notification", error);
    return false;
  }
}

export async function sendTestBookingPaidWhatsAppNotification() {
  return sendBookingPaidWhatsAppNotification({
    bookingId: "whatsapp-test-booking",
    bookingRef: "TEST-WA-BOOKING",
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