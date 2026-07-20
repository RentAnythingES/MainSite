import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSpanishDestinationsByHub } from "@/content/destinations-es";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const url = "https://rentanything.es/es/discover/attractions";
const description = "Guías prácticas de atracciones en Valencia con rutas, accesibilidad, horarios oficiales y consejos para organizar visitas en familia.";
const faqs = [
  { question: "¿Qué atracciones de Valencia necesitan más tiempo?", answer: "El Oceanogràfic puede ocupar medio día o más. El Mercado Central y la Lonja forman una ruta más compacta de dos o tres horas. Elige una atracción principal y añade solo visitas cercanas." },
  { question: "¿Debo comprar entradas con antelación?", answer: "Puede ser útil para atracciones de gran demanda, pero los horarios, precios y condiciones cambian. Compra siempre para la fecha concreta mediante la web oficial del recinto." },
  { question: "¿Las atracciones son accesibles con silla de ruedas o carrito?", answer: "Muchas ofrecen rutas adaptadas, pero los accesos, superficies y servicios varían. Consulta cada guía y confirma directamente cualquier requisito imprescindible antes de viajar." },
];

export const metadata: Metadata = {
  title: "Atracciones de Valencia: guías para planificar",
  description,
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover/attractions", es: url, "x-default": "https://rentanything.es/discover/attractions" },
  },
};

export default function SpanishAttractionsHub() {
  const guides = getSpanishDestinationsByHub("attractions");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHubCollectionJsonLd({ name: "Atracciones de Valencia", description, url, locale: "es", items: guides.map((guide) => ({ name: guide.name, url: `https://rentanything.es/es/discover/${guide.slug}` })) })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: "Inicio", url: "https://rentanything.es/es" }, { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" }, { name: "Atracciones", url }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))) }} />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site text-sm text-neutral-500"><Link href="/es" className="hover:text-brand">Inicio</Link> / <Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link> / <span className="font-medium text-neutral-800">Atracciones</span></div>
      </nav>

      <header className="relative min-h-[430px] flex items-end overflow-hidden">
        <Image src="/discover/oceanografic-valencia.jpg" alt="Arquitectura del Oceanogràfic de Valencia" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white mb-4">Planificación local</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Atracciones de Valencia</h1>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed">Elige una visita principal, calcula el tiempo real y organiza accesos, comidas y desplazamientos sin sobrecargar el día.</p>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Planifica una jornada realista</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Las atracciones de Valencia tienen escalas muy diferentes. El Oceanogràfic implica varias horas y recorridos largos; el Mercado Central y la Lonja se visitan a pie dentro del centro histórico.</p>
              <p>Consulta siempre los horarios oficiales para la fecha exacta. Añade tiempo para caminar, descansar, comer y llegar desde tu alojamiento, especialmente con niños o necesidades de movilidad.</p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">Antes de salir</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">Entradas:</strong> confirma fecha, franja horaria y política de reentrada.</li>
              <li><strong className="text-neutral-800">Familias:</strong> incluye comidas, descansos y distancia interior.</li>
              <li><strong className="text-neutral-800">Accesibilidad:</strong> verifica la entrada y los servicios esenciales.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Guías de atracciones</h2>
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
        <div className="container-site max-w-3xl"><h2 className="text-3xl font-bold mb-6">Preguntas sobre atracciones en Valencia</h2><div className="space-y-4">{faqs.map((faq) => <article key={faq.question} className="card p-6"><h3 className="font-bold mb-2">{faq.question}</h3><p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p></article>)}</div></div>
      </section>
    </>
  );
}
