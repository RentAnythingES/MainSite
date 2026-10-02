import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { NextRequest } from "next/server";
import { rehearseGermanQuotes } from "./german-quotes.local.mjs";
const statusFile = process.env.LOCAL_SUPABASE_STATUS_FILE;
assert.ok(
  statusFile,
  "Set LOCAL_SUPABASE_STATUS_FILE to the local CLI status file",
);
const local = JSON.parse(fs.readFileSync(statusFile, "utf8").replace(/^\uFEFF/, ""));
assert.equal(local.API_URL, "http://127.0.0.1:55321");
const localDatabase = new URL(local.DB_URL);
assert.ok(["127.0.0.1", "localhost"].includes(localDatabase.hostname));
assert.equal(localDatabase.port, "55322");
Object.assign(process.env, {
  NODE_ENV: "test",
  LOCALIZATION_PREVIEW: "true",
  LOCALIZATION_CATALOGUE_DRAFTS_FILE: path.join(path.dirname(statusFile), "german-catalogue-drafts.json"),
  NEXT_PUBLIC_SUPABASE_URL: local.API_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: local.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: local.SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: "sk_test_local_mock",
  STRIPE_WEBHOOK_SECRET: "whsec_local_mock",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  // Each independent local test run gets its own limiter namespace; limits stay enabled.
  RATE_LIMIT_HMAC_SECRET: `local-pilot-only-${crypto.randomUUID()}`,
});
for (const key of ["RESEND_API_KEY", "TELEGRAM_BOT_TOKEN", "VAPID_PRIVATE_KEY"])
  delete process.env[key];
const db = new pg.Client({
  host: "127.0.0.1",
  port: 55322,
  user: "postgres",
  password: "postgres",
  database: "postgres",
  connectionTimeoutMillis: 5000,
  query_timeout: 8000,
});
const actualFetch = globalThis.fetch;
const emails = [];
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.hostname === "api.resend.com") {
    emails.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ id: "mock-email" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  assert.equal(
    url.origin,
    local.API_URL,
    `External HTTP blocked: ${url.origin}`,
  );
  return actualFetch(input, { ...init, signal: AbortSignal.timeout(8000) });
};
const { stripe } = await import("../src/lib/stripe.ts");
let session;
let parameters;
stripe.checkout.sessions.create = async (params) => {
  parameters = params;
  session = {
    id: `cs_test_${crypto.randomUUID()}`,
    url: "http://127.0.0.1:3000/test-payment",
    status: "open",
    payment_status: "unpaid",
    currency: "eur",
    amount_total: params.line_items.reduce(
      (sum, line) => sum + line.price_data.unit_amount * line.quantity,
      0,
    ),
    metadata: params.metadata,
    customer_email: "pilot@example.test",
    expires_at: Math.floor(Date.now() / 1000) + 1860,
  };
  return session;
};
stripe.checkout.sessions.retrieve = async () => session;
stripe.checkout.sessions.expire = async () => {
  session.status = "expired";
  return session;
};
stripe.webhooks.constructEvent = () => ({
  id: "evt_local_mock",
  type: "checkout.session.completed",
  data: { object: session },
});
const { POST: draft } = await import("../src/app/api/booking-drafts/route.ts");
const { GET: availability } = await import(
  "../src/app/api/availability/route.ts"
);
const { POST: checkout } = await import("../src/app/api/checkout/route.ts");
const { POST: webhook } = await import(
  "../src/app/api/webhooks/stripe/route.ts"
);
const { GET: status } = await import("../src/app/api/checkout/status/route.ts");
const { POST: cancel } = await import(
  "../src/app/api/booking-drafts/[id]/cancel/route.ts"
);
const { GET: reviewGet, POST: reviewPost } = await import(
  "../src/app/api/reviews/[token]/route.ts"
);
const { createBookingReviewInvitation } = await import(
  "../src/lib/booking-reviews.ts"
);
const { createServiceClient } = await import("../src/lib/supabase.ts");
const req = (path, body) =>
  new NextRequest("http://127.0.0.1:3000" + path, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": "mock-signature",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
const deadline = setTimeout(() => {
  console.error("Local journey deadline exceeded");
  process.exit(2);
}, 55000);
try {
  await db.connect();
  const pickup = (
    await db.query("select id from pickup_locations where slug='valencia'")
  ).rows[0].id;
  const latest = (
    await db.query(
      "select max(rental_end_at) as last from bookings where customer_email='pilot@example.test'",
    )
  ).rows[0].last;
  const start = new Date(
    Math.max(Date.now(), latest ? new Date(latest).getTime() : 0),
  );
  start.setUTCDate(start.getUTCDate() + 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 2);
  const body = {
    draftId: crypto.randomUUID(),
    locale: "de",
    productSlug: "stroller-travel-compact",
    quantity: 2,
    customerName: "Lokaler Test",
    customerEmail: "pilot@example.test",
    startDate: start.toISOString().slice(0, 10),
    startTime: "10:00",
    endDate: end.toISOString().slice(0, 10),
    endTime: "10:00",
    fulfillmentMode: "customer_pickup",
    pickupLocationId: pickup,
  };
  let response = await draft(req("/api/booking-drafts", body));
  let data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  const stored = (
    await db.query("select * from booking_drafts where id=$1", [body.draftId])
  ).rows[0];
  assert.equal(stored.locale, "de");
  const expectedName = JSON.parse(fs.readFileSync(process.env.LOCALIZATION_CATALOGUE_DRAFTS_FILE, "utf8")).products.find(p=>p.slug===body.productSlug).translation_content.name;
  assert.equal(stored.pricing_snapshot.displayName, expectedName);
  assert.equal(stored.timezone, "Europe/Madrid");
  response = await checkout(
    req("/api/checkout", { draftId: body.draftId, locale: "en" }),
  );
  data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(parameters.locale, "de");
  assert.match(parameters.line_items[0].price_data.product_data.name, /Miete/);
  assert.ok(parameters.line_items[0].price_data.product_data.name.includes(expectedName));
  const firstSessionId = session.id;
  response = await checkout(
    req("/api/checkout", { draftId: body.draftId, locale: "es" }),
  );
  assert.equal(response.status, 200);
  assert.equal(session.id, firstSessionId);
  assert.equal(parameters.locale, "de");
  const params = new URLSearchParams({
    slug: body.productSlug,
    start: body.startDate,
    end: body.endDate,
    startTime: "10:00",
    endTime: "10:00",
    mode: "customer_pickup",
    pickupLocationId: pickup,
    quantity: "1",
    locale: "de",
  });
  response = await availability(req("/api/availability?" + params));
  data = await response.json();
  assert.equal(data.available, false, JSON.stringify(data));
  response = await status(req("/api/checkout/status?id=" + session.id));
  data = await response.json();
  assert.equal(data.locale, "de");
  assert.equal(data.status, "payment_pending");
  response = await cancel(req("/api/booking-drafts/cancel", {}), {
    params: Promise.resolve({ id: body.draftId }),
  });
  assert.equal(response.status, 200);
  assert.equal(
    (
      await db.query(
        "select * from booking_inventory_blocks where booking_draft_id=$1",
        [body.draftId],
      )
    ).rows.length,
    0,
  );
  body.draftId = crypto.randomUUID();
  body.quantity = 1;
  response = await draft(req("/api/booking-drafts", body));
  data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  response = await checkout(req("/api/checkout", { draftId: body.draftId }));
  assert.equal(response.status, 200);
  session.status = "complete";
  session.payment_status = "paid";
  session.payment_intent = "pi_mock_" + crypto.randomUUID().replaceAll("-", "");
  process.env.RESEND_API_KEY = "re_local_mock";
  response = await webhook(req("/api/webhooks/stripe", {}));
  data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  const booking = (
    await db.query("select * from bookings where booking_draft_id=$1", [
      body.draftId,
    ])
  ).rows[0];
  assert.equal(booking.locale, "de");
  assert.ok(emails.some(email=>email.html?.includes(expectedName)), "German product name in confirmation");
  assert.ok(
    emails.some(
      (email) =>
        email.to === "pilot@example.test" &&
        email.html.includes('lang="de"') &&
        email.html.includes("Buchung bestätigt"),
    ),
    "German customer confirmation",
  );
  response = await webhook(req("/api/webhooks/stripe", {}));
  assert.equal(response.status, 200);
  assert.equal(
    (
      await db.query("select * from bookings where booking_draft_id=$1", [
        body.draftId,
      ])
    ).rows.length,
    1,
  );
  response = await status(req("/api/checkout/status?id=" + session.id));
  data = await response.json();
  assert.equal(data.status, "booking_confirmed");
  assert.equal(data.booking.productName, expectedName);
  fs.writeFileSync('F:/rentanything/agent-work/german-launch-2026-10-02/payment-return-fixture.json',JSON.stringify(data,null,2)+'\n');
  assert.equal(data.locale, "de");
  const document = (
    await db.query(
      "select * from booking_documents where booking_id=$1 and document_type='invoice'",
      [booking.id],
    )
  ).rows[0];
  assert.ok(document, "Invoice created");
  assert.equal(document.booking_snapshot.locale, "de");
  assert.equal(document.booking_snapshot.product_name, expectedName);
  assert.equal(document.total_cents, booking.total_cents);
  await db.query(
    "update bookings set confirmation_status='pending' where id=$1",
    [booking.id],
  );
  response = await status(req("/api/checkout/status?id=" + session.id));
  data = await response.json();
  assert.equal(data.status, "approval_pending");
  await db.query(
    "update bookings set confirmation_status='approved',status='completed' where id=$1",
    [booking.id],
  );
  const reviewUrl = await createBookingReviewInvitation(
    createServiceClient(),
    booking.id,
    booking.product_id,
    "de",
  );
  assert.match(reviewUrl, /locale=de/);
  const token = new URL(reviewUrl).pathname.split("/").pop();
  const reviewParams = { params: Promise.resolve({ token }) };
  response = await reviewGet(req("/api/reviews/" + token), reviewParams);
  data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.locale, "de");
  assert.equal(data.consentToPublish, false);
  assert.equal(data.productName, expectedName);
  response = await reviewPost(
    req("/api/reviews/" + token, {
      rating: 5,
      reviewBody: "Lokales Testfeedback. Keine echte Bewertung.",
      consentToPublish: false,
    }),
    reviewParams,
  );
  assert.equal(response.status, 200);
  const feedback = (
    await db.query("select * from booking_reviews where booking_id=$1", [
      booking.id,
    ])
  ).rows[0];
  assert.equal(feedback.locale, "de");
  assert.equal(feedback.consent_to_publish, false);
  assert.equal(feedback.status, "submitted");
  const quotes = await rehearseGermanQuotes({db, booking, pickup, req, checkout, webhook, getSession:()=>session, getParameters:()=>parameters, emails});
  console.log(
    JSON.stringify({
      localOnly: true,
      externalCallsBlocked: true,
      mockedStripe: true,
      mockedEmail: true,
      quotes,
      locale: "de",
      cases: [
        "draft",
        "stored-language-checkout",
        "resume-retains-language",
        "sold-out-hold",
        "payment-pending",
        "cancel-releases-hold",
        "paid-webhook",
        "German-email",
        "idempotent-webhook-retry",
        "confirmed-return",
        "localized-invoice-snapshot",
        "approval-pending-return",
        "German-review",
        "review-private-without-consent",
      ],
      bookingRef: booking.booking_ref,
    }),
  );
} finally {
  clearTimeout(deadline);
  await db.end();
  globalThis.fetch = actualFetch;
}
