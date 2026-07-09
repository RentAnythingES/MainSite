import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const ALLOWED_FIELDS = [
  "name",
  "description",
  "customer_instructions",
  "internal_notes",
  "lead_time_hours",
  "same_day_cutoff",
  "delivery_window",
  "collection_window",
  "confirmation_template",
  "delivery_fee_cents",
  "collection_fee_cents",
  "roundtrip_fee_cents",
  "express_surcharge_cents",
  "minimum_order_cents",
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
      .from("service_zones")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ serviceZone: data });
  } catch (err) {
    console.error("[admin/fulfillment/service-zone] PUT error:", err);
    return NextResponse.json({ error: "Failed to update service zone" }, { status: 500 });
  }
}
