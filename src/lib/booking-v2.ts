import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FulfillmentMode } from "@/lib/types";

export const BOOKING_TIMEZONE = "Europe/Madrid";
export const DEFAULT_DRAFT_TTL_MINUTES = 30;

export interface BookingProduct {
  id: string;
  slug: string;
  name: string;
  stock_total: number;
  stock_available: number;
}

export interface PricingTier {
  min_days: number;
  per_day_cents: number;
}

export interface FulfillmentSelection {
  mode: FulfillmentMode;
  pickupLocationId?: string | null;
  deliveryZoneId?: string | null;
  collectionZoneId?: string | null;
}

export interface BookingQuote {
  rentalDays: number;
  perDayCents: number;
  rentalSubtotalCents: number;
  deliveryFeeCents: number;
  collectionFeeCents: number;
  totalCents: number;
  pricingSnapshot: Record<string, unknown>;
}

export interface ExpiredDraftCleanupResult {
  expiredDraftIds: string[];
  deletedHoldCount: number;
  expiredDraftCount: number;
}

export interface ServiceZoneFee {
  id: string;
  slug: string;
  name: string;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  roundtrip_fee_cents: number;
  express_surcharge_cents: number;
}

export async function cleanupExpiredBookingDrafts(
  supabase: SupabaseClient<Database>,
  nowIso = new Date().toISOString()
): Promise<ExpiredDraftCleanupResult> {
  const { data: expiredDrafts, error: expiredDraftReadError } = await supabase
    .from("booking_drafts")
    .select("id")
    .in("status", ["draft", "checkout_created"])
    .lt("expires_at", nowIso);

  if (expiredDraftReadError) {
    throw expiredDraftReadError;
  }

  const expiredDraftIds = (expiredDrafts || []).map((draft: { id: string }) => draft.id);

  if (expiredDraftIds.length === 0) {
    return {
      expiredDraftIds,
      deletedHoldCount: 0,
      expiredDraftCount: 0,
    };
  }

  const { count: deletedHoldCount, error: holdDeleteError } = await supabase
    .from("booking_inventory_blocks")
    .delete({ count: "exact" })
    .is("booking_id", null)
    .in("booking_draft_id", expiredDraftIds);

  if (holdDeleteError) {
    throw holdDeleteError;
  }

  const { count: expiredDraftCount, error: draftUpdateError } = await supabase
    .from("booking_drafts")
    .update({ status: "expired" } as never, { count: "exact" })
    .in("status", ["draft", "checkout_created"])
    .lt("expires_at", nowIso);

  if (draftUpdateError) {
    throw draftUpdateError;
  }

  return {
    expiredDraftIds,
    deletedHoldCount: deletedHoldCount || 0,
    expiredDraftCount: expiredDraftCount || 0,
  };
}

export function parseRentalDate(value: string, fieldName: string): Date {
  const parsed = new Date(value);

  if (!value || Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
  }

  return parsed;
}

export function calculateRentalDays(startAt: Date, endAt: Date): number {
  const durationMs = endAt.getTime() - startAt.getTime();

  if (durationMs <= 0) {
    throw new Error("Rental end must be after rental start");
  }

  return Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
}

export function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function choosePricingTier(tiers: PricingTier[], rentalDays: number): PricingTier {
  const sorted = [...tiers].sort((a, b) => b.min_days - a.min_days);
  const tier = sorted.find((candidate) => rentalDays >= candidate.min_days);

  if (!tier) {
    throw new Error("No pricing tier configured for product");
  }

  return tier;
}

export async function getProductWithPricing(
  supabase: SupabaseClient<Database>,
  productSlug: string
): Promise<{ product: BookingProduct; tiers: PricingTier[] }> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, slug, name, stock_total, stock_available")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single();

  if (productError || !product) {
    throw new Error("Product not found");
  }

  const bookingProduct = product as unknown as BookingProduct;

  const { data: tiers, error: tiersError } = await supabase
    .from("pricing_tiers")
    .select("min_days, per_day_cents")
    .eq("product_id", bookingProduct.id)
    .order("min_days", { ascending: true });

  if (tiersError) {
    throw tiersError;
  }

  if (!tiers || tiers.length === 0) {
    throw new Error("No pricing configured for product");
  }

  return {
    product: bookingProduct,
    tiers: tiers as PricingTier[],
  };
}

export async function getServiceZone(
  supabase: SupabaseClient<Database>,
  zoneId?: string | null
): Promise<ServiceZoneFee | null> {
  if (!zoneId) {
    return null;
  }

  const { data, error } = await supabase
    .from("service_zones")
    .select("id, slug, name, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents")
    .eq("id", zoneId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new Error("Service zone not found");
  }

  return data as ServiceZoneFee;
}

export function quoteBooking(
  tiers: PricingTier[],
  startAt: Date,
  endAt: Date,
  fulfillment: FulfillmentSelection,
  deliveryZone: ServiceZoneFee | null,
  collectionZone: ServiceZoneFee | null
): BookingQuote {
  const rentalDays = calculateRentalDays(startAt, endAt);
  const tier = choosePricingTier(tiers, rentalDays);
  const rentalSubtotalCents = tier.per_day_cents * rentalDays;

  let deliveryFeeCents = 0;
  let collectionFeeCents = 0;

  if (fulfillment.mode === "delivery_only") {
    deliveryFeeCents = deliveryZone?.delivery_fee_cents ?? 0;
  }

  if (fulfillment.mode === "delivery_and_collection") {
    if (deliveryZone?.id && deliveryZone.id === collectionZone?.id && deliveryZone.roundtrip_fee_cents > 0) {
      deliveryFeeCents = deliveryZone.roundtrip_fee_cents;
      collectionFeeCents = 0;
    } else {
      deliveryFeeCents = deliveryZone?.delivery_fee_cents ?? 0;
      collectionFeeCents = collectionZone?.collection_fee_cents ?? 0;
    }
  }

  return {
    rentalDays,
    perDayCents: tier.per_day_cents,
    rentalSubtotalCents,
    deliveryFeeCents,
    collectionFeeCents,
    totalCents: rentalSubtotalCents + deliveryFeeCents + collectionFeeCents,
    pricingSnapshot: {
      timezone: BOOKING_TIMEZONE,
      rentalDays,
      selectedTier: tier,
      fulfillment,
      deliveryZone,
      collectionZone,
    },
  };
}

export function assertFulfillmentFields(
  fulfillment: FulfillmentSelection,
  deliveryAddress?: string | null,
  collectionAddress?: string | null
) {
  if (fulfillment.mode === "customer_pickup" && !fulfillment.pickupLocationId) {
    throw new Error("Pickup location is required");
  }

  if (fulfillment.mode === "delivery_only" && (!fulfillment.deliveryZoneId || !deliveryAddress)) {
    throw new Error("Delivery zone and address are required");
  }

  if (
    fulfillment.mode === "delivery_and_collection" &&
    (!fulfillment.deliveryZoneId || !fulfillment.collectionZoneId || !deliveryAddress || !collectionAddress)
  ) {
    throw new Error("Delivery and collection details are required");
  }
}
