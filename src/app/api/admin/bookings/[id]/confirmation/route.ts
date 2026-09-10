import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

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
  const { data: updated, error } = await supabase
    .from("bookings")
    .update({
      confirmation_status: decision,
      confirmed_at: new Date().toISOString(),
      confirmed_by: `admin:${user.email}`,
    })
    .eq("id", id)
    .eq("confirmation_status", "pending")
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Booking is not awaiting confirmation" }, { status: 409 });
  }

  return NextResponse.json({ booking: updated });
}
