/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { Client } = require("pg");
process.loadEnvFile(".env.local");

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
  await client.connect();
  try {
    await client.query("begin");
    const security = await client.query("select relrowsecurity as rls, has_table_privilege('anon', 'public.coupons', 'select') as anon_read, has_table_privilege('authenticated', 'public.coupons', 'update') as customer_write from pg_class where oid = 'public.coupons'::regclass");
    assert.deepEqual(security.rows[0], { rls: true, anon_read: false, customer_write: false });
    const code = `VERIFY-${randomUUID().slice(0, 8).toUpperCase()}`;
    const inserted = await client.query("insert into public.coupons (code, discount_type, value, scope) values ($1, 'percentage', 1250, 'all') returning *", [code]);
    assert.equal(inserted.rows[0].value, 1250);
    assert.equal(inserted.rows[0].is_active, true);
    const expiry = await client.query("select expires_on = ((created_at at time zone 'Europe/Madrid')::date + interval '1 year')::date as default_correct from public.coupons where code = $1", [code]);
    assert.equal(expiry.rows[0].default_correct, true);
    const checks = [
      ["update public.coupons set expires_on = null where code = $1", [code], "23502"],
      ["update public.coupons set expires_on = 'infinity' where code = $1", [code], "23514"],
      ["insert into public.coupons (code,discount_type,value,scope) values ($1,'fixed',500,'all')", [code], "23505"],
      ["update public.coupons set value = 10001 where code = $1", [code], "23514"],
      ["update public.coupons set scope = 'products' where code = $1", [code], "23514"],
      ["update public.coupons set code = 'lower case' where code = $1", [code], "23514"],
    ];
    for (const [sql, params, expectedCode] of checks) {
      await client.query("savepoint coupon_check");
      await assert.rejects(client.query(sql, params), (error) => error.code === expectedCode);
      await client.query("rollback to savepoint coupon_check");
    }
    await client.query("update public.coupons set discount_type = 'fixed', value = 500, scope = 'products', product_ids = array[$1::uuid] where code = $2", [randomUUID(), code]);
    await client.query("update public.coupons set scope = 'categories', product_ids = '{}', category_ids = array[$1::uuid], is_active = false where code = $2", [randomUUID(), code]);
    const edited = await client.query("update public.coupons set expires_on = '2030-05-01' where code = $1 returning expires_on::text", [code]);
    assert.equal(edited.rows[0].expires_on, "2030-05-01");
    console.log(JSON.stringify({ couponSecurity: "passed", creationAndScopes: "passed", invalidRulesRejected: "passed", writesPersisted: false }));
  } finally {
    await client.query("rollback");
    await client.end();
  }
}
main().catch((error) => { console.error("Coupon verification failed:", error.message); process.exitCode = 1; });
