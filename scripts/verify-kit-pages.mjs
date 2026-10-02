import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rentalBundles } from "../src/data/bundles.ts";
import { spanishRentalBundles } from "../src/data/bundles-es.ts";

const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);
let checked = 0;
let hubs = 0;
for (const [locale, bundles] of [["en", rentalBundles], ["es", spanishRentalBundles]]) {
  const hubRoute = `${locale === "es" ? "es/" : ""}valencia/kits`;
  const hub = readFileSync(new URL(`../.next/server/app/${hubRoute}.html`, import.meta.url), "utf8");
  for (const bundle of bundles) {
    assert.ok(hub.includes(`href="/${hubRoute}/${bundle.slug}"`), `${hubRoute}: missing kit link`);
    assert.ok(hub.includes(escape(bundle.shortName)), `${hubRoute}: missing kit name`);
  }
  hubs++;
  for (const bundle of bundles) {
    const route = `${locale === "es" ? "es/" : ""}valencia/kits/${bundle.slug}`;
    const html = readFileSync(new URL(`../.next/server/app/${route}.html`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    for (const text of [bundle.name, bundle.description, ...bundle.includedItems.map(item => item.name), ...bundle.faqs.flatMap(faq => [faq.question, faq.answer])]) {
      assert.ok(html.includes(escape(text)), `${route}: missing source copy: ${text.slice(0, 60)}`);
    }
    assert.ok(html.includes('id="configure-kit"'), `${route}: missing configurator`);
    assert.ok(html.includes(locale === "es" ? ">Comparar kits</a>" : ">Compare kits</a>"));
    // The header's explicit language switch should still link to English.
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main, `${route}: missing main content`);
    if (locale === "es") assert.ok(!/href="\/(?:product|valencia\/kits|blog)\//.test(main), `${route}: English navigation link in kit content`);
    checked++;
  }
}
assert.equal(checked, rentalBundles.length + spanishRentalBundles.length);
console.log(JSON.stringify({ renderedKitPages: checked, renderedHubs: hubs, sourceCopyAndLocaleLinks: "passed" }));
