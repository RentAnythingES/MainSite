import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingConfirmation } from "@/lib/email";
import Stripe from "stripe";

/**
 * POST /api/webhooks/stripe — Handle Stripe webhook events
 *
 * Primary event: checkout.session.completed
 * When a customer completes payment, this handler:
 *   1. Verifies the webhook signature
 *   2. Extracts booking data from session metadata
 *   3. Creates the booking in Supabase (status: "paid")
 *   4. Blocks the rental dates
 *
 * Setup:
 *   1. In Stripe Dashboard → Developers → Webhooks
 *   2. Add endpoint: https://rentanything.es/api/webhooks/stripe
 *   3. Select event: checkout.session.completed
 *   4. Copy signing secret → set as STRIPE_WEBHOOK_SECRET in env
 */

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    const webhookStripe = stripe || new Stripe("sk_webhook_verification_only", {
      typescript: true,
    });
    event = webhookStripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const fulfilled = await handleCheckoutCompleted(session);
        if (!fulfilled) {
          return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
        }
        break;
      }
      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[webhook] Unhandled webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}

/**
 * Handle a completed checkout session — create the booking
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<boolean> {
  const meta = session.metadata;
  if (!meta?.product_id || !meta?.customer_name) {
    console.error("[webhook] Missing metadata in checkout session:", session.id);
    return true;
  }

  const supabase = createAdminClient();
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  // Check if booking already exists for this session (idempotency)
  if (paymentIntentId) {
    const { data: existing, error: existingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();

    if (existingError) {
      console.error("[webhook] Failed to check existing booking:", existingError);
      return false;
    }

    if (existing) {
      console.log("[webhook] Booking already exists for session:", session.id);
      return true;
    }
  }

  // Create the booking with status "paid" (payment already confirmed)
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      product_id: meta.product_id,
      customer_name: meta.customer_name,
      customer_email: meta.customer_email || session.customer_email || "",
      customer_phone: meta.customer_phone || null,
      customer_whatsapp: meta.customer_phone || null,
      start_date: meta.start_date,
      end_date: meta.end_date,
      rental_days: parseInt(meta.rental_days || "1"),
      per_day_cents: parseInt(meta.per_day_cents || "0"),
      subtotal_cents: parseInt(meta.subtotal_cents || "0"),
      delivery_fee_cents: parseInt(meta.delivery_fee_cents || "0"),
      total_cents: parseInt(meta.total_cents || "0"),
      delivery_type: (meta.delivery_type as "standard" | "express") || "standard",
      delivery_address: meta.delivery_address || "",
      delivery_city: meta.delivery_city || "valencia",
      delivery_notes: meta.delivery_notes || null,
      status: "paid",
      stripe_payment_intent_id: paymentIntentId || null,
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("[webhook] Failed to create booking:", error);
    return false;
  }

  console.log("[webhook] Booking created:", (booking as { booking_ref: string }).booking_ref);

  // Block the rental dates
  const dates: string[] = [];
  const current = new Date(meta.start_date);
  const end = new Date(meta.end_date);
  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  if (dates.length > 0) {
    const { error: blockError } = await supabase.from("blocked_dates").insert(
      dates.map((d) => ({
        product_id: meta.product_id,
        blocked_date: d,
        reason: "booking",
        booking_id: (booking as { id: string }).id,
      }))
    );

    if (blockError) {
      console.error("[webhook] Failed to block dates:", blockError);
    }
  }

  // Send confirmation email (customer + admin)
  await sendBookingConfirmation({
    bookingRef: (booking as { booking_ref: string }).booking_ref,
    customerName: meta.customer_name,
    customerEmail: meta.customer_email || session.customer_email || "",
    customerPhone: meta.customer_phone || undefined,
    productName: meta.product_name || "Rental equipment",
    startDate: meta.start_date,
    endDate: meta.end_date,
    rentalDays: parseInt(meta.rental_days || "1"),
    totalCents: parseInt(meta.total_cents || "0"),
    deliveryAddress: meta.delivery_address || "",
    deliveryType: meta.delivery_type || "standard",
  });

  return true;
}
