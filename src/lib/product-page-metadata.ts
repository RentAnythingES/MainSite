import { germanIndexingAllowed } from '@/i18n/german-indexing';
import { localeRegistry } from "@/i18n/config";
import type { Metadata } from "next";
import type { Product } from "@/data/products";
import type { PublicLocale } from "@/i18n/config";
import type { ProductSeoState } from "./product-service";
import { publicLocaleHref } from "./public-routes";
import { getProductMetadataDescription, getProductMetadataTitle } from "./seo-metadata";
import { SITE_URL } from "@/config/site";

/** Preserve the established EN/ES canonical contract while sharing its implementation. */
export function productPageMetadata(
  slug: string, locale: PublicLocale, product: Product | null, state: ProductSeoState | null,
): Metadata {
  if (!product) return {
    title: locale === "de" ? "Artikel nicht gefunden" : locale === "es" ? "Producto No Encontrado" : "Product Not Found",
    robots: { index: false, follow: false },
  };
  const englishUrl = `${SITE_URL}/product/${slug}`;
  const spanishUrl = `${SITE_URL}${publicLocaleHref(`/product/${slug}`, "es")}`;
  const germanUrl = `${SITE_URL}/de/product/${slug}`;
  const indexable = locale === "de" ? state?.indexableDe === true && germanIndexingAllowed() : locale === "es" ? state?.indexableEs === true : state?.indexableEn === true;
  const canonical = locale === "de" ? germanUrl : locale === "es" && indexable ? spanishUrl : englishUrl;
  const languages = state?.indexableEs
    ? { en: englishUrl, es: spanishUrl, "x-default": englishUrl }
    : { en: englishUrl, "x-default": englishUrl };
  if (state?.indexableDe && localeRegistry.de.public) Object.assign(languages, { de: germanUrl });
  const title = getProductMetadataTitle({ name: product.name, customTitle: product.seoTitle,
    lowestPrice: product.pricing.at(-1)?.perDay, locale });
  const description = getProductMetadataDescription({ description: product.description,
    customDescription: product.seoDescription, locale });
  return {
    title: locale === "de" ? { absolute: title } : title, description,
    alternates: locale === "es" && !indexable ? { canonical } : { canonical, languages },
    robots: { index: indexable, follow: true },
    openGraph: { title, description, url: canonical,
      ...(locale === "de" ? { locale: "de_DE" } : locale === "es" ? { locale: "es_ES" } : {}),
      images: product.image ? [{ url: product.image, alt: product.imageAlt || product.name }] : undefined },
  };
}
