import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import BundleCard from "@/components/BundleCard";
import { rentalBundles } from "@/data/bundles";

export const metadata: Metadata = {
  title: "Valencia Rental Kits & Bundles",
  description:
    "Choose rental kits for your Valencia stay: baby arrival, family beach days, remote work, summer apartment comfort, and accessibility support.",
  alternates: {
    canonical: "https://rentanything.es/valencia/kits",
  },
};

export default function ValenciaKitsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/valencia-3.png"
            alt="Valencia beach and city stay essentials"
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
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-md">
              Valencia kits & bundles
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              Travel light.{" "}
              <span className="text-amber-400">Feel at home.</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-2xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              Start with the situation that fits your stay. Each kit groups the bulky, useful things people usually wish they had brought, then lets us tailor the final setup around your dates and accommodation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#kits" className="btn btn-primary btn-lg">
                Browse Kits ↓
              </a>
              <Link href="/contact" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                Request something custom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" id="kits">
        <div className="container-site">
          <div className="max-w-2xl mb-10">
            <span className="badge badge-brand mb-3">Choose by stay type</span>
            <h2 className="text-3xl font-bold mb-3">Rental kits for real Valencia situations</h2>
            <p className="text-neutral-600 leading-relaxed">
              Kits are the bridge between local planning guides and individual products. They are not rigid packages: they are starting points for a practical setup we can adapt as inventory grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rentalBundles.map((bundle) => (
              <BundleCard key={bundle.slug} bundle={bundle} id={`kit-${bundle.slug}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 bg-white">
              <span className="text-3xl">1</span>
              <h3 className="mt-3 font-bold text-lg">Start with a kit</h3>
              <p className="mt-2 text-sm text-neutral-500">Pick the closest scenario: baby arrival, beach day, apartment comfort, remote work, or accessibility support.</p>
            </div>
            <div className="card p-6 bg-white">
              <span className="text-3xl">2</span>
              <h3 className="mt-3 font-bold text-lg">Adjust the setup</h3>
              <p className="mt-2 text-sm text-neutral-500">Add or remove items based on ages, accommodation, delivery area, and what we actually have available.</p>
            </div>
            <div className="card p-6 bg-white">
              <span className="text-3xl">3</span>
              <h3 className="mt-3 font-bold text-lg">Confirm availability</h3>
              <p className="mt-2 text-sm text-neutral-500">Until online kit checkout is fully configured, we can confirm the best option directly and avoid overpromising stock.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
