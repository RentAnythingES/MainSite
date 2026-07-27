import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { invalidatePublicProductCache } from "@/lib/product-cache";

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Unknown error";
}

/**
 * PUT /api/admin/products/[id] — Update an existing product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (typeof body.slug === "string" && body.slug.trim()) {
      updates.slug = body.slug.trim();
    }
    if (typeof body.name === "string" && body.name.trim()) {
      updates.name = body.name.trim();
    }
    if (body.brand !== undefined) {
      if (typeof body.brand !== "string") {
        return NextResponse.json({ error: "Brand must be text" }, { status: 400 });
      }
      updates.brand = body.brand.trim();
    }
    if (typeof body.description === "string" && body.description.trim()) {
      updates.description = body.description.trim();
    }
    if (typeof body.category_id === "string" && body.category_id.trim()) {
      updates.category_id = body.category_id.trim();
    }
    if (typeof body.subcategory === "string" && body.subcategory.trim()) {
      updates.subcategory = body.subcategory.trim();
    }
    if (typeof body.subcategory_slug === "string" && body.subcategory_slug.trim()) {
      updates.subcategory_slug = body.subcategory_slug.trim();
    }
    if (typeof body.image_url === "string") {
      updates.image_url = body.image_url.trim() || null;
    }
    if (typeof body.stock_total === "number") {
      updates.stock_total = body.stock_total;
    }
    if (typeof body.stock_available === "number") {
      updates.stock_available = body.stock_available;
    }
    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }
    if (typeof body.emoji === "string" && body.emoji.trim()) {
      updates.emoji = body.emoji.trim();
    }
    if (typeof body.city === "string" && body.city.trim()) {
      updates.city = body.city.trim();
    }
    if (Array.isArray(body.features)) {
      updates.features = body.features
        .filter((feature): feature is string => typeof feature === "string")
        .map((feature) => feature.trim())
        .filter(Boolean);
    }
    if (body.specs && typeof body.specs === "object" && !Array.isArray(body.specs)) {
      updates.specs = body.specs as Record<string, string>;
    }

    if (Object.keys(updates).length > 0) {
      const { data: product, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (Array.isArray(body.pricing_tiers)) {
        const { error: deletePricingError } = await supabase.from("pricing_tiers").delete().eq("product_id", id);
        if (deletePricingError) throw deletePricingError;

        if (body.pricing_tiers.length > 0) {
          const { error: pricingError } = await supabase
            .from("pricing_tiers")
            .insert(
              body.pricing_tiers.map((tier) => ({
                product_id: id,
                min_days: Number((tier as { min_days?: number }).min_days),
                per_day_cents: Number((tier as { per_day_cents?: number }).per_day_cents),
              }))
            );

          if (pricingError) throw pricingError;
        }
      }

      if (Array.isArray(body.quantity_discounts)) {
        const { error: deleteDiscountError } = await supabase.from("product_quantity_discounts").delete().eq("product_id", id);
        if (deleteDiscountError) throw deleteDiscountError;

        if (body.quantity_discounts.length > 0) {
          const { error: discountError } = await supabase
            .from("product_quantity_discounts")
            .insert(
              body.quantity_discounts.map((tier) => ({
                product_id: id,
                min_quantity: Number((tier as { min_quantity?: number }).min_quantity),
                discount_bps: Number((tier as { discount_bps?: number }).discount_bps),
              }))
            );

          if (discountError) throw discountError;
        }
      }

      invalidatePublicProductCache(product?.slug ? [product.slug] : []);
      return NextResponse.json({ product });
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .single();

    if (error) throw error;

    invalidatePublicProductCache(product?.slug ? [product.slug] : []);
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[admin/products] PUT error:", err);
    return NextResponse.json(
      { error: `Failed to update product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]?force=true — Hard delete product and all related data
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  try {
    const supabase = createAdminClient();

    if (force) {
      // Hard delete: remove product and all related data
      // First get the slug for cache invalidation
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("slug")
        .eq("id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      // Delete in order to respect foreign key constraints
      await supabase.from("pricing_tiers").delete().eq("product_id", id);
      await supabase.from("product_quantity_discounts").delete().eq("product_id", id);
      await supabase.from("product_localizations").delete().eq("product_id", id);
      await supabase.from("product_images").delete().eq("product_id", id);
      await supabase.from("product_availability").delete().eq("product_id", id);
      await supabase.from("booking_items").delete().eq("product_id", id);
      await supabase.from("reviews").delete().eq("product_id", id);
      await supabase.from("products").delete().eq("id", id);

      if (product?.slug) {
        invalidatePublicProductCache([product.slug]);
      }

      return NextResponse.json({ success: true, message: "Product permanently deleted" });
    } else {
      // Soft delete: set is_active = false (existing behavior)
      const { data: product, error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", id)
        .select("slug")
        .single();

      if (error) throw error;

      invalidatePublicProductCache(product?.slug ? [product.slug] : []);
      return NextResponse.json({ success: true, message: "Product archived (soft delete)" });
    }
  } catch (err) {
    console.error("[admin/products] DELETE error:", err);
    return NextResponse.json(
      { error: `Failed to ${force ? "delete" : "deactivate"} product: ${getErrorMessage(err)}` },
      { status: 500 }
    );
  }
}
