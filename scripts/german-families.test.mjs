import assert from "node:assert/strict";
import test from "node:test";
import { productFamilies } from "../src/data/product-families.ts";
import { germanFamilies } from "../src/content/german-families.ts";
import { germanPreviewPrefix } from "../src/i18n/site-context.ts";
import { germanRouteCandidate } from "../src/i18n/german-paths.ts";

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
    // The full original decision labels retain exact product identities.
    assert.deepEqual(Object.keys(draft.productLabels).sort(),Object.keys(source.productLabels).sort());
    for (const label of Object.values(draft.productLabels)) assert.ok(label.trim());
  }
});

test("German family editorial links stay within implemented German pages", () => {
  const allowed = new Set(["/rental/mobility", "/rental/baby-gear", "/how-it-works", "/contact", "/valencia/kits/accessible-valencia-kit", "/valencia/kits/baby-arrival-kit"].flatMap(path => [germanPreviewPrefix + path, "/de" + path]));
  for (const content of Object.values(germanFamilies)) {
    assert.ok(content.links.length >= 2);
    for (const link of content.links) {
      const route=link.href.startsWith("/de/")?link.href.slice(3):null;
      assert.ok(allowed.has(link.href) || (route && germanRouteCandidate(route)), link.href);
    }
  }
});
