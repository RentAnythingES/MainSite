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
  "automatic_express_enabled",
  "express_min_lead_hours",
  "delivery_operating_hours",
  "delivery_window",
  "collection_window",
  "confirmation_template",
  "delivery_fee_cents",
  "collection_fee_cents",
  "roundtrip_fee_cents",
  "express_surcharge_cents",
  "minimum_order_cents",
  "automatic_checkout_enabled",
  "is_active",
  "sort_order",
];

const OPERATING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

function validTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validOperatingHours(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const schedule = value as Record<string, unknown>;
  return OPERATING_DAYS.every((day) => {
    const window = schedule[day];
    if (window === null) return true;
    if (!window || typeof window !== "object" || Array.isArray(window)) return false;
    const { open, close } = window as Record<string, unknown>;
    return validTime(open) && validTime(close) && open <= close;
  });
}

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
    const { data: current, error: currentError } = await supabase
      .from("service_zones")
      .select("lead_time_hours,express_min_lead_hours,delivery_operating_hours,express_surcharge_cents,automatic_checkout_enabled,automatic_express_enabled")
      .eq("id", id)
      .single();
    if (currentError || !current) {
      return NextResponse.json({ error: "Service zone not found" }, { status: 404 });
    }

    const effective = { ...current, ...updates } as Record<string, unknown>;
    for (const field of ["lead_time_hours", "express_min_lead_hours"] as const) {
      const value = effective[field];
      if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 72) {
        return NextResponse.json({ error: `${field} must be a whole number between 0 and 72` }, { status: 400 });
      }
    }
    for (const field of [
      "delivery_fee_cents",
      "collection_fee_cents",
      "roundtrip_fee_cents",
      "express_surcharge_cents",
      "minimum_order_cents",
    ] as const) {
      if (effective[field] !== undefined && (!Number.isInteger(effective[field]) || Number(effective[field]) < 0)) {
        return NextResponse.json({ error: `${field} must be a non-negative whole number` }, { status: 400 });
      }
    }
    if (!validOperatingHours(effective.delivery_operating_hours)) {
      return NextResponse.json({ error: "Delivery operating hours must define a valid window or closed state for every day" }, { status: 400 });
    }
    if (effective.automatic_express_enabled === true) {
      if (effective.automatic_checkout_enabled !== true) {
        return NextResponse.json({ error: "Enable online checkout before enabling automatic Express" }, { status: 400 });
      }
      if (Number(effective.express_surcharge_cents) <= 0) {
        return NextResponse.json({ error: "Set a positive Express surcharge before enabling automatic Express" }, { status: 400 });
      }
    }

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
