import type { Locale } from "./config";
const en = {
  loading: "Loading your booking…",
  confirmed: "Booking confirmed",
  paid: "Payment received",
  pending: "Payment is still pending",
  incomplete: "Payment not completed",
  unknown: "We could not load your booking",
  confirmedBody:
    "Your booking is confirmed. We will contact you to arrange the next step.",
  paidBody:
    "We received your payment. Your booking is awaiting confirmation. Please do not pay again.",
  pendingBody:
    "Your payment is not yet confirmed. Check its status before trying again.",
  incompleteBody:
    "We could not confirm a completed payment. Contact us if you have been charged.",
  unknownBody:
    "Check your confirmation email or contact us with your booking reference.",
  ref: "Booking reference",
  item: "Item",
  quantity: "Quantity",
  dates: "Rental period",
  service: "Service",
  total: "Total",
  fee: "Fulfillment fee",
  surcharge: "Express surcharge",
  pickup: "Customer pickup",
  delivery: "Delivery",
  roundtrip: "Delivery and collection",
  express: "Express delivery",
  standard: "Standard delivery",
  rental: "rental",
  unit: "unit(s)",
  to: "to",
  home: "Home",
  contact: "Contact us",
  calendar: "Add to calendar",
  maps: "Open in Google Maps",
  localTime: "Local time",
  emailNotice: "Booking updates are sent to your email address.",
  release: "Releasing your dates…",
  releaseBody:
    "You will return to the product when the temporary reservation has been released.",
  releaseError: "We could not release your checkout",
  releaseErrorBody:
    "Please try again or contact us. Your temporary reservation will expire automatically.",
  returnProduct: "Return to the product",
  greeting: "Hello",
  help: "Reply to this email or contact us on WhatsApp if you need help.",
  whatsapp: "Contact us on WhatsApp",
  next: "We will contact you to confirm the handover details.",
  pendingNotice:
    "Our team must confirm this short-notice booking. If we cannot confirm it, your payment will be refunded in full to the original payment method.",
  details: "Booking details",
  documents: "Your documents",
  document: "Open document",
  conditions: "Agreed conditions",
  instructions: "Handover instructions",
  feedback: "Share your feedback",
  feedbackBody:
    "Only share what you want to make public. Publication requires your consent.",
  paidStatus: "Your payment has been received.",
  delivering:
    "Your rental is on its way. Please make sure someone can receive it.",
  pickupReady: "Your rental is ready for pickup. Bring your booking reference.",
  active: "Your rental has started. Contact us if you need help.",
  returning:
    "Your rental is due to end. We will confirm the return arrangements.",
  completed: "Your rental is complete. Thank you for renting with us.",
  cancelled:
    "Your booking has been cancelled. Contact us if this was unexpected.",
  refunded:
    "Your refund has been processed. The time it takes to appear depends on your bank.",
  rejected_refunded:
    "We could not confirm your booking. Your payment has been refunded in full.",
  partially_refunded:
    "A partial refund has been processed. Your booking remains active.",
  refund: "Refund amount",
  statusTitle: "Booking update",
  extra: "Extra service",
  assembly: "Assembly and setup",
  disassembly: "Disassembly",
  supportLanguage:
    "Contact us; language availability will be confirmed by our team.",
};
type Copy = { [K in keyof typeof en]: string };
const es: Copy = {
  loading: "Cargando tu reserva…",
  confirmed: "Reserva confirmada",
  paid: "Pago recibido",
  pending: "Pago pendiente",
  incomplete: "Pago no completado",
  unknown: "No hemos podido cargar tu reserva",
  confirmedBody:
    "Tu reserva está confirmada. Te contactaremos para organizar el siguiente paso.",
  paidBody:
    "Hemos recibido tu pago. Tu reserva está pendiente de confirmación. No vuelvas a pagar.",
  pendingBody:
    "Tu pago aún no está confirmado. Comprueba su estado antes de intentarlo de nuevo.",
  incompleteBody:
    "No hemos podido confirmar el pago. Contáctanos si se te ha cobrado.",
  unknownBody:
    "Consulta el correo de confirmación o contáctanos con tu referencia.",
  ref: "Referencia",
  item: "Artículo",
  quantity: "Cantidad",
  dates: "Periodo de alquiler",
  service: "Servicio",
  total: "Total",
  fee: "Coste del servicio",
  surcharge: "Suplemento exprés",
  pickup: "Recogida por el cliente",
  delivery: "Entrega",
  roundtrip: "Entrega y recogida",
  express: "Entrega exprés",
  standard: "Entrega estándar",
  rental: "alquiler",
  unit: "unidad(es)",
  to: "a",
  home: "Inicio",
  contact: "Contactar",
  calendar: "Añadir al calendario",
  maps: "Abrir en Google Maps",
  localTime: "Hora local",
  emailNotice: "Las novedades de tu reserva se envían a tu correo.",
  release: "Liberando tus fechas…",
  releaseBody: "Volverás al producto cuando se libere la reserva temporal.",
  releaseError: "No hemos podido liberar el pago",
  releaseErrorBody:
    "Inténtalo de nuevo o contáctanos. La reserva temporal caducará automáticamente.",
  returnProduct: "Volver al producto",
  greeting: "Hola",
  help: "Responde a este correo o contáctanos por WhatsApp si necesitas ayuda.",
  whatsapp: "Contactar por WhatsApp",
  next: "Te contactaremos para confirmar los detalles de la entrega o recogida.",
  pendingNotice:
    "Nuestro equipo debe confirmar esta reserva de última hora. Si no podemos confirmarla, se devolverá el importe completo al método de pago original.",
  details: "Detalles de la reserva",
  documents: "Tus documentos",
  document: "Abrir documento",
  conditions: "Condiciones acordadas",
  instructions: "Instrucciones de entrega o recogida",
  feedback: "Compartir tu opinión",
  feedbackBody:
    "Comparte solo lo que quieras hacer público. La publicación requiere tu consentimiento.",
  paidStatus: "Hemos recibido tu pago.",
  delivering:
    "Tu artículo está en camino. Asegúrate de que alguien pueda recibirlo.",
  pickupReady:
    "Tu artículo está listo para recoger. Lleva la referencia de reserva.",
  active: "Tu alquiler ha comenzado. Contáctanos si necesitas ayuda.",
  returning:
    "Tu alquiler está a punto de finalizar. Confirmaremos los detalles de devolución.",
  completed: "Tu alquiler ha finalizado. Gracias por confiar en nosotros.",
  cancelled: "Tu reserva se ha cancelado. Contáctanos si no lo esperabas.",
  refunded: "Tu reembolso se ha procesado. El plazo depende de tu banco.",
  rejected_refunded:
    "No hemos podido confirmar tu reserva. Se ha reembolsado el importe completo.",
  partially_refunded:
    "Se ha procesado un reembolso parcial. Tu reserva sigue activa.",
  refund: "Importe reembolsado",
  statusTitle: "Actualización de tu reserva",
  extra: "Servicio adicional",
  assembly: "Montaje",
  disassembly: "Desmontaje",
  supportLanguage:
    "Contáctanos; nuestro equipo confirmará el idioma de atención.",
};
const de: Copy = {
  loading: "Deine Buchung wird geladen…",
  confirmed: "Buchung bestätigt",
  paid: "Zahlung erhalten",
  pending: "Zahlung noch offen",
  incomplete: "Zahlung nicht abgeschlossen",
  unknown: "Deine Buchung konnte nicht geladen werden",
  confirmedBody:
    "Deine Buchung ist bestätigt. Wir melden uns bei dir, um die nächsten Schritte abzustimmen.",
  paidBody:
    "Wir haben deine Zahlung erhalten. Deine Buchung muss noch bestätigt werden. Bitte bezahle nicht erneut.",
  pendingBody:
    "Deine Zahlung ist noch nicht bestätigt. Prüfe ihren Status, bevor du es erneut versuchst.",
  incompleteBody:
    "Wir konnten keine abgeschlossene Zahlung bestätigen. Kontaktiere uns, falls dir bereits Geld abgebucht wurde.",
  unknownBody:
    "Prüfe deine Bestätigungs-E-Mail oder kontaktiere uns mit deiner Buchungsreferenz.",
  ref: "Buchungsreferenz",
  item: "Mietartikel",
  quantity: "Anzahl",
  dates: "Mietzeitraum",
  service: "Service",
  total: "Gesamt",
  fee: "Servicekosten",
  surcharge: "Expresszuschlag",
  pickup: "Selbstabholung",
  delivery: "Lieferung",
  roundtrip: "Lieferung und Abholung",
  express: "Expresslieferung",
  standard: "Standardlieferung",
  rental: "Miete",
  unit: "Artikel",
  to: "bis",
  home: "Startseite",
  contact: "Kontakt aufnehmen",
  calendar: "Zum Kalender hinzufügen",
  maps: "In Google Maps öffnen",
  localTime: "Ortszeit",
  emailNotice: "Informationen zu deiner Buchung senden wir dir per E-Mail.",
  release: "Deine Daten werden freigegeben…",
  releaseBody:
    "Du kehrst zum Artikel zurück, sobald die vorübergehende Reservierung aufgehoben wurde.",
  releaseError: "Dein Zahlungsvorgang konnte nicht freigegeben werden",
  releaseErrorBody:
    "Versuche es erneut oder kontaktiere uns. Die vorübergehende Reservierung läuft automatisch ab.",
  returnProduct: "Zurück zum Artikel",
  greeting: "Hallo",
  help: "Antworte auf diese E-Mail oder kontaktiere uns über WhatsApp, wenn du Hilfe brauchst.",
  whatsapp: "Kontakt über WhatsApp",
  next: "Wir melden uns bei dir, um die Übergabe abzustimmen.",
  pendingNotice:
    "Unser Team muss diese kurzfristige Buchung noch bestätigen. Falls wir sie nicht bestätigen können, erhältst du den gezahlten Betrag vollständig über deine ursprüngliche Zahlungsmethode zurück.",
  details: "Buchungsdetails",
  documents: "Deine Dokumente",
  document: "Dokument öffnen",
  conditions: "Vereinbarte Bedingungen",
  instructions: "Hinweise zur Übergabe",
  feedback: "Feedback geben",
  feedbackBody:
    "Teile nur, was du veröffentlichen möchtest. Eine Veröffentlichung erfolgt nur mit deiner Zustimmung.",
  paidStatus: "Wir haben deine Zahlung erhalten.",
  delivering:
    "Dein Mietartikel ist unterwegs. Bitte stelle sicher, dass ihn jemand entgegennehmen kann.",
  pickupReady:
    "Dein Mietartikel ist zur Abholung bereit. Bring bitte deine Buchungsreferenz mit.",
  active:
    "Deine Miete hat begonnen. Melde dich bei uns, wenn du Hilfe brauchst.",
  returning: "Deine Miete endet bald. Wir stimmen die Rückgabe mit dir ab.",
  completed: "Deine Miete ist abgeschlossen. Vielen Dank für deine Buchung.",
  cancelled:
    "Deine Buchung wurde storniert. Kontaktiere uns, falls du das nicht erwartet hast.",
  refunded:
    "Deine Rückerstattung wurde veranlasst. Wann sie auf deinem Konto erscheint, hängt von deiner Bank ab.",
  rejected_refunded:
    "Wir konnten deine Buchung nicht bestätigen. Dein gezahlter Betrag wurde vollständig zurückerstattet.",
  partially_refunded:
    "Eine teilweise Rückerstattung wurde veranlasst. Deine Buchung bleibt bestehen.",
  refund: "Erstatteter Betrag",
  statusTitle: "Neuigkeiten zu deiner Buchung",
  extra: "Zusatzleistung",
  assembly: "Aufbau und Einrichtung",
  disassembly: "Abbau",
  supportLanguage:
    "Kontaktiere uns. Unser Team bestätigt, in welcher Sprache wir dir helfen können.",
};
export const transactionCopy: Record<Locale, Copy> = { en, es, de };
export function transactionService(
  locale: Locale,
  mode: string,
  speed: string,
) {
  const t = transactionCopy[locale];
  return mode === "customer_pickup"
    ? t.pickup
    : mode === "delivery_and_collection"
      ? `${speed === "express" ? t.express : t.standard} · ${t.roundtrip}`
      : speed === "express"
        ? t.express
        : t.standard;
}
