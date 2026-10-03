import type { RentalBundle } from "./bundles";

export type BundleContent = Pick<RentalBundle, "name" | "shortName" | "eyebrow" | "tagline" | "description" | "bestFor" | "seo" | "faqs"> & {
  includedItems: Array<{ name: string; note?: string }>;
  addons: Array<{ name: string; note: string }>;
};

/** Copy may vary; canonical request identifiers, quantities and product links do not. */
export function localizeBundle(base: RentalBundle, content: BundleContent): RentalBundle {
  if (base.includedItems.length !== content.includedItems.length || base.addons.length !== content.addons.length) {
    throw new Error(`Incomplete localized kit: ${base.slug}`);
  }
  return {
    ...base, ...content,
    includedItems: base.includedItems.map((item, index) => {
      const translated = content.includedItems[index];
      if (!translated.name.trim() || (item.note && !translated.note?.trim())) throw new Error(`Missing localized kit item: ${base.slug}/${index}`);
      return { ...item, ...translated, note: translated.note, requestName: item.requestName ?? item.name };
    }),
    addons: base.addons.map((item, index) => {
      const translated = content.addons[index];
      if (!translated.name.trim() || !translated.note.trim()) throw new Error(`Missing localized kit add-on: ${base.slug}/${index}`);
      return { ...item, ...translated, requestName: item.requestName ?? item.name };
    }),
  };
}
