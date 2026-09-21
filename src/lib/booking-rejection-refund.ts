import type { SupabaseClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { recordBookingPaymentEvent } from "@/lib/payment-ledger";
import { createBookingDocumentForPaymentEvent, getCustomerDocumentUrl } from "@/lib/booking-documents";
import { sendBookingStatusUpdate } from "@/lib/email";

type BookingRecord = Record<string, unknown> & {
  status: string;
  confirmation_status: string | null;
  stripe_payment_intent_id: string | null;
  product: { name?: string } | null;
};

export type BookingRejectionRefundResult = {
  booking: BookingRecord;
  emailSent: boolean;
  alreadyHandled: boolean;
};

/**
 * Reject a short-notice booking only after Stripe confirms its full refund.
 * The deterministic Stripe key makes simultaneous Admin/Telegram callbacks safe.
 */
export async function rejectBookingWithStripeRefund(
  supabase: SupabaseClient,
  input: { bookingId: string; actor: string; actorUserId?: string | null },
): Promise<BookingRejectionRefundResult> {
  const { data: bookingRow, error: bookingError } = await supabase
    .from("bookings")
    .select("*, product:products(name)")
    .eq("id", input.bookingId)
    .maybeSingle();

  if (bookingError) throw new Error(bookingError.message);
  if (!bookingRow) throw new Error("Booking not found");

  const booking = bookingRow as BookingRecord;
  if (booking.confirmation_status !== "pending") {
    if (booking.confirmation_status === "rejected" && booking.status === "refunded") {
      return { booking, emailSent: false, alreadyHandled: true };
    }
    throw new Error("Booking is not awaiting confirmation");
  }
  if (!booking.stripe_payment_intent_id) {
    throw new Error("This booking has no Stripe payment to refund.");
  }
  if (!stripe) {
    throw new Error("Refund processing is unavailable. The booking was not rejected.");
  }

  const paymentIntentId = booking.stripe_payment_intent_id;
  let refund;
  try {
    const createdRefund = await stripe.refunds.create(
      { payment_intent: paymentIntentId },
      { idempotencyKey: `booking-rejection-refund-${input.bookingId}` },
    );
    refund = createdRefund.status === "succeeded"
      ? createdRefund
      : await stripe.refunds.retrieve(createdRefund.id);
  } catch (error) {
    await recordBookingPaymentEvent(supabase, {
      bookingId: input.bookingId,
      bookingDraftId: booking.booking_draft_id as string | null,
      eventType: "refund",
      status: "failed",
      currency: "eur",
      amountCents: Number(booking.total_cents) || 0,
      stripeCheckoutSessionId: booking.stripe_checkout_session_id as string | null,
      stripePaymentIntentId: paymentIntentId,
      providerEventId: `rejection_refund_failed:${paymentIntentId}`,
      description: "Stripe refund attempt after booking rejection failed",
      metadata: {
        reason: "booking_rejected",
        error: error instanceof Error ? error.message : "Unknown Stripe error",
      },
    });
    throw new Error("Stripe could not confirm the refund. The booking was not rejected.");
  }

  const refundSucceeded = refund.status === "succeeded";
  const paymentEvent = await recordBookingPaymentEvent(supabase, {
    bookingId: input.bookingId,
    bookingDraftId: booking.booking_draft_id as string | null,
    eventType: "refund",
    status: refundSucceeded ? "succeeded" : refund.status === "failed" || refund.status === "canceled" ? "failed" : "pending",
    currency: refund.currency || "eur",
    amountCents: refund.amount,
    stripeCheckoutSessionId: booking.stripe_checkout_session_id as string | null,
    stripePaymentIntentId: paymentIntentId,
    stripeRefundId: refund.id,
    stripeChargeId: typeof refund.charge === "string" ? refund.charge : refund.charge?.id || null,
    providerEventId: `refund:${refund.id}`,
    description: "Full Stripe refund issued after short-notice booking rejection",
    metadata: {
      requested_booking_status: "refunded",
      refund_status: refund.status,
      refund_scope: "full",
      refund_reason: "booking_rejected",
      rejection_actor: input.actor,
    },
    occurredAt: refund.created ? new Date(refund.created * 1000).toISOString() : null,
  });

  if (!refundSucceeded) {
    throw new Error(`Stripe refund is ${refund.status}. The booking was not rejected.`);
  }
  if (!paymentEvent) {
    throw new Error("Stripe refund succeeded, but the finance ledger could not be recorded. Please retry before rejecting the booking.");
  }

  const refundDocument = await createBookingDocumentForPaymentEvent(supabase, {
    booking,
    paymentEvent,
    productName: booking.product?.name || "Rental equipment",
  });
  const refundUrl = getCustomerDocumentUrl(refundDocument);
  if (!refundDocument || !refundUrl) {
    throw new Error("Stripe refund succeeded, but its refund receipt could not be created. Please retry before rejecting the booking.");
  }

  const { data: transitioned, error: transitionError } = await supabase
    .rpc("transition_booking_status", {
      p_booking_id: input.bookingId,
      p_expected_status: booking.status,
      p_new_status: "refunded",
      p_source: "booking_rejection",
      p_actor_user_id: input.actorUserId || null,
    })
    .single();
  if (transitionError) throw new Error(transitionError.message);

  const { data: rejected, error: rejectionError } = await supabase
    .from("bookings")
    .update({
      confirmation_status: "rejected",
      confirmed_at: new Date().toISOString(),
      confirmed_by: input.actor,
    })
    .eq("id", input.bookingId)
    .eq("confirmation_status", "pending")
    .select("*")
    .maybeSingle();
  if (rejectionError) throw new Error(rejectionError.message);
  if (!rejected) {
    throw new Error("Booking confirmation was already handled; no customer email was sent.");
  }

  const emailSent = await sendBookingStatusUpdate(
    {
      bookingRef: booking.booking_ref as string,
      customerName: booking.customer_name as string,
      customerEmail: booking.customer_email as string,
      customerPhone: (booking.customer_phone as string) || undefined,
      productName: booking.product?.name || "Rental equipment",
      startDate: booking.start_date as string,
      endDate: booking.end_date as string,
      rentalStartAt: (booking.rental_start_at as string) || null,
      rentalEndAt: (booking.rental_end_at as string) || null,
      rentalDays: Number(booking.rental_days) || 0,
      totalCents: refund.amount,
      deliveryAddress: (booking.delivery_address as string) || "Address on file",
      deliveryType: (booking.delivery_type as string) || "standard",
      fulfillmentMode: (booking.fulfillment_mode as string) || undefined,
      stripeCheckoutSessionId: (booking.stripe_checkout_session_id as string) || null,
      stripePaymentIntentId: paymentIntentId,
      documentLinks: [{ label: "Download refund receipt", url: refundUrl, documentNumber: refundDocument.document_number }],
    },
    "rejected_refunded",
  );

  return { booking: (rejected as BookingRecord) || (transitioned as BookingRecord), emailSent, alreadyHandled: false };
}
