import { supabase } from "./supabase";
import type { Product, ProductFAQ } from "@/data/products";
import { products as staticProducts, getProductBySlug as staticGetBySlug, getProductsByCategory as staticGetByCategory } from "@/data/products";
import { seoCategorySlugs } from "@/data/seo-clusters";
import { unstable_cache } from "next/cache";
import { PUBLIC_PRODUCT_CACHE_TAG } from "@/lib/product-cache";

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

const staticWebpProductImages = new Set([
  ...staticProducts.map((product) => product.image),
  "/products/delonghi-pinguino-pac-es72.webp",
]);

function normalizeImageUrl(value: unknown): string {
  const imageUrl = String(value || "").trim();

  if (!imageUrl) return "/products/placeholder.png";
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) {
    const webpPath = imageUrl.replace(/\.(?:jpe?g|png)$/i, ".webp");
    return staticWebpProductImages.has(webpPath) ? webpPath : imageUrl;
  }
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  return "/products/placeholder.png";
}

type ProductLocale = "en" | "es";

type ProductLocalization = {
  product_id: string;
  locale: ProductLocale;
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
  product_id: string;
  locale: ProductLocale;
  question: string;
  answer: string;
  sort_order?: number;
};

type ProductImage = {
  product_id: string;
  image_url: string;
  alt_text: string | null;
  rights_status: "unknown" | "owned" | "licensed" | "manufacturer_approved";
  is_primary?: boolean;
  sort_order?: number;
};

type ProductSeoLocalization = {
  locale: ProductLocale;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type ProductSeoImage = {
  is_primary: boolean;
  rights_status: ProductImage["rights_status"];
};

type ProductSeoRow = {
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  content_status: Product["contentStatus"];
  updated_at: string;
  category: { slug: string } | Array<{ slug: string }> | null;
  pricing_tiers: Array<{ min_days: number }>;
  product_localizations: ProductSeoLocalization[];
  product_images: ProductSeoImage[];
};

export type ProductSeoState = {
  slug: string;
  categorySlug: string;
  updatedAt: string | null;
  indexableEn: boolean;
  indexableEs: boolean;
};

const legacyStaticSlugs = new Set(staticProducts.map((product) => product.slug));
const publicSeoCategorySlugs = new Set<string>(seoCategorySlugs);
function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function mapProductSeoState(row: ProductSeoRow): ProductSeoState {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const hasPublicCategory = Boolean(category?.slug && publicSeoCategorySlugs.has(category.slug));
  const isLegacyProduct = legacyStaticSlugs.has(row.slug);
  const hasCoreEnglishContent =
    hasText(row.name) &&
    hasText(row.description) &&
    normalizeImageUrl(row.image_url) !== "/products/placeholder.png" &&
    row.pricing_tiers.length > 0;
  const hasEditorialApproval = isLegacyProduct || row.content_status === "content_ready";
  const spanish = row.product_localizations.find(
    (localization) => localization.locale === "es"
  );

  const indexableEn =
    row.is_active && hasPublicCategory && hasCoreEnglishContent && hasEditorialApproval;
  const indexableEs = Boolean(
    indexableEn &&
    (isLegacyProduct || row.content_status === "content_ready") &&
    spanish &&
    hasText(spanish.short_description) &&
    hasText(spanish.seo_title) &&
    hasText(spanish.seo_description)
  );

  return {
    slug: row.slug,
    categorySlug: category?.slug || "",
    updatedAt: row.updated_at || null,
    indexableEn,
    indexableEs,
  };
}

function staticProductSeoState(slug: string): ProductSeoState | null {
  const product = staticGetBySlug(slug);
  if (!product) return null;

  return {
    slug,
    categorySlug: product.categorySlug,
    updatedAt: null,
    indexableEn:
      publicSeoCategorySlugs.has(product.categorySlug) && product.pricing.length > 0,
    indexableEs: false,
  };
}

async function fetchProductSeoRows(slug?: string): Promise<ProductSeoRow[]> {
  let query = supabase
    .from("products")
    .select(`
      slug,
      name,
      description,
      image_url,
      is_active,
      content_status,
      updated_at,
      category:categories (slug),
      pricing_tiers (min_days),
      product_localizations (locale, short_description, seo_title, seo_description),
      product_images (is_primary, rights_status)
    `)
    .eq("is_active", true);

  if (slug) query = query.eq("slug", slug);

  const { data, error } = await query.order("slug");
  if (error) throw error;

  return (data || []) as unknown as ProductSeoRow[];
}

function canUseEditorialImage(image: ProductImage | undefined): image is ProductImage {
  return Boolean(
    image &&
    ["owned", "licensed", "manufacturer_approved"].includes(image.rights_status) &&
    normalizeImageUrl(image.image_url) !== "/products/placeholder.png"
  );
}

function mergeProductEditorialContent(
  product: Product,
  localization: ProductLocalization | undefined,
  faqRows: ProductFaqRow[],
  primaryImage: ProductImage | undefined,
): Product {
  const faqs: ProductFAQ[] = faqRows
    .filter((faq) => faq.question.trim() && faq.answer.trim())
    .map((faq) => ({ question: faq.question, answer: faq.answer }));

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
    stockTotal: Number(row.stock_total || 1),
    stockAvailable: Number(row.stock_available || 0),
    city: (row.city as string) || "valencia",
    // FAQs are not yet in DB — will be added in future migration
    faqs: undefined,
  };
}

function mapEmbeddedProduct(row: Record<string, unknown>, locale: ProductLocale): Product {
  const product = mapToProduct(row);
  const staticProduct = staticGetBySlug(product.slug);
  if (staticProduct?.faqs) product.faqs = staticProduct.faqs;

  const canUseLocalizedContent = legacyStaticSlugs.has(product.slug) || product.contentStatus === "content_ready";
  if (!canUseLocalizedContent) return product;

  const localization = ((row.product_localizations as ProductLocalization[] | undefined) || [])
    .find((entry) => entry.locale === locale);
  const faqs = ((row.product_faqs as ProductFaqRow[] | undefined) || [])
    .filter((entry) => entry.locale === locale)
    .sort((left, right) => (left.sort_order || 0) - (right.sort_order || 0));
  const primaryImage = ((row.product_images as ProductImage[] | undefined) || [])
    .filter((entry) => entry.is_primary !== false)
    .sort((left, right) => (left.sort_order || 0) - (right.sort_order || 0))[0];

  return mergeProductEditorialContent(product, localization, faqs, primaryImage);
}

/**
 * Fetch all active products from Supabase, fall back to static
 */
async function fetchProductsFromDB(city: string, locale: ProductLocale): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories (*),
        product_localizations (*),
        product_faqs (*),
        product_images (*)
      `)
      .eq("city", city)
      .eq("is_active", true)
      .eq("product_localizations.locale", locale)
      .eq("product_faqs.locale", locale)
      .eq("product_images.is_primary", true)
      .order("name");

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => mapEmbeddedProduct(row, locale));
}

const getCachedProducts = unstable_cache(fetchProductsFromDB, ["public-product-list"], {
  tags: [PUBLIC_PRODUCT_CACHE_TAG],
  revalidate: 300,
});

export async function getProductsFromDB(city = "valencia", locale: ProductLocale = "en"): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts.filter((p) => p.city === city);
  }

  try {
    return await getCachedProducts(city, locale);
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed, using static fallback:", err);
    return staticProducts.filter((p) => p.city === city);
  }
}

/**
 * Fetch a single product by slug from Supabase, fall back to static
 */
async function fetchProductBySlugFromDB(slug: string, locale: ProductLocale): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories (*),
        product_localizations (*),
        product_faqs (*),
        product_images (*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("product_localizations.locale", locale)
      .eq("product_faqs.locale", locale)
      .eq("product_images.is_primary", true)
      .single();

    if (error || !data) {
      const code = (error as { code?: string } | null)?.code;
      if (code === "PGRST116") return null;
      throw error || new Error("Product not found");
    }

    return mapEmbeddedProduct(data, locale);
}

const getCachedProductBySlug = unstable_cache(fetchProductBySlugFromDB, ["public-product-detail"], {
  tags: [PUBLIC_PRODUCT_CACHE_TAG],
  revalidate: 300,
});

export async function getProductBySlugFromDB(slug: string, locale: ProductLocale = "en"): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return staticGetBySlug(slug) || null;
  }

  try {
    return await getCachedProductBySlug(slug, locale);
  } catch (err) {
    console.warn("[product-service] Supabase fetch failed for slug:", slug, err);
    return staticGetBySlug(slug) || null;
  }
}

/**
 * Fetch products by category slug from Supabase, fall back to static
 */
async function fetchProductsByCategoryFromDB(categorySlug: string, locale: ProductLocale): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        pricing_tiers (*),
        category:categories!inner (*),
        product_localizations (*),
        product_faqs (*),
        product_images (*)
      `)
      .eq("category.slug", categorySlug)
      .eq("is_active", true)
      .eq("product_localizations.locale", locale)
      .eq("product_faqs.locale", locale)
      .eq("product_images.is_primary", true)
      .order("name");

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => mapEmbeddedProduct(row, locale));
}

const getCachedProductsByCategory = unstable_cache(
  fetchProductsByCategoryFromDB,
  ["public-products-by-category"],
  { tags: [PUBLIC_PRODUCT_CACHE_TAG], revalidate: 300 },
);

export async function getProductsByCategoryFromDB(categorySlug: string, locale: ProductLocale = "en"): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticGetByCategory(categorySlug);
  }

  try {
    return await getCachedProductsByCategory(categorySlug, locale);
  } catch (err) {
    console.warn("[product-service] Supabase category fetch failed:", categorySlug, err);
    return staticGetByCategory(categorySlug);
  }
}

export async function getIndexableProductsForSeo(): Promise<ProductSeoState[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts
      .map((product) => staticProductSeoState(product.slug))
      .filter((product): product is ProductSeoState => Boolean(product));
  }

  try {
    const rows = await fetchProductSeoRows();
    return rows.map(mapProductSeoState).filter((product) => product.indexableEn);
  } catch (error) {
    console.warn("[product-service] Product SEO feed failed, using static English fallback:", error);
    return staticProducts
      .map((product) => staticProductSeoState(product.slug))
      .filter((product): product is ProductSeoState => Boolean(product));
  }
}

export async function getProductSeoState(slug: string): Promise<ProductSeoState | null> {
  if (!isSupabaseConfigured()) return staticProductSeoState(slug);

  try {
    const rows = await fetchProductSeoRows(slug);
    return rows[0] ? mapProductSeoState(rows[0]) : null;
  } catch (error) {
    console.warn("[product-service] Product SEO state fetch failed:", slug, error);
    return staticProductSeoState(slug);
  }
}
