import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const MAX_IMPORT_ROWS = 100;
const PRICE_COLUMNS = [
  ["price_1_day", 1],
  ["price_3_days", 3],
  ["price_7_days", 7],
  ["price_14_days", 14],
] as const;

type ImportRow = Record<string, unknown>;

type Category = {
  id: string;
  slug: string;
  name: string;
};

type PreparedRow = {
  row: number;
  name: string;
  slug: string;
  issues: string[];
  product?: Record<string, unknown>;
  pricingTiers?: { min_days: number; per_day_cents: number }[];
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : String(value || "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function parseStock(value: unknown) {
  const parsed = Number(text(value));
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
}

function parsePrice(value: unknown) {
  const raw = text(value).replace(",", ".");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : undefined;
}

function prepareRows(rows: ImportRow[], categories: Category[], existingSlugs: Set<string>) {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const seenSlugs = new Set<string>();

  return rows.map((row, index): PreparedRow => {
    const name = text(row.name);
    const brand = text(row.brand);
    const description = text(row.description);
    const categorySlug = slugify(text(row.category_slug));
    const subcategory = text(row.subcategory);
    const stockTotal = parseStock(row.stock_total);
    const slug = slugify(text(row.slug) || name);
    const issues: string[] = [];

    if (!name) issues.push("Product name is required");
    if (!brand) issues.push("Brand is required");
    if (!description) issues.push("Description is required");
    if (!categoryBySlug.has(categorySlug)) issues.push("Category slug does not match an existing category");
    if (!subcategory) issues.push("Subcategory is required");
    if (!stockTotal) issues.push("Stock total must be a whole number of at least 1");
    if (!slug) issues.push("A valid slug could not be created");
    if (existingSlugs.has(slug)) issues.push(`Slug '${slug}' already exists`);
    if (seenSlugs.has(slug)) issues.push(`Slug '${slug}' is duplicated in this file`);
    seenSlugs.add(slug);

    const pricingTiers: { min_days: number; per_day_cents: number }[] = [];
    for (const [column, minDays] of PRICE_COLUMNS) {
      const price = parsePrice(row[column]);
      if (price === undefined) {
        issues.push(`${column} must be a valid euro amount`);
      } else if (price !== null) {
        pricingTiers.push({ min_days: minDays, per_day_cents: price });
      }
    }

    if (pricingTiers.length === 0) issues.push("At least one daily price is required");

    const category = categoryBySlug.get(categorySlug);
    return {
      row: index + 2,
      name,
      slug,
      issues,
      product: issues.length === 0 && category && stockTotal ? {
        slug,
        name,
        brand,
        description,
        emoji: text(row.emoji) || "📦",
        image_url: null,
        category_id: category.id,
        subcategory,
        subcategory_slug: slugify(text(row.subcategory_slug) || subcategory),
        city: text(row.city) || "valencia",
        stock_total: stockTotal,
        stock_available: stockTotal,
        is_active: false,
        features: [],
        specs: {},
      } : undefined,
      pricingTiers,
    };
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as { mode?: "preview" | "commit"; products?: ImportRow[] };
    const rows = Array.isArray(body.products) ? body.products : [];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Choose a CSV file with at least one product row" }, { status: 400 });
    }
    if (rows.length > MAX_IMPORT_ROWS) {
      return NextResponse.json({ error: `Import at most ${MAX_IMPORT_ROWS} products at a time` }, { status: 400 });
    }

    const supabase = createAdminClient();
    const [{ data: categories, error: categoryError }, { data: existingProducts, error: productError }] = await Promise.all([
      supabase.from("categories").select("id, slug, name"),
      supabase.from("products").select("slug"),
    ]);

    if (categoryError || productError) throw categoryError || productError;

    const prepared = prepareRows(
      rows,
      (categories || []) as Category[],
      new Set((existingProducts || []).map((product) => String(product.slug)))
    );
    const invalidRows = prepared.filter((row) => row.issues.length > 0);

    if (body.mode !== "commit") {
      return NextResponse.json({
        rows: prepared.map(({ product, pricingTiers, ...row }) => ({ ...row, pricingTiers })),
        valid: invalidRows.length === 0,
      });
    }

    if (invalidRows.length > 0) {
      return NextResponse.json({ error: "Fix the rows marked in the preview before importing", rows: invalidRows }, { status: 400 });
    }

    const productsToInsert = prepared.map((row) => row.product!);
    const { data: createdProducts, error: insertError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select("id, slug");

    if (insertError || !createdProducts) throw insertError || new Error("Product import did not return created products");

    const idBySlug = new Map(createdProducts.map((product) => [product.slug, product.id]));
    const pricingRows = prepared.flatMap((row) => row.pricingTiers!.map((tier) => ({
      product_id: idBySlug.get(row.slug),
      ...tier,
    })));
    const { error: pricingError } = await supabase.from("pricing_tiers").insert(pricingRows);

    if (pricingError) {
      await supabase.from("products").delete().in("id", createdProducts.map((product) => product.id));
      throw pricingError;
    }

    return NextResponse.json({ imported: createdProducts.length, products: createdProducts }, { status: 201 });
  } catch (error) {
    console.error("[admin/products/import] POST error:", error);
    return NextResponse.json({ error: "Product import failed. No products were added." }, { status: 500 });
  }
}
