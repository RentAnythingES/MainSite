import assert from "node:assert/strict";
import test from "node:test";
import { registerHooks } from "node:module";

// Exercise the real service/mappers with an observable cache substitute. This
// verifies cache argument separation, not Next's production cache implementation.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "next/cache" || specifier === "server-only") return { url: `foundation-test:${specifier}`, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url === "foundation-test:server-only") return { format: "module", shortCircuit: true, source: "export {};" };
    if (url === "foundation-test:next/cache") return { format: "module", shortCircuit: true, source: `
      const cache = new Map();
      export const revalidateTag = () => cache.clear();
      export const revalidatePath = () => {};
      export const unstable_cache = (read, key) => async (...args) => {
        const id = JSON.stringify([key,args]);
        if (!cache.has(id)) cache.set(id, await read(...args));
        return cache.get(id);
      };` };
    return next(url, context);
  },
});
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:9999";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-only";
process.env.MARKET_CATALOGUE_READ_MODE = "offers";
const { getProductsFromDB, getProductBySlugFromDB, getProductsByCategoryFromDB } = await import("../src/lib/product-service.ts");
const valencia = "11111111-1111-4111-8111-111111111111";
const hamburg = "22222222-2222-4222-8222-222222222222";
const productId = "33333333-3333-4333-8333-333333333333";
const categoryId = "66666666-6666-4666-8666-666666666666";

test("integrated catalogue: city/locale/cache isolation, category deduplication and retirement", async t => {
  let hidden = false;
  let unavailable = false;
  const calls = [];
  t.mock.method(globalThis, "fetch", async input => {
    const url = new URL(input); calls.push(url);
    assert.equal(url.origin, "http://127.0.0.1:9999");
    const p = url.searchParams;
    let data;
    if (url.pathname.endsWith("/markets")) {
      const city = p.get("slug") === "eq.hamburg" ? "hamburg" : "valencia";
      data = [{ id: city === "hamburg" ? hamburg : valencia, slug: city, name: city, country_code: "ES", currency: "eur", timezone: "Europe/Madrid", default_locale: "en", supported_locales: ["en", "es"], is_active: true, is_public: city !== "hamburg" || !hidden, is_booking_enabled: true, is_indexable: true }];
    } else if (url.pathname.endsWith("/market_locales")) {
      const locale = p.get("locale").slice(3);
      data = [{market_id:p.get("market_id").slice(3),locale,is_public:true,is_booking_enabled:true,is_indexable:true,language:{code:locale,is_public:true}}];
    } else if (url.pathname.endsWith("/categories")) data = { id: categoryId };
    else if (url.pathname.endsWith("/product_category_memberships")) data = [{ product_id: productId }, { product_id: productId }];
    else if (url.pathname.endsWith("/product_offers")) {
      if (unavailable) return new Response(JSON.stringify({ code: "42P01" }), { status: 400 });
      const city = p.get("market_id") === `eq.${hamburg}` ? "hamburg" : "valencia";
      const locale = p.get("product.product_localizations.locale") === "eq.es" ? "es" : "en";
      data = [{ id: city === "hamburg" ? "55555555-5555-4555-8555-555555555555" : "44444444-4444-4444-8444-444444444444", market_id: city === "hamburg" ? hamburg : valencia, product_id: productId, stock_total: 4, online_capacity: city === "hamburg" ? 1 : 4,
        offer_pricing_tiers: [{ min_days: 1, per_day_cents: city === "hamburg" ? 2200 : 1500 }],
        market: { slug: city, currency: "eur", timezone: "Europe/Madrid", supported_locales: ["en", "es"] },
        product: { id: productId, slug: "shared-stroller", name: "Shared stroller", description: "Global facts", content_status: "content_ready", category: { slug: "baby-gear", name: "Baby gear" },
          product_localizations: [{ locale, short_description: locale === "es" ? "Descripción" : "Description" }], product_faqs: [], product_images: [] } }];
    } else assert.fail(`Unexpected catalogue query: ${url.pathname}`);
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  });
  const a = await getProductsFromDB("valencia", "en");
  const b = await getProductsFromDB("hamburg", "en");
  assert.equal(a[0].id, b[0].id); assert.notEqual(a[0].productOfferId, b[0].productOfferId);
  assert.equal(a[0].pricing[0].perDay, 15); assert.equal(b[0].pricing[0].perDay, 22);
  assert.equal(b[0].stockAvailable, 1);
  const before = calls.filter(url => url.pathname.endsWith("/product_offers")).length;
  assert.deepEqual(await getProductsFromDB("hamburg", "en"), b);
  assert.equal(calls.filter(url => url.pathname.endsWith("/product_offers")).length, before);
  const spanish = await getProductsFromDB("hamburg", "es");
  assert.equal(spanish[0].description, "Descripción"); assert.equal(b[0].description, "Description");
  assert.equal((await getProductBySlugFromDB("shared-stroller", "en", "valencia")).pricing[0].perDay, 15);
  assert.equal((await getProductBySlugFromDB("shared-stroller", "en", "hamburg")).pricing[0].perDay, 22);
  assert.equal((await getProductsByCategoryFromDB("baby-gear", "en", "hamburg")).length, 1);
  const categoryRequest = calls.find(url => url.searchParams.has("product_id"));
  assert.equal(categoryRequest.searchParams.get("product_id"), `in.(${productId})`);
  hidden = true;
  await assert.rejects(getProductsFromDB("hamburg", "en"), { code: "market_not_found" });
  hidden = false; unavailable = true;
  await assert.rejects(getProductBySlugFromDB("stroller-travel-compact", "es", "hamburg"), /Offer read failed/);
});
