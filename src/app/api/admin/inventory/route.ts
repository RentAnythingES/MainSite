import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const supabase = createAdminClient();
  const [units, products] = await Promise.all([
    supabase.from("inventory_units").select("*, products(id,name,slug)").order("asset_code"),
    supabase
      .from("products")
      .select("id,name,slug,is_active,stock_total,stock_available")
      .order("is_active", { ascending: false })
      .order("name"),
  ]);
  if (units.error) return NextResponse.json({ error: units.error.message }, { status: 500 });
  if (products.error) return NextResponse.json({ error: products.error.message }, { status: 500 });
  const unitCounts = new Map<string, {
    physical: number;
    operational: number;
    available: number;
    unavailable: number;
  }>();
  for (const unit of units.data || []) {
    if (unit.status === "retired") continue;
    const current = unitCounts.get(unit.product_id) || {
      physical: 0,
      operational: 0,
      available: 0,
      unavailable: 0,
    };
    current.physical += 1;
    if (["available", "reserved", "rented"].includes(unit.status)) current.operational += 1;
    if (unit.status === "available") current.available += 1;
    if (["maintenance", "damaged"].includes(unit.status)) current.unavailable += 1;
    unitCounts.set(unit.product_id, current);
  }
  const reconciledProducts = (products.data || []).map((product) => ({
    ...product,
    physical_units: unitCounts.get(product.id)?.physical || 0,
    operational_units: unitCounts.get(product.id)?.operational || 0,
    physically_available_units: unitCounts.get(product.id)?.available || 0,
    unavailable_units: unitCounts.get(product.id)?.unavailable || 0,
  }));
  return NextResponse.json({ units: units.data || [], products: reconciledProducts });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json();
  const supabase = createAdminClient();
  if (body.action === "register_missing") {
    if (!body.productId) {
      return NextResponse.json({ error: "Product is required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("register_missing_inventory_units", {
      p_product_id: body.productId,
      p_actor_id: user.id,
      p_location: String(body.location || "").trim() || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ reconciliation: data }, { status: 201 });
  }
  if (!body.productId || !String(body.assetCode || "").trim()) return NextResponse.json({ error: "Product and asset code are required" }, { status: 400 });
  const assetCode = String(body.assetCode).trim().toUpperCase();
  if (!/^[A-Z0-9-]{3,50}$/.test(assetCode)) {
    return NextResponse.json(
      { error: "Asset code must contain 3–50 uppercase letters, numbers, or hyphens" },
      { status: 400 },
    );
  }
  const { data, error } = await supabase.from("inventory_units").insert({
    product_id: body.productId,
    asset_code: assetCode,
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

export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json();
  const stockTotal = Number(body.stockTotal);
  const onlineCapacity = Number(body.onlineCapacity);
  if (
    !body.productId ||
    !Number.isInteger(stockTotal) ||
    !Number.isInteger(onlineCapacity) ||
    stockTotal < 0 ||
    onlineCapacity < 0 ||
    onlineCapacity > stockTotal
  ) {
    return NextResponse.json(
      { error: "Owned stock and online capacity must be valid whole numbers" },
      { status: 400 },
    );
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .rpc("update_product_inventory_capacity", {
      p_product_id: body.productId,
      p_stock_total: stockTotal,
      p_online_capacity: onlineCapacity,
      p_actor_id: user.id,
    })
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ product: data });
}
