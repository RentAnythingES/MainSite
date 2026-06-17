import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Travel Tips, Guides & Rental Advice",
  description:
    "Practical tips for travelling to Valencia. Guides for families, mobility needs, digital nomads & more. From the RentAnything.es team.",
};

const posts = [
  {
    slug: "valencia-with-kids-complete-guide",
    title: "Valencia With Kids: The Complete Family Guide (2026)",
    excerpt:
      "Everything you need to know about visiting Valencia with children — from the best beaches to kid-friendly restaurants and what gear to bring.",
    category: "Family Travel",
    date: "2026-06-15",
    readTime: "8 min read",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    slug: "wheelchair-accessibility-valencia",
    title: "Wheelchair Accessibility in Valencia: An Honest Guide",
    excerpt:
      "A practical guide to navigating Valencia with a wheelchair or mobility scooter — accessible attractions, transport tips, and what to expect.",
    category: "Mobility",
    date: "2026-06-10",
    readTime: "6 min read",
    emoji: "♿",
  },
  {
    slug: "digital-nomad-guide-valencia",
    title: "Digital Nomad Guide to Valencia: Work & Live Well",
    excerpt:
      "Why Valencia is one of Europe's top digital nomad hubs — co-working spaces, internet speeds, cost of living, and setting up your remote office.",
    category: "Remote Work",
    date: "2026-06-05",
    readTime: "7 min read",
    emoji: "💻",
  },
  {
    slug: "what-to-pack-for-valencia",
    title: "What to Pack (and What to Rent) for a Valencia Trip",
    excerpt:
      "The definitive packing list for Valencia — plus what you should leave at home and rent instead to save luggage space and airline fees.",
    category: "Travel Tips",
    date: "2026-06-01",
    readTime: "5 min read",
    emoji: "🧳",
  },
];

export default function BlogPage() {
  return (
    <>
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
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="card group p-0">
                <div className="aspect-[2/1] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {post.emoji}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge badge-brand">{post.category}</span>
                    <span className="text-xs text-neutral-400">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-neutral-400" dateTime={post.date}>
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
          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/10 text-white placeholder:text-teal-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button type="submit" className="btn btn-accent whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
