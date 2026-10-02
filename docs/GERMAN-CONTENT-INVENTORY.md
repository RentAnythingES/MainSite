# German content inventory and review conventions

Status: 2026-09-29, private implementation branch. Owner language/factual review pending.

## Voice and glossary

Use lowercase du, dir and dein. Be friendly, clear and reassuring; lead with
convenience and trust. Preserve brand/model names and every factual limit. Do not
invent delivery promises, included accessories, compatibility or safety claims.

| Context | German wording |
| --- | --- |
| Browse the catalogue | Alles zum Mieten |
| Generic catalogue items | Mietartikel or Produkte, according to the sentence |
| Mobility scooter | Elektromobil |
| Included items | Im Mietumfang enthalten |
| Restrictions and suitability heading | Gut zu wissen |
| Delivery and setup heading | Lieferung und Aufbau |
| Care heading | Pflege und Hygiene |

The first three terminology choices reflect owner agreement. The section headings
are draft copy awaiting review. Ausstattung may describe category-specific contents;
do not use it as the umbrella term for every rental product. Keep prices numeric,
format currency/dates by locale, and retain the city's operational timezone.

## Coverage by surface

| Surface | Current implementation | Remaining requirement |
| --- | --- | --- |
| UI dictionary | Typed German draft, private registry and German shell | Owner review; public launch remains separate |
| Booking journey | Full private catalogue, shared widget and return views;22-case local rehearsal with mocked providers | Complete browser acceptance and owner review |
| Transaction output | Stored locale in confirmation/lifecycle/document emails, invoice/refund PDFs, review invitation/form | Owner review; free-form instructions and custom terms |
| Product authoring | Language registry editor, atomic copy/FAQ save, revisions, attributed review, stale detection, preview; 128/128 offline German drafts | Consolidated review, local integration and source-revision reconciliation |
| Product editorial cards | Shared EN/ES/DE body and German planning/related links | Owner review and remaining browser checks |
| Product/category/family/bundle pages | Shared templates and strict German copy;150private routes pass HTTP checks | Complete visual/interactivity acceptance |
| Navigation, cookie/legal/help pages | Private German rendering and draft content implemented | Owner/legal review; mobile visual verification |
| Contact/signup, custom quotes, paid amendments | Localized entry/messages and saved-language checks; local contact/signup browser successes | Quote/amendment browser-state checks and owner review |
| Explore/editorial clusters | Existing public content | City/language content ownership, reviewed copy and internal links |
| Public German SEO | Private by design | Server document language, canonicals, alternates, sitemap and publication checks |

## Product review packet

For each active product, collect English display name, source description, editorial
sections, feature list, specifications, FAQs, primary image description, search title
and description, and source revision. Keep a clear missing-source list. Translate
only supported facts and retain units, model variants, size/weight limits and warnings.
Review every source feature/specification against the German draft. The editor's
structural checks cannot establish factual completeness.

Save drafts, have the owner review language and facts, then record that review on
the exact saved revision. Any later copy/source change requires another review.
Publication remains a separate gated action. Review does not enable German globally.

## Catalogue evidence boundary

The initial export was rejected. A separately authorized retry completed on
28 September 2026 at 15:41:31 UTC and saved the 128-product source snapshot in
`F:/rentanything/agent-work/expansion-readiness-2026-09-27/goalpro/german-catalogue-source-snapshot.json`.
The receipt records SHA256
`56dc2923e0e647feb34aab169e1ddb505feaa064bc96d0707a0749d02c839bc3`.
No customer records were exported. Do not repeat this export for the current goal.

All 128 products now have private, unreviewed offline German drafts, assembled
from batches 001–045 into `german-catalogue-drafts.json` in that same directory.
`german-drafting-progress.json` records structural checks and three source blanks:
acupressure mat delivery/setup, air purifier image description, and EZVIZ baby
monitor care. Baby bed rail and video baby monitor retain their empty source
feature/specification lists. Individual review notes record conflicting limits,
unknown models, uncertain included accessories and unsupported claims requiring
resolution before publication.

Snapshot source revisions are null because the production workflow migration was
not applied. Any later import must compare the saved source hash with current
source facts and bind to the actual current revision; never invent revision parity.
No draft has been imported, reviewed, published or deployed as part of drafting.

The fixture audit tests report logic only. Do not substitute its counts for live
coverage, or interpret completed engineering tests as owner copy approval.

### Family drafts and catalogue review artifact — 29 September

Five private family drafts now cover Elektromobile, strollers, car seats, travel
cots/cribs and wheelchairs through the shared family template. They preserve the
source counts of choice guidance, checklists, local paragraphs and FAQs. Model
names come from the translated product instead of a second list of model claims.
Their editorial links target private category/help/contact pages and the baby or
mobility kit routes. HTTP checks pass and all five family fixture selections are
populated without missing canonical slugs; visual acceptance remains incomplete.

`german-catalogue-owner-review.html` in the saved snapshot directory presents all
128 product drafts beside their source, including every review note and all 13
translation fields. The receipt records 118 products with notes or source gaps;
this is not a count of rejected products or approvals. Five records retain empty
fields/lists. Generation checks passed; browser visual verification is pending
because the browser tool refused the local-file URL. No review status is changed
by opening or filtering this artifact.

### Kit drafts and routes — 29 September

All nine canonical kits have unapproved German drafts in `src/data/bundles-de.ts`.
Names, descriptions, item notes, add-on notes, best-for lists, FAQs and metadata
are translated. Shared `BundleHub` and `BundleLandingPage` serve EN/ES/DE; private
German hub/detail routes and navigation links are implemented. Counts and stable
request mappings are checked in `bundle-localization.test.mjs`.

`germanKitReviewNotes` records each kit's factual/operational questions, including
conditional delivery before arrival, bike/trailer fit, optional items shown among
included items, kitchen availability and legacy product references (`monitor-27`,
`car-seat-infant`). These notes appear only in the private review route. Full kit
browser verification remains incomplete because date/email input behavior under
automation is unresolved. The migration is applied in the isolated local database;
API checks verify saved German consent and selections without messages. Draft
coverage is not release approval.

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
