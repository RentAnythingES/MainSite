import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { validateTranslationContent, translationMissingFields } from '../src/lib/translation-workflow.ts';
import { germanReleaseApproved, germanReleaseReview } from '../src/i18n/german-release.ts';
import { localeRegistry } from '../src/i18n/config.ts';
import { germanCommercialPaths } from '../src/i18n/german-paths.ts';

const args = process.argv.slice(2);
const option = key => args[args.indexOf(key) + 1];
const read = key => {
  if (!args.includes(key) || !option(key) || option(key).startsWith('--')) throw Error(`Required ${key} <file>`);
  return JSON.parse(fs.readFileSync(option(key), 'utf8').replace(/^\uFEFF/, ''));
};
const source = read('--source'), drafts = read('--drafts');
const current = args.includes('--current-source') ? read('--current-source') : null;
const owner = args.includes('--owner-go-ahead') ? read('--owner-go-ahead') : null;
if (!Array.isArray(source.products) || !source.products.length || !Array.isArray(drafts.products)) throw Error('Invalid catalogue input');
const byId = new Map(source.products.map(item => [item.id, item]));
if (byId.size !== source.products.length) throw Error('Duplicate source identities');
const currentById = current ? new Map(current.products.map(item => [item.id, item])) : null;
if (currentById && currentById.size !== current.products.length) throw Error('Duplicate current source identities');
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
function sourceFacts(product) {
  if (!product || !Array.isArray(product.product_localizations) || !Array.isArray(product.product_faqs) || !Array.isArray(product.product_images)) throw Error('Incomplete source projection');
  const fields = ['short_description', 'detail_description', 'includes_text', 'constraints_text', 'delivery_setup_note', 'care_note', 'seo_title', 'seo_description'];
  const english = product.product_localizations.find(item => item.locale === 'en') || {};
  return {
    id: product.id, slug: product.slug, name: product.name, brand: product.brand, description: product.description,
    features: product.features, specs: product.specs, image_url: product.image_url, content_status: product.content_status,
    english: Object.fromEntries(fields.map(field => [field, english[field] ?? null])),
    faqs: product.product_faqs.filter(item => item.locale === 'en').map(item => ({ question: item.question, answer: item.answer })).sort((a, b) => JSON.stringify(canonical(a)).localeCompare(JSON.stringify(canonical(b)))),
    // The saved export contains image descriptors, not full image URL/rights rows.
    images: product.product_images.map(item => ({ alt_text: item.alt_text, is_primary: item.is_primary })).sort((a, b) => JSON.stringify(canonical(a)).localeCompare(JSON.stringify(canonical(b)))),
  };
}
const seen = new Set(), slugs = new Set();
const products = drafts.products.map(draft => {
  if (seen.has(draft.product_id) || slugs.has(draft.slug)) throw Error('Duplicate draft identity');
  seen.add(draft.product_id); slugs.add(draft.slug);
  const original = byId.get(draft.product_id);
  if (!original || original.slug !== draft.slug || draft.locale !== 'de') throw Error(`Unknown draft ${draft.slug}`);
  const content = validateTranslationContent(draft.translation_content);
  const latest = currentById?.get(draft.product_id);
  const blockers = translationMissingFields(content);
  if (!['reviewed', 'published'].includes(draft.publication_status) || !draft.reviewed_by?.trim() || !Number.isFinite(Date.parse(draft.reviewed_at || '')) || !Number.isSafeInteger(draft.translation_revision) || draft.translation_revision < 1 || draft.reviewed_revision !== draft.translation_revision) blockers.push('owner_review_unrecorded');
  if (!latest) blockers.push(current ? 'no_longer_in_current_launch_set' : 'current_source_not_checked');
  else {
    if (hash(sourceFacts(original)) !== hash(sourceFacts(latest))) blockers.push('source_facts_changed');
    if (!Number.isSafeInteger(latest.translation_source_revision) || draft.source_revision !== latest.translation_source_revision) blockers.push('source_revision_not_bound');
  }
  return { slug: draft.slug, sourceFingerprint: hash(sourceFacts(original)), structuralMissing: translationMissingFields(content), sourceRevision: draft.source_revision, sourceContentStatus: original.content_status, informationalReviewNotes: draft.review_notes || [], blockers };
});
const missingDrafts = source.products.filter(item => !seen.has(item.id)).map(item => item.slug);
const newProducts = current?.products.filter(item => !seen.has(item.id)).map(item => item.slug) || [];
const report = {
  checkedAt: new Date().toISOString(), sourceCapturedAt: source.capturedAt, sourceSnapshotSha256: createHash('sha256').update(fs.readFileSync(option('--source'))).digest('hex'),
  sourceProducts: source.products.length, draftedProducts: products.length,
  structurallyCompleteProducts: products.filter(item => !item.structuralMissing.length).length,
  approvedRelease: germanReleaseApproved(), publicationEnabled: localeRegistry.de.public,
  approvedSnapshotMatches: germanReleaseReview.catalogueSourceHash === createHash('sha256').update(fs.readFileSync(option('--source'))).digest('hex'),
  commercialPaths: germanCommercialPaths.length, missingDrafts, newProducts,
  currentSourceChecked: !!current, ownerContinuationRecorded: !!owner?.authorization, readyForPrivateImport: false, ready: false, products,
};
report.readyForPrivateImport = !!current && !!owner?.authorization && owner.sourceSnapshotSha256 === report.sourceSnapshotSha256 && owner.completedDraftSha256 === createHash('sha256').update(fs.readFileSync(option('--drafts'))).digest('hex') && !missingDrafts.length && !newProducts.length && products.every(item => !item.structuralMissing.length && !item.blockers.includes('source_facts_changed') && !item.blockers.includes('no_longer_in_current_launch_set'));
// Owner continuation permits preparation; production review remains revision-bound.
report.ready = !!current && report.approvedRelease && report.approvedSnapshotMatches && !missingDrafts.length && !newProducts.length && products.every(item => !item.blockers.length);
if (args.includes('--output')) fs.writeFileSync(option('--output'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, products: undefined, unresolvedProducts: products.filter(item => item.blockers.length).length, incomplete: products.filter(item => item.structuralMissing.length).map(item => ({ slug: item.slug, missing: item.structuralMissing })) }, null, 2));
if (!report.ready) process.exitCode = 2;
