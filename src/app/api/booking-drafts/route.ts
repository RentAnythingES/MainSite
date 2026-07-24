import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getIncidentErrorMessage, recordSystemIncident } from "@/lib/system-incidents";
import {
  BOOKING_TIMEZONE,
  BookingRuleError,
  DEFAULT_DRAFT_TTL_MINUTES,
  assertFulfillmentFields,
  assertFulfillmentTiming,
  cleanupExpiredBookingDrafts,
  getProductWithPricing,
  getPickupLocation,
  getServiceZone,
  parseRentalDate,
  quoteBooking,
  toDateOnly,
} from "@/lib/booking-v2";
import type { DeliveryType, FulfillmentMode } from "@/lib/types";
import { consumeRateLimits, getClientIp } from "@/lib/rate-limit";

interface DraftRequestBody {
  draftId?: string;
  productSlug?: string;
  quantity?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  startAt?: string;
  endAt?: string;
  fulfillmentMode?: FulfillmentMode;
  deliveryType?: DeliveryType;
  pickupLocationId?: string | null;
  deliveryZoneId?: string | null;
  collectionZoneId?: string | null;
  deliveryAddress?: string | null;
  collectionAddress?: string | null;
  deliveryNotes?: string | null;
  collectionNotes?: string | null;
  billingName?: string | null;
  billingCompanyName?: string | null;
  billingTaxId?: string | null;
  billingAddress?: Record<string, string> | null;
  invoiceRequested?: boolean;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DraftRequestBody;
    const fulfillmentMode = body.fulfillmentMode || "delivery_and_collection";
    const requestedDeliveryType = body.deliveryType || "standard";
    const quantity = Number(body.quantity || 1);

    if (!body.productSlug || !body.customerName || !body.customerEmail || !body.startAt || !body.endAt) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    if (!body.draftId || !UUID_PATTERN.test(body.draftId)) {
      return NextResponse.json({ error: "Invalid booking attempt identifier" }, { status: 400 });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be a positive integer" }, { status: 400 });
    }

    if (!["standard", "express"].includes(requestedDeliveryType)) {
      return NextResponse.json({ error: "Invalid delivery speed" }, { status: 400 });
    }

    const deliveryType: DeliveryType =
      fulfillmentMode === "customer_pickup" ? "standard" : requestedDeliveryType;

    const supabase = createServiceClient();
    const clientIp = getClientIp(request);
    const rateLimit = await consumeRateLimits(supabase, [
      {
        scope: "booking-drafts:ip",
        identifier: clientIp,
        limit: 20,
        windowSeconds: 15 * 60,
      },
      {
        scope: "booking-drafts:ip-product",
        identifier: `${clientIp}:${body.productSlug}`,
        limit: 8,
        windowSeconds: 15 * 60,
      },
      {
        scope: "booking-drafts:email",
        identifier: body.customerEmail,
        limit: 6,
        windowSeconds: 60 * 60,
      },
    ]);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please wait a little before trying again." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
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
    await cleanupExpiredBookingDrafts(supabase);

    const { product, tiers, quantityDiscounts } = await getProductWithPricing(supabase, body.productSlug);

    if (product.stock_available < quantity || product.stock_total < quantity) {
      return NextResponse.json({ error: "Product not available" }, { status: 409 });
    }

    const [pickupLocation, deliveryZone, collectionZone] = await Promise.all([
      getPickupLocation(supabase, body.pickupLocationId),
      getServiceZone(supabase, body.deliveryZoneId),
      getServiceZone(supabase, body.collectionZoneId),
    ]);
    assertFulfillmentTiming(startAt, deliveryType, pickupLocation, deliveryZone, collectionZone);
    const quote = quoteBooking(
      tiers,
      quantityDiscounts,
      startAt,
      endAt,
      {
        mode: fulfillmentMode,
        pickupLocationId: body.pickupLocationId,
        deliveryZoneId: body.deliveryZoneId,
        collectionZoneId: body.collectionZoneId,
      },
      deliveryZone,
      collectionZone,
      quantity,
      deliveryType,
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
        id: body.draftId,
        product_id: product.id,
        quantity,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone || null,
        rental_start_at: startAt.toISOString(),
        rental_end_at: endAt.toISOString(),
        timezone: BOOKING_TIMEZONE,
        rental_days: quote.rentalDays,
        fulfillment_mode: fulfillmentMode,
        delivery_type: deliveryType,
        pickup_location_id: body.pickupLocationId || null,
        delivery_zone_id: body.deliveryZoneId || null,
        collection_zone_id: body.collectionZoneId || null,
        delivery_address: body.deliveryAddress || null,
        collection_address: body.collectionAddress || null,
        delivery_notes: body.deliveryNotes || null,
        collection_notes: body.collectionNotes || null,
        billing_name: body.billingName || body.customerName,
        billing_company_name: body.billingCompanyName || null,
        billing_tax_id: body.billingTaxId || null,
        billing_address: body.billingAddress || {},
        invoice_requested: Boolean(body.invoiceRequested),
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
      p_quantity: quantity,
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
      quantity,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      quote,
    });
  } catch (err) {
    if (err instanceof BookingRuleError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("[booking-drafts] Error:", err);
    await recordSystemIncident({
      source: "booking_drafts",
      eventType: "booking_draft_creation_failed",
      severity: "error",
      message: getIncidentErrorMessage(err),
    });
    return NextResponse.json({ error: "Failed to create booking draft" }, { status: 500 });
  }
}
