import Image from "next/image";
import Link from "next/link";
import type { SpanishDiscoverGuide } from "@/content/destinations-es";
import { getSpanishDestinationBySlug, getSpanishDestinationSources } from "@/content/destinations-es";
import { getDestinationBySlug } from "@/content/destinations";
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd, getFaqJsonLd, WEBSITE_SCHEMA_ID } from "@/lib/jsonld";
import TrackedLink from "@/components/analytics/TrackedLink";

const hubContent = {
  neighbourhoods: { label: "Barrios", badge: "Guía local de barrio", related: "Compara otros barrios" },
  beaches: { label: "Playas", badge: "Guía local de playa", related: "Compara otras playas" },
  attractions: { label: "Atracciones", badge: "Guía práctica de atracción", related: "Más atracciones de Valencia" },
  "day-trips": { label: "Excursiones", badge: "Guía de excursión", related: "Más excursiones desde Valencia" },
  events: { label: "Fiestas y eventos", badge: "Guía local de evento", related: "Más fiestas y eventos" },
} as const;

const commercialContent: Record<string, { heading: string; description: string; label: string }> = {
  "travel-outdoors": { heading: "Equipamiento de playa y exterior en Valencia", description: "Consulta sombra, sillas, toallas, neveras y accesorios disponibles para tus fechas, con recogida o entrega según la zona.", label: "Ver equipamiento de playa" },
  mobility: { heading: "Apoyo de movilidad para tu estancia", description: "Consulta sillas de ruedas, andadores, scooters y soluciones de accesibilidad disponibles para tus fechas en Valencia.", label: "Ver movilidad y accesibilidad" },
  "baby-gear": { heading: "Equipamiento para bebés en Valencia", description: "Consulta cochecitos, cunas, tronas y otros artículos para simplificar una estancia familiar en Valencia.", label: "Ver equipamiento para bebés" },
  "kids-family": { heading: "Equipamiento para niños y familias", description: "Consulta artículos para actividades, playa y desplazamientos familiares disponibles durante tu estancia.", label: "Ver artículos para familias" },
  "home-living": { heading: "Más comodidad para tu alojamiento", description: "Consulta climatización y equipamiento práctico para estancias cortas o largas en Valencia.", label: "Ver confort para apartamentos" },
  "remote-work": { heading: "Equipamiento para trabajar desde Valencia", description: "Consulta monitores, sillas y accesorios para preparar un espacio de trabajo temporal más cómodo.", label: "Ver equipamiento de teletrabajo" },
};

export default function SpanishDestinationGuidePage({ guide }: { guide: SpanishDiscoverGuide }) {
  const url = `https://rentanything.es/es/discover/${guide.slug}`;
  const sources = getSpanishDestinationSources(guide.slug);
  const englishGuide = getDestinationBySlug(guide.slug);
  const imageProvenance = englishGuide?.heroImageProvenance;
  const primaryHub = englishGuide?.hubs[0] || "attractions";
  const hub = hubContent[primaryHub];
  const commercialCategory = englishGuide?.productWidgets[0]?.categorySlug;
  const commercial = commercialCategory ? commercialContent[commercialCategory] : undefined;
  const relatedGuides = guide.relatedGuides
    .map((slug) => getSpanishDestinationBySlug(slug))
    .filter((item): item is SpanishDiscoverGuide => Boolean(item));
  const destinationJsonLd = englishGuide?.type === "event"
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.name,
        description: guide.description,
        datePublished: englishGuide.date,
        dateModified: guide.lastUpdated,
        inLanguage: "es",
        image: `https://rentanything.es${guide.heroImage}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": WEBSITE_SCHEMA_ID },
        author: { "@id": BUSINESS_SCHEMA_ID },
        publisher: { "@id": BUSINESS_SCHEMA_ID },
      }
    : {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: guide.name,
        description: guide.description,
        url,
        inLanguage: "es",
        image: `https://rentanything.es${guide.heroImage}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": WEBSITE_SCHEMA_ID },
        provider: { "@id": BUSINESS_SCHEMA_ID },
      };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Inicio", url: "https://rentanything.es/es" },
              { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" },
              { name: hub.label, url: `https://rentanything.es/es/discover/${primaryHub}` },
              { name: guide.name, url },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd(guide.faqs.map((faq) => ({ q: faq.question, a: faq.answer })))),
        }}
      />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/es" className="hover:text-brand">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link></li>
            <li>/</li>
            <li><Link href={`/es/discover/${primaryHub}`} className="hover:text-brand">{hub.label}</Link></li>
            <li>/</li>
            <li className="font-medium text-neutral-800">{guide.name}</li>
          </ol>
        </div>
      </nav>

      <header className="relative min-h-[430px] flex items-end overflow-hidden">
        <Image src={guide.heroImage} alt={guide.heroImageAlt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm mb-4">
            {hub.badge}
          </span>
          <h1 className="max-w-4xl text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {guide.name}
          </h1>
          <p className="max-w-3xl text-lg text-white/90 leading-relaxed">{guide.tagline}</p>
        </div>
      </header>

      <main>
        <section className="section bg-white">
          <div className="container-site grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-start">
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              {guide.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <aside className="card p-6 bg-teal-50/40">
              <h2 className="text-xl font-bold mb-4">Información rápida</h2>
              <dl className="space-y-4">
                {guide.quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-800">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        {guide.sections.map((section, index) => (
          <section key={section.heading} className={`section ${index % 2 === 0 ? "bg-neutral-50" : "bg-white"}`}>
            <div className="container-site max-w-4xl">
              <h2 className="text-3xl font-bold mb-5">{section.heading}</h2>
              {section.paragraphs && (
                <div className="space-y-4 text-neutral-600 leading-relaxed mb-6">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
              {section.bullets && (
                <ul className="grid md:grid-cols-2 gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="card p-4 text-sm text-neutral-600 leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <section className="section bg-teal-50/50">
          <div className={`container-site grid gap-6 ${commercial ? "lg:grid-cols-2" : "max-w-4xl"}`}>
            <div className="card p-7 bg-white">
              <h2 className="text-2xl font-bold mb-4">Consejos prácticos</h2>
              <ul className="space-y-3 text-sm text-neutral-600">
                {guide.practicalTips.map((tip) => <li key={tip}>✓ {tip}</li>)}
              </ul>
            </div>
            {commercial && commercialCategory && (
              <div className="card p-7 bg-white">
                <span className="text-sm font-semibold text-brand">Viaja ligero</span>
                <h2 className="text-2xl font-bold mt-2 mb-3">{commercial.heading}</h2>
                <p className="text-neutral-600 mb-5">{commercial.description}</p>
                <TrackedLink
                  href={`/es/rental/${commercialCategory}`}
                  eventName="discover_commercial_click"
                  eventParams={{ locale: "es", source_guide: guide.slug, target_type: "category", target_slug: commercialCategory }}
                  className="btn btn-primary"
                >
                  {commercial.label}
                </TrackedLink>
              </div>
            )}
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-site max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {guide.faqs.map((faq) => (
                <article key={faq.question} className="card p-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {relatedGuides.length > 0 && (
          <section className="section bg-neutral-50">
            <div className="container-site">
              <h2 className="text-3xl font-bold mb-6">{hub.related}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedGuides.map((related) => (
                  <TrackedLink
                    key={related.slug}
                    href={`/es/discover/${related.slug}`}
                    eventName="discover_guide_click"
                    eventParams={{ locale: "es", source_guide: guide.slug, target_guide: related.slug, placement: "related_guides" }}
                    className="card p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-bold mb-2">{related.name}</h3>
                    <p className="text-sm text-neutral-600">{related.tagline}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-brand">Leer la guía →</span>
                  </TrackedLink>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border bg-white py-8">
          <div className="container-site max-w-4xl text-sm text-neutral-500">
            <p>Contenido revisado el {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date(guide.lastUpdated))}.</p>
            {imageProvenance?.status === "licensed" && (
              <p className="mt-2">
                Foto: <a href={imageProvenance.sourceUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">{imageProvenance.creator}</a>{" "}
                (<a href={imageProvenance.licenseUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">{imageProvenance.license}</a>).
              </p>
            )}
            {sources.length > 0 && (
              <p className="mt-2">
                Fuentes consultadas: {sources.map((source, index) => (
                  <span key={source.url}>{index > 0 ? ", " : ""}<a href={source.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">{source.publisher}</a></span>
                ))}.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
