import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/i18n/getDictionary";
import { getProductsFromDB } from "@/lib/product-service";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

const t = getDictionary("es");

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Alquiler de Equipos en Valencia | RentAnything.es",
  description: "Alquila artículos de bebé, movilidad, teletrabajo y confort en Valencia, con recogida o entrega en hoteles, apartamentos y alojamientos.",
  alternates: {
    canonical: "https://rentanything.es/es/valencia",
    languages: { en: "https://rentanything.es/valencia", es: "https://rentanything.es/es/valencia", "x-default": "https://rentanything.es/valencia" },
  },
};

const categoryCards = [
  { ...t.categories.babyGear, slug: "baby-gear", image: "/categories/baby-gear.webp" },
  { name: "Niños y Familia", desc: "Bicicletas, juegos, juguetes y actividades familiares", slug: "kids-family", image: "/discover/turia-gardens-hero.webp" },
  { ...t.categories.mobility, slug: "mobility", image: "/categories/mobility.webp" },
  { ...t.categories.remoteWork, slug: "remote-work", image: "/categories/remote-work.webp" },
  { ...t.categories.homeLiving, slug: "home-living", image: "/categories/home-living.webp" },
  { ...t.categories.travelOutdoors, slug: "travel-outdoors", image: "/categories/travel-outdoors.webp" },
];

export default async function ValenciaPageES() {
  const products = await getProductsFromDB("valencia", "es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Alquiler de Equipamiento en Valencia",
            description: "Consulta equipamiento de alquiler activo para estancias en Valencia, con opciones de recogida, entrega y devolución.",
            url: "https://rentanything.es/es/valencia",
            locale: "es",
            items: products.map((product) => ({
              name: product.name,
              url: `https://rentanything.es/es/product/${product.slug}`,
            })),
          })),
        }}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero/valencia-3.webp" alt="Paseo marítimo de Valencia al atardecer" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="container-site relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium border border-white/20">
                {t.valencia.badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {t.valencia.headline}{" "}
              <span className="text-amber-400">{t.valencia.headlineAccent}</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {t.valencia.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#products" className="btn btn-primary btn-lg">{t.valencia.ctaPrimary}</a>
              <Link href="/es" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">{t.valencia.ctaSecondary}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-4">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-neutral-300">
            {t.valencia.deliveryBar.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" id="categories">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">{t.valencia.browseByCategory}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryCards.map((cat) => (
              <Link key={cat.slug} href={`/es/rental/${cat.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4]" id={`val-cat-${cat.slug}`}>
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-bold text-sm text-white mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
                  <p className="text-xs text-white/75" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50" id="products">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">{t.valencia.allProducts}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} id={`val-${product.slug}`} basePath="/es/product" />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
            <div className="max-w-3xl">
              <span className="badge badge-brand mb-3">Para equipos de alojamiento en Valencia</span>
              <h2 className="text-3xl font-bold">Equipamiento para solicitudes de huéspedes</h2>
              <p className="mt-3 leading-relaxed text-neutral-600">
                Los anfitriones y gestores pueden derivar al huésped directamente o
                consultar un proceso revisado para solicitudes recurrentes de bebé,
                movilidad, confort, teletrabajo y playa.
              </p>
            </div>
            <Link href="/es/valencia/servicios-anfitriones" className="btn btn-outline mt-6 shrink-0 md:mt-0">
              Ver servicios para anfitriones
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
