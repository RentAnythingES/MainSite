# Localization

## Code languages and public languages

`src/i18n/config.ts` owns the language registry. `Locale` includes draft dictionaries; `PublicLocale` includes only languages currently enabled by the registry. A dictionary existing in source does not publish routes or authorize booking in that language. Market language validation is an additional boundary.

English and Spanish remain public. German is a draft using informal du, pending owner review. No `/de` page or German checkout has been released. The registry must not be enabled for German until the remaining route, storage, transaction and content-readiness work is complete.

`getDictionary` requires an explicit supported language and throws for unknown runtime input instead of silently returning English. Every dictionary conforms to the same TypeScript shape. `test:localization` verifies German leaf-key coverage and nonempty strings; this is not linguistic or factual approval.

## Existing route compatibility

`localeFromPathname` recognizes complete prefix segments, so `/es/product/...` is Spanish but `/estate` is not. Header, Footer and proxy use this resolver.

`publicLocaleHref` owns the current EN/ES switch behavior and translated exceptions for partners and host services. It accepts local pathnames only and rejects unpublished target languages. The existing fallback to the Spanish homepage for untranslated English pages is retained. This compatibility list is not yet the publication/readiness registry for future languages or cities.

`productPageMetadata` shares the EN/ES product metadata logic while retaining their current canonical/indexability behavior. Product rendering layouts are still separate; their present styling and editorial differences were intentionally preserved in the first slice.

## Remaining German rollout

- Shared product rendering and the other customer page templates.
- Server-rendered document language without making the whole static site dynamic; the existing document-language script remains for now.
- Admin translation editing, source-revision tracking and stale-content enforcement over the prepared locale/publication storage.
- Owner review of the private German product and booking pilot; full commercial, policy and support-page coverage.
- Reviewed route publication, German metadata/sitemap/alternates and complete rollout checks.

The initial dictionary avoids copying unverified free-delivery or German-support promises. Product and transactional translations need separate review batches. Keep prices, stock, city and the booking timezone independent from display language.

## Verification

Run `npm run test:localization`, the existing market/booking regression tests, touched-file ESLint and `npx next build`. Run the PGlite database tests separately from a large build on machines with limited available memory. No production credentials are required for these tests.

## Private translation storage (prepared migration)

`20260928_private_translation_storage.sql` adds a database locale registry and
`market_locales` settings for future city/language publication, booking and indexing.
German starts private in both tables. Existing market rows are untouched; the new
per-city records copy their current settings. Public market resolution checks both
these records and `markets.supported_locales`. City setup still accepts only EN/ES.
A database trigger adds private language records atomically when a city or its
supported languages are added, without re-enabling existing gates. These tables
alone do not enable any route.

Product translations and FAQs reference the locale registry instead of binary
CHECK constraints. Existing rows are backfilled as published to preserve public
read behavior. Inserts that omit publication status retain the current EN/ES
workflow; other languages default to draft. Trusted server writers can explicitly
set draft, reviewed, published or stale. Anonymous/authenticated readers require
both published content and a public locale, in addition to existing active-product
policies. Restrictive policies prevent another permissive read policy bypassing
these gates. Service-role readers bypass RLS and must enforce publication in their
own application queries before any new language is served.

The later translation workflow migration adds revision tracking, stale detection,
editor controls, reviewer attribution and product translation publication checks.
Full commercial coverage and owner review remain outstanding. Do not enable German in the database
or code registry until those controls and the complete customer journey are ready.
The migration has passed ephemeral PostgreSQL tests, including transaction rollback,
legacy inserts, unchanged market rows, public-role privacy and a fourth private
language. The current-schema local Supabase rehearsal passed for the private pilot.
No production migration has been applied for this slice.

## Application gate integration (unreleased)

`resolveMarketContext` requires a code-public locale, membership in the city's
supported languages, a public global locale and a public city-language record.
Booking requests also require the city-language booking gate; the returned
indexability is the conjunction of city and language settings. Operator/historical
resolution remains separate, so issued bookings keep their saved locale.

Missing tables, database failures and incomplete records fail closed. Apply the
prepared migration before deploying this application checkpoint; there is no
schema-error fallback that silently bypasses a language disable. Existing public
market callers (booking options and offer catalogue resolution) now use these
checks. Legacy product rendering, shared templates, cached page invalidation and
sitemap readers still need integration before a language can be launched or a
complete site-wide disable promised. No public German route exists yet.

## Stored transaction language (unreleased)

Apply `20260928_private_translation_storage.sql` and then
`20260928_transaction_language.sql` before deploying the current branch. The latter
adds nullable locale references to drafts and bookings; existing rows stay null.
The widget sends locale to availability and draft creation. Both validate the
selected language against the public city-language booking gates before proceeding.
New drafts save the validated locale; payment completion copies it to the booking.

Checkout uses the saved draft language for Stripe's interface, date formatting and
its cancellation URL, ignoring a conflicting browser locale. Old null-language
records use English for display without rewriting historical data. A malformed
stored locale fails instead of silently selecting English. Rental timezone, prices
and inventory identity are unchanged.

The private booking pilot now localizes checkout line items, success/cancel pages,
confirmation and lifecycle messages, document emails, German invoice/refund PDFs
and review invitations/forms. Custom-quote entry and paid service-amendment screens
and messages remain part of commercial coverage. German stays private.

## Private German booking pilot — implemented, owner review pending

The local route `/internal/localization/de` presents one selected CYBEX Coya draft,
its category context and the shared booking widget. It is unavailable in production.
It requires `LOCALIZATION_PREVIEW=true`, a loopback Supabase URL, a Stripe test key,
and no Resend key. Per-city language records still control booking access. The
global German registry remains private. These switches are for a local synthetic
database; they are not a hosted preview publication mechanism.

`src/i18n/booking.ts`, `transaction.ts` and `review.ts` own the transactional copy.
The stored draft/booking language determines payment and follow-up output. The
query-string language is only an initial display hint on return pages; the payment
status response supplies the stored language. Old null-language bookings retain
English display. Date formatting uses the saved operational timezone. Localized
PDFs snapshot language/timezone and support Latin-1 characters including umlauts
and ß. The existing PDF layout is not a general Unicode document engine.

Payment received and booking confirmed are distinct states. A pending operator
approval does not display a confirmation. Cancelled/refunded bookings do not show
active handover links. Review invitations save the booking language; customer
feedback remains private without explicit publication consent. Apply the additive
`20260928_transaction_review_language.sql` after the two earlier German migrations.

### Issued-draft resumption policy

Disabling new bookings in a language prevents new availability/draft requests.
An already issued, unexpired draft can resume in its saved language, subject to
existing checkout, inventory and fulfillment checks. Language disablement alone
does not invalidate issued transactions or historical customer links. The browser's
active-checkout match includes locale, preventing a new language selection from
silently reusing a differently localized draft.

### Verification and release boundary

The three additive German migrations passed local rollback/apply rehearsal. The
local journey exercises real Supabase route handlers with synthetic data; Stripe
and email transport are mocked and all other external HTTP is blocked. It covers
draft creation, stored-language checkout/resumption, inventory holds, cancellation,
paid webhook/retry, pending approval, invoice snapshots and private German feedback.
Run `scripts/german-journey.local.mjs` only against the documented local fixture;
provide `LOCAL_SUPABASE_STATUS_FILE` from local CLI startup. It retains synthetic
receipts and selects fresh dates on subsequent runs.

The customer-message inventory also found paths outside this pilot: contact
auto-replies, signup emails, custom-quote entry and service-amendment messages.
These need commercial rollout coverage before broad German publication. Admin and
operational messages remain English. Free-form operator instructions and custom
terms require reviewed translations; selecting German does not translate arbitrary
database text. Global navigation, cookie/legal pages, shared commercial templates,
server document-language routing and SEO publication remain future rollout work.

Owner review package: `agent-work/expansion-readiness-2026-09-27/planpro/german-rollout/GERMAN-BOOKING-COPY-REVIEW.md`
in the primary workspace, with 11 email examples and two synthetic PDF specimens.
No German copy is claimed as reviewed. No production migration, payment, email,
push or deployment was performed for this phase.

## Product translation authoring and review — implemented, unreleased

Apply `20260929_translation_workflow.sql` after the three earlier German migrations
before deploying this branch. The product reader projections now require its columns.
The migration was rehearsed and applied only in the isolated local database.

`/admin/products/[id]/translations` provides an English source beside the selected
language, a saved-copy preview and recent change history. The database language
registry supplies the choices. Text, display name, image description, features,
specifications and FAQs are saved together through `manage_product_translation`.
Stock, prices, product identity and image URLs stay outside translation content.

Saving creates a draft revision and clears previous approval. Review requires both
language and factual attestations; the authenticated administrator is recorded as
reviewer. Publishing requires the reviewed revision, current source revision and
both application/database language publication gates. German remains private.
Conflicting edits return 409 and the editor retains unsaved text for reconciliation.

Changes to source product facts, English editorial copy/FAQs or images advance the
source revision and mark managed translations stale. Stock and price updates do
not. Legacy EN/ES rows remain compatible until enrolled by saving through the new
editor. The old editor cannot overwrite managed translations, and its FAQ saves
preserve other languages. Product service readers reject unpublished/stale managed
rows; successful admin mutations invalidate the existing product cache tag.
External direct database writes still need cache invalidation or expiry. Existing
EN/ES fallback remains; strict German commercial route coverage is not complete.

Shared `ProductEditorialNotes` renders the four editorial sections on EN/ES product
pages and the private editor preview. Other commercial templates remain to be
consolidated. There is no general public German product/category route yet.

### Coverage and review limits

`npm run audit:locale-coverage -- --fixture` verifies the report mechanism.
`--input <snapshot.json> --output <report.json>` audits an authorized offline export.
`--live --snapshot <path>` explicitly reads active catalogue source content and
persists it locally; it must not run while the current export approval is unresolved.
The attempted production export was rejected before execution, so no real catalogue
coverage percentage or translated catalogue count is claimed.

Automated readiness checks cover required text, metadata length, FAQ completeness,
revision agreement and recorded review. They do not prove factual equivalence or
translation quality. Human review must check all source features, specifications,
suitability, restrictions and safety guidance. See `GERMAN-CONTENT-INVENTORY.md`.
