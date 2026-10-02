import type { Product } from "@/data/products";
import { validateTranslationContent, type TranslationContent } from "@/lib/translation-workflow";

/** Replace every copy field together: a blank draft must never revive English copy. */
export function withProductTranslation(
  product: Product,
  input: TranslationContent,
  labels: { category: string; subcategory: string },
): Product {
  const content = validateTranslationContent(input);
  if (!labels.category.trim() || !labels.subcategory.trim()) {
    throw new Error("Translated catalogue labels are required");
  }
  return {
    ...product,
    ...labels,
    name: content.name,
    description: content.short_description,
    detailDescription: content.detail_description,
    includesText: content.includes_text,
    constraintsText: content.constraints_text,
    deliverySetupNote: content.delivery_setup_note,
    careNote: content.care_note,
    seoTitle: content.seo_title,
    seoDescription: content.seo_description,
    imageAlt: content.image_alt_text,
    features: content.features,
    specs: content.specs,
    faqs: content.faqs,
  };
}
