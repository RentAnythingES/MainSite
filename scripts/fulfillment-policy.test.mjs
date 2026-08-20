import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_DELIVERY_OPERATING_HOURS,
  evaluateFulfillmentPolicy,
  valenciaWallClockToDate,
} from "../src/lib/fulfillment-policy.ts";

const baseConfig = {
  futureDateLeadHours: 12,
  automaticExpressEnabled: true,
  expressMinLeadHours: 6,
  operatingHours: DEFAULT_DELIVERY_OPERATING_HOURS,
  baseFeeCents: 2000,
  expressSurchargeCents: 500,
};

function evaluate(startDate, startTime, now, overrides = {}) {
  return evaluateFulfillmentPolicy({
    request: {
      startDate,
      startTime,
      endDate: "2026-08-23",
      endTime: "18:00",
    },
    config: { ...baseConfig, ...overrides },
    now: new Date(now),
  });
}

test("same-day exact six-hour boundary is express and charges once", () => {
  const result = evaluate("2026-08-20", "16:00", "2026-08-20T08:00:00.000Z");
  assert.equal(result.decision, "express_checkout");
  assert.equal(result.deliveryType, "express");
  assert.deepEqual(result.fees, {
    baseFeeCents: 2000,
    expressSurchargeCents: 500,
    totalFeeCents: 2500,
  });
});

test("same-day one minute below six hours routes to manual confirmation", () => {
  const result = evaluate("2026-08-20", "15:59", "2026-08-20T08:00:00.000Z");
  assert.equal(result.decision, "manual_confirmation");
  assert.equal(result.reason, "same_day_too_soon");
});

test("same-day remains express even with more than twelve hours notice", () => {
  const result = evaluate("2026-08-20", "20:00", "2026-08-20T05:00:00.000Z");
  assert.equal(result.decision, "express_checkout");
});

test("next-day exact twelve-hour boundary is standard", () => {
  const result = evaluate("2026-08-21", "09:00", "2026-08-20T19:00:00.000Z");
  assert.equal(result.decision, "standard_checkout");
  assert.equal(result.fees.expressSurchargeCents, 0);
});

test("crossing midnight does not waive the twelve-hour threshold", () => {
  const result = evaluate("2026-08-21", "09:00", "2026-08-20T19:01:00.000Z");
  assert.equal(result.decision, "manual_confirmation");
  assert.equal(result.reason, "future_date_too_soon");
});

test("operating window boundaries are inclusive", () => {
  assert.equal(
    evaluate("2026-08-21", "09:00", "2026-08-20T08:00:00.000Z").decision,
    "standard_checkout",
  );
  assert.equal(
    evaluate("2026-08-21", "20:00", "2026-08-20T08:00:00.000Z").decision,
    "standard_checkout",
  );
});

test("out-of-hours and closed-day requests route to manual confirmation", () => {
  const outside = evaluate("2026-08-21", "20:01", "2026-08-20T08:00:00.000Z");
  assert.equal(outside.reason, "outside_operating_hours");

  const closedHours = { ...DEFAULT_DELIVERY_OPERATING_HOURS, friday: null };
  const closed = evaluate("2026-08-21", "12:00", "2026-08-20T08:00:00.000Z", {
    operatingHours: closedHours,
  });
  assert.equal(closed.reason, "closed_day");
});

test("disabled express and zero surcharge fail closed", () => {
  const disabled = evaluate("2026-08-20", "16:00", "2026-08-20T08:00:00.000Z", {
    automaticExpressEnabled: false,
  });
  assert.equal(disabled.reason, "express_disabled");

  const unpriced = evaluate("2026-08-20", "16:00", "2026-08-20T08:00:00.000Z", {
    expressSurchargeCents: 0,
  });
  assert.equal(unpriced.reason, "policy_unconfigured");
});

test("invalid and ambiguous Madrid wall clocks are rejected", () => {
  assert.equal(valenciaWallClockToDate("2026-03-29", "02:30"), null);
  assert.equal(valenciaWallClockToDate("2026-10-25", "02:30"), null);
});

test("Valencia wall clock is stable regardless of caller timezone", () => {
  const result = evaluate("2026-08-21", "16:00", "2026-08-20T08:00:00.000Z");
  assert.equal(result.requested?.startAt, "2026-08-21T14:00:00.000Z");
  assert.equal(result.requested?.startTime, "16:00");
});

test("re-evaluation routes an expired eligible request to manual", () => {
  const eligible = evaluate("2026-08-20", "16:00", "2026-08-20T08:00:00.000Z");
  const stale = evaluate("2026-08-20", "16:00", "2026-08-20T08:01:00.000Z");
  assert.equal(eligible.decision, "express_checkout");
  assert.equal(stale.reason, "same_day_too_soon");
});
