import type { Locale } from "./config";
const en = {
  heading: "How did everything go?",
  intro:
    "Your feedback helps us improve equipment, handovers, and local support.",
  loading: "Loading your feedback form…",
  error:
    "We could not load or save your feedback. Check your rating and enter at least 10 characters, then try again.",
  thanks: "Thank you for your feedback",
  saved:
    "Your response has been saved. Feedback is only shown publicly after consent and a manual accuracy check.",
  completed: "Completed rental",
  rating: "How was your rental?",
  stars: "stars",
  title: "Short title",
  optional: "optional",
  titleHint: "What stood out?",
  body: "Your feedback",
  bodyHint: "Tell us what worked well and what we could improve.",
  name: "Public display name",
  nameHint: "e.g. Maria S.",
  consent:
    "I allow Rent&Roll to publish this feedback and my chosen display name. Submitting feedback without checking this box keeps it internal.",
  saving: "Saving…",
  submit: "Submit feedback",
};
type Copy = { [K in keyof typeof en]: string };
const de: Copy = {
  heading: "Wie ist deine Miete gelaufen?",
  intro:
    "Dein Feedback hilft uns, unsere Mietartikel, die Übergabe und den Service vor Ort zu verbessern.",
  loading: "Dein Feedbackformular wird geladen…",
  error:
    "Dein Feedback konnte nicht geladen oder gespeichert werden. Prüfe deine Bewertung, gib mindestens 10 Zeichen ein und versuche es erneut.",
  thanks: "Vielen Dank für dein Feedback",
  saved:
    "Deine Antwort wurde gespeichert. Feedback wird nur mit deiner Zustimmung und nach einer manuellen Prüfung veröffentlicht.",
  completed: "Abgeschlossene Miete",
  rating: "Wie zufrieden warst du mit deiner Miete?",
  stars: "Sterne",
  title: "Kurzer Titel",
  optional: "optional",
  titleHint: "Was ist dir aufgefallen?",
  body: "Dein Feedback",
  bodyHint: "Was hat gut funktioniert? Was können wir verbessern?",
  name: "Öffentlicher Anzeigename",
  nameHint: "z. B. Maria S.",
  consent:
    "Ich erlaube Rent&Roll, dieses Feedback und meinen gewählten Anzeigenamen zu veröffentlichen. Wenn ich dieses Feld nicht ankreuze, bleibt mein Feedback intern.",
  saving: "Wird gespeichert…",
  submit: "Feedback senden",
};
const es: Copy = {
  heading: "¿Cómo fue todo?",
  intro:
    "Tu opinión nos ayuda a mejorar los artículos, las entregas y el servicio local.",
  loading: "Cargando tu formulario…",
  error:
    "No hemos podido cargar o guardar tu opinión. Comprueba la puntuación, escribe al menos 10 caracteres e inténtalo de nuevo.",
  thanks: "Gracias por tu opinión",
  saved:
    "Tu respuesta se ha guardado. Solo publicamos opiniones con tu consentimiento y tras una revisión manual.",
  completed: "Alquiler completado",
  rating: "¿Cómo fue tu alquiler?",
  stars: "estrellas",
  title: "Título breve",
  optional: "opcional",
  titleHint: "¿Qué destacarías?",
  body: "Tu opinión",
  bodyHint: "Cuéntanos qué funcionó bien y qué podemos mejorar.",
  name: "Nombre público",
  nameHint: "p. ej. María S.",
  consent:
    "Permito que Rent&Roll publique esta opinión y el nombre que he elegido. Si no marco esta casilla, mi opinión será interna.",
  saving: "Guardando…",
  submit: "Enviar opinión",
};
export const reviewCopy: Record<Locale, Copy> = { en, es, de };
