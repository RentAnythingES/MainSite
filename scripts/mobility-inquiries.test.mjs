import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanInquiryDate,
  cleanInquiryText,
  isInquiryLossReason,
  isInquirySource,
  isInquiryStatus,
} from "../src/lib/mobility-inquiries.ts";

test("normalizes and limits free-text inquiry fields", () => {
  assert.equal(cleanInquiryText("  electric   wheelchair  ", 200), "electric wheelchair");
  assert.equal(cleanInquiryText("abcdef", 3), "abc");
  assert.equal(cleanInquiryText("   ", 200), null);
});

test("accepts ISO dates and rejects non-date strings", () => {
  assert.equal(cleanInquiryDate("2026-09-08"), "2026-09-08");
  assert.equal(cleanInquiryDate("08/09/2026"), null);
  assert.equal(cleanInquiryDate("2026-02-31"), null);
  assert.equal(cleanInquiryDate(""), null);
});

test("recognizes only governed statuses and sources", () => {
  assert.equal(isInquiryStatus("won"), true);
  assert.equal(isInquiryStatus("deleted"), false);
  assert.equal(isInquirySource("whatsapp"), true);
  assert.equal(isInquirySource("social"), false);
});

test("recognizes capacity loss for inventory planning", () => {
  assert.equal(isInquiryLossReason("no_stock"), true);
  assert.equal(isInquiryLossReason("unknown"), false);
});
