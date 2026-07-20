import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSpanishDestinationsByHub } from "@/content/destinations-es";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const url = "https://rentanything.es/es/discover/events";
const description = "Guías de fiestas y eventos de Valencia con fechas, programas oficiales, transporte, accesibilidad y consejos para familias.";
const faqs = [
  { question: "¿Las fechas de las fiestas de Valencia cambian cada año?", answer: "Algunas fechas dependen del calendario y los programas, recorridos y horarios se actualizan cada año. Confirma siempre la edición vigente en la fuente oficial enlazada desde cada guía." },
  { question: "¿Los eventos de Valencia son gratuitos?", answer: "Muchas celebraciones en la calle son gratuitas, pero determinados conciertos, recintos o actividades requieren entrada o inscripción. Comprueba cada actividad por separado." },
  { question: "¿Se puede asistir con niños o con movilidad reducida?", answer: "Sí, pero ruido, calor, multitudes y cortes de tráfico pueden cambiar el plan. Revisa la sección de familias y accesibilidad de cada guía y confirma cualquier servicio imprescindible." },
];

export const metadata: Metadata = {
  title: "Fiestas y eventos de Valencia: guías prácticas",
  description,
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover/events", es: url, "x-default": "https://rentanything.es/discover/events" },
  },
};

export default function SpanishEventsHub() {
  const guides = getSpanishDestinationsByHub("events");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHubCollectionJsonLd({ name: "Fiestas y eventos de Valencia", description, url, locale: "es", items: guides.map((guide) => ({ name: guide.name, url: `https://rentanything.es/es/discover/${guide.slug}` })) })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: "Inicio", url: "https://rentanything.es/es" }, { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" }, { name: "Eventos", url }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))) }} />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site text-sm text-neutral-500"><Link href="/es" className="hover:text-brand">Inicio</Link> / <Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link> / <span className="font-medium text-neutral-800">Eventos</span></div>
      </nav>

      <header className="relative min-h-[430px] flex items-end overflow-hidden">
        <Image src="/discover/gran-fira-valencia.jpg" alt="Carrozas de la Batalla de Flores de Valencia" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white mb-4">Programas verificados</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Fiestas y eventos de Valencia</h1>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed">Elige la celebración adecuada y organiza fechas, rutas, transporte, multitudes y necesidades familiares con información oficial vigente.</p>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Planifica el evento, no solo la fecha</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Una fiesta puede modificar calles, transporte, ruido, horarios y afluencia en toda una zona. Nuestras guías separan las tradiciones estables de la información que necesita revisión anual.</p>
              <p>Utiliza cada guía para preparar un plan realista y confirma después el programa, recorrido, entradas y avisos operativos en la fuente oficial.</p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">Antes de asistir</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">Programa:</strong> comprueba fecha, hora, recinto y posibles cambios.</li>
              <li><strong className="text-neutral-800">Transporte:</strong> revisa cortes, desvíos y el regreso nocturno.</li>
              <li><strong className="text-neutral-800">Familias:</strong> prepara agua, descansos, protección auditiva y un punto de encuentro.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Guías de eventos</h2>
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
        <div className="container-site max-w-3xl"><h2 className="text-3xl font-bold mb-6">Preguntas sobre eventos en Valencia</h2><div className="space-y-4">{faqs.map((faq) => <article key={faq.question} className="card p-6"><h3 className="font-bold mb-2">{faq.question}</h3><p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p></article>)}</div></div>
      </section>
    </>
  );
}
