import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BundleCard from "@/components/BundleCard";
import BundleConfigurator from "@/components/BundleConfigurator";
import ProductCard from "@/components/ProductCard";
import { getBlogPostBySlug } from "@/content/blog";
import { getBundleBySlug, getBundleProducts, rentalBundles } from "@/data/bundles";
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return rentalBundles.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) return { title: "Kit Not Found" };

  return {
    title: bundle.seo.title,
    description: bundle.seo.description,
    keywords: bundle.seo.keywords,
    alternates: {
      canonical: `https://rentanything.es/valencia/kits/${bundle.slug}`,
      languages: {
        en: `https://rentanything.es/valencia/kits/${bundle.slug}`,
        es: `https://rentanything.es/es/valencia/kits/${bundle.slug}`,
        "x-default": `https://rentanything.es/valencia/kits/${bundle.slug}`,
      },
    },
    openGraph: {
      title: bundle.seo.title,
      description: bundle.seo.description,
      images: [bundle.image],
    },
  };
}

const accentClasses = {
  teal: "bg-brand/10 text-brand border-brand/20",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();

  const relatedProducts = getBundleProducts(bundle);
  const relatedGuides = bundle.relatedGuideSlugs
    .map((guideSlug) => getBlogPostBySlug(guideSlug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const otherBundles = rentalBundles.filter((item) => item.slug !== bundle.slug).slice(0, 3);
  const bundleUrl = `https://rentanything.es/valencia/kits/${bundle.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description: bundle.seo.description,
    image: `https://rentanything.es${bundle.image}`,
    url: bundleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": bundleUrl },
    brand: {
      "@type": "Brand",
      name: "RentAnything.es",
    },
    areaServed: {
      "@type": "City",
      name: "Valencia",
    },
    category: bundle.eyebrow,
    seller: { "@id": BUSINESS_SCHEMA_ID },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: bundle.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentanything.es" },
              { name: "Valencia", url: "https://rentanything.es/valencia" },
              { name: "Kits", url: "https://rentanything.es/valencia/kits" },
              { name: bundle.shortName, url: `https://rentanything.es/valencia/kits/${bundle.slug}` },
            ]),
          ),
        }}
      />

      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href="/valencia/kits" className="hover:text-brand transition-colors">Kits</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{bundle.shortName}</li>
          </ol>
        </div>
      </nav>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${accentClasses[bundle.accent]}`}>
                {bundle.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                {bundle.name}
              </h1>
              <p className="mt-4 text-xl text-neutral-700 font-semibold">
                {bundle.tagline}
              </p>
              <p className="mt-4 text-neutral-600 leading-relaxed max-w-xl">
                {bundle.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#configure-kit" className="btn btn-primary btn-lg">
                  Configure this kit
                </a>
                <Link href="/valencia/kits" className="btn btn-outline btn-lg">
                  Compare kits
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 shadow-lg">
              <Image
                src={bundle.image}
                alt={bundle.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-bold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  A starting point we can tailor around your stay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6 md:p-8 bg-white">
              <h2 className="text-2xl font-bold mb-6">What this kit can include</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {bundle.includedItems.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-border bg-neutral-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-5 w-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {item.quantity ? `${item.quantity} ${item.name}` : item.name}
                        </p>
                        {item.note && <p className="mt-1 text-sm text-neutral-500">{item.note}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card p-6 bg-white">
              <h2 className="text-xl font-bold mb-4">Best for</h2>
              <ul className="space-y-3">
                {bundle.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-neutral-600">
                    <span className="text-brand">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <BundleConfigurator bundle={bundle} />

      {relatedProducts.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-3xl font-bold mb-6">Related individual items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} id={`bundle-product-${product.slug}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-3xl font-bold mb-6">Related Valencia guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <Link key={guide.slug} href={`/blog/${guide.slug}`} className="card p-6 bg-white hover:shadow-md transition-shadow group">
                  <span className="badge badge-brand capitalize mb-3">{guide.category}</span>
                  <h3 className="font-bold text-lg group-hover:text-brand transition-colors">{guide.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{guide.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-brand">Read guide →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-6">Questions about this kit</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {bundle.faqs.map((faq) => (
              <div key={faq.question} className="card p-6 bg-white">
                <h3 className="font-bold text-neutral-800">{faq.question}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="badge badge-brand mb-3">More kits</span>
              <h2 className="text-3xl font-bold">Other ways to start</h2>
            </div>
            <Link href="/valencia/kits" className="hidden sm:inline-block text-sm font-bold text-brand">
              View all kits →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherBundles.map((item) => (
              <BundleCard key={item.slug} bundle={item} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
