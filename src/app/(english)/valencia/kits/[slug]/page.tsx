import BundleLandingPage from "@/components/BundleLandingPage";
import { getProductsFromDB } from "@/lib/product-service";
import ExplorerDetails from "@/components/ExplorerDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BundleConfigurator from "@/components/BundleConfigurator";
import MobilityFamilyLinks from "@/components/MobilityFamilyLinks";
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
      canonical: `https://rentandroll.com/valencia/kits/${bundle.slug}`,
      languages: {
        en: `https://rentandroll.com/valencia/kits/${bundle.slug}`,
        es: `https://rentandroll.com/es/valencia/kits/${bundle.slug}`,
        "x-default": `https://rentandroll.com/valencia/kits/${bundle.slug}`,
      },
    },
    openGraph: {
      title: bundle.seo.title,
      description: bundle.seo.description,
      images: [bundle.image],
    },
  };
}

export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();
  const isExplorer = bundle.slug === "turia-beach-explorer";

  const explorerProducts = isExplorer ? await getProductsFromDB("valencia", "en") : [];
  const relatedProducts = isExplorer
    ? explorerProducts.filter((product) => bundle.relatedProductSlugs.includes(product.slug))
    : getBundleProducts(bundle);
  const relatedGuides = bundle.relatedGuideSlugs
    .map((guideSlug) => getBlogPostBySlug(guideSlug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const otherBundles = rentalBundles.filter((item) => item.slug !== bundle.slug).slice(0, 3);
  const bundleUrl = `https://rentandroll.com/valencia/kits/${bundle.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description: bundle.seo.description,
    image: `https://rentandroll.com${bundle.image}`,
    url: bundleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": bundleUrl },
    brand: {
      "@type": "Brand",
      name: "Rent&Roll",
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
              { name: "Home", url: "https://rentandroll.com" },
              { name: "Valencia", url: "https://rentandroll.com/valencia" },
              { name: "Kits", url: "https://rentandroll.com/valencia/kits" },
              { name: bundle.shortName, url: `https://rentandroll.com/valencia/kits/${bundle.slug}` },
            ]),
          ),
        }}
      />

      <BundleLandingPage bundle={bundle} locale="en" relatedProducts={relatedProducts} relatedGuides={relatedGuides} otherBundles={otherBundles}
        explorerDetails={isExplorer ? <ExplorerDetails locale="en" /> : undefined}
        configurator={<BundleConfigurator bundle={bundle} locale="en" />}
        familyLinks={bundle.slug === "accessible-valencia-kit" ? <MobilityFamilyLinks locale="en" /> : undefined}
      />
    </>
  );
}
