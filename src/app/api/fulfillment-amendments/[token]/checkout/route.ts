import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";
import { getFulfillmentAmendmentTotal } from "@/lib/fulfillment-amendments";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }
  if (!stripe) {
    return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
  }

  const supabase = createAdminClient();
  const { data: amendment, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select(`
      *,
      booking:bookings!inner (
        booking_ref,
        status,
        customer_email,
        product:products (name)
      )
    `)
    .eq("public_token", token)
    .maybeSingle();

  if (error || !amendment) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }
  if (amendment.status === "paid") {
    return NextResponse.json({ paid: true });
  }
  if (!["quoted", "checkout_created"].includes(amendment.status)) {
    return NextResponse.json({ error: "This transport quote is no longer payable" }, { status: 409 });
  }
  if (new Date(amendment.expires_at).getTime() <= Date.now()) {
    await supabase.from("booking_fulfillment_amendments").update({ status: "expired" }).eq("id", amendment.id);
    return NextResponse.json({ error: "This transport quote has expired" }, { status: 410 });
  }

  const booking = amendment.booking as unknown as {
    booking_ref: string;
    status: string;
    customer_email: string | null;
    product: { name: string } | null;
  };
  if (!["confirmed", "paid"].includes(booking.status)) {
    return NextResponse.json({ error: "This booking can no longer be changed online" }, { status: 409 });
  }

  if (amendment.stripe_checkout_session_id) {
    const existing = await stripe.checkout.sessions.retrieve(amendment.stripe_checkout_session_id);
    if (existing.status === "open" && existing.url) {
      return NextResponse.json({ checkoutUrl: existing.url, sessionId: existing.id });
    }
    if (existing.payment_status === "paid") {
      return NextResponse.json({ paid: true });
    }
  }

  const totalCents = getFulfillmentAmendmentTotal(amendment);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const requestOrigin = new URL(request.url).origin;
  const baseUrl = configuredSiteUrl || (process.env.NODE_ENV === "production" ? "https://rentanything.es" : requestOrigin);
  const productName = booking.product?.name || "Rental equipment";
  const serviceLabel = amendment.fulfillment_mode === "delivery_and_collection"
    ? "Delivery and collection service"
    : "Delivery service";
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: booking.customer_email || undefined,
      line_items: [
        {
          price_data: {
            currency: amendment.currency,
            unit_amount: totalCents,
            product_data: {
              name: serviceLabel,
              description: `${productName} · Booking ${booking.booking_ref}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        checkout_type: "fulfillment_amendment",
        fulfillment_amendment_id: amendment.id,
        booking_id: amendment.booking_id,
      },
      success_url: `${baseUrl}/booking/fulfillment/${token}?payment=success`,
      cancel_url: `${baseUrl}/booking/fulfillment/${token}?payment=cancelled`,
    },
    { idempotencyKey: `fulfillment-amendment-${amendment.id}` },
  );

  const { error: updateError } = await supabase
    .from("booking_fulfillment_amendments")
    .update({ status: "checkout_created", stripe_checkout_session_id: session.id })
    .eq("id", amendment.id)
    .in("status", ["quoted", "checkout_created"]);

  if (updateError) {
    console.error("[fulfillment-amendments] Failed to save checkout session", updateError);
    return NextResponse.json({ error: "Could not save the payment session" }, { status: 500 });
  }

  return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
}
