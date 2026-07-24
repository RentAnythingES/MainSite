import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const STATUSES = new Set(["available", "reserved", "rented", "maintenance", "damaged", "retired"]);
const CONDITIONS = new Set(["new", "good", "fair", "poor"]);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const { id } = await params;
  const body = await request.json();
  if (body.status && !STATUSES.has(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (body.condition && !CONDITIONS.has(body.condition)) return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("inventory_units")
    .select("status,condition,location,notes,last_inspected_at")
    .eq("id", id)
    .single();
  if (!current) return NextResponse.json({ error: "Inventory unit not found" }, { status: 404 });
  const statusChanging = Boolean(body.status && body.status !== current.status);
  if (statusChanging && ["reserved", "rented"].includes(body.status)) {
    return NextResponse.json(
      { error: "Reserved and rented states are controlled by booking assignments" },
      { status: 409 },
    );
  }
  if (statusChanging) {
    const { count, error: assignmentError } = await supabase
      .from("booking_inventory_unit_assignments")
      .select("id", { count: "exact", head: true })
      .eq("inventory_unit_id", id)
      .in("status", ["assigned", "handed_over"]);
    if (assignmentError) {
      return NextResponse.json({ error: assignmentError.message }, { status: 500 });
    }
    if (count) {
      return NextResponse.json(
        { error: "Release or return the active booking assignment before changing this unit’s status" },
        { status: 409 },
      );
    }
  }
  const updates = {
    status: body.status ?? current.status,
    condition: body.condition ?? current.condition,
    location: body.location === undefined ? current.location : body.location || null,
    notes: body.notes === undefined ? current.notes : body.notes || null,
    last_inspected_at: body.markInspected
      ? new Date().toISOString()
      : body.lastInspectedAt === undefined
        ? current.last_inspected_at
        : body.lastInspectedAt,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("inventory_units").update(updates).eq("id", id).select("*, products(id,name,slug)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("inventory_unit_events").insert({ inventory_unit_id: id, event_type: current.status === data.status ? "updated" : "status_changed", from_status: current.status, to_status: data.status, note: body.eventNote || null, actor_id: user.id });
  return NextResponse.json({ unit: data });
}
