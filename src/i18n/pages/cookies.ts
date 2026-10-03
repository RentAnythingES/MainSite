import type { Locale } from "@/i18n/config";

/** Original page content, translated without changing its rendering or structure. */
const copy = {
  "en": [
    "Cookie Policy",
    "Last updated: 20 July 2026",
    "1. Cookies and browser storage",
    "Cookies are small files that websites and service providers may store in your browser. Rent&Roll also uses local storage to remember your analytics choice. Local storage is not a cookie, but we explain it here because it serves a similar preference-storage function.",
    "2. Technologies used on the public site",
    "Technology",
    "Category",
    "Purpose",
    "Duration",
    "rentandroll_analytics_consent",
    "Preference",
    "Stores your allow or reject choice in local storage",
    "Until cleared or changed",
    "Google Analytics identifiers, including _ga",
    "Analytics",
    "Measures site and booking-step usage only after you allow analytics",
    "According to Google's configured lifetime, up to 2 years",
    "Public browsing does not use the admin authentication cookies reserved for authorised staff.",
    "3. Analytics consent",
    "Google Analytics is optional and does not load unless you select “Allow analytics.” The website, availability check and checkout remain usable when analytics is rejected. Use “Cookie settings” in the footer to change your choice at any time.",
    "4. Stripe and other third parties",
    "When you proceed to Stripe Checkout, Stripe may use cookies or similar technologies for secure payment processing and fraud prevention under its own policies. External services opened from our links may also apply their own storage choices.",
    "5. Browser controls",
    "You can also delete cookies and local storage through your browser settings. Blocking all browser storage may affect preferences or third-party checkout features."
  ],
  "es": [
    "Política de Cookies",
    "Última actualización: 20 de julio de 2026",
    "1. Cookies y almacenamiento del navegador",
    "Las cookies son pequeños archivos que una web o sus proveedores pueden guardar en el navegador. Rent&Roll también utiliza almacenamiento local para recordar tu decisión sobre analítica. No es una cookie, pero lo explicamos aquí porque cumple una función similar de preferencia.",
    "2. Tecnologías utilizadas en la web pública",
    "Tecnología",
    "Categoría",
    "Finalidad",
    "Duración",
    "rentandroll_analytics_consent",
    "Preferencia",
    "Guarda en almacenamiento local si permites o rechazas la analítica",
    "Hasta que la cambies o borres",
    "Identificadores de Google Analytics, incluido _ga",
    "Analítica",
    "Mide el uso de la web y los pasos de reserva solo después de tu autorización",
    "Según la configuración de Google, hasta 2 años",
    "La navegación pública no utiliza las cookies de autenticación del panel reservadas al personal autorizado.",
    "3. Consentimiento de analítica",
    "Google Analytics es opcional y no se carga salvo que selecciones «Permitir analítica». La web, la comprobación de disponibilidad y el checkout funcionan si la rechazas. Utiliza «Configurar cookies» en el pie de página para cambiar tu decisión.",
    "4. Stripe y otros terceros",
    "Al continuar a Stripe Checkout, Stripe puede utilizar cookies o tecnologías similares para procesar el pago de forma segura y prevenir el fraude conforme a sus propias políticas. Los servicios externos abiertos desde nuestros enlaces también pueden aplicar sus propias opciones.",
    "5. Controles del navegador",
    "También puedes borrar cookies y almacenamiento local desde la configuración del navegador. Bloquear todo el almacenamiento puede afectar a las preferencias o a funciones del checkout de terceros."
  ],
  "de": [
    "Cookie-Richtlinie",
    "Letzte Aktualisierung: 20. Juli 2026",
    "1. Cookies und Browserspeicher",
    "Cookies sind kleine Dateien, die Websites und Dienstleister in deinem Browser speichern können. Rent&Roll verwendet außerdem den lokalen Speicher, um deine Entscheidung zur Analyse zu merken. Der lokale Speicher ist kein Cookie. Wir erläutern ihn hier, weil er ebenfalls Einstellungen speichert.",
    "2. Auf der öffentlichen Website verwendete Technologien",
    "Technologie",
    "Kategorie",
    "Zweck",
    "Speicherdauer",
    "rentandroll_analytics_consent",
    "Einstellung",
    "Speichert deine Zustimmung oder Ablehnung im lokalen Speicher",
    "Bis zum Löschen oder Ändern",
    "Google-Analytics-Kennungen, einschließlich _ga",
    "Analyse",
    "Erfasst die Nutzung der Website und der Buchungsschritte erst, nachdem du der Analyse zugestimmt hast",
    "Gemäß der bei Google eingestellten Speicherdauer, bis zu 2 Jahre",
    "Beim öffentlichen Besuch der Website werden keine Administrator-Anmeldecookies verwendet. Diese sind autorisierten Mitarbeitenden vorbehalten.",
    "3. Einwilligung in die Analyse",
    "Google Analytics ist optional und wird nur geladen, wenn du „Analyse erlauben“ auswählst. Die Website, die Verfügbarkeitsprüfung und die Buchung funktionieren auch bei abgelehnter Analyse. Über „Cookie-Einstellungen“ im Footer kannst du deine Entscheidung jederzeit ändern.",
    "4. Stripe und andere Drittanbieter",
    "Wenn du zu Stripe Checkout weitergehst, kann Stripe nach seinen eigenen Richtlinien Cookies oder ähnliche Technologien für sichere Zahlungen und Betrugsprävention verwenden. Externe Dienste, die du über unsere Links öffnest, können ebenfalls eigene Speichereinstellungen anwenden.",
    "5. Einstellungen im Browser",
    "Du kannst Cookies und den lokalen Speicher auch über die Einstellungen deines Browsers löschen. Wenn du den gesamten Browserspeicher blockierst, kann dies Einstellungen oder Funktionen der Buchung bei Drittanbietern beeinträchtigen."
  ]
} as const;

export function getCookiesPageBodyCopy(locale: Locale) { return (index: number): string => {
  const text: string | undefined = copy[locale][index];
  if (text === undefined) throw new Error("Missing cookies copy for " + locale + ":" + index);
  return text;
}; }
