import SiteDocument, { siteMetadata } from "@/components/SiteDocument";
export const metadata = { ...siteMetadata, keywords: ["Mietausstattung Valencia", "Kinderwagen mieten Valencia", "Rollstuhl mieten Valencia", "Babyausstattung mieten Valencia", "Elektromobil mieten Valencia", "Homeoffice-Ausstattung Valencia"], openGraph: { ...siteMetadata.openGraph, locale: "de_DE", alternateLocale: ["en_US", "es_ES"] } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="de">{children}</SiteDocument>;
}
