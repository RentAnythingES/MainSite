import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getLocalBusinessJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Rent Baby Gear, Mobility & Tech in Valencia | RentAnything.es",
  description:
    "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear & more. Delivered to your accommodation in Valencia. Book today!",
};

const heroCategories = [
  {
    name: "Strollers & Wagons",
    href: "/rental/baby-gear/strollers",
    emoji: "🍼",
    description: "Compact & double strollers, wagons",
    color: "from-teal-500/10 to-teal-600/5",
  },
  {
    name: "Wheelchairs",
    href: "/rental/mobility/wheelchairs",
    emoji: "♿",
    description: "Standard, transport & bariatric",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    name: "Remote Working",
    href: "/rental/remote-work",
    emoji: "💻",
    description: "Monitors, desks, chairs & keyboards",
    color: "from-purple-500/10 to-purple-600/5",
  },
  {
    name: "Sleep & Nursery",
    href: "/rental/baby-gear/sleep-nursery",
    emoji: "😴",
    description: "Cribs, bassinets, travel cots",
    color: "from-pink-500/10 to-pink-600/5",
  },
  {
    name: "Home Air Quality",
    href: "/rental/home-living/air-quality",
    emoji: "🌬️",
    description: "Purifiers, dehumidifiers, heaters",
    color: "from-sky-500/10 to-sky-600/5",
  },
  {
    name: "Mobility Scooters",
    href: "/rental/mobility/scooters",
    emoji: "🛵",
    description: "Lightweight & heavy-duty scooters",
    color: "from-emerald-500/10 to-emerald-600/5",
  },
];

const trustStats = [
  { number: "4,000+", label: "Rentals delivered" },
  { number: "5★", label: "Google reviews" },
  { number: "24h", label: "Delivery available" },
  { number: "100%", label: "Sanitised gear" },
];

const howItWorks = [
  {
    step: "1",
    title: "Browse & Book",
    description:
      "Explore our selection of premium gear. Choose your dates, add extras, and book instantly.",
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
    category: "Baby & Children",
    price: "€5 – €14",
    unit: "/ day",
    href: "/product/compact-stroller",
    image: "/products/compact-stroller.png",
  },
  {
    name: "Standard Wheelchair",
    category: "Mobility Aid",
    price: "€6 – €15",
    unit: "/ day",
    href: "/product/standard-wheelchair",
    image: "/products/standard-wheelchair.png",
  },
  {
    name: '27" Monitor',
    category: "Remote Work",
    price: "€7 – €21",
    unit: "/ day",
    href: "/product/monitor-27",
    image: "/products/monitor-27.png",
  },
  {
    name: "Heavy-Duty Mobility Scooter",
    category: "Mobility Aid",
    price: "€30 – €70",
    unit: "/ day",
    href: "/product/heavy-duty-mobility-scooter",
    image: "/products/heavy-duty-mobility-scooter.png",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-teal-50/30" id="hero">
        <div className="container-site py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6">
              <span>📍</span> Now serving Valencia
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Travel light.{" "}
              <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
                Rent everything.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Premium baby gear, mobility aids, remote work setups & more —
              delivered to your door in Valencia. No heavy luggage, no stress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/valencia" className="btn btn-primary btn-lg" id="hero-cta-primary">
                Browse Valencia Rentals
              </Link>
              <Link href="/how-it-works" className="btn btn-outline btn-lg" id="hero-cta-secondary">
                How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
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
                className={`card group p-6 md:p-8 bg-gradient-to-br ${cat.color} border-transparent hover:border-brand/20`}
                id={`cat-${cat.href.split("/").pop()}`}
              >
                <span className="text-3xl md:text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <h3 className="text-sm md:text-base font-bold text-neutral-800 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500">
                  {cat.description}
                </p>
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
