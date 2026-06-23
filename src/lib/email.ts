import { Resend } from "resend";

/**
 * Transactional email service for booking lifecycle events.
 *
 * Sends via Resend. All emails use the same branded template style
 * as the contact form (teal gradient header, neutral body).
 *
 * Required env:
 *   RESEND_API_KEY   — Resend API key
 *   CONTACT_EMAIL    — Admin notification recipient (default: hello@rentanything.es)
 *   FROM_EMAIL       — Sender address (default: RentAnything <noreply@rentanything.es>)
 */

const TO_ADMIN = process.env.CONTACT_EMAIL || "hello@rentanything.es";
const FROM = process.env.FROM_EMAIL || "RentAnything <noreply@rentanything.es>";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — emails disabled");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// ============================================
// Booking data interface
// ============================================
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
}

// ============================================
// Shared template components
// ============================================
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

function emailWrapper(title: string, body: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">${title}</h1>
      </div>
      <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        ${body}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          RentAnything.es · Escalera Labs S.L. · Valencia, Spain
        </p>
      </div>
    </div>
  `;
}

function bookingDetailsTable(data: BookingEmailData): string {
  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Booking ref</td>
        <td style="padding: 8px 0; font-weight: 700; font-size: 14px; font-family: monospace; color: #0d9488;">${data.bookingRef}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Item</td>
        <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${data.productName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Dates</td>
        <td style="padding: 8px 0; font-size: 14px;">${formatDate(data.startDate)} → ${formatDate(data.endDate)} (${data.rentalDays} days)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Delivery</td>
        <td style="padding: 8px 0; font-size: 14px;">${data.deliveryAddress}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total</td>
        <td style="padding: 8px 0; font-weight: 700; font-size: 16px;">${formatEuros(data.totalCents)}</td>
      </tr>
    </table>
  `;
}

// ============================================
// Email templates
// ============================================

/**
 * Send booking confirmation to customer + admin notification
 * Triggered: when booking is created (or payment confirmed via Stripe)
 */
export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    // 1. Customer confirmation
    await resend.emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `Booking Confirmed — ${data.productName} (${data.bookingRef})`,
      html: emailWrapper("Your Booking Is Confirmed! ✅", `
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 0;">
          Hi ${data.customerName},
        </p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Great news — your rental booking is confirmed. Here are the details:
        </p>
        ${bookingDetailsTable(data)}
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          We'll deliver to your address on <strong>${formatDate(data.startDate)}</strong>.
          We'll send you a message the day before to confirm the delivery window.
        </p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          If you need to make any changes, just reply to this email or reach us on WhatsApp.
        </p>
        <a href="https://wa.me/34600000000" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
          💬 WhatsApp Us
        </a>
      `),
    });

    // 2. Admin notification
    await resend.emails.send({
      from: FROM,
      to: TO_ADMIN,
      replyTo: data.customerEmail,
      subject: `🆕 New Booking: ${data.productName} — ${data.bookingRef}`,
      html: emailWrapper("New Booking Received", `
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 0;">
          A new booking has been placed:
        </p>
        ${bookingDetailsTable(data)}
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Customer</td>
            <td style="padding: 8px 0; font-size: 14px;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${data.customerEmail}" style="color: #0d9488;">${data.customerEmail}</a></td>
          </tr>
          ${data.customerPhone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${data.customerPhone}" style="color: #0d9488;">${data.customerPhone}</a></td>
          </tr>
          ` : ""}
        </table>
        <a href="https://rentanything.es/admin/bookings" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          View in Admin Dashboard →
        </a>
      `),
    });

    console.log(`[email] Booking confirmation sent for ${data.bookingRef}`);
    return true;
  } catch (err) {
    console.error("[email] Failed to send booking confirmation:", err);
    return false;
  }
}

/**
 * Send status update to customer
 * Triggered: when admin transitions booking status
 */
export async function sendBookingStatusUpdate(
  data: BookingEmailData,
  newStatus: string
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const statusMessages: Record<string, { subject: string; title: string; message: string }> = {
    delivering: {
      subject: `On Its Way! Your ${data.productName} is being delivered`,
      title: "Your Rental Is On Its Way! 🚚",
      message: `Your <strong>${data.productName}</strong> is on its way to <strong>${data.deliveryAddress}</strong>. We'll be there shortly — please make sure someone is available to receive the delivery.`,
    },
    active: {
      subject: `Delivered! Enjoy your ${data.productName}`,
      title: "Delivered Successfully! 🎉",
      message: `Your <strong>${data.productName}</strong> has been delivered. Enjoy! If you have any questions about using the equipment, don't hesitate to reach out.`,
    },
    returning: {
      subject: `Pickup Scheduled — ${data.productName} (${data.bookingRef})`,
      title: "Pickup Scheduled 📦",
      message: `We've scheduled the pickup of your <strong>${data.productName}</strong> on <strong>${formatDate(data.endDate)}</strong>. Please have the equipment ready and accessible. We'll send a message to confirm the pickup window.`,
    },
    completed: {
      subject: `Rental Complete — Thank you! (${data.bookingRef})`,
      title: "Thank You! 🙏",
      message: `Your rental of <strong>${data.productName}</strong> is complete. We hope it made your time in Valencia easier!<br><br>If you're planning another visit, we'd love to help again. And if you have a moment, we'd really appreciate a review — it helps other families find us.`,
    },
    cancelled: {
      subject: `Booking Cancelled — ${data.bookingRef}`,
      title: "Booking Cancelled",
      message: `Your booking for <strong>${data.productName}</strong> (${formatDate(data.startDate)} → ${formatDate(data.endDate)}) has been cancelled. If a refund is due, it will be processed within 5-10 business days.<br><br>If this was a mistake, please contact us immediately.`,
    },
    refunded: {
      subject: `Refund Processed — ${data.bookingRef}`,
      title: "Refund Processed 💰",
      message: `A refund of <strong>${formatEuros(data.totalCents)}</strong> has been processed for your booking (${data.bookingRef}). It should appear in your account within 5-10 business days, depending on your bank.`,
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
        <p style="font-size: 15px; color: #374151; line-height: 1.6; margin-top: 0;">
          Hi ${data.customerName},
        </p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          ${template.message}
        </p>
        ${bookingDetailsTable(data)}
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          Questions? Reply to this email or reach us on WhatsApp.
        </p>
        <a href="https://wa.me/34600000000" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
          💬 WhatsApp Us
        </a>
      `),
    });

    console.log(`[email] Status update (${newStatus}) sent for ${data.bookingRef}`);
    return true;
  } catch (err) {
    console.error(`[email] Failed to send status update (${newStatus}):`, err);
    return false;
  }
}
