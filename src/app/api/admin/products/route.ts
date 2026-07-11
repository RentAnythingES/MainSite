import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getProductReadinessIssues, isValidProductImageUrl, isValidProductSlug } from "@/lib/product-validation";

type ProductPayload = {
  slug?: string;
  name?: string;
  brand?: string;
  description?: string;
  category_id?: string;
  subcategory?: string;
  subcategory_slug?: string;
  pricing_tiers?: { min_days: number; per_day_cents: number }[];
};

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Unknown error";
}

function validateProductPayload(body: ProductPayload) {
  const requiredFields: Array<keyof ProductPayload> = [
    "slug",
    "name",
    "brand",
    "description",
    "category_id",
    "subcategory",
    "subcategory_slug",
  ];

  for (const field of requiredFields) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      return `${field.replace("_", " ")} is required`;
    }
  }

  const issues = getProductReadinessIssues(body);
  if (issues.length > 0) return issues[0];

  return null;
}

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
    const body = await request.json() as ProductPayload & Record<string, unknown>;
    const validationError = validateProductPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: body.slug!.trim(),
        name: body.name!.trim(),
        brand: body.brand!.trim(),
        description: body.description!.trim(),
        emoji: body.emoji || "📦",
        image_url: body.image_url || null,
        category_id: body.category_id!.trim(),
        subcategory: body.subcategory!.trim(),
        subcategory_slug: body.subcategory_slug!.trim(),
        city: body.city || "valencia",
        stock_total: body.stock_total || 1,
        stock_available: body.stock_available || 1,
        is_active: body.is_active ?? false,
        features: body.features || [],
        specs: body.specs || {},
      })
      .select()
      .single();

    if (error) throw error;

    // Insert pricing tiers if provided
    const { error: pricingError } = await supabase
      .from("pricing_tiers")
      .insert(
        body.pricing_tiers!.map((t) => ({
          product_id: (data as { id: string }).id,
          min_days: t.min_days,
          per_day_cents: t.per_day_cents,
        }))
      );

    if (pricingError) {
      await supabase.from("products").delete().eq("id", (data as { id: string }).id);
      console.error("[admin/products] Pricing insert error:", pricingError);
      return NextResponse.json(
        { error: `Product pricing failed: ${getErrorMessage(pricingError)}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    console.error("[admin/products] POST error:", err);
    return NextResponse.json(
      { error: `Failed to create product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}
