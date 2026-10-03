import type { Locale } from "@/i18n/config";

/** Original page content, translated without changing its rendering or structure. */
const copy = {
  "en": [
    "Contact Rent&Roll",
    "Ask about an item, an existing booking, a custom rental or a local partnership in Valencia.",
    "WhatsApp",
    "Direct help with dates, products and active bookings",
    "Open WhatsApp →",
    "Email",
    "Useful for detailed requests and partnerships",
    "hello@rentandroll.com",
    "Valencia, Spain",
    "Escalera Labs S.L.",
    "Available pickup options appear during booking",
    "Send us a message"
  ],
  "es": [
    "Contacta con Rent&Roll",
    "Pregúntanos sobre un artículo, una reserva, una solicitud especial o una colaboración local en Valencia.",
    "WhatsApp",
    "Ayuda directa con fechas, productos y reservas activas",
    "Abrir WhatsApp →",
    "Correo electrónico",
    "Para solicitudes detalladas y colaboraciones",
    "hello@rentandroll.com",
    "Valencia, España",
    "Escalera Labs S.L.",
    "Las opciones de recogida disponibles aparecen al reservar",
    "Envíanos un mensaje"
  ],
  "de": [
    "Kontakt zu Rent&Roll",
    "Frag uns zu einem Artikel, einer bestehenden Buchung, einer individuellen Miete oder einer lokalen Partnerschaft in Valencia.",
    "WhatsApp",
    "Direkte Hilfe zu Mietdaten, Produkten und bestehenden Buchungen",
    "WhatsApp öffnen →",
    "E-Mail",
    "Für ausführliche Anfragen und Partnerschaften",
    "hello@rentandroll.com",
    "Valencia, Spanien",
    "Escalera Labs S.L.",
    "Die verfügbaren Abholorte siehst du bei der Buchung",
    "Schreib uns eine Nachricht"
  ]
} as const;

export function getContactPageBodyCopy(locale: Locale) { return (index: number): string => {
  const text: string | undefined = copy[locale][index];
  if (text === undefined) throw new Error("Missing contact copy for " + locale + ":" + index);
  return text;
}; }
