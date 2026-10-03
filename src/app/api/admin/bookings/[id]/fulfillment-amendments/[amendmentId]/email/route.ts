import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { getFulfillmentAmendmentUrl } from "@/lib/fulfillment-amendments";
import { sendFulfillmentAmendmentQuote } from "@/lib/email";
import { storedBookingLocale } from "@/lib/booking-locale";
import { quoteProductName } from "@/lib/private-quote-locale";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; amendmentId: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id: bookingId, amendmentId } = await params;
  const supabase = createAdminClient();
  const { data: amendment, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select(`
      *,
      booking:bookings!inner (
        booking_ref,
        locale,
        pricing_snapshot,
        customer_name,
        customer_email,
        product:products (name, slug)
      )
    `)
    .eq("id", amendmentId)
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error || !amendment) {
    return NextResponse.json({ error: "Transport quote not found" }, { status: 404 });
  }
  if (!["quoted", "checkout_created"].includes(amendment.status)) {
    return NextResponse.json({ error: "Only open transport quotes can be emailed" }, { status: 409 });
  }
  if (new Date(amendment.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "This transport quote has expired" }, { status: 410 });
  }

  const booking = amendment.booking as unknown as {
    booking_ref: string;
    customer_name: string;
    customer_email: string;
    locale: unknown;
    pricing_snapshot?: { displayName?: string };
    product: { name: string; slug: string } | null;
  };
  const emailSent = await sendFulfillmentAmendmentQuote({
    locale: storedBookingLocale(booking.locale),
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    bookingRef: booking.booking_ref,
    productName: await quoteProductName(booking.product, storedBookingLocale(booking.locale), booking.pricing_snapshot?.displayName),
    fulfillmentMode: amendment.fulfillment_mode,
    deliveryAddress: amendment.delivery_address,
    collectionAddress: amendment.collection_address,
    totalCents: amendment.delivery_fee_cents + amendment.collection_fee_cents,
    customerUrl: getFulfillmentAmendmentUrl(amendment.public_token),
    expiresAt: amendment.expires_at,
  });

  if (!emailSent) {
    return NextResponse.json({ error: "Resend did not accept the transport quote email" }, { status: 502 });
  }

  return NextResponse.json({ emailSent: true });
}
