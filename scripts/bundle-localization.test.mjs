import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { rentalBundles } from "../src/data/bundles.ts";
import { germanRentalBundles } from "../src/data/bundles-de.ts";
import { localizeBundle } from "../src/data/bundle-localization.ts";
import { bundleConfiguratorCopy, bundleConsentText, bundleConsentVersion } from "../src/i18n/bundle-configurator.ts";
import { bundleRequestCopy, bundleAvailabilityNotes } from "../src/i18n/bundle-request.ts";

function local(t) {
  for (const [key, value] of Object.entries({ NODE_ENV: "test", LOCALIZATION_PREVIEW: "true", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:9999", SUPABASE_SERVICE_ROLE_KEY: "local-test", STRIPE_SECRET_KEY: "sk_test_mock", RESEND_API_KEY: "" })) {
    const previous = process.env[key]; process.env[key] = value;
    t.after(() => { if (previous === undefined) delete process.env[key]; else process.env[key] = previous; });
  }
}
const request = body => new NextRequest("http://localhost/api/bundle-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const body = { customerName: "Jürgen", customerEmail: "review@example.test", startDate: "2027-02-01", endDate: "2027-02-04", area: "Valencia", consentAccepted: true };

test("kit copy and availability notes cover every supported language", () => {
  for (const dictionary of [bundleConfiguratorCopy, bundleRequestCopy, bundleAvailabilityNotes]) {
    for (const locale of ["en", "es", "de"]) {
      assert.deepEqual(Object.keys(dictionary[locale]), Object.keys(dictionary.en));
      assert.ok(Object.values(dictionary[locale]).every(value => value.trim()));
    }
  }
});

test("all German kits preserve canonical selection mappings, quantities, product identities and source section coverage", () => {
  assert.equal(germanRentalBundles.length, rentalBundles.length);
  for (const source of rentalBundles) {
    const draft = germanRentalBundles.find(bundle => bundle.slug === source.slug);
    assert.ok(draft, source.slug);
    for (const field of ["name", "shortName", "eyebrow", "tagline", "description"]) {
      assert.ok(draft[field].trim()); assert.notEqual(draft[field], source[field], `${source.slug}/${field}`);
    }
    for (const field of ["image", "accent", "relatedProductSlugs", "relatedGuideSlugs"]) assert.deepEqual(draft[field], source[field]);
    assert.equal(draft.faqs.length, source.faqs.length);
    assert.equal(draft.bestFor.length, source.bestFor.length);
    assert.ok(draft.seo.title.length <= 60);
    assert.ok(draft.seo.description.length >= 130 && draft.seo.description.length <= 155);
    for (const group of ["includedItems", "addons"]) {
      assert.equal(draft[group].length, source[group].length);
      source[group].forEach((item, index) => {
        const translated = draft[group][index];
        assert.equal(translated.requestName, item.requestName ?? item.name);
        assert.equal(translated.quantity, item.quantity); assert.equal(translated.productSlug, item.productSlug);
        assert.equal(translated.id, item.id);
        if (item.note) { assert.ok(translated.note); assert.notEqual(translated.note, item.note); }
      });
    }
  }
  const explorer = germanRentalBundles.find(bundle => bundle.slug === "turia-beach-explorer");
  for (const fact of ["172–195", "Rockrider E-ACTV 100", "Hamax Pioneer", "L/XL"]) assert.ok(JSON.stringify(explorer).includes(fact));
});

test("incomplete kit translations fail instead of retaining English notes", () => {
  const source = rentalBundles[0];
  const draft = germanRentalBundles[0];
  assert.throws(() => localizeBundle(source, { ...draft, includedItems: [] }), /Incomplete/);
  assert.throws(() => localizeBundle(source, { ...draft, includedItems: draft.includedItems.map(item => ({ ...item, note: undefined })) }), /Missing/);
});

test("every kit saves the selected language and exact consent without local messages or WhatsApp", async t => {
  local(t);
  const { POST: saveRequest } = await import("../src/app/api/bundle-requests/route.ts");
  const saved = [];
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "http://127.0.0.1:9999", "External HTTP forbidden");
    assert.equal(url.pathname, "/rest/v1/bundle_requests");
    assert.equal(init.method, "POST", "No sent-flag writes in preview");
    saved.push(JSON.parse(init.body));
    return new Response(null, { status: 201 });
  });
  for (const locale of ["en", "es", "de"]) for (const bundle of rentalBundles) {
    const response = await saveRequest(request({ ...body, locale, bundleSlug: bundle.slug, selectedItems: [bundle.includedItems[0].name] }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.preview, true); assert.equal(result.whatsappUrl, undefined);
    const row = saved.at(-1);
    assert.equal(row.locale, locale); assert.equal(row.bundle_slug, bundle.slug);
    assert.equal(row.consent_text, bundleConsentText(locale)); assert.equal(row.consent_version, bundleConsentVersion);
    assert.equal(row.consent_text, `${bundleConfiguratorCopy[locale].consentBefore} ${bundleConfiguratorCopy[locale].privacy}.`);
  }
  assert.equal(saved.length, rentalBundles.length * 3);
});

test("German kit validation and unavailable-language rejection happen before any I/O", async t => {
  local(t);
  const { POST: saveRequest } = await import("../src/app/api/bundle-requests/route.ts");
  const { POST: availability } = await import("../src/app/api/bundle-availability/route.ts");
  t.mock.method(globalThis, "fetch", async () => assert.fail("No HTTP expected"));
  const german = { ...body, locale: "de", bundleSlug: rentalBundles[0].slug };
  for (const [change, expected] of [
    [{ consentAccepted: "false" }, bundleRequestCopy.de.consent],
    [{ endDate: "2027-01-31" }, bundleRequestCopy.de.dates],
    [{ customerEmail: "bad" }, bundleRequestCopy.de.contact],
    [{ area: "" }, bundleRequestCopy.de.area],
  ]) {
    const response = await saveRequest(request({ ...german, ...change }));
    assert.equal(response.status, 400); assert.equal((await response.json()).error, expected);
  }
  const response = await availability(request({ ...german, selectedItems: [] }));
  assert.equal(response.status, 400); assert.equal((await response.json()).error, bundleRequestCopy.de.selection);
  process.env.LOCALIZATION_PREVIEW = "false";
  for (const handler of [saveRequest, availability]) assert.equal((await handler(request(german))).status, 400);
});

test("kit language migration preserves history, rejects unknown languages and retains private table access", async () => {
  const db = new PGlite();
  const sql = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8");
  try {
    await db.exec("create role anon; create role authenticated; create table locales(code text primary key); insert into locales values('en'),('es'),('de');");
    await db.exec(sql("20260721_bundle_requests.sql"));
    const insert = locale => db.query("insert into bundle_requests(request_ref,bundle_slug,bundle_name,customer_name,customer_email,start_date,end_date,accommodation_area,consent_version,consent_text,locale) values($1,'test-kit','Kit','Test','review@example.test','2027-02-01','2027-02-04','Valencia','old','Historical consent',$2)", [locale, locale]);
    await insert("es");
    const before = (await db.query("select * from bundle_requests")).rows;
    await db.exec("begin"); await db.exec(sql("20260929_kit_request_language.sql")); await db.exec("rollback");
    await assert.rejects(insert("de"), { code: "23514" });
    await db.exec(sql("20260929_kit_request_language.sql"));
    assert.deepEqual((await db.query("select * from bundle_requests")).rows, before);
    await insert("de"); await assert.rejects(insert("unknown"), { code: "23503" });
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      await assert.rejects(db.query("select * from bundle_requests"), { code: "42501" });
      await db.exec("reset role");
    }
  } finally { await db.close(); }
});
