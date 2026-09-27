import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCouponCode, calculateCouponDiscount, defaultCouponExpiry, validateCouponExpiry } from "../src/lib/coupon-rules.ts";
import { isCheckoutPaymentSettled } from "../src/lib/checkout-payment-status.ts";

const coupon = { id: "coupon", code: "WELCOME", discount_type: "percentage", value: 1250, scope: "all", product_ids: [], category_ids: [], is_active: true, expires_on: "9999-12-31" };

test("expiry defaults to one calendar year in Valencia, clamping leap day", () => {
  assert.equal(defaultCouponExpiry(new Date("2026-09-27T12:00:00Z")), "2027-09-27");
  assert.equal(defaultCouponExpiry(new Date("2024-02-29T12:00:00Z")), "2025-02-28");
  assert.equal(defaultCouponExpiry(new Date("2026-12-31T23:30:00Z")), "2028-01-01");
});
test("expiry dates must be real dates today or later", () => {
  const now = new Date("2026-09-27T12:00:00Z");
  assert.equal(validateCouponExpiry("2026-09-27", now), "2026-09-27");
  for (const value of [null, "", "2026-09-26", "2027-02-29", "2026-09-27T12:00:00Z", "invalid"]) assert.throws(() => validateCouponExpiry(value, now));
});
test("coupons expire at Valencia midnight after the selected date", () => {
  const dated = { ...coupon, expires_on: "2026-09-27" };
  assert.equal(calculateCouponDiscount(dated, "p1", [], 1000, new Date("2026-09-27T21:59:59Z")), 125);
  assert.throws(() => calculateCouponDiscount(dated, "p1", [], 1000, new Date("2026-09-27T22:00:00Z")), /expired/);
  for (const expires_on of [undefined, "invalid", "2026-02-30"]) assert.throws(() => calculateCouponDiscount({ ...coupon, expires_on }, "p1", [], 1000), /expired/);
});

test("codes ignore whitespace and case and reject malformed values", () => {
  assert.equal(normalizeCouponCode(" welcome-10 "), "WELCOME-10");
  for (const value of [null, {}, 123, "ab", "a b c", "x".repeat(41)]) assert.throws(() => normalizeCouponCode(value));
});
test("percentage discounts round to cents on the already quantity-discounted subtotal", () => {
  assert.equal(calculateCouponDiscount(coupon, "p1", [], 999), 125);
  assert.equal(calculateCouponDiscount({ ...coupon, value: 10000 }, "p1", [], 999), 999);
});
test("fixed discount is applied once across all units and capped at rental subtotal", () => {
  const fixed = { ...coupon, discount_type: "fixed", value: 1500 };
  assert.equal(calculateCouponDiscount(fixed, "p1", [], 3000), 1500);
  assert.equal(calculateCouponDiscount(fixed, "p1", [], 700), 700);
});
test("product restrictions cannot be bypassed", () => {
  const scoped = { ...coupon, scope: "products", product_ids: ["p1", "p2"] };
  assert.equal(calculateCouponDiscount(scoped, "p2", [], 1000), 125);
  assert.throws(() => calculateCouponDiscount(scoped, "p3", [], 1000), /does not apply/);
});
test("category restrictions match any product membership", () => {
  const scoped = { ...coupon, scope: "categories", category_ids: ["mobility"] };
  assert.equal(calculateCouponDiscount(scoped, "p1", ["travel", "mobility"], 1000), 125);
  assert.throws(() => calculateCouponDiscount(scoped, "p1", ["travel"], 1000), /does not apply/);
});
test("disabled and invalid discounts fail closed", () => {
  assert.throws(() => calculateCouponDiscount({ ...coupon, is_active: false }, "p1", [], 1000), /no longer active/);
  for (const value of [-1, 0, 10001, NaN, 0.5]) assert.throws(() => calculateCouponDiscount({ ...coupon, value }, "p1", [], 1000));
});
test("a free checkout must be complete and exactly zero before fulfillment", () => {
  assert.equal(isCheckoutPaymentSettled({ payment_status: "paid", amount_total: 1000, status: "complete" }), true);
  assert.equal(isCheckoutPaymentSettled({ payment_status: "no_payment_required", amount_total: 0, status: "complete" }), true);
  for (const session of [
    { payment_status: "no_payment_required", amount_total: 0, status: "open" },
    { payment_status: "no_payment_required", amount_total: 1000, status: "complete" },
    { payment_status: "no_payment_required", amount_total: null, status: "complete" },
    { payment_status: "unpaid", amount_total: 1000, status: "complete" },
  ]) assert.equal(isCheckoutPaymentSettled(session), false);
});
