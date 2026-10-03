import BundleLandingPage from "@/components/BundleLandingPage";
import { getProductsFromDB } from "@/lib/product-service";
import ExplorerDetails from "@/components/ExplorerDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BundleConfigurator from "@/components/BundleConfigurator";
import MobilityFamilyLinks from "@/components/MobilityFamilyLinks";
import { getSpanishBlogPostBySlug } from "@/content/blog-es";
import { getSpanishBundleBySlug, spanishRentalBundles } from "@/data/bundles-es";
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return spanishRentalBundles.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getSpanishBundleBySlug(slug);
  if (!bundle) return { title: "Kit no encontrado" };
  const englishUrl = `https://rentandroll.com/valencia/kits/${bundle.slug}`;
  const spanishUrl = `https://rentandroll.com/es/valencia/kits/${bundle.slug}`;
  return {
    title: bundle.seo.title,
    description: bundle.seo.description,
    keywords: bundle.seo.keywords,
    alternates: {
      canonical: spanishUrl,
      languages: { en: englishUrl, es: spanishUrl, "x-default": englishUrl },
    },
    openGraph: {
      title: bundle.seo.title,
      description: bundle.seo.description,
      locale: "es_ES",
      images: [bundle.image],
    },
  };
}

export default async function SpanishBundlePage({ params }: Props) {
  const { slug } = await params;
  const bundle = getSpanishBundleBySlug(slug);
  if (!bundle) notFound();

  const isExplorer = bundle.slug === "turia-beach-explorer";
  const products = await getProductsFromDB("valencia", "es");
  const relatedProducts = bundle.relatedProductSlugs
    .map((productSlug) => products.find((product) => product.slug === productSlug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const relatedGuides = bundle.relatedGuideSlugs
    .map((guideSlug) => getSpanishBlogPostBySlug(guideSlug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const otherBundles = spanishRentalBundles.filter((item) => item.slug !== bundle.slug).slice(0, 3);
  const bundleUrl = `https://rentandroll.com/es/valencia/kits/${bundle.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description: bundle.seo.description,
    image: `https://rentandroll.com${bundle.image}`,
    url: bundleUrl,
    inLanguage: "es",
    mainEntityOfPage: { "@type": "WebPage", "@id": bundleUrl },
    brand: { "@type": "Brand", name: "Rent&Roll" },
    areaServed: { "@type": "City", name: "Valencia" },
    category: bundle.eyebrow,
    seller: { "@id": BUSINESS_SCHEMA_ID },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: bundle.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbJsonLd([
            { name: "Inicio", url: "https://rentandroll.com/es" },
            { name: "Valencia", url: "https://rentandroll.com/es/valencia" },
            { name: "Kits", url: "https://rentandroll.com/es/valencia/kits" },
            { name: bundle.shortName, url: bundleUrl },
          ])),
        }}
      />

      <BundleLandingPage bundle={bundle} locale="es" relatedProducts={relatedProducts} relatedGuides={relatedGuides} otherBundles={otherBundles}
        explorerDetails={isExplorer ? <ExplorerDetails locale="es" /> : undefined}
        configurator={<BundleConfigurator bundle={bundle} locale="es" />}
        familyLinks={bundle.slug === "accessible-valencia-kit" ? <MobilityFamilyLinks locale="es" /> : undefined}
      />
    </>
  );
}
