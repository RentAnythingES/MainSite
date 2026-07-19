import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  getFulfillmentAmendmentUrl,
  isMissingFulfillmentAmendmentsTable,
} from "@/lib/fulfillment-amendments";

type Mode = "delivery_only" | "delivery_and_collection";

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function fee(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100000 ? parsed : null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id: bookingId } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const mode = body.fulfillmentMode as Mode;
  const isCustomQuote = body.isCustomQuote === true;
  const deliveryAddress = cleanText(body.deliveryAddress, 500);
  const collectionAddress = cleanText(body.collectionAddress, 500);
  const deliveryNotes = cleanText(body.deliveryNotes, 1000);
  const collectionNotes = cleanText(body.collectionNotes, 1000);
  const quoteNotes = cleanText(body.quoteNotes, 1000);
  const deliveryZoneId = cleanText(body.deliveryZoneId, 50);
  const collectionZoneId = cleanText(body.collectionZoneId, 50);
  const expiresInDays = Math.round(Math.min(30, Math.max(1, Number(body.expiresInDays) || 7)));

  if (!(["delivery_only", "delivery_and_collection"] as string[]).includes(mode)) {
    return NextResponse.json({ error: "Choose delivery only or delivery and collection" }, { status: 400 });
  }
  if (!deliveryAddress) {
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  }
  if (mode === "delivery_and_collection" && !collectionAddress) {
    return NextResponse.json({ error: "Collection address is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, product:products(name)")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.fulfillment_mode !== "customer_pickup") {
    return NextResponse.json(
      { error: "This first amendment flow only supports bookings currently set to customer pickup" },
      { status: 409 },
    );
  }
  if (!["confirmed", "paid"].includes(booking.status)) {
    return NextResponse.json(
      { error: "Transport can only be added to confirmed or paid bookings before fulfillment starts" },
      { status: 409 },
    );
  }

  let deliveryFeeCents = 0;
  let collectionFeeCents = 0;
  const savedDeliveryZoneId: string | null = deliveryZoneId;
  const savedCollectionZoneId: string | null = mode === "delivery_and_collection" ? collectionZoneId : null;

  if (isCustomQuote) {
    deliveryFeeCents = fee(body.deliveryFeeCents) ?? -1;
    collectionFeeCents = mode === "delivery_and_collection" ? fee(body.collectionFeeCents) ?? -1 : 0;
    if (deliveryFeeCents < 0 || collectionFeeCents < 0) {
      return NextResponse.json({ error: "Custom fees must be valid non-negative cent amounts" }, { status: 400 });
    }
  } else {
    if (!deliveryZoneId || (mode === "delivery_and_collection" && !collectionZoneId)) {
      return NextResponse.json({ error: "Configured service zones are required" }, { status: 400 });
    }
    const zoneIds = [...new Set([deliveryZoneId, collectionZoneId].filter(Boolean))] as string[];
    const { data: zones, error: zonesError } = await supabase
      .from("service_zones")
      .select("id, delivery_fee_cents, collection_fee_cents, is_active")
      .in("id", zoneIds);
    if (zonesError) return NextResponse.json({ error: "Could not load service-zone pricing" }, { status: 500 });
    const zoneById = new Map((zones || []).filter((zone) => zone.is_active).map((zone) => [zone.id, zone]));
    const deliveryZone = zoneById.get(deliveryZoneId);
    const collectionZone = collectionZoneId ? zoneById.get(collectionZoneId) : null;
    if (!deliveryZone || (mode === "delivery_and_collection" && !collectionZone)) {
      return NextResponse.json({ error: "Choose active service zones" }, { status: 400 });
    }
    deliveryFeeCents = deliveryZone.delivery_fee_cents;
    collectionFeeCents = mode === "delivery_and_collection" ? collectionZone!.collection_fee_cents : 0;
  }

  if (deliveryFeeCents + collectionFeeCents <= 0) {
    return NextResponse.json({ error: "The transport quote total must be greater than zero" }, { status: 400 });
  }

  const staleQuoteExpiry = new Date().toISOString();
  const { error: expireError } = await supabase
    .from("booking_fulfillment_amendments")
    .update({ status: "expired" })
    .eq("booking_id", bookingId)
    .in("status", ["quoted", "checkout_created"])
    .lte("expires_at", staleQuoteExpiry);
  if (expireError && !isMissingFulfillmentAmendmentsTable(expireError)) {
    console.error("[fulfillment-amendments] Could not expire stale quotes", expireError);
    return NextResponse.json({ error: "Could not prepare a new transport quote" }, { status: 500 });
  }

  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const { data: amendment, error } = await supabase
    .from("booking_fulfillment_amendments")
    .insert({
      booking_id: bookingId,
      fulfillment_mode: mode,
      delivery_zone_id: savedDeliveryZoneId,
      collection_zone_id: savedCollectionZoneId,
      delivery_address: deliveryAddress,
      collection_address: mode === "delivery_and_collection" ? collectionAddress : null,
      delivery_notes: deliveryNotes,
      collection_notes: mode === "delivery_and_collection" ? collectionNotes : null,
      delivery_fee_cents: deliveryFeeCents,
      collection_fee_cents: collectionFeeCents,
      is_custom_quote: isCustomQuote,
      quote_notes: quoteNotes,
      expires_at: expiresAt,
      created_by: user.id,
      original_fulfillment_snapshot: {
        fulfillment_mode: booking.fulfillment_mode,
        pickup_location_id: booking.pickup_location_id,
        delivery_zone_id: booking.delivery_zone_id,
        collection_zone_id: booking.collection_zone_id,
        delivery_address: booking.delivery_address,
        collection_address: booking.collection_address,
        delivery_fee_cents: booking.delivery_fee_cents,
        collection_fee_cents: booking.collection_fee_cents,
      },
    })
    .select("*")
    .single();

  if (isMissingFulfillmentAmendmentsTable(error)) {
    return NextResponse.json({ error: "Fulfillment amendment migration required" }, { status: 503 });
  }
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This booking already has an open transport quote" }, { status: 409 });
    }
    console.error("[fulfillment-amendments] Quote creation failed", error);
    return NextResponse.json({ error: "Could not create transport quote" }, { status: 500 });
  }

  return NextResponse.json({
    amendment,
    customerUrl: getFulfillmentAmendmentUrl(amendment.public_token),
  });
}
