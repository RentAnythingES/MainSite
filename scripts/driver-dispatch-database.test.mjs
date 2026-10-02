import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

test("Postgres dispatch migration: backfill, exclusive lease, expiry, stale claims, cancellation and permissions", async () => {
  const db = new PGlite();
  const booking = "11111111-1111-4111-8111-111111111111";
  const firstToken = "22222222-2222-4222-8222-222222222222";
  const secondToken = "33333333-3333-4333-8333-333333333333";
  const read = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8");
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create function uuid_generate_v4() returns uuid language sql as 'select gen_random_uuid()';
      create table bookings(id uuid primary key, status text, fulfillment_mode text, rental_start_at timestamptz, rental_end_at timestamptz);
      insert into bookings values ('${booking}', 'active', 'delivery_and_collection', '2026-09-30T08:00:00Z', '2026-10-06T16:00:00Z');`);
    await db.exec(read("20260912_delivery_request_dispatch.sql"));
    const { rows: [request] } = await db.query(`insert into delivery_requests(booking_id,event_type,event_date,group_message_id)
      values ('${booking}','delivery','2026-09-30',123) returning id`);
    await db.exec(read("20260929_advance_driver_dispatch.sql"));
    const { rows: [backfilled] } = await db.query(`select first_notified_at = created_at as backfilled from delivery_requests where id='${request.id}'`);
    assert.equal(backfilled.backfilled, true);
    const acquire = token => db.query(`select * from acquire_driver_dispatch('${request.id}','${token}')`);
    assert.equal((await acquire(firstToken)).rows.length, 1);
    assert.equal((await acquire(secondToken)).rows.length, 0, "overlapping worker must not own the same send");
    await db.exec(`update delivery_requests set dispatch_lock_until = now() - interval '1 second' where id='${request.id}'`);
    assert.equal((await acquire(secondToken)).rows.length, 1, "crashed worker lease must expire");
    await db.exec(`update delivery_requests set dispatch_lock_until=null, dispatch_lock_token=null, status='claimed' where id='${request.id}'`);
    assert.equal((await acquire(firstToken)).rows.length, 0, "claimed job must stop reminders");
    await db.exec(`update bookings set rental_start_at='2026-10-01T08:00:00Z' where id='${booking}'`);
    assert.equal((await db.query(`select status from delivery_requests where id='${request.id}'`)).rows[0].status, "cancelled");
    await db.exec(`update delivery_requests set status='open' where id='${request.id}'`);
    assert.equal((await acquire(firstToken)).rows.length, 0, "old date must not be broadcast");
    const staleClaim = await db.query(`update delivery_requests set status='claimed' where id='${request.id}' returning id`);
    assert.equal(staleClaim.rows.length, 0, "old Telegram button must not claim a rescheduled job");
    const { rows: [pickup] } = await db.query(`insert into delivery_requests(booking_id,event_type,event_date)
      values ('${booking}','pickup','2026-10-06') returning id`);
    await db.exec(`update bookings set status='refunded' where id='${booking}'`);
    assert.equal((await db.query(`select status from delivery_requests where id='${pickup.id}'`)).rows[0].status, "cancelled");
    const { rows: [permissions] } = await db.query(`select
      has_function_privilege('anon','acquire_driver_dispatch(uuid,uuid)','EXECUTE') as anon,
      has_function_privilege('authenticated','acquire_driver_dispatch(uuid,uuid)','EXECUTE') as authenticated,
      has_function_privilege('service_role','acquire_driver_dispatch(uuid,uuid)','EXECUTE') as service`);
    assert.deepEqual(permissions, { anon: false, authenticated: false, service: true });
  } finally { await db.close(); }
});
