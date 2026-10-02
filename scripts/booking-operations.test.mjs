import assert from "node:assert/strict";
import test from "node:test";
import { buildDailyOperationsManifest, getBookingProductName } from "../src/lib/booking-operations.ts";
import { sendDailyManifestTelegramNotification } from "../src/lib/telegram.ts";

const carSeat = {
  booking_ref: "RA-TEST-CARSEAT", status: "active", fulfillment_mode: "customer_pickup",
  rental_start_at: "2026-09-26T16:00:00Z", rental_end_at: "2026-09-28T16:00:00Z",
  start_date: "2026-09-26", end_date: "2026-09-28",
  delivery_address: null, collection_address: null, pickup_location_id: "depot",
  delivery_zone_id: null, collection_zone_id: null,
  product: { name: "Custom Quote" }, pricing_snapshot: { displayName: "Peg Perego Car Seat" },
};
const locations = new Map([["depot", "Burjassot"]]);

test("custom quote pickup and return appear on their respective days with the agreed item name", () => {
  const pickup = buildDailyOperationsManifest([carSeat], "2026-09-26", locations);
  assert.equal(pickup.customerPickups[0].productName, "Peg Perego Car Seat");
  assert.equal(pickup.customerReturns.length, 0);
  const returned = buildDailyOperationsManifest([carSeat], "2026-09-28", locations);
  assert.deepEqual(returned.customerReturns, [{ bookingRef: carSeat.booking_ref, productName: "Peg Perego Car Seat", area: "Burjassot" }]);
  assert.equal(returned.customerPickups.length, 0);
  assert.equal(returned.returnCollections.length, 0);
});

test("delivery-only returns are customer returns; collection bookings stay courier collections", () => {
  const booking = { ...carSeat, delivery_address: "Valencia", fulfillment_mode: "delivery_only" };
  assert.equal(buildDailyOperationsManifest([booking], "2026-09-28").customerReturns.length, 1);
  const collection = buildDailyOperationsManifest([{ ...booking, fulfillment_mode: "delivery_and_collection" }], "2026-09-28");
  assert.equal(collection.customerReturns.length, 0);
  assert.equal(collection.returnCollections.length, 1);
});

test("Madrid midnight boundaries and legacy date-only bookings are included", () => {
  const midnight = { ...carSeat, rental_start_at: "2026-09-25T22:30:00Z" };
  assert.equal(buildDailyOperationsManifest([midnight], "2026-09-26").customerPickups.length, 1);
  assert.equal(buildDailyOperationsManifest([{ ...carSeat, rental_end_at: null }], "2026-09-28").customerReturns.length, 1);
});

test("cancelled, refunded, completed, and unpaid bookings do not enter the manifest", () => {
  for (const status of ["cancelled", "refunded", "completed", "pending"]) {
    assert.equal(buildDailyOperationsManifest([{ ...carSeat, status }], "2026-09-28").customerReturns.length, 0);
  }
});

test("older quotes and regular bookings retain their catalogue name", () => {
  for (const pricing_snapshot of [null, {}, { displayName: " " }, { displayName: 123 }]) {
    assert.equal(getBookingProductName({ pricing_snapshot, product: [{ name: "Monitor" }] }), "Monitor");
  }
  assert.equal(getBookingProductName({}), "Rental equipment");
});

test("Telegram payload includes escaped custom item names and customer returns without network sends", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_NOTIFY_CHAT_ID = "test-chat";
  delete process.env.TELEGRAM_NOTIFY_CHAT_IDS;
  let payload;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    payload = JSON.parse(options.body);
    return { ok: true };
  });
  const manifest = buildDailyOperationsManifest([{ ...carSeat, pricing_snapshot: { displayName: "Seat <custom> & base" } }], "2026-09-28", locations);
  const result = await sendDailyManifestTelegramNotification(manifest);
  assert.equal(result.ok, true);
  assert.match(payload.text, /Customer returns:<\/b> 1/);
  assert.match(payload.text, /Seat &lt;custom&gt; &amp; base/);
  assert.match(payload.text, /Burjassot/);
});
