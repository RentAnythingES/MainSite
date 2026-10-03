import { privateGermanPreviewEnabled } from "./localization-preview";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Market } from "@/lib/types";
import { isLocaleTag, isMarketId, isMarketSlug } from "./route-context";
import { isLocale, localeRegistry } from "@/i18n/config";

export interface MarketContext {
  id: string;
  slug: string;
  name: string;
  countryCode: string;
  timezone: string;
  currency: string;
  defaultLocale: string;
  supportedLocales: string[];
  locale: string;
  isActive: boolean;
  isBookingEnabled: boolean;
  isPublic: boolean;
  isIndexable: boolean;
  foundationAvailable: true;
}

export class MarketContextError extends Error {
  constructor(public code: string, public status: number, message: string) {
    super(message);
    this.name = "MarketContextError";
  }
}

type MarketRequest =
  | { mode: "public"; marketSlug?: string; locale?: string; requireBooking?: boolean }
  // Internal callers must authorize the actor or transaction before resolving IDs.
  | { mode: "operator" | "historical"; marketId: string; locale?: string };

const SELECT = "id, slug, name, country_code, timezone, currency, default_locale, supported_locales, is_active, is_booking_enabled, is_public, is_indexable";

/** Resolve explicit context. This is not an operator authorization check. */
export async function resolveMarketContext(
  supabase: SupabaseClient<Database>, request: MarketRequest,
): Promise<MarketContext> {
  if (request.locale !== undefined && !isLocaleTag(request.locale)) {
    throw new MarketContextError("invalid_locale", 400, "Invalid language");
  }
  let query = supabase.from("markets").select(SELECT);
  if (request.mode === "public") {
    const slug = request.marketSlug === undefined ? "valencia" : request.marketSlug;
    if (!isMarketSlug(slug)) throw new MarketContextError("invalid_market", 400, "Invalid city");
    query = query.eq("slug", slug);
  } else {
    if (!isMarketId(request.marketId)) throw new MarketContextError("invalid_market", 400, "Invalid city ID");
    query = query.eq("id", request.marketId);
  }
  const { data, error } = await query.limit(2).abortSignal(AbortSignal.timeout(8000));
  if (error) throw new MarketContextError("market_unavailable", 503, "City configuration is unavailable");
  if (!data || data.length === 0) throw new MarketContextError("market_not_found", 404, "City not available");
  if (data.length !== 1) throw new MarketContextError("market_configuration", 503, "City configuration is invalid");
  const market = data[0] as unknown as Market;
  if (!isMarketId(market.id) || !market.supported_locales?.includes(market.default_locale)) {
    throw new MarketContextError("market_configuration", 503, "City configuration is invalid");
  }
  if (request.mode === "public" && (!market.is_active || !market.is_public)) {
    throw new MarketContextError("market_not_found", 404, "City not available");
  }
  if (request.mode === "public" && request.requireBooking && !market.is_booking_enabled) {
    throw new MarketContextError("booking_disabled", 409, "Bookings are unavailable for this city");
  }
  const locale = request.locale ?? market.default_locale;
  // Historical records retain their language after it is removed from new sales.
  if (request.mode !== "historical" && !market.supported_locales.includes(locale)) {
    throw new MarketContextError("unsupported_locale", 400, "Language is unavailable for this city");
  }
  const privatePreview = locale === "de" && privateGermanPreviewEnabled();
  let languageBookingEnabled = true;
  let languageIndexable = true;
  if (request.mode === "public") {
    if (!isLocale(locale) || (!localeRegistry[locale].public && !privatePreview)) {
      throw new MarketContextError("unsupported_locale", 400, "Language is unavailable for this city");
    }
    const { data: languages, error: languageError } = await supabase.from("market_locales")
      .select("market_id,locale,is_public,is_booking_enabled,is_indexable,language:locales!inner(code,is_public)")
      .eq("market_id", market.id).eq("locale", locale)
      .limit(2).abortSignal(AbortSignal.timeout(8000));
    if (languageError) throw new MarketContextError("locale_unavailable", 503, "Language configuration is unavailable");
    const entry = languages?.[0] as unknown as {
      market_id: string; locale: string; is_public: boolean; is_booking_enabled: boolean; is_indexable: boolean;
      language: { code: string; is_public: boolean };
    } | undefined;
    if (!entry || languages?.length !== 1 || entry.market_id !== market.id || entry.locale !== locale ||
      entry.language?.code !== locale || entry.is_public !== true || (!privatePreview && entry.language.is_public !== true)) {
      throw new MarketContextError("unsupported_locale", 400, "Language is unavailable for this city");
    }
    languageBookingEnabled = entry.is_booking_enabled === true;
    languageIndexable = entry.is_indexable === true;
    if (request.requireBooking && !languageBookingEnabled) {
      throw new MarketContextError("booking_disabled", 409, "Bookings are unavailable in this language");
    }
  }
  return {
    id: market.id, slug: market.slug, name: market.name, countryCode: market.country_code,
    timezone: market.timezone, currency: market.currency, defaultLocale: market.default_locale,
    supportedLocales: market.supported_locales, locale, isActive: market.is_active,
    isBookingEnabled: market.is_booking_enabled && languageBookingEnabled, isPublic: market.is_public,
    isIndexable: market.is_indexable && languageIndexable, foundationAvailable: true,
  };
}

/** Compatibility boundary for existing Valencia availability/draft callers. */
export function resolveDefaultMarketContext(supabase: SupabaseClient<Database>) {
  return resolveMarketContext(supabase, { mode: "public", requireBooking: true });
}
