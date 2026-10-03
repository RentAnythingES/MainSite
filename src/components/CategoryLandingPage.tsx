import Link from "next/link";
import CategoryProductCatalogue from "@/components/CategoryProductCatalogue";
import type { CategoryContent } from "@/content/category-content";
import type { Product } from "@/data/products";
import { localeRegistry, type Locale } from "@/i18n/config";

const copy = {
  en: { home: "Home", explore: "Explore →", guides: "Related Guides", read: "Read guide →", missing: "Can't find what you need?", ask: "We're constantly adding new products. Message us!", whatsapp: "💬 WhatsApp Us" },
  es: { home: "Inicio", explore: "Explorar →", guides: "Guías relacionadas", read: "Leer guía →", missing: "¿No encuentras lo que necesitas?", ask: "Escríbenos y te ayudaremos a encontrar una opción.", whatsapp: "💬 Escríbenos por WhatsApp" },
  de: { home: "Startseite", explore: "Entdecken →", guides: "Passende Ratgeber", read: "Ratgeber lesen →", missing: "Du findest nicht, was du brauchst?", ask: "Schreib uns, damit wir gemeinsam eine passende Möglichkeit finden.", whatsapp: "💬 Über WhatsApp schreiben" },
};
export default function CategoryLandingPage({
  meta, products, locale, prefix = localeRegistry[locale].prefix, relatedPosts = [],
}: {
  meta: CategoryContent; products: Product[]; locale: Locale; prefix?: string;
  relatedPosts?: Array<{ slug: string; category: string; title: string; excerpt: string }>;
}) {
  const displayTitle = meta.heading ?? meta.title;
  const displayDescription = meta.introDescription ?? meta.description;
  const text = copy[locale];
  return <>
      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href={prefix || "/"} className="hover:text-brand transition-colors">{text.home}</Link></li>
            <li>/</li>
            <li><Link href={locale === "de" ? prefix : `${prefix}/valencia`} className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{displayTitle}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-7 md:py-8">
        <div className="container-site">
          <div className="flex items-start gap-3">
            {meta.emoji && <span className="mt-1 text-3xl" aria-hidden="true">{meta.emoji}</span>}
            <div className="min-w-0">
              <h1 className="break-words text-3xl font-extrabold tracking-tight md:text-4xl">{displayTitle}</h1>
              <p className="mt-2 max-w-2xl text-neutral-600">{displayDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <CategoryProductCatalogue products={products} locale={locale} productBasePath={`${prefix}/product`} />

      {meta.familyPathways && meta.familyPathways.length > 0 && (
        <section className="border-y border-border bg-neutral-50 py-10">
          <div className="container-site">
            <div className="mb-5 max-w-3xl">
              <h2 className="text-2xl font-bold">{meta.familyHeading}</h2>
              <p className="mt-2 text-neutral-600">{meta.familyDescription}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {meta.familyPathways.map((pathway) => (
                <Link key={pathway.href} href={pathway.href} className="card group bg-white p-5 hover:shadow-md">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">{pathway.eyebrow}</span>
                  <h3 className="mt-2 text-lg font-bold group-hover:text-brand">{pathway.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{pathway.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {meta.searchIntents && meta.searchIntents.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.searchIntentHeading}</h2>
              <p className="text-neutral-600 leading-relaxed">{meta.searchIntentDescription}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.searchIntents.map((intent) => (
                <div key={intent.title} className="card p-6 bg-white">
                  <h3 className="font-bold text-lg mb-2">{intent.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{intent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Content */}
      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{meta.editorialHeading}</h2>
            {meta.editorialParagraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {meta.featuredPathways && meta.featuredPathways.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.featuredHeading}</h2>
              <p className="text-neutral-600">
                {meta.featuredDescription}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.featuredPathways.map((pathway) => (
                <Link
                  key={pathway.href}
                  href={pathway.href}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand mb-3">{pathway.eyebrow}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {pathway.description}
                  </p>
                  <span className="text-sm font-semibold text-brand">{text.explore}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">{text.guides}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`${prefix}/blog/${post.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{post.category}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">{text.read}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {meta.faqs && meta.faqs.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-8">{meta.faqHeading}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {meta.faqs.map((faq) => (
                  <div key={faq.question} className="card p-6 bg-white">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-neutral-50 py-12">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">{text.missing}</h2>
          <p className="text-neutral-500 mb-6">{text.ask}</p>
          <a
            href="https://wa.me/34684708013"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {text.whatsapp}
          </a>
        </div>
      </section>
  </>;
}
