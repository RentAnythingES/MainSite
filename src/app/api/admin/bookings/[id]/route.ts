import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { sendBookingStatusUpdate } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { fetchPickupLocationsById, fetchServiceZonesById } from "@/lib/fulfillment-options";
import { recordBookingPaymentEvent } from "@/lib/payment-ledger";
import { createBookingDocumentForPaymentEvent, getCustomerDocumentUrl } from "@/lib/booking-documents";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["paid", "cancelled"],
  paid: ["delivering", "cancelled", "refunded"],
  delivering: ["active"],
  active: ["returning"],
  returning: ["completed"],
  completed: [],
  cancelled: [],
  refunded: [],
};

/**
 * PUT /api/admin/bookings/[id] — Update booking status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const { status } = await request.json();
    const supabase = createAdminClient();

    // Get current booking (with product info for email)
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        product:products (name)
      `)
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const currentStatus = (booking as { status: string }).status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // Build update
    const updates: Record<string, unknown> = { status };
    if (status === "cancelled") updates.cancelled_at = new Date().toISOString();
    if (status === "completed") updates.completed_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    let documentLinks:
      | Array<{ label: string; url: string; documentNumber?: string | null }>
      | undefined;

    // If cancelled/refunded/completed, release inventory blocks.
    if (status === "cancelled" || status === "refunded" || status === "completed") {
      await supabase
        .from("blocked_dates")
        .delete()
        .eq("booking_id", id);

      await supabase
        .from("booking_inventory_blocks")
        .delete()
        .eq("booking_id", id);
    }

    // If cancelled/refunded, issue Stripe refund when payment was collected.
    if (status === "cancelled" || status === "refunded") {
      // Issue Stripe refund if payment was collected
      const paymentIntentId = (booking as Record<string, unknown>).stripe_payment_intent_id as string | null;
      if (paymentIntentId && stripe) {
        try {
          const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
          const paymentEvent = await recordBookingPaymentEvent(supabase, {
            bookingId: id,
            bookingDraftId: (booking as Record<string, unknown>).booking_draft_id as string | null,
            eventType: "refund",
            status: refund.status === "failed" || refund.status === "canceled" ? "failed" : "succeeded",
            currency: refund.currency || "eur",
            amountCents: refund.amount,
            stripeCheckoutSessionId: (booking as Record<string, unknown>).stripe_checkout_session_id as string | null,
            stripePaymentIntentId: paymentIntentId,
            stripeRefundId: refund.id,
            stripeChargeId: typeof refund.charge === "string" ? refund.charge : refund.charge?.id || null,
            providerEventId: `refund:${refund.id}`,
            description: status === "cancelled" ? "Stripe refund issued after cancellation" : "Stripe refund issued",
            metadata: {
              booking_status: status,
              refund_status: refund.status,
            },
            occurredAt: refund.created ? new Date(refund.created * 1000).toISOString() : null,
          });
          const refundDocument = await createBookingDocumentForPaymentEvent(supabase, {
            booking: booking as Record<string, unknown>,
            paymentEvent,
            productName: ((booking as Record<string, unknown>).product as { name?: string } | null)?.name || "Rental equipment",
          });
          const refundUrl = getCustomerDocumentUrl(refundDocument);
          if (refundUrl) {
            documentLinks = [
              {
                label: "Download refund receipt",
                url: refundUrl,
                documentNumber: refundDocument?.document_number,
              },
            ];
          }
          console.log(`[admin/bookings] Stripe refund issued for ${paymentIntentId}`);
        } catch (refundErr) {
          // Log but don't block — refund may already exist or payment may not be refundable
          console.error(`[admin/bookings] Stripe refund failed for ${paymentIntentId}:`, refundErr);
          await recordBookingPaymentEvent(supabase, {
            bookingId: id,
            bookingDraftId: (booking as Record<string, unknown>).booking_draft_id as string | null,
            eventType: "refund",
            status: "failed",
            currency: "eur",
            amountCents: (booking as Record<string, unknown>).total_cents as number,
            stripeCheckoutSessionId: (booking as Record<string, unknown>).stripe_checkout_session_id as string | null,
            stripePaymentIntentId: paymentIntentId,
            providerEventId: `refund_failed:${paymentIntentId}:${Date.now()}`,
            description: "Stripe refund attempt failed",
            metadata: {
              booking_status: status,
              error: refundErr instanceof Error ? refundErr.message : "Unknown refund error",
            },
          });
        }
      }
    }

    // Send status update email to customer (fire-and-forget)
    const b = booking as Record<string, unknown>;
    const product = b.product as { name: string } | null;
    const pickupLocationId = b.pickup_location_id as string | null;
    const deliveryZoneId = b.delivery_zone_id as string | null;
    const collectionZoneId = b.collection_zone_id as string | null;
    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      pickupLocationId
        ? fetchPickupLocationsById(supabase, [pickupLocationId])
        : Promise.resolve({ data: [], error: null }),
      deliveryZoneId || collectionZoneId
        ? fetchServiceZonesById(supabase, [deliveryZoneId, collectionZoneId].filter(Boolean) as string[])
        : Promise.resolve({ data: [], error: null }),
    ]);
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
    const deliveryZone = serviceZones.find((zone) => zone.id === deliveryZoneId);
    const collectionZone = serviceZones.find((zone) => zone.id === collectionZoneId);
    const fulfillmentDisplayLabel =
      pickupLocation?.name ||
      ((b.fulfillment_mode as string) === "delivery_and_collection"
        ? [deliveryZone?.name, collectionZone?.name].filter(Boolean).join(" → ")
        : deliveryZone?.name) ||
      undefined;

    sendBookingStatusUpdate(
      {
        bookingRef: b.booking_ref as string,
        customerName: b.customer_name as string,
        customerEmail: b.customer_email as string,
        customerPhone: (b.customer_phone as string) || undefined,
        productName: product?.name || "Rental equipment",
        startDate: b.start_date as string,
        endDate: b.end_date as string,
        rentalDays: b.rental_days as number,
        totalCents: b.total_cents as number,
        deliveryAddress: b.delivery_address as string,
        deliveryType: (b.delivery_type as string) || "standard",
        fulfillmentMode: (b.fulfillment_mode as string) || undefined,
        fulfillmentLabel: fulfillmentDisplayLabel,
        customerInstructions:
          pickupLocation?.customer_instructions ||
          pickupLocation?.pickup_instructions ||
          deliveryZone?.customer_instructions ||
          collectionZone?.customer_instructions ||
          null,
        internalNotes:
          pickupLocation?.internal_notes ||
          deliveryZone?.internal_notes ||
          collectionZone?.internal_notes ||
          null,
        deliveryWindow: deliveryZone?.delivery_window || null,
        collectionWindow: collectionZone?.collection_window || null,
        leadTimeHours: pickupLocation?.lead_time_hours || deliveryZone?.lead_time_hours || collectionZone?.lead_time_hours || null,
        stripeCheckoutSessionId: (b.stripe_checkout_session_id as string) || null,
        stripePaymentIntentId: (b.stripe_payment_intent_id as string) || null,
        documentLinks,
      },
      status
    ).catch((err) => console.error("[admin/bookings] Email send error:", err));

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error("[admin/bookings] PUT error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
