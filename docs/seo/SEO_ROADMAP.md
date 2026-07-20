# RentAnything.es — SEO Roadmap
> **Last updated**: 2026-07-20 · Prioritized by estimated traffic impact × effort

---

## ✅ Completed

- [x] Evergreen trust-page hardening: `/faq`, `/how-it-works`, and `/refunds`
  now match the live booking, fulfillment, payment, and deposit behavior. FAQPage and
  HowTo structured data are generated from visible copy and protected by rendered
  regression checks. Production baseline: 110 sitemap URLs, zero crawl errors,
  broken links, broken images, orphan pages, or indexable sitemap gaps (19 July 2026).
- [x] Spanish trust-page parity: `/es/faq`, `/es/how-it-works`, and `/es/refunds`
  include self-canonicals, reciprocal hreflang, localized navigation, sitemap entries,
  and content-matched FAQPage/HowTo markup where applicable (19 July 2026).
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

Initial data-driven bundle layer is live with `/valencia/kits`, individual kit pages, related products, related guides, FAQ, sitemap entries, and a first client-side configurator for included items/add-ons with WhatsApp handoff. Next iteration should add availability-aware add-ons, multi-item booking drafts, and admin request visibility.

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
- [x] **Real photos** — All 14 Discover hero assets use sourced, licensed photography with visible attribution, a maintained rights register, and strict `npm run audit:discover-images` enforcement.
- [x] **Restaurant source tracking** — All 35 published recommendations carry a source note, source URL, and verification date; stale or misplaced venues were corrected and `npm run audit:discover-sources` enforces six-month review
- [x] **Staying vs Visiting** — All 5 published neighbourhoods have complete staying guidance and all 18 published Discover guides have complete visiting guidance, enforced by `npm run audit:discover-intent`

The 20 July portfolio audit found a strong 14-guide English foundation but only
one event guide and narrow attraction coverage. Hub consolidation and the source
governance layer are now complete. Spanish Discover architecture is live for the
Discover hub, Beaches hub, Malvarrosa and Patacona, with reciprocal hreflang and
selective sitemap inclusion only for complete translations. The expansion sequence,
keyword ownership, bilingual policy, publication gates, and candidate backlog are defined in
[DISCOVER_EXPANSION_STRATEGY_20260720.md](./DISCOVER_EXPANSION_STRATEGY_20260720.md).

**Next implementation order:**

1. Source/freshness governance is complete; record the 28-day GSC baseline.
2. Discover hub consolidation is complete across Beaches, Neighbourhoods, Day
   Trips, Attractions, and Events.
3. Spanish Discover architecture and the first beach cluster are complete.
4. First bilingual expansion batch is 4/6 complete: El Saler, Pinedo, Oceanogràfic, and Central Market with La Lonja are live in EN/ES; two event guides remain.
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
**Impact**: 🟡 Medium · **Effort**: Ongoing

Maintain publishing cadence. Seasonal content planned around:
- **July-Aug**: Summer/beach content
- **September**: Back-to-school, Fallas planning
- **October**: Autumn/winter content
- **March**: Las Fallas family guide

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

1. **Deploy + validate** — run `npm run audit:seo`, resubmit sitemap, inspect representative URLs in GSC
2. **Beach cluster — ✅ Completed 18 July** — `/rental/travel-outdoors` owns broad rental and delivery intent; guides own beach-planning queries; product pages own exact-item searches. Consolidated comparison and FAQ coverage avoids overlapping thin landing pages.
3. **Active catalogue** — complete EN/ES readiness for commercially available products
4. **Commercial hubs — ✅ Completed 18 July** — AC, baby gear, mobility and remote-work hubs now absorb closely related rental, delivery, suitability and duration questions in EN/ES without creating competing landing pages.
5. **Internal links — ✅ Graph pass completed 18 July** — Spanish pathways use localized guides; all sitemap pages remain within three homepage clicks; Discover children now link through their sub-hubs; the long-stay kitchen kit gains a contextual Apartment Comfort pathway. Regression checks cover locale-specific editorial links and hierarchy links.
6. **Authority** — Google Business Profile, reviews and Valencia partner backlinks

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
