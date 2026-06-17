import { supabase } from "./supabase";
import type { ProductWithPricing, Category } from "./types";

/**
 * Fetch all active products with their pricing tiers and category
 */
export async function getProducts(city = "valencia"): Promise<ProductWithPricing[]> {
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

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return (data as ProductWithPricing[]) ?? [];
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductWithPricing | null> {
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

  if (error) return null;
  return data as ProductWithPricing;
}

/**
 * Fetch products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductWithPricing[]> {
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

  if (error) throw new Error(`Failed to fetch category products: ${error.message}`);
  return (data as ProductWithPricing[]) ?? [];
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return (data as Category[]) ?? [];
}

/**
 * Check product availability for a date range
 */
export async function checkAvailability(
  productId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; blockedDates: string[] }> {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("blocked_date")
    .eq("product_id", productId)
    .gte("blocked_date", startDate)
    .lte("blocked_date", endDate);

  if (error) throw new Error(`Failed to check availability: ${error.message}`);

  const blockedDates = (data ?? []).map((d: { blocked_date: string }) => d.blocked_date);
  return {
    available: blockedDates.length === 0,
    blockedDates,
  };
}

/**
 * Calculate the best pricing tier for a given number of days
 */
export function calculatePrice(
  pricingTiers: { min_days: number; per_day_cents: number }[],
  days: number
): { perDayCents: number; totalCents: number } {
  const sorted = [...pricingTiers].sort((a, b) => b.min_days - a.min_days);
  const tier = sorted.find((t) => days >= t.min_days) ?? sorted[sorted.length - 1];

  return {
    perDayCents: tier.per_day_cents,
    totalCents: tier.per_day_cents * days,
  };
}
