import assert from 'node:assert/strict';

/** Called only by the isolated journey harness, which blocks external HTTP. */
export async function rehearseGermanQuotes({db, booking, pickup, req, checkout, webhook, getSession, getParameters, emails}) {
  delete process.env.RESEND_API_KEY;
  const {POST:accept}=await import('../src/app/api/custom-quotes/[token]/accept/route.ts');
  const {GET:view}=await import('../src/app/api/custom-quotes/[token]/route.ts');
  const {POST:amendmentCheckout}=await import('../src/app/api/fulfillment-amendments/[token]/checkout/route.ts');
  const quote=(await db.query(`insert into booking_custom_quotes(product_id,product_offer_id,market_id,locale,quantity,rental_start_at,rental_end_at,fulfillment_mode,pickup_location_id,total_cents,line_items,display_name)
    values($1,$2,$3,'de',1,$4::timestamptz+interval '7 days',$5::timestamptz+interval '7 days','customer_pickup',$6,4200,$7::jsonb,'Individuelles Testpaket') returning *`,
    [booking.product_id,booking.product_offer_id,booking.market_id,booking.rental_start_at,booking.rental_end_at,pickup,JSON.stringify([{description:'Miete für den lokalen Test',amountCents:4200}])])).rows[0];
  const context={params:Promise.resolve({token:quote.public_token})};
  let response=await view(req('/api/custom-quotes/'+quote.public_token),context);
  assert.equal(response.status,200);assert.equal((await response.json()).quote.locale,'de');
  response=await accept(req('/api/custom-quotes/'+quote.public_token+'/accept',{customerName:'Lokaler Angebotstest',customerEmail:'pilot@example.test',locale:'es'}),context);
  let data=await response.json();assert.equal(response.status,200,JSON.stringify(data));
  const draftId=data.draftId;
  assert.equal((await db.query('select locale from booking_drafts where id=$1',[draftId])).rows[0].locale,'de');
  response=await checkout(req('/api/checkout',{draftId,locale:'en'}));
  assert.equal(response.status,200,JSON.stringify(await response.json()));
  assert.equal(getParameters().locale,'de');
  assert.match(getParameters().success_url,/internal\/localization\/de\/booking\/success/);
  assert.equal(getParameters().line_items[0].price_data.product_data.name,'Miete für den lokalen Test');
  const session=getSession();session.status='complete';session.payment_status='paid';session.payment_intent='pi_mock_'+crypto.randomUUID().replaceAll('-','');
  process.env.RESEND_API_KEY='re_local_mock';
  response=await webhook(req('/api/webhooks/stripe',{}));assert.equal(response.status,200,JSON.stringify(await response.json()));
  const paid=(await db.query('select * from bookings where booking_draft_id=$1',[draftId])).rows[0];
  assert.ok(paid);assert.equal(paid.locale,'de');assert.equal(paid.total_cents,4200);
  assert.equal((await db.query('select status from booking_custom_quotes where id=$1',[quote.id])).rows[0].status,'paid');
  const invoice=(await db.query("select * from booking_documents where booking_id=$1 and document_type='invoice'",[paid.id])).rows[0];
  assert.ok(invoice);assert.equal(invoice.booking_snapshot.locale,'de');assert.equal(invoice.total_cents,4200);
  assert.ok(emails.some(e=>e.html?.includes('Individuelles Testpaket')&&e.html.includes('lang="de"')));
  delete process.env.RESEND_API_KEY;
  const amendment=(await db.query(`insert into booking_fulfillment_amendments(booking_id,market_id,fulfillment_mode,delivery_address,delivery_fee_cents,is_custom_quote) values($1,$2,'delivery_only','Lokale Testadresse',1500,true) returning *`,[paid.id,paid.market_id])).rows[0];
  response=await amendmentCheckout(req('/api/fulfillment-amendments/'+amendment.public_token+'/checkout',{}),{params:Promise.resolve({token:amendment.public_token})});
  assert.equal(response.status,200,JSON.stringify(await response.json()));
  assert.equal(getParameters().locale,'de');assert.equal(getParameters().line_items[0].price_data.product_data.name,'Nur Lieferung');
  assert.match(getParameters().success_url,/internal\/localization\/de\/booking\/fulfillment/);
  const transportSession=getSession();transportSession.status='complete';transportSession.payment_status='paid';transportSession.payment_intent='pi_mock_'+crypto.randomUUID().replaceAll('-','');
  process.env.RESEND_API_KEY='re_local_mock';
  response=await webhook(req('/api/webhooks/stripe',{}));assert.equal(response.status,200,JSON.stringify(await response.json()));
  const updated=(await db.query('select * from bookings where id=$1',[paid.id])).rows[0];
  assert.equal(updated.locale,'de');assert.equal(updated.fulfillment_mode,'delivery_only');assert.equal(updated.total_cents,5700);
  assert.equal((await db.query('select status from booking_fulfillment_amendments where id=$1',[amendment.id])).rows[0].status,'paid');
  const docs=(await db.query("select * from booking_documents where booking_id=$1 and document_type='invoice' order by created_at",[paid.id])).rows;
  assert.equal(docs.length,2);assert.equal(docs[1].total_cents,1500);assert.equal(docs[1].booking_snapshot.locale,'de');
  assert.ok(emails.some(e=>e.html?.includes('Individuelles Testpaket')&&e.html.includes('lang="de"')&&e.html.includes('Lieferung')));
  response=await webhook(req('/api/webhooks/stripe',{}));assert.equal(response.status,200);
  assert.equal((await db.query("select count(*)::int n from booking_documents where booking_id=$1 and document_type='invoice'",[paid.id])).rows[0].n,2);
  return {customQuoteId:quote.id,amendmentId:amendment.id,bookingId:paid.id,cases:['custom-quote-view','custom-quote-accept-inherits-German','custom-quote-checkout','custom-quote-paid-invoice','amendment-checkout','amendment-paid-update','amendment-German-invoice-email','amendment-replay-idempotent']};
}
