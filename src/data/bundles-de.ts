import { rentalBundles } from "./bundles";
import { localizeBundle, type BundleContent } from "./bundle-localization";

/** Private, unapproved drafts. Never register these as public routes or sitemap entries. */
export const germanBundleContent: Record<string, BundleContent> = {
  "remote-work-apartment-kit": {
    name: "Arbeitsplatzpaket für dein Apartment in Valencia", shortName: "Arbeitsplatzpaket", eyebrow: "Arbeiten unterwegs", tagline: "Aus dem Apartment wird ein praktischer Arbeitsplatz.",
    description: "Ein Paket für digitale Nomaden, Gründer und Angestellte, die von einem Apartment in Valencia aus arbeiten und länger als ein paar Tage bleiben.",
    bestFor: ["Digitale Nomaden", "Berufliche Langzeitaufenthalte", "Paare, die beide von unterwegs arbeiten", "Apartments ohne geeigneten Schreibtisch"],
    includedItems: [{ name: "Externer Monitor", note: "27 Zoll, sofern verfügbar" }, { name: "Laptopständer" }, { name: "Tastatur und Maus" }, { name: "USB-C-Hub oder Kabelset" }, { name: "Ergonomischer Bürostuhl", note: "Optional, abhängig von Unterkunft und Liefermöglichkeiten" }],
    addons: [{ name: "Höhenverstellbarer Schreibtisch", note: "Für längere Aufenthalte" }, { name: "Zweiter Monitor", note: "Für einen umfangreicheren Arbeitsplatz" }, { name: "Webcam oder Beleuchtung", note: "Für Videogespräche und die Erstellung von Inhalten" }],
    seo: { title: "Arbeitsplatzpaket in Valencia mieten", description: "Frage einen Arbeitsplatz in Valencia mit Monitor, Laptopständer, Tastatur, Maus und Kabeln an. Ergänze nach Bedarf einen passenden Bürostuhl.", keywords: ["Arbeitsplatz mieten Valencia", "Monitor mieten Valencia", "Homeoffice Artikel Valencia"] },
    faqs: [{ question: "Kann das Paket Coworking ergänzen oder ersetzen?", answer: "Für viele Gäste bei längeren Aufenthalten kann es Coworking ergänzen oder ersetzen, indem das Apartment einen angenehmeren Platz für konzentriertes Arbeiten und Videogespräche bietet." }],
  },
  "summer-apartment-survival-kit": {
    name: "Sommerpaket für dein Apartment in Valencia", shortName: "Sommerpaket fürs Apartment", eyebrow: "Komfort in der Unterkunft", tagline: "Kühlung und Komfort für warme Apartments in Valencia.",
    description: "Ein saisonales Paket für Juli, August und heiße Aufenthalte, wenn die Klimaanlage wenig leistet, die Schlafzimmer sehr hell sind oder kaum Luft zirkuliert.",
    bestFor: ["Aufenthalte im Juli und August", "Apartments mit schwacher Klimaanlage", "Familien mit Mittagsschlaf", "Gäste bei längeren Aufenthalten"],
    includedItems: [{ name: "Mobiles Klimagerät oder Ventilator", note: "Auswahl nach Raum und Verfügbarkeit" }, { name: "Verdunkelungsrollo", note: "Für Schlafzimmer und Mittagsschlaf" }, { name: "Luftreiniger", note: "Eine Option bei Staub oder in der Allergiesaison" }, { name: "Kühlbox oder Sonnenschutz als Ergänzung" }],
    addons: [{ name: "Mobiles Klimagerät", note: "Für Schlafzimmer mit geeigneter Abluftführung durch ein Fenster" }, { name: "Luftreiniger", note: "Für die Raumluft, auch als Option in der Allergiesaison" }, { name: "Sonnenschirm-Set", note: "Für Schatten außerhalb der Unterkunft" }],
    seo: { title: "Sommerpaket fürs Apartment in Valencia mieten", description: "Frage Kühlung und Komfort für dein Apartment in Valencia an: mobiles Klimagerät, Ventilator, Verdunkelung, Luftreiniger und Schatten für den Strand.", keywords: ["Klimagerät mieten Valencia", "Sommer Apartment Valencia", "Ventilator mieten Valencia"] },
    faqs: [{ question: "Kann jedes Apartment ein mobiles Klimagerät nutzen?", answer: "Nein. Ein mobiles Klimagerät braucht eine Abluftführung durch ein Fenster oder eine Balkontür. Wir müssen die Raumsituation prüfen, bevor wir ein Gerät zusagen." }],
  },
  "accessible-valencia-kit": {
    name: "Mobilitätspaket für Valencia", shortName: "Mobilitätspaket", eyebrow: "Mobilität und Barrierefreiheit", tagline: "Unterstützung für längere Tage in Valencia.",
    description: "Ein sorgfältig abgestimmtes Paket für Gäste, die Unterstützung bei der Mobilität benötigen: in den Turia-Gärten, an der Stadt der Künste und Wissenschaften, auf Strandpromenaden und in der Unterkunft.",
    bestFor: ["Menschen mit eingeschränkter Mobilität", "Ältere Reisende", "Besichtigungen mit barrierefreier Planung", "Tage mit längeren Wegen"],
    includedItems: [{ name: "Rollstuhl oder Rollator", note: "Auswahl nach den Bedürfnissen der nutzenden Person" }, { name: "Duschstuhl" }, { name: "Toilettensitzerhöhung", note: "Wenn geeignet" }, { name: "Elektromobil als Option", note: "Eignung, Akku und Lieferung müssen bestätigt werden" }],
    addons: [{ name: "Leichter Transportrollstuhl", note: "Für Unterstützung durch eine Begleitperson" }, { name: "Elektromobil", note: "Für längere Strecken" }, { name: "Tragbare Rampe", note: "Nur nach Prüfung von Maßen und sicherer Nutzung" }],
    seo: { title: "Mobilitätspaket in Valencia mieten", description: "Frage Mobilitätshilfen in Valencia mit Rollstuhl, Rollator, Duschstuhl oder Toilettensitzerhöhung an. Prüfe auch passende Elektromobil-Optionen.", keywords: ["Rollstuhl mieten Valencia", "Elektromobil mieten Valencia", "Valencia barrierefrei"] },
    faqs: [{ question: "Müssen Mobilitätshilfen zusätzlich geprüft werden?", answer: "Ja. Wir stimmen Eignung, Zugang zur Unterkunft, Akkubedarf, Lieferung und sichere Nutzung sorgfältig ab, bevor die Zusammenstellung bestätigt wird." }],
  },
  "grandparents-visiting-kit": {
    name: "Mietpaket für den Besuch der Großeltern in Valencia", shortName: "Paket für Großeltern", eyebrow: "Mobilität und Barrierefreiheit", tagline: "Komfort, Mobilität und Kühlung für ältere Gäste.",
    description: "Ein praktisches Paket für Familien, die Eltern oder Großeltern in Valencia empfangen. Es verbindet Mobilitätshilfen, Unterstützung im Bad, Kühlung und Komfortartikel für Ausflüge und entspannte Zeit in der Unterkunft.",
    bestFor: ["Ältere Gäste", "Familienreisen mit mehreren Generationen", "Sommeraufenthalte", "Längere Besichtigungstage"],
    includedItems: [{ name: "Rollator oder Rollstuhl", note: "Auswahl nach den Bedürfnissen des Gastes" }, { name: "Duschstuhl" }, { name: "Toilettensitzerhöhung als Option" }, { name: "Ventilator oder andere Kühlmöglichkeit", note: "Besonders im Juli und August hilfreich" }, { name: "Ergänzungen für mehr Komfort", note: "Abgestimmt auf Unterkunft und Aufenthaltsdauer" }],
    addons: [{ name: "Rollator", note: "Für Unterstützung beim Gehen" }, { name: "Leichter Transportrollstuhl", note: "Für längere Ausflüge mit einer Begleitperson" }, { name: "Mobiles Klimagerät", note: "Für warme Schlafzimmer, wenn die Aufstellung und Abluftführung passen" }, { name: "Elektromobil", note: "Für längere Strecken nach sorgfältiger Prüfung" }],
    seo: { title: "Mietpaket für Großeltern in Valencia", description: "Frage Mobilitätshilfen, Unterstützung im Bad, Kühlung und Komfortartikel für Großeltern oder ältere Gäste an, die deine Familie in Valencia besuchen.", keywords: ["Valencia mit Großeltern", "Seniorenreise Valencia", "Mobilitätshilfen mieten Valencia"] },
    faqs: [{ question: "Ist das Paket nur bei stark eingeschränkter Mobilität sinnvoll?", answer: "Nein. Es kann auch älteren Gästen helfen, die selbst gehen können, sich aber für längere Tage zusätzliche Stabilität, Kühlung, Komfort oder Unterstützung wünschen." }],
  },
  "long-stay-kitchen-upgrade-kit": {
    name: "Küchenpaket für längere Aufenthalte in Valencia", shortName: "Küchenpaket", eyebrow: "Komfort in der Unterkunft", tagline: "Deine vorübergehende Unterkunft alltagstauglicher machen.",
    description: "Ein Paket für Familien, Gäste im Homeoffice und längere Aufenthalte in Apartments mit wenigen Küchenartikeln. Beginne mit praktischen Geräten und Ergänzungen zum Essen und passe die Anfrage an deinen Aufenthalt an.",
    bestFor: ["Längere Apartmentaufenthalte", "Familien, die selbst kochen", "Gäste im Homeoffice", "Ferienwohnungen mit wenigen Küchenartikeln"],
    includedItems: [{ name: "Heißluftfritteuse oder Multikocher als Option", note: "Verfügbarkeit wird auf Anfrage bestätigt" }, { name: "Mixer oder Kaffeemaschine als Option" }, { name: "Kindergeschirr als Option" }, { name: "Weitere Küchenartikel auf Anfrage", note: "Abgestimmt darauf, was in deiner Unterkunft fehlt" }],
    addons: [{ name: "Luftreiniger", note: "Für die Raumluft in der Unterkunft" }, { name: "Mobiles Klimagerät", note: "Für warme Küchen- oder Wohnbereiche, wenn die Aufstellung geeignet ist" }, { name: "Hochstuhl", note: "Für längere Familienaufenthalte" }],
    seo: { title: "Küchenpaket für längere Aufenthalte in Valencia", description: "Frage praktische Küchenartikel und Komfort für dein Apartment in Valencia an. Für Familien, längere Aufenthalte und Gäste, die von unterwegs arbeiten.", keywords: ["Küchenartikel mieten Valencia", "Langzeitaufenthalt Valencia", "Ferienwohnung Küchenartikel Valencia"] },
    faqs: [{ question: "Ist jeder Küchenartikel sofort auf Lager?", answer: "Nein. Mit deinen Anfragen prüfen wir auch, welche Artikel gebraucht werden. Wir bestätigen den Bestand und mögliche Alternativen für jede Anfrage, bevor du dich entscheidest." }],
  },
  "turia-beach-explorer": {
    name: "Familienausflug durch die Turia-Gärten und zum Strand", shortName: "Turia und Strand", eyebrow: "Fahrradausflüge und Strandtage",
    tagline: "Durch die Gärten radeln. Im Schatten am Meer pausieren.",
    description: "Erlebt Valencia mit einem E-Bike, einem Kinderanhänger mit zwei Sitzen und einem kompakten Sonnenschutz. Erkundet die Turia-Gärten und plant eine Strandpause im Tempo eurer Kinder. Mit einer Anfrage stimmen wir Artikel, Eignungsprüfung und Lieferung gemeinsam ab.",
    bestFor: ["Eine erwachsene Person auf dem Fahrrad mit bis zu zwei Kindern, nach Eignungsprüfung", "Fahrradgröße L/XL: Körpergröße 172–195 cm", "Familien in der Nähe der Turia-Gärten oder Valencias Strände", "Flexible Ausflüge mit Zeit für Pausen"],
    includedItems: [
      { name: "Rockrider E-ACTV 100 E-Bike", note: "Ein Fahrrad mit tiefem Rahmen, perlgrau, L/XL (172–195 cm). Bestand und passende Größe bestätigen wir für deine Termine." },
      { name: "Hamax Pioneer Anhänger mit zwei Sitzen", note: "Ein Anhänger mit zwei Sitzen. Wir prüfen die Eignung für die Kinder und die konkrete Fahrradkupplung vor der Bestätigung." },
      { name: "Kompakter Strand-Sonnenschutz", note: "Schatten für eure Strandpause. Wir bestätigen, wie der verpackte Sonnenschutz mit dem Anhänger transportiert werden kann." },
    ],
    addons: [
      { name: "Kühlbox für Getränke und Snacks", note: "Optional, nur wenn die ausgewählte Kühlbox in den vorgesehenen Laderaum passt und die Lastgrenzen eingehalten werden." },
      { name: "Sandspielzeug", note: "Ein kleines Set für den Strand, abhängig vom Alter der Kinder und vom verfügbaren Stauraum." },
    ],
    seo: { title: "E-Bike und Kinderanhänger mieten in Valencia", description: "Plane einen Familienausflug in Valencia mit E-Bike, Hamax-Anhänger und Sonnenschutz. Frage Termine, passende Größen und Lieferung gemeinsam an.", keywords: ["E-Bike Kinderanhänger mieten Valencia", "Familienausflug Turia Fahrrad", "Strandpaket Valencia"] },
    faqs: [
      { question: "Was umfasst die Anfrage?", answer: "Ein Rockrider E-ACTV 100 E-Bike in L/XL, ein Hamax Pioneer mit zwei Sitzen und ein kompakter Strand-Sonnenschutz. Kühlbox und Sandspielzeug kannst du ergänzen. Wir bestätigen alle Artikel, Helme, Schloss, Transportmöglichkeiten und Gesamtpreis vor der Zahlung." },
      { question: "Kann ich sofort buchen und bezahlen?", answer: "Dieses Paket gibt es auf Anfrage. Nenne Termine, Lage der Unterkunft, Körpergröße der fahrenden Person und Alter der Kinder. Wir bestätigen Bestand, Eignung, Lieferung und Abholung und senden dir ein vollständiges Angebot. Die Anfrage reserviert keine Artikel und löst keine Zahlung aus." },
      { question: "Passt das Fahrrad jeder erwachsenen Person?", answer: "Das gewählte Modell ist das Rockrider E-ACTV 100 mit tiefem Rahmen in L/XL, angegeben für 172–195 cm Körpergröße. Nenne die Körpergröße in deiner Anfrage. Falls die Größe nicht passt, besprechen wir Alternativen vor einer Bestätigung." },
      { question: "Können zwei Kinder im Anhänger mitfahren?", answer: "Der Hamax Pioneer hat zwei Sitze. Die Eignung hängt von Alter, Größe und Gewicht jedes Kindes sowie den Herstellergrenzen ab. Nenne die ungefähren Maße und das Alter, damit wir die Zusammenstellung prüfen können. Wir prüfen auch Helmgrößen und Fahrradkupplung." },
      { question: "Passen Kühlbox und Sonnenschutz neben die Kinder?", answer: "Nur in den vorgesehenen Laderaum und innerhalb der Lastgrenzen. Wir prüfen Packmaße und Gewicht der Ergänzungen vor der Bestätigung. Die Kindersitze müssen frei von Gepäck bleiben. Plane eine volle Kühlbox erst ein, wenn ihre Eignung bestätigt ist." },
      { question: "Ist das eine geführte Tour?", answer: "Nein, du mietest Artikel für euren eigenen Ausflug. Lieferung und Abholung werden für eure Unterkunft angeboten. Wir helfen bei der Planung rund um die Turia-Gärten und eine Strandpause. Wetter, Fahrbedingungen und örtliche Zugangsregeln bestimmen die Route. Fahrrad und Anhänger sind für geeignete befestigte Wege vorgesehen, nicht für Sand." },
    ],
  },
  "family-beach-kit": {
    name: "Strandpaket für Familien in Valencia", shortName: "Strandpaket für Familien", eyebrow: "Strand und Outdoor", tagline: "Schatten, kühle Getränke, Spielzeug und Platz für den Transport.",
    description: "Ein praktischer Ausgangspunkt für Strandtage mit Kindern an Malvarrosa, Patacona, Cabanyal oder El Saler. Beginne mit den wichtigsten Artikeln und ergänze bei Bedarf etwas für Babys oder Kleinkinder.",
    bestFor: ["Strandtage mit Kindern", "Aufenthalte an Malvarrosa oder Patacona", "Familien ohne Auto", "Reisen im Juli und August"],
    includedItems: [{ name: "Strandwagen oder Bollerwagen", note: "Für Handtücher, Sonnenschutz, Spielzeug und Getränke" }, { name: "Sonnenschirm oder Strandmuschel" }, { name: "Kühltasche oder Kühlbox" }, { name: "Strandstühle oder Strandmatte" }, { name: "Sandspielzeug", note: "Ein altersgerechtes Startset" }, { name: "Wasserdichte Tasche", note: "Für Handy, Schlüssel und kleine Wertsachen" }],
    addons: [{ name: "Kompakter Kinderwagen", note: "Für müde Kleinkinder auf dem Rückweg vom Strand" }, { name: "Sonnenschirm-Set", note: "Zusätzlicher Schatten für größere Familien" }, { name: "Tragbarer Ventilator", note: "Für Mittagsschlaf, Terrasse und warme Apartments" }, { name: "Spielzeugpaket für Kleinkinder", note: "Für ruhige Momente in der Unterkunft" }],
    seo: { title: "Strandpaket für Familien mieten in Valencia", description: "Frage ein Strandpaket in Valencia mit Wagen, Schatten, Kühlbox, Stühlen und Spielzeug an. Ergänze passende Artikel für deine Familie und Unterkunft.", keywords: ["Strandpaket mieten Valencia", "Strandwagen mieten Valencia", "Strandartikel Familien Valencia"] },
    faqs: [{ question: "Könnt ihr vor unserem Strandtag liefern?", answer: "Vorgesehen ist die Lieferung zur Unterkunft vor eurem Ausflug und die Abholung nach dem Mietzeitraum. Den konkreten Ablauf bestätigen wir mit dir." }, { question: "Können wir das Paket anpassen?", answer: "Ja. Ergänzungen und Alternativen sind vorgesehen, etwa für Babys, Kleinkinder, Schatten oder Kühlung. Wir bestätigen die Zusammenstellung für deine Anfrage." }],
  },
  "baby-arrival-kit": {
    name: "Babypaket für deine Ankunft in Valencia", shortName: "Babypaket zur Ankunft", eyebrow: "Baby und Kleinkind", tagline: "Die wichtigsten Babyartikel für deine Unterkunft vor der Ankunft organisieren.",
    description: "Ein praktisches Startpaket für Eltern, die mit Babys oder jungen Kleinkindern nach Valencia reisen. Es umfasst Möglichkeiten zum Schlafen, Essen, Spazierengehen und Baden sowie Komfort in der Unterkunft.",
    bestFor: ["Babys und Kleinkinder", "Hotels und Ferienwohnungen", "Familienaufenthalte von 1–4 Wochen", "Eltern, die mit weniger Gepäck reisen möchten"],
    includedItems: [{ name: "Reisebett", note: "Mit Spannbettlaken, sofern verfügbar" }, { name: "Hochstuhl" }, { name: "Kompakter Kinderwagen" }, { name: "Babybadewanne" }, { name: "Spielmatte" }, { name: "Babyphone", note: "Abhängig vom Bestand und der Aufteilung der Unterkunft" }],
    addons: [{ name: "Doppelkinderwagen", note: "Für Zwillinge oder Geschwister" }, { name: "Babyschale", note: "Eignung und Einbau müssen sorgfältig bestätigt werden" }, { name: "Verdunkelungsrollo", note: "Für Mittagsschlaf in hellen Zimmern" }, { name: "Babytrage", note: "Für Altstadtwege und kurze Ausflüge" }],
    seo: { title: "Babypaket für die Ankunft in Valencia mieten", description: "Organisiere Babyartikel in Valencia mit Reisebett, Hochstuhl, Kinderwagen, Badewanne und Spielmatte. Frage passende Ergänzungen für eure Ankunft an.", keywords: ["Babyartikel mieten Valencia", "Babypaket Valencia", "Reisebett mieten Valencia"] },
    faqs: [{ question: "Ersetzt das Paket unser sperriges Babygepäck?", answer: "Es soll die wichtigsten sperrigen Artikel abdecken, damit du mit weniger Gepäck fliegen und vor Ort eine praktische Zusammenstellung nutzen kannst." }, { question: "Können wir unnötige Artikel weglassen?", answer: "Ja. Du kannst deine Auswahl anpassen und Alternativen anfragen. Unser Team prüft die Zusammenstellung und bestätigt die verfügbaren Möglichkeiten." }],
  },
  "toddler-city-kit": {
    name: "Stadtpaket für Kleinkinder in Valencia", shortName: "Stadtpaket für Kleinkinder", eyebrow: "Kinder und Familie", tagline: "Für Parktage, Strandpromenaden, Turia-Gärten und müde Beine.",
    description: "Ein Paket für Kleinkinder und junge Kinder, die Valencia mit ihren Eltern entdecken. Es verbindet einen Kinderwagen als Unterstützung mit Bewegung, Snacks und kleinen Spielpausen.",
    bestFor: ["Kleinkinder", "Tage in den Turia-Gärten", "Längere Stadtspaziergänge", "Familien nahe dem Zentrum oder Strand"],
    includedItems: [{ name: "Kompakter Kinderwagen" }, { name: "Kinderroller oder Laufrad", note: "Abhängig vom Alter und Bestand" }, { name: "Helm" }, { name: "Snacktablett oder kleines Reisezubehör" }, { name: "Spielzeugpaket" }, { name: "Option für zusätzliches Strandspielzeug" }],
    addons: [{ name: "Sonnenschirm-Set", note: "Für Strandtage" }, { name: "Reisebett", note: "Wenn du auch einen Schlafplatz brauchst" }, { name: "Doppelkinderwagen", note: "Für Geschwister" }],
    seo: { title: "Stadtpaket für Kleinkinder mieten in Valencia", description: "Frage ein Paket für Valencia mit Kinderwagen, Roller oder Laufrad, Helm und Spielzeug an. Ergänze passende Strandartikel für deinen Familienaufenthalt.", keywords: ["Valencia mit Kleinkindern", "Kinderroller mieten Valencia", "Kinderwagen mieten Valencia"] },
    faqs: [{ question: "Was unterscheidet es vom Babypaket zur Ankunft?", answer: "Das Babypaket konzentriert sich auf Schlafen und den Alltag mit Baby. Das Stadtpaket ist für Bewegung, Spielen und Ausflüge mit kleinen Kindern gedacht." }],
  },
};

export const germanRentalBundles = rentalBundles.map(bundle => {
  const content = germanBundleContent[bundle.slug];
  if (!content) throw new Error(`Missing German kit: ${bundle.slug}`);
  return localizeBundle(bundle, content);
});
export const getGermanBundleBySlug = (slug: string) => germanRentalBundles.find(bundle => bundle.slug === slug);

export const germanKitReviewNotes: Record<string, string[]> = {
  "turia-beach-explorer": ["Rockrider E-ACTV 100 L/XL, 172–195 cm und Hamax Pioneer stammen aus der bestehenden Paketquelle. Vor Freigabe mit dem tatsächlich gelieferten Fahrrad, Anhänger und der Kupplung abgleichen. Helme, Schloss und Lastverteilung werden weiterhin vor Zahlung bestätigt."],
  "family-beach-kit": ["Die Quelle beschreibt Lieferung vor dem Strandtag als vorgesehenen Ablauf. Der Entwurf macht die konkrete Zusage von der Bestätigung abhängig. Artikelalternativen und die übernommene Mengenangabe 2–4 bei Stühlen oder Matte prüfen."],
  "baby-arrival-kit": ["Die Quelle verspricht im Slogan einen Aufbau vor Ankunft. Der Entwurf beschreibt das Organisieren vor Ankunft; die tatsächliche Lieferzusage prüfen. Der bestehende Link car-seat-infant muss mit dem aktuellen Katalog abgeglichen werden. Spannbettlaken und Babyphone bleiben bedingt verfügbar."],
  "toddler-city-kit": ["Roller oder Laufrad hängen von Alter und Bestand ab. Die Quelle führt eine Strandspielzeug-Option bereits als Paketbestandteil; prüfen, ob sie stattdessen als Ergänzung auswählbar sein soll."],
  "remote-work-apartment-kit": ["Der bestehende Produktverweis monitor-27 fehlt im genehmigten 128-Artikel-Export. Nicht mit einem anderen Modell gleichsetzen. Der Bürostuhl steht unter Paketartikeln, ist laut Quelle jedoch optional; die Auswahlregel vor Freigabe prüfen."],
  "summer-apartment-survival-kit": ["Klimagerät nur nach Prüfung der Abluftführung zusagen. Luftreinigerhinweise aus der Quelle nicht als gesundheitliches Ergebnis verstehen. Einige Optionen stehen sowohl unter Paketartikeln als auch unter Ergänzungen; gewünschte Auswahlregeln prüfen."],
  "accessible-valencia-kit": ["Eignung, Zugang, Akkubedarf, Lieferung und sichere Nutzung müssen vor Zusage bestätigt werden. Eine Rampe darf erst nach Maß- und Sicherheitsprüfung zugesagt werden."],
  "grandparents-visiting-kit": ["Die Zusammenstellung muss zu Person und Unterkunft passen. Elektromobil und mobiles Klimagerät bleiben von Eignungs- und Aufstellungsprüfung abhängig."],
  "long-stay-kitchen-upgrade-kit": ["Die Quelle enthält interne Hinweise zum Einkauf nach Nachfrage. Der Entwurf formuliert stattdessen die für Gäste relevante Bestätigung von Bestand und Alternativen. Tatsächliches Angebot und verfügbare Küchengeräte vor Freigabe prüfen."],
};
