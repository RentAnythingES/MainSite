import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DeliveryType, FulfillmentMode } from "@/lib/types";
import { canonicalProductSlug, productSlugLookupCandidates } from "@/lib/product-slug-aliases";
import {
  evaluateFulfillmentPolicy,
  formatValenciaDateTime,
  valenciaWallClockToDate,
  type FulfillmentPolicyReason,
  type FulfillmentPolicyResult,
} from "@/lib/fulfillment-policy";

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
  fulfillmentBaseFeeCents: number;
  expressSurchargeCents: number;
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
  automatic_express_enabled: boolean;
  express_min_lead_hours: number;
  delivery_operating_hours: Record<string, unknown>;
}

export interface RentalPeriodInput {
  startAt?: string;
  endAt?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}

export interface ResolvedRentalPeriod {
  startAt: Date;
  endAt: Date;
  wallClock: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
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

export function resolveRentalPeriod(input: RentalPeriodInput): ResolvedRentalPeriod {
  const wallClockValues = [input.startDate, input.startTime, input.endDate, input.endTime];
  const hasWallClockValue = wallClockValues.some(Boolean);
  const hasCompleteWallClock = wallClockValues.every(Boolean);

  if (hasWallClockValue && !hasCompleteWallClock) {
    throw new BookingRuleError("Choose a complete rental start and end time in Valencia time.");
  }

  if (hasCompleteWallClock) {
    const startAt = valenciaWallClockToDate(input.startDate!, input.startTime!);
    const endAt = valenciaWallClockToDate(input.endDate!, input.endTime!);
    if (!startAt || !endAt) {
      throw new BookingRuleError("Choose a valid rental start and end time in Valencia time.");
    }
    return {
      startAt,
      endAt,
      wallClock: {
        startDate: input.startDate!,
        startTime: input.startTime!,
        endDate: input.endDate!,
        endTime: input.endTime!,
      },
    };
  }

  if (!input.startAt || !input.endAt) {
    throw new BookingRuleError("Choose a rental start and end time.");
  }
  const startAt = parseRentalDate(input.startAt, "startAt");
  const endAt = parseRentalDate(input.endAt, "endAt");
  const startWallClock = formatValenciaDateTime(startAt);
  const endWallClock = formatValenciaDateTime(endAt);
  return {
    startAt,
    endAt,
    wallClock: {
      startDate: startWallClock.date,
      startTime: startWallClock.time,
      endDate: endWallClock.date,
      endTime: endWallClock.time,
    },
  };
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
  const canonicalSlug = canonicalProductSlug(productSlug);
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, slug, name, stock_total, stock_available")
    .in("slug", productSlugLookupCandidates(productSlug))
    .eq("is_active", true);

  const productRows = (products || []) as unknown as BookingProduct[];
  const product = productRows.find((candidate) => candidate.slug === canonicalSlug) || productRows[0];

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
  zoneId?: string | null,
  marketId?: string | null,
): Promise<ServiceZoneFee | null> {
  if (!zoneId) {
    return null;
  }

  let query = supabase
    .from("service_zones")
    .select("id, slug, name, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents, minimum_order_cents, automatic_checkout_enabled, lead_time_hours, same_day_cutoff, automatic_express_enabled, express_min_lead_hours, delivery_operating_hours")
    .eq("id", zoneId)
    .eq("is_active", true);
  if (marketId) query = query.eq("market_id", marketId);
  let { data, error } = await query.single();

  if (error && ["42703", "PGRST200", "PGRST204"].includes(error.code || "")) {
    let fallbackQuery = supabase
      .from("service_zones")
      .select("id, slug, name, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents, minimum_order_cents, automatic_checkout_enabled, lead_time_hours, same_day_cutoff")
      .eq("id", zoneId)
      .eq("is_active", true);
    if (marketId) fallbackQuery = fallbackQuery.eq("market_id", marketId);
    const fallback = await fallbackQuery.single();
    const fallbackResult = fallback as unknown as {
      data: Record<string, unknown> | null;
      error: typeof error;
    };
    data = fallbackResult.data ? {
      ...fallbackResult.data,
      automatic_express_enabled: false,
      express_min_lead_hours: 6,
      delivery_operating_hours: {},
    } as unknown as typeof data : null;
    error = fallbackResult.error;
  }

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
  marketId?: string | null,
): Promise<PickupLocationRule | null> {
  if (!pickupLocationId) return null;

  let query = supabase
    .from("pickup_locations")
    .select("id, name, lead_time_hours")
    .eq("id", pickupLocationId)
    .eq("is_active", true);
  if (marketId) query = query.eq("market_id", marketId);
  const { data, error } = await query.single();

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
  let expressSurchargeCents = 0;

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
    expressSurchargeCents = deliveryZone?.express_surcharge_cents ?? 0;
    deliveryFeeCents += expressSurchargeCents;
  }

  const fulfillmentBaseFeeCents = deliveryFeeCents + collectionFeeCents - expressSurchargeCents;

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
    fulfillmentBaseFeeCents,
    expressSurchargeCents,
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

export function getFulfillmentBaseFeeCents(
  fulfillment: FulfillmentSelection,
  deliveryZone: ServiceZoneFee | null,
  collectionZone: ServiceZoneFee | null,
): number {
  if (fulfillment.mode === "customer_pickup") return 0;
  if (fulfillment.mode === "delivery_only") return deliveryZone?.delivery_fee_cents ?? 0;
  if (
    deliveryZone?.id &&
    deliveryZone.id === collectionZone?.id &&
    deliveryZone.roundtrip_fee_cents > 0
  ) {
    return deliveryZone.roundtrip_fee_cents;
  }
  return (deliveryZone?.delivery_fee_cents ?? 0) + (collectionZone?.collection_fee_cents ?? 0);
}

export function getStoredFulfillmentFeeBreakdown(
  pricingSnapshot: unknown,
  deliveryFeeCents: number,
  collectionFeeCents: number,
  deliveryType: DeliveryType,
): { baseFeeCents: number; expressSurchargeCents: number; totalFeeCents: number } {
  const totalFeeCents = Math.max(0, deliveryFeeCents) + Math.max(0, collectionFeeCents);
  const snapshot = pricingSnapshot && typeof pricingSnapshot === "object"
    ? pricingSnapshot as Record<string, unknown>
    : {};
  const policy = snapshot.fulfillmentPolicy && typeof snapshot.fulfillmentPolicy === "object"
    ? snapshot.fulfillmentPolicy as Record<string, unknown>
    : null;
  const policyFees = policy?.fees && typeof policy.fees === "object"
    ? policy.fees as Record<string, unknown>
    : null;

  const policyBase = Number(policyFees?.baseFeeCents);
  const policySurcharge = Number(policyFees?.expressSurchargeCents);
  if (
    Number.isFinite(policyBase) &&
    Number.isFinite(policySurcharge) &&
    policyBase >= 0 &&
    policySurcharge >= 0 &&
    policyBase + policySurcharge === totalFeeCents
  ) {
    return {
      baseFeeCents: policyBase,
      expressSurchargeCents: policySurcharge,
      totalFeeCents,
    };
  }

  const deliveryZone = snapshot.deliveryZone && typeof snapshot.deliveryZone === "object"
    ? snapshot.deliveryZone as Record<string, unknown>
    : null;
  const configuredSurcharge = deliveryType === "express"
    ? Number(deliveryZone?.express_surcharge_cents)
    : 0;
  const expressSurchargeCents = Number.isFinite(configuredSurcharge)
    ? Math.max(0, Math.min(totalFeeCents, configuredSurcharge))
    : 0;
  return {
    baseFeeCents: totalFeeCents - expressSurchargeCents,
    expressSurchargeCents,
    totalFeeCents,
  };
}

export function evaluateDeliveryFulfillment(
  period: ResolvedRentalPeriod,
  fulfillment: FulfillmentSelection,
  deliveryZone: ServiceZoneFee | null,
  collectionZone: ServiceZoneFee | null,
  now = new Date(),
): FulfillmentPolicyResult | null {
  if (fulfillment.mode === "customer_pickup") return null;
  if (!deliveryZone) {
    throw new BookingRuleError("Delivery zone is required.");
  }

  return evaluateFulfillmentPolicy({
    request: period.wallClock,
    config: {
      futureDateLeadHours: Math.max(
        deliveryZone.lead_time_hours || 0,
        collectionZone?.lead_time_hours || 0,
      ),
      automaticExpressEnabled: deliveryZone.automatic_express_enabled === true,
      expressMinLeadHours: deliveryZone.express_min_lead_hours,
      operatingHours: deliveryZone.delivery_operating_hours,
      baseFeeCents: getFulfillmentBaseFeeCents(fulfillment, deliveryZone, collectionZone),
      expressSurchargeCents: deliveryZone.express_surcharge_cents,
    },
    now,
  });
}

export function getFulfillmentPolicyMessage(reason: FulfillmentPolicyReason): string {
  switch (reason) {
    case "same_day_too_soon":
      return "This same-day timing needs confirmation because it is less than 6 hours away.";
    case "future_date_too_soon":
      return "This timing needs confirmation because it is less than 12 hours away.";
    case "outside_operating_hours":
      return "This delivery time is outside our automatic delivery hours (09:00-20:00 Valencia time).";
    case "closed_day":
      return "Automatic delivery is closed for this day.";
    case "express_disabled":
      return "Same-day delivery needs confirmation for this zone.";
    case "policy_unconfigured":
      return "This delivery timing needs confirmation from our team.";
    case "start_in_past":
      return "Rental start must be in the future.";
    case "end_not_after_start":
      return "Rental end must be after rental start.";
    case "invalid_valencia_time":
      return "Choose a valid date and time in Valencia time.";
    default:
      return "This delivery timing is available for automatic checkout.";
  }
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

  if (!deliveryZone) {
    const earliestStart = now.getTime() + leadTimeHours * 60 * 60 * 1000;
    if (startAt.getTime() < earliestStart) {
      throw new BookingRuleError(`This fulfillment option requires ${leadTimeHours} hours of lead time.`);
    }
    return;
  }

  const wallClock = formatValenciaDateTime(startAt);
  const endWallClock = formatValenciaDateTime(new Date(startAt.getTime() + 24 * 60 * 60 * 1000));
  const result = evaluateDeliveryFulfillment(
    {
      startAt,
      endAt: new Date(startAt.getTime() + 24 * 60 * 60 * 1000),
      wallClock: {
        startDate: wallClock.date,
        startTime: wallClock.time,
        endDate: endWallClock.date,
        endTime: endWallClock.time,
      },
    },
    { mode: "delivery_only", deliveryZoneId: deliveryZone.id },
    deliveryZone,
    collectionZone,
    now,
  );
  if (!result || result.decision === "invalid" || result.decision === "manual_confirmation") {
    throw new BookingRuleError(
      result ? getFulfillmentPolicyMessage(result.reason) : "This delivery timing needs confirmation.",
    );
  }
  if (result.deliveryType !== deliveryType) {
    throw new BookingRuleError(
      result.deliveryType === "express"
        ? "Same-day delivery requires Express service and its surcharge."
        : "Later-date delivery is booked as Standard service.",
    );
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
