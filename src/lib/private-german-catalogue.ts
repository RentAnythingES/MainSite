import { readFile } from "node:fs/promises";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
import { validateTranslationContent, type TranslationContent } from "@/lib/translation-workflow";
import type { Product } from "@/data/products";
import { withProductTranslation } from "@/lib/product-translation";
import { germanCategories, germanSubcategories } from "@/content/german-categories";

export type PrivateGermanDraft = {
  slug: string;
  productId: string;
  sourceHash: string;
  content: TranslationContent;
  reviewNotes: string[];
};

/** Missing labels/copy fail explicitly; the preview never silently drops a source product. */
export function translatePrivateCatalogue(products: Product[], drafts: PrivateGermanDraft[]): Product[] {
  const bySlug = new Map(drafts.map(draft => [draft.slug, draft]));
  return products.map(product => {
    const draft = bySlug.get(product.slug);
    const category = germanCategories[product.categorySlug]?.title;
    const subcategory = germanSubcategories[product.subcategorySlug];
    if (!draft || !category || !subcategory) throw new Error(`Missing private German catalogue content: ${product.slug}`);
    return withProductTranslation(product, draft.content, { category, subcategory });
  });
}

/** Local-only offline drafts. Never statically import the catalogue into a public bundle. */
export async function readPrivateGermanDrafts(): Promise<PrivateGermanDraft[]> {
  if (!privateGermanPreviewEnabled()) throw new Error("Private preview is disabled");
  const path = process.env.LOCALIZATION_CATALOGUE_DRAFTS_FILE;
  if (!path) throw new Error("Set LOCALIZATION_CATALOGUE_DRAFTS_FILE to the approved offline drafts");
  const value = JSON.parse(await readFile(path, "utf8"));
  if (!Array.isArray(value.products)) throw new Error("Invalid draft catalogue");
  const slugs = new Set<string>();
  return value.products.map((entry: Record<string, unknown>) => {
    if (
      typeof entry.slug !== "string" || slugs.has(entry.slug) ||
      typeof entry.product_id !== "string" || entry.locale !== "de" ||
      entry.publication_status !== "draft" || entry.reviewed_by !== null ||
      entry.reviewed_at !== null || typeof entry.source_hash !== "string" ||
      !/^[a-f0-9]{64}$/.test(entry.source_hash) ||
      !Array.isArray(entry.review_notes) ||
      entry.review_notes.some((note) => typeof note !== "string")
    ) throw new Error("Invalid or duplicate private German draft");
    slugs.add(entry.slug);
    return {
      slug: entry.slug,
      productId: entry.product_id,
      sourceHash: entry.source_hash,
      content: validateTranslationContent(entry.translation_content),
      reviewNotes: entry.review_notes as string[],
    };
  });
}
