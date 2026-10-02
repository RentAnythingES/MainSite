import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { localeRegistry, publicLocales } from '../src/i18n/config.ts';
import { germanReleaseReview, germanReleaseApproved } from '../src/i18n/german-release.ts';
import { publicLocaleHref } from '../src/lib/public-routes.ts';
import { customerTokenPath } from '../src/i18n/customer-path.ts';
import { blankTranslation } from '../src/lib/translation-workflow.ts';
import { productPageMetadata } from '../src/lib/product-page-metadata.ts';
import { germanCommercialPaths, germanRouteCandidate } from '../src/i18n/german-paths.ts';
import { germanCategories } from '../src/content/german-categories.ts';
import { germanInformation } from '../src/content/german-information.ts';
import { germanRentalBundles } from '../src/data/bundles-de.ts';
import { productFamilies } from '../src/data/product-families.ts';

let rows = [], databaseError = null, contextError = null, calls = 0;
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
  if (url.endsWith('/src/lib/product-service.ts')) return { format: 'module', shortCircuit: true, source: 'export const mapPublicProductSource = row => ({ ...row.sourceProduct }); export async function getIndexableProductsForSeo() { return globalThis.__germanReleaseSeoStates(); }' };
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
  const sourceProduct = { id: slug, slug, categorySlug: 'baby-gear', subcategorySlug: 'strollers', name: 'English source', description: 'English source', pricing: [{ days: 1, perDay: 12 }], stockTotal: 3, stockAvailable: 2, image: '/products/test.png', brand: 'Model 123', city: 'valencia' };
  return { content_status: 'content_ready', translation_source_revision: 4, sourceProduct,
    product_localizations: [{ locale: 'de', publication_status: 'published', source_revision: 4, translation_revision: 2, reviewed_revision: 2, reviewed_by: 'fixture-reviewer', reviewed_at: '2026-10-02T12:00:00Z', translation_content: content, ...changes }] };
}

test('production German release remains closed without attributable owner approval', async () => {
  assert.equal(germanReleaseApproved(), false);
  assert.equal(localeRegistry.de.public, false);
  assert.deepEqual(publicLocales, ['en', 'es']);
  calls = 0;
  assert.deepEqual(await publishedGermanProducts(), []);
  assert.equal(calls, 0);
  assert.throws(() => publicLocaleHref('/product/test', 'de'), /not public/);
});
test('German inventory exactly names implemented commercial surfaces', () => {
  for (const key of Object.keys(germanInformation)) assert.ok(germanCommercialPaths.includes('/' + key));
  for (const key of Object.keys(germanCategories)) assert.ok(germanCommercialPaths.includes('/rental/' + key));
  for (const kit of germanRentalBundles) assert.ok(germanCommercialPaths.includes('/valencia/kits/' + kit.slug));
  for (const family of productFamilies.filter(item => item.published)) assert.ok(germanCommercialPaths.includes(`/rental/${family.categorySlug}/${family.slug}`));
  for (const path of ['/blog/test', '/discover', '/hamburg', '/rental/mobility/unknown', '/product/INVALID']) assert.equal(germanRouteCandidate(path), false);
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
  assert.ok(result.every(item => !item.url.includes('internal') && !item.url.includes('/de/blog/')));
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
