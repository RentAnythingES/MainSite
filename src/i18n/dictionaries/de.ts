import type { Dictionary } from "@/i18n/types";

/** Draft for owner review. Registry keeps German unpublished. */
const de: Dictionary = {
  locale: "de",
  siteName: "Rent&Roll",
  nav: {
    browse: "Ausstattung entdecken", valencia: "Valencia", discover: "Valencia entdecken",
    howItWorks: "So funktioniert’s", about: "Über uns", faq: "Häufige Fragen",
    blog: "Ratgeber", rentNow: "Ausstattung mieten",
  },
  home: {
    badge: "📍 Für deinen Aufenthalt in Valencia",
    headline: "Reise mit leichtem Gepäck.", headlineAccent: "Miete, was du brauchst.",
    subheadline: "Babyausstattung, Mobilitätshilfen und Ausstattung fürs Arbeiten – mit Lieferung zu deiner Unterkunft in Valencia.",
    ctaPrimary: "Ausstattung in Valencia entdecken", ctaSecondary: "So funktioniert’s",
    categoriesTitle: "Was brauchst du?",
    categoriesSubtitle: "Finde die passende Ausstattung für deinen Aufenthalt in Valencia.",
    trustStats: [
      { number: "Valencia", label: "Service vor Ort" },
      { number: "Persönlich", label: "Hilfe bei der Auswahl" },
      { number: "Flexibel", label: "Für kurze und längere Aufenthalte" },
      { number: "Vor Ort", label: "Abholung und Lieferung" },
    ],
    featuredTitle: "Ausstattung für deinen Aufenthalt", featuredSubtitle: "Entdecke unsere Auswahl in Valencia",
    viewAll: "Alle ansehen →", howItWorksTitle: "So funktioniert’s",
    howItWorksSubtitle: "In drei Schritten zur passenden Ausstattung.",
    howItWorksSteps: [
      { title: "Auswählen und buchen", description: "Wähle die passende Ausstattung und deinen Mietzeitraum. Prüfe die Verfügbarkeit und buche online." },
      { title: "Liefern lassen oder abholen", description: "Wähle bei der Buchung eine verfügbare Liefer- oder Abholoption für deinen Aufenthalt." },
      { title: "Nutzen und zurückgeben", description: "Genieße deinen Aufenthalt und gib die Ausstattung zum vereinbarten Termin zurück. Eine Abholung kannst du bei der Buchung auswählen, sofern sie angeboten wird." },
    ],
    startBrowsing: "Ausstattung entdecken →", ctaBannerTitle: "Bereit für weniger Gepäck?",
    ctaBannerSubtitle: "Finde Ausstattung für deinen Aufenthalt in Valencia und prüfe die Liefermöglichkeiten für deine Unterkunft.",
    browseRentals: "Ausstattung entdecken", contactUs: "Kontakt aufnehmen",
  },
  categories: {
    eventsCelebrations: { name: "Feiern und Veranstaltungen", desc: "Pizzaöfen, Slush-Maschinen, Karaoke und Spiele" },
    babyGear: { name: "Babys und Kleinkinder", desc: "Kinderwagen, Reisebetten, Kindersitze und Hochstühle" },
    kidsFamily: { name: "Kinder und Familie", desc: "Ausstattung für gemeinsame Ausflüge und Aktivitäten" },
    mobility: { name: "Mobilität und Barrierefreiheit", desc: "Rollstühle, Elektromobile und Rollatoren" },
    remoteWork: { name: "Arbeiten unterwegs", desc: "Monitore, Schreibtische, Bürostühle und Zubehör" },
    homeLiving: { name: "Komfort in deiner Unterkunft", desc: "Luftreiniger, Kühlung und praktische Ausstattung" },
    travelOutdoors: { name: "Strand und Outdoor", desc: "Strandausstattung, Kühlboxen und Sonnenschirme" },
    sportsWellness: { name: "Sport und Wohlbefinden", desc: "Ausstattung für Tennis, Padel und Training" },
    pregnancy: { name: "Schwangerschaft und Wochenbett", desc: "Stützkissen und Ausstattung für mehr Komfort" },
  },
  product: {
    from: "Ab", perDay: "/Tag", features: "Ausstattung", specs: "Technische Angaben",
    pricing: "Mietpreise", days: "Tage", bookNow: "Verfügbarkeit prüfen",
    relatedProducts: "Das könnte auch passen", faqTitle: "Häufige Fragen",
    deliveryNote: "Liefer- und Abholoptionen sowie die Kosten siehst du bei der Buchung.",
  },
  valencia: {
    badge: "📍 Valencia, Spanien", headline: "Ausstattung mieten", headlineAccent: "in Valencia",
    subtitle: "Babyausstattung, Mobilitätshilfen und Ausstattung fürs Arbeiten – für deinen Aufenthalt in Valencia, mit Lieferung zu deiner Unterkunft.",
    ctaPrimary: "Alle Produkte ansehen ↓", ctaSecondary: "So funktioniert’s",
    deliveryBar: ["🚚 Lieferoptionen bei der Buchung", "📍 Service in Valencia", "📅 Verfügbarkeit für deinen Zeitraum prüfen", "↩️ Rückgabe nach Vereinbarung"],
    browseByCategory: "Nach Kategorie stöbern", allProducts: "Alle Produkte",
  },
  common: { home: "Startseite", viewAll: "Alle ansehen →", explore: "Entdecken →", learnMore: "Mehr erfahren", backTo: "Zurück zu" },
};

export default de;
