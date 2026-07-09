import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { areOnlineBookingsPaused } from "@/lib/booking-mode";
import { cleanupExpiredBookingDrafts } from "@/lib/booking-v2";
import type { BookingDraft } from "@/lib/types";

const STRIPE_TEST_PRODUCT_SLUG = "stripe-test-rental";

function pausedCheckoutResponse() {
  return NextResponse.json(
    { error: "Online bookings are temporarily paused. Please contact us to confirm availability." },
    { status: 503 }
  );
}

/**
 * POST /api/checkout — Create a Stripe Checkout Session
 *
 * Receives the same booking data as /api/bookings, but instead of
 * creating the booking immediately, creates a Stripe Checkout Session.
 * The booking is created in the webhook handler after payment succeeds.
 *
 * Flow:
 *   1. Validate inputs
 *   2. Verify product exists and dates are available
 *   3. Create Stripe Checkout Session with dynamic line item
 *   4. Return the checkout URL for redirect
 */
export async function POST(request: NextRequest) {
  // Check Stripe is configured
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Payment processing is not configured. Please contact us to complete your booking." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const {
      draftId,
      productSlug,
      productName,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      rentalDays,
      perDayCents,
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      deliveryType,
      deliveryAddress,
      deliveryCity,
      deliveryNotes,
    } = body;

    const supabase = createServiceClient();
    await cleanupExpiredBookingDrafts(supabase);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "https://rentanything.es";

    if (draftId) {
      const { data: draft, error: draftError } = await supabase
        .from("booking_drafts")
        .select("*")
        .eq("id", draftId)
        .in("status", ["draft", "checkout_created"])
        .single();

      if (draftError || !draft) {
        return NextResponse.json({ error: "Booking draft not found" }, { status: 404 });
      }

      const bookingDraft = draft as BookingDraft;

      if (new Date(bookingDraft.expires_at).getTime() <= Date.now()) {
        await supabase.from("booking_drafts").update({ status: "expired" }).eq("id", bookingDraft.id);
        return NextResponse.json({ error: "Booking draft expired" }, { status: 409 });
      }

      if (bookingDraft.stripe_checkout_session_id) {
        const existingSession = await stripe.checkout.sessions.retrieve(bookingDraft.stripe_checkout_session_id);
        return NextResponse.json({
          checkoutUrl: existingSession.url,
          sessionId: existingSession.id,
        });
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("slug, name")
        .eq("id", bookingDraft.product_id)
        .single();

      if (productError || !product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const resolvedProduct = product as { slug: string; name: string };

      if (areOnlineBookingsPaused() && resolvedProduct.slug !== STRIPE_TEST_PRODUCT_SLUG) {
        return pausedCheckoutResponse();
      }

      const formattedStart = new Date(bookingDraft.rental_start_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: bookingDraft.timezone,
      });
      const formattedEnd = new Date(bookingDraft.rental_end_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: bookingDraft.timezone,
      });

      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          customer_email: bookingDraft.customer_email || undefined,
          line_items: [
            {
              price_data: {
                currency: bookingDraft.currency,
                unit_amount: bookingDraft.rental_subtotal_cents,
                product_data: {
                  name: `${resolvedProduct.name} rental`,
                  description: `${formattedStart} to ${formattedEnd}`,
                },
              },
              quantity: 1,
            },
            ...(bookingDraft.delivery_fee_cents + bookingDraft.collection_fee_cents > 0
              ? [
                  {
                    price_data: {
                      currency: bookingDraft.currency,
                      unit_amount: bookingDraft.delivery_fee_cents + bookingDraft.collection_fee_cents,
                      product_data: {
                        name: "Delivery and collection",
                      },
                    },
                    quantity: 1,
                  },
                ]
              : []),
          ],
          metadata: {
            booking_draft_id: bookingDraft.id,
            product_id: bookingDraft.product_id,
          },
          success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/product/${resolvedProduct.slug}`,
        },
        { idempotencyKey: `booking-draft-${bookingDraft.id}` }
      );

      await supabase
        .from("booking_drafts")
        .update({
          status: "checkout_created",
          stripe_checkout_session_id: session.id,
        })
        .eq("id", bookingDraft.id);

      return NextResponse.json({
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    }

    // Validate required fields
    if (!productSlug || !customerName || !customerEmail || !startDate || !endDate || !deliveryAddress || !totalCents) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve product server-side; never trust client-submitted product IDs.
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, slug, name, stock_available")
      .eq("slug", productSlug)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const resolvedProduct = product as {
      id: string;
      slug: string;
      name: string;
      stock_available: number;
    };

    if (areOnlineBookingsPaused() && resolvedProduct.slug !== STRIPE_TEST_PRODUCT_SLUG) {
      return pausedCheckoutResponse();
    }

    if (resolvedProduct.stock_available <= 0) {
      return NextResponse.json(
        { error: "Product not available for selected dates" },
        { status: 409 }
      );
    }

    // Verify availability before creating checkout session
    const { data: blocked } = await supabase
      .from("blocked_dates")
      .select("blocked_date")
      .eq("product_id", resolvedProduct.id)
      .gte("blocked_date", startDate)
      .lte("blocked_date", endDate);

    if (blocked && blocked.length > 0) {
      return NextResponse.json(
        { error: "Product not available for selected dates", blockedDates: blocked },
        { status: 409 }
      );
    }

    // Build a human-readable description for the Stripe line item
    const formattedStart = new Date(startDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    const formattedEnd = new Date(endDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

    // Create Stripe Checkout Session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Enable all payment methods configured in Stripe Dashboard
      // (card, Apple Pay, Google Pay, etc.)
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: subtotalCents,
            product_data: {
              name: `${resolvedProduct.name} — ${rentalDays} day${rentalDays > 1 ? "s" : ""} rental`,
              description: `${formattedStart} → ${formattedEnd} · Delivered to ${deliveryCity || "Valencia"}`,
            },
          },
          quantity: 1,
        },
        // Add delivery fee as a separate line item (if applicable)
        ...(deliveryFeeCents > 0
          ? [
              {
                price_data: {
                  currency: "eur",
                  unit_amount: deliveryFeeCents,
                  product_data: {
                    name: `Delivery (${deliveryType === "express" ? "Express" : "Standard"})`,
                    description: `Delivery to ${deliveryAddress}`,
                  },
                },
                quantity: 1,
              },
            ]
          : []),
      ],

      // Legacy bridge metadata. Booking v2 should replace this with booking_draft_id only.
      metadata: {
        product_id: resolvedProduct.id,
        product_slug: resolvedProduct.slug,
        product_name: productName || resolvedProduct.name,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || "",
        start_date: startDate,
        end_date: endDate,
        rental_days: String(rentalDays),
        per_day_cents: String(perDayCents),
        subtotal_cents: String(subtotalCents),
        delivery_fee_cents: String(deliveryFeeCents || 0),
        total_cents: String(totalCents),
        delivery_type: deliveryType || "standard",
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity || "valencia",
        delivery_notes: deliveryNotes || "",
      },

      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${resolvedProduct.slug}`,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("[checkout] Error creating session:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
