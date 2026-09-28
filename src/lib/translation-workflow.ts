/** Product identity, inventory, prices and image URLs remain in the global source. */
export const translationTextFields = [
  "name",
  "short_description",
  "detail_description",
  "includes_text",
  "constraints_text",
  "delivery_setup_note",
  "care_note",
  "seo_title",
  "seo_description",
  "image_alt_text",
] as const;
export type TranslationTextField = (typeof translationTextFields)[number];
export type TranslationContent = Record<TranslationTextField, string> & {
  features: string[];
  specs: Record<string, string>;
  faqs: Array<{ question: string; answer: string }>;
};
export type TranslationEntry = {
  locale: string;
  publication_status: "draft" | "reviewed" | "published" | "stale";
  translation_content: TranslationContent | null;
  source_revision: number | null;
  translation_revision: number;
  reviewed_revision: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export function blankTranslation(): TranslationContent {
  return {
    ...(Object.fromEntries(
      translationTextFields.map((field) => [field, ""]),
    ) as Record<TranslationTextField, string>),
    features: [],
    specs: {},
    faqs: [],
  };
}

export function validateTranslationContent(input: unknown): TranslationContent {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    JSON.stringify(input).length > 100000
  )
    throw new Error("Invalid translation content");
  const value = input as Record<string, unknown>;
  if (
    Object.keys(value).some(
      (key) =>
        ![...translationTextFields, "features", "specs", "faqs"].includes(key),
    )
  )
    throw new Error("Unknown translation field");
  const result = blankTranslation();
  for (const field of translationTextFields) {
    if (typeof value[field] !== "string" || value[field].length > 12000)
      throw new Error(`Invalid ${field}`);
    result[field] = value[field].trim();
  }
  if (
    !Array.isArray(value.features) ||
    value.features.length > 40 ||
    value.features.some((v) => typeof v !== "string" || v.length > 2000)
  )
    throw new Error("Use up to 40 text features");
  result.features = value.features
    .map((v) => (v as string).trim())
    .filter(Boolean);
  if (
    !value.specs ||
    typeof value.specs !== "object" ||
    Array.isArray(value.specs) ||
    Object.keys(value.specs).length > 40
  )
    throw new Error("Invalid specifications");
  for (const [key, entry] of Object.entries(value.specs)) {
    if (
      !key.trim() ||
      key.length > 200 ||
      typeof entry !== "string" ||
      entry.length > 2000
    )
      throw new Error("Specifications require a label and text value");
  }
  result.specs = value.specs as Record<string, string>;
  if (!Array.isArray(value.faqs) || value.faqs.length > 40)
    throw new Error("Use up to 40 FAQs");
  result.faqs = value.faqs.map((faq) => {
    if (
      !faq ||
      typeof faq.question !== "string" ||
      typeof faq.answer !== "string" ||
      faq.question.length > 1000 ||
      faq.answer.length > 12000
    )
      throw new Error("Invalid FAQ");
    return { question: faq.question.trim(), answer: faq.answer.trim() };
  });
  return result;
}

export function translationMissingFields(
  content: TranslationContent | null,
): string[] {
  if (!content) return ["translation"];
  const missing: string[] = translationTextFields.filter(
    (field) => !content[field]?.trim(),
  );
  if (content.seo_title.length > 60) missing.push("seo_title_max_60");
  if (
    content.seo_description.length < 130 ||
    content.seo_description.length > 155
  )
    missing.push("seo_description_130_155");
  if (
    content.faqs.filter((faq) => faq.question.trim() && faq.answer.trim())
      .length < 3 ||
    content.faqs.some((faq) => !faq.question.trim() || !faq.answer.trim())
  )
    missing.push("three_complete_faqs");
  return missing;
}

export function translationReadiness(
  entry: TranslationEntry | null,
  sourceRevision: number,
) {
  const missing = translationMissingFields(entry?.translation_content || null);
  const current = !!entry && entry.source_revision === sourceRevision;
  const reviewed =
    current &&
    entry.reviewed_revision === entry.translation_revision &&
    !!entry.reviewed_by &&
    !!entry.reviewed_at;
  return {
    missing,
    current,
    reviewed,
    publishable:
      current &&
      reviewed &&
      missing.length === 0 &&
      entry?.publication_status === "reviewed",
    published:
      current &&
      reviewed &&
      missing.length === 0 &&
      entry?.publication_status === "published",
  };
}

/** Service-role reads need the same state check as anonymous RLS reads. */
export function isPublishedTranslation(
  entry: {
    publication_status?: string;
    source_revision?: number | null;
    translation_revision?: number;
    reviewed_revision?: number | null;
    reviewed_by?: string | null;
  },
  sourceRevision?: number,
): boolean {
  if (entry.publication_status && entry.publication_status !== "published")
    return false;
  if (entry.source_revision != null)
    return (
      entry.publication_status === "published" &&
      entry.source_revision === sourceRevision &&
      entry.reviewed_revision === entry.translation_revision &&
      !!entry.reviewed_by
    );
  return true; // Compatibility for existing EN/ES rows before workflow enrollment.
}
