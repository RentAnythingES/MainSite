import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import BundleCard from "@/components/BundleCard";
import { spanishRentalBundles } from "@/data/bundles-es";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Kits y paquetes de alquiler en Valencia",
  description: "Elige kits de alquiler para playa, bebés, teletrabajo, verano, estancias largas y apoyo de movilidad durante tu estancia en Valencia.",
  alternates: {
    canonical: "https://rentanything.es/es/valencia/kits",
    languages: {
      en: "https://rentanything.es/valencia/kits",
      es: "https://rentanything.es/es/valencia/kits",
      "x-default": "https://rentanything.es/valencia/kits",
    },
  },
};

export default function SpanishValenciaKitsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Kits y paquetes de alquiler en Valencia",
            description: "Puntos de partida configurables para familias, playa, accesibilidad, teletrabajo y estancias en apartamentos de Valencia.",
            url: "https://rentanything.es/es/valencia/kits",
            locale: "es",
            items: spanishRentalBundles.map((bundle) => ({
              name: bundle.name,
              url: `https://rentanything.es/es/valencia/kits/${bundle.slug}`,
            })),
          })),
        }}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero/valencia-3.webp" alt="Equipamiento para una estancia cómoda en Valencia" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="container-site relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-md">Kits y paquetes en Valencia</span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              Viaja ligero. <span className="text-amber-400">Siéntete como en casa.</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-2xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              Empieza por la situación que más se parece a tu estancia. Cada kit reúne artículos útiles y voluminosos y nos permite adaptar la combinación final a tus fechas, alojamiento y necesidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#kits" className="btn btn-primary btn-lg">Ver kits ↓</a>
              <Link href="/es/contact" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">Solicitar algo personalizado</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" id="kits">
        <div className="container-site">
          <div className="max-w-2xl mb-10">
            <span className="badge badge-brand mb-3">Elige según tu estancia</span>
            <h2 className="text-3xl font-bold mb-3">Kits para situaciones reales en Valencia</h2>
            <p className="text-neutral-600 leading-relaxed">Los kits conectan nuestras guías locales con productos concretos. No son paquetes rígidos: son puntos de partida que adaptamos según el inventario y lo que realmente necesitas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {spanishRentalBundles.map((bundle) => (
              <BundleCard key={bundle.slug} bundle={bundle} id={`kit-${bundle.slug}`} basePath="/es/valencia/kits" ctaLabel="Ver kit →" />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 bg-white"><span className="text-3xl">1</span><h3 className="mt-3 font-bold text-lg">Empieza con un kit</h3><p className="mt-2 text-sm text-neutral-500">Elige el escenario más parecido: bebé, playa, apartamento, teletrabajo o accesibilidad.</p></div>
            <div className="card p-6 bg-white"><span className="text-3xl">2</span><h3 className="mt-3 font-bold text-lg">Ajusta la combinación</h3><p className="mt-2 text-sm text-neutral-500">Añade o quita artículos según edades, alojamiento, zona de servicio e inventario.</p></div>
            <div className="card p-6 bg-white"><span className="text-3xl">3</span><h3 className="mt-3 font-bold text-lg">Confirma disponibilidad</h3><p className="mt-2 text-sm text-neutral-500">Comprobamos la mejor opción y el precio final antes de aceptar ningún pago.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
