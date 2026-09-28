/** Code support is separate from public/market enablement and content approval. */
export const localeRegistry = {
  en: { name: "English", prefix: "", format: "en-GB", public: true },
  es: { name: "Español", prefix: "/es", format: "es-ES", public: true },
  de: { name: "Deutsch", prefix: "/de", format: "de-DE", public: false },
} as const;

export type Locale = keyof typeof localeRegistry;
export type PublicLocale = {
  [L in Locale]: (typeof localeRegistry)[L]["public"] extends true ? L : never;
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
