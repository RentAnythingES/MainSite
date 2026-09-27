import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

// Ephemeral Postgres only: no URL, env files, sockets or external transports.
// This is a focused schema fixture, not a replay of the complete production ledger.
const read = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8");
const admin = "11111111-1111-4111-8111-111111111111";
const config = { slug: "hamburg", name: "Hamburg", country_code: "DE", timezone: "Europe/Berlin", currency: "eur", default_locale: "en", supported_locales: ["en"] };

test("Postgres: private setup, audit atomicity, edit conflicts and public isolation", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key, raw_app_meta_data jsonb);
      insert into auth.users values('${admin}', '{"role":"admin"}');
      create function uuid_generate_v4() returns uuid language sql as 'select gen_random_uuid()';`);
    const foundation = read("20260731_multi_market_foundation.sql");
    const marketDdl = foundation.match(/create table if not exists public\.markets \([\s\S]*?\n\);/i)?.[0];
    assert.ok(marketDdl);
    await db.exec(marketDdl);
    await db.exec(`create unique index markets_single_default_idx on public.markets(is_default) where is_default;
      create function public.update_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end$$;
      create trigger markets_updated_at before update on public.markets for each row execute function public.update_updated_at();
      alter table public.markets enable row level security;
      create policy "Public read public markets" on public.markets for select using(is_active and is_public);
      grant usage on schema public to anon, authenticated, service_role;
      grant select on public.markets to anon, authenticated;
      insert into public.markets(slug,name,country_code,timezone,currency,supported_locales,is_default,is_active,is_public,is_booking_enabled,is_indexable)
      values('valencia','Valencia','ES','Europe/Madrid','eur',array['en','es'],true,true,true,true,true);`);
    const oldBooking = read("20260707_booking_system_v2.sql");
    for (const table of ["pickup_locations", "service_zones"]) {
      const ddl = oldBooking.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\([\\s\\S]*?\\n\\);`, "i"))?.[0];
      assert.ok(ddl); await db.exec(ddl);
      await db.exec(`alter table ${table} add column market_id uuid references markets(id), add column customer_instructions text, add column internal_notes text, add column lead_time_hours int default 0;
        alter table ${table} enable row level security;
        create policy "Legacy active read" on ${table} for select using(is_active);
        grant select on ${table} to anon, authenticated;`);
    }
    await db.exec(`alter table pickup_locations add column handoff_contact text;
      alter table service_zones add column same_day_cutoff time, add column delivery_window text, add column collection_window text, add column automatic_checkout_enabled boolean default true;`);
    // The runner's outer transaction must own both schema changes and its ledger.
    await db.exec("begin");
    await db.exec(read("20260927_private_market_setup.sql"));
    await db.exec("rollback");
    assert.equal((await db.query("select to_regclass('public.market_audit_events') as audit")).rows[0].audit, null);
    await db.exec(read("20260927_private_market_setup.sql"));
    const save = async (value, id = null, revision = null, actor = admin) => (await db.query(
      "select * from public.save_private_market($1,$2::jsonb,$3,$4)", [actor, JSON.stringify(value), id, revision],
    )).rows[0];
    const created = await save(config);
    for (const gate of ["is_default", "is_active", "is_public", "is_booking_enabled", "is_indexable"]) assert.equal(created[gate], false);
    assert.equal((await db.query("select * from market_audit_events")).rows.length, 1);
    await assert.rejects(save(config), { code: "23505" });
    await assert.rejects(save({ ...config, slug: "berlin" }, null, null, "22222222-2222-4222-8222-222222222222"), { code: "42501" });
    for (const invalid of [{ slug: "de" }, { slug: "admin" }, { timezone: "Europe/Fake" }, { is_public: true }, { default_locale: "es" }, { supported_locales: [null] }]) await assert.rejects(save({ ...config, ...invalid }), { code: "22023" });
    const revision = (await db.query("select updated_at::text as revision from markets where id=$1", [created.id])).rows[0].revision;
    await save({ ...config, name: "Hamburg city" }, created.id, revision);
    await assert.rejects(save(config, created.id, revision), { code: "40001" });
    const audit = (await db.query("select * from market_audit_events order by created_at")).rows;
    assert.equal(audit.length, 2); assert.equal(audit[1].previous_config.name, "Hamburg"); assert.equal(audit[1].next_config.name, "Hamburg city");
    // An audit failure must roll back the city write in the same statement.
    await db.exec("alter table market_audit_events add constraint reject_berlin check(next_config->>'slug' <> 'berlin')");
    await assert.rejects(save({ ...config, slug: "berlin" }), { code: "23514" });
    assert.equal((await db.query("select count(*)::int as n from markets where slug='berlin'")).rows[0].n, 0);
    const valencia = (await db.query("select *, updated_at::text as revision from markets where slug='valencia'")).rows[0];
    await assert.rejects(save({ ...config, slug: "valencia" }, valencia.id, valencia.revision), { code: "22023" });
    assert.equal((await db.query("select count(*)::int as n from markets where is_default")).rows[0].n, 1);
    for (const city of [created, valencia]) {
      await db.query("insert into pickup_locations(slug,name,address,market_id,internal_notes,handoff_contact) values($1,$1,'test address',$2,'private note','private contact')", [city.slug, city.id]);
      await db.query("insert into service_zones(slug,name,market_id,internal_notes) values($1,$1,$2,'private note')", [city.slug, city.id]);
    }
    await db.query("insert into service_zones(slug,name,market_id,automatic_checkout_enabled) values('manual','manual',$1,false)", [valencia.id]);
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      for (const table of ["pickup_locations", "service_zones"]) {
        assert.deepEqual((await db.query(`select slug from ${table}`)).rows.map(r => r.slug), ["valencia"]);
        await assert.rejects(db.query(`select internal_notes from ${table}`), { code: "42501" });
      }
      await assert.rejects(db.query("select handoff_contact from pickup_locations"), { code: "42501" });
      await assert.rejects(db.query("select * from market_audit_events"), { code: "42501" });
      await assert.rejects(save({ ...config, slug: "berlin" }), { code: "42501" });
      await db.exec("reset role");
    }
  } finally { await db.close(); }
});
