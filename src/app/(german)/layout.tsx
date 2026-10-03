import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/config/site";
import SiteDocument, { siteMetadata } from "@/components/SiteDocument";
const title = "Ausstattung in Valencia mieten | Rent&Roll";
const description = "Miete Kinderwagen, Babybetten, Rollstühle, Elektromobile, Arbeitsausstattung und mehr in Valencia. Prüfe die Verfügbarkeit für deine Mietdaten.";
export const metadata: Metadata = {
  ...siteMetadata,
  title: { default: title, template: "%s" },
  description,
  keywords: ["Mietausstattung Valencia", "Kinderwagen mieten Valencia", "Rollstuhl mieten Valencia", "Babyausstattung mieten Valencia", "Elektromobil mieten Valencia", "Homeoffice-Ausstattung Valencia"],
  openGraph: {
    ...siteMetadata.openGraph,
    title,
    description: "Miete Kinderwagen, Babybetten, Rollstühle, Elektromobile, Arbeitsausstattung und mehr. Lieferung in deine Unterkunft in Valencia.",
    locale: "de_DE",
    alternateLocale: ["en_US", "es_ES"],
    images: [{ url: SITE_IDENTITY.socialImagePath, width: 1200, height: 630, alt: "Rent&Roll Mietausstattung in Valencia" }],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="de">{children}</SiteDocument>;
}
