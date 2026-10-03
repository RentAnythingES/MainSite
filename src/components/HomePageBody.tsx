import Link from "next/link";
import Image from "next/image";
import { publishedGermanProducts } from "@/lib/german-catalogue";
import { getLocalBusinessJsonLd, getWebsiteJsonLd } from "@/lib/jsonld";
import HeroCarousel from "@/components/HeroCarousel";
import VerifiedReviews from "@/components/VerifiedReviews";
import { getDictionary } from "@/i18n/getDictionary";
import {
  formatHomepageProductPrice,
  selectHomepageFeaturedProducts,
  getHomepageFeaturedProducts,
} from "@/lib/homepage-products";

import { localeRegistry, type Locale } from "@/i18n/config";

export default async function HomePageBody({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const prefix = localeRegistry[locale].prefix;
  const networkCopy = {
    en: { title: "Bring local care to every rental", description: "Help travellers with equipment, deliveries and customer support in your city.", cta: "Join our Agent Network in your City" },
    es: { title: "Atención local para cada alquiler", description: "Ayuda a los viajeros con equipos, entregas y atención al cliente en tu ciudad.", cta: "Únete a nuestra red de agentes en tu ciudad" },
    de: { title: "Persönlicher Service bei jeder Miete", description: "Hilf Reisenden in deiner Stadt mit Mietartikeln, Lieferungen und persönlicher Betreuung.", cta: "Mietpartner in deiner Stadt werden" },
  };


const heroCategories = [
  { ...t.categories.babyGear, href: `${prefix}/rental/baby-gear`, image: "/categories/baby-gear.webp" },
  { ...t.categories.kidsFamily, href: `${prefix}/rental/kids-family`, image: "/discover/turia-gardens-hero.webp" },
  { ...t.categories.mobility, href: `${prefix}/rental/mobility`, image: "/categories/mobility.webp" },
  { ...t.categories.remoteWork, href: `${prefix}/rental/remote-work`, image: "/categories/remote-work.webp" },
  { ...t.categories.homeLiving, desc: { en: "Air purifiers, heaters & comfort", es: "Purificadores de aire, calefactores y comodidad", de: "Luftreiniger, Heizgeräte und Wohnkomfort" }[locale], href: `${prefix}/rental/home-living`, image: "/categories/home-living.webp" },
  { ...t.categories.travelOutdoors, href: `${prefix}/rental/travel-outdoors`, image: "/categories/travel-outdoors.webp" },
  { ...t.categories.sportsWellness, href: `${prefix}/rental/fitness-wellness`, image: "/categories/sports-wellness.webp" },
  { ...t.categories.eventsCelebrations, href: `${prefix}/rental/events-celebrations`, image: "/categories/events-celebrations.webp" },
];

const howItWorks = [
  { step: "1", ...t.home.howItWorksSteps[0], icon: "🔍" },
  { step: "2", ...t.home.howItWorksSteps[1], icon: "🚚" },
  { step: "3", ...t.home.howItWorksSteps[2], icon: "✨" },
];

  const featuredProducts = locale === "de" ? selectHomepageFeaturedProducts(await publishedGermanProducts()) : await getHomepageFeaturedProducts(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteJsonLd(locale)) }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center" id="hero">
        <div className="absolute inset-0">
          <HeroCarousel locale={locale} />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        </div>
        <div className="container-site relative z-20 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20">
              <span>📍</span> {t.home.badge.replace(/^📍\s*/, "")}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              {t.home.headline}{" "}
              <span className="text-amber-400">{t.home.headlineAccent}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl mx-auto" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {t.home.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`${prefix}/valencia`} className="btn btn-primary btn-lg" id="hero-cta-primary">
                {t.home.ctaPrimary}
              </Link>
              <Link href={`${prefix}/how-it-works`} className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20" id="hero-cta-secondary">
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="section bg-white" id="categories">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.home.categoriesTitle}</h2>
            <p className="text-neutral-500 text-lg">{t.home.categoriesSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {heroCategories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/2]" id={`cat-${cat.href.split("/").pop()}`}>
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes={cat.image === "/discover/turia-gardens-hero.webp" ? "(max-width: 767px) 67vw, (max-width: 1279px) 40vw, 480px" : "(max-width: 640px) 50vw, 33vw"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-white mb-0.5" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
                  <p className="text-xs md:text-sm text-white/80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="bg-brand py-10" id="trust-bar">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {t.home.trustStats.map((stat) => (
              <div key={stat.label} className="trust-stat">
                <div className="trust-stat-number !text-white">{stat.number}</div>
                <div className="trust-stat-label !text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VerifiedReviews locale={locale} />

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section bg-white" id="featured-products">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t.home.featuredTitle}</h2>
              <p className="text-neutral-500">{t.home.featuredSubtitle}</p>
            </div>
            <Link href={`${prefix}/valencia`} className="hidden md:inline-flex btn btn-outline btn-sm" id="view-all-products">
              {t.home.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.slug} href={`${prefix}/product/${product.slug}`} className="card group" id={`product-${product.slug}`}>
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="p-4">
                  <span className="badge badge-brand mb-2">{product.subcategory}</span>
                  <h3 className="font-bold text-neutral-800 mb-1 group-hover:text-brand transition-colors">{product.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-brand">{formatHomepageProductPrice(product)}</span>
                    <span className="text-sm text-neutral-400">{{ en: "/ day", es: "/ día", de: "/ Tag" }[locale]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href={`${prefix}/valencia`} className="btn btn-outline">{{ en: "View All Rentals →", es: "Ver todos los alquileres →", de: "Alle Mietartikel ansehen →" }[locale]}</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section bg-neutral-50" id="how-it-works">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.home.howItWorksTitle}</h2>
            <p className="text-neutral-500 text-lg">{t.home.howItWorksSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center p-8 bg-white rounded-2xl border border-border hover:shadow-lg transition-all">
                <span className="text-4xl mb-4 block">{step.icon}</span>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white text-sm font-bold mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={`${prefix}/valencia`} className="btn btn-accent btn-lg" id="how-it-works-cta">{t.home.startBrowsing}</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-gradient-to-r from-brand-dark via-brand to-brand-light py-16" id="cta-banner">
        <div className="container-site text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.home.ctaBannerTitle}</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">{t.home.ctaBannerSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`${prefix}/valencia`} className="btn btn-accent btn-lg" id="cta-browse">{t.home.browseRentals}</Link>
            <Link href={`${prefix}/contact`} className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20" id="cta-contact">{t.home.contactUs}</Link>
          </div>
        </div>
      </section>
      <section className="bg-teal-50 py-12"><div className="container-site text-center"><h2 className="text-2xl font-bold mb-3">{networkCopy[locale].title}</h2><p className="text-neutral-600 mb-5">{networkCopy[locale].description}</p><Link className="btn btn-primary" href={`${prefix}/agent-network`}>{networkCopy[locale].cta}</Link></div></section>
    </>
  );
}
