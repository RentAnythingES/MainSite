/** Private translations of the existing site policies/help, pending owner/legal review. */
export type InformationPageContent = {
  title: string;
  intro?: string;
  sourceDate?: string;
  reviewNotes?: string[];
  sections: { title: string; paragraphs?: string[]; bullets?: string[] }[];
};

export const germanInformation: Record<string, InformationPageContent> = {
  about: {
    title: "Über Rent&Roll",
    intro: "Mit leichtem Gepäck reisen. Sich wie zu Hause fühlen. Rent&Roll hilft dir, auf Reisen weniger sperrige Dinge mitzunehmen, zu kaufen und unterzubringen. Wähle passende Mietartikel und eine verfügbare Abhol- oder Lieferoption in Valencia.",
    sections: [
      { title: "Warum es Rent&Roll gibt", paragraphs: ["Familien, Menschen, die unterwegs arbeiten, und Reisende mit Mobilitätsbedarf brauchen manche Dinge nur für einen Teil ihres Aufenthalts. Sie von zu Hause mitzubringen bedeutet zusätzliches Gepäck. Vor Ort neu zu kaufen verursacht Kosten und Abfall.", "Wir bauen unseren Mietkatalog zunächst für Valencia auf. Hier kannst du konkrete Produkte vergleichen, die Verfügbarkeit für deine Reisedaten prüfen und die beim Buchen angebotene Übergabe wählen.", "Unser Ziel: Mietartikel vorübergehend einfacher und bequemer nutzen – mit Unterstützung von Menschen, die den Service vor Ort kennen."] },
      { title: "Unser erster Standort: Valencia, Spanien", paragraphs: ["Wir beginnen in Valencia und richten unseren Service auf die Bedürfnisse vor Ort aus."] },
      { title: "Sinnvoll wiederverwenden", paragraphs: ["Durch Mieten können mehr Reisende praktische Dinge nutzen, ohne sie für jeden Aufenthalt neu zu kaufen."] },
      { title: "Klare Produktinformationen", paragraphs: ["Wir nennen Marken, Modelle und geprüfte technische Angaben, damit du passende Mietartikel für deinen Aufenthalt auswählen kannst."] },
      { title: "Gereinigt und geprüft", paragraphs: ["Zwischen den Vermietungen reinigen und prüfen wir die Artikel im Rahmen unserer betrieblichen Abläufe."] },
      { title: "Persönliche Unterstützung", paragraphs: ["Melde dich direkt bei uns, wenn du Hilfe bei der Auswahl, der Übergabe oder einer Buchungsänderung brauchst."] },
      { title: "Unternehmensangaben", paragraphs: ["Escalera Labs S.L. · CIF ESB22961221 · In Spanien eingetragen · Burjassot, Valencia", "E-Mail: hello@rentandroll.com · Unterstützung auch über WhatsApp."] },
      { title: "Wie können wir dir helfen?", paragraphs: ["Frag uns zu einem Produkt, deiner Buchung oder einer Partnerschaft. Über Kontakt erreichst du unser Team; häufige Fragen beantworten wir in den FAQ."] },
    ],
    reviewNotes: ["Entwurf auf Basis der bestehenden englischen Über-uns-Seite. Aussagen zu geprüften Angaben sowie Reinigung und Kontrolle vor Freigabe mit den tatsächlichen Abläufen abgleichen."],
  },
  faq: {
    title: "Häufige Fragen",
    intro: "Antworten rund ums Mieten in Valencia. Deine Frage ist noch offen? Schreib uns über die Kontaktseite.",
    sections: [
      { title: "Wie buche ich?", paragraphs: ["Öffne einen Mietartikel, wähle Beginn und Ende mit Datum und Uhrzeit sowie Selbstabholung oder eine verfügbare Lieferoption. Prüfe dann die Verfügbarkeit. Ist der Artikel verfügbar, gib deine Daten ein und gehe zur sicheren Zahlung über Stripe. Nach bestätigter Zahlung schicken wir dir die Buchungsdetails per E-Mail."] },
      { title: "Welche Zahlungsmethoden gibt es?", paragraphs: ["Onlinebuchungen werden über Stripe bezahlt. Die verfügbaren Zahlungsmethoden siehst du direkt bei Stripe. Sie können je nach Gerät, Browser und Kontoeinstellungen variieren."] },
      { title: "Ist eine Kaution erforderlich?", paragraphs: ["Unsere aktuelle Onlinebuchung fügt keine Kaution automatisch hinzu. Sollte für eine bestimmte Vermietung künftig eine Kaution erforderlich sein, erfährst du Betrag und Rückgabebedingungen vor der Zahlung."] },
      { title: "Wie früh sollte ich buchen?", paragraphs: ["Wir empfehlen mindestens 48 Stunden Vorlauf, besonders während der Fallas im März, im Sommer von Juni bis September und zu Weihnachten. Einzelne Artikel können auch am selben Tag verfügbar sein. Frag uns dazu über WhatsApp."] },
      { title: "Kann ich meine Buchung ändern oder stornieren?", paragraphs: ["Melde dich möglichst früh per WhatsApp oder E-Mail. Änderungen hängen von Bestand und betrieblichen Möglichkeiten ab. Mindestens 48 Stunden vor der vereinbarten Übergabe ist eine kostenlose Stornierung möglich. Die vollständigen Bedingungen findest du unter Erstattungen und Stornierungen."] },
      { title: "Wohin liefert ihr?", paragraphs: ["Im Buchungsformular siehst du die aktuell online buchbaren Liefergebiete in Valencia. Liegt deine Adresse außerhalb, kontaktiere uns. Wir können ein individuelles Angebot für die Entfernung prüfen."] },
      { title: "Zu welchen Zeiten liefert ihr?", paragraphs: ["Mögliche Übergabezeiten hängen von Datum, Liefergebiet und Einsatzplanung ab. Wähle deine gewünschte Start- und Endzeit im Buchungsformular. Die konkreten Übergabedetails bestätigen wir mit deiner Buchung."] },
      { title: "Was kostet die Lieferung?", paragraphs: ["Liefer- und Abholkosten hängen vom gewählten Gebiet und Service ab. Der genaue Betrag wird anhand der aktiven Einstellungen berechnet und vor der Zahlung bei Stripe angezeigt. Für individuelle Entfernungen erstellen wir ein separates Angebot."] },
      { title: "Kann ich selbst abholen?", paragraphs: ["Ja. Kostenlose Selbstabholung ist an den aktiven Abholorten im Buchungsformular möglich, derzeit unter anderem in Burjassot und Paterna. Wähle deinen Abholort, bevor du die Verfügbarkeit prüfst."] },
      { title: "Wie funktioniert die Rückgabe?", paragraphs: ["Die Rückgabe richtet sich nach deiner Buchung: Bringe den Artikel zum vereinbarten Abholort zurück oder übergib ihn zur vereinbarten Zeit an der Rückholadresse, wenn du die Abholung gebucht und bezahlt hast. Die passenden Hinweise stehen in deinen Bestätigungsnachrichten."] },
      { title: "Kann ich nachträglich von Selbstabholung auf Lieferung wechseln?", paragraphs: ["Kontaktiere uns vor der Übergabe. Wenn deine bestätigte oder bezahlte Buchung noch dafür infrage kommt und wir die Lieferung organisieren können, schicken wir dir ein privates, befristetes Angebot. Du bezahlst nur die zusätzlichen Transportkosten über Stripe, bevor die Buchung aktualisiert wird."] },
      { title: "Sind die Artikel sauber und sicher?", paragraphs: ["Wir reinigen und prüfen Artikel zwischen den Vermietungen. Sicherheitsrelevante Produkte prüfen wir vor der Übergabe anhand verfügbarer Herstellerinformationen und unserer betrieblichen Abläufe."] },
      { title: "Welche Marken habt ihr?", paragraphs: ["Unser Katalog enthält je nach aktuellem Bestand unterschiedliche Marken und Modelle. Auf der jeweiligen Produktseite nennen wir die Marke und geprüfte technische Angaben, soweit sie bekannt sind."] },
      { title: "Was passiert bei einem Schaden während der Miete?", paragraphs: ["Normale Gebrauchsspuren sind zu erwarten. Melde größere Schäden bitte umgehend. Wir prüfen den Artikel und erläutern dokumentierte Reparatur- oder Ersatzkosten, bevor wir eine zusätzliche Zahlung verlangen. Die aktuelle Onlinebuchung arbeitet ohne automatische Kaution."] },
      { title: "Kann ich einen Artikel anfragen, der nicht im Katalog steht?", paragraphs: ["Ja. Schick uns Artikelwunsch, Mietzeitraum und Ort über WhatsApp. Wir prüfen, ob wir eine passende Alternative beschaffen können. Verfügbarkeit sagen wir erst nach Bestätigung zu."] },
      { title: "Wer betreibt Rent&Roll?", paragraphs: ["Rent&Roll wird von Escalera Labs S.L. betrieben, einem in Spanien eingetragenen Unternehmen. Unser Team ist in Valencia und kennt die Stadt gut."] },
      { title: "Seid ihr auch in anderen Städten verfügbar?", paragraphs: ["Wir konzentrieren uns derzeit auf Valencia. Weitere Standorte kommen erst dazu, wenn wir dort einen zuverlässigen Service vor Ort anbieten können."] },
      { title: "Arbeitet ihr mit Hotels und Unterkunftsverwaltungen zusammen?", paragraphs: ["Ja. Mit Hotels, Ferienwohnungen, Relocation-Agenturen und Unterkunftsverwaltungen können wir konkrete Mietartikel und Übergabeabläufe besprechen. Kontaktiere uns zum aktuellen Leistungsumfang."] },
    ],
    reviewNotes: ["Alle 18 Fragen der englischen FAQ sind als Entwurf übertragen. Abholorte, Vorlauf, Kaution, Stornierungsbedingungen und betriebliche Sicherheitsprüfungen vor Freigabe bestätigen.", "Die deutsche Seite für Gastgeberleistungen ist noch nicht Teil dieser Vorschau. Die entsprechende Frage verweist deshalb auf den Kontakt zum Team."],
  },
  privacy: {
    title: "Datenschutzerklärung", sourceDate: "20. Juli 2026",
    sections: [
      { title: "1. Verantwortlicher", paragraphs: ["Rent&Roll wird von Escalera Labs S.L. (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, Spanien, betrieben. Escalera Labs S.L. ist für die personenbezogenen Daten verantwortlich, die über diesen Service erhoben werden.", "Bei Datenschutzfragen erreichst du uns unter hello@rentandroll.com."] },
      { title: "2. Welche Daten wir erheben", bullets: ["Kontaktdaten wie Name, E-Mail-Adresse und Telefonnummer.", "Buchungsdaten, Mietzeiträume, ausgewählte Produkte und Hinweise zur Übergabe.", "Adressen für Selbstabholung, Lieferung und Rückholung, soweit für den gewählten Service erforderlich.", "Zahlungsreferenzen und Transaktionsstatus von Stripe; vollständige Kartendaten speichern wir nicht.", "Nachrichten, Supportanfragen sowie Einwilligungen für Newsletter und die Veröffentlichung von Bewertungen.", "Nutzungsdaten der Website, wenn du Google Analytics erlaubst."] },
      { title: "3. Zwecke und Rechtsgrundlagen", bullets: ["Vertrag und vorvertragliche Maßnahmen: Verfügbarkeit prüfen, Zahlungen abwickeln, Mietleistungen erbringen sowie Änderungen, Erstattungen und Kundendokumente bearbeiten.", "Gesetzliche Pflichten: Buchhaltung, Rechnungsstellung, steuerliche Unterlagen und rechtmäßige behördliche Anfragen.", "Berechtigte Interessen: Missbrauch verhindern, den Service absichern, Vorfälle klären und die betriebliche Unterstützung verbessern.", "Einwilligung: optionale Analyse, Werbe-E-Mails und Veröffentlichung von Kundenfeedback. Du kannst deine Einwilligung jederzeit widerrufen."] },
      { title: "4. Dienstleister und Empfänger", paragraphs: ["Wir verkaufen keine personenbezogenen Daten. Wir setzen Dienstleister ein, soweit dies für den Betrieb von Rent&Roll erforderlich ist: Stripe für Zahlungen, Supabase für Anwendungsdaten und Speicherung, Vercel für Hosting, Resend für Transaktions-E-Mails und Google Analytics nur nach deiner Einwilligung zur Analyse. Angaben zur Übergabe können an einen beauftragten Lieferdienst weitergegeben werden, soweit dies für deine Buchung erforderlich ist."] },
      { title: "5. Speicherdauer", paragraphs: ["Buchungs-, Zahlungs- und Rechnungsunterlagen bewahren wir für die nach dem geltenden Steuer-, Buchführungs- und Handelsrecht erforderlichen Zeiträume auf. Anfragen und betriebliche Unterlagen speichern wir nur so lange, wie dies angemessen erforderlich ist, um Unterstützung zu leisten, Abläufe nachzuvollziehen, Rechtsansprüche zu sichern und gesetzliche Pflichten zu erfüllen. Einwilligungsnachweise bewahren wir auf, um deine Entscheidung nachweisen zu können, bis sie nicht mehr benötigt werden."] },
      { title: "6. Deine Rechte", paragraphs: ["Soweit die jeweiligen Voraussetzungen vorliegen, kannst du Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit verlangen sowie Widerspruch einlegen. Du kannst deine Einwilligung widerrufen; die Rechtmäßigkeit der zuvor erfolgten Verarbeitung bleibt davon unberührt.", "Richte deine Anfrage an hello@rentandroll.com. Du kannst dich auch bei der spanischen Datenschutzbehörde AEPD beschweren: https://www.aepd.es/."] },
      { title: "7. Cookies und Analyse", paragraphs: ["Optionales Google Analytics wird erst geladen, wenn du die Analyse erlaubst. Deine Entscheidung wird in deinem Browser gespeichert. Unsere Cookie-Richtlinie erläutert die verwendeten Technologien und Einstellungen."] },
      { title: "8. Änderungen dieser Erklärung", paragraphs: ["Wir können diese Erklärung aktualisieren, wenn sich der Service, die Dienstleister oder rechtliche Anforderungen ändern. Die aktuelle Fassung und ihr Aktualisierungsdatum bleiben auf dieser Seite verfügbar."] },
    ],
    reviewNotes: ["Übersetzung der vorhandenen englischen Datenschutzerklärung, keine neue rechtliche Prüfung. Anbieter, Empfänger, Aufbewahrung und tatsächliche Verarbeitung vor Freigabe abgleichen."],
  },
  cookies: {
    title: "Cookie-Richtlinie", sourceDate: "20. Juli 2026",
    sections: [
      { title: "1. Cookies und Browserspeicher", paragraphs: ["Cookies sind kleine Dateien, die Websites und Dienstleister in deinem Browser speichern können. Rent&Roll verwendet außerdem Local Storage, um deine Entscheidung zur Analyse zu speichern. Local Storage ist kein Cookie; wir erläutern ihn hier, weil er ebenfalls Einstellungen speichert."] },
      { title: "2. Technologien auf der öffentlichen Website", bullets: ["rentandroll_analytics_consent: speichert deine Zustimmung oder Ablehnung im Local Storage als Einstellung, bis du sie änderst oder löschst.", "Google-Analytics-Kennungen einschließlich _ga: messen die Nutzung der Website und der Buchungsschritte erst nach deiner Zustimmung. Speicherdauer gemäß der bei Google eingestellten Laufzeit, bis zu zwei Jahre."], paragraphs: ["Beim öffentlichen Besuch werden keine Cookies für die Administratoranmeldung verwendet; diese sind autorisierten Mitarbeitenden vorbehalten."] },
      { title: "3. Einwilligung zur Analyse", paragraphs: ["Google Analytics ist optional und wird erst geladen, wenn du „Analyse erlauben“ auswählst. Website, Verfügbarkeitsprüfung und Buchung funktionieren auch bei abgelehnter Analyse. Über „Cookie-Einstellungen“ kannst du deine Entscheidung jederzeit ändern."] },
      { title: "4. Stripe und andere Drittanbieter", paragraphs: ["Wenn du zu Stripe Checkout wechselst, kann Stripe nach seinen eigenen Richtlinien Cookies oder ähnliche Technologien zur sicheren Zahlungsabwicklung und Betrugsprävention verwenden. Externe Dienste, die du über unsere Links öffnest, können ebenfalls eigene Speichereinstellungen nutzen."] },
      { title: "5. Browsereinstellungen", paragraphs: ["Du kannst Cookies und Local Storage auch in deinen Browsereinstellungen löschen. Wenn du den gesamten Browserspeicher blockierst, kann dies Einstellungen oder Funktionen der Zahlungsabwicklung bei Drittanbietern beeinträchtigen."] },
    ],
    reviewNotes: ["Übersetzung der vorhandenen Cookie-Richtlinie. Die Quellenliste nennt nur Analysepräferenz und Google Analytics; weitere bestehende Speicherung wie aktive Checkout-Sitzungen sowie alte Schlüssel vor Veröffentlichung ergänzen und rechtlich prüfen. In der privaten Vorschau ist Analytics vollständig deaktiviert."],
  },
  terms: {
    title: "Mietbedingungen", sourceDate: "20. Juli 2026",
    sections: [
      { title: "1. Anbieter und Geltungsbereich", paragraphs: ["Rent&Roll wird von Escalera Labs S.L. (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, Spanien, betrieben. Diese Bedingungen gelten für über Rent&Roll gebuchte Mietartikel und damit verbundene Übergabeleistungen."] },
      { title: "2. Verfügbarkeit und Buchungsbestätigung", paragraphs: ["Die Verfügbarkeit des ausgewählten Produkts wird für den gewählten Mietzeitraum vor der Zahlung geprüft. Eine Buchung ist bestätigt, wenn die Zahlung erfolgreich war und wir eine Buchungsbestätigung ausstellen. Falls ein betriebliches Problem die Erfüllung unmöglich macht, kontaktieren wir dich und bieten eine geeignete Alternative an oder erstatten den betroffenen Betrag."] },
      { title: "3. Preise, IVA und Zahlung", paragraphs: ["Verbraucherpreise enthalten die geltende spanische Umsatzsteuer (IVA), sofern nicht ausdrücklich anders angegeben. Vor der Zahlung zeigt der Checkout Mietpreis, ausgewählte Servicegebühren und Gesamtbetrag an. Stripe wickelt die Zahlung sicher ab. Unser aktueller Online-Checkout fügt nicht automatisch eine Kaution hinzu. Falls eine zukünftige Buchung eine Kaution erfordert, müssen Betrag und Bedingungen vor der Zahlung angezeigt werden."] },
      { title: "4. Stornierung und Erstattung", bullets: ["Mindestens 48 Stunden vor der Übergabe: vollständige Erstattung.", "Zwischen 24 und 48 Stunden vorher: 50 % Erstattung.", "Weniger als 24 Stunden vorher: keine Erstattung, soweit zwingendes Recht nichts anderes vorschreibt."], paragraphs: ["Die vollständigen Abläufe einschließlich vorzeitiger Rückgabe und Stornierung findest du in unserer Richtlinie zu Erstattungen und Stornierungen."] },
      { title: "5. Selbstabholung, Lieferung und Rückholung", paragraphs: ["Das Buchungsformular zeigt aktuell verfügbare Abholorte, Servicezonen, Zeitoptionen und Gebühren. Du bist für korrekte Kontakt- und Adressangaben verantwortlich und musst zu den vereinbarten Übergabezeiten erreichbar sein. Eine individuelle Lieferanfrage ist erst bestätigt, wenn wir ihr zugestimmt haben und eine etwaige Zusatzgebühr bezahlt wurde."] },
      { title: "6. Mietzeitraum, Änderungen und verspätete Rückgabe", paragraphs: ["Behalte die Mietartikel nur für den bestätigten Zeitraum. Verlängerungen und Änderungen der Übergabe hängen vom Bestand und den betrieblichen Möglichkeiten ab und können eine zusätzliche Zahlung erfordern. Kontaktiere uns vor der vereinbarten Rückgabezeit. Bei nicht genehmigter verspäteter Rückgabe können der zusätzliche Zeitraum und nachgewiesene Schäden durch die Beeinträchtigung einer Folgebuchung berechnet werden."] },
      { title: "7. Pflege, Verlust und Schäden", paragraphs: ["Verwende Mietartikel bestimmungsgemäß, beachte die mitgelieferten oder verlinkten Herstellerhinweise und sichere sie angemessen. Normale Gebrauchsspuren sind zu erwarten. Für nachgewiesene Reparatur- oder Ersatzkosten durch Verlust, Diebstahl, Fehlgebrauch oder Schäden über normale Gebrauchsspuren hinaus kannst du verantwortlich sein. Bevor wir eine Zahlung verlangen, erläutern wir Nachweise und Betrag."] },
      { title: "8. Sicherheit und Haftung", paragraphs: ["Prüfe, ob das Produkt für die vorgesehene Person und Verwendung geeignet ist, einschließlich Größen-, Gewichts-, Alters- und Montagegrenzen. Verwende einen Artikel nicht weiter und kontaktiere uns, wenn du Schäden oder Sicherheitsbedenken feststellst. Diese Bedingungen schließen keine Haftung aus und begrenzen sie nicht, soweit dies gesetzlich unzulässig wäre."] },
      { title: "9. Verbraucherrechte und Beschwerden", paragraphs: ["Zwingende Verbraucherrechte nach spanischem oder EU-Recht bleiben unberührt. Beschwerden kannst du an hello@rentandroll.com richten. Offizielle Verbraucherbeschwerdeformulare sind über die zuständigen spanischen Verbraucherbehörden erhältlich."] },
      { title: "10. Anwendbares Recht", paragraphs: ["Es gilt spanisches Recht. Zwingende Regelungen zur gerichtlichen Zuständigkeit bei Verbrauchersachen bleiben unberührt."] },
    ],
    reviewNotes: ["Quellentext verspricht vollständige Regelung vorzeitiger Rückgabe, die Erstattungsseite enthält sie nicht. Vor Freigabe klären.", "Quelle unterscheidet kurzfristige Buchungen mit Zahlung vor Teambestätigung nicht ausdrücklich. Mit implementierter Pending-Approval-Regel abstimmen.", "Stornierungsgrenzen, Bezugszeitpunkt Lieferung/Übergabe sowie Kautionsangaben im Produktkatalog mit den Bedingungen abgleichen. Keine neue Rechtsprüfung oder Freigabe durch diese Übersetzung."],
  },
  refunds: {
    title: "Erstattungen und Stornierungen", sourceDate: "Juni 2026",
    intro: "Du kannst bis 48 Stunden vor der geplanten Lieferung kostenlos stornieren.",
    sections: [
      { title: "Stornierungsbedingungen", bullets: ["Mindestens 48 Stunden vor Lieferung: 100 % Erstattung.", "24–48 Stunden vorher: 50 % Erstattung.", "Weniger als 24 Stunden vorher: keine Erstattung." ] },
      { title: "Kaution und Schäden", paragraphs: ["Unser aktueller Online-Checkout fügt nicht automatisch eine Kaution hinzu. Falls eine zukünftige Miete eine Kaution erfordert, legen wir Betrag, Autorisierungsverfahren, Rückgabebedingungen und mögliche Abzüge vor der Zahlung klar offen und dokumentieren sie mit dir."] },
      { title: "So stornierst du", bullets: ["Über WhatsApp – laut Quellseite der schnellste Kontaktweg.", "Per E-Mail an hello@rentandroll.com.", "Über das Formular auf unserer Kontaktseite."] },
      { title: "Abwicklung der Erstattung", paragraphs: ["Erstattungen erfolgen auf das ursprüngliche Zahlungsmittel. Je nach Bank oder Kartenanbieter kann es fünf bis zehn Werktage dauern, bis die Erstattung auf deiner Abrechnung erscheint."] },
    ],
    reviewNotes: ["Übersetzung der bestehenden Erstattungsseite. Die Mietbedingungen nennen Übergabe statt Lieferung und einen Vorbehalt für zwingendes Recht. Grenzzeiten und Selbstabholung sowie vorzeitige Rückgaben müssen vor Freigabe vereinheitlicht werden."],
  },
  "how-it-works": {
    title: "So funktioniert’s",
    intro: "Wähle passende Mietartikel für deinen Aufenthalt in Valencia und prüfe die Verfügbarkeit für deine Daten.",
    sections: [
      { title: "1. Mietartikel auswählen", paragraphs: ["Lies Produktdetails, Mietpreise und Hinweise zu Eignung, Maßen und Nutzung. Wenn du Hilfe bei der Auswahl brauchst, kontaktiere uns."] },
      { title: "2. Zeitraum und Übergabe wählen", paragraphs: ["Wähle Anfang und Ende der Miete sowie eine verfügbare Abhol- oder Lieferoption. Der Checkout zeigt die Gebühren und den Gesamtbetrag vor der Zahlung über Stripe."] },
      { title: "3. Bestätigung und Übergabe", paragraphs: ["Du erhältst die Buchungsdetails per E-Mail. Bei kurzfristigen Buchungen kann die Teambestätigung erst nach der Zahlung erfolgen. Falls wir eine solche Buchung nicht bestätigen können, wird der gezahlte Betrag vollständig auf das ursprüngliche Zahlungsmittel erstattet. Beachte den Status deiner Buchung."] },
      { title: "4. Nutzen und zurückgeben", paragraphs: ["Gib die Mietartikel zum vereinbarten Zeitpunkt zurück. Eine Rückholung ist enthalten, wenn du sie gebucht hast. Verlängerungen hängen von der Verfügbarkeit ab; kontaktiere uns vor dem Rückgabetermin."] },
      { title: "Welche Übergabe passt zu dir?", bullets: ["Selbstabholung: Wähle einen angezeigten Abholort. Es fällt keine Liefer- oder Rückholgebühr an; du organisierst den sicheren Transport.", "Nur Lieferung: Wir liefern zum Mietbeginn. Die Bestätigung erklärt die vereinbarte Rückgabe. Eine Rückholung ist nicht automatisch enthalten.", "Lieferung und Rückholung: Buche beide Wege; die jeweiligen Gebühren werden angezeigt."] },
    ],
  },
};
