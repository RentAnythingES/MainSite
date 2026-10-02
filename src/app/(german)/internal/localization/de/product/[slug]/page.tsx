import Link from "next/link";
import { notFound } from "next/navigation";
import ProductPageBody from "@/components/ProductPageBody";
import ProductPlanningLinks from "@/components/ProductPlanningLinks";
import { getProductBySlugFromDB, getProductsByCategoryFromDB } from "@/lib/product-service";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { readPrivateGermanDrafts, translatePrivateCatalogue } from "@/lib/private-german-catalogue";
import { germanPreviewPrefix } from "@/i18n/site-context";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Produktvorschau", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { slug } = await params;
  const source = await getProductBySlugFromDB(slug);
  if (!source) notFound();
  const drafts = await readPrivateGermanDrafts();
  const [product] = translatePrivateCatalogue([source], drafts);
  const draft = drafts.find(entry => entry.slug === source.slug)!;
  const relatedSource = (await getProductsByCategoryFromDB(source.categorySlug))
    .filter(item => item.categorySlug === source.categorySlug && item.slug !== source.slug).slice(0,3);
  const related = translatePrivateCatalogue(relatedSource, drafts);
  return <>
    <nav className="container-site py-5" aria-label="Seitennavigation">
      <Link className="text-brand underline" href={`${germanPreviewPrefix}/rental/${product.categorySlug}`}>{product.category}</Link>
    </nav>
    <ProductPageBody product={product} locale="de" related={related} productBasePath={`${germanPreviewPrefix}/product`}>
      <ProductPlanningLinks categoryName={product.category} categorySlug={product.categorySlug} productSlug={product.slug} locale="de" />
    </ProductPageBody>
    <section className="container-site pb-10">
      <aside className="card p-5 mt-8"><h2 className="font-bold mb-3">Hinweise für die Prüfung</h2><ul className="list-disc pl-5">{draft.reviewNotes.map((note, index) => <li key={index}>{note}</li>)}</ul></aside>
    </section>
  </>;
}
