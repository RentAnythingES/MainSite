import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  getFulfillmentAmendmentTotal,
  isMissingFulfillmentAmendmentsTable,
} from "@/lib/fulfillment-amendments";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select(`
      *,
      booking:bookings!inner (
        booking_ref,
        status,
        rental_start_at,
        rental_end_at,
        customer_name,
        product:products (name)
      ),
      delivery_zone:service_zones!booking_fulfillment_amendments_delivery_zone_id_fkey (name),
      collection_zone:service_zones!booking_fulfillment_amendments_collection_zone_id_fkey (name)
    `)
    .eq("public_token", token)
    .maybeSingle();

  if (isMissingFulfillmentAmendmentsTable(error)) {
    return NextResponse.json({ error: "Transport changes are not available yet" }, { status: 503 });
  }
  if (error || !data) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }

  let status = data.status as string;
  if (["quoted", "checkout_created"].includes(status) && new Date(data.expires_at).getTime() <= Date.now()) {
    await supabase
      .from("booking_fulfillment_amendments")
      .update({ status: "expired" })
      .eq("id", data.id)
      .in("status", ["quoted", "checkout_created"]);
    status = "expired";
  }

  const booking = data.booking as unknown as {
    booking_ref: string;
    status: string;
    rental_start_at: string | null;
    rental_end_at: string | null;
    customer_name: string;
    product: { name: string } | null;
  };
  const deliveryZone = data.delivery_zone as unknown as { name?: string } | null;
  const collectionZone = data.collection_zone as unknown as { name?: string } | null;

  return NextResponse.json(
    {
      bookingRef: booking.booking_ref,
      bookingStatus: booking.status,
      customerFirstName: booking.customer_name?.split(/\s+/)[0] || null,
      productName: booking.product?.name || "Rental equipment",
      rentalStartAt: booking.rental_start_at,
      rentalEndAt: booking.rental_end_at,
      status,
      fulfillmentMode: data.fulfillment_mode,
      deliveryZoneName: deliveryZone?.name || (data.is_custom_quote ? "Custom transport quote" : null),
      collectionZoneName: collectionZone?.name || null,
      deliveryAddress: data.delivery_address,
      collectionAddress: data.collection_address,
      deliveryNotes: data.delivery_notes,
      collectionNotes: data.collection_notes,
      deliveryFeeCents: data.delivery_fee_cents,
      collectionFeeCents: data.collection_fee_cents,
      totalCents: getFulfillmentAmendmentTotal(data),
      currency: data.currency,
      isCustomQuote: data.is_custom_quote,
      quoteNotes: data.quote_notes,
      expiresAt: data.expires_at,
      paidAt: data.paid_at,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
