import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const ALLOWED_FIELDS = [
  "name",
  "address",
  "city",
  "pickup_instructions",
  "customer_instructions",
  "internal_notes",
  "lead_time_hours",
  "handoff_contact",
  "confirmation_template",
  "opening_hours",
  "is_active",
  "sort_order",
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pickup_locations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ pickupLocation: data });
  } catch (err) {
    console.error("[admin/fulfillment/pickup] PUT error:", err);
    return NextResponse.json({ error: "Failed to update pickup location" }, { status: 500 });
  }
}
