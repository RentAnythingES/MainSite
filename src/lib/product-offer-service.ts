import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { isMarketId, isLocaleTag } from "./route-context";
import { canonicalProductSlug, productSlugLookupCandidates } from "./product-slug-aliases";

export interface OfferTier { min_days: number; per_day_cents: number }
export interface OfferDiscount { min_quantity: number; discount_bps: number }
export interface ProductOfferProjection {
  id: string;
  marketId: string;
  productId: string;
  marketSlug: string;
  currency: string;
  timezone: string;
  stockTotal: number;
  onlineCapacity: number;
  tiers: OfferTier[];
  product: Record<string, unknown>;
}
export class ProductOfferError extends Error {}

const PRODUCT_FACTS = "id,slug,name,brand,description,emoji,image_url,category_id,subcategory,subcategory_slug,features,specs,content_status,translation_source_revision,category:categories!products_category_id_fkey(slug,name)";
const CARD_COPY = "product_localizations(locale,short_description,seo_title,seo_description,publication_status,source_revision,translation_revision,reviewed_revision,reviewed_by,translated_name:translation_content->>name,translated_image_alt:translation_content->>image_alt_text),product_images(image_url,alt_text,rights_status,is_primary,sort_order)";
const DETAIL_COPY = "product_localizations(*),product_faqs(locale,question,answer,sort_order,publication_status),product_images(image_url,alt_text,rights_status,is_primary,sort_order)";
const OFFER_FIELDS = "id,market_id,product_id,stock_total,online_capacity,offer_pricing_tiers(min_days,per_day_cents),market:markets!inner(slug,currency,timezone,supported_locales)";

function assertContext(marketId: string, locale: string) {
  if (!isMarketId(marketId) || !isLocaleTag(locale)) throw new ProductOfferError("An explicit city and language are required");
}

function project(row: Record<string, unknown>, marketId: string, locale: string): ProductOfferProjection {
  const market = row.market as { slug: string; currency: string; timezone: string; supported_locales: string[] } | null;
  const product = row.product as Record<string, unknown> | null;
  const stockTotal = row.stock_total;
  const capacity = row.online_capacity;
  if (row.market_id !== marketId || !isMarketId(row.id) || !isMarketId(row.product_id) || !market || !product ||
    product.id !== row.product_id || !market.supported_locales.includes(locale) ||
    !Number.isSafeInteger(stockTotal) || !Number.isSafeInteger(capacity) ||
    Number(stockTotal) < 0 || Number(capacity) < 0 || Number(capacity) > Number(stockTotal)) {
    throw new ProductOfferError("Invalid city offer configuration");
  }
  const tiers = row.offer_pricing_tiers as OfferTier[] | null;
  if (!Array.isArray(tiers) || tiers.some(tier => !Number.isSafeInteger(tier.min_days) || tier.min_days < 1 ||
    !Number.isSafeInteger(tier.per_day_cents) || tier.per_day_cents < 0) ||
    new Set(tiers.map(tier => tier.min_days)).size !== tiers.length) throw new ProductOfferError("Invalid offer prices");
  return {
    id: row.id, marketId, productId: row.product_id, marketSlug: market.slug, currency: market.currency,
    timezone: market.timezone, stockTotal: Number(stockTotal), onlineCapacity: Number(capacity),
    tiers: [...tiers].sort((a, b) => a.min_days - b.min_days), product,
  };
}

function queryOffers(db: SupabaseClient<Database>, marketId: string, locale: string, detail: boolean) {
  return db.from("product_offers")
    .select(`${OFFER_FIELDS},product:products!inner(${PRODUCT_FACTS},${detail ? DETAIL_COPY : CARD_COPY})`)
    .abortSignal(AbortSignal.timeout(8000))
    .eq("market_id", marketId).eq("is_active", true).eq("product.is_active", true)
    .eq("market.is_active", true).eq("market.is_public", true)
    .eq("product.product_localizations.locale", locale)
    .eq("product.product_images.is_primary", true);
}

/** Bounded card reads: facts, short localized copy and primary images; no FAQ hydration. */
export async function listProductOffers(db: SupabaseClient<Database>, input: {
  marketId: string; locale: string; page?: number; productIds?: string[]; categoryId?: string;
}): Promise<ProductOfferProjection[]> {
  const { marketId, locale, productIds, categoryId } = input;
  assertContext(marketId, locale);
  const page = input.page ?? 0;
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) throw new ProductOfferError("Invalid offer page");
  if (productIds && (productIds.length > 1000 || productIds.some(id => !isMarketId(id)))) throw new ProductOfferError("Invalid product selection");
  if (productIds?.length === 0) return [];
  if (categoryId !== undefined && !isMarketId(categoryId)) throw new ProductOfferError("Invalid category");
  let query = queryOffers(db, marketId, locale, false);
  if (productIds) query = query.in("product_id", [...new Set(productIds)]);
  if (categoryId) query = query.eq("product.category_id", categoryId);
  const { data, error } = await query.order("id").range(page * 100, page * 100 + 99);
  if (error) throw new ProductOfferError(`Offer read failed (${error.code ?? "database"})`);
  return (data ?? []).map(row => project(row as unknown as Record<string, unknown>, marketId, locale));
}

/** Global product aliases resolve within the selected city's offer only. */
export async function getProductOffer(db: SupabaseClient<Database>, input: {
  marketId: string; locale: string; slug: string; requireBooking?: boolean;
}): Promise<ProductOfferProjection | null> {
  const { marketId, locale, slug } = input;
  assertContext(marketId, locale);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 200) throw new ProductOfferError("Invalid product slug");
  let query = queryOffers(db, marketId, locale, true)
    .in("product.slug", productSlugLookupCandidates(slug)).eq("product.product_faqs.locale", locale);
  if (input.requireBooking) query = query.eq("market.is_booking_enabled", true);
  const { data, error } = await query.limit(3);
  if (error) throw new ProductOfferError(`Offer read failed (${error.code ?? "database"})`);
  const offers = (data ?? []).map(row => project(row as unknown as Record<string, unknown>, marketId, locale));
  const canonicalSlug = canonicalProductSlug(slug);
  return offers.find(offer => offer.product.slug === canonicalSlug) ?? offers[0] ?? null;
}

/** Server-only pricing reader for the later quote/reservation switch. No legacy fallback. */
export async function getBookableProductOffer(db: SupabaseClient<Database>, input: {
  marketId: string; locale: string; slug: string;
}): Promise<ProductOfferProjection & { quantityDiscounts: OfferDiscount[] }> {
  const offer = await getProductOffer(db, { ...input, requireBooking: true });
  if (!offer) throw new ProductOfferError("Product is unavailable in this city");
  if (!offer.tiers.some(tier => tier.min_days === 1)) throw new ProductOfferError("Offer has no base price");
  const { data, error } = await db.from("offer_quantity_discounts")
    .select("min_quantity,discount_bps").eq("product_offer_id", offer.id).order("min_quantity")
    .abortSignal(AbortSignal.timeout(8000));
  if (error) throw new ProductOfferError(`Offer discounts unavailable (${error.code ?? "database"})`);
  const discounts = (data ?? []) as OfferDiscount[];
  if (discounts.some(discount => !Number.isSafeInteger(discount.min_quantity) || discount.min_quantity < 2 ||
    !Number.isSafeInteger(discount.discount_bps) || discount.discount_bps < 0 || discount.discount_bps > 9999)) {
    throw new ProductOfferError("Invalid offer discounts");
  }
  return { ...offer, quantityDiscounts: discounts };
}

/** Adapter for the existing frontend mapper; never copy global stock or prices. */
export function offerProductRow(offer: ProductOfferProjection): Record<string, unknown> {
  return { ...offer.product, city: offer.marketSlug, stock_total: offer.stockTotal,
    stock_available: offer.onlineCapacity, pricing_tiers: offer.tiers };
}
