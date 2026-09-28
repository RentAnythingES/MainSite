import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

// No env file is loaded, and every HTTP request is intercepted and checked.
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:9999";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only";
const { GET: options } = await import("../src/app/api/booking-options/route.ts");
const { GET: list, POST: create } = await import("../src/app/api/admin/markets/route.ts");
const { PATCH: update } = await import("../src/app/api/admin/markets/[id]/route.ts");
const id = "11111111-1111-4111-8111-111111111111";
const setup = { slug: "hamburg", name: "Hamburg", country_code: "DE", timezone: "Europe/Berlin", currency: "eur", default_locale: "en", supported_locales: ["en"] };
const city = { ...setup, id, slug: "valencia", is_public: true, is_active: true, is_booking_enabled: true, is_indexable: true };
function request(path, method = "GET", body, origin = "http://localhost:3000", token = "admin") {
  return new NextRequest(`http://localhost:3000${path}`, { method, headers: { origin, cookie: `sb-access-token=${token}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
function transport(t, { role = "admin", markets = [city], rpcError } = {}) {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "http://127.0.0.1:9999", "External HTTP is forbidden");
    calls.push({ url, init });
    let body;
    if (url.pathname === "/auth/v1/user") body = { id, app_metadata: { role } };
    else if (url.pathname === "/rest/v1/markets") body = markets;
    else if (url.pathname === "/rest/v1/market_locales") body = [{ market_id:id,locale:'en',is_public:true,is_booking_enabled:true,is_indexable:true,language:{code:'en',is_public:true} }];
    else if (url.pathname === "/rest/v1/rpc/save_private_market") body = rpcError ?? { ...setup, id };
    else if (["/rest/v1/pickup_locations", "/rest/v1/service_zones"].includes(url.pathname)) body = [];
    else assert.fail(`Unexpected HTTP request: ${url}`);
    return new Response(JSON.stringify(body), { status: rpcError && url.pathname.includes("/rpc/") ? 400 : 200, headers: { "Content-Type": "application/json" } });
  });
  return calls;
}
test("booking options preserve legacy payload and city-filter every fulfillment read", async t => {
  const calls = transport(t);
  const response = await options(request("/api/booking-options"));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { pickupLocations: [], serviceZones: [] });
  for (const { url } of calls.filter(c => c.url.pathname !== "/rest/v1/markets")) assert.equal(url.searchParams.get("market_id"), `eq.${id}`);
});
test("private city requests stop before querying fulfillment", async t => {
  const calls = transport(t, { markets: [{ ...city, is_public: false }] });
  assert.equal((await options(request("/api/booking-options?marketSlug=hamburg"))).status, 404);
  assert.equal(calls.length, 1);
});
test("ambiguous and empty parameters are rejected", async t => {
  transport(t);
  for (const params of ["marketSlug=", "locale=", "marketSlug=hamburg&marketSlug=berlin"]) assert.equal((await options(request(`/api/booking-options?${params}`))).status, 400);
});
test("non-admin cannot list/create/edit markets", async t => {
  const calls = transport(t, { role: "operator" });
  assert.equal((await list(request("/api/admin/markets"))).status, 401);
  assert.equal((await create(request("/api/admin/markets", "POST", setup))).status, 401);
  assert.equal((await update(request(`/api/admin/markets/${id}`, "PATCH", setup), { params: Promise.resolve({ id }) })).status, 401);
  assert.ok(calls.every(c => c.url.pathname === "/auth/v1/user"));
});
test("cross-origin and launch flag writes never reach the database", async t => {
  const calls = transport(t);
  assert.equal((await create(request("/api/admin/markets", "POST", setup, "https://foreign.test"))).status, 403);
  assert.equal((await create(request("/api/admin/markets", "POST", { ...setup, is_public: true }))).status, 400);
  assert.ok(calls.every(c => c.url.pathname === "/auth/v1/user"));
});
test("admin creation uses authenticated actor and atomic RPC", async t => {
  const calls = transport(t);
  assert.equal((await create(request("/api/admin/markets", "POST", setup))).status, 201);
  const rpc = calls.find(c => c.url.pathname.includes("/rpc/"));
  const body = JSON.parse(rpc.init.body);
  assert.equal(body.p_actor_id, id); assert.deepEqual(body.p_config, setup); assert.equal(body.p_market_id, null);
});
test("browser Host survives Next's localhost normalization", async t => {
  transport(t);
  const req = request("/api/admin/markets", "POST", setup, "http://127.0.0.1:3000");
  req.headers.set("host", "127.0.0.1:3000");
  assert.equal((await create(req)).status, 201);
});
test("stale updates return a recoverable conflict", async t => {
  transport(t, { rpcError: { code: "40001", message: "stale" } });
  assert.equal((await update(request(`/api/admin/markets/${id}`, "PATCH", { ...setup, expectedUpdatedAt: "2026-09-27T00:00:00Z" }), { params: Promise.resolve({ id }) })).status, 409);
});
