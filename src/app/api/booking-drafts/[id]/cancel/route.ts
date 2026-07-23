import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import { recordSystemIncident } from "@/lib/system-incidents";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Booking attempt not found" }, { status: 404 });
  }

  const supabase = createServiceClient();
  const { data: draft, error: draftError } = await supabase
    .from("booking_drafts")
    .select("id,status,stripe_checkout_session_id")
    .eq("id", id)
    .maybeSingle();

  if (draftError) {
    return NextResponse.json({ error: "Could not cancel booking attempt" }, { status: 500 });
  }

  if (!draft) {
    return NextResponse.json({ released: true });
  }

  if (draft.status === "paid") {
    return NextResponse.json(
      { error: "Payment has already completed", status: "paid" },
      { status: 409 },
    );
  }

  if (draft.stripe_checkout_session_id && isStripeConfigured() && stripe) {
    const session = await stripe.checkout.sessions.retrieve(draft.stripe_checkout_session_id);
    if (session.status === "complete" || session.payment_status === "paid") {
      return NextResponse.json(
        {
          error: "Payment has already completed",
          status: "paid",
          sessionId: session.id,
        },
        { status: 409 },
      );
    }

    if (session.status === "open") {
      await stripe.checkout.sessions.expire(session.id);
    }
  }

  const { error: statusError } = await supabase
    .from("booking_drafts")
    .update({ status: "cancelled" })
    .eq("id", id)
    .in("status", ["draft", "checkout_created", "expired"]);

  const { error: releaseError } = await supabase
    .from("booking_inventory_blocks")
    .delete()
    .eq("booking_draft_id", id)
    .is("booking_id", null);

  if (statusError || releaseError) {
    await recordSystemIncident({
      source: "booking_drafts",
      eventType: "checkout_cancellation_release_failed",
      severity: "critical",
      message: statusError?.message || releaseError?.message || "Draft cancellation failed",
      context: { draftId: id },
    });
    return NextResponse.json({ error: "Could not release booking attempt" }, { status: 500 });
  }

  return NextResponse.json({ released: true });
}
