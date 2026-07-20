import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedSpanishDestinations, getSpanishDestinationsByHub } from "@/content/destinations-es";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

const url = "https://rentanything.es/es/discover";

export const metadata: Metadata = {
  title: "Descubre Valencia: playas y guías locales",
  description: "Guías prácticas en español para conocer Valencia, empezando por sus playas urbanas, accesos, servicios y planificación local.",
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover", es: url, "x-default": "https://rentanything.es/discover" },
  },
};

export default function SpanishDiscoverHub() {
  const guides = getPublishedSpanishDestinations();
  const beachGuides = getSpanishDestinationsByHub("beaches");
  const attractionGuides = getSpanishDestinationsByHub("attractions");
  const eventGuides = getSpanishDestinationsByHub("events");
  const dayTripGuides = getSpanishDestinationsByHub("day-trips");
  const neighbourhoodGuides = getSpanishDestinationsByHub("neighbourhoods");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Descubre Valencia",
            description: "Guías locales en español para planificar playas y experiencias en Valencia.",
            url,
            locale: "es",
            items: guides.map((guide) => ({ name: guide.name, url: `${url}/${guide.slug}` })),
          })),
        }}
      />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site text-sm text-neutral-500">
          <Link href="/es" className="hover:text-brand">Inicio</Link> / <span className="font-medium text-neutral-800">Descubre Valencia</span>
        </div>
      </nav>

      <header className="relative min-h-[440px] flex items-center overflow-hidden">
        <Image src="/hero/valencia-1.webp" alt="Vista de Valencia al atardecer" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-site relative z-10 py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white mb-5">Guías locales</span>
          <h1 className="max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5">Descubre Valencia</h1>
          <p className="max-w-2xl text-lg text-white/90 leading-relaxed mb-8">
            Información práctica para elegir zonas, organizar desplazamientos y preparar cada día con menos equipaje y más confianza.
          </p>
          <a href="#guias" className="btn btn-primary btn-lg">Ver guías</a>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-3">Explora por tema</h2>
          <p className="max-w-3xl text-neutral-600 mb-8">
            Publicamos cada sección en español cuando sus guías están traducidas, revisadas y conectadas con información útil para planificar la visita.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/es/discover/neighbourhoods" className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
              <Image src="/discover/hubs/neighbourhoods.webp" alt="Barrios de Valencia" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Barrios de Valencia</h3>
                <p className="mt-1 text-white/85">Compara ambiente, transporte, descanso y vida diaria.</p>
                <span className="mt-3 inline-block text-sm font-semibold">{neighbourhoodGuides.length} guías disponibles →</span>
              </div>
            </Link>
            <Link href="/es/discover/beaches" className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
              <Image src="/discover/malvarrosa-beach.webp" alt="Playas de Valencia" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Playas de Valencia</h3>
                <p className="mt-1 text-white/85">Compara accesos, ambiente, servicios y opciones para familias.</p>
                <span className="mt-3 inline-block text-sm font-semibold">{beachGuides.length} guías disponibles →</span>
              </div>
            </Link>
            <Link href="/es/discover/attractions" className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
              <Image src="/discover/oceanografic-valencia.jpg" alt="Atracciones de Valencia" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Atracciones de Valencia</h3>
                <p className="mt-1 text-white/85">Organiza visitas, tiempos, accesibilidad y desplazamientos.</p>
                <span className="mt-3 inline-block text-sm font-semibold">{attractionGuides.length} guías disponibles →</span>
              </div>
            </Link>
            <Link href="/es/discover/events" className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
              <Image src="/discover/gran-fira-valencia.jpg" alt="Fiestas y eventos de Valencia" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Fiestas y eventos</h3>
                <p className="mt-1 text-white/85">Prepara fechas, programas, transporte y multitudes.</p>
                <span className="mt-3 inline-block text-sm font-semibold">{eventGuides.length} guías disponibles →</span>
              </div>
            </Link>
            <Link href="/es/discover/day-trips" className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
              <Image src="/discover/cullera-day-trip.jpg" alt="Excursiones desde Valencia" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Excursiones desde Valencia</h3>
                <p className="mt-1 text-white/85">Compara castillos, costa, transporte y tiempos reales.</p>
                <span className="mt-3 inline-block text-sm font-semibold">{dayTripGuides.length} guías disponibles →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50" id="guias">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Guías disponibles en español</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/es/discover/${guide.slug}`} className="card overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-56">
                  <Image src={guide.heroImage} alt={guide.heroImageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="p-6">
                  <span className="badge badge-brand text-xs">Guía local</span>
                  <h3 className="text-xl font-bold mt-3 mb-2 group-hover:text-brand">{guide.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{guide.tagline}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand">Leer la guía →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
