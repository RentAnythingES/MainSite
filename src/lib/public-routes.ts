import { localeFromPathname, localeRegistry, type PublicLocale } from "@/i18n/config";

const translatedRoutes: ReadonlyArray<Record<PublicLocale, string>> = [
  { en: "/valencia/host-services", es: "/es/valencia/servicios-anfitriones" },
  { en: "/partners", es: "/es/colaboraciones" },
];
// Preserve the existing navigation contract until route readiness is data-driven.
const spanishPages = new Set([
  "/", "/valencia", "/blog", "/faq", "/how-it-works", "/refunds", "/about",
  "/contact", "/privacy", "/terms", "/cookies",
  "/blog/best-beaches-valencia-families", "/blog/valencia-summer-survival-guide",
  "/blog/valencia-with-kids-complete-guide", "/blog/wheelchair-accessibility-valencia",
  "/blog/digital-nomad-guide-valencia", "/blog/best-day-trips-from-valencia",
]);

export function publicLocaleHref(pathname: string, target: PublicLocale): string {
  if (!localeRegistry[target]?.public) throw new Error("Language is not public");
  if (!pathname.startsWith("/") || pathname.startsWith("//") || /[?#\\]/.test(pathname)) {
    throw new Error("Expected a local pathname");
  }
  const source = localeFromPathname(pathname);
  if (source === target) return pathname;
  const translated = translatedRoutes.find(routes => routes[source] === pathname);
  if (translated) return translated[target];
  const sourcePrefix = localeRegistry[source].prefix;
  const base = sourcePrefix ? pathname.slice(sourcePrefix.length) || "/" : pathname;
  const prefix = localeRegistry[target].prefix;
  if (target === "en") return base;
  const available = spanishPages.has(base) || base.startsWith("/product/") ||
    base.startsWith("/rental/") || base === "/valencia/kits" || base.startsWith("/valencia/kits/");
  return available ? `${prefix}${base === "/" ? "" : base}` : prefix;
}
