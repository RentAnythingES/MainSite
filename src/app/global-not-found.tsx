import { headers } from "next/headers";
import type { Metadata } from "next";
import SiteDocument from "@/components/SiteDocument";
import NotFoundPageBody from "@/components/NotFoundPageBody";
import { siteContext } from "@/i18n/site-context";

async function requestLocale() {
  return siteContext((await headers()).get("x-pathname") || "/").locale;
}
export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {title: locale === "de" ? "Seite nicht gefunden | Rent&Roll" : locale === "es" ? "Página no encontrada | Rent&Roll" : "Page not found | Rent&Roll", robots:{index:false,follow:false},referrer:"no-referrer"};
}
/** Multiple root layouts require a full document for routing-level 404s. */
export default async function GlobalNotFound() {
  const locale = await requestLocale();
  return <SiteDocument locale={locale}><NotFoundPageBody locale={locale} /></SiteDocument>;
}
