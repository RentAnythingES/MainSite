import { notFound } from "next/navigation";
import ProductFamilyLandingPage from "@/components/ProductFamilyLandingPage";
import { getProductFamily } from "@/data/product-families";
import { germanFamilies } from "@/content/german-families";
import { germanPreviewPrefix } from "@/i18n/site-context";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { readPrivateGermanDrafts, translatePrivateCatalogue } from "@/lib/private-german-catalogue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Produktgruppen-Vorschau", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ category: string; family: string }> }) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { category, family: slug } = await params;
  const family = getProductFamily(category, slug);
  if (!family || !Object.hasOwn(germanFamilies, slug)) notFound();
  const source = (await getProductsByCategoryFromDB(category)).filter(product => family.productSlugs.includes(product.slug));
  const products = translatePrivateCatalogue(source, await readPrivateGermanDrafts());
  return <ProductFamilyLandingPage family={family} content={germanFamilies[slug]} locale="de" prefix={germanPreviewPrefix} products={products} />;
}
