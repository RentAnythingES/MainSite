import assert from "node:assert/strict";
import test from "node:test";
import {
  CUSTOM_QUOTE_START_BUFFER_MS,
  resolveCustomQuoteExpiry,
} from "../src/lib/custom-booking-quotes.ts";

const now = new Date("2026-08-24T08:00:00.000Z");

test("keeps a valid requested expiry before the rental starts", () => {
  const expiry = resolveCustomQuoteExpiry(
    new Date("2026-08-26T08:00:00.000Z"),
    new Date("2026-08-25T08:00:00.000Z"),
    now,
  );
  assert.equal(expiry.toISOString(), "2026-08-25T08:00:00.000Z");
});

test("clamps a stale later expiry for a short-notice booking", () => {
  const start = new Date("2026-08-24T10:00:00.000Z");
  const expiry = resolveCustomQuoteExpiry(
    start,
    new Date("2026-08-25T08:00:00.000Z"),
    now,
  );
  assert.equal(expiry.getTime(), start.getTime() - CUSTOM_QUOTE_START_BUFFER_MS);
});

test("replaces an already-past expiry instead of blocking manual approval", () => {
  const start = new Date("2026-08-24T08:10:00.000Z");
  const expiry = resolveCustomQuoteExpiry(
    start,
    new Date("2026-08-24T07:00:00.000Z"),
    now,
  );
  assert.equal(expiry.toISOString(), "2026-08-24T08:09:00.000Z");
});

test("rejects only when there is no usable payment-link window", () => {
  assert.throws(
    () => resolveCustomQuoteExpiry(
      new Date(now.getTime() + CUSTOM_QUOTE_START_BUFFER_MS),
      null,
      now,
    ),
    /at least 2 minutes/i,
  );
});
