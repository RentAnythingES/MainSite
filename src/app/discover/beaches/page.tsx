import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDestinationsByHub } from "@/content/destinations";
import { getBreadcrumbJsonLd, getFaqJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";

const hubUrl = "https://rentanything.es/discover/beaches";
const hubName = "Valencia Beaches Guide";
const hubDescription =
  "Compare Valencia beaches for families, swimming, accessibility and quieter days, with practical transport advice and local beach guides.";

const faqs = [
  {
    question: "Which Valencia beach is easiest to reach from the city centre?",
    answer:
      "Malvarrosa and Las Arenas are the most straightforward urban-beach choices, with regular public transport and a long seafront promenade. Check current EMT and Metrovalencia routes for your exact starting point before travelling.",
  },
  {
    question: "Is Malvarrosa or Patacona better for families?",
    answer:
      "Both can work well. Malvarrosa has broad urban-beach facilities and direct city connections, while Patacona often feels calmer and suits families who prefer a slightly less central seafront. Your accommodation location may be the deciding factor.",
  },
  {
    question: "Do I need to bring beach equipment to Valencia?",
    answer:
      "Not necessarily. Towels and sun protection are essential, but larger items such as umbrellas, shelters, chairs, coolers and beach wagons can be rented in Valencia when buying and transporting them would be inconvenient.",
  },
  {
    question: "Are Valencia beaches accessible?",
    answer:
      "Several beaches provide accessible routes and seasonal assisted-bathing services, but the available facilities and dates can change. Confirm the current service at the specific beach before your visit.",
  },
];

const comparisons = [
  {
    name: "Malvarrosa",
    bestFor: "First visits, city access and a broad promenade",
    feel: "Large, active urban beach",
    href: "/discover/malvarrosa-beach",
  },
  {
    name: "Patacona",
    bestFor: "A calmer beach day and northern accommodation areas",
    feel: "Relaxed continuation of the city seafront",
    href: "/discover/patacona-beach",
  },
];

export const metadata: Metadata = {
  title: "Valencia Beaches Guide — Compare the Best Beaches",
  description: hubDescription,
  alternates: { canonical: hubUrl },
  openGraph: {
    title: "Valencia Beaches Guide",
    description: hubDescription,
    url: hubUrl,
    images: [{ url: "/discover/malvarrosa-beach.webp", alt: "Malvarrosa Beach in Valencia" }],
  },
};

export default function BeachesHub() {
  const destinations = getDestinationsByHub("beaches");

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
            }),
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
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/discover" className="hover:text-brand transition-colors">Discover</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">Beaches</li>
          </ol>
        </div>
      </nav>

      <section className="relative min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/discover/malvarrosa-beach.webp"
          alt="Wide sandy beach and Mediterranean sea in Valencia"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container-site relative z-10 py-14 md:py-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm mb-4">
            Local beach planning
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            Valencia Beaches Guide
          </h1>
          <p className="text-lg text-white/90 max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            Choose the right beach for your stay, understand the journey, and plan what you actually need for a comfortable day by the Mediterranean.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">Choosing a beach in Valencia</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Valencia&apos;s coastline includes busy urban beaches, quieter stretches north of the city, and more natural beaches towards Albufera. The best choice depends on where you are staying, how much equipment you are carrying, and whether you need step-free routes or family facilities.
              </p>
              <p>
                Malvarrosa is the simplest starting point for many first-time visitors. Patacona continues north with a calmer feel and is especially convenient from Alboraya and northern neighbourhoods. Future guides will add the southern beaches once their transport, seasonal services, and accessibility details are fully sourced.
              </p>
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-3">Plan around your stay</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><strong className="text-neutral-800">Families:</strong> prioritise shade, toilets, food access, and the shortest equipment-carrying route.</li>
              <li><strong className="text-neutral-800">Limited mobility:</strong> confirm current accessible entrances and seasonal support before travelling.</li>
              <li><strong className="text-neutral-800">Long beach days:</strong> plan water, shade, seating, and safe food storage rather than relying on nearby purchases.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-3">Compare Valencia city beaches</h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">
            Start with the practical difference between the two beach areas already covered in depth.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((comparison) => (
              <Link key={comparison.name} href={comparison.href} className="card p-6 hover:shadow-md transition-shadow group">
                <h3 className="text-xl font-bold group-hover:text-brand transition-colors mb-3">{comparison.name}</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-neutral-800">Best for</dt>
                    <dd className="text-neutral-600">{comparison.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-neutral-800">Atmosphere</dt>
                    <dd className="text-neutral-600">{comparison.feel}</dd>
                  </div>
                </dl>
                <span className="text-sm font-semibold text-brand mt-5 inline-block">Read the local guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">Detailed beach guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.slug} href={`/discover/${destination.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
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
                  <span className="text-sm font-semibold text-brand mt-4 inline-block">Explore the beach →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-teal-50/50">
        <div className="container-site grid lg:grid-cols-2 gap-6">
          <div className="card p-7 bg-white">
            <span className="text-sm font-semibold text-brand">Rent only what helps</span>
            <h2 className="text-2xl font-bold mt-2 mb-3">Beach equipment delivered in Valencia</h2>
            <p className="text-neutral-600 mb-5">
              Browse umbrellas, shelters, towels, coolers, chairs, games and transport gear, then check availability for your exact dates.
            </p>
            <Link href="/rental/travel-outdoors" className="btn btn-primary">Browse Beach & Outdoor equipment</Link>
          </div>
          <div className="card p-7 bg-white">
            <span className="text-sm font-semibold text-brand">Planning for a family</span>
            <h2 className="text-2xl font-bold mt-2 mb-3">Build a complete family beach setup</h2>
            <p className="text-neutral-600 mb-5">
              Use the Family Beach Kit as a planning checklist, then adapt it to your group, accommodation, and transport needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/valencia/kits/family-beach-kit" className="btn btn-outline">View the Family Beach Kit</Link>
              <Link href="/blog/best-beaches-valencia-families" className="text-sm font-semibold text-brand self-center hover:underline">Family beach guide →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Valencia beach questions</h2>
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
