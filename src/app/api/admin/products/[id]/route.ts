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