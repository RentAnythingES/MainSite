import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";
import DiscoverHubEditorial from "@/components/DiscoverHubEditorial";

const hubUrl = "https://rentanything.es/discover/attractions";
const hubName = "Valencia Sights & Attractions";
const hubDescription =
  "Practical guides to Valencia sights and attractions, including Oceanogràfic, the City of Arts and Sciences, Central Market, La Lonja and Turia Gardens.";

export const metadata: Metadata = {
  title: "Valencia Sights & Attractions — What to See & Do",
  description: hubDescription,
  alternates: {
    canonical: hubUrl,
    languages: { en: hubUrl, es: "https://rentanything.es/es/discover/attractions", "x-default": hubUrl },
  },
};

const editorial = {
  introTitle: "Plan Valencia attractions around a realistic day",
  intro: [
    "Valencia's major sights range from compact historic monuments to large complexes and a nine-kilometre park. Opening hours matter, but so do walking distances, queues, shade, surfaces, and how much of the day one attraction can comfortably occupy.",
    "Choose one main area, then add nearby stops. The City of Arts and Sciences pairs naturally with the eastern Turia Gardens, while the historic centre is better treated as a separate walking day than a rushed add-on.",
  ],
  choiceTitle: "Choose by the experience you want",
  choices: [
    { title: "City of Arts and Sciences", description: "For architecture, science, marine life, and a full family day with several ticketed venues.", href: "/discover/city-of-arts-and-sciences" },
    { title: "Oceanogràfic", description: "For a focused aquarium day with family logistics, long walking routes, and date-specific activities.", href: "/discover/oceanografic-valencia" },
    { title: "Turia Gardens", description: "For walking, cycling, playgrounds, green space, and a flexible route across the city.", href: "/discover/turia-gardens" },
    { title: "Central Market and La Lonja", description: "For a compact morning route through Valencia's food culture and UNESCO-listed trading history.", href: "/discover/central-market-la-lonja" },
    { title: "BIOPARC Valencia", description: "For an immersive wildlife day with ticket, food, accessibility and family logistics planned in advance.", href: "/discover/bioparc-valencia" },
    { title: "Historic centre", description: "For a practical walking route from Serranos to Quart with selected monuments rather than an overloaded checklist.", href: "/discover/valencia-historic-centre" },
  ],
  planningTitle: "Make the visit easier",
  planningPoints: [
    "Check current opening hours and timed-entry requirements on the official venue site.",
    "Estimate total walking inside large complexes, not only the journey there.",
    "Plan shade, water, and indoor breaks during hot months.",
    "Confirm step-free routes, accessible toilets, and equipment rules directly with the venue when needed.",
  ],
  pathways: [
    { title: "Visiting with children", description: "Plan pacing, meals, transport, naps, and equipment around Valencia's family attractions.", href: "/blog/valencia-with-kids-complete-guide", label: "Read Valencia with kids" },
    { title: "Need mobility support for the stay", description: "Browse wheelchairs, rollators, scooters, and related equipment, then check availability for your dates.", href: "/rental/mobility", label: "View mobility equipment" },
  ],
  faqs: [
    { question: "What are the best Valencia attractions for a first visit?", answer: "The historic centre, City of Arts and Sciences, Turia Gardens, and the seafront cover very different sides of Valencia. Choose by interest and group needs rather than trying to fit every major sight into one day." },
    { question: "How long should I allow for the City of Arts and Sciences?", answer: "The outdoor complex can be explored relatively quickly, but ticketed venues such as the Oceanogràfic or Science Museum can turn it into most of a day. Decide which venues matter before buying tickets and planning other stops." },
    { question: "Are Valencia attractions suitable for wheelchairs and strollers?", answer: "Many major attractions provide step-free routes, but surfaces, entrances, lifts, toilets, and temporary closures vary. Use each guide as an orientation and confirm critical access requirements with the official venue." },
    { question: "Should I book Valencia attraction tickets in advance?", answer: "Advance booking can be useful for major ticketed venues and busy dates. Requirements and offers change, so purchase only through the official attraction or a clearly authorised seller after confirming your schedule." },
  ],
};

export default function AttractionsHub() {
  const destinations = getDestinationsByHub("attractions");
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
      <DiscoverHubEditorial {...editorial} />
    </>
  );
}
