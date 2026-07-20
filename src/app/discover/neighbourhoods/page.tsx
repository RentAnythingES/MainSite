import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";
import DiscoverHubEditorial from "@/components/DiscoverHubEditorial";

const hubUrl = "https://rentanything.es/discover/neighbourhoods";
const hubName = "Valencia Neighbourhoods";
const hubDescription =
  "Honest guides to Valencia's best neighbourhoods: Ruzafa, El Carmen, Malvarrosa, Benimaclet & more. Find the right area for your trip.";

export const metadata: Metadata = {
  title: "Valencia Neighbourhoods — Where to Stay & Explore",
  description: hubDescription,
  alternates: {
    canonical: hubUrl,
    languages: {
      en: hubUrl,
      es: "https://rentanything.es/es/discover/neighbourhoods",
      "x-default": hubUrl,
    },
  },
};

const editorial = {
  introTitle: "How to choose where to stay in Valencia",
  intro: [
    "The right neighbourhood changes the rhythm of a Valencia stay. A central historic base reduces sightseeing journeys, a beachside area makes sea days easier, and a residential district can offer more space and quieter evenings.",
    "Compare atmosphere, late-night noise, public transport, food shopping, walking distances, and how often you expect to cross the city. The most fashionable area is not automatically the most practical one for your group.",
  ],
  choiceTitle: "Match a neighbourhood to your travel style",
  choices: [
    { title: "Ruzafa", description: "For restaurants, independent shops, nightlife, and a lively base south of the centre.", href: "/discover/ruzafa" },
    { title: "El Carmen", description: "For historic streets and central sightseeing, with more evening activity and older buildings.", href: "/discover/el-carmen" },
    { title: "Cabanyal", description: "For maritime character, colourful architecture, and easier access to the urban beaches.", href: "/discover/cabanyal" },
    { title: "Benimaclet", description: "For a residential, student-influenced atmosphere with local services and tram access.", href: "/discover/benimaclet" },
    { title: "El Ensanche", description: "For central shopping, elegant streets, and a polished base between the old town and Ruzafa.", href: "/discover/el-ensanche" },
  ],
  planningTitle: "Compare before booking accommodation",
  planningPoints: [
    "Check the walking route to your nearest metro, tram, or useful bus stop.",
    "Look at late-night activity if children, early starts, or light sleep matter.",
    "Confirm lift access and entrance steps in older apartment buildings.",
    "Consider where bulky baby, mobility, or work equipment would be delivered and stored.",
  ],
  pathways: [
    { title: "Plan the wider Valencia stay", description: "Use the Valencia hub to connect neighbourhood choices with equipment, kits, delivery, and practical stay planning.", href: "/valencia", label: "Explore Valencia rentals" },
    { title: "Arriving with more needs than luggage space", description: "Browse scenario-based kits for family arrivals, remote work, summer comfort, and accessibility support.", href: "/valencia/kits", label: "View Valencia kits" },
  ],
  faqs: [
    { question: "What is the best area to stay in Valencia for a first visit?", answer: "El Carmen and the wider historic centre reduce travel for major sights, while Ruzafa offers a lively food and evening scene nearby. The best choice depends on whether central sightseeing, quieter sleep, beach access, or apartment space matters most." },
    { question: "Which Valencia neighbourhood is best for the beach?", answer: "Cabanyal is the clearest neighbourhood choice for urban-beach access. Patacona is another useful coastal base north of the city, but it is covered in the dedicated Beaches section because its main visitor intent is the seafront." },
    { question: "Is Valencia easy to explore without staying in the centre?", answer: "Often yes. Metro, tram, buses, cycling routes, and the city's relatively compact layout connect many areas well. Check the exact journey from an accommodation address rather than relying only on the neighbourhood name." },
    { question: "Which areas suit a longer Valencia stay?", answer: "Residential areas such as Benimaclet or parts of Cabanyal may offer a more everyday rhythm, while Ruzafa and El Ensanche keep restaurants and central services close. Apartment condition, cooling, workspace, and transport are as important as the district itself." },
  ],
};

export default function NeighbourhoodsHub() {
  const destinations = getDestinationsByHub("neighbourhoods");
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
      <DiscoverHubEditorial {...editorial} />
    </>
  );
}
