import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { invalidatePublicProductCache } from "@/lib/product-cache";
import { buildLocalizationFromRow } from "@/lib/product-csv";
import { parseExcelBuffer } from "@/lib/product-excel";

const MAX_IMPORT_ROWS = 500;
const PRICE_COLUMNS = [
  ["price_1_day", 1],
  ["price_3_days", 3],
  ["price_7_days", 7],
  ["price_14_days", 14],
] as const;

const CONTENT_STATUSES = new Set(["draft", "facts_verified", "content_ready"]);
const IMAGE_RIGHTS = new Set(["unknown", "owned", "licensed", "manufacturer_approved"]);

type ImportRow = Record<string, unknown>;

type Category = {
  id: string;
  slug: string;
  name: string;
};

type ExistingProduct = {
  id: string;
  slug: string;
  image_url: string | null;
};

type PreparedRow = {
  row: number;
  id: string;
  name: string;
  slug: string;
  action: "create" | "update";
  issues: string[];
  sourceRow?: ImportRow;
  product?: Record<string, unknown>;
  pricingTiers?: { min_days: number; per_day_cents: number }[];
  localizations?: Array<Record<string, unknown>>;
  primaryImage?: {
    alt_text: string | null;
    source_url: string | null;
    rights_status: string;
  };
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : String(value || "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function parseStock(value: unknown) {
  const parsed = Number(text(value));
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
}

function parseFeatures(value: unknown) {
  const raw = text(value);
  if (!raw) return [];
  return raw.split("|").map((feature) => feature.trim()).filter(Boolean);
}

function parseSpecs(value: unknown) {
  const raw = text(value);
  if (!raw) return {};
  const specs: Record<string, string> = {};
  raw.split(";").forEach((part) => {
    const separator = part.indexOf("=");
    if (separator <= 0) return;
    const key = part.slice(0, separator).trim();
    const specValue = part.slice(separator + 1).trim();
    if (key && specValue) specs[key] = specValue;
  });
  return specs;
}

function parseBoolean(value: unknown, fallback: boolean) {
  const raw = text(value).toLowerCase();
  if (!raw) return fallback;
  if (["true", "1", "yes"].includes(raw)) return true;
  if (["false", "0", "no"].includes(raw)) return false;
  return fallback;
}

function parseOptionalBoolean(value: unknown) {
  const raw = text(value).toLowerCase();
  if (!raw) return undefined;
  if (["true", "1", "yes"].includes(raw)) return true;
  if (["false", "0", "no"].includes(raw)) return false;
  return undefined;
}

function parsePrice(value: unknown) {
  const raw = text(value).replace(",", ".");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : undefined;
}

function parseContentStatus(value: unknown, fallback = "draft") {
  const raw = text(value) as "draft" | "facts_verified" | "content_ready";
  return CONTENT_STATUSES.has(raw) ? raw : fallback;
}

function parseOptionalContentStatus(value: unknown) {
  const raw = text(value) as "draft" | "facts_verified" | "content_ready";
  return CONTENT_STATUSES.has(raw) ? raw : undefined;
}

function resolveExistingProduct(
  row: ImportRow,
  slug: string,
  productsById: Map<string, ExistingProduct>,
) {
  const id = text(row.id);
  if (id && productsById.has(id)) return productsById.get(id)!;
  return null;
}

function prepareRows(
  rows: ImportRow[],
  categories: Category[],
  productsById: Map<string, ExistingProduct>,
  productsBySlug: Map<string, ExistingProduct>,
) {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();

  return rows.map((row, index): PreparedRow => {
    const name = text(row.name);
    const brand = text(row.brand);
    const description = text(row.description);
    const categorySlug = slugify(text(row.category_slug));
    const subcategory = text(row.subcategory);
    const stockTotal = parseStock(row.stock_total);
    const importedSlug = slugify(text(row.slug) || name);
    const rowId = text(row.id);
    const existing = resolveExistingProduct(row, importedSlug, productsById);
    const slug = existing?.slug || importedSlug;
    const action: "create" | "update" = existing ? "update" : "create";
    const issues: string[] = [];

    if (!name) issues.push("Product name is required");
    if (!description) issues.push("Description is required");
    if (!categoryBySlug.has(categorySlug)) issues.push("Category slug does not match an existing category");
    if (!subcategory) issues.push("Subcategory is required");
    if (!stockTotal) issues.push("Stock total must be a whole number of at least 1");
    if (!slug) issues.push("A valid slug could not be created");

    if (rowId && !existing) {
      issues.push(`ID '${rowId}' does not exist. Clear the ID to create a new product.`);
    } else if (!rowId && productsBySlug.has(slug)) {
      issues.push(`Slug '${slug}' already exists. Use its exported ID to update that product.`);
    }

    if (seenSlugs.has(slug)) issues.push(`Slug '${slug}' is duplicated in this file`);
    seenSlugs.add(slug);

    if (rowId) {
      if (seenIds.has(rowId)) issues.push(`ID '${rowId}' is duplicated in this file`);
      seenIds.add(rowId);
    }

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

    const stockAvailableRaw = Number(text(row.stock_available));
    const stockAvailable = Number.isInteger(stockAvailableRaw) && stockAvailableRaw >= 0
      ? stockAvailableRaw
      : stockTotal;

    const imageRights = text(row.image_rights_status) || "unknown";
    if (imageRights && !IMAGE_RIGHTS.has(imageRights)) {
      issues.push("image_rights_status must be unknown, owned, licensed, or manufacturer_approved");
    }

    const english = buildLocalizationFromRow(row, "en");
    const spanish = buildLocalizationFromRow(row, "es");
    const localizations = [english, spanish].filter(Boolean).map((localization) => ({
      locale: localization!.locale,
      short_description: localization!.short_description,
      detail_description: localization!.detail_description,
      includes_text: localization!.includes_text,
      constraints_text: localization!.constraints_text,
      delivery_setup_note: localization!.delivery_setup_note,
      care_note: localization!.care_note,
      seo_title: localization!.seo_title,
      seo_description: localization!.seo_description,
    }));

    const primaryImage = text(row.image_alt_text) || text(row.image_source_url) || text(row.image_rights_status)
      ? {
          alt_text: text(row.image_alt_text) || null,
          source_url: text(row.image_source_url) || null,
          rights_status: IMAGE_RIGHTS.has(imageRights) ? imageRights : "unknown",
        }
      : undefined;

    const category = categoryBySlug.get(categorySlug);
    const productPayload: Record<string, unknown> = {
      slug,
      name,
      brand,
      description,
      emoji: text(row.emoji) || "📦",
      image_url: text(row.image_url) || existing?.image_url || null,
      category_id: category!.id,
      subcategory,
      subcategory_slug: slugify(text(row.subcategory_slug) || subcategory),
      city: text(row.city) || "valencia",
      stock_total: stockTotal,
      stock_available: stockAvailable ?? stockTotal,
      meta_title: text(row.meta_title) || null,
      meta_description: text(row.meta_description) || null,
      features: parseFeatures(row.features),
      specs: parseSpecs(row.specs),
    };

    if (action === "update") {
      const active = parseOptionalBoolean(row.is_active);
      if (active !== undefined) productPayload.is_active = active;
      const contentStatus = parseOptionalContentStatus(row.content_status);
      if (contentStatus) productPayload.content_status = contentStatus;
    } else {
      productPayload.is_active = parseBoolean(row.is_active, false);
      productPayload.content_status = parseContentStatus(row.content_status, "draft");
    }

    return {
      row: index + 2,
      id: existing?.id || rowId,
      name,
      slug,
      action,
      issues,
      sourceRow: row,
      product: issues.length === 0 && category && stockTotal ? productPayload : undefined,
      pricingTiers,
      localizations: localizations.length > 0 ? localizations : undefined,
      primaryImage,
    };
  });
}

async function replacePricingTiers(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  tiers: { min_days: number; per_day_cents: number }[],
) {
  const { error: deleteError } = await supabase.from("pricing_tiers").delete().eq("product_id", productId);
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("pricing_tiers").insert(
    tiers.map((tier) => ({ product_id: productId, ...tier })),
  );
  if (insertError) throw insertError;
}

async function upsertLocalizations(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  localizations: Array<Record<string, unknown>>,
) {
  const { error } = await supabase.from("product_localizations").upsert(
    localizations.map((localization) => ({ product_id: productId, ...localization })),
    { onConflict: "product_id,locale" },
  );
  if (error) throw error;
}

async function upsertPrimaryImage(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  imageUrl: string | null,
  primaryImage: PreparedRow["primaryImage"],
) {
  if (!imageUrl || !primaryImage) return;

  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .eq("is_primary", true);
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: imageUrl,
    alt_text: primaryImage.alt_text,
    source_url: primaryImage.source_url,
    rights_status: primaryImage.rights_status,
    is_primary: true,
  });
  if (insertError) throw insertError;
}

async function processImport(rows: ImportRow[], mode: "preview" | "commit") {
  const supabase = createAdminClient();
  const [{ data: categories, error: categoryError }, { data: existingProducts, error: productError }] = await Promise.all([
    supabase.from("categories").select("id, slug, name"),
    supabase.from("products").select("id, slug, image_url"),
  ]);

  if (categoryError || productError) throw categoryError || productError;

  const existing = (existingProducts || []) as ExistingProduct[];
  const productsById = new Map(existing.map((product) => [product.id, product]));
  const productsBySlug = new Map(existing.map((product) => [product.slug, product]));

  const prepared = prepareRows(rows, (categories || []) as Category[], productsById, productsBySlug);
  const invalidRows = prepared.filter((row) => row.issues.length > 0);

  if (mode !== "commit") {
    return {
      rows: prepared.map(({ product, pricingTiers, localizations, primaryImage, ...previewRow }) => previewRow),
      valid: invalidRows.length === 0,
      creates: prepared.filter((row) => row.action === "create").length,
      updates: prepared.filter((row) => row.action === "update").length,
    };
  }

  const validRows = prepared.filter((row) => row.issues.length === 0);

  if (validRows.length === 0) {
    throw new Error("No valid rows are available to import");
  }

  let created = 0;
  let updated = 0;
  const affectedIds: string[] = [];

  for (const row of validRows) {
    if (row.action === "update") {
      const existingProduct = productsById.get(row.id);
      if (!existingProduct) continue;

      const { error: updateError } = await supabase
        .from("products")
        .update(row.product!)
        .eq("id", existingProduct.id);
      if (updateError) throw updateError;

      await replacePricingTiers(supabase, existingProduct.id, row.pricingTiers!);
      if (row.localizations?.length) {
        await upsertLocalizations(supabase, existingProduct.id, row.localizations);
      }
      await upsertPrimaryImage(
        supabase,
        existingProduct.id,
        String(row.product!.image_url || existingProduct.image_url || "") || null,
        row.primaryImage,
      );

      updated += 1;
      affectedIds.push(existingProduct.id);
      continue;
    }

    const { data: createdProduct, error: insertError } = await supabase
      .from("products")
      .insert(row.product!)
      .select("id, slug")
      .single();
    if (insertError || !createdProduct) throw insertError || new Error("Product import did not return created product");

    await replacePricingTiers(supabase, createdProduct.id, row.pricingTiers!);
    if (row.localizations?.length) {
      await upsertLocalizations(supabase, createdProduct.id, row.localizations);
    }
    await upsertPrimaryImage(
      supabase,
      createdProduct.id,
      String(row.product!.image_url || "") || null,
      row.primaryImage,
    );

    created += 1;
    affectedIds.push(createdProduct.id);
  }

  invalidatePublicProductCache();
  return {
    imported: created + updated,
    created,
    updated,
    skipped: invalidRows.length,
    invalid: invalidRows.length,
    productIds: affectedIds,
  };
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload (CSV or Excel)
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const mode = formData.get("mode") as "preview" | "commit" || "preview";

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      let rows: ImportRow[] = [];

      if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
        const csvText = await file.text();
        // Parse CSV
        const rowsArray: string[][] = [];
        let row: string[] = [];
        let cell = "";
        let quoted = false;

        for (let index = 0; index < csvText.length; index += 1) {
          const character = csvText[index];
          if (character === '"') {
            if (quoted && csvText[index + 1] === '"') {
              cell += '"';
              index += 1;
            } else {
              quoted = !quoted;
            }
          } else if (character === "," && !quoted) {
            row.push(cell.trim());
            cell = "";
          } else if ((character === "\n" || character === "\r") && !quoted) {
            if (character === "\r" && csvText[index + 1] === "\n") index += 1;
            row.push(cell.trim());
            if (row.some(Boolean)) rowsArray.push(row);
            row = [];
            cell = "";
          } else {
            cell += character;
          }
        }

        row.push(cell.trim());
        if (row.some(Boolean)) rowsArray.push(row);
        if (rowsArray.length < 2) {
          return NextResponse.json({ error: "The file needs a header row and at least one product row." }, { status: 400 });
        }

        const headers = rowsArray[0].map((header) => header.trim().toLowerCase());
        rows = rowsArray.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
      } else if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
        const buffer = Buffer.from(await file.arrayBuffer());
        rows = parseExcelBuffer(buffer);
      } else {
        return NextResponse.json({ error: "Unsupported file format. Use CSV or Excel (.xlsx)" }, { status: 400 });
      }

      if (rows.length === 0) {
        return NextResponse.json({ error: "The file needs a header row and at least one product row." }, { status: 400 });
      }
      if (rows.length > MAX_IMPORT_ROWS) {
        return NextResponse.json({ error: `Import at most ${MAX_IMPORT_ROWS} products at a time` }, { status: 400 });
      }

      const result = await processImport(rows, mode);

      if (mode !== "commit") {
        return NextResponse.json(result);
      }

      return NextResponse.json(result, { status: 201 });
    } else {
      // Handle JSON body (existing API for backward compatibility)
      const body = await request.json() as { mode?: "preview" | "commit"; products?: ImportRow[] };
      const rows = Array.isArray(body.products) ? body.products : [];

      if (rows.length === 0) {
        return NextResponse.json({ error: "Choose a CSV file with at least one product row" }, { status: 400 });
      }
      if (rows.length > MAX_IMPORT_ROWS) {
        return NextResponse.json({ error: `Import at most ${MAX_IMPORT_ROWS} products at a time` }, { status: 400 });
      }

      const result = await processImport(rows, body.mode || "preview");

      if (body.mode !== "commit") {
        return NextResponse.json(result);
      }

      return NextResponse.json(result, { status: 201 });
    }
  } catch (error) {
    console.error("[admin/products/import] POST error:", error);
    return NextResponse.json({ error: "Product import failed. Review the file and try again." }, { status: 500 });
  }
}
