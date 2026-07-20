import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSpanishDestinationsByHub } from "@/content/destinations-es";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const url = "https://rentanything.es/es/discover/day-trips";
const description = "Compara excursiones desde Valencia con transporte, tiempos realistas, accesibilidad y rutas prácticas para organizar el día.";
const faqs = [
  { question: "¿Qué excursión desde Valencia es más sencilla sin coche?", answer: "Depende del horario y del traslado final. Buñol conecta con Cercanías, mientras que Cullera requiere planificar además el tramo entre la estación, el castillo y la playa. Comprueba siempre el último regreso." },
  { question: "¿Puedo combinar castillo y playa en una excursión?", answer: "Cullera permite visitar el castillo por la mañana y una playa por la tarde. Elige una sola zona de costa y añade los traslados locales al horario." },
  { question: "¿Los horarios de transporte son estables todo el año?", answer: "No. Cercanías, autobuses locales y servicios turísticos pueden cambiar por obras, temporada o eventos. Verifica los operadores oficiales para la fecha concreta." },
];

export const metadata: Metadata = {
  title: "Excursiones desde Valencia: guías prácticas",
  description,
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover/day-trips", es: url, "x-default": "https://rentanything.es/discover/day-trips" },
  },
};

export default function SpanishDayTripsHub() {
  const guides = getSpanishDestinationsByHub("day-trips");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHubCollectionJsonLd({ name: "Excursiones desde Valencia", description, url, locale: "es", items: guides.map((guide) => ({ name: guide.name, url: `https://rentanything.es/es/discover/${guide.slug}` })) })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: "Inicio", url: "https://rentanything.es/es" }, { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" }, { name: "Excursiones", url }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))) }} />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site text-sm text-neutral-500"><Link href="/es" className="hover:text-brand">Inicio</Link> / <Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link> / <span className="font-medium text-neutral-800">Excursiones</span></div>
      </nav>

      <header className="relative min-h-[430px] flex items-end overflow-hidden">
        <Image src="/discover/cullera-day-trip.jpg" alt="Playa y montaña de Cullera" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white mb-4">Más allá de la ciudad</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Excursiones desde Valencia</h1>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed">Elige una experiencia clara, confirma el transporte y reserva tiempo real para traslados, calor, comidas y accesibilidad.</p>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Elige por experiencia, no solo por distancia</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Buñol ofrece castillo, casco antiguo y paisaje interior. Cullera combina patrimonio en la ladera con una tarde en la costa. Ambas excursiones necesitan comprobar el regreso antes de salir.</p>
              <p>No intentes abarcar todos los puntos. Elige una visita principal, añade una segunda parte flexible y conserva margen para el traslado local.</p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">Antes de reservar el día</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">Ida y vuelta:</strong> guarda el último servicio práctico.</li>
              <li><strong className="text-neutral-800">Accesos:</strong> confirma cuestas, ascensores y traslados.</li>
              <li><strong className="text-neutral-800">Temporada:</strong> revisa calor, playa y eventos locales.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Guías de excursiones</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/es/discover/${guide.slug}`} className="card overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-56"><Image src={guide.heroImage} alt={guide.heroImageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 50vw" /></div>
                <div className="p-6"><h3 className="text-xl font-bold mb-2 group-hover:text-brand">{guide.name}</h3><p className="text-sm text-neutral-600 leading-relaxed">{guide.tagline}</p><span className="mt-4 inline-block text-sm font-semibold text-brand">Ver guía completa →</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-3xl"><h2 className="text-3xl font-bold mb-6">Preguntas sobre excursiones desde Valencia</h2><div className="space-y-4">{faqs.map((faq) => <article key={faq.question} className="card p-6"><h3 className="font-bold mb-2">{faq.question}</h3><p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p></article>)}</div></div>
      </section>
    </>
  );
}
