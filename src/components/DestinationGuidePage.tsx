import Link from "next/link";
import Image from "next/image";
import type { Destination, DestinationGovernance } from "@/content/destinations";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { publishedGermanCategory } from "@/lib/german-catalogue";
import { getBlogPostBySlug } from "@/content/blog";
import { getGermanBlogPostBySlug } from "@/content/blog-de";
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd, WEBSITE_SCHEMA_ID } from "@/lib/jsonld";
import { localeRegistry, type Locale } from "@/i18n/config";
import { customerPrefix } from "@/i18n/customer-path";
import { discoverCopy } from "@/i18n/discover";
import TrackedLink from "@/components/analytics/TrackedLink";
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

const PRODUCT_WIDGET_PREVIEW_LIMIT = 4;

export default async function DestinationGuidePage({dest,governance,locale="en"}: {dest: Destination; governance?: DestinationGovernance; locale?: Locale}) {
  const text = discoverCopy[locale];
  const prefix = customerPrefix(locale);
  const typeLabels = text.types;
  const hubLabels = text.hubs;
  const primaryHub = dest.hubs[0] || "attractions";
  const primaryHubLabel = hubLabels[primaryHub];

  const widgetCategories = [...new Set(dest.productWidgets.map((widget) => widget.categorySlug))];
  const productsByCategory = new Map(
    await Promise.all(
      widgetCategories.map(async (categorySlug) => [
        categorySlug,
        await (locale === "de" ? publishedGermanCategory(categorySlug) : getProductsByCategoryFromDB(categorySlug)),
      ] as const),
    ),
  );

  // Helper: render inline product strip for a given section
  const renderWidgets = (sectionName: string) => {
    const matching = dest.productWidgets.filter((w) => w.afterSection === sectionName);
    if (matching.length === 0) return null;
    return (
      <>
        {matching.map((w, idx) => {
          const products = productsByCategory.get(w.categorySlug) || [];
          if (products.length === 0) return null;
          const previewProducts = products.slice(0, PRODUCT_WIDGET_PREVIEW_LIMIT);
          return (
            <div key={idx} className="border-y border-border bg-neutral-50/60 py-5">
              <div className="container-site">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-700">{w.heading}</h3>
                  <TrackedLink
                    href={`${prefix}/rental/${w.categorySlug}`}
                    eventName="discover_commercial_click"
                    eventParams={{ locale, source_guide: dest.slug, target_type: "category", target_slug: w.categorySlug }}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    {text.viewAll} {products.length} →
                  </TrackedLink>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x scrollbar-hide">
                  {previewProducts.map((product) => (
                    <TrackedLink
                      key={product.slug}
                      href={`${prefix}/product/${product.slug}`}
                      eventName="discover_commercial_click"
                      eventParams={{ locale, source_guide: dest.slug, target_type: "product", target_slug: product.slug }}
                      className="flex-shrink-0 w-36 group"
                    >
                      <div className="aspect-square bg-white rounded-lg border border-border relative overflow-hidden mb-1.5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                          sizes="144px"
                        />
                      </div>
                      <p className="text-xs font-medium text-neutral-800 leading-tight line-clamp-2 group-hover:text-brand transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-brand font-semibold mt-0.5">
                        {text.from}{product.pricing[product.pricing.length - 1].perDay}{text.perDay}
                      </p>
                    </TrackedLink>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  // Resolve related blog posts
  const resolvedBlogPosts = dest.relatedBlogPosts
    .map((slug) => locale === "de" ? getGermanBlogPostBySlug(slug) : getBlogPostBySlug(slug))
    .filter(Boolean);

  // JSON-LD
  const destinationUrl = `https://rentandroll.com${prefix}/discover/${dest.slug}`;
  const jsonLd = dest.type === "event"
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: dest.name,
        description: dest.description,
        datePublished: dest.date,
        dateModified: governance?.contentReviewedAt || dest.lastUpdated,
        inLanguage: locale,
        mainEntityOfPage: { "@type": "WebPage", "@id": destinationUrl },
        isPartOf: { "@id": WEBSITE_SCHEMA_ID },
        author: { "@id": BUSINESS_SCHEMA_ID },
        publisher: { "@id": BUSINESS_SCHEMA_ID },
        ...(dest.heroImage && { image: `https://rentandroll.com${dest.heroImage}` }),
      }
    : {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: dest.name,
        description: dest.description,
        url: destinationUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": destinationUrl },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: text.home, url: "https://rentandroll.com" + prefix },
              { name: text.discover, url: "https://rentandroll.com" + prefix + "/discover" },
              { name: primaryHubLabel, url: `https://rentandroll.com${prefix}/discover/${primaryHub}` },
              { name: dest.name, url: `https://rentandroll.com${prefix}/discover/${dest.slug}` },
            ]),
          ),
        }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <li><Link href={prefix || "/"} className="hover:text-brand transition-colors">{text.home}</Link></li>
            <li>/</li>
            <li><Link href={prefix + "/discover"} className="hover:text-brand transition-colors">{text.discover}</Link></li>
            <li>/</li>
            <li><Link href={`${prefix}/discover/${primaryHub}`} className="hover:text-brand transition-colors">{primaryHubLabel}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{dest.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {dest.heroImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={dest.heroImage}
                alt={dest.heroImageAlt || dest.name}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="container-site relative z-10 py-20 md:py-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-brand">{typeLabels[dest.type]}</span>
                {dest.distanceFromValencia && (
                  <span className="text-sm text-white/80">📍 {dest.distanceFromValencia}</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{dest.name}</h1>
              <p className="text-lg text-white/90 max-w-2xl drop-shadow">{dest.tagline}</p>
              {dest.overview?.quickFacts && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {dest.overview.quickFacts.map((fact) => (
                    <div key={fact.label} className="bg-white/15 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                      <span className="text-xs text-white/70 block">{fact.label}</span>
                      <span className="text-sm font-semibold text-white">{fact.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-white/50 mt-4">{text.updated} {dest.lastUpdated}</p>
              {dest.heroImageProvenance.status === "licensed" && (
                <p className="mt-2 text-xs text-white/70">
                  {text.photo}{" "}
                  <a
                    href={dest.heroImageProvenance.sourceUrl}
                    className="underline underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dest.heroImageProvenance.creator}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={dest.heroImageProvenance.licenseUrl}
                    className="underline underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dest.heroImageProvenance.license}
                  </a>{" "}
                  {text.cropped}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
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
              <p className="text-xs text-neutral-400 mt-4">{text.updated} {dest.lastUpdated}</p>
            </div>
          </div>
        )}
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
              <div><span className="text-xs text-neutral-500 block">{text.dates}</span><span className="font-semibold">{dest.eventInfo.dates}</span></div>
              <div><span className="text-xs text-neutral-500 block">{text.frequency}</span><span className="font-semibold">{dest.eventInfo.frequency}</span></div>
              <div><span className="text-xs text-neutral-500 block">{text.crowd}</span><span className="font-semibold capitalize">{locale === "en" ? dest.eventInfo.crowdLevel : text.crowds[dest.eventInfo.crowdLevel]}</span></div>
              <div><span className="text-xs text-neutral-500 block">{text.tickets}</span><span className="font-semibold">{dest.eventInfo.ticketsRequired ? text.required : text.free}</span></div>
            </div>
            <p className="text-sm text-neutral-600 mt-4">{dest.eventInfo.bookingAdvice}</p>
          </div>
        </section>
      )}

      {/* Highlights */}
      {dest.highlights && dest.highlights.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">{text.highlights}</h2>
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
            <h2 className="text-2xl font-bold mb-4">{text.gettingThere}</h2>
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
            <h2 className="text-2xl font-bold mb-4">{text.bestTime}</h2>
            <p className="text-neutral-600 mb-6">{dest.bestTimeToVisit.summary}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dest.bestTimeToVisit.seasons.map((s) => (
                <div key={locale === "en" ? s.season : text.seasons[s.season]} className="card p-4 text-center">
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
            <h2 className="text-2xl font-bold mb-4">{text.accessibility}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">{"★".repeat(dest.accessibility.overallRating)}{"☆".repeat(5 - dest.accessibility.overallRating)}</span>
              <span className="text-sm text-neutral-500">{dest.accessibility.overallRating}{text.accessibilityScore}</span>
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
            <h2 className="text-2xl font-bold mb-4">{text.packing}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-green-700 mb-2">{text.bring}</h3>
                <ul className="space-y-1">
                  {dest.whatToBring.bring.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-red-700 mb-2">{text.dontBring}</h3>
                <ul className="space-y-1">
                  {dest.whatToBring.dontBring.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-brand mb-2">{text.rent}</h3>
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
            <h2 className="text-2xl font-bold mb-4">{text.food}</h2>
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
                  {r.familyFriendly && <span className="text-xs text-neutral-400 block mt-1">{text.family}</span>}
                </div>
              ))}
            </div>
            {dest.foodAndDrink.localSpeciality && (
              <p className="text-sm text-neutral-600 mt-6 bg-white rounded-xl p-4 border border-border">
                🍷 <strong>{text.localTip}</strong> {dest.foodAndDrink.localSpeciality}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Where to Stay */}
      {dest.whereToStay && (
        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{text.stay}</h2>
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
            <h2 className="text-2xl font-bold mb-4">{text.stayingIn} {dest.name}</h2>
            <p className="text-neutral-600 mb-6">{dest.stayingHere.summary}</p>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="card p-5">
                <h3 className="font-semibold text-green-700 text-sm mb-3">{text.pros}</h3>
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
                <h3 className="font-semibold text-red-700 text-sm mb-3">{text.cons}</h3>
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
                <h3 className="font-semibold text-sm mb-3">{text.otherPlaces} {dest.name}</h3>
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
            <h2 className="text-2xl font-bold mb-4">{text.visiting} {dest.name}</h2>
            <p className="text-neutral-600 mb-4">{dest.visitingHere.summary}</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-neutral-50 rounded-lg px-4 py-2 border border-border">
                <span className="text-xs text-neutral-500 block">{text.howLong}</span>
                <span className="text-sm font-semibold">{dest.visitingHere.idealDuration}</span>
              </div>
              <div className="bg-neutral-50 rounded-lg px-4 py-2 border border-border">
                <span className="text-xs text-neutral-500 block">{text.bestHour}</span>
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
            <h2 className="text-2xl font-bold mb-6">{text.audienceTips}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.audienceTips.map((at) => (
                <div key={at.audience} className="card p-5">
                  <h3 className="font-bold capitalize mb-3">{locale === "en" ? at.audience.replace("-", " ") : text.audiences[at.audience]}</h3>
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
            <h2 className="text-2xl font-bold mb-4">{text.practical}</h2>
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
            <h2 className="text-2xl font-bold mb-6">{text.faqs}</h2>
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
            <h2 className="text-2xl font-bold mb-6">{text.related}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {resolvedBlogPosts.map((post) => post && (
                <TrackedLink
                  key={post.slug}
                  href={`${prefix}/blog/${post.slug}`}
                  eventName="discover_editorial_click"
                  eventParams={{ locale, source_guide: dest.slug, target_type: "blog", target_slug: post.slug }}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{locale === "en" ? post.category : text.categories[post.category]}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">{post.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">{text.read}</span>
                </TrackedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {governance && (
        <section className="border-t border-border bg-neutral-50 py-8">
          <div className="container-site max-w-3xl text-sm text-neutral-500">
            <p className="mb-3">
              {text.reviewed} {new Intl.DateTimeFormat(localeRegistry[locale].format, { dateStyle: "long" }).format(new Date(`${governance.contentReviewedAt}T00:00:00Z`))}.
            </p>
            <details>
              <summary className="cursor-pointer font-semibold text-neutral-700 hover:text-brand">{text.sources}</summary>
              <ul className="mt-3 space-y-2">
                {governance.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                      {source.label}
                    </a>{" "}
                    <span>— {source.publisher}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </section>
      )}
    </>
  );
}
