import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import BundleCard from "@/components/BundleCard";
import { rentalBundles } from "@/data/bundles";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Rent Baby Gear, Wheelchairs & Tech in Valencia",
  description:
    "Browse our full range of rental equipment in Valencia. Strollers, wheelchairs, mobility scooters, remote work setups & more. Delivered to your door.",
};

const categoryCards = [
  { name: "Baby & Toddler", slug: "baby-gear", image: "/categories/baby-gear.png", desc: "Cots, strollers, high chairs, baby setup" },
  { name: "Mobility & Accessibility", slug: "mobility", image: "/categories/mobility.png", desc: "Wheelchairs, scooters, walkers" },
  { name: "Remote Work", slug: "remote-work", image: "/categories/remote-work.png", desc: "Monitors, desks, ergonomic chairs" },
  { name: "Apartment Comfort", slug: "home-living", image: "/categories/home-living.png", desc: "Air purifiers, AC units, kitchen" },
  { name: "Beach & Outdoor", slug: "travel-outdoors", image: "/categories/travel-outdoors.png", desc: "Beach gear, shade, recreation" },
];

export default function ValenciaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/valencia-3.png"
            alt="Valencia beach promenade at golden hour"
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
                📍 Valencia, Spain
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Rental Equipment{" "}
              <span className="text-amber-400">in Valencia</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              Everything you need for your Valencia trip — baby gear, mobility aids,
              remote work setups & more. Premium brands, delivered to your hotel,
              Airbnb, or apartment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/valencia/kits" className="btn btn-primary btn-lg">
                Start with a Kit
              </Link>
              <a href="#products" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                Browse Products ↓
              </a>
              <Link href="/how-it-works" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                How It Works
              </Link>
            </div>
          </div>
        </div>
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
                className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
                id={`val-cat-${cat.slug}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
              <span className="badge badge-brand mb-3">New planning layer</span>
              <h2 className="text-3xl font-bold mb-2">Start with a Valencia kit</h2>
              <p className="text-neutral-600">
                Not sure which individual items you need? Choose the stay type first, then adjust the setup around your dates, accommodation, and inventory.
              </p>
            </div>
            <Link href="/valencia/kits" className="btn btn-outline">
              View all kits
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rentalBundles.slice(0, 3).map((bundle) => (
              <BundleCard key={bundle.slug} bundle={bundle} compact id={`val-kit-${bundle.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="section bg-white" id="products">
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
            href="https://wa.me/34684708013"
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
