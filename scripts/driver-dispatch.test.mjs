import assert from "node:assert/strict";
import test from "node:test";
import { driverDispatchStartsAt, getDriverDispatchActions, isDriverWorkingTime } from "../src/lib/driver-dispatch-policy.ts";
import { sendDeliveryGroupRequest, sendUnclaimedJobAdminAlert } from "../src/lib/telegram.ts";

const created = "2026-09-29T12:00:00Z";
const open = { status: "open", first_notified_at: null, last_notified_at: null, admin_alerted_at: null };
const actions = (state, due, now) => getDriverDispatchActions(state, created, due, new Date(now));

test("initial requests are immediate up to and including seven days away", () => {
  for (const due of ["2026-09-30T08:00:00Z", "2026-10-06T12:00:00Z"]) {
    assert.equal(driverDispatchStartsAt(created, due), Date.parse(created));
    assert.equal(actions(open, due, created).notifyDrivers, true);
  }
});
test("jobs originally more than seven days away stay deferred until six days before, including retry at day seven", () => {
  const due = "2026-10-10T12:00:00Z";
  assert.equal(driverDispatchStartsAt(created, due), Date.parse("2026-10-04T12:00:00Z"));
  assert.equal(actions(open, due, "2026-10-03T12:00:00Z").notifyDrivers, false);
  assert.equal(actions(open, due, "2026-10-04T11:59:59Z").notifyDrivers, false);
  assert.equal(actions(open, due, "2026-10-04T12:00:00Z").notifyDrivers, true);
});
test("reminders require four elapsed hours and open status", () => {
  const state = { ...open, first_notified_at: created, last_notified_at: created };
  assert.equal(actions(state, "2026-09-30T08:00:00Z", "2026-09-29T15:59:59Z").notifyDrivers, false);
  assert.equal(actions(state, "2026-09-30T08:00:00Z", "2026-09-29T16:00:00Z").notifyDrivers, true);
  for (const status of ["claimed", "cancelled"]) {
    assert.deepEqual(actions({ ...state, status }, "2026-09-30T08:00:00Z", "2026-09-30T07:00:00Z"), { notifyDrivers: false, alertAdmin: false });
  }
});
test("working hours are 08:00 inclusive to 20:00 exclusive, weekends and DST included", () => {
  for (const [time, expected] of [
    ["2026-09-29T05:59:59Z", false], ["2026-09-29T06:00:00Z", true],
    ["2026-09-29T18:00:00Z", false], ["2026-10-25T06:59:59Z", false],
    ["2026-10-25T07:00:00Z", true], ["2026-10-25T19:00:00Z", false],
  ]) assert.equal(isDriverWorkingTime(new Date(time)), expected, time);
  const state = { ...open, first_notified_at: created, last_notified_at: created };
  assert.equal(actions(state, "2026-09-30T08:00:00Z", "2026-09-29T18:00:00Z").notifyDrivers, false);
  assert.equal(actions(state, "2026-09-30T08:00:00Z", "2026-09-30T06:00:00Z").notifyDrivers, true);
});
test("initial sends are not suppressed outside working hours", () => {
  assert.equal(actions(open, "2026-09-30T08:00:00Z", "2026-09-29T22:00:00Z").notifyDrivers, true);
});
test("urgent alert fires at two hours, bypasses quiet hours, and is sent only once", () => {
  const due = "2026-09-30T05:00:00Z";
  assert.equal(actions(open, due, "2026-09-30T02:59:59Z").alertAdmin, false);
  assert.equal(actions(open, due, "2026-09-30T03:00:00Z").alertAdmin, true);
  assert.equal(actions({ ...open, admin_alerted_at: "2026-09-30T03:00:00Z" }, due, "2026-09-30T04:00:00Z").alertAdmin, false);
  assert.equal(actions(open, due, "2026-09-30T06:00:00Z").alertAdmin, true);
});
test("unclaimed overdue jobs still receive working-hour reminders", () => {
  const state = { ...open, first_notified_at: created, last_notified_at: created };
  assert.equal(actions(state, "2026-09-30T08:00:00Z", "2026-09-30T10:00:00Z").notifyDrivers, true);
});
test("invalid dates do not send notifications", () => {
  assert.deepEqual(actions(open, "invalid", created), { notifyDrivers: false, alertAdmin: false });
});
test("reminders reuse the claim ID and urgent alerts use the admin chat, with no live sends", async (t) => {
  const before = { ...process.env }; t.after(() => { process.env = before; });
  process.env.TELEGRAM_BOT_TOKEN = "test"; process.env.TELEGRAM_DELIVERY_GROUP_ID = "drivers";
  process.env.TELEGRAM_NOTIFY_CHAT_ID = "admin"; delete process.env.TELEGRAM_NOTIFY_CHAT_IDS;
  const messages = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    messages.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ ok: true, result: { message_id: 1 } }) };
  });
  const job = { requestId: "same-job", eventType: "pickup", windowLabel: "Tomorrow", postalCode: "46001" };
  await sendDeliveryGroupRequest(job); await sendDeliveryGroupRequest({ ...job, reminder: true });
  assert.equal(messages[0].reply_markup.inline_keyboard[0][0].callback_data, messages[1].reply_markup.inline_keyboard[0][0].callback_data);
  assert.match(messages[1].text, /Still open/); assert.equal(messages[1].chat_id, "drivers");
  await sendUnclaimedJobAdminAlert({ bookingId: "id", bookingRef: "RA-TEST", eventType: "pickup", windowLabel: "Tomorrow" });
  assert.equal(messages[2].chat_id, "admin"); assert.match(messages[2].text, /URGENT/);
});
