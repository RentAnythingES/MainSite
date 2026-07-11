import { supabase } from "./supabase";
import type { Product, ProductFAQ } from "@/data/products";
import { products as staticProducts, getProductBySlug as staticGetBySlug, getProductsByCategory as staticGetByCategory } from "@/data/products";

/**
 * Product Service — Supabase-first with static fallback
 * 
 * Strategy:
 * - At runtime with valid Supabase credentials → fetch from DB
 * - During build or without credentials → use static products.ts
 * - This ensures `npx next build` always works (SSG) even without DB
 */

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("placeholder");
};

function normalizeImageUrl(value: unknown): string {
  const imageUrl = String(value || "").trim();

  if (!imageUrl) return "/products/placeholder.png";
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  return "/products/placeholder.png";
}

type ProductLocale = "en" | "es";

type ProductLocalization = {
  short_description: string | null;
  detail_description: string | null;
  includes_text: string | null;
  constraints_text: string | null;
  delivery_setup_note: string | null;
  care_note: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type ProductFaqRow = {
  question: string;
  answer: string;
};

type ProductImage = {
  image_url: string;
  alt_text: string | null;
  rights_status: "unknown" | "owned" | "licensed" | "manufacturer_approved";
};

interface OptionalContentQuery<T> {
  eq: (column: string, value: string | boolean) => OptionalContentQuery<T>;
  order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: T[] | null; error: unknown }>;
}

interface OptionalContentClient {
  from: <T>(table: string) => {
    select: (columns: string) => OptionalContentQuery<T>;
  };
}

function isMissingOptionalContentTable(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "42P01" || code === "PGRST205";
}

function canUseEditorialImage(image: ProductImage | undefined): image is ProductImage {
  return Boolean(
    image &&
    ["owned", "licensed", "manufacturer_approved"].includes(image.rights_status) &&
    normalizeImageUrl(image.image_url) !== "/products/placeholder.png"
  );
}

async function enrichProductWithEditorialContent(product: Product, locale: ProductLocale): Promise<Product> {
  if (!product.id || product.contentStatus !== "content_ready") return product;

  const contentClient = supabase as unknown as OptionalContentClient;
  const [localizationResult, faqResult, imageResult] = await Promise.all([
    contentClient
      .from<ProductLocalization>("product_localizations")
      .select("*")
      .eq("product_id", product.id)
      .eq("locale", locale)
      .order("updated_at", { ascending: false }),
    contentClient
      .from<ProductFaqRow>("product_faqs")
      .select("question, answer")
      .eq("product_id", product.id)
      .eq("locale", locale)
      .order("sort_order", { ascending: true }),
    contentClient
      .from<ProductImage>("product_images")
      .select("image_url, alt_text, rights_status")
      .eq("product_id", product.id)
      .eq("is_primary", true)
      .order("sort_order", { ascending: true }),
  ]);

  for (const result of [localizationResult, faqResult, imageResult]) {
    if (result.error && !isMissingOptionalContentTable(result.error)) {
      console.warn("[product-service] Optional editorial content fetch failed:", result.error);
    }
  }

  const localization = localizationResult.data?.[0];
  const faqs: ProductFAQ[] = (faqResult.data || [])
    .filter((faq) => faq.question.trim() && faq.answer.trim())
    .map((faq) => ({ question: faq.question, answer: faq.answer }));
  const primaryImage = imageResult.data?.[0];

  return {
    ...product,
    description: localization?.short_description?.trim() || product.description,
    detailDescription: localization?.detail_description?.trim() || undefined,
    includesText: localization?.includes_text?.trim() || undefined,
    constraintsText: localization?.constraints_text?.trim() || undefined,
    deliverySetupNote: localization?.delivery_setup_note?.trim() || undefined,
    careNote: localization?.care_note?.trim() || undefined,
    seoTitle: localization?.seo_title?.trim() || undefined,
    seoDescription: localization?.seo_description?.trim() || undefined,
    image: canUseEditorialImage(primaryImage) ? normalizeImageUrl(primaryImage.image_url) : product.image,
    imageAlt: canUseEditorialImage(primaryImage) ? primaryImage.alt_text?.trim() || product.name : product.name,
    faqs: faqs.length > 0 ? faqs : product.faqs,
  };
}

/**
 * Map a Supabase product row + pricing to the frontend Product interface
 */
function mapToProduct(row: Record<string, unknown>): Product {
  const pricingTiers = (row.pricing_tiers as Array<{ min_days: number; per_day_cents: number }>) || [];
  const category = row.category as { slug: string; name: string } | null;

  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: category?.name || "",
    subcategory: row.subcategory as string,
    categorySlug: category?.slug || "",
    subcategorySlug: row.subcategory_slug as string,
    description: row.description as string,
    features: (row.features as string[]) || [],
    specs: (row.specs as Record<string, string>) || {},
    pricing: pricingTiers
      .sort((a, b) => a.min_days - b.min_days)
      .map((t) => ({ days: t.min_days, perDay: t.per_day_cents / 100 })),
    emoji: row.emoji as string,
    image: normalizeImageUrl(row.image_url),
    imageAlt: row.name as string,
    contentStatus: row.content_status as Product["contentStatus"],
    city: (row.city as string) || "valencia",
    // FAQs are not yet in DB — will be added in future migration
    faqs: undefined,
  };
}

/**
 * Fetch all active products from Supabase, fall back to static
 */
export async function getProductsFromDB(city = "valencia", locale: ProductLocale = "en"): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts.filter((p) => p.city === city);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories (*)
      `)
      .eq("city", city)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    if (!data) return [];

    return Promise.all(data.map((row) => enrichProductWithEditorialContent(mapToProduct(row), locale)));
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed, using static fallback:", err);
    return staticProducts.filter((p) => p.city === city);
  }
}

/**
 * Fetch a single product by slug from Supabase, fall back to static
 */
export async function getProductBySlugFromDB(slug: string, locale: ProductLocale = "en"): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return staticGetBySlug(slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories (*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      const code = (error as { code?: string } | null)?.code;
      if (code === "PGRST116") return null;
      throw error || new Error("Product not found");
    }

    // Merge: DB data + static FAQs
    const dbProduct = mapToProduct(data);
    const staticProduct = staticGetBySlug(slug);
    if (staticProduct?.faqs) {
      dbProduct.faqs = staticProduct.faqs;
    }

    return enrichProductWithEditorialContent(dbProduct, locale);
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed for slug:", slug, err);
    return staticGetBySlug(slug) || null;
  }
}

/**
 * Fetch products by category slug from Supabase, fall back to static
 */
export async function getProductsByCategoryFromDB(categorySlug: string, locale: ProductLocale = "en"): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticGetByCategory(categorySlug);
  }

  try {
    // Get category ID first
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!cat) return [];

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories (*)
      `)
      .eq("category_id", (cat as { id: string }).id)
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    if (!data) return [];

    return Promise.all(data.map((row) => enrichProductWithEditorialContent(mapToProduct(row), locale)));
  } catch (err) {
    console.warn("[product-service] Supabase category fetch failed:", categorySlug, err);
    return staticGetByCategory(categorySlug);
  }
}
