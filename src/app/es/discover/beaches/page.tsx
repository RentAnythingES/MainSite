import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedSpanishDestinations } from "@/content/destinations-es";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const url = "https://rentanything.es/es/discover/beaches";
const description = "Compara las playas de Valencia para familias, accesibilidad, transporte y naturaleza, con guías prácticas de Malvarrosa, Patacona, Pinedo y El Saler.";
const faqs = [
  { question: "¿Qué playa de Valencia está mejor conectada con el centro?", answer: "La Malvarrosa y Las Arenas suelen ser las opciones urbanas más directas. Comprueba EMT y Metrovalencia desde tu alojamiento porque las rutas y frecuencias pueden cambiar." },
  { question: "¿Malvarrosa o Patacona para ir con niños?", answer: "Las dos son adecuadas. Malvarrosa ofrece conexiones urbanas sencillas y muchos servicios; Patacona suele sentirse más tranquila y espaciosa. La distancia desde tu alojamiento puede decidir la mejor opción." },
  { question: "¿Necesito llevar todo el equipamiento de playa?", answer: "No. Lleva siempre protección solar y agua, pero puedes alquilar sombrillas, sillas, toallas, neveras y carritos para evitar comprar y transportar objetos voluminosos." },
  { question: "¿Las playas de Valencia son accesibles?", answer: "Varias playas cuentan con accesos adaptados y servicios estacionales. La disponibilidad y las fechas cambian, por lo que debes confirmar el servicio específico antes de la visita." },
];

export const metadata: Metadata = {
  title: "Playas de Valencia: guía para elegir la mejor",
  description,
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover/beaches", es: url, "x-default": "https://rentanything.es/discover/beaches" },
  },
};

export default function SpanishBeachesHub() {
  const guides = getPublishedSpanishDestinations();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHubCollectionJsonLd({ name: "Guía de playas de Valencia", description, url, locale: "es", items: guides.map((guide) => ({ name: guide.name, url: `https://rentanything.es/es/discover/${guide.slug}` })) })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: "Inicio", url: "https://rentanything.es/es" }, { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" }, { name: "Playas", url }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))) }} />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site text-sm text-neutral-500"><Link href="/es" className="hover:text-brand">Inicio</Link> / <Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link> / <span className="font-medium text-neutral-800">Playas</span></div>
      </nav>

      <header className="relative min-h-[430px] flex items-end overflow-hidden">
        <Image src="/discover/malvarrosa-beach.webp" alt="Playa urbana de Valencia junto al Mediterráneo" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white mb-4">Planificación local</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Playas de Valencia</h1>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed">Compara playas, calcula el desplazamiento y prepara solo lo que necesitas para disfrutar del Mediterráneo.</p>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Cómo elegir playa en Valencia</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>El litoral combina playas urbanas con servicios, zonas más tranquilas al norte y espacios naturales hacia el sur. La mejor elección depende de dónde te alojas, cuánto equipamiento transportas y si necesitas accesos adaptados.</p>
              <p>La Malvarrosa es un punto de partida sencillo para una primera visita y la Patacona continúa hacia el norte con un ambiente más residencial. Al sur del puerto, Pinedo destaca por su punto accesible y El Saler ofrece dunas, pinar y una jornada más natural que requiere mayor planificación.</p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">Planifica según tu grupo</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">Familias:</strong> prioriza sombra, aseos, comida y un trayecto corto cargando el equipo.</li>
              <li><strong className="text-neutral-800">Movilidad reducida:</strong> confirma accesos y asistencia estacional antes de salir.</li>
              <li><strong className="text-neutral-800">Día completo:</strong> prepara agua, sombra, asientos y conservación segura de alimentos.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Compara playas urbanas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/es/discover/${guide.slug}`} className="card overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-52"><Image src={guide.heroImage} alt={guide.heroImageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 50vw" /></div>
                <div className="p-6"><h3 className="text-xl font-bold mb-2 group-hover:text-brand">{guide.name}</h3><p className="text-sm text-neutral-600">{guide.tagline}</p><span className="mt-4 inline-block text-sm font-semibold text-brand">Ver guía completa →</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-teal-50/50">
        <div className="container-site max-w-4xl">
          <div className="card p-7 bg-white">
            <span className="text-sm font-semibold text-brand">Alquila solo lo necesario</span>
            <h2 className="text-2xl font-bold mt-2 mb-3">Equipamiento de playa en Valencia</h2>
            <p className="text-neutral-600 mb-5">Consulta sombrillas, refugios, toallas, sillas, neveras, juegos y carritos, y comprueba disponibilidad para tus fechas.</p>
            <Link href="/es/rental/travel-outdoors" className="btn btn-primary">Ver equipamiento de playa</Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-3xl"><h2 className="text-3xl font-bold mb-6">Preguntas sobre las playas de Valencia</h2><div className="space-y-4">{faqs.map((faq) => <article key={faq.question} className="card p-6"><h3 className="font-bold mb-2">{faq.question}</h3><p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p></article>)}</div></div>
      </section>
    </>
  );
}
