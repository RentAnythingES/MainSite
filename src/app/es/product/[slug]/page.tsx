import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProductBySlug, getAllSlugs } from "@/data/products";
import { getProductJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import ProductCard from "@/components/ProductCard";
import BookingWidget from "@/components/BookingWidget";
import { getDictionary } from "@/i18n/getDictionary";

const t = getDictionary("es");

// Spanish category name mapping
const categoryNameES: Record<string, string> = {
  "baby-gear": "Bebé y Niños",
  "mobility": "Movilidad",
  "remote-work": "Teletrabajo",
  "home-living": "Hogar y Confort",
  "travel-outdoors": "Playa y Aire Libre",
  "pregnancy": "Embarazo",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto No Encontrado" };

  const lowestPrice = product.pricing[product.pricing.length - 1].perDay;
  return {
    title: `Alquiler ${product.name} en Valencia — desde €${lowestPrice}/día`,
    description: product.description,
    alternates: {
      canonical: `https://rentanything.es/es/product/${slug}`,
      languages: {
        en: `https://rentanything.es/product/${slug}`,
        es: `https://rentanything.es/es/product/${slug}`,
      },
    },
  };
}

export default async function ProductPageES({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 3);

  const catNameES = categoryNameES[product.categorySlug] || product.category;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Inicio", url: "https://rentanything.es/es" },
              { name: "Valencia", url: "https://rentanything.es/es/valencia" },
              { name: catNameES, url: `https://rentanything.es/es/rental/${product.categorySlug}` },
              { name: product.name, url: `https://rentanything.es/es/product/${product.slug}` },
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
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <li><Link href="/es" className="hover:text-brand transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/es/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href={`/es/rental/${product.categorySlug}`} className="hover:text-brand transition-colors">{catNameES}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center aspect-square relative overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 33vw" priority />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-brand">{product.subcategory}</span>
                    <span className="text-xs text-neutral-400">{product.brand}</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-4">{product.name}</h1>
                  <p className="text-neutral-600 leading-relaxed mb-6">{product.description}</p>
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <h3 className="font-bold text-sm text-neutral-800 mb-3">{t.product.pricing}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.pricing.map((tier) => (
                        <div key={tier.days} className="bg-white rounded-lg border border-border p-2.5 text-center hover:border-brand/30 transition-colors">
                          <p className="text-xs text-neutral-500 mb-0.5">
                            {tier.days === 1 ? "1 día" : `${tier.days}+ ${t.product.days}`}
                          </p>
                          <p className="text-lg font-bold text-brand">€{tier.perDay}</p>
                          <p className="text-[10px] text-neutral-400">{t.product.perDay}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">{t.product.features}</h2>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="text-brand mt-0.5">✓</span>{feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">{t.product.specs}</h2>
                  <div className="bg-neutral-50 rounded-xl overflow-hidden">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div key={key} className={`flex justify-between px-5 py-3 text-sm ${i % 2 ? "bg-neutral-50" : "bg-white"}`}>
                        <span className="text-neutral-500">{key}</span>
                        <span className="font-medium text-neutral-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {product.faqs && product.faqs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">{t.product.faqTitle}</h2>
                  <div className="space-y-4">
                    {product.faqs.map((faq, i) => (
                      <details key={i} className="bg-neutral-50 rounded-xl p-5 group">
                        <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between">
                          {faq.question}
                          <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar: Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget product={product} locale="es" />
                <p className="text-xs text-neutral-400 text-center mt-3">{t.product.deliveryNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">{t.product.relatedProducts}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} basePath="/es/product" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
