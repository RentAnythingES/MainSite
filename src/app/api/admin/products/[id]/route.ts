import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

/**
 * PUT /api/admin/products/[id] — Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    const allowedFields = [
      "name", "brand", "description", "emoji", "image_url",
      "category_id", "subcategory", "subcategory_slug", "city",
      "stock_total", "stock_available", "is_active", "slug",
      "features", "specs", "meta_title", "meta_description",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update pricing tiers if provided
    if (body.pricing_tiers) {
      // Delete existing tiers and re-insert
      await supabase.from("pricing_tiers").delete().eq("product_id", id);

      if (body.pricing_tiers.length > 0) {
        const { error: pricingError } = await supabase
          .from("pricing_tiers")
          .insert(
            body.pricing_tiers.map((t: { min_days: number; per_day_cents: number }) => ({
              product_id: id,
              min_days: t.min_days,
              per_day_cents: t.per_day_cents,
            }))
          );

        if (pricingError) {
          console.error("[admin/products] Pricing update error:", pricingError);
        }
      }
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    console.error("[admin/products] PUT error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id] — Soft-delete (set is_active = false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/products] DELETE error:", err);
    return NextResponse.json({ error: "Failed to deactivate product" }, { status: 500 });
  }
}
