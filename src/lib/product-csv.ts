export const LOCALIZATION_FIELDS = [
  "short_description",
  "detail_description",
  "includes_text",
  "constraints_text",
  "delivery_setup_note",
  "care_note",
  "seo_title",
  "seo_description",
] as const;

export type LocalizationField = (typeof LOCALIZATION_FIELDS)[number];
export type ProductLocale = "en" | "es";

export type ProductLocalization = {
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

export const PRODUCT_CSV_HEADERS = [
  "id",
  "slug",
  "name",
  "brand",
  "category_slug",
  "subcategory",
  "subcategory_slug",
  "description",
  "emoji",
  "city",
  "stock_total",
  "stock_available",
  "is_active",
  "content_status",
  "image_url",
  "meta_title",
  "meta_description",
  "features",
  "specs",
  "price_1_day",
  "price_3_days",
  "price_7_days",
  "price_14_days",
  ...LOCALIZATION_FIELDS.map((field) => `en_${field}`),
  ...LOCALIZATION_FIELDS.map((field) => `es_${field}`),
  "image_alt_text",
  "image_source_url",
  "image_rights_status",
] as const;

export const PRODUCT_CSV_TEMPLATE = `${PRODUCT_CSV_HEADERS.join(",")}
,example-compact-stroller,Example Compact Stroller,,baby-gear,Strollers,strollers,Lightweight stroller for families visiting Valencia,📦,valencia,1,1,false,draft,,,,,One-hand fold | Airline compatible,Weight=7.5 kg; Folded size=55 x 40 x 25 cm,20,15,11,8,Compact stroller rental in Valencia,Full detail copy for the English product page.,Rain cover | Carry bag,,Door-to-door delivery in Valencia.,Sanitised before every rental.,Rent a compact stroller in Valencia | RentAnything,Premium stroller hire with delivery across Valencia. Check availability for your dates.,Alquiler de silla de paseo en Valencia,Texto detallado en español para la ficha del producto.,,,Entrega a domicilio en Valencia.,Higienizada antes de cada alquiler.,Alquiler de silla de paseo en Valencia | RentAnything,Alquiler de silla premium con entrega en Valencia. Consulta disponibilidad.,Example compact stroller on white background,,unknown`;

type PricingTier = {
  min_days: number;
  per_day_cents: number;
};

type PrimaryImage = {
  is_primary: boolean;
  alt_text: string | null;
  source_url: string | null;
  rights_status: string | null;
};

export type ExportProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  emoji: string;
  image_url: string | null;
  subcategory: string;
  subcategory_slug: string;
  city: string;
  stock_total: number;
  stock_available: number;
  is_active: boolean;
  content_status: string;
  meta_title: string | null;
  meta_description: string | null;
  features: string[] | null;
  specs: Record<string, string> | null;
  pricing_tiers: PricingTier[];
  category: { slug: string } | Array<{ slug: string }> | null;
  product_localizations: ProductLocalization[] | null;
  product_images: PrimaryImage[] | null;
};

export function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

function getCategorySlug(product: ExportProduct) {
  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  return category?.slug || "";
}

function getLocalization(product: ExportProduct, locale: ProductLocale) {
  return (product.product_localizations || []).find((entry) => entry.locale === locale);
}

function getPrimaryImage(product: ExportProduct) {
  return (product.product_images || []).find((image) => image.is_primary) || (product.product_images || [])[0];
}

function formatPrice(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

function getTierPrice(tiers: PricingTier[], minDays: number) {
  const tier = tiers.find((entry) => entry.min_days === minDays);
  return tier ? formatPrice(tier.per_day_cents) : "";
}

function formatFeatures(features: string[] | null | undefined) {
  return (features || []).map((feature) => feature.trim()).filter(Boolean).join(" | ");
}

function formatSpecs(specs: Record<string, string> | null | undefined) {
  return Object.entries(specs || {})
    .filter(([key, value]) => key.trim() && String(value).trim())
    .map(([key, value]) => `${key.trim()}=${String(value).trim()}`)
    .join("; ");
}

export function localizationCsvColumn(locale: ProductLocale, field: LocalizationField) {
  return `${locale}_${field}` as const;
}

export function buildLocalizationFromRow(row: Record<string, unknown>, locale: ProductLocale) {
  const localization: Record<string, string | null> = { locale };
  let hasValue = false;

  for (const field of LOCALIZATION_FIELDS) {
    const raw = String(row[localizationCsvColumn(locale, field)] ?? "").trim();
    localization[field] = raw || null;
    if (raw) hasValue = true;
  }

  return hasValue ? localization : null;
}

export function productToCsvRow(product: ExportProduct) {
  const tiers = [...(product.pricing_tiers || [])].sort((a, b) => a.min_days - b.min_days);
  const english = getLocalization(product, "en");
  const spanish = getLocalization(product, "es");
  const primaryImage = getPrimaryImage(product);

  return [
    product.id,
    product.slug,
    product.name,
    product.brand,
    getCategorySlug(product),
    product.subcategory,
    product.subcategory_slug,
    product.description,
    product.emoji || "📦",
    product.city || "valencia",
    product.stock_total,
    product.stock_available,
    product.is_active ? "true" : "false",
    product.content_status || "draft",
    product.image_url || "",
    product.meta_title || "",
    product.meta_description || "",
    formatFeatures(product.features),
    formatSpecs(product.specs),
    getTierPrice(tiers, 1),
    getTierPrice(tiers, 3),
    getTierPrice(tiers, 7),
    getTierPrice(tiers, 14),
    ...LOCALIZATION_FIELDS.map((field) => english?.[field] || ""),
    ...LOCALIZATION_FIELDS.map((field) => spanish?.[field] || ""),
    primaryImage?.alt_text || "",
    primaryImage?.source_url || "",
    primaryImage?.rights_status || "",
  ];
}

export function productsToCsv(products: ExportProduct[]) {
  const rows = products.map(productToCsvRow);
  return [PRODUCT_CSV_HEADERS, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function downloadProductCsvTemplate() {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([PRODUCT_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" }));
  link.download = "rentanything-product-import-template.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
