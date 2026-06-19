import { supabase } from "./supabase";
import type { Product } from "@/data/products";
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

/**
 * Map a Supabase product row + pricing to the frontend Product interface
 */
function mapToProduct(row: Record<string, unknown>): Product {
  const pricingTiers = (row.pricing_tiers as Array<{ min_days: number; per_day_cents: number }>) || [];
  const category = row.category as { slug: string; name: string } | null;

  return {
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
    image: (row.image_url as string) || "/products/placeholder.png",
    city: (row.city as string) || "valencia",
    // FAQs are not yet in DB — will be added in future migration
    faqs: undefined,
  };
}

/**
 * Fetch all active products from Supabase, fall back to static
 */
export async function getProductsFromDB(city = "valencia"): Promise<Product[]> {
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
    if (!data || data.length === 0) return staticProducts.filter((p) => p.city === city);

    return data.map(mapToProduct);
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed, using static fallback:", err);
    return staticProducts.filter((p) => p.city === city);
  }
}

/**
 * Fetch a single product by slug from Supabase, fall back to static
 */
export async function getProductBySlugFromDB(slug: string): Promise<Product | null> {
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
      // Fall back to static for this slug (e.g., FAQs live there)
      return staticGetBySlug(slug) || null;
    }

    // Merge: DB data + static FAQs
    const dbProduct = mapToProduct(data);
    const staticProduct = staticGetBySlug(slug);
    if (staticProduct?.faqs) {
      dbProduct.faqs = staticProduct.faqs;
    }

    return dbProduct;
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed for slug:", slug, err);
    return staticGetBySlug(slug) || null;
  }
}

/**
 * Fetch products by category slug from Supabase, fall back to static
 */
export async function getProductsByCategoryFromDB(categorySlug: string): Promise<Product[]> {
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

    if (!cat) return staticGetByCategory(categorySlug);

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
    if (!data || data.length === 0) return staticGetByCategory(categorySlug);

    return data.map(mapToProduct);
  } catch (err) {
    console.warn("[product-service] Supabase category fetch failed:", categorySlug, err);
    return staticGetByCategory(categorySlug);
  }
}
