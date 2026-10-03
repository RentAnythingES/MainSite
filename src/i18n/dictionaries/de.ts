import type { Dictionary } from "@/i18n/types";

/** German copy for the same page components and content as English and Spanish. */
const de: Dictionary = {
  locale: "de",
  siteName: "Rent&Roll",
  nav: {
    browse: "Alles zum Mieten", valencia: "Valencia", discover: "Valencia entdecken",
    howItWorks: "So funktioniert’s", about: "Über uns", faq: "Häufige Fragen",
    blog: "Ratgeber", rentNow: "Miete, was du brauchst",
  },
  home: {
    badge: "📍 Für deinen Aufenthalt in Valencia",
    headline: "Reise mit leichtem Gepäck.", headlineAccent: "Miete alles, was du brauchst.",
    subheadline: "Hochwertige Babyausstattung, Mobilitätshilfen, Ausstattung fürs Arbeiten und mehr – direkt zu deiner Unterkunft in Valencia geliefert. Kein schweres Gepäck, kein Stress.",
    ctaPrimary: "Mietartikel in Valencia entdecken", ctaSecondary: "So funktioniert’s",
    categoriesTitle: "Was brauchst du?",
    categoriesSubtitle: "Finde, was du für deinen Aufenthalt in Valencia brauchst.",
    trustStats: [
      { number: "Valencia", label: "Service vor Ort" },
      { number: "EN · ES · DE", label: "Mehrsprachige Unterstützung" },
      { number: "Flexibel", label: "Für kurze und längere Aufenthalte" },
      { number: "Vor Ort", label: "Abholung und Lieferung" },
    ],
    featuredTitle: "Ausgewählte Mietartikel", featuredSubtitle: "Unsere beliebtesten Artikel in Valencia",
    viewAll: "Alle ansehen →", howItWorksTitle: "So funktioniert’s",
    howItWorksSubtitle: "In drei einfachen Schritten zu einer entspannten Reise.",
    howItWorksSteps: [
      { title: "Auswählen und buchen", description: "Entdecke unsere Mietartikel, wähle deinen Mietzeitraum und prüfe vor der Zahlung die aktuelle Verfügbarkeit." },
      { title: "Wir liefern", description: "Wir liefern direkt zu deinem Hotel, Airbnb oder Apartment. Alle Artikel werden gereinigt und auf Sicherheit geprüft." },
      { title: "Nutzen und zurückgeben", description: "Genieße deinen Aufenthalt ohne Sorgen. Am Ende deiner Reise holen wir alles wieder ab. Du musst die Artikel nicht reinigen." },
    ],
    startBrowsing: "Alles zum Mieten →", ctaBannerTitle: "Bereit für weniger Gepäck?",
    ctaBannerSubtitle: "Finde passende Mietartikel für deinen Aufenthalt in Valencia und prüfe die Liefermöglichkeiten für deine Unterkunft.",
    browseRentals: "Alles zum Mieten", contactUs: "Kontakt aufnehmen",
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
    from: "Ab", perDay: "/Tag", features: "Produktdetails", specs: "Technische Angaben",
    pricing: "Mietpreise", days: "Tage", bookNow: "Verfügbarkeit prüfen",
    relatedProducts: "Das könnte auch passen", faqTitle: "Häufige Fragen",
    deliveryNote: "Liefer- und Abholoptionen sowie die Kosten siehst du bei der Buchung.",
  },
  valencia: {
    badge: "📍 Valencia, Spanien", headline: "Miete, was du brauchst", headlineAccent: "in Valencia",
    subtitle: "Babyausstattung, Mobilitätshilfen und Ausstattung fürs Arbeiten – für deinen Aufenthalt in Valencia, mit Lieferung zu deiner Unterkunft.",
    ctaPrimary: "Alle Produkte ansehen ↓", ctaSecondary: "So funktioniert’s",
    deliveryBar: ["🚚 Lieferoptionen bei der Buchung", "📍 Service in Valencia", "📅 Verfügbarkeit für deinen Zeitraum prüfen", "↩️ Rückgabe nach Vereinbarung"],
    browseByCategory: "Nach Kategorie stöbern", allProducts: "Alle Produkte",
  },
  common: { home: "Startseite", viewAll: "Alle ansehen →", explore: "Entdecken →", learnMore: "Mehr erfahren", backTo: "Zurück zu" },
};

export default de;
