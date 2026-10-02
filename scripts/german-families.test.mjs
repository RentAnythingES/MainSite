import assert from "node:assert/strict";
import test from "node:test";
import { productFamilies } from "../src/data/product-families.ts";
import { germanFamilies } from "../src/content/german-families.ts";
import { germanPreviewPrefix } from "../src/i18n/site-context.ts";

test("every published family has a complete German draft with source guidance sections", () => {
  const published = productFamilies.filter(family => family.published);
  assert.deepEqual(Object.keys(germanFamilies).sort(), published.map(family => family.slug).sort());
  for (const family of published) {
    const draft = germanFamilies[family.slug];
    const source = family.content.en;
    for (const [key, value] of Object.entries(source)) {
      assert.ok(Object.hasOwn(draft, key), `${family.slug}: missing ${key}`);
      if (typeof value === "string") assert.ok(draft[key].trim(), `${family.slug}: blank ${key}`);
    }
    for (const key of ["choices", "checklist", "localParagraphs", "faqs"]) {
      assert.equal(draft[key].length, source[key].length, `${family.slug}: incomplete ${key}`);
    }
    assert.ok(draft.title.length <= 60);
    assert.ok(draft.description.length >= 130 && draft.description.length <= 155);
    // Exact listing names are supplied by the translated catalogue, avoiding duplicated model claims.
    assert.deepEqual(draft.productLabels, {});
  }
});

test("German family editorial links stay within implemented private pages", () => {
  const allowed = new Set(["/rental/mobility", "/rental/baby-gear", "/how-it-works", "/contact", "/valencia/kits/accessible-valencia-kit", "/valencia/kits/baby-arrival-kit"].map(path => germanPreviewPrefix + path));
  for (const content of Object.values(germanFamilies)) {
    assert.ok(content.links.length >= 2);
    for (const link of content.links) assert.ok(allowed.has(link.href), link.href);
  }
});
