import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
const read = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url),'utf8');

test('translation storage preserves legacy visibility and keeps future languages private', async()=>{
 const db=new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
   create function uuid_generate_v4() returns uuid language sql as 'select gen_random_uuid()';
   create table products(id uuid primary key default gen_random_uuid(),is_active boolean not null default true);
   insert into products default values;
   create table markets(id uuid primary key default gen_random_uuid(),supported_locales text[],is_public boolean,is_active boolean,is_booking_enabled boolean,is_indexable boolean);
   insert into markets(supported_locales,is_public,is_active,is_booking_enabled,is_indexable) values(array['en','es'],true,true,true,true),(array['en'],false,false,false,false);`);
  await db.exec(read('20260711_product_content_readiness.sql'));
  await db.exec(`grant usage on schema public to anon,authenticated,service_role;
   grant select on products,markets,product_localizations,product_faqs to anon,authenticated;
   grant all on products,product_localizations,product_faqs to service_role;
   insert into product_localizations(product_id,locale,short_description) select id,'en','original' from products;
   insert into product_faqs(product_id,locale,question,answer) select id,'en','Question','Answer' from products;`);
  const before=(await db.query('select * from product_localizations')).rows;
  const marketsBefore=(await db.query('select * from markets order by id')).rows;
  await db.exec('begin');
  await db.exec(read('20260928_private_translation_storage.sql'));
  await db.exec('rollback');
  assert.equal((await db.query("select to_regclass('public.locales') as t")).rows[0].t,null);
  await db.exec(read('20260928_private_translation_storage.sql'));
  await db.exec('create table booking_drafts(id int primary key); create table bookings(id int primary key); insert into booking_drafts values(1); insert into bookings values(1);');
  await db.exec(read('20260928_transaction_language.sql'));
  for(const table of ['booking_drafts','bookings']) {
   assert.equal((await db.query(`select locale from ${table} where id=1`)).rows[0].locale,null);
   await db.exec(`insert into ${table}(id,locale) values(2,'es')`);
   await assert.rejects(db.exec(`insert into ${table}(id,locale) values(3,'unknown')`),{code:'23503'});
  }
  const after=(await db.query('select * from product_localizations')).rows;
  assert.deepEqual(after.map(({publication_status,...row})=>{assert.equal(publication_status,'published');return row;}),before);
  assert.deepEqual((await db.query('select * from markets order by id')).rows,marketsBefore);
  for(const locale of ['es','de']) {
   await db.query('insert into product_localizations(product_id,locale) select id,$1 from products',[locale]);
   await db.query("insert into product_faqs(product_id,locale,question,answer) select id,$1,'Q','A' from products",[locale]);
  }
  assert.equal((await db.query("select publication_status from product_localizations where locale='de'")).rows[0].publication_status,'draft');
  assert.equal((await db.query("select publication_status from product_faqs where locale='de'")).rows[0].publication_status,'draft');
  await assert.rejects(db.exec("insert into product_localizations(product_id,locale) select id,'xx' from products"),{code:'23503'});
  for(const role of ['anon','authenticated']) {
   await db.exec(`set role ${role}`);
   assert.deepEqual((await db.query('select code from locales order by code')).rows.map(r=>r.code),['en','es']);
   assert.equal((await db.query('select * from market_locales')).rows.length,2);
   for(const table of ['product_localizations','product_faqs'])
    assert.deepEqual((await db.query(`select locale from ${table} order by locale`)).rows.map(r=>r.locale),['en','es']);
   await assert.rejects(db.exec("update locales set is_public=true where code='de'"),{code:'42501'});
   await assert.rejects(db.exec("update market_locales set is_public=true where locale='de'"),{code:'42501'});
   await db.exec('reset role');
  }
  // Even enabling the locale cannot expose draft, reviewed or stale copy.
  await db.exec("update locales set is_public=true where code='de'");
  for(const status of ['draft','reviewed','stale','published']) {
   await db.query("update product_localizations set publication_status=$1 where locale='de'",[status]);
   await db.query("update product_faqs set publication_status=$1 where locale='de'",[status]);
   await db.exec('set role anon');
   for(const table of ['product_localizations','product_faqs'])
    assert.equal((await db.query(`select * from ${table} where locale='de'`)).rows.length,status==='published'?1:0);
   await db.exec('reset role');
  }
  await db.exec('update products set is_active=false; set role anon');
  assert.equal((await db.query('select * from product_localizations')).rows.length,0);
  assert.equal((await db.query('select * from product_faqs')).rows.length,0);
  await db.exec('reset role; set role service_role');
  assert.equal((await db.query('select * from product_localizations')).rows.length,3);
  await db.exec('reset role');
  // A fourth language needs a registry row, not another CHECK rewrite.
  await db.exec("insert into locales(code,name) values('fr','Français'); insert into product_localizations(product_id,locale) select id,'fr' from products");
  assert.equal((await db.query("select publication_status from product_localizations where locale='fr'")).rows[0].publication_status,'draft');
  const added=(await db.query("insert into markets(supported_locales,is_public,is_active,is_booking_enabled,is_indexable) values(array['en','es'],false,false,false,false) returning id")).rows[0].id;
  const gates=(await db.query('select * from market_locales where market_id=$1 order by locale',[added])).rows;
  assert.equal(gates.length,2);
  assert.ok(gates.every(row=>!row.is_public&&!row.is_booking_enabled&&!row.is_indexable));
  await db.query("update markets set supported_locales=array['en','es','fr'] where id=$1",[added]);
  assert.equal((await db.query('select * from market_locales where market_id=$1',[added])).rows.length,3);
  await db.query("update markets set supported_locales=array['en','es','fr'] where id=$1",[added]);
  assert.equal((await db.query('select * from market_locales where market_id=$1 and is_public',[added])).rows.length,0);
  await db.exec('begin');
  const rolledBack=(await db.query("insert into markets(supported_locales) values(array['en']) returning id")).rows[0].id;
  await db.exec('rollback');
  assert.equal((await db.query('select * from market_locales where market_id=$1',[rolledBack])).rows.length,0);
 } finally {await db.close();}
});
