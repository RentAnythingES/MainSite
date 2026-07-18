import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getLocalBusinessJsonLd } from "@/lib/jsonld";
import HeroCarousel from "@/components/HeroCarousel";

export const metadata: Metadata = {
  title: "Rent Equipment in Valencia | RentAnything.es",
  description:
    "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear and more in Valencia. Check availability for your dates.",
  alternates: {
    canonical: "https://rentanything.es",
    languages: {
      en: "https://rentanything.es",
      es: "https://rentanything.es/es",
      "x-default": "https://rentanything.es",
    },
  },
};

const heroCategories = [
  {
    name: "Baby & Toddler",
    href: "/rental/baby-gear",
    image: "/categories/baby-gear.webp",
    description: "Strollers, cribs, car seats & high chairs",
  },
  {
    name: "Kids & Family",
    href: "/rental/kids-family",
    image: "/discover/turia-gardens-hero.webp",
    description: "Bikes, games, toys & family activities",
  },
  {
    name: "Mobility & Accessibility",
    href: "/rental/mobility",
    image: "/categories/mobility.webp",
    description: "Wheelchairs, scooters & walkers",
  },
  {
    name: "Remote Work",
    href: "/rental/remote-work",
    image: "/categories/remote-work.webp",
    description: "Monitors, desks, chairs & accessories",
  },
  {
    name: "Apartment Comfort",
    href: "/rental/home-living",
    image: "/categories/home-living.webp",
    description: "Air purifiers, heaters & comfort",
  },
  {
    name: "Beach & Outdoor",
    href: "/rental/travel-outdoors",
    image: "/categories/travel-outdoors.webp",
    description: "Beach gear, coolers & umbrellas",
  },
];

const trustStats = [
  { number: "Valencia", label: "Local service area" },
  { number: "EN · ES", label: "Bilingual support" },
  { number: "Flexible", label: "Short and longer rentals" },
  { number: "Local", label: "Pickup and delivery options" },
];

const howItWorks = [
  {
    step: "1",
    title: "Browse & Book",
    description:
      "Explore the rental range, choose your dates, and check live availability before payment.",
    icon: "🔍",
  },
  {
    step: "2",
    title: "We Deliver",
    description:
      "Doorstep delivery to your hotel, Airbnb, or apartment. Everything cleaned and safety-checked.",
    icon: "🚚",
  },
  {
    step: "3",
    title: "Enjoy & Return",
    description:
      "Use worry-free! When your trip ends, we pick everything up. No cleaning needed.",
    icon: "✨",
  },
];

const featuredProducts = [
  {
    name: "Compact Stroller",
    category: "Baby & Toddler",
    price: "€5 – €14",
    unit: "/ day",
    href: "/product/compact-stroller",
    image: "/products/compact-stroller.webp",
  },
  {
    name: "Lightweight Transport Wheelchair",
    category: "Mobility & Accessibility",
    price: "€5 – €12",
    unit: "/ day",
    href: "/product/transport-wheelchair",
    image: "/products/transport-wheelchair.webp",
  },
  {
    name: '27" Monitor',
    category: "Remote Work",
    price: "€7 – €21",
    unit: "/ day",
    href: "/product/monitor-27",
    image: "/products/monitor-27.webp",
  },
  {
    name: "Heavy-Duty Mobility Scooter",
    category: "Mobility & Accessibility",
    price: "€30 – €70",
    unit: "/ day",
    href: "/product/heavy-duty-mobility-scooter",
    image: "/products/heavy-duty-mobility-scooter.webp",
  },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center" id="hero">
        {/* Carousel background */}
        <div className="absolute inset-0">
          <HeroCarousel />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        </div>

        <div className="container-site relative z-20 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20">
              <span>📍</span> Now serving Valencia
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              Travel light.{" "}
              <span className="text-amber-400">
                Rent everything.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl mx-auto" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              Premium baby gear, mobility aids, remote work setups & more —
              delivered to your door in Valencia. No heavy luggage, no stress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/valencia" className="btn btn-primary btn-lg" id="hero-cta-primary">
                Browse Valencia Rentals
              </Link>
              <Link href="/how-it-works" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20" id="hero-cta-secondary">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="section bg-white" id="categories">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              What do you need?
            </h2>
            <p className="text-neutral-500 text-lg">
              Everything you need for your Valencia stay, in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {heroCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/2]"
                id={`cat-${cat.href.split("/").pop()}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-white mb-0.5" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                    {cat.description}
                  </p>
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
            {trustStats.map((stat) => (
              <div key={stat.label} className="trust-stat">
                <div className="trust-stat-number !text-white">
                  {stat.number}
                </div>
                <div className="trust-stat-label !text-teal-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section bg-white" id="featured-products">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Rentals
              </h2>
              <p className="text-neutral-500">
                Our most popular items in Valencia
              </p>
            </div>
            <Link
              href="/valencia"
              className="hidden md:inline-flex btn btn-outline btn-sm"
              id="view-all-products"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="card group"
                id={`product-${product.href.split("/").pop()}`}
              >
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <span className="badge badge-brand mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-neutral-800 mb-1 group-hover:text-brand transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-brand">
                      {product.price}
                    </span>
                    <span className="text-sm text-neutral-400">
                      {product.unit}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/valencia" className="btn btn-outline">
              View All Rentals →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section bg-neutral-50" id="how-it-works">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-neutral-500 text-lg">
              Three simple steps to a stress-free trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="text-center p-8 bg-white rounded-2xl border border-border hover:shadow-lg transition-all"
              >
                <span className="text-4xl mb-4 block">{step.icon}</span>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white text-sm font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/valencia" className="btn btn-accent btn-lg" id="how-it-works-cta">
              Start Browsing →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-gradient-to-r from-brand-dark via-brand to-brand-light py-16" id="cta-banner">
        <div className="container-site text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to travel light?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Browse our full range of premium rental equipment, delivered directly
            to your accommodation in Valencia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/valencia"
              className="btn btn-accent btn-lg"
              id="cta-browse"
            >
              Browse Rentals
            </Link>
            <Link
              href="/contact"
              className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20"
              id="cta-contact"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
