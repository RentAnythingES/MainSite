import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { calculateRentalDays, cleanupExpiredBookingDrafts, getProductWithPricing, getServiceZone, parseRentalDate, quoteBooking } from "@/lib/booking-v2";
import { fetchActivePickupLocations, fetchActiveServiceZones } from "@/lib/fulfillment-options";
import type { FulfillmentMode } from "@/lib/types";

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
  const deliveryZoneId = searchParams.get("deliveryZoneId");
  const collectionZoneId = searchParams.get("collectionZoneId");
  const pickupLocationId = searchParams.get("pickupLocationId");

  if (!slug || (!startAtParam && !start) || (!endAtParam && !end)) {
    return NextResponse.json(
      { error: "Missing required params: slug and start/end or startAt/endAt" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    await cleanupExpiredBookingDrafts(supabase);

    const startAt = parseRentalDate(startAtParam || `${start}T09:00:00+02:00`, "start");
    const endAt = parseRentalDate(endAtParam || `${end}T09:00:00+02:00`, "end");
    const { product, tiers } = await getProductWithPricing(supabase, slug);
    const rentalDays = calculateRentalDays(startAt, endAt);

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

    const { data: blockRows, error: blockError } = await supabase
      .from("booking_inventory_blocks")
      .select("quantity, booking_drafts!left(status, expires_at)")
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
          booking_drafts?: { status?: string; expires_at?: string } | null;
        };
        const draft = block.booking_drafts;
        const draftActive = !draft || (
          ["draft", "checkout_created"].includes(draft.status || "") &&
          new Date(draft.expires_at || 0).getTime() > Date.now()
        );

        return draftActive ? total + block.quantity : total;
      }, 0);
    }

    const deliveryZone = await getServiceZone(supabase, deliveryZoneId);
    const collectionZone = await getServiceZone(supabase, collectionZoneId);
    const quote = quoteBooking(
      tiers,
      startAt,
      endAt,
      { mode, pickupLocationId, deliveryZoneId, collectionZoneId },
      deliveryZone,
      collectionZone
    );

    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      fetchActivePickupLocations(supabase),
      fetchActiveServiceZones(supabase),
    ]);

    const available =
      product.stock_available > 0 &&
      blockedDates.length === 0 &&
      overlappingQuantity < product.stock_total;

    return NextResponse.json({
      available,
      blockedDates,
      stockTotal: product.stock_total,
      stockAvailable: product.stock_available,
      overlappingQuantity,
      rentalDays,
      quote,
      pickupLocations: pickupLocationsResult.error ? [] : pickupLocationsResult.data || [],
      serviceZones: serviceZonesResult.error ? [] : serviceZonesResult.data || [],
      slug,
      start: start || startAt.toISOString().slice(0, 10),
      end: end || endAt.toISOString().slice(0, 10),
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });
  } catch (err) {
    console.error("[availability] Error:", err);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
