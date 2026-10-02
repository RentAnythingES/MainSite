import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { contactMessageCopy, newsletterCopy, newsletterConsentVersion } from "../src/i18n/outreach.ts";
import { renderContactMessage, renderSignupMessage } from "../src/lib/outreach-message.ts";
import { outreachLocale } from "../src/lib/outreach-locale.ts";
import { POST as contact } from "../src/app/api/contact/route.ts";
import { POST as subscribe } from "../src/app/api/newsletter/route.ts";

function local(t) {
  for (const [key, value] of Object.entries({ NODE_ENV: "test", LOCALIZATION_PREVIEW: "true", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:9999", SUPABASE_SERVICE_ROLE_KEY: "local-test", STRIPE_SECRET_KEY: "sk_test_mock", RESEND_API_KEY: "" })) {
    const previous = process.env[key];
    process.env[key] = value;
    t.after(() => { if (previous === undefined) delete process.env[key]; else process.env[key] = previous; });
  }
}
const request = (path, body) => new NextRequest(`http://localhost${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("outreach copy covers all languages and German emails escape dynamic content", () => {
  for (const dictionary of [contactMessageCopy, newsletterCopy]) {
    for (const locale of ["en", "es", "de"]) {
      assert.deepEqual(Object.keys(dictionary[locale]), Object.keys(dictionary.en));
      assert.ok(Object.values(dictionary[locale]).every(value => value.trim()));
    }
  }
  const contactMessage = renderContactMessage({ locale: "de", name: "Jürgen <script>", productName: "<img>" });
  const welcome = renderSignupMessage({ locale: "de", name: "<script>", interest: "<img>", unsubscribeUrl: "https://example.test/?a=1&b=2" });
  for (const message of [contactMessage, welcome]) {
    assert.match(message.html, /lang="de"/);
    assert.match(message.html, /&lt;script&gt;/);
    assert.match(message.html, /&lt;img&gt;/);
    assert.doesNotMatch(message.html, /<script>|Welcome|Spain|Travel light/);
  }
  assert.match(welcome.html, /Abmelden/);
  assert.match(welcome.html, /a=1&amp;b=2/);
  assert.throws(() => renderSignupMessage({ locale: "xx", unsubscribeUrl: "https://example.test" }), /language/);
});

test("new German requests require the private gate and unsupported locales never fall back", t => {
  local(t);
  assert.equal(outreachLocale("de"), "de");
  for (const value of ["xx", "constructor", "", 42]) assert.throws(() => outreachLocale(value));
  process.env.LOCALIZATION_PREVIEW = "false";
  assert.throws(() => outreachLocale("de"), /not available/);
  assert.equal(outreachLocale("es"), "es");
  assert.equal(outreachLocale(undefined), "en");
});

test("private contact validates in German without outbound messages", async t => {
  local(t);
  t.mock.method(globalThis, "fetch", async () => assert.fail("No outbound request permitted"));
  const body = { locale: "de", name: "Jürgen", email: "review@example.test", message: "Testnachricht" };
  let response = await contact(request("/api/contact", { ...body, email: "invalid" }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, contactMessageCopy.de.invalidEmail);
  response = await contact(request("/api/contact", body));
  assert.deepEqual(await response.json(), { success: true, preview: true });
});

test("newsletter requires actual consent and saves exactly the displayed German statement", async t => {
  local(t);
  let writes = 0;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "http://127.0.0.1:9999", "External HTTP forbidden");
    assert.equal(url.pathname, "/rest/v1/newsletter_subscribers");
    assert.equal(init.method, "POST");
    const saved = JSON.parse(init.body);
    assert.equal(saved.locale, "de");
    assert.equal(saved.consent_text, newsletterCopy.de.consent);
    assert.equal(saved.consent_version, newsletterConsentVersion);
    writes++;
    return new Response(JSON.stringify({ unsubscribe_token: "test" }), { headers: { "Content-Type": "application/json" } });
  });
  const body = { locale: "de", email: "review@example.test", consent: "false" };
  const denied = await subscribe(request("/api/newsletter", body));
  assert.equal(denied.status, 400); assert.equal(writes, 0);
  const accepted = await subscribe(request("/api/newsletter", { ...body, consent: true }));
  assert.equal(accepted.status, 200); assert.equal(writes, 1);
  assert.equal((await accepted.json()).preview, true);
});
