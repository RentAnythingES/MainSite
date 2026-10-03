import type { Locale } from "@/i18n/config";

/** Original page content, translated without changing its rendering or structure. */
const copy = {
  "en": [
    "Refunds & Cancellations",
    "Last updated: June 2026",
    "Our Promise",
    "We want you to book with confidence. That's why we offer free cancellation up to 48 hours before your scheduled delivery.",
    "Cancellation Policy",
    "Full Refund",
    "48+ hours before delivery",
    "Partial Refund",
    "24–48 hours before",
    "No Refund",
    "Less than 24 hours",
    "Deposits and damage",
    "Our current online checkout does not automatically add a security deposit. If a future rental requires one, the amount, authorization method, return conditions, and any proposed deduction will be disclosed clearly before payment and documented with you.",
    "How to Cancel",
    "You can cancel your booking via:",
    "WhatsApp — fastest response",
    "Email to",
    "hello@rentandroll.com",
    "The contact form on our",
    "Contact page",
    "Refund Processing",
    "Refunds are processed to the original payment method. Please allow 5–10 business days for the refund to appear on your statement, depending on your bank or card issuer."
  ],
  "es": [
    "Reembolsos y cancelaciones",
    "Última actualización: julio de 2026",
    "Nuestro compromiso",
    "Queremos que reserves con confianza. Por eso ofrecemos cancelación gratuita hasta 48 horas antes del momento previsto de entrega o recogida.",
    "Política de cancelación",
    "Reembolso completo",
    "48 horas o más antes",
    "Reembolso parcial",
    "Entre 24 y 48 horas antes",
    "Sin reembolso",
    "Menos de 24 horas antes",
    "Fianzas y daños",
    "Nuestro proceso de pago online actual no añade una fianza automáticamente. Si en el futuro un alquiler requiere una, comunicaremos claramente el importe, el método de autorización, las condiciones de devolución y cualquier deducción propuesta antes del pago.",
    "Cómo cancelar",
    "Puedes solicitar la cancelación mediante:",
    "WhatsApp, normalmente la vía más rápida",
    "Correo electrónico a",
    "hello@rentandroll.com",
    "El formulario de nuestra",
    "página de contacto",
    "Plazo del reembolso",
    "Procesamos el reembolso al método de pago original. Dependiendo del banco o emisor de la tarjeta, puede tardar entre 5 y 10 días laborables en aparecer en el extracto."
  ],
  "de": [
    "Erstattungen und Stornierungen",
    "Letzte Aktualisierung: Juni 2026",
    "Unser Versprechen",
    "Du sollst mit einem guten Gefühl buchen können. Deshalb kannst du bis 48 Stunden vor deiner geplanten Lieferung kostenlos stornieren.",
    "Stornierungsbedingungen",
    "Vollständige Erstattung",
    "Mindestens 48 Stunden vor der Lieferung",
    "Teilweise Erstattung",
    "24 bis 48 Stunden vorher",
    "Keine Erstattung",
    "Weniger als 24 Stunden vorher",
    "Kaution und Schäden",
    "Unsere aktuelle Onlinebuchung fügt keine Kaution automatisch hinzu. Sollte künftig für eine Vermietung eine Kaution erforderlich sein, werden dir der Betrag, die Art der Autorisierung, die Rückgabebedingungen und jeder vorgeschlagene Abzug vor der Zahlung klar mitgeteilt und mit dir dokumentiert.",
    "So stornierst du",
    "Du kannst deine Buchung auf diesen Wegen stornieren:",
    "WhatsApp – hier antworten wir am schnellsten",
    "E-Mail an",
    "hello@rentandroll.com",
    "Über das Formular auf unserer",
    "Kontaktseite",
    "Bearbeitung von Erstattungen",
    "Erstattungen erfolgen auf die ursprüngliche Zahlungsmethode. Je nach Bank oder Kartenanbieter kann es 5 bis 10 Werktage dauern, bis die Erstattung auf deinem Kontoauszug erscheint."
  ]
} as const;

export function getRefundsPageBodyCopy(locale: Locale) { return (index: number): string => {
  const text: string | undefined = copy[locale][index];
  if (text === undefined) throw new Error("Missing refunds copy for " + locale + ":" + index);
  return text;
}; }
