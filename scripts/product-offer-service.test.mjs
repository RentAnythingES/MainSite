import assert from "node:assert/strict";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";
import { listProductOffers, getProductOffer, getBookableProductOffer, offerProductRow } from "../src/lib/product-offer-service.ts";
import { catalogueParity, marketCatalogueMode, readMarketCatalogue } from "../src/lib/market-catalogue-mode.ts";
const valencia = "11111111-1111-4111-8111-111111111111";
const hamburg = "22222222-2222-4222-8222-222222222222";
const productId = "33333333-3333-4333-8333-333333333333";
const offerId = "44444444-4444-4444-8444-444444444444";
function row(marketId = valencia, cents = 1500, capacity = 3) {
  return { id: marketId === valencia ? offerId : "55555555-5555-4555-8555-555555555555", market_id: marketId, product_id: productId,
    stock_total: capacity, online_capacity: capacity, offer_pricing_tiers: [{ min_days: 1, per_day_cents: cents }],
    market: { slug: marketId === valencia ? "valencia" : "hamburg", currency: "eur", timezone: "Europe/Berlin", supported_locales: ["en", "es"] },
    product: { id: productId, slug: "shared-stroller", name: "Shared stroller", stock_available: 99,
      pricing_tiers: [{ min_days: 1, per_day_cents: 99999 }] } };
}
function db(respond, calls = []) {
  return createClient("http://127.0.0.1:9999", "test", { global: { fetch: async input => {
    const url = new URL(input); calls.push(url);
    const response = respond(url);
    return new Response(JSON.stringify(response.body), { status: response.status ?? 200, headers: { "Content-Type": "application/json" } });
  } } });
}
test("same global product has independent city offer identity, capacity and prices", async () => {
  const client = db(url => ({ body: [url.searchParams.get("market_id") === `eq.${valencia}` ? row() : row(hamburg, 2200, 1)] }));
  const a = (await listProductOffers(client, { marketId: valencia, locale: "en" }))[0];
  const b = (await listProductOffers(client, { marketId: hamburg, locale: "en" }))[0];
  assert.equal(a.productId, b.productId); assert.notEqual(a.id, b.id);
  assert.equal(a.tiers[0].per_day_cents, 1500); assert.equal(b.tiers[0].per_day_cents, 2200);
  assert.equal(offerProductRow(b).stock_available, 1); assert.equal(offerProductRow(b).pricing_tiers[0].per_day_cents, 2200);
});
test("card query is bounded, city scoped and excludes full editorial payload", async () => {
  const calls = [];
  await listProductOffers(db(() => ({ body: [] }), calls), { marketId: hamburg, locale: "es", page: 2 });
  const p = calls[0].searchParams;
  assert.equal(p.get("market_id"), `eq.${hamburg}`); assert.equal(p.get("limit"), "100"); assert.equal(p.get("offset"), "200");
  assert.equal(p.get("market.is_public"), "eq.true"); assert.equal(p.get("product.is_active"), "eq.true");
  assert.equal(p.get("product.product_localizations.locale"), "eq.es");
  assert.doesNotMatch(p.get("select"), /product_faqs|detail_description|pricing_tiers\(\*\)/);
});
test("missing offers and database failures never inherit global supply", async () => {
  const input = { marketId: hamburg, locale: "en", slug: "shared-stroller" };
  assert.equal(await getProductOffer(db(() => ({ body: [] })), input), null);
  await assert.rejects(getBookableProductOffer(db(() => ({ body: [] })), input), /unavailable in this city/);
  await assert.rejects(getProductOffer(db(() => ({ body: { code: "42P01" }, status: 400 })), input), /Offer read failed/);
  await assert.rejects(listProductOffers(db(() => ({ body: [row()] })), { marketId: hamburg, locale: "en" }), /Invalid city/);
});
test("server pricing uses local discounts and requires booking eligibility", async () => {
  const calls = [];
  const offer = await getBookableProductOffer(db(url => ({ body: url.pathname.endsWith("offer_quantity_discounts") ? [{ min_quantity: 2, discount_bps: 1500 }] : [row()] }), calls), { marketId: valencia, locale: "en", slug: "shared-stroller" });
  assert.equal(offer.quantityDiscounts[0].discount_bps, 1500);
  assert.equal(calls[0].searchParams.get("market.is_booking_enabled"), "eq.true");
  assert.equal(calls[1].searchParams.get("product_offer_id"), `eq.${offerId}`);
  await assert.rejects(getBookableProductOffer(db(() => ({ body: [{ ...row(), offer_pricing_tiers: [] }] })), { marketId: valencia, locale: "en", slug: "shared-stroller" }), /base price/);
});
test("aliases resolve within a city and invalid scope never queries", async () => {
  const calls = [];
  const canonical = { ...row(), product: { ...row().product, slug: "32-inch-monitor-hdmi-cable" } };
  assert.equal((await getProductOffer(db(() => ({ body: [canonical] }), calls), { marketId: valencia, locale: "es", slug: "27-inch-monitor-hdmi-cable" })).product.slug, "32-inch-monitor-hdmi-cable");
  assert.match(calls[0].searchParams.get("product.slug"), /32-inch/);
  const empty = [];
  await assert.rejects(listProductOffers(db(() => ({ body: [] }), empty), { marketId: null, locale: "en" }));
  assert.equal(empty.length, 0);
});
test("offer mode never falls back; shadow compares but returns legacy unchanged", async () => {
  const legacy = [{ slug: "x", city: "valencia", stockAvailable: 3, pricing: [{ days: 1, perDay: 10 }] }];
  const offers = [{ ...legacy[0], stockAvailable: 1 }];
  let comparisons = 0; let errors = 0;
  const input = { city: "valencia", legacy: async () => legacy, offers: async () => offers,
    compare: (a, b) => { comparisons++; assert.deepEqual(catalogueParity(a, b), ["x"]); }, onShadowError: () => errors++ };
  assert.equal(await readMarketCatalogue({ ...input, mode: "shadow" }), legacy); assert.equal(comparisons, 1);
  const failing = { ...input, offers: async () => { throw new Error("database offline"); } };
  assert.equal(await readMarketCatalogue({ ...failing, mode: "shadow" }), legacy); assert.equal(errors, 1);
  await assert.rejects(readMarketCatalogue({ ...failing, mode: "offers" }), /offline/);
  await assert.rejects(readMarketCatalogue({ ...input, city: "hamburg", mode: "legacy" }), /not enabled/);
  assert.equal(await readMarketCatalogue({ ...input, city: "hamburg", mode: "offers" }), offers);
  assert.equal(marketCatalogueMode(""), "legacy"); assert.throws(() => marketCatalogueMode("offer"));
});
