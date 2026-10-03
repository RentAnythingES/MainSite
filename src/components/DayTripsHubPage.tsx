import { customerPrefix } from "@/i18n/customer-path";
import { getPublishedGermanDestinations } from "@/content/destinations-de";
import englishCopy from "@/i18n/discover-hubs/day-trips-en.json";
import germanCopy from "@/i18n/discover-hubs/day-trips-de.json";
import Link from "next/link";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";
import DiscoverHubEditorial from "@/components/DiscoverHubEditorial";

export default function DayTripsHubPage({locale="en"}: {locale?: "en" | "de"}) {
  const copy=locale === "de" ? germanCopy : englishCopy;
  const prefix=customerPrefix(locale);
  const hubName=copy.hubName, hubDescription=copy.hubDescription, hubUrl="https://rentandroll.com"+prefix+"/discover/day-trips";
  const editorial={...copy.editorial,choices:copy.editorial.choices.map(item=>({...item,href:prefix+item.href})),pathways:copy.editorial.pathways.map(item=>({...item,href:prefix+item.href}))};

  const destinations = locale === "de" ? getPublishedGermanDestinations().filter(item=>item.hubs.includes("day-trips")) : getDestinationsByHub("day-trips");
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
              locale,
              items: destinations.map((destination) => ({
                name: destination.name,
                url: `https://rentandroll.com${prefix}/discover/${destination.slug}`,
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
              { name: copy.templateText[0].value, url: "https://rentandroll.com"+prefix },
              { name: locale === "de" ? "Valencia entdecken" : "Discover Valencia", url: "https://rentandroll.com"+prefix+"/discover" },
              { name: hubName, url: hubUrl },
            ])
          ),
        }}
      />
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href={prefix || "/"} className="hover:text-brand transition-colors">{copy.templateText[0].value}</Link></li>
            <li>/</li>
            <li><Link href={prefix+"/discover"} className="hover:text-brand transition-colors">{copy.templateText[1].value}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{copy.templateText[2].value}</li>
          </ol>
        </div>
      </nav>
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <span className="text-5xl block mb-4">🚗</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{copy.templateText[3].value}</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">{copy.templateText[4].value}</p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-site">
          {destinations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Link key={dest.slug} href={`${prefix}/discover/${dest.slug}`} className="card p-6 hover:shadow-md transition-shadow group">
                  <h2 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{dest.name}</h2>
                  <p className="text-sm text-neutral-500 mb-2">{dest.tagline}</p>
                  {dest.distanceFromValencia && (
                    <span className="text-xs text-neutral-400">📍 {dest.distanceFromValencia}</span>
                  )}
                  <span className="text-sm font-semibold text-brand mt-2 block">{copy.templateText[5].value}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">{copy.templateText[6].value}</p>
          )}
        </div>
      </section>
      <DiscoverHubEditorial {...editorial} />
    </>
  );
}
