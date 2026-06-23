import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { sendBookingStatusUpdate } from "@/lib/email";

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

    // If cancelled, release blocked dates
    if (status === "cancelled" || status === "refunded") {
      await supabase
        .from("blocked_dates")
        .delete()
        .eq("booking_id", id);
    }

    // Send status update email to customer (fire-and-forget)
    const b = booking as Record<string, unknown>;
    const product = b.product as { name: string } | null;
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
      },
      status
    ).catch((err) => console.error("[admin/bookings] Email send error:", err));

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error("[admin/bookings] PUT error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
