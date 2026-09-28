import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingWidget from "@/components/BookingWidget";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { getProductBySlugFromDB } from "@/lib/product-service";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private German booking preview",
  robots: { index: false, follow: false },
};
export default async function Page() {
  if (!privateGermanPreviewEnabled()) notFound();
  const source = await getProductBySlugFromDB("stroller-travel-compact");
  if (!source) notFound();
  const product = {
    ...source,
    name: "CYBEX Coya",
    description:
      "Ein kompakter Reisebuggy für deinen Familienaufenthalt in Valencia. Prüfe vor der Buchung, ob er zu deinem Kind und deinen geplanten Wegen passt.",
  };
  return (
    <main lang="de" className="container-site py-12">
      <p className="badge">Private Sprachvorschau · Testdaten</p>
      <h1 className="text-3xl font-bold my-5">Babys und Kleinkinder</h1>
      <p className="mb-8">Kinderwagen für deinen Aufenthalt in Valencia</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="my-5">{product.description}</p>
          <h3 className="font-bold">Vor deiner Buchung</h3>
          <p className="my-3">
            Ein Kinderwagen eignet sich nicht für jeden Untergrund oder Zugang.
            Prüfe Bordsteine, Treppen und den Zugang zu deiner Unterkunft.
            Beachte die Hinweise des Herstellers.
          </p>
          <p>
            Die gefalteten Maße betragen 53,5 × 45 × 22 cm. Ob du den Buggy als
            Handgepäck mitnehmen darfst, entscheidet deine Fluggesellschaft.
            Bitte prüfe deren aktuelle Vorgaben.
          </p>
          <h3 className="font-bold mt-6">Lieferung, Abholung und Hilfe</h3>
          <p className="my-3">
            Wähle deine Mietdaten und eine verfügbare Übergabeoption. Die Kosten
            werden vor der Zahlung angezeigt. Für Termine, die persönlich
            bestätigt werden müssen, kontaktiere uns über WhatsApp.
          </p>
          <p>
            Bei kurzfristigen Buchungen kann die Bestätigung erst nach der
            Zahlung erfolgen. Falls wir die Buchung nicht bestätigen können,
            erhältst du den vollständigen Betrag zurück.
          </p>
          <a
            className="text-teal-700 underline"
            href="https://wa.me/34684708013"
          >
            Kontakt über WhatsApp
          </a>
          <p className="text-sm mt-4">
            Die deutschen Texte sind noch nicht für die Veröffentlichung
            freigegeben. Für diesen lokalen Test werden keine echten Zahlungen
            oder E-Mails ausgelöst.
          </p>
        </article>
        <BookingWidget product={product} locale="de" />
      </div>
    </main>
  );
}
