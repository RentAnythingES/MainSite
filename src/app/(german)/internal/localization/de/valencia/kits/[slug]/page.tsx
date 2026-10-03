import { notFound } from "next/navigation";
import BundleLandingPage from "@/components/BundleLandingPage";
import BundleConfigurator from "@/components/BundleConfigurator";
import ExplorerDetails from "@/components/ExplorerDetails";
import MobilityFamilyLinks from "@/components/MobilityFamilyLinks";
import { germanRentalBundles, getGermanBundleBySlug, germanKitReviewNotes } from "@/data/bundles-de";
import { germanPreviewPrefix } from "@/i18n/site-context";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { getProductsFromDB } from "@/lib/product-service";
import { readPrivateGermanDrafts, translatePrivateCatalogue } from "@/lib/private-german-catalogue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mietpaket – private Vorschau", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  if (!privateGermanPreviewEnabled()) notFound();
  const bundle = getGermanBundleBySlug((await params).slug);
  if (!bundle) notFound();
  const source = (await getProductsFromDB("valencia", "en")).filter(product => bundle.relatedProductSlugs.includes(product.slug));
  const relatedProducts = translatePrivateCatalogue(source, await readPrivateGermanDrafts());
  return <><aside className="container-site pt-6"><details className="card p-4"><summary>Hinweise für deine Prüfung</summary><ul className="list-disc pl-5 mt-3">{germanKitReviewNotes[bundle.slug].map(note => <li key={note}>{note}</li>)}</ul></details></aside><BundleLandingPage bundle={bundle} locale="de" prefix={germanPreviewPrefix}
    relatedProducts={relatedProducts} relatedGuides={[]}
    otherBundles={germanRentalBundles.filter(item => item.slug !== bundle.slug).slice(0, 3)}
    explorerDetails={bundle.slug === "turia-beach-explorer" ? <ExplorerDetails locale="de" /> : undefined}
    configurator={<BundleConfigurator bundle={bundle} locale="de" prefix={germanPreviewPrefix} privatePreview />}
    familyLinks={bundle.slug === "accessible-valencia-kit" ? <MobilityFamilyLinks locale="de" /> : undefined}
  /></>;
}
