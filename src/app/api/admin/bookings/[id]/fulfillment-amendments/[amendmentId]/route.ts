import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; amendmentId: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id: bookingId, amendmentId } = await params;
  const supabase = createAdminClient();
  const { data: amendment, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select("id, status, stripe_checkout_session_id")
    .eq("id", amendmentId)
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error || !amendment) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }
  if (!["quoted", "checkout_created"].includes(amendment.status)) {
    return NextResponse.json({ error: "Only open transport quotes can be cancelled" }, { status: 409 });
  }

  if (stripe && amendment.stripe_checkout_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(amendment.stripe_checkout_session_id);
      if (session.payment_status === "paid") {
        return NextResponse.json(
          { error: "Payment has already completed. Wait for Stripe to apply the transport change." },
          { status: 409 },
        );
      }
      if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
    } catch (caught) {
      console.error("[fulfillment-amendments] Could not expire Stripe session", caught);
      return NextResponse.json({ error: "Could not close the active Stripe payment session" }, { status: 502 });
    }
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("booking_fulfillment_amendments")
    .update({ status: "cancelled", cancelled_at: now })
    .eq("id", amendmentId)
    .eq("booking_id", bookingId)
    .in("status", ["quoted", "checkout_created"]);

  if (updateError) {
    return NextResponse.json({ error: "Could not cancel transport quote" }, { status: 500 });
  }

  return NextResponse.json({ cancelled: true });
}
