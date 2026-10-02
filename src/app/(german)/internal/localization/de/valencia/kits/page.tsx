import { notFound } from "next/navigation";
import BundleHub from "@/components/BundleHub";
import { germanRentalBundles } from "@/data/bundles-de";
import { germanPreviewPrefix } from "@/i18n/site-context";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mietpakete in Valencia – private Vorschau", robots: { index: false, follow: false } };
export default function Page() {
  if (!privateGermanPreviewEnabled()) notFound();
  return <BundleHub bundles={germanRentalBundles} locale="de" prefix={germanPreviewPrefix} />;
}
