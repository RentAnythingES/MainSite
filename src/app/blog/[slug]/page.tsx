import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogPostBySlug,
  getAllBlogSlugsForBuild,
  isPublished,
  type BlogPost,
} from "@/content/blog";
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd, WEBSITE_SCHEMA_ID } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: post.heroImage || "/hero/valencia-1.webp",
          alt: post.heroImageAlt || post.title,
        },
      ],
    },
    alternates: {
      canonical: `https://rentanything.es/blog/${post.slug}`,
    },
  };
}

function getArticleJsonLd(post: BlogPost) {
  const postUrl = `https://rentanything.es/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    isPartOf: { "@id": WEBSITE_SCHEMA_ID },
    author: { "@id": BUSINESS_SCHEMA_ID },
    publisher: { "@id": BUSINESS_SCHEMA_ID },
    ...(post.heroImage && {
      image: `https://rentanything.es${post.heroImage}`,
    }),
  };
}

function getFaqJsonLd(post: BlogPost) {
  if (post.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const clusterCtas = [
  {
    slug: "best-beaches-valencia-families",
    tags: ["beach", "beaches"],
    href: "/rental/travel-outdoors",
    heading: "Need Beach Equipment for Your Valencia Stay?",
    description: "Compare beach umbrellas, shelters and family shade options, then check availability for your dates.",
    label: "Browse Beach Equipment",
  },
  {
    slug: "wheelchair-accessibility-valencia",
    tags: ["mobility", "accessibility"],
    href: "/rental/mobility",
    heading: "Need Mobility Equipment in Valencia?",
    description: "Compare wheelchairs, scooters and daily mobility aids with pickup and delivery options for your stay.",
    label: "Browse Mobility Equipment",
  },
  {
    slug: "digital-nomad-guide-valencia",
    tags: ["digital nomad", "remote work"],
    href: "/rental/remote-work",
    heading: "Need a Better Workspace in Valencia?",
    description: "Compare monitors, desks and ergonomic equipment for your apartment or longer Valencia stay.",
    label: "Browse Remote Work Equipment",
  },
  {
    slug: "valencia-summer-survival-guide",
    tags: ["summer", "seasonal"],
    href: "/rental/home-living",
    heading: "Need a More Comfortable Valencia Apartment?",
    description: "Compare portable cooling and apartment comfort equipment, then check availability for your dates.",
    label: "Browse Apartment Comfort",
  },
  {
    slug: "valencia-with-kids-complete-guide",
    tags: ["family", "kids"],
    href: "/rental/baby-gear",
    heading: "Need Family Equipment for Your Valencia Stay?",
    description: "Compare practical baby and toddler equipment without adding bulky items to your luggage.",
    label: "Browse Baby & Toddler Equipment",
  },
] as const;

function getClusterCta(post: BlogPost) {
  const tags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  return clusterCtas.find((cta) => cta.slug === post.slug)
    || clusterCtas.find((cta) => cta.tags.some((tag) => tags.has(tag)))
    || {
    href: "/valencia",
    heading: "Need Equipment for Your Valencia Stay?",
    description: "Browse practical rental equipment and check availability for your dates in Valencia.",
    label: "Browse Valencia Rentals",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  // 404 if post doesn't exist or isn't published yet
  if (!post || !isPublished(post)) notFound();

  const faqSchema = getFaqJsonLd(post);
  const clusterCta = getClusterCta(post);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getArticleJsonLd(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentanything.es" },
              { name: "Blog", url: "https://rentanything.es/blog" },
              { name: post.title, url: `https://rentanything.es/blog/${post.slug}` },
            ]),
          ),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/blog"
                className="text-sm text-neutral-400 hover:text-brand transition-colors"
              >
                ← Blog
              </Link>
              <span className="text-neutral-300">·</span>
              <span className="badge badge-brand capitalize">
                {post.category}
              </span>
              <span className="text-xs text-neutral-400">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              {post.h1}
            </h1>
            <p className="text-lg text-neutral-600 mb-4">{post.excerpt}</p>
            <time
              className="text-sm text-neutral-400"
              dateTime={post.date}
            >
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {post.heroImage && (
        <section className="bg-white">
          <div className="container-site">
            <div className="max-w-3xl mx-auto -mt-8">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt || post.title}
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Body */}
      <article className="section bg-white">
        <div className="container-site">
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-12">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                {section.image && (
                  <div className="rounded-xl overflow-hidden my-6">
                    <Image
                      src={section.image}
                      alt={section.imageAlt || section.heading}
                      width={800}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      {/* FAQs — first 2 open as prose, rest in accordions */}
      {post.faqs.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="card p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cross-Links */}
      {post.crossLinks.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">You Might Also Need</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {post.crossLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="card p-5 hover:shadow-md transition-shadow group"
                  >
                    <h3 className="font-semibold mb-1 group-hover:text-brand transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {link.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            {clusterCta.heading}
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            {clusterCta.description}
          </p>
          <Link href={clusterCta.href} className="btn btn-accent">
            {clusterCta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
