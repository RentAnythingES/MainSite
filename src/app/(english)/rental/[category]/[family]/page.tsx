import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductFamilyLandingPage from "@/components/ProductFamilyLandingPage";
import { getProductFamily, productFamilies } from "@/data/product-families";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ category: string; family: string }>;
};

export function generateStaticParams() {
  return productFamilies
    .filter((family) => family.published)
    .map((family) => ({ category: family.categorySlug, family: family.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, family: familySlug } = await params;
  const family = getProductFamily(category, familySlug);
  if (!family) return { title: "Rental collection not found" };

  const content = family.content.en;
  const canonical = `https://rentandroll.com/rental/${category}/${familySlug}`;
  return {
    title: content.title,
    description: content.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        en: canonical,
        es: `https://rentandroll.com/es/rental/${category}/${familySlug}`,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      images: [{ url: `/categories/${category}.webp`, alt: content.eyebrow }],
    },
  };
}

export default async function ProductFamilyPage({ params }: Props) {
  const { category, family: familySlug } = await params;
  const family = getProductFamily(category, familySlug);
  if (!family) notFound();

  const categoryProducts = await getProductsByCategoryFromDB(category, "en");
  const products = categoryProducts.filter((product) => family.productSlugs.includes(product.slug));
  const content = family.content.en;
  const canonical = `https://rentandroll.com/rental/${category}/${familySlug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getCategoryCollectionJsonLd({
            name: content.eyebrow,
            description: content.description,
            url: canonical,
            locale: "en",
            products,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbJsonLd([
            { name: "Home", url: "https://rentandroll.com" },
            { name: "Valencia", url: "https://rentandroll.com/valencia" },
            { name: content.categoryLabel, url: `https://rentandroll.com/rental/${category}` },
            { name: content.eyebrow, url: canonical },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd(content.faqs.map((faq) => ({ q: faq.question, a: faq.answer })))),
        }}
      />
      <ProductFamilyLandingPage family={family} locale="en" products={products} />
    </>
  );
}
