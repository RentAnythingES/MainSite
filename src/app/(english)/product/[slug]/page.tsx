import ProductPageBody from "@/components/ProductPageBody";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs } from "@/data/products";
import {
  getProductBySlugFromDB,
  getProductsByCategoryFromDB,
  getProductSeoState,
} from "@/lib/product-service";
import { getProductJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import { getPublishedPosts } from "@/content/blog";

import ProductPlanningLinks from "@/components/ProductPlanningLinks";
import { productPageMetadata } from "@/lib/product-page-metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, seoState] = await Promise.all([
    getProductBySlugFromDB(slug, "en"), getProductSeoState(slug),
  ]);
  return productPageMetadata(slug, "en", product, seoState);
}

// Map product categories to relevant blog post tags
const categoryBlogTags: Record<string, string[]> = {
  "baby-gear": ["family", "kids"],
  "kids-family": ["family", "kids"],
  "mobility": ["mobility", "accessibility"],
  "remote-work": ["digital nomad", "remote work"],
  "home-living": ["summer", "seasonal"],
  "travel-outdoors": ["summer", "beach"],
  "fitness-wellness": ["sports", "fitness", "wellness"],
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug);
  if (!product) notFound();
  const pageHeading = product.slug === "mobility-power-wheelchair"
    ? "Electric Wheelchair Rental in Valencia"
    : product.name;

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getProductJsonLd(product, { locale: "en", availability: "LimitedAvailability" })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentandroll.com" },
              { name: "Valencia", url: "https://rentandroll.com/valencia" },
              { name: product.category, url: `https://rentandroll.com/rental/${product.categorySlug}` },
              { name: product.name, url: `https://rentandroll.com/product/${product.slug}` },
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

      <ProductPageBody product={product} locale="en" heading={pageHeading} related={related}>

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

      <ProductPlanningLinks
        categoryName={product.category}
        categorySlug={product.categorySlug}
        productSlug={product.slug}
      />

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

      </ProductPageBody>
    </>
  );
}
