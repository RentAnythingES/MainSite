import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { cleanupExpiredBookingDrafts } from "@/lib/booking-v2";
import type { BookingDraft, CustomQuoteLineItem } from "@/lib/types";
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "https://rentandroll.com";

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
      let customQuoteToken: string | null = null;
      const customLines = Array.isArray(bookingDraft.custom_line_items)
        ? bookingDraft.custom_line_items as CustomQuoteLineItem[]
        : [];

      if (bookingDraft.custom_quote_id) {
        const { data: customQuote, error: customQuoteError } = await supabase
          .from("booking_custom_quotes")
          .select("public_token, status, expires_at, total_cents")
          .eq("id", bookingDraft.custom_quote_id)
          .single();
        if (
          customQuoteError
          || !customQuote
          || !["open", "checkout_created"].includes(customQuote.status)
          || new Date(customQuote.expires_at).getTime() <= Date.now()
          || customQuote.total_cents !== bookingDraft.total_cents
        ) {
          return NextResponse.json({ error: "This custom quote is no longer payable" }, { status: 409 });
        }
        const customTotal = customLines.reduce((total, line) => total + line.amountCents, 0);
        if (customLines.length === 0 || customTotal !== bookingDraft.total_cents) {
          return NextResponse.json({ error: "This custom quote has an invalid price snapshot" }, { status: 409 });
        }
        customQuoteToken = customQuote.public_token;
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

      const checkoutExpiresAt = Math.floor(Date.now() / 1000) + 31 * 60;
      const cancelParams = new URLSearchParams({
        draft_id: bookingDraft.id,
        slug: resolvedProduct.slug,
        locale: locale === "es" ? "es" : "en",
      });
      if (customQuoteToken) cancelParams.set("quote_token", customQuoteToken);
      const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = customQuoteToken
        ? customLines.map((line, index) => ({
            price_data: {
              currency: bookingDraft.currency,
              unit_amount: line.amountCents,
              product_data: {
                name: line.description,
                description: index === 0 ? `${formattedStart} to ${formattedEnd}` : undefined,
              },
            },
            quantity: 1,
          }))
        : [
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
              ? [{
                  price_data: {
                    currency: bookingDraft.currency,
                    unit_amount: bookingDraft.delivery_fee_cents + bookingDraft.collection_fee_cents,
                    product_data: { name: "Delivery and collection" },
                  },
                  quantity: 1,
                }]
              : []),
          ];
      const requestFingerprint = `${bookingDraft.id}:${bookingDraft.total_cents}:${bookingDraft.quantity}:${checkoutExpiresAt}:${stripeLineItems.length}:${stripeLineItems.map((item) => `${item.price_data?.currency}:${item.price_data?.unit_amount ?? item.price_data?.unit_amount_decimal ?? 0}`).join('|')}`;
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          expires_at: checkoutExpiresAt,
          customer_email: bookingDraft.customer_email || undefined,
          line_items: stripeLineItems,
          metadata: {
            booking_draft_id: bookingDraft.id,
            product_id: bookingDraft.product_id,
            quantity: String(bookingDraft.quantity),
          },
          success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/booking/cancel?${cancelParams.toString()}`,
        },
        { idempotencyKey: `booking-draft-${bookingDraft.id}-${requestFingerprint}` }
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

      if (bookingDraft.custom_quote_id) {
        const { error: quoteStateError } = await supabase
          .from("booking_custom_quotes")
          .update({
            status: "checkout_created",
            checkout_created_at: new Date().toISOString(),
          })
          .eq("id", bookingDraft.custom_quote_id)
          .in("status", ["open", "checkout_created"]);
        if (quoteStateError) {
          await recordSystemIncident({
            source: "checkout",
            eventType: "custom_quote_checkout_state_persistence_failed",
            severity: "warning",
            message: quoteStateError.message,
            context: { draftId: bookingDraft.id, customQuoteId: bookingDraft.custom_quote_id },
          });
        }
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
