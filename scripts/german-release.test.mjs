import { getCategoryCollectionJsonLd } from "../src/lib/jsonld.ts";
import { getDestinationsByHub } from "../src/content/destinations.ts";
import { germanDestinations } from "../src/content/destinations-de.ts";
import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { localeRegistry, publicLocales } from '../src/i18n/config.ts';
import { germanReleaseReview, germanReleaseApproved } from '../src/i18n/german-release.ts';
import { publicLocaleHref } from '../src/lib/public-routes.ts';
import { customerTokenPath } from '../src/i18n/customer-path.ts';
import { blankTranslation } from '../src/lib/translation-workflow.ts';
import { productPageMetadata } from '../src/lib/product-page-metadata.ts';
import { germanCommercialPaths, germanEditorialPaths, germanRouteCandidate } from '../src/i18n/german-paths.ts';
import { germanCategories } from '../src/content/german-categories.ts';
import { germanInformation } from '../src/content/german-information.ts';
import { germanRentalBundles } from '../src/data/bundles-de.ts';
import { productFamilies } from '../src/data/product-families.ts';

let rows = [], databaseError = null, contextError = null, calls = 0;
globalThis.__germanReleaseSourceProduct = slug => rows.find(row => row.sourceProduct.slug === slug)?.sourceProduct;
globalThis.__germanReleaseSeoStates = () => rows.map(row => ({ slug: row.sourceProduct.slug, indexableDe: row.seoIndexable !== false }));
globalThis.__germanReleaseFixtureDb = { from(table) {
  calls++;
  const query = new Proxy({}, { get(_, name) {
    if (name === 'then') return (resolve) => resolve({
      data: table === 'products' ? rows : table === 'categories' ? { id: 'category' } : rows.map(row => ({ product_id: row.sourceProduct.id })),
      error: databaseError,
    });
    return () => query;
  }});
  return query;
}};
globalThis.__germanReleaseContext = () => {
  if (contextError) throw contextError;
  return { isIndexable: true, id: 'valencia' };
};
const hooks = registerHooks({ load(url, context, next) {
  if (url.endsWith('/src/lib/supabase.ts')) return { format: 'module', shortCircuit: true, source: 'export const supabase = globalThis.__germanReleaseFixtureDb;' };
  if (url.endsWith('/src/lib/market-context.ts')) return { format: 'module', shortCircuit: true, source: 'export async function resolveMarketContext() { return globalThis.__germanReleaseContext(); }' };
  if (url.endsWith('/src/lib/product-service.ts')) return { format: 'module', shortCircuit: true, source: 'export const mapPublicProductSource = row => ({ ...row.sourceProduct }); export async function getProductsFromDB() { return globalThis.__germanReleaseSeoStates().map(state => globalThis.__germanReleaseSourceProduct(state.slug)); } export async function getProductsByCategoryFromDB() { return getProductsFromDB(); } export async function getIndexableProductsForSeo() { return globalThis.__germanReleaseSeoStates(); }' };
  return next(url, context);
}});
const { publishedGermanProducts, publishedGermanCategory } = await import('../src/lib/german-catalogue.ts');
const { addGermanSitemap } = await import('../src/lib/german-sitemap.ts');
hooks.deregister();

async function enabled(fn) {
  const deploymentBefore = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "production";
  const saved = { ...germanReleaseReview };
  const publicBefore = localeRegistry.de.public;
  const localesBefore = [...publicLocales];
  Object.assign(germanReleaseReview, { approved: true, reviewedBy: 'fixture-reviewer', reviewedAt: '2026-10-02T12:00:00Z', catalogueSourceHash: 'a'.repeat(64) });
  Reflect.set(localeRegistry.de, 'public', true);
  if (!publicLocales.includes("de")) publicLocales.push("de");
  try { return await fn(); } finally { if (deploymentBefore === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = deploymentBefore; Object.assign(germanReleaseReview, saved); Reflect.set(localeRegistry.de, 'public', publicBefore); publicLocales.splice(0, publicLocales.length, ...localesBefore); databaseError = contextError = null; }
}
function product(slug, changes = {}) {
  const content = { ...blankTranslation(), name: 'Deutscher Mietartikel', short_description: 'Deutsche Beschreibung', detail_description: 'Details', includes_text: 'Artikel', constraints_text: 'Grenzen', delivery_setup_note: 'Abholung', care_note: 'Pflege', seo_title: 'Mietartikel in Valencia', seo_description: 'x'.repeat(140), image_alt_text: 'Mietartikel', features: ['Merkmal'], specs: { Gewicht: '5 kg' }, faqs: [1, 2, 3].map(n => ({ question: `Frage ${n}`, answer: 'Antwort' })) };
  const sourceProduct = { id: slug, slug, categorySlug: 'baby-gear', subcategorySlug: 'strollers', subcategory: 'Strollers', name: 'English source', description: 'English source', pricing: [{ days: 1, perDay: 12 }], stockTotal: 3, stockAvailable: 2, image: '/products/test.png', brand: 'Model 123', city: 'valencia' };
  return { content_status: 'content_ready', translation_source_revision: 4, sourceProduct,
    product_localizations: [{ locale: 'de', publication_status: 'published', source_revision: 4, translation_revision: 2, reviewed_revision: 2, reviewed_by: 'fixture-reviewer', reviewed_at: '2026-10-02T12:00:00Z', translation_content: content, ...changes }] };
}

test('production German release remains closed without attributable owner approval', async () => {
  const savedReview = { ...germanReleaseReview };
  Object.assign(germanReleaseReview, { approved: false, reviewedBy: null, reviewedAt: null, catalogueSourceHash: null });
  try {
  assert.equal(germanReleaseApproved(), false);
  assert.equal(localeRegistry.de.public, false);
  assert.deepEqual(publicLocales, ['en', 'es']);
  calls = 0;
  assert.deepEqual(await publishedGermanProducts(), []);
  assert.equal(calls, 0);
  assert.throws(() => publicLocaleHref('/product/test', 'de'), /not public/);
  } finally { Object.assign(germanReleaseReview, savedReview); }
});
test('German inventory exactly names implemented commercial surfaces', () => {
  for (const key of Object.keys(germanInformation)) assert.ok(germanCommercialPaths.includes('/' + key));
  for (const key of Object.keys(germanCategories)) assert.ok(germanCommercialPaths.includes('/rental/' + key));
  for (const kit of germanRentalBundles) assert.ok(germanCommercialPaths.includes('/valencia/kits/' + kit.slug));
  for (const family of productFamilies.filter(item => item.published)) assert.ok(germanCommercialPaths.includes(`/rental/${family.categorySlug}/${family.slug}`));
  for (const path of ['/blog/test', '/discover/untranslated-guide', '/hamburg', '/rental/mobility/unknown', '/product/INVALID']) assert.equal(germanRouteCandidate(path), false);
});
test('public German navigation preserves equivalents, city and issued token destinations', async () => enabled(() => {
  assert.equal(publicLocaleHref('/es/product/test', 'de'), '/de/product/test');
  assert.equal(publicLocaleHref('/de/rental/mobility/wheelchairs', 'es'), '/es/rental/mobility/wheelchairs');
  assert.equal(publicLocaleHref('/hamburg/product/test', 'de'), '/de');
  assert.equal(publicLocaleHref('/blog/untranslated', 'de'), '/de');
  assert.equal(customerTokenPath('de', '/booking/quote/1234'), '/de/booking/quote/1234');
  Reflect.set(localeRegistry.de, 'public', false);
  assert.equal(customerTokenPath('de', '/booking/quote/1234'), '/de/booking/quote/1234');
}));
test('published German catalogue excludes stale, draft, unreviewed and incomplete copies without English fallback', async () => enabled(async () => {
  const good = product('good');
  rows = [good, product('stale', { source_revision: 3 }), product('draft', { publication_status: 'draft' }), product('unreviewed', { reviewed_by: null }), product('incomplete', { translation_content: { ...good.product_localizations[0].translation_content, care_note: '' } })];
  const output = await publishedGermanProducts();
  assert.deepEqual(output.map(item => item.slug), ['good']);
  assert.equal(output[0].name, 'Deutscher Mietartikel');
  assert.deepEqual(output[0].pricing, good.sourceProduct.pricing);
  assert.equal(output[0].stockAvailable, 2);
  assert.equal(output[0].brand, 'Model 123');
  assert.equal((await publishedGermanCategory('baby-gear')).length, 1);
  databaseError = new Error('offline');
  await assert.rejects(publishedGermanProducts(), /unavailable/);
  databaseError = null; contextError = new Error('market disabled');
  await assert.rejects(publishedGermanProducts(), /market disabled/);
}));
test('German sitemap reciprocates only real equivalents and contains no private or invented editorial URLs', async () => enabled(async () => {
  rows = [product('good')];
  const existing = [{ url: 'https://rentandroll.com/product/good' }, { url: 'https://rentandroll.com/es/product/good' }, { url: 'https://rentandroll.com/blog/english-only' }];
  const result = await addGermanSitemap(existing);
  const variants = result.filter(item => item.url.endsWith('/product/good'));
  assert.equal(variants.length, 3);
  assert.ok(variants.every(item => item.alternates.languages.de === 'https://rentandroll.com/de/product/good'));
  assert.deepEqual(variants[0].alternates, variants[2].alternates);
  assert.ok(result.every(item => !item.url.includes('internal') && !item.url.includes('/de/blog/english-only')));
  for (const path of germanEditorialPaths()) assert.ok(result.some(item => item.url === 'https://rentandroll.com/de' + path));
  assert.ok(germanRouteCandidate('/blog/home-office-setup-valencia-apartment'));
  assert.equal(germanRouteCandidate('/blog/untranslated'), false);
  contextError = new Error('locale disabled');
  assert.deepEqual(await addGermanSitemap(existing), existing);
}));
test('German browsing retains existing active-product behaviour while sitemap eligibility stays independent', async () => enabled(async () => {
  const sourceDraft = product('source-draft');
  sourceDraft.content_status = 'draft';
  sourceDraft.seoIndexable = false;
  rows = [product('good'), sourceDraft];
  assert.deepEqual((await publishedGermanProducts()).map(item => item.slug), ['good', 'source-draft']);
  const result = await addGermanSitemap([]);
  assert.ok(result.some(item => item.url.endsWith('/de/product/good')));
  assert.ok(!result.some(item => item.url.endsWith('/de/product/source-draft')));
}));
test('German product canonicals and alternates stay consistent with published translation state', async () => enabled(() => {
  const state = { indexableEn: true, indexableEs: true, indexableDe: true };
  const source = { ...product('good').sourceProduct, name: 'Deutscher Mietartikel' };
  const de = productPageMetadata('good', 'de', source, state);
  const en = productPageMetadata('good', 'en', source, state);
  assert.equal(de.alternates.canonical, 'https://rentandroll.com/de/product/good');
  assert.deepEqual(de.alternates.languages, en.alternates.languages);
  assert.equal(productPageMetadata('good', 'en', source, { ...state, indexableDe: false }).alternates.languages.de, undefined);
}));

test('German previews stay unindexed even with approved publication fixtures', async () => enabled(async () => {
  process.env.VERCEL_ENV = 'preview';
  const { germanPageMetadata } = await import('../src/lib/german-publication.ts');
  assert.equal(germanPageMetadata('/faq', 'Häufige Fragen').robots.index, false);
  const state = { indexableEn: true, indexableEs: true, indexableDe: true };
  assert.equal(productPageMetadata('good', 'de', product('good').sourceProduct, state).robots.index, false);
  assert.deepEqual(await addGermanSitemap([{ url: 'https://rentandroll.com' }]), [{ url: 'https://rentandroll.com' }]);
}));
test('kit handoff translates customer labels and canonical selections without changing stored identities', async () => {
  const { bundleRequestMessage } = await import('../src/lib/bundle-request-message.ts');
  for (const bundle of germanRentalBundles) {
    const selectedItems = bundle.includedItems.map(item => item.requestName);
    const selectedAddons = bundle.addons.map(item => item.requestName);
    const message = bundleRequestMessage({ locale: 'de', bundle, requestRef: 'KIT-TEST', startDate: '2026-12-01', endDate: '2026-12-07', area: 'Valencia', phone: null, selectedItems, selectedAddons, notes: 'Meine Anfrage' });
    assert.ok(message.includes('Mietpaket: ' + bundle.name));
    assert.ok(message.includes('Mietzeitraum: 2026-12-01 bis 2026-12-07'));
    assert.ok(!message.includes('Included items:') && !message.includes('Add-ons:'));
    for (const item of [...bundle.includedItems, ...bundle.addons]) assert.ok(message.includes('- ' + item.name));
    assert.deepEqual(selectedItems, bundle.includedItems.map(item => item.requestName));
    assert.throws(() => bundleRequestMessage({ locale: 'de', bundle, requestRef: 'TEST', startDate: '2026-12-01', endDate: '2026-12-07', area: 'Valencia', phone: null, selectedItems: ['unknown'], selectedAddons: [], notes: null }), /Missing translated/);
  }
});


test("German neighbourhood hub cannot hide an untranslated original guide", () => {
  assert.ok(germanRouteCandidate("/discover/neighbourhoods"));
  const original = getDestinationsByHub("neighbourhoods")[0];
  const index = germanDestinations.findIndex(guide => guide.slug === original.slug);
  assert.ok(index >= 0);
  const [removed] = germanDestinations.splice(index, 1);
  try {
    assert.equal(germanRouteCandidate("/discover/neighbourhoods"), false);
    assert.equal(germanRouteCandidate("/discover/" + original.slug), false);
  } finally { germanDestinations.splice(index, 0, removed); }
  assert.ok(germanRouteCandidate("/discover/neighbourhoods"));
});


test("German attractions hub requires every original attraction guide", () => {
  assert.ok(germanRouteCandidate("/discover/attractions"));
  const original = getDestinationsByHub("attractions")[0];
  const index = germanDestinations.findIndex(guide => guide.slug === original.slug);
  assert.ok(index >= 0);
  const [removed] = germanDestinations.splice(index, 1);
  try { assert.equal(germanRouteCandidate("/discover/attractions"), false); }
  finally { germanDestinations.splice(index, 0, removed); }
  assert.ok(germanRouteCandidate("/discover/attractions"));
});


test("German event calendar requires every original event translation", () => {
  assert.ok(germanRouteCandidate("/discover/events"));
  const index = germanDestinations.findIndex(guide => guide.slug === "fallas");
  assert.ok(index >= 0);
  const [removed] = germanDestinations.splice(index, 1);
  try { assert.equal(germanRouteCandidate("/discover/events"), false); }
  finally { germanDestinations.splice(index, 0, removed); }
  assert.ok(germanRouteCandidate("/discover/events"));
});


test("German beach and day-trip hubs require every original member", () => {
  for (const hub of ["beaches", "day-trips"]) {
    assert.ok(germanRouteCandidate("/discover/" + hub));
    const original = getDestinationsByHub(hub)[0];
    const index = germanDestinations.findIndex(guide => guide.slug === original.slug);
    assert.ok(index >= 0);
    const [removed] = germanDestinations.splice(index, 1);
    try { assert.equal(germanRouteCandidate("/discover/" + hub), false); }
    finally { germanDestinations.splice(index, 0, removed); }
  }
});

test("German Discover index requires every original guide and map member", () => {
  assert.ok(germanRouteCandidate("/discover"));
  const index = germanDestinations.findIndex(guide => guide.slug === "albufera");
  assert.ok(index >= 0);
  const [removed] = germanDestinations.splice(index, 1);
  try { assert.equal(germanRouteCandidate("/discover"), false); }
  finally { germanDestinations.splice(index, 0, removed); }
  assert.ok(germanRouteCandidate("/discover"));
});

test('German product sections follow original source presence without English text fallback', async()=>enabled(async()=>{
  const row=product('section-shape');row.sourceProduct.includesText='Original included items';
  rows=[row];const [translated]=await publishedGermanProducts();
  assert.equal(translated.includesText,'Artikel');
  for(const field of ['detailDescription','constraintsText','deliverySetupNote','careNote']) assert.equal(translated[field],undefined);
  assert.equal(translated.name,'Deutscher Mietartikel');
  assert.equal(translated.category,'Babys und Kleinkinder');
}));

test('German category sorting does not reorder comparison or related-product cards', async()=>enabled(async()=>{
  const beta=product('beta'),alpha=product('alpha');
  beta.sourceProduct.name='Beta';alpha.sourceProduct.name='Alpha';
  beta.product_localizations[0].translation_content.name='A auf Deutsch';
  alpha.product_localizations[0].translation_content.name='Z auf Deutsch';
  rows=[beta,alpha];
  assert.deepEqual((await publishedGermanCategory('baby-gear')).map(p=>p.slug),['beta','alpha']);
  assert.deepEqual((await publishedGermanCategory('baby-gear',true)).map(p=>p.slug),['alpha','beta']);
}));

test('German collection schema retains item count and links each item to its German equivalent',()=>{
  const schema=getCategoryCollectionJsonLd({name:'Kinderwagen',description:'Vergleich',url:'https://rentandroll.com/de/rental/baby-gear',locale:'de',products:[product('stroller').sourceProduct]});
  assert.equal(schema.inLanguage,'de');assert.equal(schema.mainEntity.numberOfItems,1);
  assert.equal(schema.mainEntity.itemListElement[0].url,'https://rentandroll.com/de/product/stroller');
});


test('German language annotations use real translated Spanish B2B peers', async () => enabled(async () => {
  const { germanPageMetadata } = await import('../src/lib/german-publication.ts');
  for (const [path, es] of [['/partners', '/es/colaboraciones'], ['/valencia/host-services', '/es/valencia/servicios-anfitriones']]) {
    const metadata = germanPageMetadata(path, 'Fallback');
    assert.equal(metadata.alternates.languages.es, 'https://rentandroll.com' + es);
    assert.equal(metadata.alternates.languages.de, metadata.alternates.canonical);
    assert.equal(metadata.alternates.languages.en, 'https://rentandroll.com' + path);
    assert.notEqual(metadata.title.absolute, 'Fallback');
    assert.ok(metadata.title.absolute.length <= 60);
    assert.ok(metadata.description.length >= 130 && metadata.description.length <= 155);
  }
  const existing = ['/partners', '/es/colaboraciones', '/valencia/host-services', '/es/valencia/servicios-anfitriones'].map(path => ({url:'https://rentandroll.com' + path}));
  const sitemap = await addGermanSitemap(existing);
  for (const [path, es] of [['/partners', '/es/colaboraciones'], ['/valencia/host-services', '/es/valencia/servicios-anfitriones']]) {
    const peers = [path, es, '/de' + path].map(path => sitemap.find(row => row.url === 'https://rentandroll.com' + path));
    assert.ok(peers.every(Boolean));
    assert.deepEqual(peers[0].alternates, peers[1].alternates);
    assert.deepEqual(peers[1].alternates, peers[2].alternates);
  }
}));

test('German exact-product snippets retain type intent without altering English metadata or unverified dimensions', async () => enabled(() => {
  const state = {indexableEn:true,indexableEs:true,indexableDe:true};
  const source = {...product('monitor-34').sourceProduct,seoTitle:'27-inch source title',seoDescription:'Original English source description'};
  const en = productPageMetadata('monitor-34','en',source,state);
  const de = productPageMetadata('monitor-34','de',source,state);
  assert.equal(en.title,source.seoTitle);
  assert.equal(de.title.absolute,'Desktop-Monitor mieten in Valencia');
  assert.ok(!/27|34/.test(de.description));
  assert.equal(source.seoTitle,'27-inch source title');
  for(const [slug,type] of [['maxi-cosi-pebble-360-pro2-infant-car-seat','Babyschale'],['kinderkraft-i-spark-2-plus-i-size-car-seat','Kindersitz']])assert.ok(productPageMetadata(slug,'de',source,state).title.absolute.includes(type));
}));
