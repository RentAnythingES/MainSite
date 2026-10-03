import test from "node:test";
import assert from "node:assert/strict";
import { siteContext } from "../src/i18n/site-context.ts";
import { germanInformation } from "../src/content/german-information.ts";
import { trackEvent } from "../src/lib/analytics.ts";

test("private shell locale is segment bounded and does not enable public German", () => {
  for (const path of ["/internal/localization/de", "/internal/localization/de/contact", "/internal/localization/de/privacy"]) {
    assert.deepEqual(siteContext(path), { locale: "de", prefix: "/internal/localization/de", privatePreview: true });
  }
  for (const path of ["/internal/localization/de-other", "/de-other", "/esoteric"]) assert.equal(siteContext(path).locale, "en");
  for (const path of ["/de", "/de/product/test"]) assert.deepEqual(siteContext(path), { locale: "de", prefix: "/de", privatePreview: false });
  assert.equal(siteContext("/es/contact").locale, "es");
});

test("policy drafts retain source sections and explicit unresolved review notes", () => {
  for (const [slug, count] of [["privacy", 8], ["cookies", 5], ["terms", 10], ["refunds", 4]]) {
    assert.equal(germanInformation[slug].sections.length, count);
    assert.ok(germanInformation[slug].reviewNotes.length > 0);
    assert.ok(germanInformation[slug].sourceDate);
  }
  assert.match(JSON.stringify(germanInformation.terms), /180|48/);
  assert.match(JSON.stringify(germanInformation.privacy), /ESB22961221/);
});

test("private preview never sends analytics events even with an existing gtag", () => {
  const previous = globalThis.window;
  let calls = 0;
  globalThis.window = { location: { pathname: "/internal/localization/de/newsletter" }, gtag: () => calls++ };
  try { trackEvent("newsletter_signup_submit"); assert.equal(calls, 0); }
  finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});
