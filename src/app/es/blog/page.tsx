import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getPublishedSpanishPosts } from "@/content/blog-es";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Guías de Valencia para familias y estancias de verano",
  description:
    "Consejos prácticos para visitar Valencia: playas con niños, calor, alojamiento y equipamiento útil para disfrutar de una estancia más cómoda.",
  alternates: {
    canonical: "https://rentanything.es/es/blog",
    languages: {
      en: "https://rentanything.es/blog",
      es: "https://rentanything.es/es/blog",
      "x-default": "https://rentanything.es/blog",
    },
  },
};

const categoryLabels = {
  guide: "Guía",
  tutorial: "Tutorial",
  seasonal: "Temporada",
  comparison: "Comparativa",
  update: "Actualización",
};

export default function SpanishBlogPage() {
  const posts = getPublishedSpanishPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getHubCollectionJsonLd({
              name: "Consejos y guías para visitar Valencia",
              description: "Guías prácticas en español para familias y estancias de verano en Valencia.",
              url: "https://rentanything.es/es/blog",
              locale: "es",
              items: posts.map((post) => ({
                name: post.title,
                url: `https://rentanything.es/es/blog/${post.slug}`,
              })),
            })
          ),
        }}
      />

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">Blog</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Consejos y guías para visitar Valencia
            </h1>
            <p className="text-lg text-neutral-600">
              Información práctica para organizar días de playa, viajar con niños
              y mantener un alojamiento más cómodo durante el verano valenciano.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
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
                  <div className="aspect-[2/1] bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center">
                    <span className="text-5xl" aria-hidden="true">📖</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge badge-brand">{categoryLabels[post.category]}</span>
                    <span className="text-xs text-neutral-400">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">
                    <Link href={`/es/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between gap-4">
                    <time className="text-xs text-neutral-400" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <Link href={`/es/blog/${post.slug}`} className="text-sm font-semibold text-brand hover:underline">
                      Leer guía →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Recibe consejos sobre Valencia</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Guías estacionales y recomendaciones prácticas. Sin mensajes innecesarios y con baja fácil.
          </p>
          <NewsletterSignup source="es_blog_footer" locale="es" dark />
        </div>
      </section>
    </>
  );
}
