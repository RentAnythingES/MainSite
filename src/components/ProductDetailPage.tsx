import ProductPageBody from "@/components/ProductPageBody";
import ProductPlanningLinks from "@/components/ProductPlanningLinks";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getPublishedPosts, type BlogPost } from "@/content/blog";
import { getSpanishBlogPostBySlug } from "@/content/blog-es";
import { getGermanBlogPostBySlug } from "@/content/blog-de";
import { getProductJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import { localeRegistry, type Locale } from "@/i18n/config";

const categoryBlogTags: Record<string, string[]> = {
  "baby-gear": ["family", "kids"],
  "kids-family": ["family", "kids"],
  "mobility": ["mobility", "accessibility"],
  "remote-work": ["digital nomad", "remote work"],
  "home-living": ["summer", "seasonal"],
  "travel-outdoors": ["summer", "beach"],
  "fitness-wellness": ["sports", "fitness", "wellness"],
};
export default function ProductDetailPage({ product, related, locale }: { product: Product; related: Product[]; locale: Locale }) {
  const prefix = localeRegistry[locale].prefix;


  const pageHeading = product.slug === "mobility-power-wheelchair"
    ? { en: "Electric Wheelchair Rental in Valencia", es: "Alquiler de silla de ruedas eléctrica en Valencia", de: "Elektrischen Rollstuhl mieten in Valencia" }[locale]
    : product.name;



  // Find related blog posts for this product's category
  const relevantTags = categoryBlogTags[product.categorySlug] || [];
  const relatedPosts = getPublishedPosts()
    .filter((post) => post.tags.some((tag) => relevantTags.includes(tag)))
    .slice(0, 2)
    .map(post => locale === "de" ? getGermanBlogPostBySlug(post.slug) : locale === "es" ? getSpanishBlogPostBySlug(post.slug) : post)
    .filter((post): post is BlogPost => Boolean(post));

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getProductJsonLd(product, { locale, availability: "LimitedAvailability" })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: { en: "Home", es: "Inicio", de: "Startseite" }[locale], url: `https://rentandroll.com${prefix}` },
              { name: "Valencia", url: `https://rentandroll.com${prefix}/valencia` },
              { name: product.category, url: `https://rentandroll.com${prefix}/rental/${product.categorySlug}` },
              { name: product.name, url: `https://rentandroll.com${prefix}/product/${product.slug}` },
            ])
          ),
        }}
      />
      {product.faqs && product.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: product.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <li><Link href={`${prefix}` || "/"} className="hover:text-brand transition-colors">{{"en":"Home","es":"Inicio","de":"Startseite"}[locale]}</Link></li>
            <li>/</li>
            <li><Link href={`${prefix}/valencia` || "/"} className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href={`${prefix}/rental/${product.categorySlug}`} className="hover:text-brand transition-colors">{product.category}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{product.name}</li>
          </ol>
        </div>
      </nav>

      <ProductPageBody product={product} locale={locale} productBasePath={`${prefix}/product`} heading={pageHeading} related={related}>

      {/* Delivery Info */}
      <section className="bg-neutral-50 py-10">
        <div className="container-site">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-2xl mb-2 block">🚚</span>
              <p className="font-semibold text-sm">{{"en":"Free delivery over €50","es":"Entrega gratis a partir de 50 €","de":"Kostenlose Lieferung ab 50 €"}[locale]}</p>
              <p className="text-xs text-neutral-500">{{"en":"Valencia city & beaches","es":"Valencia ciudad y playas","de":"Valencia: Stadt und Strände"}[locale]}</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🧼</span>
              <p className="font-semibold text-sm">{{"en":"Sanitised & inspected","es":"Higienizado y revisado","de":"Hygienisch aufbereitet und geprüft"}[locale]}</p>
              <p className="text-xs text-neutral-500">{{"en":"Between every rental","es":"Entre cada alquiler","de":"Zwischen jeder Vermietung"}[locale]}</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">↩️</span>
              <p className="font-semibold text-sm">{{"en":"Easy returns","es":"Devoluciones fáciles","de":"Einfache Rückgabe"}[locale]}</p>
              <p className="text-xs text-neutral-500">{{"en":"We collect from your door","es":"Recogemos en tu puerta","de":"Wir holen an deiner Tür ab"}[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      <ProductPlanningLinks
        categoryName={product.category}
        categorySlug={product.categorySlug}
        productSlug={product.slug}
        locale={locale}
      />

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">{{"en":"Valencia Guides","es":"Guías de Valencia","de":"Valencia-Ratgeber"}[locale]}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`${prefix}/blog/${post.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{{ en: post.category, es: { guide: "Guía", tutorial: "Tutorial", seasonal: "Temporada", comparison: "Comparativa", update: "Actualización" }[post.category], de: { guide: "Ratgeber", tutorial: "Anleitung", seasonal: "Saisonales", comparison: "Vergleich", update: "Neuigkeiten" }[post.category] }[locale]}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">
                    {{ en: "Read guide →", es: "Leer guía →", de: "Ratgeber lesen →" }[locale]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      </ProductPageBody>
    </>
  );

}
