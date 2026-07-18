import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getPublishedPosts } from "@/content/blog";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Blog — Travel Tips, Guides & Rental Advice | RentAnything.es",
  description:
    "Practical tips for travelling to Valencia. Guides for families, mobility needs, digital nomads & more. From the RentAnything.es team.",
  alternates: {
    canonical: "https://rentanything.es/blog",
  },
};

const categoryEmoji: Record<string, string> = {
  guide: "📖",
  tutorial: "🛠️",
  seasonal: "☀️",
  comparison: "⚖️",
  update: "📢",
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Valencia Travel Tips & Guides",
            description: "Practical Valencia guides for families, accessibility needs, remote workers and seasonal stays.",
            url: "https://rentanything.es/blog",
            locale: "en",
            items: posts.map((post) => ({
              name: post.title,
              url: `https://rentanything.es/blog/${post.slug}`,
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
              Valencia Travel Tips & Guides
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
                Blog posts coming soon!
              </p>
              <p className="text-neutral-500">
                We&apos;re working on guides for families, accessibility, remote
                work, and more.
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
                        {post.category}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <time
                        className="text-xs text-neutral-400"
                        dateTime={post.date}
                      >
                        {new Date(post.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-brand hover:underline"
                      >
                        Read more →
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
            Get Valencia Travel Tips
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Join our newsletter for seasonal guides, exclusive deals, and local
            recommendations. No spam, unsubscribe anytime.
          </p>
          <NewsletterSignup source="blog_footer" dark />
        </div>
      </section>
    </>
  );
}
