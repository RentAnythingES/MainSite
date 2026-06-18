import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedDestinations, getDestinationsByHub } from "@/content/destinations";

export const metadata: Metadata = {
  title: "Discover Valencia — Neighbourhood, Beach & Event Guides",
  description: "Your complete travel guide to Valencia. Explore neighbourhoods, day trips, beaches, attractions, and local events — with honest advice from locals.",
  alternates: { canonical: "https://rentanything.es/discover" },
};

const typeLabels: Record<string, string> = {
  neighbourhood: "Neighbourhood",
  beach: "Beach",
  attraction: "Attraction",
  "day-trip": "Day Trip",
  city: "City",
  event: "Event",
  "natural-area": "Natural Area",
};

const hubs = [
  {
    title: "Neighbourhoods",
    description: "Where to stay, eat, and explore — street by street",
    emoji: "🏘️",
    href: "/discover/neighbourhoods",
    hubKey: "neighbourhoods" as const,
  },
  {
    title: "Day Trips",
    description: "Beaches, mountains, and castles within an hour of Valencia",
    emoji: "🚗",
    href: "/discover/day-trips",
    hubKey: "day-trips" as const,
  },
  {
    title: "Sights & Attractions",
    description: "The best things to see and do in Valencia",
    emoji: "🏛️",
    href: "/discover/attractions",
    hubKey: "attractions" as const,
  },
  {
    title: "Events",
    description: "Festivals, holidays, and seasonal highlights throughout the year",
    emoji: "🎉",
    href: "/discover/events",
    hubKey: "events" as const,
  },
];

export default function DiscoverHub() {
  const allDestinations = getPublishedDestinations();

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">Discover Valencia</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Discover Valencia
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Honest, detailed guides to Valencia&apos;s neighbourhoods, day trips, beaches, and events — written by locals who actually live here.
          </p>
        </div>
      </section>

      {/* Hub Cards */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hubs.map((hub) => {
              const count = getDestinationsByHub(hub.hubKey).length;
              return (
                <Link
                  key={hub.hubKey}
                  href={hub.href}
                  className="card p-6 hover:shadow-md transition-shadow group text-center"
                >
                  <span className="text-4xl block mb-3">{hub.emoji}</span>
                  <h2 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{hub.title}</h2>
                  <p className="text-sm text-neutral-500 mb-2">{hub.description}</p>
                  {count > 0 && (
                    <span className="text-xs text-neutral-400">{count} {count === 1 ? "guide" : "guides"}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Destinations */}
      {allDestinations.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">All Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/discover/${dest.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-brand text-xs">{typeLabels[dest.type]}</span>
                    {dest.distanceFromValencia && (
                      <span className="text-xs text-neutral-400">📍 {dest.distanceFromValencia}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{dest.name}</h3>
                  <p className="text-sm text-neutral-500">{dest.tagline}</p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">Explore →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
