import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DeliveryType, FulfillmentMode } from "@/lib/types";

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

export interface QuantityDiscountTier {
  min_quantity: number;
  discount_bps: number;
}

export interface FulfillmentSelection {
  mode: FulfillmentMode;
  pickupLocationId?: string | null;
  deliveryZoneId?: string | null;
  collectionZoneId?: string | null;
}

export interface BookingQuote {
  quantity: number;
  rentalDays: number;
  perDayCents: number;
  unitRentalSubtotalCents: number;
  quantityDiscountBps: number;
  quantityDiscountCents: number;
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
  minimum_order_cents: number;
  automatic_checkout_enabled: boolean;
  lead_time_hours: number;
  same_day_cutoff: string | null;
}

export interface PickupLocationRule {
  id: string;
  name: string;
  lead_time_hours: number;
}

export class BookingRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingRuleError";
  }
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
): Promise<{ product: BookingProduct; tiers: PricingTier[]; quantityDiscounts: QuantityDiscountTier[] }> {
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

  const { data: quantityDiscounts, error: quantityDiscountError } = await supabase
    .from("product_quantity_discounts")
    .select("min_quantity, discount_bps")
    .eq("product_id", bookingProduct.id)
    .order("min_quantity", { ascending: true });

  if (quantityDiscountError && quantityDiscountError.code !== "42P01" && quantityDiscountError.code !== "PGRST205") {
    throw quantityDiscountError;
  }

  return {
    product: bookingProduct,
    tiers: tiers as PricingTier[],
    quantityDiscounts: (quantityDiscounts || []) as QuantityDiscountTier[],
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
    .select("id, slug, name, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents, minimum_order_cents, automatic_checkout_enabled, lead_time_hours, same_day_cutoff")
    .eq("id", zoneId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new BookingRuleError("Service zone not found");
  }

  const zone = data as ServiceZoneFee;
  if (!zone.automatic_checkout_enabled) {
    throw new BookingRuleError(`${zone.name} requires a custom delivery quote.`);
  }
  return zone;
}

export async function getPickupLocation(
  supabase: SupabaseClient<Database>,
  pickupLocationId?: string | null,
): Promise<PickupLocationRule | null> {
  if (!pickupLocationId) return null;

  const { data, error } = await supabase
    .from("pickup_locations")
    .select("id, name, lead_time_hours")
    .eq("id", pickupLocationId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new BookingRuleError("Pickup location not found");
  }

  return data as PickupLocationRule;
}

export function quoteBooking(
  tiers: PricingTier[],
  quantityDiscounts: QuantityDiscountTier[],
  startAt: Date,
  endAt: Date,
  fulfillment: FulfillmentSelection,
  deliveryZone: ServiceZoneFee | null,
  collectionZone: ServiceZoneFee | null,
  quantity = 1,
  deliveryType: DeliveryType = "standard",
): BookingQuote {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

  const rentalDays = calculateRentalDays(startAt, endAt);
  const tier = choosePricingTier(tiers, rentalDays);
  const unitRentalSubtotalCents = tier.per_day_cents * rentalDays;
  const undiscountedRentalSubtotalCents = unitRentalSubtotalCents * quantity;
  const selectedQuantityDiscount = [...quantityDiscounts]
    .sort((a, b) => b.min_quantity - a.min_quantity)
    .find((candidate) => quantity >= candidate.min_quantity);
  const quantityDiscountBps = selectedQuantityDiscount?.discount_bps || 0;
  const quantityDiscountCents = Math.round(undiscountedRentalSubtotalCents * quantityDiscountBps / 10000);
  const rentalSubtotalCents = undiscountedRentalSubtotalCents - quantityDiscountCents;

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

  if (fulfillment.mode !== "customer_pickup" && deliveryType === "express") {
    deliveryFeeCents += deliveryZone?.express_surcharge_cents ?? 0;
  }

  const minimumOrderCents = Math.max(
    deliveryZone?.minimum_order_cents || 0,
    collectionZone?.minimum_order_cents || 0,
  );
  if (rentalSubtotalCents < minimumOrderCents) {
    throw new BookingRuleError(
      `This delivery zone requires a minimum rental value of €${(minimumOrderCents / 100).toFixed(2)}.`,
    );
  }

  return {
    quantity,
    rentalDays,
    perDayCents: tier.per_day_cents,
    unitRentalSubtotalCents,
    quantityDiscountBps,
    quantityDiscountCents,
    rentalSubtotalCents,
    deliveryFeeCents,
    collectionFeeCents,
    totalCents: rentalSubtotalCents + deliveryFeeCents + collectionFeeCents,
    pricingSnapshot: {
      timezone: BOOKING_TIMEZONE,
      quantity,
      rentalDays,
      selectedTier: tier,
      selectedQuantityDiscount: selectedQuantityDiscount || null,
      fulfillment,
      deliveryType,
      deliveryZone,
      collectionZone,
    },
  };
}

function madridDateAndMinutes(value: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value || "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    minutes: Number(part("hour")) * 60 + Number(part("minute")),
  };
}

export function assertFulfillmentTiming(
  startAt: Date,
  deliveryType: DeliveryType,
  pickupLocation: PickupLocationRule | null,
  deliveryZone: ServiceZoneFee | null,
  collectionZone: ServiceZoneFee | null,
  now = new Date(),
) {
  if (startAt.getTime() <= now.getTime()) {
    throw new BookingRuleError("Rental start must be in the future.");
  }

  const leadTimeHours = Math.max(
    pickupLocation?.lead_time_hours || 0,
    deliveryZone?.lead_time_hours || 0,
    collectionZone?.lead_time_hours || 0,
  );

  if (deliveryType === "standard") {
    const earliestStart = now.getTime() + leadTimeHours * 60 * 60 * 1000;
    if (startAt.getTime() < earliestStart) {
      throw new BookingRuleError(`This fulfillment option requires ${leadTimeHours} hours of lead time.`);
    }
    return;
  }

  const madridNow = madridDateAndMinutes(now);
  const madridStart = madridDateAndMinutes(startAt);
  if (madridNow.date !== madridStart.date) return;

  const cutoff = deliveryZone?.same_day_cutoff;
  if (!cutoff) {
    throw new BookingRuleError("Same-day express delivery is not available for this zone.");
  }

  const [cutoffHour, cutoffMinute] = cutoff.split(":").map(Number);
  if (madridNow.minutes > cutoffHour * 60 + cutoffMinute) {
    throw new BookingRuleError(`Same-day express delivery must be booked before ${cutoff.slice(0, 5)}.`);
  }
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
