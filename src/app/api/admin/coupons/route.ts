import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { defaultCouponExpiry, normalizeCouponCode, validateCouponExpiry } from "@/lib/coupon-rules";

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  const db = createAdminClient();
  const [coupons, products, categories] = await Promise.all([
    db.from("coupons").select("*").order("created_at", { ascending: false }),
    db.from("products").select("id,name").eq("is_active", true).order("name"),
    db.from("categories").select("id,name").order("name"),
  ]);
  if (coupons.error || products.error || categories.error) return NextResponse.json({ error: "Could not load coupons. Check that the coupons migration has been applied." }, { status: 503 });
  return NextResponse.json({ coupons: coupons.data, products: products.data, categories: categories.data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  let code: string;
  let expiresOn: string;
  try {
    code = normalizeCouponCode(body.code || `RENT-${randomBytes(5).toString("hex")}`);
    expiresOn = validateCouponExpiry(body.expiresOn === undefined ? defaultCouponExpiry() : body.expiresOn);
  }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
  const { discountType, scope } = body;
  const amount = Number(body.amount);
  const value = Math.round(amount * 100);
  if (!["percentage", "fixed"].includes(discountType) || !["all", "products", "categories"].includes(scope) || !Number.isSafeInteger(value) || value <= 0 || value > 2147483647 || Math.abs(amount * 100 - value) > 0.00001 || (discountType === "percentage" && value > 10000)) {
    return NextResponse.json({ error: "Enter a valid discount (up to 100% or a positive EUR amount, with at most two decimal places) and scope." }, { status: 400 });
  }
  const ids: string[] = scope === "all" ? [] : body.targetIds;
  if (!Array.isArray(ids) || (scope !== "all" && ids.length === 0) || ids.length > 500 || ids.some((id) => typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) return NextResponse.json({ error: "Select the products or categories for this coupon." }, { status: 400 });
  const db = createAdminClient();
  if (ids.length) {
    const targets = await db.from(scope === "products" ? "products" : "categories").select("id").in("id", ids);
    if (targets.error) return NextResponse.json({ error: "Could not validate coupon targets." }, { status: 500 });
    if (targets.data.length !== new Set(ids).size) return NextResponse.json({ error: "One or more selected targets no longer exist." }, { status: 400 });
  }
  const { data, error } = await db.from("coupons").insert({ code, discount_type: discountType, value, scope, product_ids: scope === "products" ? ids : [], category_ids: scope === "categories" ? ids : [], is_active: true, expires_on: expiresOn }).select("*").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "This coupon code already exists." : "Could not create coupon." }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ coupon: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || (body.isActive === undefined && body.expiresOn === undefined) || (body.isActive !== undefined && typeof body.isActive !== "boolean")) return NextResponse.json({ error: "Invalid coupon update." }, { status: 400 });
  const updates: { is_active?: boolean; expires_on?: string } = {};
  if (body.isActive !== undefined) updates.is_active = body.isActive;
  if (body.expiresOn !== undefined) {
    try { updates.expires_on = validateCouponExpiry(body.expiresOn); }
    catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
  }
  const { data, error } = await createAdminClient().from("coupons").update(updates).eq("id", body.id).select("*").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update coupon." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  return NextResponse.json({ coupon: data });
}
