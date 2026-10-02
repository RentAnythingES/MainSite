import BundleHub from "@/components/BundleHub";
import type { Metadata } from "next";
import { rentalBundles } from "@/data/bundles";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Valencia Rental Kits & Bundles",
  description:
    "Choose rental kits for your Valencia stay: baby arrival, family beach days, remote work, summer apartment comfort, and accessibility support.",
  alternates: {
    canonical: "https://rentandroll.com/valencia/kits",
    languages: {
      en: "https://rentandroll.com/valencia/kits",
      es: "https://rentandroll.com/es/valencia/kits",
      "x-default": "https://rentandroll.com/valencia/kits",
    },
  },
};

export default function ValenciaKitsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Valencia Rental Kits & Bundles",
            description: "Configurable rental-kit starting points for family, beach, accessibility, remote-work and apartment stays in Valencia.",
            url: "https://rentandroll.com/valencia/kits",
            locale: "en",
            items: rentalBundles.map((bundle) => ({
              name: bundle.name,
              url: `https://rentandroll.com/valencia/kits/${bundle.slug}`,
            })),
          })),
        }}
      />
      <BundleHub bundles={rentalBundles} locale="en" />
    </>
  );
}
