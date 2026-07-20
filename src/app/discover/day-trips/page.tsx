import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";
import DiscoverHubEditorial from "@/components/DiscoverHubEditorial";

const hubUrl = "https://rentanything.es/discover/day-trips";
const hubName = "Day Trips from Valencia";
const hubDescription =
  "The best day trips from Valencia: Albufera, Sagunto, Requena and Xàtiva. Practical guides with transport information and local planning advice.";

export const metadata: Metadata = {
  title: "Day Trips from Valencia — Beaches, Mountains & Castles",
  description: hubDescription,
  alternates: { canonical: hubUrl },
};

const editorial = {
  introTitle: "Choose a day trip that fits your time and energy",
  intro: [
    "A good Valencia day trip is not only about distance. Train frequency, the walk from the station, midday heat, attraction opening times, and the return journey can determine whether a destination feels relaxed or rushed.",
    "Albufera suits nature and food, Sagunto and Xàtiva suit castle and history days, and Requena offers a slower inland experience. Start with the experience you want, then check the current transport timetable before committing.",
  ],
  choiceTitle: "Compare the current day-trip guides",
  choices: [
    { title: "Albufera", description: "For wetlands, rice fields, boat rides, sunsets, and the landscape behind Valencia's paella tradition.", href: "/discover/albufera" },
    { title: "Sagunto", description: "For a compact historic trip combining a hilltop castle, Roman theatre, and old town.", href: "/discover/sagunto" },
    { title: "Xàtiva", description: "For the most dramatic castle day, with a longer climb and a rewarding historic centre.", href: "/discover/xativa" },
    { title: "Requena", description: "For wine-country atmosphere, underground caves, and a slower full-day inland visit.", href: "/discover/requena" },
  ],
  planningTitle: "Check these before leaving Valencia",
  planningPoints: [
    "Confirm the outbound and final practical return service on the day of travel.",
    "Check closures, ticket rules, and whether advance reservations are required.",
    "Plan exposed climbs and walking routes around summer heat.",
    "Carry water and only bring equipment that remains practical on public transport.",
  ],
  pathways: [
    { title: "Travelling with children", description: "Our Valencia family guide covers pacing, transport, heat, and equipment decisions for days inside and outside the city.", href: "/blog/valencia-with-kids-complete-guide", label: "Read the family guide" },
    { title: "Need a simpler city day instead?", description: "Compare Valencia attractions when a full return journey would add too much time or effort.", href: "/discover/attractions", label: "Browse Valencia attractions" },
  ],
  faqs: [
    { question: "What is the easiest day trip from Valencia without a car?", answer: "Sagunto and Xàtiva have direct rail options, while Albufera can be reached by bus. Ease still depends on the current timetable, the walk at the destination, and your group's mobility and heat tolerance." },
    { question: "Which Valencia day trip is best with children?", answer: "Albufera works well for families interested in nature and a boat ride, while castles can appeal to older children who are comfortable with steep and uneven walking. Match the outing to attention span, weather, and travel time." },
    { question: "Can I visit Albufera and a beach on the same day?", answer: "It is possible with careful transport planning, particularly around the southern beaches, but trying to combine too many stops can make the day rushed. Prioritise either a nature-and-lunch itinerary or a longer beach visit." },
    { question: "Do day-trip transport times stay the same all year?", answer: "No. Rail, bus, seasonal tourism services, and attraction hours can change. Treat guide times as planning context and verify the official operator schedule shortly before travel." },
  ],
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
      <DiscoverHubEditorial {...editorial} />
    </>
  );
}
