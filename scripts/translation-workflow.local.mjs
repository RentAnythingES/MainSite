import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { blankTranslation } from "../src/lib/translation-workflow.ts";
registerHooks({
  resolve(specifier, context, next) {
    if (["next/cache", "server-only"].includes(specifier))
      return { url: `translation-test:${specifier}`, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("translation-test:"))
      return {
        format: "module",
        shortCircuit: true,
        source:
          "export const revalidateTag=()=>{};export const revalidatePath=()=>{};",
      };
    return next(url, context);
  },
});
const local = JSON.parse(
  fs
    .readFileSync(process.env.LOCAL_SUPABASE_STATUS_FILE, "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith('{"DB_URL"')),
);
assert.equal(local.API_URL, "http://127.0.0.1:54321");
Object.assign(process.env, {
  NEXT_PUBLIC_SUPABASE_URL: local.API_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: local.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: local.SERVICE_ROLE_KEY,
});
const actualFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  assert.equal(url.origin, local.API_URL, "External network blocked");
  return actualFetch(input, { ...init, signal: AbortSignal.timeout(8000) });
};
const db = new pg.Client({
  host: "127.0.0.1",
  port: 54322,
  user: "postgres",
  password: "postgres",
  database: "postgres",
  connectionTimeoutMillis: 5000,
  query_timeout: 8000,
});
const timeout = setTimeout(() => {
  console.error("Local workflow deadline exceeded");
  process.exit(2);
}, 55000);
try {
  await db.connect();
  const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // Dedicated local-only synthetic identity, never a production account.
  const email = "translation-review@example.test";
  const password = "Local-translation-review-2026!";
  const creation = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });
  if (creation.error && !creation.error.message.includes("already"))
    throw creation.error;
  const login = await admin.auth.signInWithPassword({ email, password });
  if (login.error) throw login.error;
  const token = login.data.session.access_token;
  const userId = login.data.user.id;
  const { GET, PUT } = await import(
    "../src/app/api/admin/products/[id]/translations/route.ts"
  );
  const source = (
    await db.query(
      "select category_id from products where slug='stroller-travel-compact'",
    )
  ).rows[0];
  const product = (
    await db.query(
      "insert into products(name,slug,brand,category_id,subcategory,subcategory_slug,description,is_active,content_status) values ('Translation test',$1,'TEST',$2,'Test','test','Synthetic English source',false,'content_ready') returning id,slug,translation_source_revision",
      [
        "translation-test-" + crypto.randomUUID().slice(0, 8),
        source.category_id,
      ],
    )
  ).rows[0];
  const params = { params: Promise.resolve({ id: product.id }) };
  const request = (body, authorized = true) =>
    new NextRequest(
      `http://127.0.0.1:3107/api/admin/products/${product.id}/translations?locale=de`,
      {
        method: body ? "PUT" : "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authorized ? { cookie: `sb-access-token=${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );
  assert.equal((await GET(request(null, false), params)).status, 401);
  let response = await GET(request(null), params);
  let data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(data.canPublish, false);
  const content = {
    ...blankTranslation(),
    name: "Testartikel",
    short_description: "Nur lokale Testdaten",
    detail_description: "Keine echte Produktbeschreibung.",
    includes_text: "Test",
    constraints_text: "Test",
    delivery_setup_note: "Test",
    care_note: "Test",
    seo_title: "Lokaler Übersetzungstest",
    seo_description: "x".repeat(140),
    image_alt_text: "Testbild",
    faqs: Array.from({ length: 3 }, () => ({
      question: "Testfrage?",
      answer: "Testantwort.",
    })),
  };
  const body = {
    locale: "de",
    action: "save",
    expectedRevision: 0,
    expectedSourceRevision: Number(product.translation_source_revision),
    content,
    actor_id: "untrusted-client",
  };
  response = await PUT(request(body), params);
  data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(data.entry.publication_status, "draft");
  assert.equal((await PUT(request(body), params)).status, 409);
  body.expectedRevision = 1;
  body.action = "review";
  assert.equal((await PUT(request(body), params)).status, 400);
  body.languageReviewed = true;
  body.factsReviewed = true;
  response = await PUT(request(body), params);
  data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(data.entry.reviewed_by, userId);
  body.action = "publish";
  assert.equal((await PUT(request(body), params)).status, 409);
  await db.query(
    "update products set description='Changed synthetic source' where id=$1",
    [product.id],
  );
  response = await GET(request(null), params);
  data = await response.json();
  assert.equal(data.entry.publication_status, "stale");
  assert.equal(data.readiness.current, false);
  body.action = "save";
  assert.equal((await PUT(request(body), params)).status, 409);
  body.expectedSourceRevision = data.product.translation_source_revision;
  response = await PUT(request(body), params);
  assert.equal(response.status, 200);
  const published = await createClient(local.API_URL, local.ANON_KEY, {
    auth: { persistSession: false },
  })
    .from("product_localizations")
    .select("*")
    .eq("product_id", product.id)
    .eq("locale", "de");
  assert.deepEqual(published.data, []);
  const receipt = {
    localOnly: true,
    externalHttpBlocked: true,
    productId: product.id,
    productSlug: product.slug,
    cases: [
      "admin-required",
      "private-registry",
      "atomic-draft",
      "stale-edit-conflict",
      "review-attestations",
      "server-reviewer-identity",
      "German-publish-blocked",
      "source-invalidates-review",
      "source-edit-conflict",
      "revised-draft-save",
      "anonymous-draft-hidden",
    ],
  };
  if (process.env.LOCAL_WORKFLOW_RECEIPT)
    fs.writeFileSync(
      process.env.LOCAL_WORKFLOW_RECEIPT,
      JSON.stringify(receipt, null, 2),
    );
  console.log(JSON.stringify(receipt));
} finally {
  clearTimeout(timeout);
  await db.end();
  globalThis.fetch = actualFetch;
}
