import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const hubUrl = "https://rentanything.es/discover/day-trips";
const hubName = "Day Trips from Valencia";
const hubDescription =
  "The best day trips from Valencia: Albufera, Sagunto, Requena and Xàtiva. Practical guides with transport information and local planning advice.";

export const metadata: Metadata = {
  title: "Day Trips from Valencia — Beaches, Mountains & Castles",
  description: hubDescription,
  alternates: { canonical: hubUrl },
};

export default function DayTripsHub() {
  const destinations = getDestinationsByHub("day-trips");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getHubCollectionJsonLd({
              name: hubName,
              description: hubDescription,
              url: hubUrl,
              locale: "en",
              items: destinations.map((destination) => ({
                name: destination.name,
                url: `https://rentanything.es/discover/${destination.slug}`,
              })),
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentanything.es" },
              { name: "Discover Valencia", url: "https://rentanything.es/discover" },
              { name: hubName, url: hubUrl },
            ])
          ),
        }}
      />
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/discover" className="hover:text-brand transition-colors">Discover</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">Day Trips</li>
          </ol>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <span className="text-5xl block mb-4">🚗</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Day Trips from Valencia</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Beaches, mountains, hot springs, and medieval castles — all within an hour of Valencia. No overnight stay needed.
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
                  {dest.distanceFromValencia && (
                    <span className="text-xs text-neutral-400">📍 {dest.distanceFromValencia}</span>
                  )}
                  <span className="text-sm font-semibold text-brand mt-2 block">Read guide →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Day trip guides coming soon — check back shortly.</p>
          )}
        </div>
      </section>
    </>
  );
}
