import assert from "node:assert/strict";
import test from "node:test";

import { getRentalWindow } from "../src/lib/rental-dates.ts";

test("returns null while browser-local dates are not initialized", () => {
  assert.equal(getRentalWindow("", ""), null);
});

test("returns null for invalid or reversed date windows", () => {
  assert.equal(getRentalWindow("invalid", "2026-09-10"), null);
  assert.equal(getRentalWindow("2026-09-10", "2026-09-09"), null);
  assert.equal(getRentalWindow("2026-09-10", "2026-09-10"), null);
});

test("calculates a whole-day rental window", () => {
  assert.equal(getRentalWindow("2026-09-08", "2026-09-11")?.days, 3);
});

test("handles daylight-saving transitions without producing NaN", () => {
  const rentalWindow = getRentalWindow("2026-10-24", "2026-10-27");
  assert.ok(rentalWindow);
  assert.ok(Number.isFinite(rentalWindow.days));
  assert.equal(rentalWindow.days, 3);
});
