import type { Locale } from "@/i18n/config";

export const bundleConfiguratorCopy = {
  en: {
    badge: "Build your request", title: "Configure this kit", intro: "This is the first version of bundle configurability. It does not reserve inventory yet; it creates a structured request so we can confirm the best available setup directly.",
    startDate: "Start date", endDate: "End date", area: "Accommodation area", areaPlaceholder: "e.g. Ruzafa, Patacona, Paterna, hotel name, Airbnb area",
    included: "Included items", addons: "Optional add-ons", notes: "Anything we should know?", notesPlaceholder: "Child ages, lift access, apartment constraints, delivery timing, special requests...",
    reply: "Where should we reply?", name: "Name", email: "Email", phone: "WhatsApp number", optional: "(optional)", consentBefore: "I agree that Rent&Roll may use these details to answer and manage my kit request. See our", privacy: "privacy policy",
    summary: "Request summary", dates: "Dates", unsure: "Not sure yet", selected: "Items selected", includedCount: "included", addonCount: "add-ons", next: "Next step", nextText: "We confirm stock, substitutions, delivery/collection, and pricing directly.",
    checking: "Checking inventory…", check: "Check known inventory", inventory: "Inventory check", available: "Known items available", unavailable: "Substitution needed", partial: "Partly confirmed", lineAvailable: "Available", lineUnavailable: "Unavailable", staffCheck: "Staff check",
    estimate: "Known-item rental estimate", estimateNote: "Staff confirm alternatives, delivery and final kit pricing.", directWhatsapp: "If it continues, message us directly on WhatsApp.", saved: "Request saved as", saving: "Saving request…", submit: "Save request & open WhatsApp", footer: "We save your choices first, then open WhatsApp. No payment is taken until availability and pricing are confirmed.",
    availabilityError: "Could not check availability", submitError: "Could not save your request",
  },
  es: {
    badge: "Prepara tu solicitud", title: "Configura este kit", intro: "Esta primera versión no reserva el inventario. Guarda una solicitud estructurada para que podamos confirmar directamente la mejor combinación disponible.",
    startDate: "Fecha de inicio", endDate: "Fecha de fin", area: "Zona del alojamiento", areaPlaceholder: "p. ej., Ruzafa, Patacona, Paterna, nombre del hotel o zona del apartamento",
    included: "Artículos incluidos", addons: "Extras opcionales", notes: "¿Hay algo que debamos saber?", notesPlaceholder: "Edades, acceso en ascensor, limitaciones del alojamiento, horario o solicitudes especiales...",
    reply: "¿Dónde debemos responder?", name: "Nombre", email: "Correo electrónico", phone: "Número de WhatsApp", optional: "(opcional)", consentBefore: "Acepto que Rent&Roll utilice estos datos para responder y gestionar mi solicitud. Consulta nuestra", privacy: "política de privacidad",
    summary: "Resumen de la solicitud", dates: "Fechas", unsure: "Por confirmar", selected: "Artículos seleccionados", includedCount: "incluidos", addonCount: "extras", next: "Siguiente paso", nextText: "Confirmamos directamente el stock, las sustituciones, la entrega o recogida y el precio.",
    checking: "Comprobando inventario…", check: "Comprobar inventario conocido", inventory: "Comprobación de inventario", available: "Artículos conocidos disponibles", unavailable: "Hace falta una sustitución", partial: "Confirmación parcial", lineAvailable: "Disponible", lineUnavailable: "No disponible", staffCheck: "Revisión manual",
    estimate: "Estimación de artículos conocidos", estimateNote: "Nuestro equipo confirma alternativas, entrega y precio final del kit.", directWhatsapp: "Si continúa, escríbenos directamente por WhatsApp.", saved: "Solicitud guardada como", saving: "Guardando solicitud…", submit: "Guardar y abrir WhatsApp", footer: "Primero guardamos tus elecciones y después abrimos WhatsApp. No se cobra nada hasta confirmar disponibilidad y precio.",
    availabilityError: "No se pudo comprobar la disponibilidad", submitError: "No se pudo guardar la solicitud",
  },
  de: {
    badge: "Deine Anfrage", title: "Paket zusammenstellen", intro: "Wähle die Artikel für deinen Aufenthalt. Deine Anfrage reserviert noch keinen Bestand. Wir bestätigen die passende Zusammenstellung, Verfügbarkeit und den Preis persönlich.",
    startDate: "Mietbeginn", endDate: "Mietende", area: "Lage deiner Unterkunft", areaPlaceholder: "Zum Beispiel Ruzafa, Patacona, Paterna, Hotelname oder Stadtteil",
    included: "Artikel im Paket", addons: "Optionale Ergänzungen", notes: "Was sollten wir noch wissen?", notesPlaceholder: "Alter der Kinder, Aufzug, Besonderheiten der Unterkunft, Lieferzeit oder andere Wünsche …",
    reply: "Wie können wir dir antworten?", name: "Name", email: "E-Mail-Adresse", phone: "WhatsApp-Nummer", optional: "(optional)", consentBefore: "Ich bin damit einverstanden, dass Rent&Roll diese Angaben verwendet, um meine Paketanfrage zu beantworten und zu bearbeiten. Weitere Informationen findest du in unserer", privacy: "Datenschutzerklärung",
    summary: "Deine Anfrage im Überblick", dates: "Mietzeitraum", unsure: "Noch offen", selected: "Ausgewählte Artikel", includedCount: "aus dem Paket", addonCount: "Ergänzungen", next: "So geht es weiter", nextText: "Wir bestätigen Bestand, mögliche Alternativen, Lieferung oder Abholung und den Preis persönlich.",
    checking: "Bestand wird geprüft …", check: "Erfassten Bestand prüfen", inventory: "Bestandsprüfung", available: "Erfasste Artikel verfügbar", unavailable: "Alternative erforderlich", partial: "Teilweise bestätigt", lineAvailable: "Verfügbar", lineUnavailable: "Nicht verfügbar", staffCheck: "Persönliche Prüfung",
    estimate: "Mietschätzung für erfasste Artikel", estimateNote: "Unser Team bestätigt Alternativen, Lieferung und den Gesamtpreis des Pakets.", directWhatsapp: "Falls das Problem bestehen bleibt, schreib uns über WhatsApp.", saved: "Anfrage gespeichert unter", saving: "Anfrage wird gespeichert …", submit: "Anfrage speichern und WhatsApp öffnen", footer: "Wir speichern zunächst deine Auswahl und öffnen danach WhatsApp. Erst nach Bestätigung von Verfügbarkeit und Preis folgt die Zahlung.",
    availabilityError: "Die Verfügbarkeit konnte nicht geprüft werden.", submitError: "Deine Anfrage konnte nicht gespeichert werden.",
  },
} as const;

export const bundleConsentVersion = "kit-request-2026-09-29";
export function bundleConsentText(locale: Locale) {
  const text = bundleConfiguratorCopy[locale];
  return text.consentBefore + " " + text.privacy + ".";
}
