import type { BookingEmailData, BookingDocumentEmailData } from "./email";
import { storedBookingLocale } from "./booking-locale";
import { localeRegistry } from "@/i18n/config";
import { transactionCopy, transactionService } from "@/i18n/transaction";
import { SITE_IDENTITY } from "@/config/site";
const escape = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function renderDocumentMessage(data: BookingDocumentEmailData) {
  const locale = storedBookingLocale(data.locale);
  const t = transactionCopy[locale];
  const html = `<html lang="${locale}"><body style="font-family:Arial,sans-serif;color:#1f2937"><main style="max-width:620px;margin:auto;padding:24px"><p>${escape(SITE_IDENTITY.brandName)}</p><h1>${escape(t.documents)}</h1><p>${escape(t.greeting)} ${escape(data.customerName)},</p><p>${escape(t.ref)}: ${escape(data.bookingRef)}</p><p>${escape(t.item)}: ${escape(data.productName)}</p><p><a href="${escape(data.documentUrl)}">${escape(t.document)} ${escape(data.documentNumber || "")}</a></p><p>${escape(t.help)}</p><a href="https://wa.me/34684708013">${escape(t.whatsapp)}</a></main></body></html>`;
  return { subject: `${t.documents} — ${data.bookingRef}`, html };
}

/** Pure rendering: no network, no internal operational notes, and escaped values. */
export function renderBookingMessage(
  data: BookingEmailData,
  status = "confirmed",
) {
  const locale = storedBookingLocale(data.locale);
  const t = transactionCopy[locale];
  const titles: Record<string, string> = {
    confirmed: t.confirmed,
    paid: t.paid,
    delivering:
      data.fulfillmentMode === "customer_pickup" ? t.pickupReady : t.delivering,
    active: t.active,
    returning: t.returning,
    completed: t.completed,
    cancelled: t.cancelled,
    refunded: t.refunded,
    rejected_refunded: t.rejected_refunded,
    partially_refunded: t.partially_refunded,
  };
  if (!titles[status]) return null;
  const pending = status === "confirmed" && data.pendingTeamConfirmation;
  const title = pending ? t.paid : titles[status];
  const intro = pending
    ? t.pendingNotice
    : status === "confirmed"
      ? t.confirmedBody
      : status === "paid"
        ? t.paidStatus
        : titles[status];
  const format = (value: string) =>
    new Intl.DateTimeFormat(localeRegistry[locale].format, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: data.timezone || "Europe/Madrid",
    }).format(new Date(value));
  const money = (cents: number) =>
    new Intl.NumberFormat(localeRegistry[locale].format, {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  const rows = [
    [t.ref, data.bookingRef],
    [t.item, data.productName],
    [t.quantity, data.quantity || 1],
    [
      t.dates,
      `${format(data.rentalStartAt || data.startDate)} → ${format(data.rentalEndAt || data.endDate)} (${data.timezone || "Europe/Madrid"})`,
    ],
    [
      t.service,
      transactionService(
        locale,
        data.fulfillmentMode || "delivery_only",
        data.deliveryType,
      ),
    ],
    // Older drafts store this generated English prefix alongside the location.
    [t.instructions, data.deliveryAddress.replace(/^Customer pickup(?=,|$)/, t.pickup)],
    [t.total, money(data.totalCents)],
  ];
  if (data.fulfillmentBaseFeeCents !== undefined)
    rows.push([t.fee, money(data.fulfillmentBaseFeeCents)]);
  if (data.expressSurchargeCents)
    rows.push([t.surcharge, money(data.expressSurchargeCents)]);
  if (["refunded", "rejected_refunded", "partially_refunded"].includes(status))
    rows.push([
      t.refund,
      money(
        status === "partially_refunded"
          ? data.refundAmountCents || 0
          : data.totalCents,
      ),
    ]);
  const documents = (data.documentLinks || [])
    .map(
      (link) =>
        `<li><a href="${escape(link.url)}">${escape(t.document)} ${escape(link.documentNumber || "")}</a></li>`,
    )
    .join("");
  const custom = (data.customQuoteLines || [])
    .map(
      (line) =>
        `<li>${escape(line.description)}: ${escape(money(line.amountCents))}</li>`,
    )
    .join("");
  const html = `<html lang="${locale}"><body style="font-family:Arial,sans-serif;color:#1f2937"><main style="max-width:620px;margin:auto;padding:24px"><p>${escape(SITE_IDENTITY.brandName)}</p><h1>${escape(title)}</h1><p>${escape(t.greeting)} ${escape(data.customerName)},</p><p>${escape(intro)}</p><table>${rows.map(([label, value]) => `<tr><th style="text-align:left;padding:8px">${escape(label)}</th><td style="padding:8px">${escape(value)}</td></tr>`).join("")}</table>${custom ? `<ul>${custom}</ul>` : ""}${data.customTerms ? `<h2>${escape(t.conditions)}</h2><p>${escape(data.customTerms)}</p>` : ""}${!pending && ["confirmed", "paid"].includes(status) ? `<p>${escape(t.next)}</p>` : ""}${data.customerInstructions ? `<h2>${escape(t.instructions)}</h2><p>${escape(data.customerInstructions)}</p>` : ""}${documents ? `<h2>${escape(t.documents)}</h2><ul>${documents}</ul>` : ""}${data.reviewUrl ? `<p>${escape(t.feedbackBody)}</p><a href="${escape(data.reviewUrl)}">${escape(t.feedback)}</a>` : ""}<p>${escape(t.help)}</p><a href="https://wa.me/34684708013">${escape(t.whatsapp)}</a><p>${escape(SITE_IDENTITY.legalName)} · Valencia</p></main></body></html>`;
  return { subject: `${title} — ${data.bookingRef}`, html };
}
