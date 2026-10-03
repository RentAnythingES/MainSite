import type { Locale } from "./config";

export const newsletterConsentVersion = "2026-09-29";
export const newsletterCopy = {
  en: {
    email: "Email address", submitting: "Subscribing...", submit: "Subscribe",
    consent: "I agree to receive Rent&Roll emails with Valencia stay tips, product updates, kit launches, and occasional offers. I can unsubscribe at any time.",
    success: "You're subscribed.", error: "Could not subscribe. Please try again.",
    invalidEmail: "A valid email address is required", missingConsent: "Please agree to receive these emails before subscribing.",
    welcome: "Welcome to Rent&Roll", hello: "Hi", intro: "Thanks for signing up. We'll send useful Valencia stay tips, new kit launches, and practical updates when new inventory becomes available.",
    interest: "Your interest", help: "If you need something specific for a Valencia stay, just message us.",
    whatsapp: "Ask us on WhatsApp", reason: "You received this because you subscribed to Rent&Roll updates.",
    unsubscribe: "Unsubscribe", preferences: "Email preferences", updating: "Updating…",
    unsubscribeBody: "Stop receiving Valencia tips, inventory updates and occasional offers. Booking and service emails for active rentals are unaffected.",
    unsubscribed: "You have been unsubscribed from marketing emails.", unsubscribeError: "Could not unsubscribe. Please check your link and try again.", home: "Return home",
  },
  es: {
    email: "Correo electrónico", submitting: "Suscribiendo...", submit: "Suscribirme",
    consent: "Acepto recibir correos de Rent&Roll con consejos para estancias en Valencia, novedades de productos, nuevos kits y ofertas ocasionales. Puedo darme de baja en cualquier momento.",
    success: "Ya estás suscrito.", error: "No hemos podido completar la suscripción. Inténtalo de nuevo.",
    invalidEmail: "Introduce un correo electrónico válido", missingConsent: "Acepta recibir estos correos antes de suscribirte.",
    welcome: "Te damos la bienvenida a Rent&Roll", hello: "Hola", intro: "Gracias por suscribirte. Te enviaremos consejos útiles para tu estancia en Valencia, nuevos kits y novedades de los productos disponibles.",
    interest: "Tu interés", help: "Si necesitas algo concreto para tu estancia en Valencia, escríbenos.",
    whatsapp: "Consultar por WhatsApp", reason: "Recibes este correo porque te has suscrito a las novedades de Rent&Roll.",
    unsubscribe: "Darme de baja", preferences: "Preferencias de correo", updating: "Actualizando…",
    unsubscribeBody: "Deja de recibir consejos sobre Valencia, novedades y ofertas ocasionales. Los correos sobre reservas y servicios de alquileres activos no cambian.",
    unsubscribed: "Te has dado de baja de los correos comerciales.", unsubscribeError: "No hemos podido darte de baja. Comprueba el enlace e inténtalo de nuevo.", home: "Volver al inicio",
  },
  de: {
    email: "E-Mail-Adresse", submitting: "Wird angemeldet…", submit: "Anmelden",
    consent: "Ich möchte E-Mails von Rent&Roll mit Tipps für meinen Aufenthalt in Valencia, Produktneuigkeiten, neuen Mietpaketen und gelegentlichen Angeboten erhalten. Ich kann mich jederzeit abmelden.",
    success: "Du bist angemeldet.", error: "Die Anmeldung hat nicht funktioniert. Bitte versuche es erneut.",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein", missingConsent: "Bitte stimme dem Erhalt dieser E-Mails zu, bevor du dich anmeldest.",
    welcome: "Willkommen bei Rent&Roll", hello: "Hallo", intro: "Danke für deine Anmeldung. Wir schicken dir hilfreiche Tipps für deinen Aufenthalt in Valencia, neue Mietpakete und Neuigkeiten zu verfügbaren Mietartikeln.",
    interest: "Dein Interesse", help: "Wenn du etwas Bestimmtes für deinen Aufenthalt in Valencia brauchst, schreib uns einfach.",
    whatsapp: "Über WhatsApp fragen", reason: "Du erhältst diese E-Mail, weil du dich für Neuigkeiten von Rent&Roll angemeldet hast.",
    unsubscribe: "Abmelden", preferences: "E-Mail-Einstellungen", updating: "Wird aktualisiert…",
    unsubscribeBody: "Melde dich von Valencia-Tipps, Produktneuigkeiten und gelegentlichen Angeboten ab. E-Mails zu deinen laufenden Buchungen und Mietleistungen erhältst du weiterhin.",
    unsubscribed: "Du bist von den Werbe-E-Mails abgemeldet.", unsubscribeError: "Die Abmeldung hat nicht funktioniert. Prüfe deinen Link und versuche es erneut.", home: "Zur Startseite",
  },
} satisfies Record<Locale, Record<string, string>>;

export const contactMessageCopy = {
  en: { subject: "We received your message — Rent&Roll", title: "Thanks for reaching out", hello: "Hi", body: "We've received your message and will get back to you as soon as we can. If it is related to an upcoming arrival, WhatsApp is usually the most direct way to reach us.", about: "About", whatsapp: "Message us on WhatsApp", error: "We could not send your message. Please try again.", required: "Name, email, and message are required", invalidEmail: "Invalid email address" },
  es: { subject: "Hemos recibido tu mensaje — Rent&Roll", title: "Gracias por escribirnos", hello: "Hola", body: "Hemos recibido tu mensaje y responderemos en cuanto podamos. Si está relacionado con una llegada próxima, WhatsApp suele ser la forma más directa de localizarnos.", about: "Sobre", whatsapp: "Escribir por WhatsApp", error: "No hemos podido enviar el mensaje. Inténtalo de nuevo.", required: "Nombre, correo electrónico y mensaje son obligatorios", invalidEmail: "Correo electrónico no válido" },
  de: { subject: "Wir haben deine Nachricht erhalten — Rent&Roll", title: "Danke für deine Nachricht", hello: "Hallo", body: "Wir haben deine Nachricht erhalten und melden uns so bald wie möglich. Wenn es um eine bevorstehende Ankunft geht, erreichst du uns meist am direktesten über WhatsApp.", about: "Zu deinem Mietartikel", whatsapp: "Über WhatsApp schreiben", error: "Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.", required: "Name, E-Mail-Adresse und Nachricht sind erforderlich", invalidEmail: "Ungültige E-Mail-Adresse" },
} satisfies Record<Locale, Record<string, string>>;
