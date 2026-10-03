# Localization

## Code languages and public languages

`src/i18n/config.ts` owns the language registry. `Locale` includes draft dictionaries; `PublicLocale` includes languages supported by public route code; `publicLocales` and the runtime registry determine which are actually enabled. A dictionary existing in source does not publish routes or authorize booking in that language. Market language validation is an additional boundary.

English and Spanish remain public. German is a draft using informal du, pending owner review. No `/de` page or German checkout has been released. The registry must not be enabled for German until the remaining route, storage, transaction and content-readiness work is complete.

`getDictionary` requires an explicit supported language and throws for unknown runtime input instead of silently returning English. Every dictionary conforms to the same TypeScript shape. `test:localization` verifies German leaf-key coverage and nonempty strings; this is not linguistic or factual approval.

## Existing route compatibility

`localeFromPathname` recognizes complete prefix segments, so `/es/product/...` is Spanish but `/estate` is not. Header, Footer and proxy use this resolver.

`publicLocaleHref` owns the current EN/ES switch behavior and translated exceptions for partners and host services. It accepts local pathnames only and rejects unpublished target languages. The existing fallback to the Spanish homepage for untranslated English pages is retained. This compatibility list is not yet the publication/readiness registry for future languages or cities.

`productPageMetadata` shares the EN/ES product metadata logic while retaining their current canonical/indexability behavior. Product rendering now uses shared ProductPageBody with explicit localized content and customer links.

## Remaining German rollout

- Record the owner's specific product, website/legal, consent and email approvals or changes.
- Resolve or exclude the three incomplete products and reconcile reviewed source facts with current revisions before import.
- Finish full visual/email-client acceptance and browser saved-language payment-return navigation.
- Apply and verify the prepared production migrations, attributed import/review/publication and guarded release sequence after approval.

Public routes, strict publication readers, shared templates, customer language links,
metadata and reciprocal dynamic sitemap are now prepared behind closed gates.
No product facts, delivery promises or German support commitments are invented.
Prices, stock, city and booking timezone stay independent from display language.

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
and review invitations/forms. Custom-quote and service-amendment copy, APIs and
transport messages now support German; full local acceptance remains pending.
German stays private.

## Private German booking pilot — implemented, owner review pending

The local route `/internal/localization/de` presents the saved German draft for
`stroller-travel-compact`, its category context and the shared booking widget.
It now uses `ProductDetail`, the same core detail renderer as the EN/ES product
routes. It is unavailable in production.
It requires `LOCALIZATION_PREVIEW=true`, a loopback Supabase URL, a Stripe test key,
and no Resend key. Per-city language records still control booking access. The
global German registry remains private. These switches are for a local synthetic
database; they are not a hosted preview publication mechanism.

Set `LOCALIZATION_CATALOGUE_DRAFTS_FILE` to the absolute path of the approved
offline `german-catalogue-drafts.json`. The server reads it only after the private
preview guard passes; the catalogue is not statically bundled or copied to public
assets. Missing or malformed draft data fails instead of using English copy.
The pilot overlays copy onto local fixture inventory/pricing; this is not a
production import or source-revision reconciliation. Its review notes remain
visible, and all copy remains unapproved.

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

Contact forms, auto-replies, newsletter signup/welcome and unsubscribe now have
EN/ES/DE copy. New requests reject unsupported locales and require the existing
private local gate for German. Newsletter storage uses exactly the consent text
shown in that locale, with version `2026-09-29`; consent must be boolean true.
Welcome links carry the locale and unsubscribe success uses the stored subscriber
language. Local preview contact submissions report an explicit test result without
sending; local newsletter requests can save to the synthetic local database but
skip email transport. No real messages were sent during implementation.

Custom quotes and service amendments still need complete browser/database rollout
coverage before broad German publication. Private contact and newsletter pages are
connected. Browser contact submission and its privacy link passed; newsletter
browser/database acceptance remains outstanding. Admin and
operational messages remain English. Free-form operator instructions and custom
terms require reviewed translations; selecting German does not translate arbitrary
database text.

Private navigation, cookie controls, contact/newsletter routes, how-it-works and
four policy drafts are now connected below `/internal/localization/de`. The
server layout applies the same local gate to every child. German policy drafts
preserve existing sources and display unresolved owner/legal review notes;
they are not a new legal approval. General catalogue/category/family/kit routes,
additional help content and SEO publication still remain.

Language roots now live in `src/app/(english)`, `src/app/(spanish)` and
`src/app/(german)`. They share `SiteDocument` and pass a fixed locale, so the initial
HTML language is correct without a hydration-time script or request headers in
the public root layout. URLs are unchanged; API handlers and metadata assets remain
under `src/app`. Cross-language navigation crosses root layouts and therefore loads
a new document. The intermediate request-time-rendering regression is resolved:
the build again prerenders English/Spanish pages and `verify-locale-roots.mjs`
checked the language of 202 generated public HTML pages (excluding Next framework
fallbacks). Product data retains its tagged cache.

A local production-server check verified `/`, `/es`, both contact pages and
404 responses for the private German pilot, contact and privacy routes even with
the preview flag set. The production guard still blocks German. Transaction URLs
outside the German root still need document-language acceptance coverage alongside
the remaining quote/amendment acceptance work. The proxy overwrites the pathname header from
the actual URL. German display context applies only to the private prefix and
does not enable `/de`. Analytics scripts, events and web-vital reporting skip
internal preview routes.

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

Shared `ProductDetail` renders the main image, description, pricing, features,
editorial sections, specifications and booking widget on EN/ES product pages and
the private German pilot. Prices use locale formatting. The duplicated Spanish
FAQ block inside the old detail layout is removed; its existing outer FAQ section
remains. Schema, related products, planning links and the other commercial
templates still need consolidation. There is no general public German
product/category route yet.

### Shared category and private catalogue routes — in progress

EN/ES category routes now use `CategoryLandingPage` for their visible layout;
metadata and JSON-LD remain in their route wrappers. The full product grid precedes
comparison/editorial sections. `CategoryProductCatalogue` and `ProductCard` now
support EN/ES/DE labels, locale-aware sorting and currency, and an explicit product
route base for private links. Cards tolerate an empty pricing list without crashing.

Private `/internal/localization/de/product/[slug]` and `/rental/[category]` routes
overlay saved German drafts onto local catalogue records. German category drafts
are in `src/content/german-categories.ts`. The adapter preserves each source product,
price and stock field and rejects missing translation/category/subcategory labels;
it does not filter unmatched products away or silently fall back to English.

The saved 128-product copy export contains no operational stock/pricing/category
membership. The static fallback has 21 products, three absent from the approved
snapshot (`standard-wheelchair`, `monitor-27`, `portable-ac`). Do not invent their
German identity or borrow another model's copy. Local fixture reconciliation and
full-route browser coverage remain outstanding; these routes are not yet claimed
as a complete 128-product operational catalogue. The existing single-product pilot
remains the entry page until the broader local catalogue setup is verified.

### Coverage and review limits

#### Custom quotes and transport amendments — 29 September

Customer components use EN/ES/DE dictionaries in `private-quotes.ts`, including
loading/failure copy, form fields, terminal states, dates and currency. Server
wrappers resolve the saved language before rendering. The APIs return that language;
German reads/acceptance/transport checkout require the local preview gate. The
surrounding document root, navigation and route metadata still need German
transaction acceptance work; localized component copy alone does not prove this.

New custom quotes record the operator's selected language. For non-English quotes,
the operator supplies a customer title and writes line descriptions, conditions and
instructions in that language. Arbitrary text is not automatically translated.
`20260929_custom_quote_language.sql` adds the locale-registry FK and a draft trigger
that inherits the quote language inside the existing acceptance transaction.
Historical nulls are preserved. This migration is tested in PGlite, not yet applied
to the local Supabase instance or production.

Transport checkout uses saved booking language for Stripe, amounts, labels and
metadata. German product names use the explicit custom display name or the saved
private catalogue draft; unmatched product names fail instead of falling back.
Transport quote/confirmation emails use a pure escaped renderer in
`amendment-message.ts`; the webhook passes saved language and the localized product
name to the message and transport invoice. No real messages or payments were sent.

38 localization tests pass, including conflict hints, private-gate rejection,
atomic language inheritance and German email rendering. Production build passed
with placeholder services. Full acceptance still requires local migration,
fixtures, browser checks and a mocked complete amendment webhook/invoice journey.

#### Kit template and request work — 29 September

`BundleLandingPage` supplies the shared EN/ES/DE kit detail layout and `BundleHub`
supplies the hub layout. Route wrappers retain metadata, data sources and
specialized Explorer/mobility sections. `BundleConfigurator`, `ExplorerDetails`
and `MobilityFamilyLinks` accept German. All nine drafts are in `bundles-de.ts`,
with private routes at `/internal/localization/de/valencia/kits` and `/[slug]`.
`localizeBundle` preserves canonical request names, quantities, image and product
identities and rejects incomplete notes instead of retaining English text.
Private pages expose kit-specific review notes. Catalogue reconciliation and
browser/local-database verification remain required for a complete kit journey.

Kit requests now preserve EN/ES/DE selection for every kit rather than assigning
English to all non-Explorer requests. New request consent is shared with the
displayed configurator copy and versioned `kit-request-2026-09-29`. The API gates
German through `outreachLocale`; guarded local previews persist only to the local
database and return before notifications or WhatsApp handoff. Availability errors
and notes are localized. Generic network failures do not display English exception
strings in the configurator. Operational selection names remain stable request
identifiers; translated kit items must retain their source `requestName` mapping.

`20260929_kit_request_language.sql` replaces the EN/ES-only storage check with a
foreign key to the locale registry. It is tested in PGlite but has not yet been
applied to the local Supabase instance or production. Existing rows and private
access survive migration; unknown locales are rejected.

Current validation: 33 localization tests pass, including request persistence for
all nine kits in all three languages with external HTTP prohibited. Build passes;
`verify-kit-pages.mjs` confirms source descriptions/items/FAQs and locale links in
all 18 rendered EN/ES kit pages and both hubs. Locale roots and cache audit pass.
The private remote-work kit still encounters unmatched `monitor-27` in the static
fallback, so full German browsing requires the pending local catalogue fixture.
Do not treat fallback model names as replacements for products in the saved export.

The shared `ProductFamilyLandingPage` accepts an explicit draft and route prefix
for German. All five current family drafts live in `src/content/german-families.ts`;
their guarded routes are `/internal/localization/de/rental/[category]/[family]`.
Private category pages link to these families after the full catalogue grid.
The public EN/ES family data and route enablement remain separate. German cards
use translated catalogue names rather than duplicating model or capacity claims.
Family browser verification still depends on local catalogue reconciliation.

The catalogue owner review is generated by
`F:/rentanything/agent-work/expansion-readiness-2026-09-27/goalpro/build-german-owner-review.mjs`.
Its HTML output presents all 128 source/draft pairs across 13 fields, preserves
all review notes, identifies three blank text fields and two empty feature/spec
records, and supports search and a source-gap filter. It records no approvals.
The generator checks IDs, hashes, draft state, uniqueness and field coverage.
The browser tool blocked opening the local file; visual verification is pending.
This catalogue file is one part of the consolidated package: website copy and
journey verification are still outstanding.

Verification on 29 September: 27 localization tests, TypeScript, production
build and cache audit pass; 202 public HTML documents and 209 static route entries
pass the locale-root check. Private German routes are not prerendered. The build
used placeholder services and had expected review-fetch warnings; it does not
prove a live or complete local-database journey.

`npm run audit:locale-coverage -- --fixture` verifies the report mechanism.
`--input <snapshot.json> --output <report.json>` audits an authorized offline export.
`--live --snapshot <path>` explicitly reads active catalogue source content and
persists it locally. The initial export attempt was rejected, but a separately
authorized retry completed on 28 September 2026 at 15:41:31 UTC. Use that saved
snapshot for this rollout; do not repeat the export.

On 29 September, all 128 active products in that snapshot have German drafts in
`F:/rentanything/agent-work/expansion-readiness-2026-09-27/goalpro/german-catalogue-drafts.json`.
The drafts are offline, private and unreviewed, not imported or published.
Structural validation reports three deliberately blank fields lacking adequate
source evidence: acupressure mat delivery/setup, air purifier image description,
and EZVIZ baby monitor care. The two empty feature/specification lists remain
empty and flagged. Product-level review notes record factual conflicts and release
questions; full draft coverage does not mean factual or language approval.

Automated readiness checks cover required text, metadata length, FAQ completeness,
revision agreement and recorded review. They do not prove factual equivalence or
translation quality. Human review must check all source features, specifications,
suitability, restrictions and safety guidance. See `GERMAN-CONTENT-INVENTORY.md`.

### Private transaction routes — 29 September 2026

New German catalogue drafts capture their translated product name in
`pricing_snapshot.displayName`. Checkout, confirmation/retry, invoice, success
response, lifecycle/refund messages and review responses use the saved name.
The local journey asserts the exact name at each principal payment boundary.
Historical records without this snapshot retain their existing fallback.

Review pages share `RentalReviewPage`. The public token entry resolves the saved
review language; German redirects to the guarded German root even with a
conflicting URL hint. Private pages check the guard before database access.
Review invitations use the configured site origin and private German path.
`ReviewForm` no longer changes the document language after hydration. A real
local review token verified the 307 redirect and German 200 document.

The real local database rehearsal now covers 22 cases: the original 14 booking,
payment, invoice and review cases plus custom quote acceptance/payment and paid
transport amendments. Stripe and email are intercepted; other external HTTP is
rejected. Run `scripts/german-journey.local.mjs` with the isolated status file; it
requires API55321 and DB55322 explicitly. Each run uses a separate test rate-limit
namespace while retaining the limits themselves. Local pickup and invoice issuer
records are synthetic, and the locale registry still keeps German private.

This rehearsal exposed and fixed three runtime problems: custom quote titles
were lost in confirmations/invoices, active paid bookings could not pay a
transport amendment, and invoice replay attempted duplicate insertion. Saved
quote display names now reach customer outputs and retries. Transport eligibility
accepts confirmed/paid/active bookings only with a future rental start, in both
API checks and the additive `20260929_active_booking_amendments.sql` migration.
That migration is applied only to the isolated local database. Existing invoices
are reused, including recovery after a concurrent unique-key conflict. The
localization suite passes 42 tests; full mobile/browser coverage remains open.

The isolated German rehearsal now uses API port 55321 and database port 55322,
separate from the active city-pilot stack. All six localization migrations were
applied locally. The approved 128-product source snapshot supplies copy; prices,
stock and category assignments are explicitly synthetic test data. German remains
private in the locale registry. A saved HTTP sweep covers 128 product routes,
eight categories, nine kits and five families: all return 200 with a German root
document, and each product response contains its translated title. This is route
coverage, not proof of full booking behavior or visual quality.

Chrome checks verified cookie rejection, contact navigation and a local contact
submission with no message sent. The confirmation heading now describes a local
test instead of claiming a message was sent. At 390px the German mobile menu
control appears; screenshot capture timed out, so mobile visual QA remains open.

Checkout resolves the saved draft language before expired-draft cleanup. German
drafts return 404 outside the local preview gate before cleanup, writes, or Stripe
access. Tests cover that rejection as well as German checkout return URLs with a
conflicting browser language. New custom quote lines start blank so an English
default cannot silently appear in a German offer; operators supply the wording.

The private German entry page now links to all eight category drafts, the kit
hub, help and contact. The former Coya-only entry has been replaced; that product
remains available through its private product route. `germanInformation` includes
About and all 18 questions from the existing English FAQ. Both are unapproved
drafts with explicit operational review notes. The host-services question directs
readers to contact because a German host-services page is outside this preview.
The private layout links to both new information pages. Category browsing still
requires the complete local fixture; strict translation checks continue to reject
unmatched fallback models rather than silently substituting another product.

German success, cancellation, custom quote and transport amendment pages now
live under `/internal/localization/de/booking/`, using the German root document
and site navigation. Success/cancellation views are shared components; the
success view no longer mutates the document language after hydration. German
cancellation returns to the actual product or custom quote, and checkout URLs
use `transactionPath` to retain the private root. Existing English and Spanish
transaction URLs remain unchanged.

Public quote entry routes redirect saved German records to the private route
only when preview is enabled. Both private token pages check the preview guard
before looking up their records: parent layout guards alone cannot prevent
parallel page data access. German quote routes reject records of other languages.

The localization suite passes 43 tests, including payment return path assertions
and invoice snapshot-name precedence. Invoice PDFs prefer the product name saved
with the document over the current catalogue name, and missing issuer details
use German fallback labels. A synthetic German invoice was rendered and visually
checked; this does not constitute tax or legal approval.
The isolated database rehearsal also covers 22 booking, custom quote and amendment
cases with mocked payment and messaging providers. Broader browser verification
and the completed owner review package remain required.

Product pages share `ProductPageBody` across English, Spanish and German. German
related products and planning links stay inside the private preview. A comparison
of 42 public product pages preserved their headings and links after extraction.

Legacy `/booking/success?locale=de` links redirect to the private German root.
After status resolution, the shared success component uses a document navigation
if the saved booking language belongs to a different German/public root. This
keeps the root language and preview guard authoritative without rewriting html.lang.

## German continuation checkpoint — 2 October 2026

The owner reviewed the package and said to move forward. All 128 product drafts
now contain required fields; three missing texts were completed from evidence.
Read-only current-source reconciliation: 128/128 unchanged, no new/missing products.
Normal catalogue rules are retained: active products with current complete reviewed
published German translations can be browsed; sitemap inclusion additionally follows
existing source SEO eligibility, including legacy exceptions. No extra content_ready
condition is imposed on German browsing. EN/ES behaviour and facts are preserved.

52 localization, 16 market-context and eight market-offer tests pass. Local workflow
rehearsal saved/reviewed all 128 using actual local revisions and a synthetic local
actor, preserving EN/ES and anonymous DE visibility zero. The 22-case mocked journey
passes. Browser document navigation follows saved German even with an English URL
hint; the temporary loopback provider override was restored exactly. No real payment
or message was sent. Screenshot/email-client acceptance remains unverified.

Offline and production translations remain drafts; owner continuation is recorded
separately from revision-bound review. Production installation and private import
are now complete under explicit authorization; see the checkpoint below. German
release/environment/database gates remain closed. Public German URL count is zero.

Current checklist and receipts:
F:/rentanything/agent-work/german-launch-2026-10-02/RELEASE-CHECKLIST.md.

## German private production checkpoint — 2 October 2026

The user explicitly authorized the seven prepared production migrations and private
import by replying “yes proceed”. The earlier automatic approval rejection is
resolved. All seven migrations are installed with matching checksum ledger entries.
All 128 German product translations are saved as private drafts using actual current
production source revisions; the final read-only verification matched every field
against the prepared package. Eight committed batches have exact per-product receipts.

English/Spanish content and anonymous reads, catalogue, prices, markets and bookings
were unchanged across each migration/import transaction. Anonymous reads expose zero
German translations, FAQs, locale rows or market-language rows; all German visibility,
booking and indexing gates remain closed. Workflow execution is restricted to the
service role. No real payment/message, push, deployment or publication occurred.

The save events identify an explicitly documented automated import actor, not a
human reviewer or an impersonated auth account. All production rows remain drafts
with null review fields. Human admin attribution and revision-bound review, approved
release manifest, remaining visual/email acceptance and authorized activation still
remain before launch. The 52-test localization suite and final build passed before
these schema/import operations; no application code changed in this checkpoint.

Current receipts: F:/rentanything/agent-work/german-launch-2026-10-02/private-production-verification.json.
Release checklist: F:/rentanything/agent-work/german-launch-2026-10-02/RELEASE-CHECKLIST.md.

## German release acceptance checkpoint — 2 October 2026

All 128 translated product pages, 33 commercial routes and five route boundaries passed isolated local HTTP checks. The local publication fixture sitemap contained 160 German URLs (32 commercial and 128 products), with correct reciprocal alternates and no unsupported German entries. These are local acceptance results; production German remains hidden.

At 390 × 844, German product navigation, availability, booking-form labels, category, kit and contact pages passed DOM/geometry checks. The long mobility category heading now shrinks/wraps within its hero row. Delivery before a server quote shows “Noch zu berechnen” and “Zwischensumme”; confirmed free delivery/pickup retains its free label. EN/ES receive equivalent pending-price labels. Pricing and booking eligibility are unchanged. No payment form was submitted or message sent. Screenshots and actual email-client rendering remain unverified; the stalled screenshot/upload mechanism remains quarantined.

The temporary release manifest was restored byte-for-byte, local publication/review/indexing gates restored, viewport reset and preview closed. The final 52-test localization suite, focused presentation lint and npx next build passed with closed release gates and placeholder local services. Fresh read-only production verification confirms seven migration receipts and 128 exact, complete, current private drafts, null review fields and zero anonymous German rows. English/Spanish and business data remain unchanged.

Automatic approval review rejected marking production drafts as reviewed because “continue” did not explicitly authorize production approval-status changes or an automated recorder of human approval. No review statuses changed. The concrete proposed action is eight workflow review batches of 16 against the exact current source/translation revisions, documenting an automated recorder without impersonating a human auth account. It keeps all visibility, booking, indexing and deployment gates closed. Explicit authorization remains required before that action.

Exact candidate: F:/rentanything/agent-work/german-launch-2026-10-02/release-candidate.json. Current checklist: F:/rentanything/agent-work/german-launch-2026-10-02/RELEASE-CHECKLIST.md.

## Authorized German launch — 2 October 2026

The owner explicitly requested updating the site to support German after the exact release candidate and delegated approval-recording action were presented. All 128 current translations are now revision-bound reviewed through the workflow. The documented automated recorder 0aa81312-9694-42b3-a3e4-81381c519b1f records that chat approval; no human auth account was created or impersonated. All seven migration checksums, 128 review events and translation contents were verified read-only. English/Spanish and business data remain unchanged; anonymous German records and open gates remain zero.

The release manifest now binds owner approval at 2026-10-02T19:03:59.972Z to source SHA256 56dc2923e0e647feb34aab169e1ddb505feaa064bc96d0707a0749d02c839bc3. Draft SHA256: 4d7b37d56e24fda3e635ee23d93f73414d092d12b45180b6dada2db09ffae45a. Environment and database gates still determine publication. The latest four production operations commits are integrated, with snapshot-aware product-name conflicts resolved to preserve German booking labels, custom quotes, driver dispatch and asset-accounting filters. Production activation awaits Vercel project access and the final merged-release checks. Screenshots and actual email-client rendering remain unverified; known unreliable mechanisms stay quarantined. Exact authorization/reviews: F:/rentanything/agent-work/german-launch-2026-10-02/launch-authorization.json and production-reviewed-verification.json.

## German release configuration — 3 October 2026

The owner reaffirmed launch authorization. vercel.json now uses the documented buildCommand override to run NEXT_PUBLIC_GERMAN_ENABLED=true npm run build through the existing Git deployment. This is a non-secret public release flag, compiled into Next.js bundles. No dashboard credentials or access-control changes are needed. The approved source manifest and database locale/market/revision guards remain required. Runtime secrets, cron configuration and EN/ES settings are preserved. Close the database visibility/booking/indexing gates for immediate withdrawal; changing a NEXT_PUBLIC flag requires a rebuild.

Primary reference: https://vercel.com/docs/project-configuration/vercel-json. The official https://openapi.vercel.sh/vercel.json schema was saved in F:/rentanything/agent-work/german-launch-2026-10-02/vercel-configuration-schema.json. It confirms buildCommand is supported. The deprecated env/build.env properties were not introduced. This resolves the prior dashboard-login blocker through the already authorized Git release pipeline.

The 3 October source check found karaoke-kit at source revision 3 and portable-table-tennis-set at revision 2; their DE revision-1 copies are stale. Launch publishes only the other 126 current reviewed translations. Both stale versions stay excluded from German browsing and indexing until their changed facts are reconciled. Exact drift and rollout plan: F:/rentanything/agent-work/german-launch-2026-10-03/current-revision-drift.json and launch-plan.json.
