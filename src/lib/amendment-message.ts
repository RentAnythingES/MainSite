import type { FulfillmentAmendmentEmailData } from "./email";
import { storedBookingLocale } from "./booking-locale";
import { amendmentCopy, quoteDate, quoteMoney } from "@/i18n/private-quotes";
import { SITE_IDENTITY } from "@/config/site";

const copy = {
  en: { subject: "Transport quote", confirmed: "Transport confirmed", title: "Transport option for your booking", intro: "Here is the transport option prepared for your rental.", review: "Review and pay securely", unchanged: "Your original booking remains unchanged unless this transport quote is paid.", timing: "We will confirm the exact operational timing separately.", invoice: "Download transport invoice", whatsapp: "Message us on WhatsApp", country: "Spain" },
  es: { subject: "Presupuesto de transporte", confirmed: "Transporte confirmado", title: "Opción de transporte para tu reserva", intro: "Esta es la opción de transporte preparada para tu alquiler.", review: "Revisar y pagar de forma segura", unchanged: "Tu reserva original no cambia hasta que se pague este presupuesto de transporte.", timing: "Confirmaremos el horario exacto por separado.", invoice: "Descargar factura de transporte", whatsapp: "Escríbenos por WhatsApp", country: "España" },
  de: { subject: "Transportangebot", confirmed: "Transport bestätigt", title: "Transport für deine Buchung", intro: "Hier findest du das Transportangebot für deine Miete.", review: "Prüfen und sicher bezahlen", unchanged: "Deine ursprüngliche Buchung bleibt unverändert, solange dieses Transportangebot nicht bezahlt ist.", timing: "Die genauen Zeiten bestätigen wir gesondert.", invoice: "Transportrechnung herunterladen", whatsapp: "Über WhatsApp schreiben", country: "Spanien" },
};
const escape = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);

/** Pure renderer; saved language, amounts and addresses are preserved. */
export function renderAmendmentMessage(data: FulfillmentAmendmentEmailData, confirmed = false) {
  const locale = storedBookingLocale(data.locale);
  const text = copy[locale]; const labels = amendmentCopy[locale];
  const title = confirmed ? text.confirmed : text.title;
  const amountLabel = confirmed ? { en: "Paid", es: "Pagado", de: "Bezahlt" }[locale] : labels.total;
  const service = data.fulfillmentMode === "delivery_and_collection" ? labels.both : labels.deliveryOnly;
  const row = (label: string, value: unknown) => `<tr><th style="text-align:left;padding:8px">${escape(label)}</th><td style="padding:8px">${escape(value)}</td></tr>`;
  const link = (url: string, label: string) => `<p><a href="${escape(url)}">${escape(label)}</a></p>`;
  const body = `<p>${escape(labels.greeting)} ${escape(data.customerName)},</p><p>${escape(confirmed ? labels.received : text.intro)}</p><table style="width:100%;border-collapse:collapse">${row(labels.booking, data.bookingRef)}${row(labels.rental, data.productName)}${row(labels.service, service)}${row(labels.delivery, data.deliveryAddress)}${data.collectionAddress ? row(labels.collection, data.collectionAddress) : ""}${row(amountLabel, quoteMoney(data.totalCents, "eur", locale))}</table>`;
  const action = confirmed ? `<p>${escape(text.timing)}</p>${data.documentUrl ? link(data.documentUrl, text.invoice) : ""}${link("https://wa.me/34684708013", text.whatsapp)}` : `${link(data.customerUrl, text.review)}${data.expiresAt ? `<p>${escape(labels.expiry)} ${escape(quoteDate(data.expiresAt, locale))}.</p>` : ""}<p>${escape(text.unchanged)}</p>`;
  return { subject: `${confirmed ? text.confirmed : text.subject} — ${data.bookingRef}`, html: `<html lang="${locale}"><body style="font-family:Arial,sans-serif;color:#1f2937"><main style="max-width:620px;margin:auto;padding:24px"><h1 style="color:#0e7c73">${escape(title)}</h1>${body}${action}<hr><p style="font-size:12px">${escape(SITE_IDENTITY.brandName)} · ${escape(SITE_IDENTITY.legalName)} · Valencia, ${text.country}</p></main></body></html>` };
}
