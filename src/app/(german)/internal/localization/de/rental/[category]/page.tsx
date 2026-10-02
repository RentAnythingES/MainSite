import { notFound } from "next/navigation";
import CategoryLandingPage from "@/components/CategoryLandingPage";
import { germanCategories } from "@/content/german-categories";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { readPrivateGermanDrafts, translatePrivateCatalogue } from "@/lib/private-german-catalogue";
import { germanPreviewPrefix } from "@/i18n/site-context";
import { productFamilies } from "@/data/product-families";
import { germanFamilies } from "@/content/german-families";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Kategorievorschau", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { category } = await params;
  if (!Object.hasOwn(germanCategories, category)) notFound();
  const source = await getProductsByCategoryFromDB(category);
  const products = translatePrivateCatalogue(source, await readPrivateGermanDrafts());
  const meta = {
    ...germanCategories[category],
    familyHeading: "Modelle und Möglichkeiten vergleichen",
    familyDescription: "Diese Übersichten helfen dir bei der Auswahl für deinen Aufenthalt.",
    familyPathways: productFamilies.filter(family => family.published && family.categorySlug === category).map(family => {
      const content = germanFamilies[family.slug];
      if (!content) throw new Error(`Missing German family: ${family.slug}`);
      return { eyebrow: content.categoryLabel, title: content.eyebrow, description: content.productDescription, href: `${germanPreviewPrefix}/rental/${category}/${family.slug}` };
    }),
  };
  return <CategoryLandingPage meta={meta} products={products} locale="de" prefix={germanPreviewPrefix} />;
}
