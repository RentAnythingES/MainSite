import assert from "node:assert/strict";
import test from "node:test";
import { blankTranslation } from "../src/lib/translation-workflow.ts";
import { withProductTranslation } from "../src/lib/product-translation.ts";
import { readPrivateGermanDrafts, translatePrivateCatalogue } from "../src/lib/private-german-catalogue.ts";

test("German draft replaces every copy field while preserving inventory and prices", () => {
  const source = {
    id: "identity", slug: "slug", productOfferId: "offer", marketId: "city",
    name: "English", category: "English category", subcategory: "English type",
    description: "English", detailDescription: "English", includesText: "English",
    constraintsText: "English", deliverySetupNote: "English", careNote: "English",
    imageAlt: "English", seoTitle: "English", seoDescription: "English",
    features: ["English"], specs: { English: "English" }, faqs: [{ question: "English", answer: "English" }],
    pricing: [{ days: 1, perDay: 9.5 }], stockTotal: 2, image: "/unchanged.webp",
  };
  const draft = { ...blankTranslation(), name: "Deutscher Name" };
  const result = withProductTranslation(source, draft, { category: "Kategorie", subcategory: "Typ" });
  for (const key of ["description", "detailDescription", "includesText", "constraintsText", "deliverySetupNote", "careNote", "imageAlt", "seoTitle", "seoDescription"]) assert.equal(result[key], "");
  assert.deepEqual(result.features, []); assert.deepEqual(result.specs, {}); assert.deepEqual(result.faqs, []);
  for (const key of ["id", "slug", "productOfferId", "marketId", "pricing", "stockTotal", "image"]) assert.deepEqual(result[key], source[key]);
  assert.equal(source.name, "English");
  assert.throws(() => withProductTranslation(source, draft, { category: "", subcategory: "Typ" }), /labels/);
});

test("private catalogue fails before filesystem access when preview is disabled", async () => {
  const saved = process.env.LOCALIZATION_PREVIEW;
  process.env.LOCALIZATION_PREVIEW = "false";
  try { await assert.rejects(readPrivateGermanDrafts(), /disabled/); }
  finally {
    if (saved === undefined) delete process.env.LOCALIZATION_PREVIEW;
    else process.env.LOCALIZATION_PREVIEW = saved;
  }
});

test("private catalogue preserves every product and rejects missing content instead of fallback", () => {
  const source = { slug: "test", categorySlug: "baby-gear", subcategorySlug: "strollers", pricing: [{ days: 1, perDay: 12 }], stockTotal: 3 };
  const draft = { slug: "test", content: { ...blankTranslation(), name: "Kinderwagen" } };
  const translated = translatePrivateCatalogue([source], [draft]);
  assert.equal(translated.length, 1);
  assert.equal(translated[0].name, "Kinderwagen");
  assert.equal(translated[0].subcategory, "Kinderwagen");
  assert.equal(translated[0].stockTotal, 3);
  assert.deepEqual(translated[0].pricing, source.pricing);
  assert.throws(() => translatePrivateCatalogue([source, { ...source, slug: "missing" }], [draft]), /missing/);
  assert.throws(() => translatePrivateCatalogue([{ ...source, subcategorySlug: "untranslated" }], [draft]), /Missing/);
});
