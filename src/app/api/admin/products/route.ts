import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

/**
 * GET /api/admin/products — List all products with pricing + category
 */
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (id, min_days, per_day_cents),
        category:categories (id, slug, name)
      `)
      .order("name");

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (err) {
    console.error("[admin/products] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/admin/products — Create a new product
 */
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: body.slug,
        name: body.name,
        brand: body.brand,
        description: body.description,
        emoji: body.emoji || "📦",
        image_url: body.image_url || null,
        category_id: body.category_id,
        subcategory: body.subcategory,
        subcategory_slug: body.subcategory_slug,
        city: body.city || "valencia",
        stock_total: body.stock_total || 1,
        stock_available: body.stock_available || 1,
        is_active: body.is_active ?? true,
        features: body.features || [],
        specs: body.specs || {},
      })
      .select()
      .single();

    if (error) throw error;

    // Insert pricing tiers if provided
    if (body.pricing_tiers && body.pricing_tiers.length > 0) {
      const { error: pricingError } = await supabase
        .from("pricing_tiers")
        .insert(
          body.pricing_tiers.map((t: { min_days: number; per_day_cents: number }) => ({
            product_id: (data as { id: string }).id,
            min_days: t.min_days,
            per_day_cents: t.per_day_cents,
          }))
        );

      if (pricingError) {
        console.error("[admin/products] Pricing insert error:", pricingError);
      }
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    console.error("[admin/products] POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
