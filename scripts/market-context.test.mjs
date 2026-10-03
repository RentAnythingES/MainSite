import assert from "node:assert/strict";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";
import { resolveMarketContext, resolveDefaultMarketContext } from "../src/lib/market-context.ts";
import { validateMarketSetup } from "../src/lib/market-validation.ts";
import { fetchActivePickupLocations, fetchActiveServiceZones } from "../src/lib/fulfillment-options.ts";

const id = "11111111-1111-4111-8111-111111111111";
const city = { id, slug: "valencia", name: "Valencia", country_code: "ES", timezone: "Europe/Madrid", currency: "eur", default_locale: "en", supported_locales: ["en", "es"], is_active: true, is_public: true, is_booking_enabled: true, is_indexable: true };
const setup = { slug: "hamburg", name: "Hamburg", country_code: "DE", timezone: "Europe/Berlin", currency: "eur", default_locale: "en", supported_locales: ["en"] };
function client(body, status = 200, calls = []) {
  return createClient("http://127.0.0.1:9999", "test", { global: { fetch: async url => {
    calls.push(new URL(url));
    if (new URL(url).pathname.endsWith('/market_locales')) {
      const locale = new URL(url).searchParams.get('locale').slice(3);
      return new Response(JSON.stringify([{ market_id:id, locale, is_public:true, is_booking_enabled:true, is_indexable:true, language:{code:locale,is_public:true} }]), {headers:{'Content-Type':'application/json'}});
    }
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  } } });
}
test("legacy context resolves Valencia by slug with a non-null ID", async () => {
  const calls = [];
  assert.equal((await resolveDefaultMarketContext(client([city], 200, calls))).id, id);
  assert.equal(calls[0].searchParams.get("slug"), "eq.valencia");
});
test("explicit unknown city never falls back and schema errors fail closed", async () => {
  await assert.rejects(resolveMarketContext(client([]), { mode: "public", marketSlug: "hamburg" }), { code: "market_not_found" });
  for (const code of ["42P01", "PGRST204", "PGRST205"]) await assert.rejects(resolveDefaultMarketContext(client({ code }, 400)), { code: "market_unavailable" });
});
test("public gates and languages are enforced", async () => {
  for (const flag of ["is_public", "is_active"]) await assert.rejects(resolveDefaultMarketContext(client([{ ...city, [flag]: false }])), { status: 404 });
  await assert.rejects(resolveDefaultMarketContext(client([{ ...city, is_booking_enabled: false }])), { code: "booking_disabled" });
  await assert.rejects(resolveMarketContext(client([city]), { mode: "public", locale: "de" }), { code: "unsupported_locale" });
  await assert.rejects(resolveMarketContext(client([city]), { mode: "public", marketSlug: "" }), { code: "invalid_market" });
  assert.equal((await resolveMarketContext(client([city]), { mode: "public", locale: "es" })).locale, "es");
});
test("historical context reads a retired city by ID and preserves historical language", async () => {
  const calls = [];
  const result = await resolveMarketContext(client([{ ...city, is_public: false, is_active: false }], 200, calls), { mode: "historical", marketId: id, locale: "de" });
  assert.equal(result.locale, "de"); assert.equal(calls[0].searchParams.get("id"), `eq.${id}`);
  await assert.rejects(resolveMarketContext(client([city]), { mode: "operator", marketId: "" }), { code: "invalid_market" });
});
test("setup validates capabilities, reserved routes and rejects privilege fields", () => {
  assert.equal(validateMarketSetup(setup).slug, "hamburg");
  for (const slug of ["admin", "api", "newsletter", "de", "de-de", "eng", "Hamburg", "a/b", "a".repeat(65)]) assert.throws(() => validateMarketSetup({ ...setup, slug }));
  for (const change of [{ timezone: "Europe/Fake" }, { currency: "usd" }, { supported_locales: ["de"] }, { supported_locales: ["en", "en"] }, { default_locale: "es" }, { is_public: true }, { is_default: true }, { country_code: "de" }]) assert.throws(() => validateMarketSetup({ ...setup, ...change }));
});
test("fulfillment queries require city IDs, preserve filters on fallback and omit private fields", async () => {
  for (const reader of [fetchActivePickupLocations, fetchActiveServiceZones]) {
    const calls = [];
    await assert.rejects(reader(client([], 200, calls), null)); assert.equal(calls.length, 0);
    let attempts = 0;
    const db = createClient("http://127.0.0.1:9999", "test", { global: { fetch: async url => {
      calls.push(new URL(url)); attempts++;
      return new Response(JSON.stringify(attempts === 1 ? { code: "PGRST204" } : []), { status: attempts === 1 ? 400 : 200 });
    } } });
    await reader(db, id); assert.equal(calls.length, 2);
    for (const url of calls) {
      assert.equal(url.searchParams.get("market_id"), `eq.${id}`);
      assert.doesNotMatch(url.searchParams.get("select"), /internal_notes|handoff_contact/);
      if (reader === fetchActiveServiceZones) assert.equal(url.searchParams.get("automatic_checkout_enabled"), "eq.true");
    }
  }
});

test('public locale gates apply to privileged reads; errors never fall back', async()=>{
 const entry={market_id:id,locale:'en',is_public:true,is_booking_enabled:true,is_indexable:true,language:{code:'en',is_public:true}};
 const db=(rows,error)=>createClient('http://127.0.0.1:9999','test',{global:{fetch:async url=>{
  const path=new URL(url).pathname;
  assert.ok(['/rest/v1/markets','/rest/v1/market_locales'].includes(path));
  return new Response(JSON.stringify(path.endsWith('/markets')?[city]:error??rows),{status:path.endsWith('/market_locales')&&error?400:200,headers:{'Content-Type':'application/json'}});
 }}});
 for(const rows of [[],[entry,entry],[{...entry,is_public:false}],[{...entry,language:{code:'en',is_public:false}}],[{...entry,market_id:'wrong'}]])
  await assert.rejects(resolveDefaultMarketContext(db(rows)),{code:'unsupported_locale'});
 for(const code of ['42P01','PGRST205','57014'])
  await assert.rejects(resolveDefaultMarketContext(db(null,{code})),{code:'locale_unavailable'});
 await assert.rejects(resolveDefaultMarketContext(db([{...entry,is_booking_enabled:false}])),{code:'booking_disabled'});
 const browse=await resolveMarketContext(db([{...entry,is_booking_enabled:false,is_indexable:false}]),{mode:'public'});
 assert.equal(browse.isBookingEnabled,false);assert.equal(browse.isIndexable,false);
 const historical=await resolveMarketContext(db(null,{code:'42P01'}),{mode:'historical',marketId:id,locale:'de'});
 assert.equal(historical.locale,'de');
});
