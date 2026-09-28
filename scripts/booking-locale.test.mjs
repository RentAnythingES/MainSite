import assert from 'node:assert/strict';
import test from 'node:test';
import {NextRequest} from 'next/server';
import {storedBookingLocale} from '../src/lib/booking-locale.ts';
process.env.NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:9999';
process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';
process.env.STRIPE_SECRET_KEY='sk_test_not_a_real_key';
process.env.NEXT_PUBLIC_SITE_URL='https://example.test';
const {stripe}=await import('../src/lib/stripe.ts');
const {POST}=await import('../src/app/api/checkout/route.ts');

test('stored languages retain history and reject corrupted values',()=>{
 assert.equal(storedBookingLocale(null),'en');assert.equal(storedBookingLocale(undefined),'en');
 for(const locale of ['en','es','de'])assert.equal(storedBookingLocale(locale),locale);
 for(const locale of ['','xx','constructor',42])assert.throws(()=>storedBookingLocale(locale));
});

for(const saved of ['es',null])test(`checkout uses stored language ${saved} despite conflicting browser input`,async t=>{
 const draft={id:'11111111-1111-4111-8111-111111111111',product_id:'22222222-2222-4222-8222-222222222222',locale:saved,expires_at:new Date(Date.now()+3600000).toISOString(),fulfillment_mode:'customer_pickup',rental_start_at:'2026-10-20T10:00:00Z',rental_end_at:'2026-10-21T10:00:00Z',timezone:'Europe/Madrid',quantity:1,currency:'eur',rental_subtotal_cents:2500,delivery_fee_cents:0,collection_fee_cents:0,total_cents:2500,pricing_snapshot:{},delivery_type:'standard'};
 t.mock.method(globalThis,'fetch',async(input,init)=>{
  const url=new URL(input instanceof Request?input.url:input);
  assert.equal(url.origin,'http://127.0.0.1:9999','External HTTP forbidden');
  let body;
  if(url.pathname==='/rest/v1/booking_drafts')body=init?.method==='PATCH'?null:url.searchParams.get('select')==='id'?[]:draft;
  else if(url.pathname==='/rest/v1/products')body={slug:'test-product',name:'Test product'};
  else assert.fail(`Unexpected request ${url}`);
  return new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
 });
 let params;
 t.mock.method(stripe.checkout.sessions,'create',async value=>{params=value;return{id:'cs_test',url:'https://example.test/pay',status:'open',expires_at:Math.floor(Date.now()/1000)+1800};});
 const response=await POST(new NextRequest('https://example.test/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({draftId:draft.id,locale:saved==='es'?'en':'es'})}));
 assert.equal(response.status,200);
 assert.equal(params.locale,saved??'en');
 assert.equal(params.metadata.locale,saved??'en');
 assert.equal(new URL(params.cancel_url).searchParams.get('locale'),saved??'en');
 assert.equal(params.line_items[0].price_data.unit_amount,2500);
});

test('availability and draft creation enforce the selected language before side effects',async t=>{
 const {GET}=await import('../src/app/api/availability/route.ts');
 const {POST:createDraft}=await import('../src/app/api/booking-drafts/route.ts');
 const id='11111111-1111-4111-8111-111111111111';
 const calls=[];
 t.mock.method(globalThis,'fetch',async input=>{
  const url=new URL(input instanceof Request?input.url:input);calls.push(url);
  assert.equal(url.origin,'http://127.0.0.1:9999');
  let body;
  if(url.pathname==='/rest/v1/markets')body=[{id,slug:'valencia',default_locale:'en',supported_locales:['en','es'],is_active:true,is_public:true,is_booking_enabled:true,is_indexable:true}];
  else if(url.pathname==='/rest/v1/market_locales'){
   assert.equal(url.searchParams.get('locale'),'eq.es');
   body=[{market_id:id,locale:'es',is_public:true,is_booking_enabled:false,is_indexable:true,language:{code:'es',is_public:true}}];
  }else assert.fail(`Unexpected side effect ${url}`);
  return new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
 });
 const available=await GET(new NextRequest('https://example.test/api/availability?slug=test-product&start=2026-10-20&end=2026-10-21&locale=es'));
 assert.equal(available.status,409);assert.equal((await available.json()).errorCode,'booking_disabled');
 const draft=await createDraft(new NextRequest('https://example.test/api/booking-drafts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({draftId:id,productSlug:'test-product',customerName:'Test',customerEmail:'test@example.test',startAt:'2026-10-20T10:00:00Z',endAt:'2026-10-21T10:00:00Z',locale:'es'})}));
 assert.equal(draft.status,409);assert.equal((await draft.json()).errorCode,'booking_disabled');
 assert.equal(calls.length,4);
});
