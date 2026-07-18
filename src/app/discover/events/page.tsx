import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const hubUrl = "https://rentanything.es/discover/events";
const hubName = "Valencia Events";
const hubDescription =
  "Plan a Valencia trip around published festival and seasonal guides, with practical dates, local context and booking advice.";

export const metadata: Metadata = {
  title: "Valencia Events — Festivals, Holidays & Seasonal Highlights",
  description: hubDescription,
  alternates: { canonical: hubUrl },
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function EventsHub() {
  const destinations = getDestinationsByHub("events");

  // Build a month-to-events map for the calendar view
  const eventsByMonth: Record<number, typeof destinations> = {};
  destinations.forEach((dest) => {
    const months = dest.eventInfo?.months || [];
    months.forEach((m) => {
      if (!eventsByMonth[m]) eventsByMonth[m] = [];
      eventsByMonth[m].push(dest);
    });
  });

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
            <li className="text-neutral-800 font-medium">Events</li>
          </ol>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <span className="text-5xl block mb-4">🎉</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Valencia Events</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Plan your trip around Valencia&apos;s festivals, holidays, and seasonal highlights. Evergreen guides with dates, booking tips, and what to expect.
          </p>
        </div>
      </section>

      {/* Calendar View */}
      {Object.keys(eventsByMonth).length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Events by Month</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const events = eventsByMonth[month] || [];
                return (
                  <div
                    key={month}
                    className={`rounded-xl p-3 text-center border ${events.length > 0 ? "bg-teal-50 border-brand/20" : "bg-neutral-50 border-border"}`}
                  >
                    <span className="text-xs font-bold block mb-1">{monthNames[month - 1]}</span>
                    {events.length > 0 ? (
                      <span className="text-xs text-brand font-semibold">{events.length}</span>
                    ) : (
                      <span className="text-xs text-neutral-300">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Event Cards */}
      <section className="section bg-neutral-50">
        <div className="container-site">
          {destinations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Link key={dest.slug} href={`/discover/${dest.slug}`} className="card p-6 hover:shadow-md transition-shadow group">
                  <h2 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{dest.name}</h2>
                  <p className="text-sm text-neutral-500 mb-2">{dest.tagline}</p>
                  {dest.eventInfo && (
                    <div className="flex gap-3 text-xs text-neutral-400 mb-2">
                      <span>📅 {dest.eventInfo.dates}</span>
                      <span className="capitalize">👥 {dest.eventInfo.crowdLevel}</span>
                    </div>
                  )}
                  <span className="text-sm font-semibold text-brand">Read guide →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Event guides coming soon — check back shortly.</p>
          )}
        </div>
      </section>
    </>
  );
}
