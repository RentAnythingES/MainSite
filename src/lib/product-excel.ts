import * as XLSX from "xlsx";
import {
  PRODUCT_CSV_TEMPLATE,
  type ExportProduct,
  type ProductLocale,
  type LocalizationField,
  LOCALIZATION_FIELDS,
} from "./product-csv";

export const EXCEL_HEADERS = [
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
] as string[];

export type ExcelProduct = ExportProduct;

function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return safe;
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function buildExportRow(row: Record<string, unknown>, headers: string[]) {
  const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]));
  return headers.map((header) => csvCell(normalized[normalizeHeader(header)]));
}

function getCategorySlug(product: ExcelProduct) {
  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  return category?.slug || "";
}

function getLocalization(product: ExcelProduct, locale: ProductLocale) {
  return (product.product_localizations || []).find((entry) => entry.locale === locale);
}

function getPrimaryImage(product: ExcelProduct) {
  return (product.product_images || []).find((image) => image.is_primary) || (product.product_images || [])[0];
}

function formatPrice(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

function getTierPrice(tiers: { min_days: number; per_day_cents: number }[], minDays: number) {
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

function productToExcelRow(product: ExcelProduct) {
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

export function productsToExcel(products: ExcelProduct[]): Buffer {
  const workbook = XLSX.utils.book_new();
  const rows = products.map(productToExcelRow);
  const data = [EXCEL_HEADERS, ...rows].map((row) => row.map(csvCell));
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths for better readability
  const colWidths = [
    { wch: 36 }, // id
    { wch: 40 }, // slug
    { wch: 30 }, // name
    { wch: 20 }, // brand
    { wch: 15 }, // category_slug
    { wch: 20 }, // subcategory
    { wch: 20 }, // subcategory_slug
    { wch: 50 }, // description
    { wch: 8 },  // emoji
    { wch: 12 }, // city
    { wch: 12 }, // stock_total
    { wch: 15 }, // stock_available
    { wch: 10 }, // is_active
    { wch: 15 }, // content_status
    { wch: 50 }, // image_url
    { wch: 30 }, // meta_title
    { wch: 50 }, // meta_description
    { wch: 40 }, // features
    { wch: 40 }, // specs
    { wch: 12 }, // price_1_day
    { wch: 12 }, // price_3_days
    { wch: 12 }, // price_7_days
    { wch: 12 }, // price_14_days
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })), // en_*
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })), // es_*
    { wch: 30 }, // image_alt_text
    { wch: 50 }, // image_source_url
    { wch: 20 }, // image_rights_status
  ];
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

export function exportRowsToExcel(rows: Record<string, unknown>[], fileName = "rentanything-import-export.xlsx") {
  if (typeof window === "undefined") return;
  const workbook = XLSX.utils.book_new();
  const headers = [...EXCEL_HEADERS];
  const data = [headers, ...rows.map((row) => buildExportRow(row, headers))].map((row) => row.map(csvCell));
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet["!cols"] = [
    { wch: 36 }, // id
    { wch: 40 }, // slug
    { wch: 30 }, // name
    { wch: 20 }, // brand
    { wch: 15 }, // category_slug
    { wch: 20 }, // subcategory
    { wch: 20 }, // subcategory_slug
    { wch: 50 }, // description
    { wch: 8 },  // emoji
    { wch: 12 }, // city
    { wch: 12 }, // stock_total
    { wch: 15 }, // stock_available
    { wch: 10 }, // is_active
    { wch: 15 }, // content_status
    { wch: 50 }, // image_url
    { wch: 30 }, // meta_title
    { wch: 50 }, // meta_description
    { wch: 40 }, // features
    { wch: 40 }, // specs
    { wch: 12 }, // price_1_day
    { wch: 12 }, // price_3_days
    { wch: 12 }, // price_7_days
    { wch: 12 }, // price_14_days
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })),
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })),
    { wch: 30 },
    { wch: 50 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, fileName);
}

export function downloadProductExcelTemplate() {
  if (typeof window === "undefined") return;
  const workbook = XLSX.utils.book_new();
  const data = [EXCEL_HEADERS].map((row) => row.map(csvCell));
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet["!cols"] = [
    { wch: 36 }, // id
    { wch: 40 }, // slug
    { wch: 30 }, // name
    { wch: 20 }, // brand
    { wch: 15 }, // category_slug
    { wch: 20 }, // subcategory
    { wch: 20 }, // subcategory_slug
    { wch: 50 }, // description
    { wch: 8 },  // emoji
    { wch: 12 }, // city
    { wch: 12 }, // stock_total
    { wch: 15 }, // stock_available
    { wch: 10 }, // is_active
    { wch: 15 }, // content_status
    { wch: 50 }, // image_url
    { wch: 30 }, // meta_title
    { wch: 50 }, // meta_description
    { wch: 40 }, // features
    { wch: 40 }, // specs
    { wch: 12 }, // price_1_day
    { wch: 12 }, // price_3_days
    { wch: 12 }, // price_7_days
    { wch: 12 }, // price_14_days
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })),
    ...LOCALIZATION_FIELDS.map(() => ({ wch: 40 })),
    { wch: 30 },
    { wch: 50 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "rentanything-product-import-template.xlsx");
}

export function parseExcelFile(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        resolve(json as Record<string, unknown>[]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function parseExcelBuffer(buffer: Buffer): Record<string, unknown>[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
}