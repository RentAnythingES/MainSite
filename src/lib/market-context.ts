import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Market } from "@/lib/types";

export interface MarketContext {
  id: string | null;
  slug: string;
  name: string;
  countryCode: string;
  timezone: string;
  currency: string;
  defaultLocale: string;
  supportedLocales: string[];
  isActive: boolean;
  isBookingEnabled: boolean;
  isPublic: boolean;
  isIndexable: boolean;
  foundationAvailable: boolean;
}

const LEGACY_VALENCIA_CONTEXT: MarketContext = {
  id: null,
  slug: "valencia",
  name: "Valencia",
  countryCode: "ES",
  timezone: "Europe/Madrid",
  currency: "eur",
  defaultLocale: "en",
  supportedLocales: ["en", "es"],
  isActive: true,
  isBookingEnabled: true,
  isPublic: true,
  isIndexable: true,
  foundationAvailable: false,
};

function isMissingMarketFoundationError(error: { code?: string } | null): boolean {
  return error?.code === "42P01" || error?.code === "PGRST204" || error?.code === "PGRST205";
}

/**
 * Resolves the operational default without changing any public route contract.
 * The legacy fallback allows application code to deploy before the foundation
 * migration; once the table exists, an invalid/default-less setup fails closed.
 */
export async function resolveDefaultMarketContext(
  supabase: SupabaseClient<Database>,
): Promise<MarketContext> {
  const { data, error } = await supabase
    .from("markets")
    .select("id, slug, name, country_code, timezone, currency, default_locale, supported_locales, is_active, is_booking_enabled, is_public, is_indexable")
    .eq("is_default", true)
    .limit(2);

  if (error) {
    if (isMissingMarketFoundationError(error)) return LEGACY_VALENCIA_CONTEXT;
    throw error;
  }

  if (!data || data.length !== 1) {
    throw new Error(`Expected exactly one default market, found ${data?.length || 0}`);
  }

  const market = data[0] as unknown as Pick<
    Market,
    | "id"
    | "slug"
    | "name"
    | "country_code"
    | "timezone"
    | "currency"
    | "default_locale"
    | "supported_locales"
    | "is_active"
    | "is_booking_enabled"
    | "is_public"
    | "is_indexable"
  >;
  return {
    id: market.id,
    slug: market.slug,
    name: market.name,
    countryCode: market.country_code,
    timezone: market.timezone,
    currency: market.currency,
    defaultLocale: market.default_locale,
    supportedLocales: market.supported_locales,
    isActive: market.is_active,
    isBookingEnabled: market.is_booking_enabled,
    isPublic: market.is_public,
    isIndexable: market.is_indexable,
    foundationAvailable: true,
  };
}
