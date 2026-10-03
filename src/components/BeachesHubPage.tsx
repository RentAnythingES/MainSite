import { customerPrefix } from "@/i18n/customer-path";
import { getPublishedGermanDestinations } from "@/content/destinations-de";
import englishCopy from "@/i18n/discover-hubs/beaches-en.json";
import germanCopy from "@/i18n/discover-hubs/beaches-de.json";
import Image from "next/image";
import Link from "next/link";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

export default function BeachesHubPage({locale="en"}: {locale?: "en" | "de"}) {
  const copy=locale === "de" ? germanCopy : englishCopy;
  const prefix=customerPrefix(locale);
  const hubName=copy.hubName, hubDescription=copy.hubDescription, hubUrl="https://rentandroll.com"+prefix+"/discover/beaches";
  const faqs=copy.faqs;
  const comparisons=copy.comparisons.map(item=>({...item,href:prefix+item.href}));

  const destinations = locale === "de" ? getPublishedGermanDestinations().filter(item=>item.hubs.includes("beaches")) : getDestinationsByHub("beaches");

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
            }),
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
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))) }}
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

      <section className="relative min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/discover/malvarrosa-beach.webp"
          alt={copy.templateText[3].value}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm mb-4">{copy.templateText[4].value}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{copy.templateText[5].value}</h1>
          <p className="text-lg text-white/90 max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{copy.templateText[6].value}</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">{copy.templateText[7].value}</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>{copy.templateText[8].value}</p>
              <p>{copy.templateText[9].value}</p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">{copy.templateText[10].value}</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">{copy.templateText[11].value}</strong>{copy.templateText[12].value}</li>
              <li><strong className="text-neutral-800">{copy.templateText[13].value}</strong>{copy.templateText[14].value}</li>
              <li><strong className="text-neutral-800">{copy.templateText[15].value}</strong>{copy.templateText[16].value}</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-3">{copy.templateText[17].value}</h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">{copy.templateText[18].value}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((comparison) => (
              <Link key={comparison.name} href={comparison.href} className="card p-6 hover:shadow-md transition-shadow group">
                <h3 className="text-xl font-bold group-hover:text-brand transition-colors mb-3">{comparison.name}</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-neutral-800">{copy.templateText[19].value}</dt>
                    <dd className="text-neutral-600">{comparison.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-neutral-800">{copy.templateText[20].value}</dt>
                    <dd className="text-neutral-600">{comparison.feel}</dd>
                  </div>
                </dl>
                <span className="text-sm font-semibold text-brand mt-5 inline-block">{copy.templateText[21].value}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">{copy.templateText[22].value}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.slug} href={`${prefix}/discover/${destination.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
                {destination.heroImage && (
                  <div className="relative h-52">
                    <Image
                      src={destination.heroImage}
                      alt={destination.heroImageAlt || destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:text-brand transition-colors mb-2">{destination.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{destination.tagline}</p>
                  <span className="text-sm font-semibold text-brand mt-4 inline-block">{copy.templateText[23].value}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-teal-50/50">
        <div className="container-site grid lg:grid-cols-2 gap-6">
          <div className="card p-7 bg-white">
            <span className="text-sm font-semibold text-brand">{copy.templateText[24].value}</span>
            <h2 className="text-2xl font-bold mt-2 mb-3">{copy.templateText[25].value}</h2>
            <p className="text-neutral-600 mb-5">{copy.templateText[26].value}</p>
            <Link href={prefix+"/rental/travel-outdoors"} className="btn btn-primary">{copy.templateText[27].value}</Link>
          </div>
          <div className="card p-7 bg-white">
            <span className="text-sm font-semibold text-brand">{copy.templateText[28].value}</span>
            <h2 className="text-2xl font-bold mt-2 mb-3">{copy.templateText[29].value}</h2>
            <p className="text-neutral-600 mb-5">{copy.templateText[30].value}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={prefix+"/valencia/kits/family-beach-kit"} className="btn btn-outline">{copy.templateText[31].value}</Link>
              <Link href={prefix+"/blog/best-beaches-valencia-families"} className="text-sm font-semibold text-brand self-center hover:underline">{copy.templateText[32].value}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">{copy.templateText[33].value}</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-6">
                <h3 className="font-bold mb-2">{faq.question}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
