import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedDestinations, getDestinationsByHub } from "@/content/destinations";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

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
    image: "/discover/hubs/neighbourhoods.webp",
    href: "/discover/neighbourhoods",
    hubKey: "neighbourhoods" as const,
  },
  {
    title: "Day Trips",
    description: "Beaches, mountains, and castles within an hour",
    image: "/discover/hubs/day-trips.webp",
    href: "/discover/day-trips",
    hubKey: "day-trips" as const,
  },
  {
    title: "Sights & Attractions",
    description: "The best things to see and do in Valencia",
    image: "/discover/hubs/attractions.webp",
    href: "/discover/attractions",
    hubKey: "attractions" as const,
  },
  {
    title: "Events",
    description: "Festivals, holidays, and seasonal highlights",
    image: "/discover/hubs/events.webp",
    href: "/discover/events",
    hubKey: "events" as const,
  },
];

export default function DiscoverHub() {
  const allDestinations = getPublishedDestinations();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Discover Valencia",
            description: "Local guides to Valencia neighbourhoods, beaches, attractions, events and day trips.",
            url: "https://rentanything.es/discover",
            locale: "en",
            items: allDestinations.map((destination) => ({
              name: destination.name,
              url: `https://rentanything.es/discover/${destination.slug}`,
            })),
          })),
        }}
      />
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

      {/* Hero — matches Valencia page style */}
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/hero/valencia-1.webp"
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
          <div className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium border border-white/20">
                🗺️ Local Travel Guides
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Discover{" "}
              <span className="text-amber-400">Valencia</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              Honest, detailed guides to Valencia&apos;s neighbourhoods, day trips, beaches, and events — written by locals who actually live here.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#guides" className="btn btn-primary btn-lg">
                Browse Guides ↓
              </a>
              <Link href="/valencia" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
                Rent Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hub Categories */}
      <section className="section bg-white">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Explore by Theme</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {hubs.map((hub) => {
              const count = getDestinationsByHub(hub.hubKey).length;
              return (
                <Link
                  key={hub.hubKey}
                  href={hub.href}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
                >
                  <Image
                    src={hub.image}
                    alt={hub.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="font-bold text-sm md:text-base text-white mb-0.5" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      {hub.title}
                    </h3>
                    <p className="text-xs text-white/75 hidden sm:block" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                      {hub.description}
                    </p>
                    {count > 0 && (
                      <span className="inline-block mt-1.5 text-xs font-semibold text-white/60">
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

      {/* All Guides */}
      {allDestinations.length > 0 && (
        <section className="section bg-neutral-50" id="guides">
          <div className="container-site">
            <h2 className="text-3xl font-bold mb-8">All Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/discover/${dest.slug}`}
                  className="card overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {dest.heroImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={dest.heroImage}
                        alt={dest.heroImageAlt || dest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-brand text-xs">{typeLabels[dest.type]}</span>
                      {dest.distanceFromValencia && (
                        <span className="text-xs text-neutral-400">📍 {dest.distanceFromValencia}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{dest.name}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-2">{dest.tagline}</p>
                    <span className="text-sm font-semibold text-brand mt-3 inline-block">Explore →</span>
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
