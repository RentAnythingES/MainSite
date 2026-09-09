const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const rows = [], messages = [];
const mocks = {
  'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
  '@/lib/supabase': { createServiceClient: () => ({ from: () => ({ insert: async (row) => { rows.push(row); return {error: null}; }, update: () => ({ eq: async () => ({error:null}) }) }) }) },
  '@/lib/email': { sendContactAutoReply: async data => {messages.push(data);return true;}, sendContactNotification: async data => {messages.push(data);return true;} }
};
const cache = new Map();
function load(file) {
  file = path.resolve(file); if (cache.has(file)) return cache.get(file).exports;
  const module = {exports:{}}; cache.set(file,module);
  const compiled = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const localRequire = name => {
    if(mocks[name]) return mocks[name];
    if(name.startsWith('@/')) return load(path.join(root,'src',name.slice(2)) + '.ts');
    if(name.startsWith('.')) return load(path.resolve(path.dirname(file),name) + '.ts');
    return require(name);
  };
  vm.runInThisContext('(function(require,module,exports){'+compiled+'\n})',{filename:file})(localRequire,module,module.exports);
  return module.exports;
}
const {getBundleBySlug,rentalBundles} = load(path.join(root,'src/data/bundles.ts'));
const {getSpanishBundleBySlug} = load(path.join(root,'src/data/bundles-es.ts'));
const {POST} = load(path.join(root,'src/app/api/bundle-requests/route.ts'));
const en = getBundleBySlug('turia-beach-explorer'), es = getSpanishBundleBySlug(en.slug);
function payload(locale='en') { const bundle=locale==='es'?es:en;return {bundleSlug:en.slug,locale,customerName:'Test Parent',customerEmail:'parent@example.invalid',startDate:'2030-12-01',endDate:'2030-12-02',area:'Test accommodation',selectedItems:bundle.includedItems.map(x=>x.requestName||x.name),selectedAddons:[bundle.addons[0].requestName||bundle.addons[0].name],notes:'Rider 180 cm; test notes',consentAccepted:true}; }
async function send(body) { return POST(new Request('https://test.invalid/api/bundle-requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})); }
test('Explorer is bilingual and discoverable, with one trailer and three core items',()=>{
 assert.equal(rentalBundles.filter(b=>b.slug===en.slug).length,1);assert.equal(en.includedItems.length,3);assert.equal(es.includedItems.length,3);assert.equal(en.addons.length,2);
 assert.equal(en.includedItems.filter(x=>x.productSlug==='stroller-and-bike-trailer-for-2').length,1);
 assert.ok(en.bestFor.some(x=>x.includes('172–195')));assert.ok(en.faqs.some(x=>x.answer.includes('before payment')));
 assert.equal(en.includedItems.find(x=>x.id==='electric-bike').productSlug,undefined);
 assert.ok(fs.existsSync(path.join(root,'public',en.image)));assert.ok(en.seo.title.length<=60);assert.ok(es.seo.title.length<=60);
});
for(const locale of ['en','es'])test(locale+' request saves canonical equipment and localized email without real side effects',async()=>{
 const body=payload(locale),response=await send(body);assert.equal(response.status,200);const result=await response.json();assert.ok(result.requestRef.startsWith('KIT-'));
 assert.equal(rows.at(-1).locale,locale);assert.deepEqual(rows.at(-1).selected_items,en.includedItems.map(x=>x.name));assert.equal(rows.at(-1).selected_addons[0],en.addons[0].name);assert.equal(messages.at(-1).locale,locale);assert.equal(rows.at(-1).customer_notes,body.notes);
});
test('Missing consent is rejected before database or email writes',async()=>{const n=rows.length,m=messages.length;assert.equal((await send({...payload(),consentAccepted:false})).status,400);assert.equal(rows.length,n);assert.equal(messages.length,m);});
