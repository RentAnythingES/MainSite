import Link from "next/link";
import Image from "next/image";
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
    image: "/discover/hubs/neighbourhoods.png",
    href: "/discover/neighbourhoods",
    hubKey: "neighbourhoods" as const,
  },
  {
    title: "Day Trips",
    description: "Beaches, mountains, and castles within an hour",
    image: "/discover/hubs/day-trips.png",
    href: "/discover/day-trips",
    hubKey: "day-trips" as const,
  },
  {
    title: "Sights & Attractions",
    description: "The best things to see and do in Valencia",
    image: "/discover/hubs/attractions.png",
    href: "/discover/attractions",
    hubKey: "attractions" as const,
  },
  {
    title: "Events",
    description: "Festivals, holidays, and seasonal highlights",
    image: "/discover/hubs/events.png",
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

      {/* Hero — uses first hero image as background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/valencia-1.png"
            alt="Aerial view of Valencia at golden hour"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="container-site relative z-10 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Discover Valencia
          </h1>
          <p className="text-lg text-white/90 max-w-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            Honest, detailed guides to Valencia&apos;s neighbourhoods, day trips, beaches, and events — written by locals who actually live here.
          </p>
        </div>
      </section>

      {/* Hub Cards — photo-backed */}
      <section className="py-10 bg-white">
        <div className="container-site">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hubs.map((hub) => {
              const count = getDestinationsByHub(hub.hubKey).length;
              return (
                <Link
                  key={hub.hubKey}
                  href={hub.href}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <Image
                    src={hub.image}
                    alt={hub.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="font-bold text-lg text-white mb-0.5" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      {hub.title}
                    </h2>
                    <p className="text-xs text-white/80" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                      {hub.description}
                    </p>
                    {count > 0 && (
                      <span className="inline-block mt-2 text-xs font-semibold text-white/60">
                        {count} {count === 1 ? "guide" : "guides"} →
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Guides — photo cards */}
      {allDestinations.length > 0 && (
        <section className="py-10 bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">All Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/discover/${dest.slug}`}
                  className="card overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {dest.heroImage && (
                    <div className="relative h-44 w-full">
                      <Image
                        src={dest.heroImage}
                        alt={dest.heroImageAlt || dest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="badge badge-brand text-xs">{typeLabels[dest.type]}</span>
                      {dest.distanceFromValencia && (
                        <span className="text-xs text-neutral-400">📍 {dest.distanceFromValencia}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-base mb-1 group-hover:text-brand transition-colors">{dest.name}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-2">{dest.tagline}</p>
                    <span className="text-sm font-semibold text-brand mt-2 inline-block">Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
