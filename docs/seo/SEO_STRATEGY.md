# Rent&Roll — SEO Strategy & Audit
> **Last updated**: 2026-10-03 · **Canonical migration**: deployed · **Live sitemap URLs**: 615

This is the **living SEO strategy document** for rentandroll.com. Updated after every SEO-related change. For prioritized fixes, see [SEO_ROADMAP.md](./SEO_ROADMAP.md).

## Public brand cleanup — 27 September 2026

Removed the former brand from organization/website alternate names, admin headings,
cookie-policy storage labels, download filenames, and current database catalogue
copy. Product cache keys have a new version so deployment does not reuse the old
descriptions. Legacy browser storage remains readable to preserve customer choices
and active checkouts. Retired social links are omitted pending confirmed current
profile URLs. The public brand audit scans every sitemap page plus admin login,
including HTML metadata, and saves results to `public-brand-audit.json`.

---

## Occasions & Events release — 12 September 2026

Published 13 sourceable products (26 EN/ES product URLs) and the bilingual existing-architecture category hub (2 URLs). All use standard daily rates and request-for-dates for unconfirmed supply. Supplier product photos retained on owner approval. See [release details](./EVENTS_CATALOGUE_LAUNCH_20260912.md). Hosted experiences remain future work.

## Quick Reference

Agent network release (28 September 2026): added two public recruitment routes,
`/agent-network` and `/es/agent-network`, with canonical/hreflang metadata and links
from both homepages and the footer. Current sitemap verification returns 410 URLs.
Agent workspace and customer conversation pages are noindex and excluded from the
sitemap; private conversations also use no-referrer and skip analytics.

| Document | Purpose |
|----------|---------|
| **This file** (`SEO_STRATEGY.md`) | Current site state, metrics, cluster health |
| [CORE_KEYWORD_OWNERSHIP.md](./CORE_KEYWORD_OWNERSHIP.md) | Preferred generic owners, supporting product roles and anti-cannibalization rules |
| [SEO_ROADMAP.md](./SEO_ROADMAP.md) | Prioritized action items and fixes |
| [COMPETITOR_REFERENCE.md](./COMPETITOR_REFERENCE.md) | Crawl-verified competitor data |
| [BLOG_CONTENT_STRATEGY.md](./BLOG_CONTENT_STRATEGY.md) | Blog quality standards and content pipeline |

---

## Current Portfolio Baseline — 11 August 2026

`https://rentandroll.com` is the deployed canonical origin. The 11 August 2026
production crawl covers all 370 pre-release sitemap URLs with zero page errors, warnings,
orphans, broken links or broken images. Every sitemap page is within three clicks
of the homepage and 183 EN/ES hreflang pairs validate. Six Spanish product owners
were restored, and governed bilingual product-family owners are live for mobility
scooters, wheelchairs, strollers, car seats and travel cots/cribs. The current
release activates the bilingual Kids & Family category with 20 reviewed secondary
memberships.
Search Console
and Keyword Planner research are complete; GA remains a separate user-owned
analytics task. See
[TECHNICAL_SEO_AUDIT_20260811.md](./TECHNICAL_SEO_AUDIT_20260811.md).

The current release build adds the two bilingual Kids & Family category URLs and
produces a 376-URL sitemap. The full rendered regression must pass against the live
catalogue before and after the batched deployment.

| Layer | English | Spanish | Current role |
|-------|---------|---------|--------------|
| Commercial category hubs | 7 | 7 | Broad transactional owners, including the reviewed Kids & Family discovery collection |
| Product-family owners | 5 | 5 | Narrow transactional owners for mobility scooters, wheelchairs, strollers, car seats and travel cots/cribs |
| Indexable product pages | 114 | 114 | Exact-item and model demand with EN/ES eligibility parity |
| Blog articles | 8 | 8 | Planning, comparison, seasonal and tutorial intent |
| Discover sub-hubs | 5 | 5 | Beaches, neighbourhoods, attractions, day trips and events |
| Discover guides | 26 | 26 | Valencia destination and situational planning |
| Kit detail pages | 8 | 8 | Multi-item use cases and bundle discovery |

Older counts farther down this document are historical milestones. Use the current
database readiness audit, generated sitemap, and regression suite as the release
inventory authorities.

Discover category widgets are bounded previews rather than full catalogue dumps.
The 24 July performance pass reduced the Malvarrosa guide artifact from 181,413
to 122,143 bytes while retaining product previews and a labelled route to the
complete category. See
[DISCOVER_PERFORMANCE_AUDIT_20260724.md](./DISCOVER_PERFORMANCE_AUDIT_20260724.md).

FAQ coverage is an informational quality measure, not a universal publication or
indexability gate. Add product FAQs only where they answer a genuine customer
decision and emit FAQ structured data only for visible answers.

Kids & Family contains 20 reviewed secondary memberships. Its EN/ES routes are
indexable and appear in the sitemap, primary navigation, homepage and Valencia hub.
Every product retains its original primary category, product URL and canonical.

Each product has one primary category owner and may have governed secondary
discovery memberships. Secondary placement exposes the same product in another
useful category grid; it does not create another product URL, canonical, inventory
record, or keyword owner.

### First post-migration performance baseline — 7 September 2026

The [SEO growth audit](./SEO_GROWTH_AUDIT_20260907.md) establishes the first useful
`rentandroll.com` Search Console baseline: 199 clicks, 10,618 impressions, 1.9%
CTR and average position 13.6 from 7 August through 5 September. The preceding
period is not a valid comparison because it predates the canonical migration and
property maturation.

The mobility owner map remains unchanged: `/rental/mobility` owns broad equipment
intent; the scooter and wheelchair family pages own type selection; exact products
own their modifiers. Source changes in the September mobility sprint strengthen
that map without adding URLs: the unrelated trailer membership is removed, the
electric-wheelchair product promise is clarified while safety facts remain intact,
and focused family links are added from the accessibility guide and kit.

The fixed blog cadence is superseded by an evidence gate. Existing first-page
pages with weak CTR are refreshed selectively; a new article requires a repeated,
distinct informational job and a non-cannibalizing owner. No new mobility blog is
approved from this baseline.

### Commercial cluster depth

| Cluster | EN / ES indexable products | Main supporting layers | Expansion posture |
|---------|----------------------------|------------------------|-------------------|
| Beach & Outdoor | 49 / 49 | Category, Family Beach kit, beach/summer blogs, 4 beach guides | Strongest cluster; the category visibly merchandises every active member as a full card |
| Baby & Toddler | 33 / 33 | Category, stroller, car-seat and cot/crib family owners, Baby Arrival and Toddler City kits, family/baby articles | Governed families own unmodified selection intent; products retain exact-item intent |
| Mobility & Accessibility | 6 / 6 | Category, mobility-scooter and wheelchair family owners, 2 accessibility kits, accessibility guide, local guides | Family owners handle generic type-selection intent; exact products retain their modifiers |
| Remote Work | 6 / 6 | Category, Remote Work kit, nomad guide, home-office tutorial | Deepen exact workstation and temporary-stay decisions |
| Apartment Comfort | 8 / 8 | Category, Summer and Long-Stay kits, cooling guide | Deepen only from measured long-stay demand |
| Kids & Family | 20 / 20 | Category, Toddler City and Family Beach kits, family guide and exact products | Active reviewed discovery collection; expand only through explicit product-fit review |
| Sports & Wellness | 15 / 15 | Category, Turia Gardens guide and product pathways | Includes three secondary bike-carrier discovery listings; expand only with approved inventory and distinct demand |

### Ownership sanity review — 11 August 2026

This review compares each commercial owner with the live governed memberships,
not merely with an earlier keyword recommendation. A category owner must describe
the complete shop surface it controls; a strong secondary query cannot replace the
category identity in the visible H1.

| Owner | Live scope | Status |
|-------|------------|--------|
| Baby & Toddler | 33 products; stroller, car-seat and cot/crib families have separate narrow owners | Aligned: broad category owns the full baby-equipment shop; family pages own selection intent and follow the complete category catalogue |
| Kids & Family | 20 reviewed secondary products | Aligned: active broad owner with a useful collection; primary product categories and canonicals remain unchanged |
| Mobility & Accessibility | 6 products; scooters and wheelchairs have separate family owners | Aligned: broad category retains general mobility intent; family owners handle type selection and exact products retain their modifiers |
| Remote Work | 6 products | Aligned: the broad workstation owner matches monitors, desk and chair inventory |
| Apartment Comfort | 8 products spanning cooling, air quality, cleaning and practical home equipment | Visible H1, breadcrumb, schema name and intro corrected to the broad category. AC-only metadata remains an explicit review item because it conflicts with the approved broad owner |
| Beach & Outdoor | 49 products spanning beach, camping, water, transport and outdoor equipment | Needs review: the current beach-only H1 and metadata are narrower than the catalogue. Do not change them without an approved ownership decision |
| Sports & Wellness | 15 products spanning sport, fitness and recovery, plus three secondary bike-carrier memberships | Aligned: metadata and visible guidance cover the broad category; stale tennis/padel and ball-machine emphasis has been replaced with practical activity, space, transport and venue decisions |

The five published family owners—mobility scooters, wheelchairs, strollers, car seats
and travel cots/cribs—show
their complete governed product sets before guidance and do not replace or hide the
parent category catalogue. Product pages remain the sole exact-item/model owners;
secondary category membership does not create duplicate product URLs.

Category grids use explicit, evidence-backed leading sequences with a stable
alphabetical fallback. This merchandising affects shopping order only: it does not
hide products or alter keyword ownership. The supporting sales audit and current
sequences are recorded in
[CATEGORY_MERCHANDISING_AUDIT_20260811.md](./CATEGORY_MERCHANDISING_AUDIT_20260811.md).

---

## Strategic Direction

The SEO system should support the brand promise: **Travel light. Rent what you need.**

Rent&Roll should not behave like a generic rental catalogue. The core funnel should become:

`Valencia guide section -> practical friction point -> relevant kit/bundle -> configurable add-ons -> availability / WhatsApp support -> individual products as needed`

This means the next SEO layer is not simply more product pages. It is a data-driven kit/bundle architecture, clearer customer-facing categories, and contextual guide CTAs.

Product pages now have a dedicated publication framework in
[PRODUCT_CONTENT_STRATEGY.md](./PRODUCT_CONTENT_STRATEGY.md). They capture
bottom-funnel item demand only after verified facts, operational readiness,
metadata, local links, and locale content are complete; they do not replace the
guide and kit layers.

### Product Content Review Pipeline

Imported products remain inactive by default. Editorial enrichment is completed
in small, source-backed batches and recorded in
`PRODUCT_CONTENT_BATCH_01.md`, `PRODUCT_CONTENT_BATCH_02.md`,
`PRODUCT_CONTENT_BATCH_03.md`, `PRODUCT_CONTENT_BATCH_04.md`, and
`PRODUCT_CONTENT_BATCH_05.md`, `PRODUCT_CONTENT_BATCH_06.md`, and
`PRODUCT_CONTENT_BATCH_07.md`, `PRODUCT_CONTENT_BATCH_08.md`, and
`PRODUCT_CONTENT_BATCH_09.md` through `PRODUCT_CONTENT_BATCH_20.md`. A product may progress to `facts_verified` when
its model facts, English SEO copy, and FAQs are source-checked, but it cannot be
published until physical stock, approved pricing, image-use status, and the full
`content_ready` checklist are complete.

Priority structural changes:

- Split `Baby & Children` into `Baby & Toddler` and `Kids & Family`
- Introduce kit pages for Family Beach, Baby Arrival, Toddler City, Remote Work, Summer Apartment, Accessible Valencia, Grandparents Visiting, and Long-Stay Kitchen
- Rename display categories toward customer intent: `Mobility & Accessibility`, `Apartment Comfort`, `Beach & Outdoor`, `Pregnancy & Postpartum`
- Keep URLs stable until redirects/canonicals are planned; display names can change first
- Build partner/brand surfaces later as measurable kit pilots, not generic sponsorship banners

## Site Architecture

```
rentandroll.com/
├── /                               Homepage (photo carousel hero, photo categories)
│
├── /product/                       Product pages (37 EN + 37 ES indexable)
│   └── /product/[slug]             Individual product + BookingWidget
│
├── /rental/                        Category pages (6 categories per locale)
│   ├── /rental/baby-gear
│   ├── /rental/mobility
│   ├── /rental/remote-work
│   ├── /rental/home-living
│   ├── /rental/travel-outdoors
│   ├── /rental/kids-family
│   └── /rental/[category]/[family] Governed family owners (scooters, wheelchairs, strollers, car seats, cots/cribs)
│
├── /blog/                          Blog hub (8 posts live per locale)
│   └── /blog/[slug]                Individual posts (Article + FAQ JSON-LD)
│
├── /discover/                      Discover hub (photo-backed)
│   ├── /discover/neighbourhoods    Hub: neighbourhood guides
│   ├── /discover/day-trips         Hub: day trip guides
│   ├── /discover/attractions       Hub: attraction guides
│   ├── /discover/events            Hub: event guides
│   └── /discover/[slug]            Individual destination guides (14 live)
│
├── /valencia                       Valencia landing page (photo hero)
├── /valencia/kits                  Kit/bundle hub
│   └── /valencia/kits/[slug]       Individual kit pages (8 live)
├── /about                          About page
├── /contact                        Contact form (Resend-powered)
│
├── /privacy                        Legal
├── /terms                          Legal
├── /refunds                        Legal
├── /cookies                        Legal
│
├── /sitemap.xml                    Dynamic sitemap
└── /robots.txt                     Robots
```

### API Routes (not indexed)
```
Public:
  /api/bookings       POST — Create booking + block dates
  /api/contact        POST — Send contact email via Resend
  /api/availability   GET  — Check product availability for date range

Admin (Supabase Auth protected):
  /api/admin/login        POST     — Authenticate, set httpOnly cookies
  /api/admin/logout       POST     — Clear auth cookies
  /api/admin/products     GET/POST — List / create products
  /api/admin/products/[id] PUT/DEL — Update / deactivate product
  /api/admin/bookings     GET      — List bookings (optional status filter)
  /api/admin/bookings/[id] PUT     — Update booking status
  /api/admin/categories   GET      — List categories (for dropdowns)

Admin Dashboard:
  /admin                  Dashboard overview (stats, quick actions)
  /admin/login            Supabase Auth email/password login
  /admin/products         Product table (edit, toggle, pricing tiers)
  /admin/products/new     Add new product form
  /admin/bookings         Booking list with lifecycle management
```

---

## Cluster Health

### 🛒 Products (37 EN / 37 ES indexable pages) — 🟠 Editorial queue active
- Live database baseline: 178 total products, 37 active, 37 indexable in English and 37 in Spanish
- Each page has: name, brand, description, features, specs, pricing tiers
- BookingWidget with date picker, tiered pricing calculator, WhatsApp deep-link
- JSON-LD Product structured data
- Internal links to category page + related products

### 📂 Categories (6 pages per locale) — ✅ Complete
- Rendered from product data, grouped by category
- Each page: category description, product grid, internal links

### 📝 Blog (8 posts live per locale) — ✅ Initial library complete
- Data-driven architecture (`src/content/blog.ts`)
- 8 planning posts live in English and Spanish with Article JSON-LD + FAQ schema
- Cross-linked to products, categories, and discover pages

### 📦 Kits & Bundles (9 pages including hub) — ✅ Initial Layer Live
- Data-driven architecture (`src/data/bundles.ts`)
- Hub page at `/valencia/kits`
- 8 individual kit pages with related products, guides, add-ons, FAQ, and Product JSON-LD
- Current handoff is WhatsApp while configurable bundle checkout remains future work

### 📍 Valencia Landing (1 page) — ✅ Live
- Local SEO landing page
- Valencia-specific content, neighbourhood mentions

### 📄 Legal (4 pages per locale) — ✅ Complete
- Privacy, Terms, Refunds and Cookies in English and Spanish

---

## Technical SEO Checklist

| Item | Status | Notes |
|------|--------|-------|
| Sitemap | ✅ Dynamic | `src/app/sitemap.ts` — all products + categories |
| Title tags | ✅ All ≤60 | Using `| Rent&Roll` suffix |
| Canonical tags | ✅ | Set in `generateMetadata()` |
| JSON-LD (Product) | ✅ | Product pages have structured data |
| JSON-LD (Article) | ✅ | Blog posts have Article + FAQ JSON-LD |
| Open Graph / Twitter | ✅ | Title, description, image on all pages |
| Robots.txt | ✅ | Standard allow-all with sitemap reference |
| Google Search Console | 🔲 | Needs verification + sitemap submission |
| Internal linking | ✅ | Products ↔ blog ↔ categories ↔ discover all cross-linked |
| i18n / hreflang | 🔲 | Planned (EN + ES) — not yet implemented |
| Blog | ✅ | 8 bilingual posts live with Article + FAQ JSON-LD |
| Discover guides | ✅ | 5 destination guides live with photo heroes + product widgets |

---

## Keyword Coverage

### Tier 1 — Direct Booking Intent (highest value)

| Keyword (EN) | Keyword (ES) | Target Page | Competition |
|-------------|-------------|-------------|-------------|
| stroller rental Valencia | alquiler cochecito Valencia | `/rental/baby-gear/strollers` + `/es/rental/baby-gear/strollers` | Medium |
| wheelchair rental Valencia | alquiler silla de ruedas Valencia | `/rental/mobility` | Medium |
| mobility scooter hire Valencia | alquiler scooter movilidad Valencia | `/rental/mobility/mobility-scooters` + `/es/rental/mobility/mobility-scooters` | Medium |
| baby equipment rental Valencia | alquiler material bebé Valencia | `/rental/baby-gear` | Medium |
| car seat rental Valencia | alquiler silla coche Valencia | `/rental/baby-gear/car-seats` + `/es/rental/baby-gear/car-seats` | Low |
| travel crib rental Valencia | alquiler cuna viaje Valencia | `/product/travel-crib` | Low |

### Tier 2 — Zero Competition (blue ocean)

| Keyword (EN) | Keyword (ES) | Target Page | Competition |
|-------------|-------------|-------------|-------------|
| monitor rental Valencia | alquiler monitor Valencia | `/rental/remote-work` | **None** |
| standing desk rental Valencia | alquiler escritorio Valencia | `/rental/remote-work` | **None** |
| portable AC rental Valencia | alquiler aire acondicionado portátil Valencia | `/rental/home-living` | **None** |
| air purifier rental Valencia | alquiler purificador aire Valencia | `/rental/home-living` | **None** |
| beach gear rental delivery Valencia | alquiler material playa Valencia | `/rental/travel-outdoors` | **None** |

### Tier 3 — Informational / Blog Content

| Keyword (EN) | Target | Content Type |
|-------------|--------|-------------|
| Valencia with kids | Blog post | Family travel guide |
| wheelchair accessible Valencia | Blog post | Accessibility guide |
| digital nomad Valencia | Blog post | Remote work guide |
| things to rent on holiday | Blog post | General rental guide |
| Valencia summer tips | Blog post | Seasonal content |

---

## Competitor Gap Analysis

| Metric | Rent&Roll | Babonbo | Amigo 24 | Motion4rent |
|--------|-------------|---------|----------|-------------|
| Categories covered | 5 (all-in-one) | 1 (baby) | 1 (mobility) | 1 (mobility) |
| Total product pages | 16 | ~20 (Valencia) | ~10 | ~8 |
| Blog posts | 0 (4 planned) | 0 | Yes (thin) | 0 |
| Languages | EN (ES planned) | EN, ES, DE, FR+ | EN, ES | EN, ES |
| Online booking | ✅ Instant | ✅ Via platform | ❌ Phone/form | ❌ Form |
| Modern UX | ✅ | ✅ | ❌ | ⚠️ |
| Valencia-specific content | ✅ | ⚠️ Generic | ⚠️ | ✅ |
| Remote work equipment | ✅ | ❌ | ❌ | ❌ |
| Home/AC equipment | ✅ | ❌ | ❌ | ❌ |

**Key advantage**: We are the ONLY platform covering all 5 verticals with modern UX and English-first content. Remote work and home/AC categories have zero competition.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-09-07 | Prepared the mobility conversion sprint without changing page count: fixed empty-date and daylight-saving duration defects in the booking widget; removed the stroller/bike trailer's unrelated secondary mobility membership; clarified exact electric-wheelchair intent while preserving verified detail and constraint copy; linked the accessibility guide and kit to the scooter and wheelchair family owners; and added an admin-only mobility enquiry register with source, date, location, outcome and loss-reason fields. Both guarded production migrations were applied and verified; source deployment and post-deploy indexing verification remain release steps. |
| 2026-08-12 | Corrected two catalogue identities without changing page count: the 32-inch monitor moved from the incorrect `27-inch-monitor-hdmi-cable` slug to `32-inch-monitor-hdmi-cable` with permanent EN/ES redirects, the separate 27-inch monitor specification now matches its headline, and the 25–40 kg swimming-vest record is consistent across EN/ES copy, metadata, specifications and FAQs. |
| 2026-08-12 | Verified rendered image delivery across all 114 active products and all 228 EN/ES product pages, with zero failures, and added a permanent full-catalogue image audit. Repaired six fact-complete baby/family product pages in both languages, added three FAQs per locale, and prevented static English FAQs from leaking onto Spanish product pages. Identity, URLs, pricing, stock, images, categories and both AC listings remain unchanged. See `ACTIVE_PRODUCT_PAGE_AUDIT_20260812.md`. |
| 2026-08-11 | Corrected product-to-owner link context across all five current family clusters: the shared EN/ES product component now uses each matched family’s existing heading and description instead of hard-coded scooter copy. Added regression assertions for all family owners. Repaired the fact-complete Beachminton and family-kayak EN/ES product copy without changing identity, stock, pricing, imagery, category membership or indexation. See `PRIORITY_PRODUCT_PAGE_AUDIT_20260811.md`. |
| 2026-08-11 | Corrected the visible EN/ES Apartment Comfort category scope: H1, breadcrumb, CollectionPage name and intro now represent the complete catalogue rather than presenting the category as a portable-AC-only page. Preserved existing metadata ownership for separate review and added exact bilingual H1 regression across all category routes. |
| 2026-08-11 | Retired the invalid category-card cap and forced subgroup layout: EN/ES category owners now show every active member as a full product card in one continuous grid, with optional comparison owners following rather than displacing merchandise. Added rendered regression coverage for full-card parity and flat-grid preservation. |
| 2026-08-11 | Corrected the car-seat catalogue while retaining the existing family owner: four false product identities are replaced with the confirmed named seats, and three interchangeable generic backless boosters remain one model-neutral product with capacity three. The transactional preview, build and rendered EN/ES regression passed. |
| 2026-08-11 | Prepared governed EN/ES car-seat family owner with three verified choices; contradictory infant and unidentified booster records remain excluded pending physical catalogue verification |
| 2026-06-18 | Homepage: photo carousel hero, photo-backed category cards |
| 2026-06-18 | Valencia page: photo hero + photo category cards |
| 2026-06-18 | Discover hub: photo hero + photo-backed hub cards |
| 2026-06-18 | Discover guides: compact category-based product widget strips |
| 2026-06-18 | Fixed heading color override in globals.css (was blocking text-white) |
| 2026-06-18 | Two-layer photo overlay pattern established (bg-black/50 + gradient) |
| 2026-06-17 | Initial SEO strategy document created |
| 2026-06-17 | Competitor research completed — see COMPETITOR_REFERENCE.md |
| 2026-06-17 | Keyword map established (Tier 1-3) |
| 2026-06-17 | Supabase backend deployed (schema + seed + API routes) |
| 2026-06-17 | Contact form backend (Resend) deployed |
## Spanish kit cluster parity — 21 July 2026

The existing eight scenario-led Valencia kit pages now have complete Spanish
counterparts under `/es/valencia/kits`. This adds one localized commercial hub and
eight localized long-tail landing pages without creating new keyword owners or
changing bundle inventory. English and Spanish pages use reciprocal hreflang and
localized internal links; both sets remain subordinate to their category and guide
clusters. The Spanish configurator displays translated item names while submitting
canonical bundle identifiers to the shared request and availability APIs.


### 2026-09-08 — Turia & Beach Explorer kit

Added one kit to the existing data-driven catalogue (8 → 9 kits per language; two new EN/ES detail URLs). The kit indexes and sitemap inherit it from the canonical bundle lists. `/valencia/kits/turia-beach-explorer` and its `/es` counterpart own this specific family bike + trailer + beach shade package; related family/beach guides retain their existing ownership. Request-led, with no instant-stock Offer or unapproved discount claim. Original generated illustration is labelled as an illustration. No product activation. See `docs/releases/TURIA_BEACH_EXPLORER_2026-09-08.md` for validation and operational handoff.

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


## German production launch — 3 October 2026

German is live at https://rentandroll.com/de. PR #28 was merged and Vercel production commit 8418a2bef9dab8958ada3722efb6b0e499070e68 completed successfully. The repository build command includes the approved public German flag. The global German locale and Valencia German visibility, booking and indexing gates are open; other German markets remain closed.

Published 126 exact, current, owner-approved translations through eight verified workflow batches. The karaoke-kit and portable-table-tennis-set German copies remain stale and excluded because source details changed. EN/ES translation content, prices, inventory and bookings were preserved.

Production HTTP acceptance passed for all 126 products, 33 commercial pages and seven route boundaries. German availability returned the same stock and price as English; the live browser showed the German availability success and customer-details form. No booking, payment or message was submitted. The sitemap has 568 URLs, including 158 German URLs (126 products + 32 commercial), with reciprocal hreflang and no unsupported German entries. German newsletter is public but noindex. Final live root/product robots allow indexing.

Remaining work: reconcile and review the two stale products; translate operator-authored pickup/delivery names and instructions, which retain existing English text; verify screenshots and actual email-client rendering when dependable capture is available. Known stalled screenshot/upload mechanisms remain quarantined. Receipts: F:/rentanything/agent-work/german-launch-2026-10-03/LIVE-RECEIPT.json, production-acceptance.json, production-runtime.json and production-sitemap.json.


## German parity repair — local work only, 3 October 2026

Production still has 568 sitemap URLs (205 English, 205 Spanish, 158 German). The complete 205-page English reference inventory is the German parity target. Eight article translations and seven destination translations now use original layouts locally; six destination render comparisons pass and Ruzafa verification remains incomplete. The original Discover index/map and neighbourhood hub have shared locale renderers; their German registration awaits complete guide membership. Completed-route registration is being expanded incrementally. These are not new live page counts. [Repair status](GERMAN_PARITY_REPAIR_STATUS.md) records remaining guides/hubs, catalogue corrections, verification and release work. German search-term ownership and localized SEO review follow phase-one completion.


German parity local checkpoint (2026-10-03T19:28:06.563Z): all eight articles and fifteen destination guides have full source-shaped translations; eleven destination render comparisons pass. Complete neighbourhood hub registered behind full original membership, awaiting rendering verification. Four other hubs and eleven guide translations remain. Ten verified City of Arts source fields corrected consistently before German translation. Production counts remain unchanged; no release or German SEO audit completion claimed.


German parity local checkpoint (2026-10-03T19:45:49.176Z): sixteen complete source-shaped destination translations and three original shared hubs pass EN/DE render checks. Fresh production build and 12 release contracts pass. Ten guides and beaches/day-trips hubs remain, followed by whole-site/customer/product validation and live release. Production sitemap counts remain unchanged. German SEO phase not started.


German parity local checkpoint (2026-10-03T19:51:27.384Z): eighteen full destination translations now pass EN/DE structure/media/link checks, including Buñol and Cullera. Fresh production build passes. Eight guide translations and actual beaches/day-trips hubs remain. No production counts or SEO-phase completion changed.


German final local checkpoint (2026-10-03, 21:50 UTC): all 205 original public German equivalents pass structure/classes/images/lang comparison; all 128 catalogue translations are current and approved, thirteen exact copy corrections committed and independently verified. All 60 localization tests pass. Homepage four-width geometry passed; further headless initialization failed twice and is quarantined. Fresh source-cache namespace and German legacy redirects added. Code deployment and the subsequent German SEO audit are still pending. Local sitemap remains intentionally excluded unless VERCEL_ENV=production; the final local rehearsal now explicitly uses production indexing identity with outbound messages/payments disabled.


## Release-ready checkpoint — 2026-10-03T22:07:58.215Z

Required final production build passes (2026-10-03T22:05:47.400Z). All 205 original public equivalence comparisons pass on the earlier body-equivalent build (2026-10-03T21:39:54.695Z); subsequent changes concern redirects, 404 routing and indexing rehearsal, not those page bodies. Final actual response checks pass: six representative legacy redirects, German booking success/cancel/unsubscribe privacy metadata, four malformed private-token 404s and unknown public German URL with full German document. Production indexing rehearsal: 615 unique sitemap URLs, all 205 German equivalents included. All 60 localization tests, four routing regressions and four conversation-access fixtures pass. Changed-source lint passes. Browser CLI fallback failed to produce a loaded DOM and remains unverified/quarantined; the earlier four-width homepage geometry receipt is the only browser acceptance. Thirteen committed catalogue corrections independently verified, all 128 current German products approved. Code is ready for the authorized repair deployment; publication and the subsequent German SEO audit are still pending.


## German localization audit — 4 October 2026

German publication adds full counterparts of all 205 original public owners. Production repair PR #29 merged and deployed; expected current sitemap total is 615 (205 per language), pending the retained live sitemap count. See [German localization audit](./GERMAN_LOCALIZATION_AUDIT_20261004.md) for vocabulary, full page coverage, fixes and validation limitations. No cluster ownership changes.
