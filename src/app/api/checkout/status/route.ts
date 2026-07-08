import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";

function formatDateTime(value?: string | null): string {
  if (!value) return "";

  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}

export async function GET(request: NextRequest) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};
    const bookingDraftId = metadata.booking_draft_id;

    const { data: booking } = await supabase
      .from("bookings")
      .select(`
        *,
        product:products (id, name, slug)
      `)
      .eq("stripe_checkout_session_id", sessionId)
      .maybeSingle();

    const bookingRecord = booking as Record<string, unknown> | null;
    let draftRecord: Record<string, unknown> | null = null;
    let inventoryBlockCount = 0;

    if (bookingDraftId) {
      const { data: draft } = await supabase
        .from("booking_drafts")
        .select("*")
        .eq("id", bookingDraftId)
        .maybeSingle();

      draftRecord = draft as Record<string, unknown> | null;

      const { count } = await supabase
        .from("booking_inventory_blocks")
        .select("id", { count: "exact", head: true })
        .eq("booking_draft_id", bookingDraftId);

      inventoryBlockCount = count || 0;
    }

    const product = bookingRecord?.product as { name?: string; slug?: string } | undefined;
    const paymentPaid = session.payment_status === "paid";
    const bookingCreated = Boolean(bookingRecord);

    let fulfillmentStatus: "booking_confirmed" | "payment_pending" | "fulfillment_pending" | "payment_incomplete";

    if (bookingCreated) {
      fulfillmentStatus = "booking_confirmed";
    } else if (paymentPaid) {
      fulfillmentStatus = "fulfillment_pending";
    } else if (session.payment_status === "unpaid" || session.payment_status === "no_payment_required") {
      fulfillmentStatus = "payment_pending";
    } else {
      fulfillmentStatus = "payment_incomplete";
    }

    return NextResponse.json({
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email || session.customer_details?.email || "",
      },
      status: fulfillmentStatus,
      draft: draftRecord
        ? {
            id: draftRecord.id,
            status: draftRecord.status,
            expiresAt: draftRecord.expires_at,
            inventoryHoldCount: inventoryBlockCount,
          }
        : null,
      booking: bookingRecord
        ? {
            id: bookingRecord.id,
            bookingRef: bookingRecord.booking_ref,
            status: bookingRecord.status,
            productName: product?.name || "Rental equipment",
            productSlug: product?.slug || "",
            startDate: formatDateTime((bookingRecord.rental_start_at as string | null) || bookingRecord.start_date as string),
            endDate: formatDateTime((bookingRecord.rental_end_at as string | null) || bookingRecord.end_date as string),
            totalCents: bookingRecord.total_cents,
            customerEmail: bookingRecord.customer_email,
          }
        : null,
    });
  } catch (err) {
    console.error("[checkout/status] Error:", err);
    return NextResponse.json({ error: "Unable to load checkout status" }, { status: 500 });
  }
}
