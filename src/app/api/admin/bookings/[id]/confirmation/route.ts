import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { rejectBookingWithStripeRefund } from "@/lib/booking-rejection-refund";
import { confirmShortNoticeBooking } from "@/lib/short-notice-confirmation";

/**
 * PATCH /api/admin/bookings/[id]/confirmation — Approve or reject a short-notice booking
 * that is awaiting confirmation (mirrors the Telegram Confirm/Reject buttons).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const body = await request.json().catch(() => null) as { decision?: string } | null;
  const decision = body?.decision;

  if (decision !== "approved" && decision !== "rejected") {
    return NextResponse.json({ error: "decision must be 'approved' or 'rejected'" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (decision === "rejected") {
    try {
      const result = await rejectBookingWithStripeRefund(supabase, {
        bookingId: id,
        actor: `admin:${user.email}`,
        actorUserId: user.id,
      });
      return NextResponse.json({ booking: result.booking, emailSent: result.emailSent, alreadyHandled: result.alreadyHandled });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Could not reject and refund booking" },
        { status: 409 },
      );
    }
  }

  try {
    const result = await confirmShortNoticeBooking(supabase, id, `admin:${user.email}`);
    if (!result.confirmed) {
      return NextResponse.json({ error: "Booking is not awaiting confirmation" }, { status: 409 });
    }
    return NextResponse.json({ booking: result.booking, emailSent: result.emailSent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not confirm booking" },
      { status: 500 },
    );
  }
}
