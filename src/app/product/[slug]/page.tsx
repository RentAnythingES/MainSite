import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs } from "@/data/products";
import { getProductBySlugFromDB, getProductsByCategoryFromDB } from "@/lib/product-service";
import { getProductJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import { getPublishedPosts } from "@/content/blog";
import ProductCard from "@/components/ProductCard";
import BookingWidget from "@/components/BookingWidget";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug);
  if (!product) return { title: "Product Not Found" };

  const lowestPrice = product.pricing[product.pricing.length - 1].perDay;
  if (product.seoTitle || product.seoDescription) {
    const title = product.seoTitle || `Rent ${product.name} in Valencia — from €${lowestPrice}/day`;
    const description = product.seoDescription || product.description;
    return {
      title,
      description,
      openGraph: { title, description },
    };
  }

  return {
    title: `Rent ${product.name} in Valencia — from €${lowestPrice}/day`,
    description: product.description,
    openGraph: {
      title: `Rent ${product.name} in Valencia | RentAnything.es`,
      description: product.description,
    },
  };
}

// Map product categories to relevant blog post tags
const categoryBlogTags: Record<string, string[]> = {
  "baby-gear": ["family", "kids"],
  "mobility": ["mobility", "accessibility"],
  "remote-work": ["digital nomad", "remote work"],
  "home-living": ["summer", "seasonal"],
  "travel-outdoors": ["summer", "beach"],
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug);
  if (!product) notFound();

  const related = (await getProductsByCategoryFromDB(product.categorySlug))
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 3);

  // Find related blog posts for this product's category
  const relevantTags = categoryBlogTags[product.categorySlug] || [];
  const relatedPosts = getPublishedPosts()
    .filter((post) => post.tags.some((tag) => relevantTags.includes(tag)))
    .slice(0, 2);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentanything.es" },
              { name: "Valencia", url: "https://rentanything.es/valencia" },
              { name: product.category, url: `https://rentanything.es/rental/${product.categorySlug}` },
              { name: product.name, url: `https://rentanything.es/product/${product.slug}` },
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
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href={`/rental/${product.categorySlug}`} className="hover:text-brand transition-colors">{product.category}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Product Info (2 cols) */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Image */}
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                </div>

                {/* Core Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-brand">{product.subcategory}</span>
                    <span className="text-xs text-neutral-400">{product.brand}</span>
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight mb-4">
                    {product.name}
                  </h1>

                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Pricing Table */}
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <h3 className="font-bold text-sm text-neutral-800 mb-3">Rental Pricing</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.pricing.map((tier) => (
                        <div
                          key={tier.days}
                          className="bg-white rounded-lg border border-border p-2.5 text-center hover:border-brand/30 transition-colors"
                        >
                          <p className="text-xs text-neutral-500 mb-0.5">
                            {tier.days === 1 ? "1 day" : `${tier.days}+ days`}
                          </p>
                          <p className="text-lg font-bold text-brand">€{tier.perDay}</p>
                          <p className="text-xs text-neutral-400">/ day</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      Longer rental = lower daily rate.
                    </p>
                  </div>
                </div>
              </div>

              {product.detailDescription && (
                <div className="mb-8">
                  <h2 className="font-bold text-neutral-800 mb-3">Rental details</h2>
                  <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                    {product.detailDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-bold text-neutral-800 mb-3">Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {(product.includesText || product.constraintsText || product.deliverySetupNote || product.careNote) && (
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {product.includesText && (
                    <div className="rounded-xl bg-neutral-50 border border-border p-4">
                      <h2 className="font-bold text-sm text-neutral-800 mb-2">What&apos;s included</h2>
                      <p className="text-sm text-neutral-600 whitespace-pre-line">{product.includesText}</p>
                    </div>
                  )}
                  {product.constraintsText && (
                    <div className="rounded-xl bg-neutral-50 border border-border p-4">
                      <h2 className="font-bold text-sm text-neutral-800 mb-2">Good to know</h2>
                      <p className="text-sm text-neutral-600 whitespace-pre-line">{product.constraintsText}</p>
                    </div>
                  )}
                  {product.deliverySetupNote && (
                    <div className="rounded-xl bg-neutral-50 border border-border p-4">
                      <h2 className="font-bold text-sm text-neutral-800 mb-2">Delivery and setup</h2>
                      <p className="text-sm text-neutral-600 whitespace-pre-line">{product.deliverySetupNote}</p>
                    </div>
                  )}
                  {product.careNote && (
                    <div className="rounded-xl bg-neutral-50 border border-border p-4">
                      <h2 className="font-bold text-sm text-neutral-800 mb-2">Care and hygiene</h2>
                      <p className="text-sm text-neutral-600 whitespace-pre-line">{product.careNote}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Specs */}
              <div>
                <h3 className="font-bold text-neutral-800 mb-3">Specifications</h3>
                <dl className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2.5 text-sm">
                      <dt className="text-neutral-500">{key}</dt>
                      <dd className="font-medium text-neutral-800">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right: Booking Widget (sticky) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingWidget product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="bg-neutral-50 py-10">
        <div className="container-site">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-2xl mb-2 block">🚚</span>
              <p className="font-semibold text-sm">Free delivery over €50</p>
              <p className="text-xs text-neutral-500">Valencia city & beaches</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">🧼</span>
              <p className="font-semibold text-sm">Sanitised & inspected</p>
              <p className="text-xs text-neutral-500">Between every rental</p>
            </div>
            <div>
              <span className="text-2xl mb-2 block">↩️</span>
              <p className="font-semibold text-sm">Easy returns</p>
              <p className="text-xs text-neutral-500">We collect from your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Valencia Guides</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{post.category}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">
                    Read guide →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="card p-5">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">You Might Also Need</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
