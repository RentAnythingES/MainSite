import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { customerPrefix } from "@/i18n/customer-path";
import { getPublishedGermanPosts } from "@/content/blog-de";
import { getPublishedSpanishPosts } from "@/content/blog-es";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getPublishedPosts } from "@/content/blog";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

const categoryEmoji: Record<string, string> = {
  guide: "📖",
  tutorial: "🛠️",
  seasonal: "☀️",
  comparison: "⚖️",
  update: "📢",
};

const copy = {
  en: { title: "Valencia Travel Tips & Guides", description: "{text.description}", schemaDescription: "Practical Valencia guides for families, accessibility needs, remote workers and seasonal stays.", empty: "Blog posts coming soon!", emptyDescription: "We're working on guides for families, accessibility, remote work, and more.", more: "Read more →", newsletter: "Get Valencia Travel Tips", newsletterDescription: "{text.newsletterDescription}", date: "en-GB", categories: {guide:"guide",tutorial:"tutorial",seasonal:"seasonal",comparison:"comparison",update:"update"} },
  es: { title: "Consejos y guías para visitar Valencia", description: "Consejos prácticos para familias, personas con necesidades de movilidad, quienes trabajan a distancia y cualquier visitante de Valencia. Escritos por gente local que conoce la ciudad.", schemaDescription: "Guías prácticas de Valencia para familias, accesibilidad, trabajo a distancia y estancias de temporada.", empty: "¡Próximamente publicaremos artículos!", emptyDescription: "Estamos preparando guías para familias, accesibilidad, trabajo a distancia y mucho más.", more: "Leer más →", newsletter: "Recibe consejos sobre Valencia", newsletterDescription: "Suscríbete para recibir guías de temporada, ofertas exclusivas y recomendaciones locales. Sin spam; puedes darte de baja cuando quieras.", date: "es-ES", categories: {guide:"Guía",tutorial:"Tutorial",seasonal:"Temporada",comparison:"Comparativa",update:"Actualización"} },
  de: { title: "Reisetipps und Reiseführer für Valencia", description: "Praktische Tipps für Familien, Menschen mit Mobilitätsbedarf, alle, die mobil arbeiten, und alle Besucher Valencias. Geschrieben von Menschen vor Ort, die die Stadt kennen.", schemaDescription: "Praktische Valencia-Reiseführer für Familien, barrierefreies Reisen, mobiles Arbeiten und saisonale Aufenthalte.", empty: "Neue Blogartikel erscheinen bald!", emptyDescription: "Wir arbeiten an Reiseführern für Familien, barrierefreies Reisen, mobiles Arbeiten und mehr.", more: "Weiterlesen →", newsletter: "Erhalte Reisetipps für Valencia", newsletterDescription: "Abonniere unseren Newsletter für saisonale Reiseführer, exklusive Angebote und lokale Empfehlungen. Kein Spam; du kannst dich jederzeit abmelden.", date: "de-DE", categories: {guide:"Reiseführer",tutorial:"Anleitung",seasonal:"Saisonal",comparison:"Vergleich",update:"Neuigkeiten"} },
};
export default function BlogPageBody({locale = "en"}: {locale?: Locale}) {
  const posts = locale === "de" ? getPublishedGermanPosts() : locale === "es" ? getPublishedSpanishPosts() : getPublishedPosts();
  const text = copy[locale];
  const prefix = customerPrefix(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: text.title,
            description: text.schemaDescription,
            url: "https://rentandroll.com" + prefix + "/blog",
            locale,
            items: posts.map((post) => ({
              name: post.title,
              url: `https://rentandroll.com${prefix}/blog/${post.slug}`,
            })),
          })),
        }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">Blog</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {text.title}
            </h1>
            <p className="text-lg text-neutral-600">
              Practical advice for families, mobility needs, remote workers, and
              anyone visiting Valencia. Written by locals who know the city.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section bg-white">
        <div className="container-site">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-400 mb-4">
                {text.empty}
              </p>
              <p className="text-neutral-500">
                {text.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="card group p-0 overflow-hidden">
                  {post.heroImage ? (
                    <div className="aspect-[2/1] relative">
                      <Image
                        src={post.heroImage}
                        alt={post.heroImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[2/1] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {categoryEmoji[post.category] || "📝"}
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge badge-brand capitalize">
                        {text.categories[post.category]}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">
                      <Link href={`${prefix}/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <time
                        className="text-xs text-neutral-400"
                        dateTime={post.date}
                      >
                        {new Date(post.date).toLocaleDateString(text.date, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <Link
                        href={`${prefix}/blog/${post.slug}`}
                        className="text-sm font-semibold text-brand hover:underline"
                      >
                        {text.more}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            {text.newsletter}
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Join our newsletter for seasonal guides, exclusive deals, and local
            recommendations. No spam, unsubscribe anytime.
          </p>
          <NewsletterSignup source="blog_footer" locale={locale} dark />
        </div>
      </section>
    </>
  );
}
