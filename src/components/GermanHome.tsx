import Link from "next/link";
import { germanCategories } from "@/content/german-categories";


export default function GermanHome({prefix}: {prefix: string}) {
  return <main>
    <section className="section bg-white">
      <div className="container-site">
        <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl mb-6">Mit leichtem Gepäck nach Valencia</h1>
        <p className="text-lg text-neutral-600 max-w-3xl mb-8">Finde passende Mietartikel für deinen Aufenthalt – vom Kinderwagen bis zum Elektromobil. Prüfe deine Mietdaten und wähle eine verfügbare Abhol- oder Lieferoption.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="btn btn-primary" href={`${prefix}/valencia/kits`}>Mietpakete entdecken</Link>
          <Link className="btn" href={`${prefix}/how-it-works`}>So funktioniert’s</Link>
        </div>
      </div>
    </section>
    <section className="section bg-neutral-50">
      <div className="container-site">
        <h2 className="text-3xl font-bold mb-8">Was brauchst du für deinen Aufenthalt?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(germanCategories).map(([slug, category]) => <Link key={slug} className="card p-6" href={`${prefix}/rental/${slug}`}>
            <h3 className="text-xl font-bold mb-3">{category.title}</h3>
            <p className="text-neutral-600">{category.description}</p>
          </Link>)}
        </div>
      </div>
    </section>
    <section className="section bg-white">
      <div className="container-site">
        <h2 className="text-3xl font-bold mb-4">Wir helfen dir bei der Auswahl</h2>
        <p className="text-neutral-600 mb-6">Du hast Fragen zu einem Artikel, einer Übergabe oder deiner Buchung? Melde dich bei uns.</p>
        <div className="flex flex-wrap gap-4">
          <Link className="btn btn-primary" href={`${prefix}/contact`}>Kontakt aufnehmen</Link>
          <Link className="btn" href={`${prefix}/faq`}>Häufige Fragen</Link>
          <Link className="btn" href={`${prefix}/about`}>Über Rent&Roll</Link>
        </div>
      </div>
    </section>
  </main>;
}
