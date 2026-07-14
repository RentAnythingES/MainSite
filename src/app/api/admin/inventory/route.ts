import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const supabase = createAdminClient();
  const [units, products] = await Promise.all([
    supabase.from("inventory_units").select("*, products(id,name,slug)").order("asset_code"),
    supabase.from("products").select("id,name,slug,is_active").order("name"),
  ]);
  if (units.error) return NextResponse.json({ error: units.error.message }, { status: 500 });
  if (products.error) return NextResponse.json({ error: products.error.message }, { status: 500 });
  return NextResponse.json({ units: units.data || [], products: products.data || [] });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json();
  if (!body.productId || !String(body.assetCode || "").trim()) return NextResponse.json({ error: "Product and asset code are required" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("inventory_units").insert({
    product_id: body.productId,
    asset_code: String(body.assetCode).trim().toUpperCase(),
    serial_number: body.serialNumber || null,
    condition: body.condition || "good",
    location: body.location || null,
    notes: body.notes || null,
    acquired_at: body.acquiredAt || null,
  }).select("*, products(id,name,slug)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("inventory_unit_events").insert({ inventory_unit_id: data.id, event_type: "created", to_status: data.status, actor_id: user.id });
  return NextResponse.json({ unit: data }, { status: 201 });
}
