import { germanReleaseApproved } from "./german-release";
/** Code support is separate from public/market enablement and content approval. */
export const localeRegistry = {
  en: { name: "English", prefix: "", format: "en-GB", public: true },
  es: { name: "Español", prefix: "/es", format: "es-ES", public: true },
  de: { name: "Deutsch", prefix: "/de", format: "de-DE", public: germanReleaseApproved() && process.env.NEXT_PUBLIC_GERMAN_ENABLED === "true" },
} as const;

export type Locale = keyof typeof localeRegistry;
export type PublicLocale = {
  [L in Locale]: true extends (typeof localeRegistry)[L]["public"] ? L : never;
}[Locale];
export const defaultLocale: PublicLocale = "en";
export const publicLocales = (Object.keys(localeRegistry) as Locale[])
  .filter((locale): locale is PublicLocale => localeRegistry[locale].public);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(localeRegistry, value);
}

export function localeFromPathname(pathname: string): PublicLocale {
  return publicLocales.find(locale => {
    const prefix = localeRegistry[locale].prefix;
    return prefix !== "" && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  }) ?? defaultLocale;
}
