import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";

export const metadata: Metadata = {
  title: "Valencia Sights & Attractions — What to See & Do",
  description: "The best sights and attractions in Valencia: City of Arts and Sciences, beaches, Bioparc, Turia Gardens & more. Honest guides from locals.",
  alternates: { canonical: "https://rentanything.es/discover/attractions" },
};

export default function AttractionsHub() {
  const destinations = getDestinationsByHub("attractions");
  return (
    <>
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/discover" className="hover:text-brand transition-colors">Discover</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">Sights & Attractions</li>
          </ol>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <span className="text-5xl block mb-4">🏛️</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Sights & Attractions</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            From the futuristic City of Arts and Sciences to quiet neighbourhood markets — the things that make Valencia worth visiting.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-site">
          {destinations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Link key={dest.slug} href={`/discover/${dest.slug}`} className="card p-6 hover:shadow-md transition-shadow group">
                  <h2 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{dest.name}</h2>
                  <p className="text-sm text-neutral-500 mb-2">{dest.tagline}</p>
                  <span className="text-sm font-semibold text-brand">Read guide →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Attraction guides coming soon — check back shortly.</p>
          )}
        </div>
      </section>
    </>
  );
}
