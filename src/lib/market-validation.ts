import { isMarketSlug } from "./route-context";

// Expand when shared rendering and currency calculations support these capabilities.
export const MARKET_SETUP_LOCALES = ["en", "es"] as const;
export interface MarketSetup {
  slug: string; name: string; country_code: string; timezone: string;
  currency: string; default_locale: string; supported_locales: string[];
}
export class MarketValidationError extends Error {}

export function validateMarketSetup(body: unknown): MarketSetup {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new MarketValidationError("Enter city details");
  const value = body as Record<string, unknown>;
  const allowed = ["slug", "name", "country_code", "timezone", "currency", "default_locale", "supported_locales"];
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new MarketValidationError("Unsupported city setting");
  if (!isMarketSlug(value.slug)) throw new MarketValidationError("Use a lowercase city slug that does not conflict with a page or language");
  if (typeof value.name !== "string" || value.name.trim().length < 2 || value.name.trim().length > 100) throw new MarketValidationError("City name must contain 2–100 characters");
  if (typeof value.country_code !== "string" || !/^[A-Z]{2}$/.test(value.country_code)) throw new MarketValidationError("Use a two-letter uppercase country code");
  if (typeof value.timezone !== "string" || value.timezone.length > 80 || !/^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(value.timezone)) throw new MarketValidationError("Use an IANA timezone such as Europe/Berlin");
  try { new Intl.DateTimeFormat("en", { timeZone: value.timezone }); } catch { throw new MarketValidationError("Unknown timezone"); }
  if (value.currency !== "eur") throw new MarketValidationError("Only EUR is currently supported");
  if (!Array.isArray(value.supported_locales) || value.supported_locales.length < 1 ||
    value.supported_locales.length > MARKET_SETUP_LOCALES.length ||
    value.supported_locales.some(locale => !MARKET_SETUP_LOCALES.includes(locale)) ||
    new Set(value.supported_locales).size !== value.supported_locales.length) throw new MarketValidationError("Choose supported languages without duplicates");
  if (typeof value.default_locale !== "string" || !value.supported_locales.includes(value.default_locale)) throw new MarketValidationError("Default language must be among the selected languages");
  return { slug: value.slug, name: value.name.trim(), country_code: value.country_code,
    timezone: value.timezone, currency: value.currency, default_locale: value.default_locale,
    supported_locales: value.supported_locales };
}
