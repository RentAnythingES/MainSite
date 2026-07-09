import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  BOOKING_TIMEZONE,
  DEFAULT_DRAFT_TTL_MINUTES,
  assertFulfillmentFields,
  cleanupExpiredBookingDrafts,
  getProductWithPricing,
  getServiceZone,
  parseRentalDate,
  quoteBooking,
  toDateOnly,
} from "@/lib/booking-v2";
import type { FulfillmentMode } from "@/lib/types";

interface DraftRequestBody {
  productSlug?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  startAt?: string;
  endAt?: string;
  fulfillmentMode?: FulfillmentMode;
  pickupLocationId?: string | null;
  deliveryZoneId?: string | null;
  collectionZoneId?: string | null;
  deliveryAddress?: string | null;
  collectionAddress?: string | null;
  deliveryNotes?: string | null;
  collectionNotes?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DraftRequestBody;
    const fulfillmentMode = body.fulfillmentMode || "delivery_and_collection";

    if (!body.productSlug || !body.customerName || !body.customerEmail || !body.startAt || !body.endAt) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    assertFulfillmentFields(
      {
        mode: fulfillmentMode,
        pickupLocationId: body.pickupLocationId,
        deliveryZoneId: body.deliveryZoneId,
        collectionZoneId: body.collectionZoneId,
      },
      body.deliveryAddress,
      body.collectionAddress
    );

    const startAt = parseRentalDate(body.startAt, "startAt");
    const endAt = parseRentalDate(body.endAt, "endAt");
    const supabase = createServiceClient();
    await cleanupExpiredBookingDrafts(supabase);

    const { product, tiers } = await getProductWithPricing(supabase, body.productSlug);

    if (product.stock_available <= 0) {
      return NextResponse.json({ error: "Product not available" }, { status: 409 });
    }

    const deliveryZone = await getServiceZone(supabase, body.deliveryZoneId);
    const collectionZone = await getServiceZone(supabase, body.collectionZoneId);
    const quote = quoteBooking(
      tiers,
      startAt,
      endAt,
      {
        mode: fulfillmentMode,
        pickupLocationId: body.pickupLocationId,
        deliveryZoneId: body.deliveryZoneId,
        collectionZoneId: body.collectionZoneId,
      },
      deliveryZone,
      collectionZone
    );

    const { data: blockedDates, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("blocked_date")
      .eq("product_id", product.id)
      .gte("blocked_date", toDateOnly(startAt))
      .lte("blocked_date", toDateOnly(endAt));

    if (blockedError) {
      throw blockedError;
    }

    if (blockedDates && blockedDates.length > 0) {
      return NextResponse.json(
        { error: "Product not available for selected dates", blockedDates },
        { status: 409 }
      );
    }

    const expiresAt = new Date(Date.now() + DEFAULT_DRAFT_TTL_MINUTES * 60 * 1000).toISOString();
    const { data: draft, error: draftError } = await supabase
      .from("booking_drafts")
      .insert({
        product_id: product.id,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone || null,
        rental_start_at: startAt.toISOString(),
        rental_end_at: endAt.toISOString(),
        timezone: BOOKING_TIMEZONE,
        rental_days: quote.rentalDays,
        fulfillment_mode: fulfillmentMode,
        pickup_location_id: body.pickupLocationId || null,
        delivery_zone_id: body.deliveryZoneId || null,
        collection_zone_id: body.collectionZoneId || null,
        delivery_address: body.deliveryAddress || null,
        collection_address: body.collectionAddress || null,
        delivery_notes: body.deliveryNotes || null,
        collection_notes: body.collectionNotes || null,
        currency: "eur",
        per_day_cents: quote.perDayCents,
        rental_subtotal_cents: quote.rentalSubtotalCents,
        delivery_fee_cents: quote.deliveryFeeCents,
        collection_fee_cents: quote.collectionFeeCents,
        total_cents: quote.totalCents,
        deposit_cents: 0,
        pricing_snapshot: quote.pricingSnapshot,
        status: "draft",
        expires_at: expiresAt,
      })
      .select("id, expires_at")
      .single();

    if (draftError || !draft) {
      throw draftError || new Error("Failed to create booking draft");
    }

    const { data: reserved, error: reserveError } = await supabase.rpc("reserve_booking_inventory", {
      p_product_id: product.id,
      p_booking_draft_id: draft.id,
      p_starts_at: startAt.toISOString(),
      p_ends_at: endAt.toISOString(),
      p_quantity: 1,
    });

    if (reserveError || reserved !== true) {
      await supabase.from("booking_drafts").update({ status: "cancelled" }).eq("id", draft.id);
      return NextResponse.json({ error: "Product not available for selected time" }, { status: 409 });
    }

    return NextResponse.json({
      draftId: draft.id,
      expiresAt: draft.expires_at,
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
      },
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      quote,
    });
  } catch (err) {
    console.error("[booking-drafts] Error:", err);
    return NextResponse.json({ error: "Failed to create booking draft" }, { status: 500 });
  }
}
