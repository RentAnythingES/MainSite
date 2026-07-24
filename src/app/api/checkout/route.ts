import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { cleanupExpiredBookingDrafts } from "@/lib/booking-v2";
import type { BookingDraft } from "@/lib/types";
import { getIncidentErrorMessage, recordSystemIncident } from "@/lib/system-incidents";
import type Stripe from "stripe";

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
    await recordSystemIncident({
      source: "checkout",
      eventType: "stripe_not_configured",
      severity: "critical",
      message: "Checkout was requested while Stripe configuration was unavailable.",
    });
    return NextResponse.json(
      { error: "Payment processing is not configured. Please contact us to complete your booking." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const { draftId, locale } = body;

    if (typeof draftId !== "string" || !draftId.trim()) {
      return NextResponse.json(
        { error: "This checkout method is no longer available. Please restart your booking." },
        { status: 410 },
      );
    }

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
        if (existingSession.status !== "open" || !existingSession.url) {
          return NextResponse.json({ error: "Booking checkout is no longer active" }, { status: 409 });
        }
        return NextResponse.json({
          checkoutUrl: existingSession.url,
          sessionId: existingSession.id,
          expiresAt: new Date(existingSession.expires_at * 1000).toISOString(),
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

      const checkoutExpiresAt = Math.floor(Date.now() / 1000) + 31 * 60;
      const cancelParams = new URLSearchParams({
        draft_id: bookingDraft.id,
        slug: resolvedProduct.slug,
        locale: locale === "es" ? "es" : "en",
      });
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          expires_at: checkoutExpiresAt,
          customer_email: bookingDraft.customer_email || undefined,
          line_items: [
            {
              price_data: {
                currency: bookingDraft.currency,
                unit_amount_decimal: (bookingDraft.rental_subtotal_cents / bookingDraft.quantity).toFixed(6) as unknown as Stripe.Decimal,
                product_data: {
                  name: `${resolvedProduct.name} rental`,
                  description: `${formattedStart} to ${formattedEnd}`,
                },
              },
              quantity: bookingDraft.quantity,
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
            quantity: String(bookingDraft.quantity),
          },
          success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/booking/cancel?${cancelParams.toString()}`,
        },
        { idempotencyKey: `booking-draft-${bookingDraft.id}` }
      );

      const { error: checkoutStateError } = await supabase
        .from("booking_drafts")
        .update({
          status: "checkout_created",
          stripe_checkout_session_id: session.id,
          expires_at: new Date(session.expires_at * 1000).toISOString(),
        })
        .eq("id", bookingDraft.id);

      if (checkoutStateError) {
        if (session.status === "open") {
          await stripe.checkout.sessions.expire(session.id);
        }
        await supabase
          .from("booking_drafts")
          .update({ status: "cancelled" })
          .eq("id", bookingDraft.id);
        await supabase
          .from("booking_inventory_blocks")
          .delete()
          .eq("booking_draft_id", bookingDraft.id)
          .is("booking_id", null);
        await recordSystemIncident({
          source: "checkout",
          eventType: "checkout_session_state_persistence_failed",
          severity: "critical",
          message: checkoutStateError.message,
          context: { draftId: bookingDraft.id, sessionId: session.id },
        });
        return NextResponse.json(
          { error: "Payment could not be started. Your dates have been released." },
          { status: 500 },
        );
      }

      return NextResponse.json({
        checkoutUrl: session.url,
        sessionId: session.id,
        expiresAt: new Date(session.expires_at * 1000).toISOString(),
      });
    }

  } catch (err) {
    console.error("[checkout] Error creating session:", err);
    await recordSystemIncident({
      source: "checkout",
      eventType: "checkout_session_creation_failed",
      message: getIncidentErrorMessage(err),
    });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
