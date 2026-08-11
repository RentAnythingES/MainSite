import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductFamilyLandingPage from "@/components/ProductFamilyLandingPage";
import { getProductFamily, productFamilies } from "@/data/product-families";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ category: string; family: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return productFamilies
    .filter((family) => family.published)
    .map((family) => ({ category: family.categorySlug, family: family.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, family: familySlug } = await params;
  const family = getProductFamily(category, familySlug);
  if (!family) return { title: "Colección de alquiler no encontrada" };

  const content = family.content.es;
  const canonical = `https://rentandroll.com/es/rental/${category}/${familySlug}`;
  return {
    title: content.title,
    description: content.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        en: `https://rentandroll.com/rental/${category}/${familySlug}`,
        es: canonical,
        "x-default": `https://rentandroll.com/rental/${category}/${familySlug}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      locale: "es_ES",
      images: [{ url: `/categories/${category}.webp`, alt: content.eyebrow }],
    },
  };
}

export default async function SpanishProductFamilyPage({ params }: Props) {
  const { category, family: familySlug } = await params;
  const family = getProductFamily(category, familySlug);
  if (!family) notFound();

  const categoryProducts = await getProductsByCategoryFromDB(category, "es");
  const products = categoryProducts.filter((product) => family.productSlugs.includes(product.slug));
  const content = family.content.es;
  const canonical = `https://rentandroll.com/es/rental/${category}/${familySlug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getCategoryCollectionJsonLd({
            name: content.eyebrow,
            description: content.description,
            url: canonical,
            locale: "es",
            products,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbJsonLd([
            { name: "Inicio", url: "https://rentandroll.com/es" },
            { name: "Valencia", url: "https://rentandroll.com/es/valencia" },
            { name: content.categoryLabel, url: `https://rentandroll.com/es/rental/${category}` },
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
      <ProductFamilyLandingPage family={family} locale="es" products={products} />
    </>
  );
}
