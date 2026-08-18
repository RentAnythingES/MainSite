# Rent&Roll — Architecture
> **Last updated**: 2026-08-18

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (admin dashboard)
- **Email**: Resend
- **Hosting**: Vercel
- **Domain**: rentandroll.com
- **i18n**: Custom dictionary system (`src/i18n/`)

`src/proxy.ts` applies the route locale response header and forwards the current
pathname to server layouts. Its matcher excludes APIs, Next.js assets, and files;
admin authentication remains enforced in the admin server layout and API routes.

---

## Data Flow

### Public (customer-facing)
```
Static data (src/data/products.ts, src/data/bundles.ts)
  ↓ import at build time
Next.js Server Components (SSG)
  ↓ props
Client Components (BookingWidget, HeroCarousel)
  ↓ fetch
API Routes (/api/booking-drafts, /api/checkout, /api/availability)
  ↓ service role client
Supabase (write bookings, check blocked_dates)
```
- The live v2 checkout path is gated by Supabase product availability, blocked dates, and inventory holds. It does not use a separate global checkout pause flag.
- Booking System v2 is documented in `docs/BOOKING_SYSTEM.md`.

### Admin (operator-facing)
```
Admin UI (/admin/*)
  ↓ fetch (authenticated)
Admin API Routes (/api/admin/*)
  ↓ verify cookie → service role client
Supabase (CRUD products, pricing, bookings)
```

---

## Database Schema

### Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `categories` | Customer-facing categories plus inactive draft-only import categories | Public read |
| `products` | Global product catalogue identity, specifications, imagery, and legacy Valencia stock compatibility | Public read (active only) |
| `product_category_memberships` | One primary category plus optional governed secondary discovery categories per product | Public read |
| `pricing_tiers` | Per-product tiered daily rates (in cents) | Public read |
| `product_quantity_discounts` | Per-product volume discount thresholds in basis points | Admin/API only |
| `markets` | City/region operating contexts, locale/currency/timezone, and independent publication/booking gates | Public read active/public |
| `product_offers` | Per-market product publication, stock, and online capacity | Public read active/public |
| `offer_pricing_tiers` | Per-market product-offer rental pricing | Public read active/public |
| `offer_quantity_discounts` | Per-market product-offer volume discounts | Admin/API only |
| `inventory_locations` | Structured depots/storage locations within a market | Admin/API only |
| `bookings` | Customer bookings with lifecycle status | Admin only |
| `blocked_dates` | Date-level inventory blocking | Admin only |
| `pickup_locations` | Customer pickup options | Public read active |
| `service_zones` | Valencia delivery/collection zones and fees | Public read active |
| `booking_drafts` | Pre-payment booking drafts and Stripe Checkout source of truth | Admin/API only |
| `booking_fulfillment_amendments` | Tokenized, paid post-booking changes from customer pickup to delivery services | Server/admin only |
| `booking_custom_quotes` | Tokenized staff-authored pre-booking quotes with free-form price and condition snapshots | Server/admin only |
| `booking_inventory_blocks` | Datetime inventory holds and paid booking blocks | Admin/API only |
| `booking_payment_events` | Durable payment/refund/deposit ledger for bookings | Admin/API only |
| `booking_documents` | Invoice, refund receipt, and rental agreement document records | Admin/API only |
| `invoice_settings` | Issuer identity, invoice series, VAT policy, and compliance status | Admin/API only |
| `booking_document_counters` | Yearly sequential counters for booking document numbers | Admin/API only |
| `booking_ops_tasks` | Internal per-booking operations checklist tasks | Admin/API only |
| `booking_status_events` | Immutable booking lifecycle transition audit trail | Server/admin only |
| `booking_reviews` | Tokenized post-rental feedback, publication consent, and moderation state | Server/admin only |
| `bundle_requests` | Private kit configurations captured before WhatsApp handoff | Server/admin only |
| `newsletter_subscribers` | Newsletter signup consent records | Admin/API only |
| `product_localizations` | Locale-specific product copy and SEO metadata | Public read for active products |
| `product_faqs` | Locale-specific pre-rental product FAQs | Public read for active products |
| `product_images` | Product image alt text, source, rights status, and ordering | Public read for active products |
| `system_incidents` | Persistent Checkout, webhook, and booking failure trail | Server/admin only |
| `inventory_units` | Individual physical assets, condition, location, and operational status | Admin only |
| `inventory_unit_events` | Append-only unit creation, inspection, and status history | Admin only |
| `inventory_stock_events` | Audit history for declared stock and online-capacity changes | Server/admin only |
| `booking_inventory_unit_assignments` | Physical-unit reservation, handover, return, and release history per booking | Admin/API only |
| `monitoring_runs` | Scheduled production health results and alert deduplication | Server/admin only |
| `api_rate_limits` | HMAC-keyed distributed counters for public mutation endpoints | Server only |

Unexpected booking-draft creation failures and Stripe Checkout session-state
persistence failures are written to `system_incidents`. Expected customer conflicts,
such as unavailable inventory or expired drafts, remain ordinary 409 responses rather
than operational incidents. The admin system-health panel exposes unresolved incidents.

### Storage
| Bucket | Purpose | Access |
|--------|---------|--------|
| `product-images` | Admin-uploaded product photos | Public read, admin API writes via service role |

Inventory holds are reserved via the `reserve_booking_inventory(...)` database
function so overlapping draft creation is checked while the product row is locked.
After the multi-market foundation migration, this legacy Valencia function delegates
to `reserve_product_offer_inventory(...)`, which locks and counts capacity per market
offer. Existing API contracts remain unchanged during the compatibility period.
The function is `SECURITY DEFINER` only because it performs that atomic lock and
write; execution is restricted to the `service_role` used by the server-side
booking draft API. Product images use a public Storage bucket for CDN delivery,
without a public `storage.objects` listing policy.

Public booking-draft creation uses the atomic `consume_api_rate_limit(...)` database
function before pricing or inventory reservation. Counters are shared across Vercel
instances and keyed by HMAC hashes of IP, IP/product, and email identifiers; raw IP
and email values are not stored in the rate-limit table.

Fulfillment configuration stores both public instructions and internal operations
notes. The additive migration `20260709_fulfillment_instruction_config.sql` adds
customer instructions, lead-time fields, delivery/collection windows, and internal
notes for pickup locations and service zones. API reads are backward-compatible and
fall back to the older column set until that migration is applied.

Automatic checkout eligibility is explicit per service zone. Public booking options
return only active zones with `automatic_checkout_enabled = true`; availability and
draft creation independently reject manual-quote zones. Draft pricing persists
delivery speed and enforces zone surcharge, minimum order, lead time, and same-day
cutoff rules on the server.

### Booking Lifecycle
```
pending → confirmed → paid → delivering → active → returning → completed
                  ↘ cancelled
                            ↘ refunded
```
- Cancellation/refund auto-releases blocked dates
- Paid cancellation/refund confirms Stripe first; terminal status and inventory
  release then commit atomically through `transition_booking_terminal_status(...)`
- Auto-generated booking refs: `RA-20260619-XXXX`
- Timestamps auto-set on status transitions

Schema: `supabase/schema.sql`
Booking v2 migration: `supabase/migrations/20260707_booking_system_v2.sql`
Seed data: `supabase/seed_1_categories.sql` → `seed_2_products.sql` → `seed_3_pricing.sql`

### Production Schema Workflow

- Store the production session-pooler connection string only in local `.env.local`
  as `SUPABASE_DB_URL`; never add it to Vercel or expose it to browser code.
- Run `npm run db:audit` before deploying code that depends on schema changes.
- For the multi-market foundation, run `npm run db:preview:markets` first. It applies
  the custom-quote dependency and market migration inside a transaction, validates
  Valencia parity and cross-market guards, and always rolls back.
- For multi-category catalogue discovery, run `npm run db:preview:categories`
  before applying `20260810_product_category_memberships.sql` and
  `20260810_repair_mobility_category_ownership.sql`.
- Product queries that embed the primary category must use the explicit Supabase
  relationship hint `categories!products_category_id_fkey`. The membership table
  creates a second products-to-categories path, so an unqualified embed is ambiguous.
- Apply reviewed additive migrations with
  `npm run db:migrate -- <migration-file.sql>`.
- The migration runner uses a PostgreSQL advisory lock, one transaction per file,
  SHA-256 checksum verification, and `public.app_schema_migrations` as the durable
  application migration ledger. Migrations run manually before 15 July 2026 are
  treated as the audited production baseline rather than fabricated history.
- Run `npm run db:verify` after migration work. Its write checks run inside a
  transaction that is always rolled back.

Multi-market decisions, compatibility boundaries, and second-market launch gates
are documented in `docs/MULTI_MARKET_ARCHITECTURE.md`.

### Bundle Routes
```
GET /valencia/kits
  Data-driven bundle hub for scenario-led rental kits

GET /valencia/kits/[slug]
  SEO landing page for each kit with related products, guides, add-ons, configurator UI, and WhatsApp handoff

GET /es/valencia/kits
  Spanish kit hub with complete parity across all published bundle scenarios

GET /es/valencia/kits/[slug]
  Localized kit detail pages with Spanish product/guide paths and the shared request flow
```

### Bundle Configurator
The bundle configurator collects dates, contact details, area, selected included
items, add-ons, notes, and explicit enquiry consent. `/api/bundle-requests`
validates every selection against the server-side bundle definition, stores the
request before WhatsApp opens, and sends non-blocking admin/customer emails. Staff
manage the resulting lifecycle at `/admin/kit-requests`. Kit requests do not reserve
inventory or create a booking draft yet; availability-aware multi-item drafts remain
the next booking-system iteration.

Spanish kit definitions use localized display names plus canonical `requestName`
values. The configurator submits the canonical English item names expected by the
existing APIs while rendering Spanish labels and responses to customers. This keeps
one server-side validation contract instead of creating locale-specific inventory
identifiers.

`/api/bundle-availability` is the intermediate safety layer. It maps only explicit
`productSlug` links from the static kit definition to active Supabase products,
checks date blocks and overlapping inventory holds, and returns known-item rental
estimates. Ambiguous components remain marked for manual confirmation; the endpoint
does not reserve inventory or promise a final bundle price.

### Booking API v2
```
GET /api/availability
  Accepts legacy start/end dates and v2 startAt/endAt timestamps
  Returns availability, quote, pickup locations, and service zones

POST /api/booking-drafts
  Resolves product and pricing server-side
  Creates a quantity-aware booking_draft and temporary inventory hold

POST /api/checkout
  Required input: draftId
  Creates Stripe Checkout using the stored draft quantity and totals

POST /api/booking-drafts/[id]/cancel
  Expires an open Stripe Checkout session and releases its unpaid inventory hold

POST /api/webhooks/stripe
  Fulfills checkout.session.completed from booking_draft_id
  Creates paid booking and converts hold into a booking inventory block
```

---

## API Routes

### Public
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/bookings` | POST | Retired legacy endpoint; always returns `410 Gone` |
| `/api/checkout` | POST | Create Stripe Checkout only from a server-priced booking draft |
| `/api/checkout/session` | GET | Read a completed Checkout session for the success page |
| `/api/booking-drafts/[id]/cancel` | POST | Cancel an unpaid checkout attempt and immediately release its inventory hold |
| `/api/webhooks/stripe` | POST | Verify Stripe events, create paid bookings, block dates |
| `/api/fulfillment-amendments/[token]` | GET | Read a private transport amendment quote |
| `/api/fulfillment-amendments/[token]/checkout` | POST | Create or resume Stripe Checkout for the quoted transport fee |
| `/api/custom-quotes/[token]` | GET | Read a private, expiring pre-booking custom quote |
| `/api/custom-quotes/[token]/accept` | POST | Confirm customer/address details and atomically create an inventory-held booking draft |
| `/api/contact` | POST | Send contact email via Resend |
| `/api/bundle-requests` | POST | Validate and persist a kit request before WhatsApp handoff |
| `/api/bundle-availability` | POST | Check mapped kit inventory and estimate known-item rental charges |
| `/api/newsletter` | POST | Store newsletter consent + send welcome email |
| `/api/availability` | GET | Check product availability for date range |
| `/api/documents/[token]/pdf` | GET | Customer-safe invoice/refund PDF download |
| `/api/reviews/[token]` | GET, POST | Read and submit one-time post-rental feedback for a completed booking |

### Stripe Webhook Flow
```
Stripe Checkout
  → /api/webhooks/stripe
  → verify Stripe-Signature with STRIPE_WEBHOOK_SECRET
  → checkout.session.completed
  → create paid booking in Supabase
  → block rental dates
  → send booking confirmation email
```
- Stripe should send live webhooks directly to `https://rentandroll.com/api/webhooks/stripe`.
- Webhook signature verification depends on `STRIPE_WEBHOOK_SECRET`; Checkout creation depends on `STRIPE_SECRET_KEY`.
- Booking fulfillment is idempotent by `stripe_payment_intent_id`.
- Email delivery is a follow-up side effect and should not cause duplicate bookings.
- Successful Checkout fulfillment and admin-triggered refunds are recorded in
  `booking_payment_events` when the finance ledger migration is applied. Ledger
  writes are non-blocking, so payment fulfillment does not fail if the table is not
  present yet.
- Successful payment events create issued invoice records in `booking_documents`.
  Successful refund events create issued refund receipt records. Admins can
  download protected PDFs for booking documents from the booking detail panel.
- Customer document emails use tokenized PDF links at `/api/documents/[token]/pdf`;
  these links do not expose admin routes and expire via
  `customer_access_expires_at`.
- Admin manual paid transitions record a `manual` provider payment event and create
  an invoice document, so offline payments still have the same ledger/document flow.

### Admin (require Supabase Auth cookie)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/login` | POST | Authenticate → set httpOnly cookies |
| `/api/admin/logout` | POST | Clear auth cookies |
| `/api/admin/products` | GET, POST | List all products / create new |
| `/api/admin/products/[id]` | PUT, DELETE | Update product / soft-deactivate |
| `/api/admin/products/upload-image` | POST | Upload a product image to Supabase Storage |
| `/api/admin/products/import` | POST | Preview or import a validated CSV catalogue as inactive drafts |
| `/api/admin/products/export` | GET | Download products as CSV (`?status=active|archived|all`) |
| `/api/admin/products/[id]/content` | GET, PUT | Product copy, FAQs, image-rights record, and readiness status |
| `/api/admin/availability` | GET, POST, DELETE | View, block, and unblock product availability dates |
| `/api/admin/bookings` | GET | List bookings (optional status filter) |
| `/api/admin/bookings/[id]` | PUT | Update booking status |
| `/api/admin/bookings/[id]/fulfillment-amendments` | POST | Create a configured-zone or custom transport quote |
| `/api/admin/bookings/[id]/fulfillment-amendments/[amendmentId]` | DELETE | Cancel an unpaid transport quote |
| `/api/admin/bookings/[id]/fulfillment-amendments/[amendmentId]/email` | POST | Email the private quote link to the customer |
| `/api/admin/custom-quotes` | GET, POST | List staff quotes and create a private fixed-price pre-booking quote |
| `/api/admin/custom-quotes/[id]` | PATCH | Cancel an unpaid custom quote and close any active Stripe session |
| `/api/admin/bookings/[id]/inventory-units` | GET, POST, PATCH | List, assign, hand over, return, or release physical units |
| `/api/admin/bookings/[id]/ops-tasks` | PATCH | Toggle internal booking operations checklist tasks |
| `/api/admin/reviews` | GET | List review invitations and submissions for moderation |
| `/api/admin/reviews/[id]` | PUT | Approve or reject submitted feedback; approval requires publication consent |
| `/api/admin/bookings/[id]/documents/[documentId]/pdf` | GET | Download protected invoice/refund PDF |
| `/api/admin/bookings/[id]/documents/[documentId]/email` | POST | Email customer a document PDF link |
| `/api/admin/categories` | GET | List categories (for dropdowns) |
| `/api/admin/bundle-requests` | GET | List and filter private kit requests |
| `/api/admin/bundle-requests/[id]` | PATCH | Update kit-request status and internal notes |

---

## Admin Dashboard (`/admin`)

Protected by Supabase Auth. Server-side cookie check in `admin/layout.tsx` — redirects to `/admin/login` if unauthenticated. Authorization also requires immutable Supabase `app_metadata.role = "admin"`; a valid non-admin user session cannot access admin pages or APIs.

| Page | Features |
|------|----------|
| `/admin` | Stats overview, quick actions, and migration readiness checks |
| `/admin/products` | Product table, catalogue-quality status, active/archived filters, CSV template/export, archive/restore, edit modal (core details, category, image upload/preview, features, specs, stock, pricing tiers) |
| `/admin/products/new` | Full creation form: auto-slug, category dropdown, image upload, dynamic features, key-value specs, pricing tiers |
| `/admin/products/import` | CSV template, row preview/validation, draft-only bulk import |
| `/admin/products/[id]/content` | Locale content editor, product FAQs, image-use record, and readiness checklist |
| `/admin/availability` | Calendar availability manager with selected-date actions plus selected/all-product range blocking |
| `/admin/inventory` | Online-capacity/owned-stock reconciliation plus physical asset registry, condition, location, notes, and inspections |
| `/admin/bookings` | Expandable booking cards, status filters, physical-unit assignment, ops checklist, lifecycle controls |
| `/admin/custom-quotes` | Create, preview, copy, track, and cancel flexible pre-booking quote links |
| `/admin/reviews` | Verified-booking feedback queue with consent-aware approve/reject controls |
| `/admin/kit-requests` | Kit enquiry queue with contact, selection, quote and conversion status |
| `/admin/login` | Supabase Auth email/password login |

---

## i18n Architecture

Prefix-based routing for SEO parity:
- English: `/product/[slug]`, `/rental/[category]`, `/rental/[category]/[family]`, `/valencia`
- Spanish: `/es/product/[slug]`, `/es/rental/[category]`, `/es/rental/[category]/[family]`, `/es/valencia`
- Product-family routes are a governed, code-defined SEO layer. A family owns one
  distinct selection intent, lists only reviewed product slugs, and renders current
  catalogue facts and prices dynamically. Stable guidance lives in
  `src/data/product-families.ts`; inventory counts, named models and prices must not
  be embedded in that static prose.
- Product slug replacements require explicit permanent redirects in
  `next.config.ts` for both English and Spanish paths. Internal editorial and
  bundle references must move to the current slug; redirects preserve existing
  indexed URLs and external links rather than serving a product 404.

| File | Purpose |
|------|---------|
| `src/i18n/getDictionary.ts` | Returns typed dictionary for locale |
| `src/i18n/dictionaries/en.ts` | English translations |
| `src/i18n/dictionaries/es.ts` | Spanish (Castellano) translations |

Components (`Header`, `Footer`) detect locale via `usePathname()` and toggle labels/links.

---

## Key Files Map

| File | Purpose |
|------|---------|
| `src/data/products.ts` | Static product data (build-time fallback) |
| `src/data/product-families.ts` | Governed bilingual family-owner definitions and reviewed product membership |
| `src/data/bundles.ts` | Static kit/bundle definitions for scenario-led rental pages |
| `src/lib/product-service.ts` | Supabase-first product fetching with static fallback |
| `src/lib/product-slug-aliases.ts` | Legacy-to-canonical product lookup during safe URL cutovers |
| `src/lib/product-cache.ts` | Tagged public catalogue cache and immediate admin-write invalidation |
| `src/lib/supabase.ts` | Public Supabase client (anon key, RLS) |
| `src/lib/supabase-admin.ts` | Admin Supabase client (service role, bypasses RLS) |
| `src/lib/admin-auth.ts` | Admin auth verification (cookie → Supabase getUser) |
| `src/lib/queries.ts` | Direct Supabase query functions |

### Public catalogue cache

Homepage, category and product rendering cache successful Supabase product reads
indefinitely under the shared `public-products` tag. There is deliberately no
time-based revalidation interval: catalogue content changes only after an admin
mutation. Cache arguments include city, category, slug and locale, so English and
Spanish responses remain separate. Database failures fall back to static catalogue
data outside the cache and therefore do not poison the cache with fallback results.

Admin create, update, deactivate, import and content-write routes invalidate the
tag immediately with `revalidateTag(..., { expire: 0 })`. Partial product or
content mutations also invalidate before returning an error. Direct database
changes bypass this event and remain cached until an admin mutation invalidates the
tag or a deployment replaces the cache, so catalogue writes must use the admin API.

Product URL replacements remain lookup-compatible in both public product reads and
booking/pricing resolution. This lets an old browser session or a newly deployed
redirect resolve the same product ID during the database-slug cutover; the canonical
catalogue and sitemap publish only the replacement slug.

English and Spanish home, catalogue, category, family, product and sitemap routes
use static/on-demand rendering. Their full-route caches depend on the tagged product
read, so the same admin invalidation expires both the data and generated pages.
Stock, date availability, checkout holds and booking quotes remain request-time API
concerns. The booking widget initializes default dates in the browser so cached
product pages never embed an old calendar date. `npm run audit:cache-policy` rejects
recurring public-route TTLs, time-based product cache expiry and dynamic product
content pages.
The root layout avoids request-bound APIs; middleware supplies `Content-Language`
and a small pre-hydration script keeps the document `lang` attribute aligned with
the `/es` route prefix.
| `src/lib/types.ts` | TypeScript types matching DB schema |
| `src/components/BookingWidget.tsx` | 3-step booking flow (dates → form → success), locale-aware |
| `src/components/admin/AdminShell.tsx` | Admin sidebar layout |

---

## Environment Variables

See `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key (public, RLS)
SUPABASE_SERVICE_ROLE_KEY       # Supabase service role (admin, bypasses RLS)
RESEND_API_KEY                  # Resend email API key
CONTACT_EMAIL                   # Admin notification recipient
FROM_EMAIL                      # Branded sender address
NEXT_PUBLIC_GA_MEASUREMENT_ID   # Google Analytics
CRON_SECRET                     # Vercel Cron Bearer authentication (16+ random characters)
STRIPE_SECRET_KEY               # Stripe server-side API key
STRIPE_WEBHOOK_SECRET           # Stripe webhook signing secret
NEXT_PUBLIC_SITE_URL            # Public site URL for Checkout redirects
```

Analytics event definitions live in `docs/ANALYTICS_SETUP.md`.

Email templates are centralized in `src/lib/email.ts`; deliverability and lifecycle coverage are documented in `docs/EMAIL_DELIVERABILITY.md`.
Newsletter consent records live in `newsletter_subscribers` and are created only through `/api/newsletter` using the server-side service role.
Analytics loads only after explicit browser consent. Operational payment failures are recorded server-side in `system_incidents` and summarized by `/api/admin/health`.
