import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { NextRequest } from "next/server";
import { quoteCopy, amendmentCopy, quoteMoney, quoteDate } from "../src/i18n/private-quotes.ts";
import { renderAmendmentMessage } from "../src/lib/amendment-message.ts";
import { transactionPath } from "../src/lib/transaction-path.ts";
import { canAddTransport } from "../src/lib/fulfillment-amendments.ts";

test("transport changes allow paid active bookings only before rental start", () => {
  const now = Date.parse("2026-09-29T12:00:00Z");
  for (const status of ["active", "paid", "confirmed"]) {
    assert.equal(canAddTransport(status, "2026-09-30T12:00:00Z", now), true);
    for (const date of [null, undefined, "invalid", "2026-09-29T12:00:00Z", "2026-09-28T12:00:00Z"]) assert.equal(canAddTransport(status, date, now), false);
  }
  for (const status of ["pending", "cancelled", "completed", "delivering", "returning", "refunded"]) assert.equal(canAddTransport(status, "2026-09-30T12:00:00Z", now), false);
});

test("transaction destinations retain existing URLs and confine German to the private root", () => {
  for (const path of ["/booking/success", "/booking/cancel", "/booking/quote/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "/booking/fulfillment/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"]) {
    assert.equal(transactionPath("en", path), path);
    assert.equal(transactionPath("es", path), path);
    assert.equal(transactionPath("de", path), `/internal/localization/de${path}`);
  }
  for (const path of ["https://example.test", "//example.test", "/booking/../admin", "/booking/success?next=evil"]) {
    assert.throws(() => transactionPath("de", path), /Invalid transaction path/);
  }
});

test("quote copy covers all languages and German formatting retains amounts and dates", () => {
  for (const dictionary of [quoteCopy, amendmentCopy]) for (const locale of ["en", "es", "de"]) {
    assert.deepEqual(Object.keys(dictionary[locale]), Object.keys(dictionary.en));
    assert.ok(Object.values(dictionary[locale]).every(value => value.trim()));
  }
  assert.match(quoteMoney(12345, "eur", "de"), /123,45/);
  assert.match(quoteDate("2027-02-03T12:00:00Z", "de"), /03\.02\.2027/);
  assert.equal(quoteDate(null, "de"), "Noch zu bestätigen");
});

test("German transport emails preserve amounts, services and escaped customer text", () => {
  const data = { locale: "de", customerName: "Jürgen <script>", customerEmail: "review@example.test", bookingRef: "TEST-1", productName: "Testartikel <img>", fulfillmentMode: "delivery_and_collection", deliveryAddress: "A & B", collectionAddress: "Abholort", totalCents: 3200, customerUrl: "http://localhost/?a=1&b=2", documentUrl: "http://localhost/invoice", expiresAt: "2027-02-01T12:00:00Z" };
  for (const confirmed of [false, true]) {
    const rendered = renderAmendmentMessage(data, confirmed);
    assert.match(rendered.html, /lang="de"/);
    assert.match(rendered.html, /32,00/); assert.match(rendered.html, /Lieferung und Abholung/);
    assert.match(rendered.html, /&lt;script&gt;/); assert.match(rendered.html, /A &amp; B/);
    assert.doesNotMatch(rendered.html, /<script>|Delivery|Collection|Payment received|Spain/);
  }
  assert.throws(() => renderAmendmentMessage({ ...data, locale: "unknown" }), /Invalid/);
});

test("custom quote language is inherited atomically and cannot be overridden by a draft writer", async () => {
  const db = new PGlite();
  try {
    await db.exec("create table locales(code text primary key); insert into locales values('en'),('es'),('de'); create table booking_custom_quotes(id uuid primary key); create table booking_drafts(id int primary key, custom_quote_id uuid references booking_custom_quotes(id), locale text references locales(code)); insert into booking_custom_quotes values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'); insert into booking_drafts values(1,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',null);");
    await db.exec(readFileSync(new URL("../supabase/migrations/20260929_custom_quote_language.sql", import.meta.url), "utf8"));
    assert.equal((await db.query("select locale from booking_custom_quotes")).rows[0].locale, null);
    assert.equal((await db.query("select locale from booking_drafts where id=1")).rows[0].locale, null);
    await db.exec("update booking_custom_quotes set locale='de'");
    await db.exec("begin; insert into booking_drafts values(2,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','es');");
    assert.equal((await db.query("select locale from booking_drafts where id=2")).rows[0].locale, "de");
    await db.exec("rollback"); assert.equal((await db.query("select count(*)::int as n from booking_drafts")).rows[0].n, 1);
    await db.exec("insert into booking_drafts values(2,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','es'); update booking_drafts set locale='en' where id=2;");
    assert.equal((await db.query("select locale from booking_drafts where id=2")).rows[0].locale, "de");
    await assert.rejects(db.exec("update booking_custom_quotes set locale='unknown'"), { code: "23503" });
    await db.exec("insert into booking_drafts values(3,null,'es')");
    assert.equal((await db.query("select locale from booking_drafts where id=3")).rows[0].locale, "es");
  } finally { await db.close(); }
});

function local(t) {
  for (const [key, value] of Object.entries({ NODE_ENV: "test", LOCALIZATION_PREVIEW: "true", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:9999", SUPABASE_SERVICE_ROLE_KEY: "local-test", STRIPE_SECRET_KEY: "sk_test_mock", RESEND_API_KEY: "" })) {
    const old = process.env[key]; process.env[key] = value;
    t.after(() => { if (old === undefined) delete process.env[key]; else process.env[key] = old; });
  }
}
const token = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const context = { params: Promise.resolve({ token }) };

test("custom quote view and acceptance retain saved German and enforce the preview gate", async t => {
  local(t);
  const { GET } = await import("../src/app/api/custom-quotes/[token]/route.ts");
  const { POST } = await import("../src/app/api/custom-quotes/[token]/accept/route.ts");
  let accepted = 0;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "http://127.0.0.1:9999", "No external HTTP");
    if (url.pathname === "/rest/v1/booking_custom_quotes") {
      assert.ok(url.searchParams.get("select").includes("locale"));
      return new Response(JSON.stringify({ locale: "de", status: "open", expires_at: "2099-01-01T00:00:00Z", display_name: "Individuelles Paket" }), { headers: { "Content-Type": "application/json" } });
    }
    assert.equal(url.pathname, "/rest/v1/rpc/accept_custom_booking_quote");
    const params = JSON.parse(init.body);
    assert.equal(params.p_public_token, token); assert.equal(params.locale, undefined); assert.equal(params.p_locale, undefined);
    accepted++;
    return new Response(JSON.stringify(token), { headers: { "Content-Type": "application/json" } });
  });
  const getRequest = new NextRequest(`http://localhost/api/custom-quotes/${token}?locale=es`);
  assert.equal((await (await GET(getRequest, context)).json()).quote.locale, "de");
  const post = () => new NextRequest("http://localhost/api/custom-quotes/test/accept", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: "es", customerName: "Jürgen", customerEmail: "review@example.test" }) });
  assert.equal((await POST(post(), context)).status, 200); assert.equal(accepted, 1);
  process.env.LOCALIZATION_PREVIEW = "false";
  assert.equal((await GET(getRequest, context)).status, 404);
  assert.equal((await POST(post(), context)).status, 404); assert.equal(accepted, 1);
});

test("German amendment view and Stripe checkout use saved language despite conflicting browser hints", async t => {
  local(t);
  const { GET } = await import("../src/app/api/fulfillment-amendments/[token]/route.ts");
  const { POST } = await import("../src/app/api/fulfillment-amendments/[token]/checkout/route.ts");
  const { stripe } = await import("../src/lib/stripe.ts");
  const data = {
    id: token, booking_id: token, public_token: token, status: "quoted", expires_at: "2099-01-01T00:00:00Z",
    delivery_fee_cents: 1500, collection_fee_cents: 1700, currency: "eur", fulfillment_mode: "delivery_and_collection",
    delivery_address: "Testadresse", collection_address: "Testadresse", is_custom_quote: true,
    booking: { booking_ref: "TEST-1", status: "confirmed", rental_start_at: "2099-01-01T00:00:00Z", customer_email: "review@example.test", customer_name: "Jürgen", locale: "de", pricing_snapshot: { displayName: "Individuelles Testpaket" }, product: { name: "English source", slug: "custom-quote" } },
  };
  let writes = 0, payments = 0;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "http://127.0.0.1:9999", "No external network");
    assert.equal(url.pathname, "/rest/v1/booking_fulfillment_amendments");
    if (init.method === "PATCH") { writes++; return new Response(null, { status: 204 }); }
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  });
  t.mock.method(stripe.checkout.sessions, "create", async params => {
    payments++; assert.equal(params.locale, "de"); assert.equal(params.metadata.locale, "de");
    assert.equal(new URL(params.success_url).pathname, `/internal/localization/de/booking/fulfillment/${token}`);
    assert.equal(new URL(params.success_url).search, "?payment=success");
    assert.equal(new URL(params.cancel_url).pathname, `/internal/localization/de/booking/fulfillment/${token}`);
    assert.equal(new URL(params.cancel_url).search, "?payment=cancelled");
    assert.equal(params.line_items[0].price_data.unit_amount, 3200);
    assert.equal(params.line_items[0].price_data.product_data.name, "Lieferung und Abholung");
    assert.equal(params.line_items[0].price_data.product_data.description, "Individuelles Testpaket · Buchung TEST-1");
    return { id: "cs_test_mock", url: "http://localhost/mock-checkout" };
  });
  const view = await GET(new NextRequest(`http://localhost/api/fulfillment-amendments/${token}?locale=es`), context);
  const result = await view.json();
  assert.equal(result.locale, "de"); assert.equal(result.productName, "Individuelles Testpaket");
  assert.equal(result.deliveryZoneName, amendmentCopy.de.custom);
  const response = await POST(new NextRequest(`http://localhost/api/fulfillment-amendments/${token}/checkout?locale=es`, { method: "POST" }), context);
  assert.equal(response.status, 200); assert.equal(payments, 1); assert.equal(writes, 1);
  process.env.LOCALIZATION_PREVIEW = "false";
  assert.equal((await GET(new NextRequest("http://localhost/"), context)).status, 404);
  assert.equal((await POST(new NextRequest("http://localhost/", { method: "POST" }), context)).status, 404);
  assert.equal(payments, 1); assert.equal(writes, 1);
});
