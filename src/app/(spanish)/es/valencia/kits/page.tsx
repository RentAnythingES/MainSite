import BundleHub from "@/components/BundleHub";
import type { Metadata } from "next";
import { spanishRentalBundles } from "@/data/bundles-es";
import { getHubCollectionJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Kits y paquetes de alquiler en Valencia",
  description: "Elige kits de alquiler para playa, bebés, teletrabajo, verano, estancias largas y apoyo de movilidad durante tu estancia en Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/es/valencia/kits",
    languages: {
      en: "https://rentandroll.com/valencia/kits",
      es: "https://rentandroll.com/es/valencia/kits",
      "x-default": "https://rentandroll.com/valencia/kits",
    },
  },
};

export default function SpanishValenciaKitsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHubCollectionJsonLd({
            name: "Kits y paquetes de alquiler en Valencia",
            description: "Puntos de partida configurables para familias, playa, accesibilidad, teletrabajo y estancias en apartamentos de Valencia.",
            url: "https://rentandroll.com/es/valencia/kits",
            locale: "es",
            items: spanishRentalBundles.map((bundle) => ({
              name: bundle.name,
              url: `https://rentandroll.com/es/valencia/kits/${bundle.slug}`,
            })),
          })),
        }}
      />
      <BundleHub bundles={spanishRentalBundles} locale="es" />
    </>
  );
}
