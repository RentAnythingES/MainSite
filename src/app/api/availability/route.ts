import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { BookingRuleError, assertFulfillmentTiming, calculateRentalDays, cleanupExpiredBookingDrafts, getPickupLocation, getProductWithPricing, getServiceZone, parseRentalDate, quoteBooking } from "@/lib/booking-v2";
import { fetchActivePickupLocations, fetchActiveServiceZones } from "@/lib/fulfillment-options";
import type { DeliveryType, FulfillmentMode } from "@/lib/types";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/availability?slug=compact-stroller&start=2026-07-01&end=2026-07-07
 * 
 * Returns availability info for a product in a date range.
 * Public endpoint (no auth required) — uses anon key with RLS.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const startAtParam = searchParams.get("startAt");
  const endAtParam = searchParams.get("endAt");
  const mode = (searchParams.get("mode") || "delivery_and_collection") as FulfillmentMode;
  const requestedDeliveryType = (searchParams.get("deliveryType") || "standard") as DeliveryType;
  const deliveryZoneId = searchParams.get("deliveryZoneId");
  const collectionZoneId = searchParams.get("collectionZoneId");
  const pickupLocationId = searchParams.get("pickupLocationId");
  const quantity = Number(searchParams.get("quantity") || "1");
  const draftId = searchParams.get("draftId");

  if (!slug || (!startAtParam && !start) || (!endAtParam && !end)) {
    return NextResponse.json(
      { error: "Missing required params: slug and start/end or startAt/endAt" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ error: "Quantity must be a positive integer" }, { status: 400 });
  }

  if (!["standard", "express"].includes(requestedDeliveryType)) {
    return NextResponse.json({ error: "Invalid delivery speed" }, { status: 400 });
  }

  const deliveryType: DeliveryType =
    mode === "customer_pickup" ? "standard" : requestedDeliveryType;

  try {
    const supabase = createServiceClient();
    await cleanupExpiredBookingDrafts(supabase);

    const startAt = parseRentalDate(startAtParam || `${start}T09:00:00+02:00`, "start");
    const endAt = parseRentalDate(endAtParam || `${end}T09:00:00+02:00`, "end");
    const { product, tiers, quantityDiscounts } = await getProductWithPricing(supabase, slug);
    const rentalDays = calculateRentalDays(startAt, endAt);
    let resumableDraftId: string | null = null;

    if (draftId && UUID_PATTERN.test(draftId)) {
      const { data: ownedDraft } = await supabase
        .from("booking_drafts")
        .select("id,product_id,quantity,rental_start_at,rental_end_at,status,expires_at")
        .eq("id", draftId)
        .eq("product_id", product.id)
        .in("status", ["draft", "checkout_created"])
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (
        ownedDraft &&
        ownedDraft.quantity === quantity &&
        new Date(ownedDraft.rental_start_at).getTime() === startAt.getTime() &&
        new Date(ownedDraft.rental_end_at).getTime() === endAt.getTime()
      ) {
        resumableDraftId = ownedDraft.id;
      }
    }

    // Get all blocked dates in range
    const { data: blockedRows, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("blocked_date, reason")
      .eq("product_id", product.id)
      .gte("blocked_date", start || startAt.toISOString().slice(0, 10))
      .lte("blocked_date", end || endAt.toISOString().slice(0, 10));

    if (blockedError) throw blockedError;

    const blockedDates = (blockedRows || []).map((r: { blocked_date: string }) => r.blocked_date);
    let overlappingQuantity = 0;
    let overlappingCheckoutQuantity = 0;
    let overlappingBookingQuantity = 0;
    const holdExpirations: string[] = [];

    const { data: blockRows, error: blockError } = await supabase
      .from("booking_inventory_blocks")
      .select("quantity, booking_id, booking_draft_id, booking_drafts!left(status, expires_at)")
      .eq("product_id", product.id)
      .lt("starts_at", endAt.toISOString())
      .gt("ends_at", startAt.toISOString());

    if (blockError && blockError.code !== "42P01" && blockError.code !== "42703") {
      throw blockError;
    }

    if (blockRows) {
      overlappingQuantity = blockRows.reduce((total, row) => {
        const block = row as {
          quantity: number;
          booking_id?: string | null;
          booking_draft_id?: string | null;
          booking_drafts?: { status?: string; expires_at?: string } | null;
        };
        if (block.booking_draft_id === resumableDraftId) return total;

        const draft = block.booking_drafts;
        if (block.booking_id) {
          overlappingBookingQuantity += block.quantity;
          return total + block.quantity;
        }

        const draftActive = !draft || (
          ["draft", "checkout_created"].includes(draft.status || "") &&
          new Date(draft.expires_at || 0).getTime() > Date.now()
        );

        if (draftActive) {
          overlappingCheckoutQuantity += block.quantity;
          if (draft?.expires_at) holdExpirations.push(draft.expires_at);
        }
        return draftActive ? total + block.quantity : total;
      }, 0);
    }

    const [pickupLocation, deliveryZone, collectionZone] = await Promise.all([
      getPickupLocation(supabase, pickupLocationId),
      getServiceZone(supabase, deliveryZoneId),
      getServiceZone(supabase, collectionZoneId),
    ]);
    assertFulfillmentTiming(startAt, deliveryType, pickupLocation, deliveryZone, collectionZone);
    const quote = quoteBooking(
      tiers,
      quantityDiscounts,
      startAt,
      endAt,
      { mode, pickupLocationId, deliveryZoneId, collectionZoneId },
      deliveryZone,
      collectionZone,
      quantity,
      deliveryType,
    );

    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      fetchActivePickupLocations(supabase),
      fetchActiveServiceZones(supabase),
    ]);

    const maxAvailableQuantity = blockedDates.length > 0
      ? 0
      : Math.max(
          0,
          Math.min(product.stock_available, product.stock_total) - overlappingQuantity,
        );
    const available = quantity <= maxAvailableQuantity;
    const availabilityReason = available
      ? "available"
      : blockedDates.length > 0
        ? "calendar_block"
        : overlappingBookingQuantity > 0
          ? "booked"
          : overlappingCheckoutQuantity > 0
            ? "checkout_hold"
            : "out_of_stock";

    return NextResponse.json({
      available,
      availabilityReason,
      blockedDates,
      stockTotal: product.stock_total,
      stockAvailable: product.stock_available,
      overlappingQuantity,
      overlappingCheckoutQuantity,
      overlappingBookingQuantity,
      holdExpiresAt: holdExpirations.sort()[0] || null,
      resumableDraft: Boolean(resumableDraftId),
      requestedQuantity: quantity,
      maxAvailableQuantity,
      rentalDays,
      quote,
      pickupLocations: pickupLocationsResult.error ? [] : pickupLocationsResult.data || [],
      serviceZones: serviceZonesResult.error ? [] : serviceZonesResult.data || [],
      slug,
      start: start || startAt.toISOString().slice(0, 10),
      end: end || endAt.toISOString().slice(0, 10),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    if (err instanceof BookingRuleError) {
      return NextResponse.json(
        { available: false, availabilityReason: "fulfillment_rule", error: err.message },
        { status: 409 },
      );
    }
    console.error("[availability] Error:", err);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
