import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getDestinationBySlug,
  getAllDestinationSlugsForBuild,
  getPublishedDestinations,
} from "@/content/destinations";
import { getProductBySlug } from "@/data/products";
import { getBlogPostBySlug } from "@/content/blog";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDestinationSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: "Not Found" };
  return {
    title: dest.title,
    description: dest.description,
    alternates: { canonical: `https://rentanything.es/discover/${dest.slug}` },
  };
}

const typeLabels: Record<string, string> = {
  neighbourhood: "Neighbourhood",
  beach: "Beach",
  attraction: "Attraction",
  "day-trip": "Day Trip",
  city: "City",
  event: "Event",
  "natural-area": "Natural Area",
};

const seasonEmojis: Record<string, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

const modeEmojis: Record<string, string> = {
  metro: "🚇",
  tram: "🚊",
  bus: "🚌",
  car: "🚗",
  bike: "🚴",
  walk: "🚶",
  train: "🚆",
};

export default async function DiscoverPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  // Resolve product widgets
  const resolvedWidgets = dest.productWidgets
    .map((w) => ({ ...w, product: getProductBySlug(w.productSlug) }))
    .filter((w) => w.product);

  // Helper: render inline product widgets that match a section
  const renderWidgets = (sectionName: string) => {
    const matching = resolvedWidgets.filter((w) => w.afterSection === sectionName);
    if (matching.length === 0) return null;
    return (
      <div className="container-site max-w-3xl py-4">
        {matching.map((w) => (
          <Link
            key={w.productSlug}
            href={`/product/${w.productSlug}`}
            className="flex items-start gap-4 rounded-xl border-l-4 border-brand/40 bg-teal-50/40 p-4 hover:bg-teal-50/70 transition-colors group mb-3"
          >
            <span className="text-2xl flex-shrink-0">🏷️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-700 leading-relaxed">{w.context}</p>
              <span className="text-xs font-semibold text-brand mt-1 inline-block group-hover:underline">
                {w.product!.name} — from €{w.product!.pricing[w.product!.pricing.length - 1].perDay}/day →
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  // Resolve related blog posts
  const resolvedBlogPosts = dest.relatedBlogPosts
    .map((slug) => getBlogPostBySlug(slug))
    .filter(Boolean);

  // Resolve related destinations
  const resolvedDestinations = dest.relatedDestinations
    .map((slug) => getDestinationBySlug(slug))
    .filter(Boolean);

  // JSON-LD
  const jsonLd = dest.type === "event"
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: dest.name,
        description: dest.description,
        location: { "@type": "Place", name: "Valencia, Spain" },
      }
    : {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: dest.name,
        description: dest.description,
        touristType: dest.audiences,
      };

  const faqJsonLd = dest.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: dest.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/discover" className="hover:text-brand transition-colors">Discover</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{dest.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-brand">{typeLabels[dest.type]}</span>
            {dest.distanceFromValencia && (
              <span className="text-sm text-neutral-500">📍 {dest.distanceFromValencia}</span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{dest.name}</h1>
          <p className="text-lg text-neutral-600 max-w-2xl">{dest.tagline}</p>
          {dest.overview?.quickFacts && (
            <div className="flex flex-wrap gap-4 mt-6">
              {dest.overview.quickFacts.map((fact) => (
                <div key={fact.label} className="bg-white/80 backdrop-blur rounded-lg px-4 py-2 border border-border">
                  <span className="text-xs text-neutral-500 block">{fact.label}</span>
                  <span className="text-sm font-semibold">{fact.value}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-neutral-400 mt-4">Last updated: {dest.lastUpdated}</p>
        </div>
      </section>

      {/* Overview */}
      {dest.overview && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            {dest.overview.paragraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Event Info Banner */}
      {dest.eventInfo && (
        <section className="bg-amber-50 border-y border-amber-200 py-8">
          <div className="container-site">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><span className="text-xs text-neutral-500 block">Dates</span><span className="font-semibold">{dest.eventInfo.dates}</span></div>
              <div><span className="text-xs text-neutral-500 block">Frequency</span><span className="font-semibold">{dest.eventInfo.frequency}</span></div>
              <div><span className="text-xs text-neutral-500 block">Crowd Level</span><span className="font-semibold capitalize">{dest.eventInfo.crowdLevel}</span></div>
              <div><span className="text-xs text-neutral-500 block">Tickets</span><span className="font-semibold">{dest.eventInfo.ticketsRequired ? "Required" : "Free"}</span></div>
            </div>
            <p className="text-sm text-neutral-600 mt-4">{dest.eventInfo.bookingAdvice}</p>
          </div>
        </section>
      )}

      {/* Highlights */}
      {dest.highlights && dest.highlights.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Things to See & Do</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.highlights.map((h) => (
                <div key={h.name} className="card p-5">
                  {h.icon && <span className="text-2xl mb-2 block">{h.icon}</span>}
                  <h3 className="font-bold mb-2">{h.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{h.description}</p>
                  {h.tip && (
                    <p className="text-xs text-brand mt-2 font-medium">💡 {h.tip}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Getting There */}
      {dest.gettingThere && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Getting There</h2>
            <p className="text-neutral-600 mb-6">{dest.gettingThere.summary}</p>
            <div className="space-y-3">
              {dest.gettingThere.options.map((opt) => (
                <div key={opt.mode} className="card p-4 flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{modeEmojis[opt.mode] || "🚀"}</span>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">{opt.description}</p>
                    <div className="flex gap-4 mt-1">
                      {opt.duration && <span className="text-xs text-neutral-400">⏱ {opt.duration}</span>}
                      {opt.cost && <span className="text-xs text-neutral-400">💰 {opt.cost}</span>}
                    </div>
                    {opt.tip && <p className="text-xs text-brand mt-1 font-medium">💡 {opt.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Time to Visit */}
      {dest.bestTimeToVisit && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-4">Best Time to Visit</h2>
            <p className="text-neutral-600 mb-6">{dest.bestTimeToVisit.summary}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dest.bestTimeToVisit.seasons.map((s) => (
                <div key={s.season} className="card p-4 text-center">
                  <span className="text-3xl block mb-2">{seasonEmojis[s.season]}</span>
                  <h3 className="font-bold capitalize mb-1">{s.season}</h3>
                  <div className="text-amber-500 text-sm mb-2">{"★".repeat(s.rating)}{"☆".repeat(5 - s.rating)}</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
            {dest.bestTimeToVisit.avoidDates && (
              <p className="text-sm text-neutral-500 mt-4">⚠️ {dest.bestTimeToVisit.avoidDates}</p>
            )}
          </div>
        </section>
      )}

      {/* Accessibility */}
      {dest.accessibility && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">{"★".repeat(dest.accessibility.overallRating)}{"☆".repeat(5 - dest.accessibility.overallRating)}</span>
              <span className="text-sm text-neutral-500">{dest.accessibility.overallRating}/5 accessibility</span>
            </div>
            <p className="text-neutral-600 mb-4">{dest.accessibility.summary}</p>
            <div className="space-y-2">
              {dest.accessibility.wheelchairNotes && (
                <p className="text-sm text-neutral-600">♿ {dest.accessibility.wheelchairNotes}</p>
              )}
              {dest.accessibility.strollerNotes && (
                <p className="text-sm text-neutral-600">👶 {dest.accessibility.strollerNotes}</p>
              )}
              {dest.accessibility.publicTransportAccess && (
                <p className="text-sm text-neutral-600">🚇 {dest.accessibility.publicTransportAccess}</p>
              )}
            </div>
          </div>
        </section>
      )}
      {renderWidgets("Accessibility")}

      {/* What to Bring */}
      {dest.whatToBring && (
        <section className="section bg-neutral-50">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">What to Bring</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-green-700 mb-2">✅ Bring</h3>
                <ul className="space-y-1">
                  {dest.whatToBring.bring.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-red-700 mb-2">❌ Don&apos;t Bring</h3>
                <ul className="space-y-1">
                  {dest.whatToBring.dontBring.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-brand mb-2">🏷️ Rent Instead</h3>
                <ul className="space-y-1">
                  {dest.whatToBring.rentInstead.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Food & Drink */}
      {dest.foodAndDrink && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-4">Where to Eat & Drink</h2>
            <p className="text-neutral-600 mb-6">{dest.foodAndDrink.summary}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dest.foodAndDrink.recommendations.map((r) => (
                <div key={r.name} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{r.name}</h3>
                    <span className="text-sm text-neutral-400">{r.priceRange}</span>
                  </div>
                  <span className="badge badge-brand text-xs mb-2">{r.type}</span>
                  {r.tip && <p className="text-xs text-neutral-500 mt-1">💡 {r.tip}</p>}
                  {r.familyFriendly && <span className="text-xs text-neutral-400 block mt-1">👶 Family-friendly</span>}
                </div>
              ))}
            </div>
            {dest.foodAndDrink.localSpeciality && (
              <p className="text-sm text-neutral-600 mt-6 bg-white rounded-xl p-4 border border-border">
                🍷 <strong>Local tip:</strong> {dest.foodAndDrink.localSpeciality}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Where to Stay */}
      {dest.whereToStay && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Where to Stay</h2>
            <p className="text-neutral-600 mb-4">{dest.whereToStay.summary}</p>
            <ul className="space-y-2">
              {dest.whereToStay.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-brand mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Staying Here (neighbourhood-specific) */}
      {dest.stayingHere && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-4">Staying in {dest.name}</h2>
            <p className="text-neutral-600 mb-6">{dest.stayingHere.summary}</p>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="card p-5">
                <h3 className="font-semibold text-green-700 text-sm mb-3">✅ Why stay here</h3>
                <ul className="space-y-2">
                  {dest.stayingHere.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-green-500 mt-0.5">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-red-700 text-sm mb-3">⚠️ Things to know</h3>
                <ul className="space-y-2">
                  {dest.stayingHere.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-red-400 mt-0.5">–</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {dest.stayingHere.gettingElsewhere.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-sm mb-3">🚀 Getting to other places from {dest.name}</h3>
                <ul className="space-y-2">
                  {dest.stayingHere.gettingElsewhere.map((route, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-brand mt-0.5">→</span>
                      {route}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
      {renderWidgets("Staying Here")}

      {/* Visiting Here (neighbourhood-specific) */}
      {dest.visitingHere && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Visiting {dest.name}</h2>
            <p className="text-neutral-600 mb-4">{dest.visitingHere.summary}</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-neutral-50 rounded-lg px-4 py-2 border border-border">
                <span className="text-xs text-neutral-500 block">How long</span>
                <span className="text-sm font-semibold">{dest.visitingHere.idealDuration}</span>
              </div>
              <div className="bg-neutral-50 rounded-lg px-4 py-2 border border-border">
                <span className="text-xs text-neutral-500 block">Best time</span>
                <span className="text-sm font-semibold">{dest.visitingHere.bestTimeOfDay}</span>
              </div>
            </div>
            <ul className="space-y-2">
              {dest.visitingHere.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="text-brand mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Audience Tips */}
      {dest.audienceTips && dest.audienceTips.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Tips by Traveller Type</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.audienceTips.map((at) => (
                <div key={at.audience} className="card p-5">
                  <h3 className="font-bold capitalize mb-3">{at.audience.replace("-", " ")}</h3>
                  <ul className="space-y-2">
                    {at.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="text-brand mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {renderWidgets("Tips by Traveller Type")}

      {dest.practicalTips && dest.practicalTips.length > 0 && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Practical Tips</h2>
            <ul className="space-y-3">
              {dest.practicalTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {renderWidgets("Practical Tips")}

      {/* FAQs */}
      {dest.faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {dest.faqs.map((faq, i) => (
                <div key={i} className="card p-5">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {resolvedBlogPosts.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {resolvedBlogPosts.map((post) => post && (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{post.category}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">{post.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">Read guide →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
