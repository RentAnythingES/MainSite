import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingConfirmation, sendFulfillmentAmendmentConfirmation } from "@/lib/email";
import { fetchPickupLocationsById, fetchServiceZonesById } from "@/lib/fulfillment-options";
import { recordBookingPaymentEvent } from "@/lib/payment-ledger";
import { createBookingDocumentForPaymentEvent, getCustomerDocumentUrl } from "@/lib/booking-documents";
import { getIncidentErrorMessage, recordSystemIncident } from "@/lib/system-incidents";
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
    await recordSystemIncident({
      source: "stripe_webhook",
      eventType: "webhook_not_configured",
      severity: "critical",
      message: "Stripe webhook received an event without a configured signing secret.",
    });
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
          await recordSystemIncident({
            source: "stripe_webhook",
            eventType: "checkout_fulfillment_failed",
            severity: "critical",
            message: "A completed Stripe Checkout session could not be fulfilled.",
            context: { eventId: event.id, sessionId: session.id },
          });
          return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
        }
        break;
      }
      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[webhook] Unhandled webhook processing error:", err);
    await recordSystemIncident({
      source: "stripe_webhook",
      eventType: "webhook_processing_failed",
      severity: "critical",
      message: getIncidentErrorMessage(err),
      context: { eventId: event.id, eventType: event.type },
    });
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
  if (meta?.checkout_type === "fulfillment_amendment" && meta.fulfillment_amendment_id) {
    return handleFulfillmentAmendmentCheckoutCompleted(session, meta.fulfillment_amendment_id);
  }
  if (meta?.booking_draft_id) {
    return handleDraftCheckoutCompleted(session, meta.booking_draft_id);
  }

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
      quantity: parseInt(meta.quantity || "1"),
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

  const paymentEvent = await recordBookingPaymentEvent(supabase, {
    bookingId: (booking as { id: string }).id,
    eventType: "payment",
    status: "succeeded",
    currency: session.currency || "eur",
    amountCents: session.amount_total || parseInt(meta.total_cents || "0"),
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || null,
    providerEventId: `checkout_session:${session.id}:payment`,
    description: "Stripe Checkout payment completed",
    metadata: {
      source: "legacy_checkout_webhook",
      payment_status: session.payment_status,
    },
  });
  const invoiceDocument = await createBookingDocumentForPaymentEvent(supabase, {
    booking: booking as Record<string, unknown>,
    paymentEvent,
    productName: meta.product_name || "Rental equipment",
  });
  const invoiceUrl = getCustomerDocumentUrl(invoiceDocument);

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
    quantity: parseInt(meta.quantity || "1"),
    startDate: meta.start_date,
    endDate: meta.end_date,
    rentalDays: parseInt(meta.rental_days || "1"),
    totalCents: parseInt(meta.total_cents || "0"),
    deliveryAddress: meta.delivery_address || "",
    deliveryType: meta.delivery_type || "standard",
    documentLinks: invoiceUrl
      ? [{ label: "Download invoice", url: invoiceUrl, documentNumber: invoiceDocument?.document_number }]
      : undefined,
  });

  return true;
}

async function handleFulfillmentAmendmentCheckoutCompleted(
  session: Stripe.Checkout.Session,
  amendmentId: string,
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: amendment, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select(`
      *,
      booking:bookings!inner (*, product:products(name))
    `)
    .eq("id", amendmentId)
    .maybeSingle();

  if (error || !amendment) {
    console.error("[webhook] Fulfillment amendment not found", { amendmentId, error });
    return false;
  }

  const expectedTotal = amendment.delivery_fee_cents + amendment.collection_fee_cents;
  if (session.payment_status !== "paid" || session.amount_total !== expectedTotal) {
    console.error("[webhook] Fulfillment amendment payment mismatch", {
      amendmentId,
      paymentStatus: session.payment_status,
      expectedTotal,
      receivedTotal: session.amount_total,
    });
    return false;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
  const booking = amendment.booking as unknown as Record<string, unknown> & {
    id: string;
    product?: { name?: string } | null;
  };
  const paidAt = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString();
  const providerEventId = `checkout_session:${session.id}:fulfillment_amendment`;
  const paymentEvent = await recordBookingPaymentEvent(supabase, {
    bookingId: booking.id,
    eventType: "manual_adjustment",
    status: "succeeded",
    provider: "stripe",
    currency: session.currency || amendment.currency,
    amountCents: expectedTotal,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    providerEventId,
    description: amendment.fulfillment_mode === "delivery_and_collection"
      ? "Post-booking delivery and collection service"
      : "Post-booking delivery service",
    metadata: {
      document_scope: "fulfillment_amendment",
      fulfillment_amendment_id: amendment.id,
      delivery_fee_cents: amendment.delivery_fee_cents,
      collection_fee_cents: amendment.collection_fee_cents,
      is_custom_quote: amendment.is_custom_quote,
    },
    occurredAt: paidAt,
  });

  if (!paymentEvent) {
    console.error("[webhook] Fulfillment amendment ledger event could not be persisted", { amendmentId });
    return false;
  }

  const { data: appliedNow, error: applyError } = await supabase.rpc("apply_paid_fulfillment_amendment", {
    p_amendment_id: amendment.id,
    p_checkout_session_id: session.id,
    p_payment_intent_id: paymentIntentId,
    p_paid_at: paidAt,
  });
  if (applyError) {
    console.error("[webhook] Fulfillment amendment could not be applied", applyError);
    return false;
  }

  const { data: updatedBooking, error: updatedBookingError } = await supabase
    .from("bookings")
    .select("*, product:products(name)")
    .eq("id", booking.id)
    .single();
  if (updatedBookingError || !updatedBooking) {
    console.error("[webhook] Updated booking could not be loaded", updatedBookingError);
    return false;
  }

  const invoiceDocument = await createBookingDocumentForPaymentEvent(supabase, {
    booking: updatedBooking as unknown as Record<string, unknown>,
    paymentEvent,
    productName: (updatedBooking.product as unknown as { name?: string } | null)?.name || booking.product?.name || null,
  });

  if (appliedNow === true) {
    await sendFulfillmentAmendmentConfirmation({
      customerName: updatedBooking.customer_name,
      customerEmail: updatedBooking.customer_email,
      bookingRef: updatedBooking.booking_ref,
      productName:
        (updatedBooking.product as unknown as { name?: string } | null)?.name ||
        booking.product?.name ||
        "Rental equipment",
      serviceLabel:
        amendment.fulfillment_mode === "delivery_and_collection"
          ? "Delivery and collection"
          : "Delivery only",
      deliveryAddress: amendment.delivery_address,
      collectionAddress: amendment.collection_address,
      totalCents: expectedTotal,
      customerUrl: `https://rentanything.es/booking/fulfillment/${amendment.public_token}`,
      documentUrl: getCustomerDocumentUrl(invoiceDocument),
    });
  }

  return true;
}

async function handleDraftCheckoutCompleted(
  session: Stripe.Checkout.Session,
  bookingDraftId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  const { data: existingBooking, error: existingBookingError } = await supabase
    .from("bookings")
    .select("id")
    .or(`booking_draft_id.eq.${bookingDraftId},stripe_checkout_session_id.eq.${session.id}`)
    .maybeSingle();

  if (existingBookingError) {
    console.error("[webhook] Failed to check draft booking idempotency:", existingBookingError);
    return false;
  }

  if (existingBooking) {
    return true;
  }

  const { data: draft, error: draftError } = await supabase
    .from("booking_drafts")
    .select("*")
    .eq("id", bookingDraftId)
    .single();

  if (draftError || !draft) {
    console.error("[webhook] Booking draft not found:", bookingDraftId, draftError);
    return false;
  }

  const bookingDraft = draft as {
    id: string;
    product_id: string;
    quantity: number;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    rental_start_at: string;
    rental_end_at: string;
    timezone: string;
    rental_days: number;
    fulfillment_mode: "customer_pickup" | "delivery_only" | "delivery_and_collection";
    delivery_type: "standard" | "express";
    pickup_location_id: string | null;
    delivery_zone_id: string | null;
    collection_zone_id: string | null;
    delivery_address: string | null;
    collection_address: string | null;
    delivery_notes: string | null;
    collection_notes: string | null;
    billing_name?: string | null;
    billing_company_name?: string | null;
    billing_tax_id?: string | null;
    billing_address?: Record<string, string> | null;
    invoice_requested?: boolean;
    per_day_cents: number;
    rental_subtotal_cents: number;
    delivery_fee_cents: number;
    collection_fee_cents: number;
    total_cents: number;
    deposit_cents: number;
    pricing_snapshot: Record<string, unknown>;
  };

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", bookingDraft.product_id)
    .single();

  const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
    bookingDraft.pickup_location_id
      ? fetchPickupLocationsById(supabase, [bookingDraft.pickup_location_id])
      : Promise.resolve({ data: [], error: null }),
    bookingDraft.delivery_zone_id || bookingDraft.collection_zone_id
      ? fetchServiceZonesById(
          supabase,
          [bookingDraft.delivery_zone_id, bookingDraft.collection_zone_id].filter(Boolean) as string[]
        )
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (pickupLocationsResult.error) {
    console.error("[webhook] Failed to load pickup fulfillment instructions:", pickupLocationsResult.error);
  }

  if (serviceZonesResult.error) {
    console.error("[webhook] Failed to load service zone fulfillment instructions:", serviceZonesResult.error);
  }

  const pickupLocation = (pickupLocationsResult.data || [])[0] as {
    name?: string;
    customer_instructions?: string | null;
    pickup_instructions?: string | null;
    internal_notes?: string | null;
    lead_time_hours?: number | null;
  } | undefined;
  const serviceZones = (serviceZonesResult.data || []) as Array<{
    id?: string;
    name?: string;
    customer_instructions?: string | null;
    internal_notes?: string | null;
    lead_time_hours?: number | null;
    delivery_window?: string | null;
    collection_window?: string | null;
  }>;
  const deliveryZone = serviceZones.find((zone) => zone.id === bookingDraft.delivery_zone_id);
  const collectionZone = serviceZones.find((zone) => zone.id === bookingDraft.collection_zone_id);
  const customerInstructions =
    pickupLocation?.customer_instructions ||
    pickupLocation?.pickup_instructions ||
    deliveryZone?.customer_instructions ||
    collectionZone?.customer_instructions ||
    null;
  const internalNotes =
    pickupLocation?.internal_notes ||
    deliveryZone?.internal_notes ||
    collectionZone?.internal_notes ||
    null;
  const fulfillmentDisplayLabel =
    pickupLocation?.name ||
    (bookingDraft.fulfillment_mode === "delivery_and_collection"
      ? [deliveryZone?.name, collectionZone?.name].filter(Boolean).join(" → ")
      : deliveryZone?.name) ||
    undefined;

  const startDate = bookingDraft.rental_start_at.slice(0, 10);
  const endDate = bookingDraft.rental_end_at.slice(0, 10);

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      product_id: bookingDraft.product_id,
      quantity: bookingDraft.quantity,
      customer_name: bookingDraft.customer_name || session.customer_details?.name || "Customer",
      customer_email: bookingDraft.customer_email || session.customer_email || "",
      customer_phone: bookingDraft.customer_phone,
      customer_whatsapp: bookingDraft.customer_phone,
      start_date: startDate,
      end_date: endDate,
      rental_days: bookingDraft.rental_days,
      per_day_cents: bookingDraft.per_day_cents,
      subtotal_cents: bookingDraft.rental_subtotal_cents,
      delivery_fee_cents: bookingDraft.delivery_fee_cents,
      total_cents: bookingDraft.total_cents,
      deposit_cents: bookingDraft.deposit_cents,
      delivery_type: bookingDraft.delivery_type,
      delivery_address: bookingDraft.delivery_address || bookingDraft.collection_address || "Customer pickup",
      delivery_city: "valencia",
      delivery_notes: bookingDraft.delivery_notes,
      billing_name: bookingDraft.billing_name || bookingDraft.customer_name,
      billing_company_name: bookingDraft.billing_company_name || null,
      billing_tax_id: bookingDraft.billing_tax_id || null,
      billing_address: bookingDraft.billing_address || {},
      invoice_requested: Boolean(bookingDraft.invoice_requested),
      status: "paid",
      stripe_payment_intent_id: paymentIntentId || null,
      paid_at: new Date().toISOString(),
      booking_draft_id: bookingDraft.id,
      rental_start_at: bookingDraft.rental_start_at,
      rental_end_at: bookingDraft.rental_end_at,
      timezone: bookingDraft.timezone,
      fulfillment_mode: bookingDraft.fulfillment_mode,
      pickup_location_id: bookingDraft.pickup_location_id,
      delivery_zone_id: bookingDraft.delivery_zone_id,
      collection_zone_id: bookingDraft.collection_zone_id,
      collection_address: bookingDraft.collection_address,
      collection_notes: bookingDraft.collection_notes,
      collection_fee_cents: bookingDraft.collection_fee_cents,
      pricing_snapshot: bookingDraft.pricing_snapshot,
      stripe_checkout_session_id: session.id,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error("[webhook] Failed to create booking from draft:", bookingError);
    return false;
  }

  const bookingId = (booking as { id: string }).id;

  const paymentEvent = await recordBookingPaymentEvent(supabase, {
    bookingId,
    bookingDraftId: bookingDraft.id,
    eventType: "payment",
    status: "succeeded",
    currency: session.currency || "eur",
    amountCents: session.amount_total || bookingDraft.total_cents,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || null,
    providerEventId: `checkout_session:${session.id}:payment`,
    description: "Stripe Checkout payment completed",
    metadata: {
      source: "booking_draft_webhook",
      payment_status: session.payment_status,
    },
  });
  const invoiceDocument = await createBookingDocumentForPaymentEvent(supabase, {
    booking: booking as Record<string, unknown>,
    paymentEvent,
    productName: (product as { name?: string } | null)?.name || "Rental equipment",
  });
  const invoiceUrl = getCustomerDocumentUrl(invoiceDocument);

  await supabase
    .from("booking_inventory_blocks")
    .update({ booking_id: bookingId, reason: "booking" })
    .eq("booking_draft_id", bookingDraft.id);

  await supabase
    .from("booking_drafts")
    .update({
      status: "paid",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId || null,
    })
    .eq("id", bookingDraft.id);

  await sendBookingConfirmation({
    bookingRef: (booking as { booking_ref: string }).booking_ref,
    customerName: bookingDraft.customer_name || session.customer_details?.name || "Customer",
    customerEmail: bookingDraft.customer_email || session.customer_email || "",
    customerPhone: bookingDraft.customer_phone || undefined,
    productName: (product as { name?: string } | null)?.name || "Rental equipment",
    quantity: bookingDraft.quantity,
    startDate,
    endDate,
    rentalDays: bookingDraft.rental_days,
    totalCents: bookingDraft.total_cents,
    deliveryAddress: bookingDraft.delivery_address || bookingDraft.collection_address || "Customer pickup",
    deliveryType: "standard",
    fulfillmentMode: bookingDraft.fulfillment_mode,
    fulfillmentLabel: fulfillmentDisplayLabel,
    customerInstructions,
    internalNotes,
    deliveryWindow: deliveryZone?.delivery_window || null,
    collectionWindow: collectionZone?.collection_window || null,
    leadTimeHours: pickupLocation?.lead_time_hours || deliveryZone?.lead_time_hours || collectionZone?.lead_time_hours || null,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || null,
    documentLinks: invoiceUrl
      ? [{ label: "Download invoice", url: invoiceUrl, documentNumber: invoiceDocument?.document_number }]
      : undefined,
  });

  return true;
}
