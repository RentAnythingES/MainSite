import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { productsToExcel, type ExcelProduct } from "@/lib/product-excel";

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
        category:categories!products_category_id_fkey (slug),
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

    const products = (data || []) as unknown as ExcelProduct[];
    if (products.length > 0) {
      const { data: memberships, error: membershipError } = await supabase
        .from("product_category_memberships")
        .select("product_id, category:categories!product_category_memberships_category_id_fkey(slug)")
        .eq("is_primary", false)
        .in("product_id", products.map((product) => product.id));
      if (membershipError) throw membershipError;

      const slugsByProduct = new Map<string, string[]>();
      for (const membership of memberships || []) {
        const category = Array.isArray(membership.category) ? membership.category[0] : membership.category;
        if (!category?.slug) continue;
        const slugs = slugsByProduct.get(String(membership.product_id)) || [];
        slugs.push(String(category.slug));
        slugsByProduct.set(String(membership.product_id), slugs);
      }
      for (const product of products) {
        product.secondary_category_slugs = (slugsByProduct.get(product.id) || []).sort();
      }
    }

    const excelBuffer = productsToExcel(products);
    const filename = `rentanything-products${status === "all" ? "" : `-${status}`}-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(new Uint8Array(excelBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[admin/products/export-excel] GET error:", error);
    return NextResponse.json({ error: "Failed to export products to Excel" }, { status: 500 });
  }
}
