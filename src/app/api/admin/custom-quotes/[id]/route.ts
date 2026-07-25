import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();
  if (body.action !== "cancel") {
    return NextResponse.json({ error: "Unsupported quote action" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: quote, error: quoteError } = await supabase
    .from("booking_custom_quotes")
    .select("id, status, booking_draft_id")
    .eq("id", id)
    .single();

  if (quoteError || !quote) return NextResponse.json({ error: "Custom quote not found" }, { status: 404 });
  if (quote.status === "paid") return NextResponse.json({ error: "A paid quote cannot be cancelled" }, { status: 409 });
  if (quote.status === "cancelled") return NextResponse.json({ ok: true });

  if (quote.booking_draft_id) {
    const { data: draft } = await supabase
      .from("booking_drafts")
      .select("stripe_checkout_session_id, status")
      .eq("id", quote.booking_draft_id)
      .maybeSingle();
    if (draft?.status === "paid") {
      return NextResponse.json({ error: "A paid quote cannot be cancelled" }, { status: 409 });
    }
    if (stripe && draft?.stripe_checkout_session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(draft.stripe_checkout_session_id);
        if (session.payment_status === "paid" || session.status === "complete") {
          return NextResponse.json(
            { error: "Payment has already completed. Wait for Stripe to create the booking." },
            { status: 409 },
          );
        }
        if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
      } catch (error) {
        console.error("[admin/custom-quotes] Could not expire Stripe session", error);
        return NextResponse.json({ error: "Could not close the active Stripe payment session" }, { status: 502 });
      }
    }
    await supabase
      .from("booking_inventory_blocks")
      .delete()
      .is("booking_id", null)
      .eq("booking_draft_id", quote.booking_draft_id);
    await supabase
      .from("booking_drafts")
      .update({ status: "cancelled" })
      .eq("id", quote.booking_draft_id)
      .in("status", ["draft", "checkout_created"]);
  }

  const { error } = await supabase
    .from("booking_custom_quotes")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", id)
    .neq("status", "paid");

  if (error) {
    console.error("[admin/custom-quotes] cancel failed", error);
    return NextResponse.json({ error: "Could not cancel custom quote" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
