import { Resend } from "resend";

const TO_ADMIN = process.env.CONTACT_EMAIL || "hello@rentanything.es";
const FROM = process.env.FROM_EMAIL || "RentAnything <noreply@rentanything.es>";
const WHATSAPP_URL = "https://wa.me/34684708013";
const ADMIN_BOOKINGS_URL = "https://rentanything.es/admin/bookings";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — emails disabled");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export interface BookingEmailData {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  totalCents: number;
  deliveryAddress: string;
  deliveryType: string;
  fulfillmentMode?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  productName?: string;
}

export interface SignupWelcomeEmailData {
  name?: string;
  email: string;
  interest?: string;
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

function button(href: string, label: string, background = "#0e7c73"): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${background};color:white;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;margin-top:8px;">${escapeHtml(label)}</a>`;
}

function infoBox(content: string, background = "#ecfdf5", border = "#99f6e4"): string {
  return `<div style="background:${background};border:1px solid ${border};border-radius:12px;padding:14px 16px;margin:18px 0;">${content}</div>`;
}

function emailWrapper(title: string, body: string, preheader?: string): string {
  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader || title)}</div>
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;margin:0 auto;color:#1f2937;">
      <div style="background:linear-gradient(135deg,#0e7c73,#30a596);padding:28px 32px;border-radius:18px 18px 0 0;">
        <p style="color:#ccfbf1;margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.03em;">RentAnything.es</p>
        <h1 style="color:white;margin:0;font-size:24px;line-height:1.2;">${escapeHtml(title)}</h1>
      </div>
      <div style="background:#f9fafb;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 18px 18px;">
        ${body}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="font-size:12px;color:#9ca3af;margin:0;line-height:1.5;">
          RentAnything.es · Escalera Labs S.L. · Valencia, Spain<br />
          Travel light. Feel at home.
        </p>
      </div>
    </div>
  `;
}

function fulfillmentLabel(data: BookingEmailData): string {
  if (data.fulfillmentMode === "customer_pickup") return "Pickup";
  if (data.fulfillmentMode === "delivery_and_collection") return "Delivery & collection";
  return "Delivery";
}

function nextStepCopy(data: BookingEmailData): string {
  const start = escapeHtml(formatDate(data.startDate));
  const end = escapeHtml(formatDate(data.endDate));
  if (data.fulfillmentMode === "customer_pickup") {
    return `We'll message you before <strong>${start}</strong> to confirm the pickup time and exact location.`;
  }
  if (data.fulfillmentMode === "delivery_and_collection") {
    return `We'll message you before <strong>${start}</strong> to confirm the delivery window, then coordinate collection for <strong>${end}</strong>.`;
  }
  return `We'll message you before <strong>${start}</strong> to confirm the delivery window.`;
}

function bookingDetailsTable(data: BookingEmailData): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:145px;">Booking ref</td><td style="padding:8px 0;font-weight:700;font-size:14px;font-family:monospace;color:#0e7c73;">${escapeHtml(data.bookingRef)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Item</td><td style="padding:8px 0;font-weight:600;font-size:14px;">${escapeHtml(data.productName)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Dates</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(formatDate(data.startDate))} → ${escapeHtml(formatDate(data.endDate))} (${escapeHtml(data.rentalDays)} days)</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">${fulfillmentLabel(data)}</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(data.deliveryAddress)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Total</td><td style="padding:8px 0;font-weight:700;font-size:16px;">${formatEuros(data.totalCents)}</td></tr>
    </table>
  `;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    await resend.emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `Booking confirmed — ${data.productName} (${data.bookingRef})`,
      html: emailWrapper("Your booking is confirmed", `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">Hi ${escapeHtml(data.customerName)},</p>
        <p style="font-size:15px;color:#374151;line-height:1.6;">Great news — your rental booking is confirmed. Here are the details:</p>
        ${bookingDetailsTable(data)}
        ${infoBox(`<p style="font-size:14px;color:#0f766e;line-height:1.6;margin:0;"><strong>Next step:</strong> ${nextStepCopy(data)}</p>`)}
        <p style="font-size:15px;color:#374151;line-height:1.6;">If you need to change dates, timing, address, or fulfillment details, just reply to this email or message us on WhatsApp.</p>
        ${button(WHATSAPP_URL, "Message us on WhatsApp", "#25d366")}
      `, `Booking ${data.bookingRef} is confirmed for ${data.productName}.`),
    });

    await resend.emails.send({
      from: FROM,
      to: TO_ADMIN,
      replyTo: data.customerEmail,
      subject: `New booking: ${data.productName} — ${data.bookingRef}`,
      html: emailWrapper("New booking received", `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">A new booking has been placed and needs operational review:</p>
        ${bookingDetailsTable(data)}
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Customer</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(data.customerName)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(data.customerEmail)}" style="color:#0e7c73;">${escapeHtml(data.customerEmail)}</a></td></tr>
          ${data.customerPhone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Phone</td><td style="padding:8px 0;font-size:14px;"><a href="tel:${escapeHtml(data.customerPhone)}" style="color:#0e7c73;">${escapeHtml(data.customerPhone)}</a></td></tr>` : ""}
        </table>
        ${button(ADMIN_BOOKINGS_URL, "View in admin dashboard")}
      `, `New booking ${data.bookingRef}.`),
    });

    console.log(`[email] Booking confirmation sent for ${data.bookingRef}`);
    return true;
  } catch (err) {
    console.error("[email] Failed to send booking confirmation:", err);
    return false;
  }
}

export async function sendBookingStatusUpdate(data: BookingEmailData, newStatus: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const isPickup = data.fulfillmentMode === "customer_pickup";
  const isDeliveryAndCollection = data.fulfillmentMode === "delivery_and_collection";
  const statusMessages: Record<string, { subject: string; title: string; message: string }> = {
    confirmed: {
      subject: `Booking confirmed — ${data.productName} (${data.bookingRef})`,
      title: "Your booking is confirmed",
      message: `${nextStepCopy(data)} We'll keep you updated if anything changes.`,
    },
    paid: {
      subject: `Payment received — ${data.productName} (${data.bookingRef})`,
      title: "Payment received",
      message: `Payment is confirmed for your <strong>${escapeHtml(data.productName)}</strong> rental. ${nextStepCopy(data)}`,
    },
    delivering: {
      subject: isPickup ? `Pickup ready — ${data.productName}` : `On its way — ${data.productName}`,
      title: isPickup ? "Your rental is ready for pickup" : "Your rental is on its way",
      message: isPickup
        ? `Your <strong>${escapeHtml(data.productName)}</strong> is ready for pickup at <strong>${escapeHtml(data.deliveryAddress)}</strong>. Please bring booking reference <strong>${escapeHtml(data.bookingRef)}</strong>.`
        : `Your <strong>${escapeHtml(data.productName)}</strong> is on its way to <strong>${escapeHtml(data.deliveryAddress)}</strong>. Please make sure someone is available to receive the delivery.`,
    },
    active: {
      subject: isPickup ? `Picked up — enjoy your ${data.productName}` : `Delivered — enjoy your ${data.productName}`,
      title: isPickup ? "Picked up successfully" : "Delivered successfully",
      message: `Your <strong>${escapeHtml(data.productName)}</strong> rental is now active. Enjoy your time in Valencia — and message us if you need help using anything.`,
    },
    returning: {
      subject: isPickup ? `Return reminder — ${data.productName} (${data.bookingRef})` : `Collection scheduled — ${data.productName} (${data.bookingRef})`,
      title: isPickup ? "Return reminder" : "Collection scheduled",
      message: isPickup
        ? `Your <strong>${escapeHtml(data.productName)}</strong> rental is due back on <strong>${escapeHtml(formatDate(data.endDate))}</strong>. We'll confirm return details directly.`
        : `We've scheduled ${isDeliveryAndCollection ? "collection" : "pickup"} of your <strong>${escapeHtml(data.productName)}</strong> on <strong>${escapeHtml(formatDate(data.endDate))}</strong>. Please have the equipment ready and accessible.`,
    },
    completed: {
      subject: `Rental complete — thank you (${data.bookingRef})`,
      title: "Thanks for renting with us",
      message: `Your rental of <strong>${escapeHtml(data.productName)}</strong> is complete. We hope it made your time in Valencia easier.<br><br>If you're planning another visit, we'd love to help again. And if you have a moment, a review would really help other travellers find us.`,
    },
    cancelled: {
      subject: `Booking cancelled — ${data.bookingRef}`,
      title: "Booking cancelled",
      message: `Your booking for <strong>${escapeHtml(data.productName)}</strong> (${escapeHtml(formatDate(data.startDate))} → ${escapeHtml(formatDate(data.endDate))}) has been cancelled. If a refund is due, it will be processed within 5-10 business days.<br><br>If this was a mistake, please contact us immediately.`,
    },
    refunded: {
      subject: `Refund processed — ${data.bookingRef}`,
      title: "Refund processed",
      message: `A refund of <strong>${formatEuros(data.totalCents)}</strong> has been processed for your booking (${escapeHtml(data.bookingRef)}). It should appear in your account within 5-10 business days, depending on your bank.`,
    },
  };

  const template = statusMessages[newStatus];
  if (!template) {
    console.log(`[email] No email template for status: ${newStatus}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: template.subject,
      html: emailWrapper(template.title, `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">Hi ${escapeHtml(data.customerName)},</p>
        <p style="font-size:15px;color:#374151;line-height:1.6;">${template.message}</p>
        ${bookingDetailsTable(data)}
        <p style="font-size:14px;color:#6b7280;line-height:1.6;">Questions? Reply to this email or reach us on WhatsApp.</p>
        ${button(WHATSAPP_URL, "Message us on WhatsApp", "#25d366")}
      `, template.subject),
    });

    console.log(`[email] Status update (${newStatus}) sent for ${data.bookingRef}`);
    return true;
  } catch (err) {
    console.error(`[email] Failed to send status update (${newStatus}):`, err);
    return false;
  }
}

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const emailSubject = data.productName
    ? `[RentAnything] Enquiry: ${data.productName}`
    : data.subject
      ? `[RentAnything] ${data.subject}`
      : "[RentAnything] New contact form submission";

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: TO_ADMIN,
      replyTo: data.email,
      subject: emailSubject,
      html: emailWrapper("New contact form submission", `
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px;">Name</td><td style="padding:8px 0;font-weight:600;font-size:14px;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(data.email)}" style="color:#0e7c73;">${escapeHtml(data.email)}</a></td></tr>
          ${data.productName ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Product</td><td style="padding:8px 0;font-weight:600;font-size:14px;">${escapeHtml(data.productName)}</td></tr>` : ""}
          ${data.subject ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Subject</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(data.subject)}</td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <div style="font-size:14px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
        ${infoBox(`<p style="font-size:13px;color:#0f766e;margin:0;">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>`)}
      `, `New message from ${data.name}.`),
    });

    return !result.error;
  } catch (err) {
    console.error("[email] Failed to send contact notification:", err);
    return false;
  }
}

export async function sendContactAutoReply(data: ContactEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: "We received your message — RentAnything.es",
      html: emailWrapper("Thanks for reaching out", `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">Hi ${escapeHtml(data.name)},</p>
        <p style="font-size:15px;color:#374151;line-height:1.6;">We've received your message and will get back to you as soon as we can. If it is urgent or related to arrival timing, WhatsApp is usually the fastest way to reach us.</p>
        ${data.productName ? infoBox(`<p style="font-size:14px;color:#0f766e;line-height:1.6;margin:0;"><strong>About:</strong> ${escapeHtml(data.productName)}</p>`) : ""}
        ${button(WHATSAPP_URL, "Message us on WhatsApp", "#25d366")}
      `, "We received your RentAnything.es message."),
    });

    return !result.error;
  } catch (err) {
    console.error("[email] Failed to send contact auto-reply:", err);
    return false;
  }
}

export async function sendSignupWelcome(data: SignupWelcomeEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const name = data.name?.trim() || "there";

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: "Welcome to RentAnything.es",
      html: emailWrapper("Welcome to RentAnything.es", `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">Hi ${escapeHtml(name)},</p>
        <p style="font-size:15px;color:#374151;line-height:1.6;">Thanks for signing up. We'll send useful Valencia stay tips, new kit launches, and practical updates when new inventory becomes available.</p>
        ${data.interest ? infoBox(`<p style="font-size:14px;color:#0f766e;line-height:1.6;margin:0;"><strong>Your interest:</strong> ${escapeHtml(data.interest)}</p>`) : ""}
        <p style="font-size:15px;color:#374151;line-height:1.6;">In the meantime, if you need something specific for a Valencia stay, just message us.</p>
        ${button(WHATSAPP_URL, "Ask us on WhatsApp", "#25d366")}
      `, "Thanks for signing up for RentAnything.es."),
    });

    return !result.error;
  } catch (err) {
    console.error("[email] Failed to send signup welcome:", err);
    return false;
  }
}

export async function sendEmailHealthCheck(): Promise<{ ok: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: TO_ADMIN,
      subject: "RentAnything email health check",
      html: emailWrapper("Email health check", `
        <p style="font-size:15px;color:#374151;line-height:1.6;margin-top:0;">This is a test email from RentAnything.es.</p>
        <p style="font-size:14px;color:#6b7280;line-height:1.6;">If you received this, Resend accepted the message from the current environment.</p>
      `),
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }

    return { ok: true, id: result.data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
