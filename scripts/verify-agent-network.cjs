/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { Client } = require("pg");
process.loadEnvFile(".env.local");
async function main() {
  const db = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
  await db.connect();
  const checks = [];
  try {
    await db.query("begin");
    await db.query("set local statement_timeout='10s'");
    if (process.argv.includes("--preview")) await db.query(readFileSync("supabase/migrations/20260928_agent_network.sql", "utf8"));
    if (process.argv.includes("--workspace-preview")) await db.query(readFileSync("supabase/migrations/20260928_agent_workspace_optimization.sql", "utf8"));
    const tables = ["agent_applications", "rental_agents", "agent_sessions", "agent_territories", "agent_drivers", "agent_order_assignments", "agent_order_events", "agent_messages", "agent_audit_events", "agent_unavailability"];
    for (const table of tables) {
      const result = await db.query("select relrowsecurity as rls,has_table_privilege('anon',oid,'select') as anon,has_table_privilege('authenticated',oid,'select') as authenticated from pg_class where oid=$1::regclass", [`public.${table}`]);
      assert.deepEqual(result.rows[0], { rls: true, anon: false, authenticated: false });
    }
    const rpc = await db.query("select proname,has_function_privilege('authenticated',oid,'execute') as allowed from pg_proc where pronamespace='public'::regnamespace and proname in ('agent_order_action','assign_agent_order','reply_agent_message','set_agent_territories','agent_availability_action','mark_agent_messages_read')");
    assert.equal(rpc.rows.length, 6); assert.ok(rpc.rows.every(r => !r.allowed)); checks.push("Private tables and RPCs deny public/authenticated access");
    const policies = await db.query("select tablename,qual,with_check from pg_policies where schemaname='public' and tablename in ('bookings','booking_drafts','rental_agents','agent_messages','invoice_settings','invoices')");
    assert.ok(policies.rows.every(p => !/\btrue\b/.test(`${p.qual} ${p.with_check}`)), "Private data has a broad permissive policy");
    const market = (await db.query("select id from public.markets where is_default")).rows[0].id;
    const market2 = randomUUID();
    await db.query("insert into public.markets(id,slug,name,country_code,timezone,currency,market_type) values($1,$2,'Agent test city','ES','Europe/Madrid','eur','city')", [market2, `agent-test-${randomUUID().slice(0,8)}`]);
    const users = [randomUUID(), randomUUID()], agents = [randomUUID(), randomUUID()];
    for (let i=0;i<2;i++) {
      await db.query("insert into auth.users(id,email,raw_app_meta_data) values($1,$2,'{\"role\":\"agent\"}')", [users[i], `agent-${users[i]}@example.invalid`]);
      await db.query("insert into public.rental_agents(id,user_id,email,full_name) values($1,$2,$3,'Verification agent')", [agents[i],users[i],`agent-${users[i]}@example.invalid`]);
      await db.query("select public.set_agent_territories($1,$2::uuid[])", [agents[i],[i ? market2 : market]]);
    }
    const product = (await db.query("select id from public.products where is_active limit 1")).rows[0].id;
    const booking = randomUUID();
    await db.query("insert into public.bookings(id,booking_ref,customer_name,customer_email,product_id,start_date,end_date,rental_days,per_day_cents,subtotal_cents,total_cents,delivery_address,status,requires_confirmation) values($1,$2,'Verification customer','no-mail@example.invalid',$3,'2031-05-01','2031-05-03',2,1000,2000,2000,'Test address','paid',false)",[booking,`AGENT-TEST-${randomUUID().slice(0,8)}`,product]);
    async function reject(sql,params,pattern) {
      await db.query("savepoint rejected_check");
      await assert.rejects(db.query(sql,params), pattern);
      await db.query("rollback to savepoint rejected_check");
    }
    const action = (agent,name,payload={}) => db.query("select public.agent_order_action($1,$2,$3,$4::jsonb)",[agent,booking,name,JSON.stringify(payload)]);
    await reject("select public.agent_availability_action($1,'add',null,'2031-05-01','2031-05-03','Away')",[agents[0]],/onboarding/);
    await db.query("update public.rental_agents set must_change_password=false,profile_completed_at=now() where id=any($1::uuid[])",[agents]);
    await db.query("select public.agent_availability_action($1,'add',null,'2031-05-01','2031-05-03','Away')",[agents[0]]);
    const away=(await db.query("select id from public.agent_unavailability where agent_id=$1",[agents[0]])).rows[0].id;
    await reject("select public.assign_agent_order($1,$2,$3)",[agents[0],booking,users[0]],/unavailable/);
    await reject("select public.agent_availability_action($1,'remove',$2)",[agents[1],away],/not found/);
    await db.query("select public.agent_availability_action($1,'remove',$2)",[agents[0],away]);
    await db.query("update public.rental_agents set must_change_password=true,profile_completed_at=null where id=any($1::uuid[])",[agents]);
    await reject("select public.assign_agent_order($1,$2,$3)",[agents[1],booking,users[0]],/outside/);
    await db.query("select public.assign_agent_order($1,$2,$3)",[agents[0],booking,users[0]]);
    await reject("select public.agent_order_action($1,$2,'accept')",[agents[0],booking],/access denied/);
    await db.query("update public.rental_agents set must_change_password=false,profile_completed_at=now() where id=any($1::uuid[])",[agents]);
    await reject("select public.agent_order_action($1,$2,'accept')",[agents[1],booking],/access denied/);
    await reject("select public.agent_order_action($1,$2,'note','{\"note\":\"test\"}')",[agents[0],booking],/Accept/);
    await action(agents[0],"accept");
    await reject("select public.agent_availability_action($1,'add',null,'2031-05-03','2031-05-04','Away')",[agents[0]],/overlaps/);
    checks.push("Unavailable dates enforce onboarding, owner-only removal and overlapping dispatch protection");
    await reject("select public.agent_order_action($1,$2,'accept')",[agents[0],booking],/already/);
    await reject("select public.set_agent_territories($1,$2::uuid[])",[agents[0],[market2]],/Reassign/);
    checks.push("City, ownership, onboarding and offer acceptance gates");
    const driver=randomUUID();
    await db.query("insert into public.agent_drivers(id,agent_id,name,phone) values($1,$2,'Other agent driver','000')",[driver,agents[1]]);
    await reject("select public.agent_order_action($1,$2,'schedule',$3::jsonb)",[agents[0],booking,JSON.stringify({deliveryDriverId:driver})],/active drivers/);
    await action(agents[0],"schedule",{deliveryAt:'2031-05-01T09:00:00Z',collectionAt:'2031-05-03T10:00:00Z'});
    await reject("select public.agent_order_action($1,$2,'status','{\"status\":\"refunded\"}')",[agents[0],booking],/cannot/);
    await reject("select public.agent_order_action($1,$2,'status','{\"status\":\"completed\"}')",[agents[0],booking],/Invalid booking transition/);
    await action(agents[0],"message",{messageId:randomUUID(),body:"Verification message, never sent"});
    const token=(await db.query("select customer_token from public.agent_order_assignments where booking_id=$1",[booking])).rows[0].customer_token;
    await db.query("select public.reply_agent_message($1,'Test reply',$2)",[token,randomUUID()]);
    const reply=(await db.query("select id from public.agent_messages where booking_id=$1 and direction='customer'",[booking])).rows[0].id;
    await db.query("select public.mark_agent_messages_read($1,$2::uuid[])",[agents[1],[reply]]);
    assert.equal((await db.query("select read_at from public.agent_messages where id=$1",[reply])).rows[0].read_at,null);
    await db.query("select public.mark_agent_messages_read($1,$2::uuid[])",[agents[0],[reply]]);
    assert.ok((await db.query("select read_at from public.agent_messages where id=$1",[reply])).rows[0].read_at);
    checks.push("Unread state is persisted and cannot be changed by another agent");

    await db.query("update public.rental_agents set is_active=false where id=$1",[agents[0]]);
    await reject("select public.agent_order_action($1,$2,'note','{\"note\":\"test\"}')",[agents[0],booking],/access denied/);
    await reject("select public.reply_agent_message($1,'Test',$2)",[token,randomUUID()],/unavailable/);
    await db.query("update public.rental_agents set is_active=true where id=$1",[agents[0]]);
    for (const status of ["delivering","active","returning","completed"]) await action(agents[0],"status",{status});
    await reject("select public.reply_agent_message($1,'Test',$2)",[token,randomUUID()],/unavailable/);
    checks.push("Driver isolation, restricted lifecycle transitions, messaging, suspension and closed conversations");
    console.log(JSON.stringify({checks,writesPersisted:false,emailsSent:0},null,2));
  } finally { await db.query("rollback"); await db.end(); }
}
main().catch(e=>{console.error("Agent verification failed:",e.message);process.exitCode=1;});
