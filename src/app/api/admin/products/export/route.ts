import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { productsToCsv, type ExportProduct } from "@/lib/product-csv";

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        brand,
        description,
        emoji,
        image_url,
        subcategory,
        subcategory_slug,
        city,
        stock_total,
        stock_available,
        is_active,
        content_status,
        meta_title,
        meta_description,
        features,
        specs,
        pricing_tiers (min_days, per_day_cents),
        category:categories (slug),
        product_localizations (
          locale,
          short_description,
          detail_description,
          includes_text,
          constraints_text,
          delivery_setup_note,
          care_note,
          seo_title,
          seo_description
        ),
        product_images (
          is_primary,
          alt_text,
          source_url,
          rights_status
        )
      `)
      .order("name");

    if (status === "active") query = query.eq("is_active", true);
    if (status === "archived") query = query.eq("is_active", false);

    const { data, error } = await query;
    if (error) throw error;

    const csv = productsToCsv((data || []) as ExportProduct[]);
    const filename = `rentanything-products${status === "all" ? "" : `-${status}`}-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[admin/products/export] GET error:", error);
    return NextResponse.json({ error: "Failed to export products" }, { status: 500 });
  }
}
