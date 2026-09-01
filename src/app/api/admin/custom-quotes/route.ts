import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  cleanOptionalText,
  customQuoteTotal,
  isMissingCustomQuotesSchema,
  parseCustomQuoteLines,
  parseFulfillmentMode,
  parseQuoteDate,
  resolveCustomQuoteExpiry,
} from "@/lib/custom-booking-quotes";
import { createAdminClient } from "@/lib/supabase-admin";

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const supabase = createAdminClient();
  const [quotesResult, productsResult, pickupResult] = await Promise.all([
    supabase
      .from("booking_custom_quotes")
      .select("*, product:products(id, name, slug, brand, image_url), pickup_location:pickup_locations!booking_custom_quotes_pickup_location_id_fkey(id, name, address)")
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, name, slug, brand, stock_total, stock_available")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("pickup_locations")
      .select("id, name, address")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  if (isMissingCustomQuotesSchema(quotesResult.error)) {
    return NextResponse.json({ error: "Apply the custom booking quotes migration first" }, { status: 503 });
  }
  if (quotesResult.error || productsResult.error || pickupResult.error) {
    console.error("[admin/custom-quotes] GET failed", quotesResult.error || productsResult.error || pickupResult.error);
    return NextResponse.json({ error: "Could not load custom quotes" }, { status: 500 });
  }

  return NextResponse.json({
    quotes: quotesResult.data || [],
    products: productsResult.data || [],
    pickupLocations: pickupResult.data || [],
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId : "";
    const quantity = Number(body.quantity);
    const rentalStartAt = parseQuoteDate(body.rentalStartAt, "Rental start");
    const rentalEndAt = parseQuoteDate(body.rentalEndAt, "Rental end");
    const requestedExpiresAt = parseQuoteDate(body.expiresAt, "Quote expiry");
    const now = new Date();
    const expiresAt = resolveCustomQuoteExpiry(rentalStartAt, requestedExpiresAt, now);
    const fulfillmentMode = parseFulfillmentMode(body.fulfillmentMode);
    const lines = parseCustomQuoteLines(body.lineItems);
    const totalCents = customQuoteTotal(lines);
    const pickupLocationId = cleanOptionalText(body.pickupLocationId, 80);
    const deliveryAddress = cleanOptionalText(body.deliveryAddress, 500);
    const collectionAddress = cleanOptionalText(body.collectionAddress, 500);

    if (!productId) throw new Error("Choose a product");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) throw new Error("Quantity must be between 1 and 50");
    if (rentalStartAt.getTime() <= now.getTime()) throw new Error("Rental start must be in the future");
    if (rentalEndAt <= rentalStartAt) throw new Error("Rental end must be after the start");
    if (fulfillmentMode === "customer_pickup" && !pickupLocationId) {
      throw new Error("Choose a pickup location");
    }

    const supabase = createAdminClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock_total, stock_available")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) throw new Error("Active product not found");
    if (Math.min(product.stock_total, product.stock_available) < quantity) {
      throw new Error("The primary product does not have enough online capacity");
    }

    const [blockedResult, inventoryResult] = await Promise.all([
      supabase
        .from("blocked_dates")
        .select("id")
        .eq("product_id", productId)
        .gte("blocked_date", dateOnly(rentalStartAt))
        .lte("blocked_date", dateOnly(rentalEndAt))
        .limit(1),
      supabase
        .from("booking_inventory_blocks")
        .select("quantity, booking_id, booking_draft_id, booking_drafts!left(status, expires_at)")
        .eq("product_id", productId)
        .lt("starts_at", rentalEndAt.toISOString())
        .gt("ends_at", rentalStartAt.toISOString()),
    ]);

    if (blockedResult.error || inventoryResult.error) throw blockedResult.error || inventoryResult.error;
    const overlappingQuantity = (inventoryResult.data || []).reduce((sum, row) => {
      const block = row as {
        quantity: number;
        booking_id?: string | null;
        booking_drafts?: { status?: string; expires_at?: string } | null;
      };
      if (block.booking_id) return sum + block.quantity;
      const draft = block.booking_drafts;
      const active = !draft || (
        ["draft", "checkout_created"].includes(draft.status || "")
        && new Date(draft.expires_at || 0).getTime() > Date.now()
      );
      return active ? sum + block.quantity : sum;
    }, 0);

    if ((blockedResult.data || []).length > 0 || overlappingQuantity + quantity > Math.min(product.stock_total, product.stock_available)) {
      throw new Error("The primary product is not currently available for those dates");
    }

    const { data: quote, error } = await supabase
      .from("booking_custom_quotes")
      .insert({
        status: "open",
        product_id: productId,
        quantity,
        customer_name: cleanOptionalText(body.customerName, 120),
        customer_email: cleanOptionalText(body.customerEmail, 254)?.toLowerCase() || null,
        customer_phone: cleanOptionalText(body.customerPhone, 40),
        rental_start_at: rentalStartAt.toISOString(),
        rental_end_at: rentalEndAt.toISOString(),
        timezone: "Europe/Madrid",
        fulfillment_mode: fulfillmentMode,
        pickup_location_id: fulfillmentMode === "customer_pickup" ? pickupLocationId : null,
        delivery_address: fulfillmentMode === "customer_pickup" ? null : deliveryAddress,
        collection_address: fulfillmentMode === "delivery_and_collection" ? collectionAddress : null,
        delivery_notes: cleanOptionalText(body.deliveryNotes, 1000),
        collection_notes: cleanOptionalText(body.collectionNotes, 1000),
        currency: "eur",
        line_items: lines,
        total_cents: totalCents,
        customer_terms: cleanOptionalText(body.customerTerms, 3000),
        internal_notes: cleanOptionalText(body.internalNotes, 3000),
        booking_draft_id: null,
        booking_id: null,
        expires_at: expiresAt.toISOString(),
        checkout_created_at: null,
        paid_at: null,
        cancelled_at: null,
        created_by: user.id,
      })
      .select("*, product:products(id, name, slug, brand, image_url)")
      .single();

    if (isMissingCustomQuotesSchema(error)) {
      return NextResponse.json({ error: "Apply the custom booking quotes migration first" }, { status: 503 });
    }
    if (error || !quote) throw error || new Error("Quote could not be created");

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create custom quote";
    const clientError = /choose|required|must|future|after|before|available|capacity|amount|line/i.test(message);
    console.error("[admin/custom-quotes] POST failed", error);
    return NextResponse.json({ error: message }, { status: clientError ? 400 : 500 });
  }
}
