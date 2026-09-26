import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

type AssetProfile = {
  product_id: string;
  purchase_date: string | null;
  purchase_cost_cents: number;
  purchased_by: "Fadi" | "Johannes";
  useful_life_months: number;
  residual_value_cents: number;
  depreciation_method: "straight_line";
  notes: string | null;
};

function cents(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 10_000_000 ? parsed : fallback;
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function toDate(value: unknown) {
  const date = text(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function elapsedMonths(from: string, until = new Date()) {
  const start = new Date(`${from}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || until <= start) return 0;
  return Math.max(0, (until.getTime() - start.getTime()) / (365.2425 / 12 * 86_400_000));
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  try {
    const supabase = createAdminClient();
    const [productsResult, profilesResult, bookingsResult, tiersResult] = await Promise.all([
      supabase.from("products").select("id,name,slug,is_active,stock_total,created_at").order("name"),
      supabase.from("product_asset_accounting").select("*"),
      supabase.from("bookings")
        .select("product_id,subtotal_cents,status,paid_at,created_at")
        .in("status", ["paid", "delivering", "active", "returning", "completed"]),
      supabase.from("pricing_tiers").select("product_id,per_day_cents,min_days").order("min_days"),
    ]);
    if (productsResult.error) throw productsResult.error;
    if (profilesResult.error) throw profilesResult.error;
    if (bookingsResult.error) throw bookingsResult.error;
    if (tiersResult.error) throw tiersResult.error;

    const profiles = new Map((profilesResult.data || []).map((profile) => [profile.product_id, profile as AssetProfile]));
    const lowestDailyRate = new Map<string, number>();
    for (const tier of tiersResult.data || []) {
      const current = lowestDailyRate.get(tier.product_id);
      if (current === undefined || tier.per_day_cents < current) lowestDailyRate.set(tier.product_id, tier.per_day_cents);
    }
    const bookingsByProduct = new Map<string, Array<{ subtotal_cents: number; paid_at: string | null; created_at: string }>>();
    for (const booking of bookingsResult.data || []) {
      const current = bookingsByProduct.get(booking.product_id) || [];
      current.push(booking);
      bookingsByProduct.set(booking.product_id, current);
    }

    const assets = (productsResult.data || []).map((product) => {
      const profile = profiles.get(product.id) || {
        product_id: product.id,
        purchase_date: null,
        purchase_cost_cents: 0,
        purchased_by: "Fadi" as const,
        useful_life_months: 36,
        residual_value_cents: 0,
        depreciation_method: "straight_line" as const,
        notes: null,
      };
      const purchaseDate = profile.purchase_date;
      const revenueSincePurchase = purchaseDate
        ? (bookingsByProduct.get(product.id) || []).reduce((total, booking) => {
          const revenueDate = (booking.paid_at || booking.created_at).slice(0, 10);
          return revenueDate >= purchaseDate ? total + Number(booking.subtotal_cents || 0) : total;
        }, 0)
        : null;
      const depreciableCents = Math.max(0, profile.purchase_cost_cents - profile.residual_value_cents);
      const months = profile.purchase_date ? elapsedMonths(profile.purchase_date) : 0;
      const accumulatedDepreciationCents = Math.min(
        depreciableCents,
        Math.round(depreciableCents * Math.min(months, profile.useful_life_months) / profile.useful_life_months),
      );
      return {
        ...product,
        ...profile,
        current_daily_rate_cents: lowestDailyRate.get(product.id) || 0,
        rental_revenue_since_purchase_cents: revenueSincePurchase,
        monthly_depreciation_cents: Math.round(depreciableCents / profile.useful_life_months),
        accumulated_depreciation_cents: accumulatedDepreciationCents,
        net_book_value_cents: Math.max(profile.residual_value_cents, profile.purchase_cost_cents - accumulatedDepreciationCents),
      };
    });
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("[admin/asset-accounting] GET error:", error);
    return NextResponse.json({ error: "Apply the product asset accounting migration before opening this page" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const productId = text(body?.productId, 64);
  if (!productId) return NextResponse.json({ error: "Product is required" }, { status: 400 });
  const purchasedBy = body?.purchasedBy === "Johannes" ? "Johannes" : "Fadi";
  const purchaseCostCents = cents(body?.purchaseCostCents);
  const residualValueCents = cents(body?.residualValueCents);
  const usefulLifeMonths = Number(body?.usefulLifeMonths);
  if (!Number.isInteger(usefulLifeMonths) || usefulLifeMonths < 1 || usefulLifeMonths > 240) {
    return NextResponse.json({ error: "Useful life must be between 1 and 240 months" }, { status: 400 });
  }
  if (residualValueCents > purchaseCostCents) return NextResponse.json({ error: "Residual value cannot exceed purchase cost" }, { status: 400 });
  try {
    const { data, error } = await createAdminClient().from("product_asset_accounting").upsert({
      product_id: productId,
      purchase_date: toDate(body?.purchaseDate),
      purchase_cost_cents: purchaseCostCents,
      purchased_by: purchasedBy,
      useful_life_months: usefulLifeMonths,
      residual_value_cents: residualValueCents,
      depreciation_method: "straight_line",
      notes: text(body?.notes, 1000) || null,
    }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error("[admin/asset-accounting] PATCH error:", error);
    return NextResponse.json({ error: "Could not save the asset record" }, { status: 500 });
  }
}
