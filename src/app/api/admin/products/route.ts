import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getProductReadinessIssues } from "@/lib/product-validation";
import { products as legacyProducts } from "@/data/products";
import { seoCategorySlugs } from "@/data/seo-clusters";

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

type ProductSeoListRow = {
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  content_status: "draft" | "facts_verified" | "content_ready";
  category: { slug: string } | Array<{ slug: string }> | null;
  pricing_tiers: Array<{ min_days: number; per_day_cents: number }>;
  product_localizations: Array<{
    locale: string;
    short_description: string | null;
    seo_title: string | null;
    seo_description: string | null;
  }>;
  product_images: Array<{ is_primary: boolean; rights_status: string }>;
};

const legacySlugs = new Set(legacyProducts.map((product) => product.slug));
const publicCategorySlugs = new Set<string>(seoCategorySlugs);
const approvedImageRights = new Set(["owned", "licensed", "manufacturer_approved"]);

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUsableImage(value: unknown) {
  const imageUrl = String(value || "").trim();
  return (
    ((imageUrl.startsWith("/") && !imageUrl.startsWith("//")) || /^https?:\/\//i.test(imageUrl)) &&
    imageUrl !== "/products/placeholder.png"
  );
}

function getSeoReadiness(row: ProductSeoListRow) {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const primaryImage = row.product_images.find((image) => image.is_primary);
  const spanish = row.product_localizations.find((localization) => localization.locale === "es");
  const blockersEn: string[] = [];

  if (!row.is_active) blockersEn.push("Product is inactive");
  if (!category?.slug || !publicCategorySlugs.has(category.slug)) blockersEn.push("Category is not an approved SEO cluster");
  if (!hasText(row.name) || !hasText(row.description)) blockersEn.push("Core product copy is incomplete");
  if (!hasUsableImage(row.image_url)) blockersEn.push("Usable product image is missing");
  if (row.pricing_tiers.length === 0) blockersEn.push("Pricing is missing");
  if (
    !legacySlugs.has(row.slug) &&
    (row.content_status !== "content_ready" || !primaryImage || !approvedImageRights.has(primaryImage.rights_status))
  ) {
    blockersEn.push("Editorial or image-rights approval is incomplete");
  }

  const blockersEs = [...blockersEn];
  if (!legacySlugs.has(row.slug) && row.content_status !== "content_ready") blockersEs.push("Content status is not ready");
  if (!spanish || !hasText(spanish.short_description) || !hasText(spanish.seo_title) || !hasText(spanish.seo_description)) {
    blockersEs.push("Spanish SEO copy is incomplete");
  }

  return {
    indexableEn: blockersEn.length === 0,
    indexableEs: blockersEs.length === 0,
    blockersEn,
    blockersEs: [...new Set(blockersEs)],
  };
}

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
        category:categories (id, slug, name),
        product_localizations (locale, short_description, seo_title, seo_description),
        product_images (is_primary, rights_status)
      `)
      .order("name");

    if (error) throw error;

    const products = ((data || []) as unknown as ProductSeoListRow[]).map((row) => {
      const product: Partial<ProductSeoListRow> = { ...row };
      delete product.product_localizations;
      delete product.product_images;
      return { ...product, seo: getSeoReadiness(row) };
    });

    return NextResponse.json({ products });
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
        // New products must be reviewed through the content workflow before publication.
        is_active: false,
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
