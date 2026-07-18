import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/content/blog";
import {
  BUSINESS_SCHEMA_ID,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  WEBSITE_SCHEMA_ID,
} from "@/lib/jsonld";

export interface BlogArticleCta {
  href: string;
  heading: string;
  description: string;
  label: string;
}

interface BlogArticleLabels {
  home: string;
  blog: string;
  faqTitle: string;
  relatedTitle: string;
  category: Record<BlogPost["category"], string>;
}

interface BlogArticlePageProps {
  post: BlogPost;
  locale: "en" | "es";
  blogHref: string;
  pageUrl: string;
  cta: BlogArticleCta;
  labels: BlogArticleLabels;
}

export default function BlogArticlePage({
  post,
  locale,
  blogHref,
  pageUrl,
  cta,
  labels,
}: BlogArticlePageProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    isPartOf: { "@id": WEBSITE_SCHEMA_ID },
    author: { "@id": BUSINESS_SCHEMA_ID },
    publisher: { "@id": BUSINESS_SCHEMA_ID },
    ...(post.heroImage && { image: `https://rentanything.es${post.heroImage}` }),
  };
  const faqSchema = getFaqJsonLd(
    post.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: labels.home, url: `https://rentanything.es${locale === "es" ? "/es" : ""}` },
              { name: labels.blog, url: `https://rentanything.es${blogHref}` },
              { name: post.title, url: pageUrl },
            ])
          ),
        }}
      />
      {post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Link href={blogHref} className="text-sm text-neutral-400 hover:text-brand transition-colors">
                ← {labels.blog}
              </Link>
              <span className="text-neutral-300">·</span>
              <span className="badge badge-brand capitalize">{labels.category[post.category]}</span>
              <span className="text-xs text-neutral-400">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              {post.h1}
            </h1>
            <p className="text-lg text-neutral-600 mb-4">{post.excerpt}</p>
            <time className="text-sm text-neutral-400" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

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

      <article className="section bg-white">
        <div className="container-site">
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
            {post.sections.map((section, sectionIndex) => (
              <section key={section.heading} className="mb-12">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${sectionIndex}-${paragraphIndex}`}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
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

      {post.faqs.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">{labels.faqTitle}</h2>
              <div className="space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="card p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {post.crossLinks.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">{labels.relatedTitle}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {post.crossLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="card p-5 hover:shadow-md transition-shadow group">
                    <h3 className="font-semibold mb-1 group-hover:text-brand transition-colors">{link.title}</h3>
                    <p className="text-sm text-neutral-500">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{cta.heading}</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">{cta.description}</p>
          <Link href={cta.href} className="btn btn-accent">{cta.label}</Link>
        </div>
      </section>
    </>
  );
}
