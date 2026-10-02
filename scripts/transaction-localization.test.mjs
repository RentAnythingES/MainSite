import test from "node:test";
import assert from "node:assert/strict";
import { renderBookingMessage, renderDocumentMessage } from "../src/lib/booking-message.ts";
import { buildBookingDocumentPdf } from "../src/lib/document-pdf.ts";
import { labels, policyMessages } from "../src/i18n/booking.ts";
import { transactionCopy } from "../src/i18n/transaction.ts";
import { reviewCopy } from "../src/i18n/review.ts";
import { privateGermanPreviewEnabled } from "../src/lib/localization-preview.ts";
const booking = {
  locale: "de",
  bookingRef: "TEST-123",
  customerName: "<script>alert(1)</script>",
  customerEmail: "pilot@example.test",
  productName: "CYBEX Coya",
  startDate: "2026-10-05",
  endDate: "2026-10-07",
  rentalStartAt: "2026-10-05T08:00:00Z",
  rentalEndAt: "2026-10-07T08:00:00Z",
  rentalDays: 2,
  totalCents: 3000,
  deliveryAddress: "Testadresse",
  deliveryType: "standard",
  fulfillmentMode: "customer_pickup",
  internalNotes: "DO NOT EXPOSE",
  documentLinks: [
    {
      label: "Download invoice",
      url: "https://example.test/doc",
      documentNumber: "TEST-1",
    },
  ],
};

test("document email and PDF retain saved German language and characters", () => {
  const message = renderDocumentMessage({locale:'de',customerName:'Jürgen <Müller>',bookingRef:'TEST',productName:'Coya',documentLabel:'Invoice',documentNumber:'TEST-1',documentUrl:'https://example.test/private'});
  assert.match(message.html, /lang="de"/);
  assert.match(message.html, /Jürgen &lt;Müller&gt;/);
  assert.doesNotMatch(message.html, /Invoice|Download PDF/);
  const pdf = new TextDecoder().decode(buildBookingDocumentPdf({document_type:'invoice',document_number:'TEST-1',status:'issued',issued_at:'2026-10-05T08:00:00Z',currency:'eur',total_cents:3000,tax_cents:521,tax_rate_bps:2100,booking_snapshot:{locale:'de',timezone:'Europe/Madrid'},customer_snapshot:{name:'Jürgen Müller'},company_snapshot:{},payment_snapshot:{}},{locale:'en'}));
  assert.match(pdf, /Rechnung/);
  assert.match(pdf, /EUR 30,00/);
  assert.match(pdf, /10:00/);
  assert.ok(pdf.includes('J\\374rgen M\\374ller'));
  assert.match(pdf, /\/WinAnsiEncoding/);
  assert.match(pdf, /1 1 1 rg/);
  assert.match(pdf, /0.12 0.16 0.22 rg/);
});
test("German invoice preserves saved product copy and translates missing issuer details", () => {
  const pdf = new TextDecoder().decode(buildBookingDocumentPdf({document_type:'invoice',document_number:'TEST-DE',status:'draft',currency:'eur',total_cents:7500,tax_cents:1302,tax_rate_bps:2100,booking_snapshot:{locale:'de',product_name:'Deutscher Mietartikel'},customer_snapshot:{},company_snapshot:{},payment_snapshot:{}},{locale:'en',product:{name:'English catalogue name'}}));
  assert.match(pdf, /Deutscher Mietartikel/);
  assert.doesNotMatch(pdf, /English catalogue name|Tax ID pending|Valencia, Spain\)/);
  assert.match(pdf, /Steuernummer folgt/);
  assert.match(pdf, /Valencia,\s+Spanien/);
});

test("all transactional dictionaries cover every existing key", () => {
  for (const dictionary of [
    labels,
    policyMessages,
    transactionCopy,
    reviewCopy,
  ])
    for (const locale of ["en", "es", "de"]) {
      assert.deepEqual(
        Object.keys(dictionary[locale]).sort(),
        Object.keys(dictionary.en).sort(),
      );
      assert.ok(
        Object.values(dictionary[locale]).every(
          (value) => typeof value === "string" && value.trim(),
        ),
      );
    }
});
test("German confirmation and every lifecycle message are escaped and retain amounts", () => {
  for (const status of [
    "confirmed",
    "paid",
    "delivering",
    "active",
    "returning",
    "completed",
    "cancelled",
    "refunded",
    "rejected_refunded",
    "partially_refunded",
  ]) {
    const message = renderBookingMessage(
      { ...booking, refundAmountCents: 1000 },
      status,
    );
    assert.match(message.html, /lang="de"/);
    assert.match(message.html, /30,00/);
    assert.match(message.html, /&lt;script&gt;/);
    assert.doesNotMatch(
      message.html,
      /<script>|DO NOT EXPOSE|Download invoice|Booking confirmed|Your booking/,
    );
  }
  const pending = renderBookingMessage({
    ...booking,
    pendingTeamConfirmation: true,
  });
  assert.match(pending.subject, /Zahlung erhalten/);
  assert.doesNotMatch(pending.html, /Buchung bestätigt/);
  assert.match(pending.html, /vollständig/);
  assert.equal(renderBookingMessage(booking, "unsupported"), null);
  assert.match(
    renderBookingMessage({ ...booking, locale: "es" }).html,
    /Reserva confirmada/,
  );
});
test("preview cannot activate on production, external databases, real payment keys or email sending", () => {
  const keys = [
    "NODE_ENV",
    "LOCALIZATION_PREVIEW",
    "NEXT_PUBLIC_SUPABASE_URL",
    "STRIPE_SECRET_KEY",
    "RESEND_API_KEY",
  ];
  const old = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    Object.assign(process.env, {
      NODE_ENV: "test",
      LOCALIZATION_PREVIEW: "true",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      STRIPE_SECRET_KEY: "sk_test_fake",
      RESEND_API_KEY: "",
    });
    assert.equal(privateGermanPreviewEnabled(), true);
    for (const [key, value] of [
      ["NODE_ENV", "production"],
      ["NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co"],
      ["STRIPE_SECRET_KEY", "sk_live_fake"],
      ["RESEND_API_KEY", "some-key"],
      ["LOCALIZATION_PREVIEW", "false"],
    ]) {
      const previous = process.env[key];
      process.env[key] = value;
      assert.equal(privateGermanPreviewEnabled(), false);
      process.env[key] = previous;
    }
  } finally {
    for (const key of keys) {
      if (old[key] === undefined) delete process.env[key];
      else process.env[key] = old[key];
    }
  }
});
