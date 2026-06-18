import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";

export const metadata: Metadata = {
  title: "Valencia Neighbourhoods — Where to Stay & Explore",
  description: "Honest guides to Valencia's best neighbourhoods: Ruzafa, El Carmen, Malvarrosa, Benimaclet & more. Find the right area for your trip.",
  alternates: { canonical: "https://rentanything.es/discover/neighbourhoods" },
};

export default function NeighbourhoodsHub() {
  const destinations = getDestinationsByHub("neighbourhoods");
  return (
    <>
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/discover" className="hover:text-brand transition-colors">Discover</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">Neighbourhoods</li>
          </ol>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <span className="text-5xl block mb-4">🏘️</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Valencia Neighbourhoods</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Every neighbourhood has its own personality. Find the one that fits your travel style — from bohemian Ruzafa to beachside Malvarrosa.
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
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dest.audiences.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs bg-neutral-100 rounded-full px-2 py-0.5 text-neutral-600 capitalize">{a.replace("-", " ")}</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-brand">Read guide →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Neighbourhood guides coming soon — check back shortly.</p>
          )}
        </div>
      </section>
    </>
  );
}
