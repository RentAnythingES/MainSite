import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

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
      productId,
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

    // Validate required fields
    if (!productId || !customerName || !customerEmail || !startDate || !endDate || !deliveryAddress || !totalCents) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify availability before creating checkout session
    const supabase = createServiceClient();
    const { data: blocked } = await supabase
      .from("blocked_dates")
      .select("blocked_date")
      .eq("product_id", productId)
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "https://rentanything.es";

    // Create Stripe Checkout Session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: subtotalCents,
            product_data: {
              name: `${productName} — ${rentalDays} day${rentalDays > 1 ? "s" : ""} rental`,
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

      // Store ALL booking data in metadata so the webhook can create the booking
      metadata: {
        product_id: productId,
        product_slug: productSlug || "",
        product_name: productName || "",
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
      cancel_url: `${baseUrl}/product/${productSlug || ""}`,
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
