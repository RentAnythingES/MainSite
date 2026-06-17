import Link from "next/link";
import type { Metadata } from "next";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Rent Baby Gear, Wheelchairs & Tech in Valencia",
  description:
    "Browse our full range of rental equipment in Valencia. Strollers, wheelchairs, mobility scooters, remote work setups & more. Delivered to your door.",
};

const categoryCards = [
  { name: "Baby & Children", slug: "baby-gear", emoji: "👶", desc: "Strollers, cribs, car seats, high chairs" },
  { name: "Mobility Aid", slug: "mobility", emoji: "♿", desc: "Wheelchairs, scooters, walkers" },
  { name: "Remote Work", slug: "remote-work", emoji: "💻", desc: "Monitors, desks, ergonomic chairs" },
  { name: "Home & Living", slug: "home-living", emoji: "🏠", desc: "Air purifiers, AC units, kitchen" },
  { name: "Travel & Outdoors", slug: "travel-outdoors", emoji: "🏖️", desc: "Beach gear, camping, recreation" },
];

export default function ValenciaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light py-16 md:py-24 overflow-hidden">
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-sm font-medium mb-6">
              📍 Valencia, Spain
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Rental Equipment{" "}
              <span className="text-accent-light">in Valencia</span>
            </h1>
            <p className="text-lg text-teal-100 leading-relaxed mb-8 max-w-2xl">
              Everything you need for your Valencia trip — baby gear, mobility aids,
              remote work setups & more. Premium brands, delivered to your hotel,
              Airbnb, or apartment.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#products" className="btn btn-accent btn-lg">
                Browse All Products ↓
              </a>
              <Link href="/how-it-works" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                How It Works
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Delivery Info Bar */}
      <section className="bg-neutral-900 py-4">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-neutral-300">
            <span>🚚 Free delivery on orders over €50</span>
            <span>📍 City centre & beach areas</span>
            <span>🧼 100% sanitised gear</span>
            <span>⚡ Same-day delivery available</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-white" id="categories">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryCards.map((cat) => (
              <Link
                key={cat.slug}
                href={`/rental/${cat.slug}`}
                className="card p-5 text-center group hover:border-brand/30"
                id={`val-cat-${cat.slug}`}
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-neutral-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="section bg-neutral-50" id="products">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-2">All Valencia Rentals</h2>
          <p className="text-neutral-500 mb-8">{products.length} products available</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
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
              <h2 className="text-3xl font-bold mb-6">Why Rent in Valencia?</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Valencia welcomes over 5 million tourists every year. Whether you&apos;re here
                  for the beaches, the Fallas festival, the City of Arts and Sciences, or a
                  remote work stint — you shouldn&apos;t have to fly with heavy equipment.
                </p>
                <p>
                  We deliver premium rental gear directly to your hotel, Airbnb, or apartment
                  anywhere in the city centre and beach areas. Everything is professionally
                  cleaned and safety-checked between every rental.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand">5M+</p>
                  <p className="text-sm text-neutral-500">Annual visitors</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-brand">300+</p>
                  <p className="text-sm text-neutral-500">Sunny days / year</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex flex-col items-center justify-center aspect-square md:aspect-auto md:min-h-[400px]">
              <span className="text-7xl mb-4">🏖️</span>
              <p className="text-xl font-bold text-brand">Valencia</p>
              <p className="text-sm text-neutral-500 mt-1">City centre & beach delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need something specific?</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Can&apos;t find what you&apos;re looking for? Message us on WhatsApp and we&apos;ll try to source it.
          </p>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-lg"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
}
