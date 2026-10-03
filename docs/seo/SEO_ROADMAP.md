# Rent&Roll — SEO Roadmap
> **Last updated**: 2026-10-03 · Prioritized by estimated traffic impact × effort

---

## Brand consistency — 27 September 2026

- [x] Remove the former name and domain from public metadata, admin headings,
  cookie-policy labels, exports, and current catalogue descriptions and FAQs.
- [x] Preserve existing checkout sessions and cookie choices under the new names.
- [ ] Restore Instagram/Facebook links once current profile URLs are confirmed.

## Occasions & Events release — 12 September 2026

Published 13 sourceable products (26 EN/ES product URLs) and the bilingual existing-architecture category hub (2 URLs). All use standard daily rates and request-for-dates for unconfirmed supply. Supplier product photos retained on owner approval. See [release details](./EVENTS_CATALOGUE_LAUNCH_20260912.md). Hosted experiences remain future work.

## Search performance and mobility actions — 7 September 2026

The first meaningful `rentandroll.com` Search Console baseline is recorded in
[SEO_GROWTH_AUDIT_20260907.md](./SEO_GROWTH_AUDIT_20260907.md). The preceding
period is non-comparable because of the domain migration.

- [x] Repair the product booking widget's untouched-date state and calendar-day
  math so it cannot render `NaN days`, `Invalid Date`, `€NaN` or add an extra day
  across a daylight-saving transition.
- [x] Prepare a guarded migration removing the stroller/bike trailer's unrelated
  secondary Mobility membership while preserving its Baby & Toddler primary
  category, canonical URL and Kids & Family discovery membership.
- [x] Protect `/rental/mobility` while clarifying exact electric-wheelchair intent
  on the existing product owner. Verified specifications, detail copy, constraints,
  price, stock and URL remain unchanged.
- [x] Strengthen exact family authority from the bilingual accessibility guide and
  Accessible Valencia Kit. Each sends one natural link to the scooter family and
  one to the wheelchair family; no new page was created.
- [x] Add an admin-only mobility enquiry register for requested item, dates,
  location, language, landing/source, channel, outcome and governed loss reason,
  including `no_stock` for inventory planning.
- [x] Apply and verify the two reviewed production migrations. The trailer now
  retains only Baby & Toddler primary plus Kids & Family secondary membership;
  the electric-wheelchair English snippet is live; and the empty admin-only lead
  table is ready. Deploying the source release remains the next release step.
- [ ] After deployment, inspect/request indexing for EN/ES scooter families,
  EN/ES wheelchair families and the electric-wheelchair product owner in Google;
  submit/inspect the same owner set in Bing Webmaster Tools.
- [ ] Recheck query-to-page ownership and CTR at Day 14 and Day 28. At Day 28 and
  Day 90, review qualified enquiries and lost-to-stock demand before buying deeper
  inventory.
- [ ] Strengthen factual local authority through an accurate service-area business
  profile, genuine customer reviews and relevant accommodation/accessibility
  partners.
- [ ] Investigate Spanish baby-equipment and car-seat owner discovery after the
  mobility release is measured.
- [ ] Keep new mobility blogs on hold until a repeated, distinct informational
  query passes the evidence gate. Keep a Gandia owner on hold until fulfilment is
  approved and fresh market research is complete.

---

## Current SEO audit priorities — 11 August 2026

- [x] Add governed bilingual wheelchair and travel-cot/crib family owners. Both
  collections keep every exact product page indexable, show the current product
  choices before durable selection guidance, link from the complete parent
  catalogue, and preserve category-versus-family-versus-product intent boundaries.
  Regression covers canonicals, hreflang, sitemap inclusion, schema, exact H1s,
  product membership and return links from products.
- [x] Correct the Apartment Comfort category presentation in EN/ES. The visible H1,
  breadcrumb, CollectionPage name and intro now represent the complete cooling,
  air-quality, cleaning and practical-home catalogue rather than labelling the broad
  category as portable-air-conditioner rental. Existing metadata ownership remains
  unchanged pending a separate SEO decision. Exact H1 regression now covers all
  seven category routes in both languages.
- [x] Correct product-detail image delivery after Vercel returned
  `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` for newly uploaded, uncached
  Supabase product images. EN/ES product pages now load public Supabase objects
  directly while local assets retain Next.js optimization. The family regression
  now requests every rendered product image and fails on HTTP or content-type errors.
- [x] Release the corrected five-product car-seat catalogue without changing the
  `/rental/baby-gear/car-seats` cluster owner. Four genuinely different named seats
  receive exact-product pages; three interchangeable generic backless boosters
  remain one model-neutral page with capacity three. Preserve product UUIDs and
  redirect the false legacy slugs. The transactional preview, production build and
  rendered EN/ES regression pass; the production database migration is applied and
  the matching application changes are included in this release. See
  [CAR_SEAT_CATALOGUE_CORRECTION_2026-08-11.md](./CAR_SEAT_CATALOGUE_CORRECTION_2026-08-11.md).
- [x] Deploy and production-verify the third governed bilingual product-family
  owner for car-seat selection intent. The release candidate assigns broad EN/ES
  car-seat queries to `/rental/baby-gear/car-seats`, keeps the Baby & Toddler hub
  broad and exact products model- or restraint-specific, and uses current catalogue
  data only in dynamic cards. This initial release included three records and
  excluded the contradictory infant and generic-booster records. Subsequent business
  verification established the five-product correction now tracked above. The guarded database preview and offline production build
  pass, and the rendered family regression validates both routes, schema, product
  handoffs and exclusions. The migration and PR #20 are deployed. The full production
  regression passes, and the 370-URL crawl reports zero errors, warnings, orphans,
  broken links or broken images, maximum click depth three and 183 reciprocal
  hreflang pairs.

- [x] Prepare the second governed bilingual product-family owner for stroller
  selection intent without changing the established portable-AC winner. The EN/ES
  stroller collection compares durable trip requirements while current products,
  prices and dates remain dynamic. The Baby & Toddler parent pages and the three
  verified stroller products link to the owner; the Hamax bike trailer is explicitly
  excluded because stroller conversion is not confirmed. Legacy compact and double
  stroller URLs retain permanent redirects. The guarded data preview passed and
  rolled back. The deployed production crawl covers 368 URLs
  with zero errors, warnings, orphans, broken links or broken images, maximum click
  depth three and 182 reciprocal hreflang pairs (PR #18).
- [x] Correct verified stroller metadata without changing pricing, stock,
  availability or slugs: remove the unsupported jogging label, remove the implied
  cabin-baggage guarantee, qualify double-stroller access, normalize the three real
  strollers under one subcategory, and keep exact model/dimension facts on product
  pages rather than the static family guidance.
- [x] Implement the first governed product-family owner without changing the
  established portable-AC winner: EN/ES mobility-scooter collection pages now own
  scooter-selection intent, use stable decision content plus live product cards,
  and are linked from the parent mobility hubs and all three scooter products.
  Canonicals, hreflang, CollectionPage, ItemList, BreadcrumbList and visible FAQ
  schema are included. The deployed sitemap grows from 364 to 366 URLs. The final
  production crawl reports zero errors, warnings, orphans, broken links and broken
  images; see [TECHNICAL_SEO_AUDIT_20260811.md](./TECHNICAL_SEO_AUDIT_20260811.md).
- [x] Correct mobility-scooter ownership data: the standard scooter joins the
  shared scooter subcategory and the foldable scooter's English metadata no longer
  claims wheelchair, airport, cruise or same-day intent. The guarded migration
  preview passed against all three live records and rolled back cleanly.

- [x] Deployed and verified governed multi-category membership in EN and ES:
  6 unique Mobility products, 49 unique Travel & Outdoors products, and 15 unique
  Sports & Wellness products; stable product canonicals, no duplicate product
  links, and the existing Beach entry cards remain first in Travel & Outdoors.

- [x] Restore Spanish SEO eligibility for the six active English owners previously
  excluded in ES: `bed-rail-for-kids`, `convertible-car-seat`, `seat-booster`,
  `transportation-trailer`, `travel-cot`, and `video-baby-monitor`.
- [x] Remove the invalid large-category card cap introduced during the earlier
  response-size pass. Category pages now render every active category member as a
  full product card in EN and ES in one continuous grid and place optional comparison
  guides after the catalogue. The previous two-card plus compact-link policy and the
  subsequent forced product-type sections harmed discovery and are explicitly retired.
- [x] Correct `audit:seo` to compare decoded visible text so encoded HTML entities
  cannot create false copy failures.
- [x] Align `audit:product-seo` with the evidence-led FAQ policy. FAQ coverage is
  informational rather than a universal indexability gate.
- [x] Temporarily remove the empty Kids & Family cluster from search discovery.
  Both locale routes emit `noindex, follow` and are excluded from the sitemap and
  primary commercial navigation until reviewed multi-category membership supplies
  a useful catalogue. The product capability is tracked in
  `docs/PRODUCT_ROADMAP.md`.
- [x] Restore Kids & Family after reviewing the live catalogue. Added 20 governed
  secondary memberships across child mobility/play, family activities and outdoor
  trips, older-child travel and one verified child swimming vest. Activated both
  locale routes in navigation, homepage, Valencia hub and sitemap while preserving
  every product's primary category and canonical URL (11 August 2026).
- [x] Replace category-wide alphabetical merchandising with short, explicit
  evidence-backed leading sequences and stable alphabetical fallback. Proven AC,
  monitor, baby and beach products now lead their relevant grids; Mobility follows
  validated scooter demand; Kids leads with representative child/family products;
  Sports remains unchanged pending evidence. All products remain visible in the
  same continuous EN/ES grids (11 August 2026).
- [x] Align the Sports & Wellness owner with its full 15-product scope. Replaced
  stale tennis/padel and ball-machine framing in EN/ES metadata, editorial guidance,
  decision blocks and FAQs with durable customer guidance about activity, space,
  transport, setup and venue rules. H1, URL, ownership, layout and catalogue remain
  unchanged (11 August 2026).
- [x] Revalidate the production build and SEO regression suite against the
  364-URL release-candidate sitemap.

---

## ✅ Completed

- [x] Bilingual summer cooling decision refresh: retained the established summer
  guide URLs, corrected the AEMET temperature baseline, removed unsupported
  savings/delivery/health claims, and added portable-AC-versus-fan guidance with
  Apartment Comfort, kit, product, and related-guide pathways (24 July 2026).

- [x] Kids & Family category FAQ parity: added four customer-decision questions
  in English and Spanish covering current catalogue scope, child fit, fulfillment,
  and individual-item versus kit selection. Both category routes now use the
  existing visible FAQ section and matching FAQPage schema (24 July 2026).

- [x] Active-product FAQ parity: localized 15 reviewed answers across the
  acupressure, gravel-bike, kayak, and paddle-board pages. The product readiness
  audit now fails when a non-legacy content-ready product lacks three FAQs in
  either English or Spanish (24 July 2026).

- [x] Discover guide HTML budget: category widgets now render four-item previews
  with a full-count category link. The Malvarrosa build artifact fell from
  181,413 to 122,143 bytes while preserving the commercial category pathway
  (24 July 2026).

- [x] Evergreen trust-page hardening: `/faq`, `/how-it-works`, and `/refunds`
  now match the live booking, fulfillment, payment, and deposit behavior. FAQPage and
  HowTo structured data are generated from visible copy and protected by rendered
  regression checks. Production baseline: 110 sitemap URLs, zero crawl errors,
  broken links, broken images, orphan pages, or indexable sitemap gaps (19 July 2026).
- [x] Spanish trust-page parity: `/es/faq`, `/es/how-it-works`, and `/es/refunds`
  include self-canonicals, reciprocal hreflang, localized navigation, sitemap entries,
  and content-matched FAQPage/HowTo markup where applicable (19 July 2026).
- [x] Spanish commercial-kit parity: `/es/valencia/kits` plus all eight kit details
  now provide localized copy, product and guide pathways, a bilingual API-safe
  configurator, reciprocal hreflang, Product/Breadcrumb/FAQ schema, and sitemap
  coverage (21 July 2026).
- [x] Bilingual baby-gear decision guide: the rent/bring/buy comparison owns a
  planning intent distinct from the transactional Baby & Toddler hub, uses a
  Valencia-specific decision matrix, reciprocal hreflang, Article/Breadcrumb/FAQ
  schema, original imagery, and regression-protected sitemap coverage (21 July 2026).
- [x] Legacy product-slug continuity: stale portable-AC and lightweight-scooter
  editorial pathways now target their current live slugs, while reciprocal EN/ES
  permanent redirects protect historic URLs. The Baby & Toddler hub also provides
  a second contextual inbound path to the new decision guide (21 July 2026).
- [x] Bilingual temporary-home-office tutorial: a practical apartment inspection,
  connectivity, ergonomics, light, heat, calls and coworking decision sequence now
  supports the Remote Work hub without competing with the broad digital-nomad guide
  or transactional category owner (21 July 2026).
- [x] About and Contact trust-page parity: inaccurate response-time, hygiene, brand,
  pickup and fulfilment claims were replaced with verifiable copy; `/es/about` and
  `/es/contact` add localized navigation, contact forms, confirmation emails,
  reciprocal hreflang, sitemap coverage and AboutPage/ContactPage schema (19 July 2026).
- [x] Spanish legal and consent parity: corrected the English privacy, rental-terms,
  and cookie source pages to match the live processors, checkout, deposit, cancellation,
  and browser-storage behavior; added complete `/es/privacy`, `/es/terms`, and
  `/es/cookies` routes plus localized consent surfaces and reciprocal hreflang
  (20 July 2026).
- [x] Booking failure visibility: unexpected booking-draft failures now create persistent
  system incidents, Stripe-session persistence failures are recorded as critical, and
  the customer UI no longer mislabels infrastructure failures as unavailable inventory
  (20 July 2026).

- [x] 20 English and 20 Spanish indexable product pages with Product structured data
- [x] 6 English and 6 Spanish category pages
- [x] Dynamic sitemap (`src/app/sitemap.ts`)
- [x] Automated title and description length reporting with editorial exceptions tracked
- [x] Canonical tags on all pages
- [x] Open Graph / Twitter meta on all pages
- [x] Valencia landing page (local SEO)
- [x] Legal pages in English and Spanish (privacy, terms, refunds, cookies)
- [x] BookingWidget with pricing calculator
- [x] Contact form (Resend-powered)
- [x] Google Analytics integration (env var ready)
- [x] Supabase backend (schema, seed, API)
- [x] SEO documentation framework
- [x] Blog architecture + 4 launch posts (data-driven, Article + FAQ JSON-LD)
- [x] Cross-cluster internal linking (products ↔ blog ↔ categories)
- [x] Category page editorial enrichment (3 paragraphs per category)
- [x] FAQ schema on all 16 product pages (~40 FAQs)
- [x] Discover section: infrastructure + 5 destination guides (Ruzafa, Malvarrosa, Fallas, Albufera, City of Arts & Sciences)
- [x] Discover hub pages (neighbourhoods, day-trips, attractions, events)
- [x] Inline contextual product widgets in discover pages
- [x] Spanish (ES) localization — homepage, products, categories, Valencia (Phase 1)
- [x] Locale-aware Header/Footer with language switcher
- [x] Admin dashboard with Supabase Auth (`/admin`)
- [x] Product CRUD (list, edit, add new, toggle active, pricing tiers)
- [x] Booking management (list, filter, lifecycle transitions)
- [x] Availability API + 3-step BookingWidget (dates → form → success)
- [x] `hreflang` alternates + Spanish sitemap routes
- [x] Self-referencing canonicals on English product and primary static pages
- [x] Reciprocal EN/ES hreflang gated by real localized product content
- [x] Database-backed product sitemap with durable product timestamps
- [x] Product indexability gate for editorial readiness and supported categories
- [x] Noindex and crawl controls for admin, internal and transactional utility routes
- [x] Locale-aware Product structured data and rental availability status
- [x] Automated canonical, hreflang, robots, sitemap and cluster-pathway regression audit
- [x] Six-cluster keyword ownership map including Kids & Family
- [x] Beach & Outdoor transactional cluster strengthened with kit and local-guide pathways
- [x] Beach hub expanded around rental, delivery, shade, family-setup and transport sub-intents with visible EN/ES FAQs and FAQ schema
- [x] Baby, mobility, remote-work and apartment-comfort hubs expanded with EN/ES commercial FAQs and regression-protected FAQ schema
- [x] Spanish category and product pathways now prefer localized planning guides wherever full ES parity exists
- [x] Technical crawler reports sitemap inbound-link counts and shortest homepage click depth; Discover child breadcrumbs and the long-stay kitchen pathway close the first weak-link set
- [x] Discover intent audit enforces complete staying guidance for neighbourhoods and visiting guidance for every published guide type
- [x] Apartment Comfort cluster connected across category, summer kit, guide and cooling products
- [x] Remote Work cluster connected across category, apartment kit, guide and workstation products
- [x] Kids & Family cluster connected across category, Toddler City kit, Family Beach kit and family guide
- [x] Baby & Toddler cluster connected across category, Baby Arrival kit, Toddler City kit and family guide
- [x] Mobility & Accessibility cluster connected across category, accessibility kits and local guide
- [x] EN/ES product templates inherit category, kit and local-guide pathways for all six priority clusters
- [x] Live product indexability audit plus EN/ES search-readiness indicators in admin
- [x] Rendered technical SEO audit with locale, social metadata, orphan and broken-link checks
- [x] Static blog, Discover and Spanish hub metadata brought within audit length targets
- [x] Route-specific structured-data safeguards plus breadcrumbs on blog, Discover and kit details
- [x] Sitemap completeness enforcement for linked indexable routes and public trust pages
- [x] Full-sitemap EN/ES hreflang reciprocity and `x-default` enforcement
- [x] Static image library normalized to WebP with automated weight, format, duplicate and rendered-response checks
- [x] Consent-aware GA4 Core Web Vitals telemetry for template-level field monitoring
- [x] Production template performance budgets and batched public catalogue enrichment reads
- [x] CDN-regenerated EN/ES category pages with immediate catalogue invalidation
- [x] 99-URL production technical audit with zero errors, warnings, orphan pages or broken links
- [x] Shared product metadata-length safeguards and active-catalogue discovery widgets
- [x] Launch-readiness audit aligned with the authoritative product indexability gate
- [x] Verified business/WebSite entity graph and ItemList schema on primary Valencia, Blog, Discover and Kits hubs
- [x] Fresh SERP review corrected outdated zero-competition claims and formalized query-to-hub ownership
- [x] Discover neighbourhood, day-trip, attraction and event sub-hubs expose guide ItemLists and breadcrumb schema
- [x] Product, kit, category and editorial schema connected to stable business/WebSite IDs; evergreen event guides corrected to Article markup
- [x] Spanish planning coverage launched with a localized blog hub plus complete Beach and Summer guides and selective reciprocal hreflang
- [x] Bilingual day-trip cluster expanded with source-governed Buñol and Cullera guides plus a localized Spanish comparison hub
- [x] Discover Phase 3 completed with bilingual Corpus Christi and Christmas guides, annual refresh controls and licensed local imagery
- [x] Discover locale governance and GA4 pathway measurement: all Spanish guides now inherit correct hub/type/schema context, locale depth is audit-enforced, and guide-to-guide, editorial and commercial clicks emit consent-aware events
- [x] First measured-breadth translation batch: complete Spanish Fallas, Albufera, City of Arts and Sciences, and Turia Gardens guides expand localized Discover coverage from 14 to 18 guides
- [x] Spanish day-trip parity: Sagunto, Requena, and Xàtiva complete all six localized Day Trips guides and raise Spanish Discover coverage from 18 to 21 guides
- [x] EN/ES Host Services cluster launched for guest-equipment support without competing for generic property-management intent

---

## 🔴 Tier 1 — High Impact, Low-Medium Effort

### 1.1 Build data-driven blog architecture
**Impact**: 🔴 Critical · **Effort**: 2 hours · **Status**: ✅ Done

Blog architecture live with `src/content/blog.ts`, `/blog/[slug]` template with Article JSON-LD, FAQ schema, hero images, internal links.

**Files**: `src/content/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`

---

### 1.2 Publish 4 launch blog posts
**Impact**: 🔴 High · **Effort**: 2-3 hours · **Status**: ✅ Done

| Post | Primary Keyword | Est. Impact |
|------|----------------|-------------|
| Valencia with Kids | `Valencia with kids` | High — family travel traffic |
| Accessible Valencia | `wheelchair accessible Valencia` | High — accessibility traffic |
| Digital Nomad Valencia | `digital nomad Valencia` | Medium — nomad traffic |
| Valencia Summer Guide | `Valencia summer tips` | Medium — seasonal |

---

### 1.3 Google Search Console setup
**Impact**: 🔴 High · **Effort**: 10 min · **Status**: Property active; post-deploy validation pending

Search Console is receiving performance data. After the July 15 technical SEO
deployment, resubmit the sitemap and inspect the homepage, Valencia hub,
`travel-outdoors`, one English product, one Spanish product, one kit and one
guide. Monitor duplicate/canonical selections and crawled-not-indexed URLs.

---

### 1.4 Cross-cluster internal linking audit
**Impact**: 🟠 High · **Effort**: 30 min · **Status**: ✅ Done

Product → category/kit/guide, blog → products, and categories → kits/guides.
The shared product pathway layer covers all six priority clusters in English and
Spanish. The rendered SEO regression audit now checks every category pair plus a
representative product so these links, canonicals and hreflang tags cannot vanish
silently.

---

### 1.5 Build Kits & Bundles architecture
**Impact**: High · **Effort**: 1-2 days · **Status**: Initial layer live

Initial data-driven bundle layer is live with `/valencia/kits`, individual kit pages, related products, related guides, FAQ, sitemap entries, and a configurator for included items/add-ons. Kit requests are validated and persisted before WhatsApp handoff, with admin request visibility and lifecycle tracking. Exact product-linked components now expose live aggregate availability and known-item rental estimates to customers and staff; ambiguous lines remain explicitly manual. The next iteration is atomic multi-item reservation and Checkout after inventory mappings are complete.

**Initial kit pages:**
- Family Beach Kit Valencia
- Baby Arrival Kit Valencia
- Toddler City Kit Valencia
- Remote Work Apartment Kit
- Summer Apartment Survival Kit
- Accessible Valencia Kit
- Grandparents Visiting Kit
- Long-Stay Kitchen Upgrade Kit

**Technical direction:**
- Add a bundle data model rather than hardcoding pages
- Support included items, optional add-ons, substitutions, related guides, related products, FAQ, and availability status
- Prepare for future configurable checkout once inventory and booking logic are mature
- Track `bundle_check_availability`, `bundle_addon_select`, and guide-to-bundle clicks in GA4

---

### 1.6 Split family categories: Baby vs Kids
**Impact**: High · **Effort**: 0.5-1 day · **Status**: Core hub and navigation live; inventory review remains

Separate the current broad family category into clearer customer language:

- `Baby & Toddler` for cot, stroller, high chair, baby bath, sleep, feeding, carrier, monitor
- `Kids & Family` for scooters, beach toys, toy boxes, activity packs, balance bikes, family outdoor gear

This improves navigation, SEO intent matching, bundle surfacing, and future inventory growth.

The July 2026 category migration adds `Kids & Family` while preserving existing URLs
and moves only clearly identified toy/bike records. Mixed legacy records remain for
manual classification rather than being guessed in bulk.

The Kids & Family hub is now visible on both homepage and Valencia category grids,
uses a valid social-sharing image, and links directly to the Toddler City kit,
Family Beach kit, and Valencia-with-kids guide in both locale templates.

---

### 1.7 Upgrade category naming and structure
**Impact**: Medium-High · **Effort**: 0.5-1 day · **Status**: Display layer done; database migration prepared

Adopt more use-case-led category names across nav, category pages, sitemap, metadata, and Spanish copy where relevant:

- `Mobility Aid` -> `Mobility & Accessibility`
- `Home & Living` -> `Apartment Comfort`
- `Travel & Outdoors` -> `Beach & Outdoor`
- `Pregnancy` -> `Pregnancy & Postpartum`

Avoid changing URLs casually until redirects/canonicals are planned. Display names can change first; URL migration can follow once the bundle/category architecture is stable.

---

### 1.8 Product content readiness system
**Impact**: High · **Effort**: 2–3 days · **Status**: Infrastructure and indexability monitoring done; editorial queue in progress

Implement the data model, admin workflow, and product-page rendering needed to
turn verified inventory into indexable Valencia product pages. Follow
[PRODUCT_CONTENT_STRATEGY.md](./PRODUCT_CONTENT_STRATEGY.md).

**Sequence:**
1. Add database-backed product details, FAQs, image metadata/rights records, and locale content.
2. Make page metadata consume product-specific SEO fields.
3. Add admin readiness checks and an editorial review queue.
4. Enrich and publish a first 12–20 conversion-ready products only.
5. Add guide/category/kit links and measure product-assisted conversion.

The 20 July live baseline is 178 total products, 24 active products, 20
English-indexable products, and 20 Spanish-indexable products. The admin product list now separates public
activation from EN/ES search readiness and exposes the blocking reason. Run
`npm run audit:product-seo` for the full cluster report; the persistent baseline
and next actions live in [PRODUCT_INDEXABILITY_AUDIT.md](./PRODUCT_INDEXABILITY_AUDIT.md).

---

## 🟠 Tier 2 — Medium Impact, Medium Effort

### 2.1 i18n — Phased multilingual rollout
**Impact**: 🟠 High · **Effort**: 4-6 hours per language · **Status**: Open

Spain receives 97M international visitors/year. Language priority based on verified INE tourist volume:

| Phase | Language | Tourist Volume | Effort | Status |
|-------|----------|---------------|--------|--------|
| 1 | **Spanish** | Domestic + LATAM | 4-6h | ✅ Done (homepage, products, categories, Valencia, Header/Footer) |
| 2 | **German** | ~11M visitors/yr (#3 market) | 4-6h | 🔲 Future |
| 3 | **French** | ~12M visitors/yr (#2 market) | 4-6h | 🔲 Future |
| 4 | **Dutch** | 1M+ in 5 months 2026 | 4-6h | 🔲 Future |

**Architecture**: Custom dictionary system (`src/i18n/`) with prefix routing (`/es/product/[slug]`)
**Priority pages per locale**: Homepage, category pages, top 5 products, contact

---

### 2.2 Category page editorial enrichment
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: ✅ Done

3 editorial paragraphs per category + blog cross-links.

---

### 2.3 FAQ schema on product pages
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: ✅ Done

~40 FAQs across 16 products with FAQPage JSON-LD.

---

### 2.4 Discover section — Travel guide content engine
**Impact**: 🟡 Medium · **Effort**: 2-3 hours · **Status**: ✅ Infrastructure done, populating

Data-driven `/discover/[slug]` pages. 5 destinations live. Hub pages for neighbourhoods, day-trips, attractions, events.

**Completed design items:**
- [x] **Photo heroes** — Every published Discover guide has a local hero asset
- [x] **Category-based product strips** — Compact, thematic horizontal scrolling widgets (mobility, baby, remote work)
- [x] **Two-layer overlay** — Consistent `bg-black/50` + gradient pattern on all photo heroes
- [x] **Widget spacing** — No two product strips adjacent; contextually placed after relevant sections
- [x] **Photo-backed hub cards** — Discover index uses lifestyle photos instead of emojis
- [x] **Valencia map widget** — Accessible schematic city/day-trip map with destination selection, transport summaries, and guide pathways
  - Production verified 18 July 2026: responsive layout has no horizontal overflow; live crawl reports zero page errors, warnings, broken internal links, or broken images.

**Open design items:**
- [x] **Real photos** — All 22 Discover hero assets use sourced, licensed photography with visible attribution, a maintained rights register, and strict `npm run audit:discover-images` enforcement.
- [x] **Restaurant source tracking** — All 35 published recommendations carry a source note, source URL, and verification date; stale or misplaced venues were corrected and `npm run audit:discover-sources` enforces six-month review
- [x] **Staying vs Visiting** — All 5 published neighbourhoods have complete staying guidance and all 22 published Discover guides have complete visiting guidance, enforced by `npm run audit:discover-intent`

The 20 July portfolio audit established a 22-guide English foundation, including
the first three-guide event cluster. Hub consolidation and the source
governance layer are now complete. Spanish Discover architecture is live for the
Discover hub, Beaches, Attractions, and Events hubs, with reciprocal hreflang and
selective sitemap inclusion only for complete translations. The expansion sequence,
keyword ownership, bilingual policy, publication gates, and candidate backlog are defined in
[DISCOVER_EXPANSION_STRATEGY_20260720.md](./DISCOVER_EXPANSION_STRATEGY_20260720.md).

**Next implementation order:**

1. Source/freshness governance is complete; record the 28-day GSC baseline.
2. Discover hub consolidation is complete across Beaches, Neighbourhoods, Day
   Trips, Attractions, and Events.
3. Spanish Discover architecture and the first beach cluster are complete.
4. First bilingual expansion batch is 6/6 complete: El Saler, Pinedo, Oceanogràfic, Central Market with La Lonja, Semana Santa Marinera, and Feria de Julio are live in EN/ES with reciprocal event hubs.
5. Expand only where GSC, seasonality, user demand, or commercial relevance supports it.

---

### 2.5 Host Services B2B cluster
**Impact**: Medium-High · **Effort**: 2-3 hours · **Status**: ✅ Initial EN/ES layer live

The dedicated `/valencia/host-services` and
`/es/valencia/servicios-anfitriones` pages own the narrow equipment-support
intent for holiday-rental hosts, property managers, aparthotels, and relocation
teams. They deliberately exclude generic property management, cleaning, keys,
licensing, and unsupported availability or pricing promises.

Both pages include reciprocal hreflang, Service, FAQ and breadcrumb schema,
category and kit pathways, sitemap coverage, and links from the Valencia hubs and
global footer. Search-intent evidence and page boundaries are maintained in
[HOST_SERVICES_CLUSTER.md](./HOST_SERVICES_CLUSTER.md).

---

## 🟡 Tier 3 — Medium Impact, Higher Effort

### 3.1 Blog cadence — 2 posts/month
**Impact**: 🟡 Medium · **Effort**: Ongoing · **Status**: 8 EN/ES posts live

Maintain publishing cadence. Seasonal content planned around:
- **July-Aug**: Summer/beach content
- **September**: Back-to-school, Fallas planning
- **October**: Autumn/winter content
- **March**: Las Fallas family guide

The English wheelchair-accessibility guide was refreshed on 22 July after Search
Console showed 45 impressions at average position 8.2 but only one click. Its title
and snippet now lead with practical 2026 intent, and its guidance matches the
source-linked, non-absolute standard already used by the Spanish article.

---

### 3.2 Stripe payment integration
**Impact**: 🔴 Critical · **Effort**: Ongoing hardening · **Status**: Live flow implemented and manually tested

Server-priced booking drafts, temporary inventory holds, Stripe Checkout, signed
webhook fulfillment, success-page reconciliation, refunds, payment records, and
customer documents are implemented. A refunded live-mode test completed successfully.
Automated read-only booking smoke checks and persistent Checkout/webhook incident
monitoring were added in July 2026. Continue controlled regression testing before
opening the full catalogue.

---

### 3.3 Backlink strategy
**Impact**: 🟡 Medium · **Effort**: Ongoing

Target backlinks from:
- Valencia expat/nomad blogs
- Family travel review sites
- Accessibility travel directories
- Digital nomad directories (Nomad List, etc.)

---

## 🟢 Tier 4 — Lower Priority / Future

### 4.1 Marketplace platform (third-party provider listings)
Enable third-party rental providers to list products. Commission model. Expands inventory without owning every item.

### 4.2 Spain-wide expansion
**Path**: Valencia → Costa Blanca (Alicante, Benidorm) → Barcelona → Málaga → Madrid
Create city landing pages as SEO land-grab before entering markets.

### 4.3 Additional product verticals
- Camping gear
- Kitchen equipment (blenders, instant pots)
- Exercise equipment (yoga mats, resistance bands)

### 4.4 Reviews/testimonials system
Initial verified-booking review system implemented 19 July 2026. Completed rentals
receive a one-time private feedback link; public display requires explicit customer
consent plus manual admin approval. Review pages are `noindex`, public output excludes
customer contact data, and no self-serving aggregate rating schema is emitted. Apply
`20260719_verified_booking_reviews.sql` and collect the first genuine reviews before
evaluating a separate Google Business Profile integration.

Unsupported homepage vanity metrics (including invented rental/review counts) were
replaced with factual service statements while the real review corpus is established.

### 4.5 Distribution channel listings
List our products on Babonbo, BabyQuip, Cloud of Goods (20% commission) as secondary distribution. Always prefer direct organic traffic.

### 4.6 Partner/affiliate page
Completed 19 July 2026. `/partners` and `/es/colaboraciones` provide a factual,
bilingual destination for accommodation referrals, travel/relocation collaboration,
and narrow product pilots. The pages include a working Resend-backed enquiry form,
explicit EN/ES alternates, sitemap coverage, footer discovery, and links to the
separate Host Services and Kits intent owners. No unconfirmed logos, endorsements,
performance claims, or affiliate offers are shown. See
[PARTNERSHIP_AUTHORITY_SURFACE_20260719.md](./PARTNERSHIP_AUTHORITY_SURFACE_20260719.md).

### 4.7 Brand partnership surfaces
Build only after core kit pages exist. Future surfaces should support narrow, measurable pilots rather than generic ads:

- Co-branded kit landing sections for demo fleets
- Brand/product badges inside relevant kits
- Tracked post-rental purchase links and discount codes
- Partner reporting dashboard/export: rental days, attachment rate, feedback, clicks
- Case-study pages once proof exists

Priority pilot logic: start with one narrow bundle, collect usage evidence, then use that case study to approach larger brands.

---

## Priority Execution Order (Next Session)

1. **Sitemap refresh — ✅ Code and local verification completed 22 July** — the
   sitemap now revalidates every five minutes. A production-build crawl returned
   200 URLs with the four retired URLs removed and all 12 newly indexable URLs
   present. Deploy, resubmit the sitemap in Search Console, then inspect the
   Apartment Comfort, Beach, Baby and Mobility owners plus their top products.
2. **Beach cluster — ✅ Completed 18 July** — `/rental/travel-outdoors` owns broad rental and delivery intent; guides own beach-planning queries; product pages own exact-item searches. Consolidated comparison and FAQ coverage avoids overlapping thin landing pages.
3. **Active catalogue** — complete EN/ES readiness for commercially available products
   - Full image-delivery and priority-copy follow-up on 12 August passed all 114
     active products across 228 EN/ES pages. Six fact-complete baby/family products
     now have direct bilingual customer copy and localized FAQs; Spanish product
     pages can no longer inherit English static FAQs. The 25–40 kg swimming-vest
     record and 32-inch monitor URL are now internally consistent, with permanent
     redirects from the incorrect monitor URL. See
     [ACTIVE_PRODUCT_PAGE_AUDIT_20260812.md](./ACTIVE_PRODUCT_PAGE_AUDIT_20260812.md).
   - Priority non-AC follow-up on 11 August corrected a shared product-page defect
     that labelled every family-owner link as a scooter comparison. All five current
     families now use their own EN/ES context, guarded by rendered regression.
     Beachminton and family-kayak customer copy was also repaired from verified
     facts. The two identity conflicts were resolved on 12 August; the remaining
     first-order catalogue risks are shared monitor imagery and the next thin-copy
     group. See
     [PRIORITY_PRODUCT_PAGE_AUDIT_20260811.md](./PRIORITY_PRODUCT_PAGE_AUDIT_20260811.md).
   - Mobility bilingual follow-up on 12 August completed Spanish FAQ coverage for
     the powered wheelchair, rollator and transport wheelchair, repaired the
     powered-wheelchair snippet, and corrected misleading FAQ wording. A permanent
     size-identity audit also caught and removed the 24-inch monitor's stray
     27-inch Spanish description. All 114 active products remain indexable in both
     languages, with zero active size-identity conflicts.
   - The remaining 15–40 kg child-lifejacket and 19–30 kg swimming-vest pages were
     also converted from internal activation/review prose to direct bilingual
     customer copy. Their distinct weight ranges and product types remain explicit;
     URLs, pricing, stock, images and category memberships were not changed.
   - A complete active-field hygiene scan then removed internal activation,
     import-review and source-dispute language from the remaining catalogue. This
     included 54 inclusion FAQs, three import-only specifications, four targeted
     product-copy sets and one internal Koenic pricing-review key. The AC listing's
     commercial copy and pricing were not rewritten. A permanent audit now fails if
     these patterns return; all 114 active products currently pass.
   - Mobility scooter content review completed 21 July 2026 for standard,
     lightweight, and heavy-duty listings. EN/ES copy and FAQs are complete and all
     three active listings remain in both sitemaps. Image-rights follow-up remains an
     internal publication-compliance task rather than a sitemap exclusion.
     See [MOBILITY_SCOOTER_CONTENT_REVIEW_20260721.md](./MOBILITY_SCOOTER_CONTENT_REVIEW_20260721.md).
   - Live follow-up on 24 July: all 37 active products are indexable in English and
     Spanish. The PUKY toddler bike now has localized product copy, metadata, and
     FAQs, closing the Kids & Family locale gap. Retain the Dreame image-rights
     warning until supporting permission is documented.
4. **Commercial hubs — ✅ Completed 18 July** — AC, baby gear, mobility and remote-work hubs now absorb closely related rental, delivery, suitability and duration questions in EN/ES without creating competing landing pages.
5. **Internal links — ✅ Graph pass completed 18 July** — Spanish pathways use localized guides; all sitemap pages remain within three homepage clicks; Discover children now link through their sub-hubs; the long-stay kitchen kit gains a contextual Apartment Comfort pathway. Regression checks cover locale-specific editorial links and hierarchy links.
6. **Authority — current highest-leverage gap** — complete an accurate service-area
   Google Business Profile, request honest reviews from completed renters, and earn
   Valencia accommodation/accessibility/family-travel partner links. A 22 July web
   mention check found only one obvious external brand mention, so authority and
   local prominence now matter more than increasing on-page keyword repetition.

The supporting 30/60/90-day plan and 7–19 July Search Console baseline are recorded
in [SEO_GROWTH_AUDIT_20260722.md](./SEO_GROWTH_AUDIT_20260722.md).

### Discover localization — completed 20 July 2026

- [x] Reach full EN/ES parity across all 26 published Valencia Discover guides.
- [x] Launch `/es/discover/neighbourhoods` with localized comparison copy,
  FAQs, structured data, breadcrumbs, and contextual Valencia links.
- [x] Complete Spanish guides for Ruzafa, El Carmen, Cabanyal, Benimaclet, and
  El Ensanche without introducing competing locale URLs.
- [x] Enforce localized Beaches, Attractions, Day Trips, Events, and
  Neighbourhoods hubs in the Discover locale audit.
- [x] Correct technical-schema auditing for localized hubs and event articles,
  and enforce both decoded and compressed HTML budgets against the largest
  published Discover guide.
- [x] Add bilingual pickup-versus-delivery decision support and explain the
  paid post-booking transport-change flow without creating another thin URL.
- [x] Align English and Spanish FAQ claims on deposits, damage, cleaning,
  brands, product sourcing, expansion, and accommodation partnerships.

---

## Metrics to Track

| Metric | Pre-session (June 17) | Current (June 19) | Target (90 days) |
|--------|----------------------|-------------------|------------------|
| Total pages | ~37 | ~80+ (22 ES + admin pages) | ~100+ (with more discover + DE) |
| Blog posts | 0 | 4 | 8+ |
| Discover guides | 0 | 5 | 15+ |
| Photo assets | 0 | 22+ (hero, category, hub, destination) | 50+ |
| Languages | EN only | EN + ES (Phase 1) | EN + ES + DE |
| Products | 16 | 16 (× 2 locales) | 16+ (expandable via admin) |
| Categories | 5 | 5 | 5 |
| Product FAQs | 0 | ~40 | ~40 |
| Admin dashboard | None | Full CRUD (products, bookings, pricing) | — |
| Booking flow | WhatsApp only | 3-step form + WhatsApp fallback | + Stripe payments |
| Google Search Console | Not verified | Not verified | Verified, sitemap submitted |
| Internal links per page | ~3 | 6+ | 8+ |
# Spanish planning cluster expansion — 18 July 2026

- [x] Publish complete Spanish family-travel adaptation with Baby & Toddler and
  Kids & Family commercial paths.
- [x] Publish a fact-checked Spanish accessibility adaptation using current
  Metrovalencia and municipal accessible-bathing sources.
- [x] Restrict reciprocal article hreflang to guides with complete locale parity.
- [x] Complete Spanish parity for all six English planning guides, including
  Remote Work and day-trip intent.


### 2026-09-08 — Explorer kit release

Turia & Beach Explorer prepared in the existing EN/ES kit structure with request-for-dates flow, generated illustrated hero, core equipment and optional extras. Before confirming an order: source bike, check L/XL rider fit, Hamax attachment and child suitability, helmets/lock, packed shade/cooler fit and load; agree full rental/delivery price. Publication verification is recorded in `docs/releases/TURIA_BEACH_EXPLORER_2026-09-08.md`.

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


## German parity correction in progress — 3 October 2026

The preceding launch HTTP/metadata checks did not establish original-content or layout parity. The abbreviated German release is being corrected under the owner’s existing authorization. Production counts and release remain unchanged until full correction verification and deployment. [Repair status](GERMAN_PARITY_REPAIR_STATUS.md) records completed shared templates, exact verification evidence, unfinished pages, source factual issues and quarantined operations. The German SEO audit follows complete translation/parity repair.


German parity local checkpoint (2026-10-03T19:28:06.563Z): all eight articles and fifteen destination guides have full source-shaped translations; eleven destination render comparisons pass. Complete neighbourhood hub registered behind full original membership, awaiting rendering verification. Four other hubs and eleven guide translations remain. Ten verified City of Arts source fields corrected consistently before German translation. Production counts remain unchanged; no release or German SEO audit completion claimed.


German parity local checkpoint (2026-10-03T19:45:49.176Z): sixteen complete source-shaped destination translations and three original shared hubs pass EN/DE render checks. Fresh production build and 12 release contracts pass. Ten guides and beaches/day-trips hubs remain, followed by whole-site/customer/product validation and live release. Production sitemap counts remain unchanged. German SEO phase not started.


German parity local checkpoint (2026-10-03T19:51:27.384Z): eighteen full destination translations now pass EN/DE structure/media/link checks, including Buñol and Cullera. Fresh production build passes. Eight guide translations and actual beaches/day-trips hubs remain. No production counts or SEO-phase completion changed.


German final local checkpoint (2026-10-03, 21:50 UTC): all 205 original public German equivalents pass structure/classes/images/lang comparison; all 128 catalogue translations are current and approved, thirteen exact copy corrections committed and independently verified. All 60 localization tests pass. Homepage four-width geometry passed; further headless initialization failed twice and is quarantined. Fresh source-cache namespace and German legacy redirects added. Code deployment and the subsequent German SEO audit are still pending. Local sitemap remains intentionally excluded unless VERCEL_ENV=production; the final local rehearsal now explicitly uses production indexing identity with outbound messages/payments disabled.


## Release-ready checkpoint — 2026-10-03T22:07:58.215Z

Required final production build passes (2026-10-03T22:05:47.400Z). All 205 original public equivalence comparisons pass on the earlier body-equivalent build (2026-10-03T21:39:54.695Z); subsequent changes concern redirects, 404 routing and indexing rehearsal, not those page bodies. Final actual response checks pass: six representative legacy redirects, German booking success/cancel/unsubscribe privacy metadata, four malformed private-token 404s and unknown public German URL with full German document. Production indexing rehearsal: 615 unique sitemap URLs, all 205 German equivalents included. All 60 localization tests, four routing regressions and four conversation-access fixtures pass. Changed-source lint passes. Browser CLI fallback failed to produce a loaded DOM and remains unverified/quarantined; the earlier four-width homepage geometry receipt is the only browser acceptance. Thirteen committed catalogue corrections independently verified, all 128 current German products approved. Code is ready for the authorized repair deployment; publication and the subsequent German SEO audit are still pending.


## German localization audit — 4 October 2026

- [x] Restore complete German content using original templates and photographs, deploy repair PR #29.
- [x] Audit metadata on all 205 German public pages and record primary-source terminology evidence.
- [ ] Deploy metadata corrections and verify all 205 production pages plus reciprocal language sitemap.
