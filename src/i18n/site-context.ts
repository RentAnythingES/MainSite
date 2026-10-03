import { localeFromPathname, localeRegistry, type Locale } from "./config";

export const germanPreviewPrefix = "/internal/localization/de";
/** Display context only. Server layout/API guards control private access. */
export function siteContext(pathname: string): { locale: Locale; prefix: string; privatePreview: boolean } {
  if (pathname === germanPreviewPrefix || pathname.startsWith(`${germanPreviewPrefix}/`)) {
    return { locale: "de", prefix: germanPreviewPrefix, privatePreview: true };
  }
  const locale = pathname === "/de" || pathname.startsWith("/de/") ? "de" : localeFromPathname(pathname);
  return { locale, prefix: localeRegistry[locale].prefix, privatePreview: false };
}
