import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingLifecycleNotification } from "@/lib/booking-status-notifications";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request); if (!user) return unauthorizedResponse();
  const { id } = await params; const supabase = createAdminClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id,product_id,quantity,status,product:products(name)")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  const [assignments, units] = await Promise.all([
    supabase.from("booking_inventory_unit_assignments").select("*,inventory_units(id,asset_code,status,condition,location)").eq("booking_id", id).order("assigned_at", { ascending: false }),
    supabase.from("inventory_units").select("id,asset_code,status,condition,location").eq("product_id", booking.product_id).neq("status", "retired").order("asset_code"),
  ]);
  if (assignments.error || units.error) return NextResponse.json({ error: assignments.error?.message || units.error?.message }, { status: 500 });
  return NextResponse.json({
    assignments: assignments.data || [],
    units: units.data || [],
    requiredQuantity: booking.quantity,
    bookingStatus: booking.status,
    productName: (booking.product as { name?: string } | null)?.name || "this product",
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request); if (!user) return unauthorizedResponse();
  const { id } = await params; const body = await request.json(); const supabase = createAdminClient();
  if (!body.unitId) return NextResponse.json({ error: "Inventory unit is required" }, { status: 400 });
  const { data: assignmentId, error } = await supabase.rpc("assign_booking_inventory_unit", {
    p_booking_id: id,
    p_inventory_unit_id: body.unitId,
    p_actor_id: user.id,
    p_notes: body.notes || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  const { data, error: fetchError } = await supabase.from("booking_inventory_unit_assignments").select("*,inventory_units(id,asset_code,status,condition,location)").eq("id", assignmentId).single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  return NextResponse.json({ assignment: data }, { status: 201 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request); if (!user) return unauthorizedResponse();
  const { id } = await params; const body = await request.json(); const supabase = createAdminClient();
  if (!body.assignmentId || !["hand_over","return","release"].includes(body.action)) return NextResponse.json({ error: "Invalid assignment action" }, { status: 400 });
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*,product:products(name)")
    .eq("id", id)
    .single();
  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  const { data: assignmentId, error } = await supabase.rpc("transition_booking_inventory_unit", {
    p_booking_id: id,
    p_assignment_id: body.assignmentId,
    p_action: body.action,
    p_actor_id: user.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  const { data, error: fetchError } = await supabase.from("booking_inventory_unit_assignments").select("*,inventory_units(id,asset_code,status,condition,location)").eq("id", assignmentId).single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  const { data: updatedBooking } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", id)
    .single();
  const previousStatus = booking.status as string;
  const bookingStatus = (updatedBooking?.status as string) || previousStatus;
  const statusChanged = bookingStatus !== previousStatus;
  const emailSent = statusChanged
    ? await sendBookingLifecycleNotification(
        supabase,
        booking as Record<string, unknown>,
        bookingStatus,
      )
    : false;
  return NextResponse.json({
    assignment: data,
    previousBookingStatus: previousStatus,
    bookingStatus,
    statusChanged,
    emailSent,
  });
}
