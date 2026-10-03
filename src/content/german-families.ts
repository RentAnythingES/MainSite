import type { ProductFamilyContent } from "@/data/product-families";
import { customerPrefix } from "@/i18n/customer-path";
const prefix = customerPrefix("de");

// Private, unapproved editorial drafts. Product facts remain in the exact listing.
const common = {
  productAction: "Artikel ansehen und Termine prüfen",
  priceFrom: "Ab",
  priceUnit: "/ Tag",
  checklistHeading: "Vor der Buchung klären",
  checklistIntro: "Diese Angaben helfen dir, einen passenden Artikel für deinen Aufenthalt auszuwählen.",
  linksHeading: "Deinen Aufenthalt weiter planen",
  linksIntro: "Vergleiche weitere Mietartikel oder schreib uns zu deinen Anforderungen.",
  productLabels: {},
} satisfies Partial<ProductFamilyContent>;

function links(category: "mobility" | "baby-gear"): ProductFamilyContent["links"] {
  return [
    { eyebrow: "Alle Mietartikel", title: category === "mobility" ? "Mobilität und Barrierefreiheit" : "Baby und Kleinkind", description: "Weitere Artikel für deinen Aufenthalt in Valencia vergleichen.", href: `${prefix}/rental/${category}` },
    { eyebrow: "So funktioniert’s", title: "Miete, Lieferung und Abholung", description: "Erfahre, wie du deine Mietartikel für den Aufenthalt organisierst.", href: `${prefix}/how-it-works` },
    { eyebrow: "Persönliche Hilfe", title: "Eine Frage zu deiner Auswahl?", description: "Schick uns deine Reisedaten und die Angaben, die für deine Auswahl wichtig sind.", href: `${prefix}/contact` },
    { eyebrow: "Gemeinsam anfragen", title: category === "mobility" ? "Mobilitätspaket zusammenstellen" : "Babypaket zur Ankunft zusammenstellen", description: "Mehrere Artikel für denselben Aufenthalt auswählen und gemeinsam anfragen.", href: `${prefix}/valencia/kits/${category === "mobility" ? "accessible-valencia-kit" : "baby-arrival-kit"}` },
  ];
}

export const germanFamilies: Record<string, ProductFamilyContent> = {
  "mobility-scooters": {
    ...common, categoryLabel: "Mobilität und Barrierefreiheit",
    title: "Elektromobil mieten in Valencia | Rent&Roll",
    description: "Vergleiche faltbare, klassische und größere Elektromobile in Valencia. Prüfe Zugang, Transport und Verfügbarkeit für deinen Aufenthalt.",
    eyebrow: "Elektromobil mieten in Valencia",
    intro: "Wähle nach deinen geplanten Wegen, dem Zugang zur Unterkunft und dem Platz zum Abstellen über Nacht. Falls das Elektromobil in einem Fahrzeug mitfahren soll, gehört auch der Transport zur Planung. Die einzelnen Produktseiten zeigen Preise, Verfügbarkeit, genaue Grenzen und die Bedingungen für die Übergabe.",
    productHeading: "Elektromobile vergleichen",
    productDescription: "Beginne mit deinen Anforderungen an Transport, Zugang und Strecken. Prüfe danach das konkrete Modell und deine Termine.",
    choiceHeading: "Welches Elektromobil passt zu deinem Aufenthalt?",
    choiceIntro: "Entscheidend ist, wie du das Elektromobil während deiner Reise nutzen möchtest.",
    choices: [
      { title: "Wenig Stauraum oder Transport im Auto", description: "Prüfe ein faltbares oder zerlegbares Modell. Vergleiche die Fahrzeugöffnung, den Kofferraum und die Gewichte der Einzelteile. Kläre vorab, wer sie sicher heben kann." },
      { title: "Befestigte Wege im Alltag", description: "Ein klassisches Elektromobil verbindet Komfort, Stabilität und Wendigkeit für geeignete stufenlose Wege. Prüfe die schmalste Tür, den Aufzug und den Ladeplatz über Nacht." },
      { title: "Mehr Platz oder höhere Tragfähigkeit", description: "Ein größeres Modell kann mehr Unterstützung und Tragfähigkeit bieten, braucht aber mehr Platz zum Wenden, Abstellen und bei der Lieferung. Für den Transport im Auto ist es in der Regel weniger praktisch." },
    ],
    checklist: ["Körpermaße und zulässiges Nutzergewicht des konkreten Modells.", "Stufen, Türbreiten, Aufzugmaße und enge Kurven in der Unterkunft.", "Transport im Auto, Platz und sichere Handhabung der Einzelteile.", "Untergrund, Steigungen und tägliche Strecke. Eine angegebene Reichweite ist keine garantierte Fahrstrecke.", "Ein trockener, sicherer Abstellplatz mit geeigneter Lademöglichkeit."],
    localHeading: "Mit dem Elektromobil durch Valencia",
    localParagraphs: ["Breite Gehwege, die Turia-Gärten und befestigte Strandpromenaden können sich eignen. Zugang und Untergrund unterscheiden sich jedoch je nach Strecke und Gebäude. Plane stufenlose Verbindungen und prüfe aktuelle Angaben von Veranstaltungsorten und Verkehrsbetrieben.", "Elektromobile gehören auf geeignete befestigte Wege. Fahre nicht über Strandsand, Stufen, hohe Bordsteine, überflutete Flächen oder stark beschädigten Boden. Schick uns unklare Zugangs- oder Streckenangaben vor der Zahlung."],
    links: links("mobility"), faqHeading: "Häufige Fragen zu Elektromobilen",
    faqs: [
      { question: "Welches Elektromobil soll ich wählen?", answer: "Vergleiche Sitz und Nutzergrenzen, Zugang, Abstellplatz, Transport und die geplanten Wege. Prüfe die Angaben zum konkreten Modell vor der Buchung." },
      { question: "Ist eine Lieferung zur Unterkunft möglich?", answer: "Die verfügbaren Liefer- und Abholoptionen werden bei der Buchung angezeigt. Teile uns Stufen, kleine Aufzüge, schmale Türen oder begrenzten Abstellplatz vor der Zahlung mit." },
      { question: "Kann das Elektromobil im Auto mitfahren?", answer: "Nur bestimmte Modelle sind faltbar oder zerlegbar. Fahrzeugöffnung, Stauraum, Gewichte und sicheres Heben müssen zusammenpassen. Größere Modelle benötigen normalerweise eine direkte Lieferung und Abholung." },
      { question: "Ist die angegebene Reichweite garantiert?", answer: "Nein. Gewicht, Steigungen, Untergrund, Temperatur, Akkuzustand und Fahrweise beeinflussen die tatsächliche Reichweite. Plane deshalb eine Reserve ein." },
      { question: "Darf ich damit an den Strand?", answer: "Geeignete befestigte Promenaden sind etwas anderes als Strandsand. Fahre nicht auf Sand oder durch Salzwasser. Prüfe barrierefreie Strandangebote gesondert, wenn du Unterstützung bis zum Wasser brauchst." },
    ],
  },
  strollers: {
    ...common, categoryLabel: "Baby und Kleinkind", title: "Kinderwagen mieten in Valencia | Rent&Roll",
    description: "Vergleiche kompakte Kinderwagen, Modelle für unebene Wege und Doppelkinderwagen in Valencia. Prüfe Maße, Zugang und Termine vor deiner Buchung.",
    eyebrow: "Kinderwagen mieten in Valencia",
    intro: "Organisiere den Kinderwagen vor deiner Ankunft. Wähle nach den Bedürfnissen deines Kindes, euren Wegen, dem Transport und dem Zugang zur Unterkunft. Die Produktseiten zeigen aktuelle Preise, Verfügbarkeit, genaue Nutzungsgrenzen und enthaltenes Zubehör.",
    productHeading: "Kinderwagen vergleichen", productDescription: "Prüfe für eure geplanten Ausflüge die Grenzen für dein Kind, Maße, enthaltene Teile und Verfügbarkeit des jeweiligen Modells.",
    choiceHeading: "Welcher Kinderwagen passt zu eurer Reise?", choiceIntro: "Überlege, welche Wege ihr zurücklegt und wie der Kinderwagen in euren Tagesablauf passt.",
    choices: [
      { title: "Für Taxi, Zug und wenig Stauraum", description: "Achte auf Faltmaße, Gewicht und einen gut handhabbaren Faltmechanismus. Kompakt bedeutet nicht automatisch, dass die Fluggesellschaft den Wagen als Handgepäck annimmt." },
      { title: "Für längere Spaziergänge", description: "Prüfe Räder, Liegeposition, Griff und die vom Hersteller erlaubten Untergründe. Ein geländegängiger Wagen ist nicht automatisch zum Joggen, für Treppen oder Strandsand geeignet." },
      { title: "Für Zwillinge oder zwei kleine Kinder", description: "Vergleiche die Grenzen pro Sitz, die Gesamtbreite, Faltmaße und den Platz zum Wenden. Miss Türen, Aufzüge und den Abstellplatz in der Unterkunft." },
    ],
    checklist: ["Alter, Gewicht und Sitzanforderungen für jedes Kind.", "Ausdrückliche Eignung für Neugeborene und die dafür erforderliche Position oder zugelassenes Zubehör.", "Schmalste Tür, Aufzug, Treppen und Abstellplatz.", "Platz im Taxi, Kofferraum oder Zug sowie die Gepäckregeln der Fluggesellschaft.", "Geplante Wege, Entfernungen und jedes benötigte Zubehörteil."],
    localHeading: "Mit Kinderwagen durch Valencia", localParagraphs: ["Viele Wege in den Turia-Gärten und auf befestigten Strandpromenaden bieten Platz. In der Altstadt können Gehwege schmal, Bordsteine hoch und Flächen uneben sein. Prüfe die Zugänge zu den Orten, die ihr besuchen möchtet.", "Nutze den Kinderwagen nur auf den für das konkrete Modell erlaubten Flächen. Eine Promenade ist kein Sandstrand. Teile uns offene Fragen zu Zugang und Transport vor der Zahlung mit."],
    links: links("baby-gear"), faqHeading: "Häufige Fragen zu Kinderwagen",
    faqs: [
      { question: "Welchen Kinderwagen soll ich mieten?", answer: "Vergleiche die Grenzen für jedes Kind, eure Wege, Faltmaße und den Zugang zur Unterkunft. Kompakte Modelle erleichtern Transporte; Doppelkinderwagen benötigen mehr Platz." },
      { question: "Kann ich vor der Anreise reservieren?", answer: "Ja. Wähle Artikel und Termine, um Verfügbarkeit sowie Abhol- und Lieferoptionen zu prüfen. Relevante Zugangsdetails klären wir vor der Zahlung." },
      { question: "Darf der kompakte Kinderwagen ins Handgepäck?", answer: "Das darfst du nicht voraussetzen. Vergleiche die genauen Faltmaße mit den aktuellen Vorgaben deiner Fluggesellschaft und lass dir die Annahme direkt bestätigen." },
      { question: "Welcher Kinderwagen eignet sich für Neugeborene?", answer: "Nur ein Modell, dessen Produktangaben und Herstellerhinweise Alter und erforderliche Sitz- oder Liegeposition ausdrücklich abdecken. Die Übersicht allein bestätigt diese Eignung nicht." },
      { question: "Passt ein Doppelkinderwagen in die Unterkunft?", answer: "Miss die schmalste Tür, den Aufzug und den Abstellplatz. Vergleiche sie mit den exakten Maßen des Kinderwagens; eine allgemeine Beschreibung garantiert keinen Zugang." },
    ],
  },
  "car-seats": {
    ...common, categoryLabel: "Baby und Kleinkind", title: "Kindersitz mieten in Valencia | Rent&Roll",
    description: "Organisiere einen Baby- oder Kindersitz für Valencia vor deiner Reise. Vergleiche die Modelle und prüfe Fahrzeug, Preise und Verfügbarkeit.",
    eyebrow: "Kindersitz mieten in Valencia", intro: "Reise mit weniger Gepäck und organisiere den Kindersitz vor deiner Ankunft. Vergleiche die aktuellen Modelle und prüfe auf der Produktseite die Größenangaben für dein Kind, Eigenschaften, Preise und Verfügbarkeit.",
    productHeading: "Kindersitze vergleichen", productDescription: "Wähle anhand deines Kindes und eurer Reisepläne. Die einzelne Produktseite zeigt die Angaben, die wir vor der Miete benötigen.",
    choiceHeading: "Welcher Kindersitz passt zu eurer Reise?", choiceIntro: "Ein paar konkrete Angaben helfen, die passenden Möglichkeiten einzugrenzen.",
    choices: [
      { title: "Mit Größe und Gewicht beginnen", description: "Schick uns die aktuelle Körpergröße und das Gewicht deines Kindes. Das Alter hilft ebenfalls, ersetzt aber die Modellgrenzen nicht." },
      { title: "Das Fahrzeug angeben", description: "Teile uns Marke, Modell und Baujahr mit, sobald du sie kennst. Das hilft beim Vergleich von ISOFIX und Sitzen, die den Fahrzeuggurt verwenden." },
      { title: "Jedes Fahrzeug berücksichtigen", description: "Sag uns, ob der Sitz zwischen Mietwagen, Familienauto oder Transferfahrzeug wechseln soll. Der Einbau muss für jedes Fahrzeug geprüft werden." },
    ],
    checklist: ["Aktuelle Körpergröße, Gewicht und Alter deines Kindes.", "Fahrzeugmarke, Modell und Baujahr, soweit bekannt.", "Vorhandene ISOFIX-Verankerungen oder benötigte Befestigung mit Dreipunktgurt.", "Weitere Fahrzeuge, in denen der Sitz eingesetzt werden soll.", "Mietzeitraum und gewünschte Lieferung oder Abholung."],
    localHeading: "Autofahrten in Valencia vorbereiten", localParagraphs: ["Du kannst mit den Angaben zu deinem Kind und den Reisedaten beginnen, wenn der Mietwagenanbieter noch kein Modell zugeteilt hat. Reiche die Fahrzeugdaten nach, sobald sie vorliegen.", "Für Flughafentransfers, Ausflüge und Fahrten im Alltag kann ein Kindersitz nötig sein. Erwähne mehrere geplante Fahrzeuge bereits in deiner Anfrage, damit die Möglichkeiten gezielt verglichen werden können."],
    links: links("baby-gear"), faqHeading: "Häufige Fragen zu Kindersitzen",
    faqs: [
      { question: "Welchen Kindersitz soll ich mieten?", answer: "Beginne mit Körpergröße und Gewicht deines Kindes. Vergleiche dann die Grenzen und Einbaumethode des konkreten Sitzes. Fahrzeugdaten helfen bei der Auswahl." },
      { question: "Kann ich vor der Ankunft buchen?", answer: "Ja. Schick zunächst deine Termine und die Angaben zu deinem Kind. Ein noch nicht zugeteiltes Mietwagenmodell kannst du später ergänzen." },
      { question: "Passt ein ISOFIX-Sitz in jedes Auto?", answer: "Nein. Fahrzeuge und zugelassene Sitzplätze unterscheiden sich. Schick Marke, Modell und Baujahr, damit der konkrete Einbau geprüft werden kann." },
      { question: "Welche Angaben braucht ihr für die Prüfung?", answer: "Körpergröße und Gewicht des Kindes, Fahrzeugmarke, Modell, Baujahr, vorgesehener Sitzplatz, Verankerungen oder Gurt sowie Angaben zu weiteren Fahrzeugen." },
      { question: "Kann ich den Sitz zwischen Autos wechseln?", answer: "Erst nach Prüfung jedes Fahrzeugs, Sitzplatzes und Einbaus anhand der Anleitung des konkreten Kindersitzes. Die fahrende Person muss den korrekten Einbau vor jeder Fahrt sicherstellen." },
    ],
  },
  "travel-cots-cribs": {
    ...common, categoryLabel: "Baby und Kleinkind", title: "Reisebett und Babybett mieten in Valencia | Rent&Roll",
    description: "Organisiere ein Reisebett oder Babybett in Valencia vor deiner Ankunft. Vergleiche Maße, enthaltene Teile, Preise und Verfügbarkeit für deine Termine.",
    eyebrow: "Reisebett und Babybett mieten in Valencia", intro: "Organisiere einen passenden Schlafplatz für deinen Aufenthalt, ohne sperrige Artikel durch den Flughafen zu tragen. Die einzelnen Produktseiten zeigen genaue Maße, enthaltene Teile, Preise und Verfügbarkeit.",
    productHeading: "Reisebetten und Babybetten vergleichen", productDescription: "Wähle nach den Bedürfnissen deines Kindes und dem Platz in der Unterkunft. Prüfe anschließend Grenzen, Stellfläche, Aufbau und Lieferumfang des konkreten Betts.",
    choiceHeading: "Welches Bett passt zu eurem Aufenthalt?", choiceIntro: "Entscheidend sind der Entwicklungsstand deines Kindes, der verfügbare Platz und die enthaltenen Teile.",
    choices: [
      { title: "Den Entwicklungsstand berücksichtigen", description: "Prüfe Alter, Gewicht und Entwicklungshinweise auf der jeweiligen Produktseite. Verlasse dich bei der Auswahl nicht allein auf die Bezeichnung des Betts." },
      { title: "Den Schlafbereich ausmessen", description: "Vergleiche die Stellfläche mit dem Platz im Schlafzimmer. Türen, Schränke und Wege rund um das Bett müssen erreichbar bleiben." },
      { title: "Den Lieferumfang prüfen", description: "Die Produktseite zeigt, welche Matratze, welches Spannbettlaken oder weitere Teile enthalten sind. Kläre nicht ausdrücklich aufgeführte Teile vor der Reise." },
    ],
    checklist: ["Alter, ungefähres Gewicht und bisherige Schlafsituation deines Kindes.", "Platz im Schlafzimmer oder neben dem Erwachsenenbett.", "Aufzug, Treppen und Zugang zur Unterkunft.", "Bettwäsche oder Zubehör, das du selbst mitbringst.", "Mietzeitraum und gewünschte Lieferung oder Abholung."],
    localHeading: "Die Unterkunft vor der Anreise vorbereiten", localParagraphs: ["Du kannst das Bett vor dem Flug organisieren und die Übergabe mit deiner Ankunft abstimmen. Bitte die Unterkunft bei unklarem Platzangebot um Zimmermaße oder ein Foto.", "Verfügbarkeit, genaue Maße und enthaltene Teile findest du auf der jeweiligen Produktseite. Prüfe diese Angaben auch dann, wenn du schon eine bestimmte Bettart im Kopf hast."],
    links: links("baby-gear"), faqHeading: "Häufige Fragen zu Reisebetten und Babybetten",
    faqs: [
      { question: "Kann ich vor der Ankunft buchen?", answer: "Ja. Wähle einen verfügbaren Artikel, gib deine Termine ein und prüfe vor der Zahlung die Abhol- oder Lieferoptionen." },
      { question: "Welches Bett passt zu meinem Kind?", answer: "Prüfe Alter, Gewicht und Entwicklungshinweise des konkreten Modells. Vergleiche anschließend Maße und Aufbau mit dem Platz in der Unterkunft." },
      { question: "Sind Matratze und Bettwäsche enthalten?", answer: "Der Lieferumfang unterscheidet sich je nach Artikel. Die Produktseite nennt die enthaltenen Teile. Kläre alles, was nicht eindeutig aufgeführt ist, vor der Reise." },
      { question: "Kann das Bett zur Unterkunft geliefert werden?", answer: "Die verfügbaren Optionen für Adresse und Termine erscheinen bei der Buchung. Teile uns Treppen, Aufzuggrenzen oder andere Zugangsdetails vor der Übergabe mit." },
    ],
  },
  wheelchairs: {
    ...common, categoryLabel: "Mobilität und Barrierefreiheit", title: "Rollstuhl mieten in Valencia | Rent&Roll",
    description: "Organisiere einen Rollstuhl in Valencia vor deiner Reise. Vergleiche Maße, Transport, Preise und Verfügbarkeit für deinen geplanten Aufenthalt.",
    eyebrow: "Rollstuhl mieten in Valencia", intro: "Organisiere deinen Rollstuhl vor der Ankunft in Valencia. Die einzelnen Produktseiten zeigen Maße, Transporthinweise, Preise und Verfügbarkeit der aktuellen Modelle.",
    productHeading: "Rollstühle vergleichen", productDescription: "Überlege zunächst, wie der Rollstuhl genutzt wird. Prüfe dann Maße, Gewicht, Bedienung und Verfügbarkeit des passenden Modells.",
    choiceHeading: "Welcher Rollstuhl passt zu deinem Aufenthalt?", choiceIntro: "Wichtig sind die Fortbewegung, der Transport und die Zugänge während deiner Reise.",
    choices: [
      { title: "Wer bewegt den Rollstuhl?", description: "Ein Transportrollstuhl wird von einer Begleitperson geschoben. Ein Elektrorollstuhl ermöglicht elektrische Fortbewegung, wenn Bedienung, Strecke und Zugang passen." },
      { title: "Soll er im Auto mitfahren?", description: "Prüfe Faltmaße, Gesamtgewicht und Kofferraum. Elektrische Modelle sind schwerer und brauchen einen passenden Transportplan." },
      { title: "Welche Zugänge gibt es?", description: "Teile uns die schmalste Tür, Aufzugmaße, Stufen und geplante Untergründe mit. So lassen sich die Möglichkeiten anhand eurer Situation vergleichen." },
    ],
    checklist: ["Selbstständige Bedienung oder Unterstützung durch eine Begleitperson.", "Ungefähre Körpergröße und Gewicht der nutzenden Person.", "Türbreiten, Aufzugmaße und Stufen in der Unterkunft.", "Geplanter Transport im Auto und verfügbarer Kofferraum.", "Termine, Lage der Unterkunft und gewünschte Lieferung oder Abholung."],
    localHeading: "Den Rollstuhl vor der Reise organisieren", localParagraphs: ["Fotos der Unterkunft, Türmaße und Angaben zum Transport helfen, passende Möglichkeiten vor der Ankunft zu prüfen.", "Valencias Wege reichen von breiten Promenaden bis zu älteren Gehwegen, Kreuzungen und Innenräumen. Plane nach den Orten, die du besuchen möchtest, und prüfe Bedienungs- und Transporthinweise des konkreten Rollstuhls."],
    links: links("mobility"), faqHeading: "Häufige Fragen zu Rollstühlen",
    faqs: [
      { question: "Kann ich die Miete vor der Reise organisieren?", answer: "Ja. Schick uns deine Termine, die Lage der Unterkunft und die bereits bekannten Anforderungen. Die Produktseiten zeigen Preise und Verfügbarkeit für die gewählten Termine." },
      { question: "Was unterscheidet Transport- und Elektrorollstühle?", answer: "Ein Transportrollstuhl wird von einer anderen Person geschoben. Ein Elektrorollstuhl hat eine elektrische Steuerung und benötigt geeignete Wege sowie einen Lade- und Transportplan. Prüfe die genauen Modellangaben." },
      { question: "Ist eine Lieferung zur Unterkunft möglich?", answer: "Verfügbare Liefer- und Abholoptionen erscheinen bei der Buchung für deine Adresse und Termine. Teile uns Stufen, Aufzuggrenzen und schwierige Zugänge vor der Übergabe mit." },
      { question: "Welche Maße soll ich prüfen?", answer: "Miss die schmalste Tür, den Aufzug, Abstellplatz und Kofferraum und erfasse mögliche Stufen. Vergleiche die Werte mit den genauen Maßen auf der Produktseite." },
    ],
  },
};
