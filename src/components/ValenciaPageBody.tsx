import Link from "next/link";
import Image from "next/image";
import BundleCard from "@/components/BundleCard";
import { rentalBundles } from "@/data/bundles";
import ProductCard from "@/components/ProductCard";
import { getProductsFromDB } from "@/lib/product-service";
import { getHubCollectionJsonLd } from "@/lib/jsonld";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getValenciaPageBodyCopy } from "@/i18n/pages/valencia";
import { publishedGermanProducts } from "@/lib/german-catalogue";
import { spanishRentalBundles } from "@/data/bundles-es";
import { germanRentalBundles } from "@/data/bundles-de";

export default async function ValenciaPageBody({ locale }: { locale: Locale }) {
 const t = getValenciaPageBodyCopy(locale);
 const prefix = localeRegistry[locale].prefix;
 const bundles = locale === "de" ? germanRentalBundles : locale === "es" ? spanishRentalBundles : rentalBundles;
const categoryCards = [
  { name: t(0), slug: "baby-gear", image: "/categories/baby-gear.webp", desc: t(1) },
  { name: t(2), slug: "kids-family", image: "/discover/turia-gardens-hero.webp", desc: t(3) },
  { name: t(4), slug: "mobility", image: "/categories/mobility.webp", desc: t(5) },
  { name: t(6), slug: "remote-work", image: "/categories/remote-work.webp", desc: t(7) },
  { name: t(8), slug: "home-living", image: "/categories/home-living.webp", desc: t(9) },
  { name: t(10), slug: "travel-outdoors", image: "/categories/travel-outdoors.webp", desc: t(11) },
  { name: t(12), slug: "fitness-wellness", image: "/categories/sports-wellness.webp", desc: t(13) },
  {"name":getDictionary(locale).categories.eventsCelebrations.name,"slug":"events-celebrations","image":"/categories/events-celebrations.webp","desc":getDictionary(locale).categories.eventsCelebrations.desc},
];

  const products = locale === "de" ? await publishedGermanProducts() : await getProductsFromDB("valencia", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: t(14),
            description: t(15),
            url: `https://rentandroll.com${prefix}/valencia`,
            locale,
            items: products.map((product) => ({
              name: product.name,
              url: `https://rentandroll.com${prefix}/product/${product.slug}`,
            })),
          })),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/valencia-3.webp"
            alt={t(16)}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="container-site relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium border border-white/20">
                {t(17)}{" "}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {t(18)}{" "}
              <span className="text-amber-400">{t(19)}</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {t(20)}{" "}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`${prefix}/valencia/kits`} className="btn btn-primary btn-lg">
                {t(21)}{" "}</Link>
              <a href="#products" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                {t(22)}{" "}</a>
              <Link href={`${prefix}/how-it-works`} className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                {t(23)}{" "}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info Bar */}
      <section className="bg-neutral-900 py-4">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-neutral-300">
            <span>{t(24)}</span>
            <span>{t(25)}</span>
            <span>{t(26)}</span>
            <span>{t(27)}</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-white" id="categories">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">{t(28)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryCards.map((cat) => (
              <Link
                key={cat.slug}
                href={`${prefix}/rental/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
                id={`val-cat-${cat.slug}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes={cat.image === "/discover/turia-gardens-hero.webp" ? "(max-width: 767px) 120vw, (max-width: 1023px) 80vw, (max-width: 1279px) 60vw, 700px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
                />
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

      {/* Kits */}
      <section className="section bg-neutral-50" id="kits">
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="badge badge-brand mb-3">{t(29)}</span>
              <h2 className="text-3xl font-bold mb-2">{t(30)}</h2>
              <p className="text-neutral-600">
                {t(31)}{" "}</p>
            </div>
            <Link href={`${prefix}/valencia/kits`} className="btn btn-outline">
              {t(32)}{" "}</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.slice(0, 3).map((bundle) => (
              <BundleCard basePath={`${prefix}/valencia/kits`} ctaLabel={{ en: "View kit →", es: "Ver kit →", de: "Mietpaket ansehen →" }[locale]} key={bundle.slug} bundle={bundle} compact id={`val-kit-${bundle.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="section bg-white" id="products">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-2">{t(33)}</h2>
          <p className="text-neutral-500 mb-8">{products.length} {t(34)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                basePath={`${prefix}/product`} locale={locale}
                id={`val-product-${product.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Valencia Info */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t(35)}</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  {t(36)}{" "}</p>
                <p>
                  {t(37)}{" "}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand">{t(38)}</p>
                  <p className="text-sm text-neutral-500">{t(39)}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand">300+</p>
                  <p className="text-sm text-neutral-500">{t(40)}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex flex-col items-center justify-center aspect-square md:aspect-auto md:min-h-[400px]">
              <span className="text-7xl mb-4">{t(41)}</span>
              <p className="text-xl font-bold text-brand">{t(42)}</p>
              <p className="text-sm text-neutral-500 mt-1">{t(43)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Services */}
      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
            <div className="max-w-3xl">
              <span className="badge badge-brand mb-3">{t(44)}</span>
              <h2 className="text-3xl font-bold">{t(45)}</h2>
              <p className="mt-3 leading-relaxed text-neutral-600">
                {t(46)}{" "}</p>
            </div>
            <Link href={locale === "es" ? "/es/valencia/servicios-anfitriones" : `${prefix}/valencia/host-services`} className="btn btn-outline mt-6 shrink-0 md:mt-0">
              {t(47)}{" "}</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t(48)}</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            {t(49)}{" "}</p>
          <a
            href="https://wa.me/34684708013"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-lg"
          >
            {t(50)}{" "}</a>
        </div>
      </section>
    </>
  );

}
