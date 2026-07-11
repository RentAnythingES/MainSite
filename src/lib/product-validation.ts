export type ProductPricingTier = {
  min_days: number;
  per_day_cents: number;
};

export type ProductReadinessInput = {
  slug?: string | null;
  name?: string | null;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  subcategory?: string | null;
  subcategory_slug?: string | null;
  stock_total?: number | null;
  stock_available?: number | null;
  pricing_tiers?: ProductPricingTier[] | null;
};

export function isValidProductSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isValidProductImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return false;
  const imageUrl = value.trim();
  return (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) || /^https:\/\//i.test(imageUrl);
}

export function getProductReadinessIssues(product: ProductReadinessInput) {
  const issues: string[] = [];
  const requiredTextFields: Array<[keyof ProductReadinessInput, string]> = [
    ["name", "Product name is missing"],
    ["brand", "Brand is missing"],
    ["description", "Description is missing"],
    ["category_id", "Category is missing"],
    ["subcategory", "Subcategory is missing"],
  ];

  for (const [field, message] of requiredTextFields) {
    if (typeof product[field] !== "string" || !product[field]?.trim()) issues.push(message);
  }

  if (!product.slug || !isValidProductSlug(product.slug.trim())) {
    issues.push("Slug must use lowercase letters, numbers, and hyphens only");
  }

  if (!product.subcategory_slug || !isValidProductSlug(product.subcategory_slug.trim())) {
    issues.push("Subcategory slug must use lowercase letters, numbers, and hyphens only");
  }

  if (!isValidProductImageUrl(product.image_url)) issues.push("A valid product image is required");

  if (!Number.isInteger(product.stock_total) || Number(product.stock_total) < 1) {
    issues.push("Total stock must be at least 1");
  }

  if (!Number.isInteger(product.stock_available) || Number(product.stock_available) < 0 || Number(product.stock_available) > Number(product.stock_total)) {
    issues.push("Available stock must be between 0 and total stock");
  }

  const pricingTiers = product.pricing_tiers || [];
  if (pricingTiers.length === 0) {
    issues.push("At least one pricing tier is required");
  } else {
    const tierDays = new Set<number>();
    for (const tier of pricingTiers) {
      if (!Number.isInteger(tier.min_days) || tier.min_days < 1) {
        issues.push("Pricing tier minimum days must be at least 1");
        break;
      }
      if (!Number.isInteger(tier.per_day_cents) || tier.per_day_cents < 0) {
        issues.push("Pricing tier prices must be zero or higher");
        break;
      }
      if (tierDays.has(tier.min_days)) {
        issues.push("Pricing tiers cannot use the same minimum days");
        break;
      }
      tierDays.add(tier.min_days);
    }
  }

  return issues;
}
