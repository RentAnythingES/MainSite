# RentAnything.es — Architecture
> **Last updated**: 2026-06-19

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (admin dashboard)
- **Email**: Resend
- **Hosting**: Vercel
- **Domain**: rentanything.es
- **i18n**: Custom dictionary system (`src/i18n/`)

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
API Routes (/api/bookings, /api/availability)
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
| `products` | 16 products with specs, features, stock | Public read (active only) |
| `pricing_tiers` | Per-product tiered daily rates (in cents) | Public read |
| `bookings` | Customer bookings with lifecycle status | Admin only |
| `blocked_dates` | Date-level inventory blocking | Admin only |
| `pickup_locations` | Customer pickup options | Public read active |
| `service_zones` | Valencia delivery/collection zones and fees | Public read active |
| `booking_drafts` | Pre-payment booking drafts and Stripe Checkout source of truth | Admin/API only |
| `booking_inventory_blocks` | Datetime inventory holds and paid booking blocks | Admin/API only |
| `booking_payment_events` | Durable payment/refund/deposit ledger for bookings | Admin/API only |
| `booking_documents` | Invoice, refund receipt, and rental agreement document records | Admin/API only |
| `booking_document_counters` | Yearly sequential counters for booking document numbers | Admin/API only |
| `booking_ops_tasks` | Internal per-booking operations checklist tasks | Admin/API only |
| `newsletter_subscribers` | Newsletter signup consent records | Admin/API only |
| `product_localizations` | Locale-specific product copy and SEO metadata | Public read for active products |
| `product_faqs` | Locale-specific pre-rental product FAQs | Public read for active products |
| `product_images` | Product image alt text, source, rights status, and ordering | Public read for active products |

### Storage
| Bucket | Purpose | Access |
|--------|---------|--------|
| `product-images` | Admin-uploaded product photos | Public read, admin API writes via service role |

Inventory holds are reserved via the `reserve_booking_inventory(...)` database
function so overlapping draft creation is checked while the product row is locked.
The function is `SECURITY DEFINER` only because it performs that atomic lock and
write; execution is restricted to the `service_role` used by the server-side
booking draft API. Product images use a public Storage bucket for CDN delivery,
without a public `storage.objects` listing policy.

Fulfillment configuration stores both public instructions and internal operations
notes. The additive migration `20260709_fulfillment_instruction_config.sql` adds
customer instructions, lead-time fields, delivery/collection windows, and internal
notes for pickup locations and service zones. API reads are backward-compatible and
fall back to the older column set until that migration is applied.

### Booking Lifecycle
```
pending → confirmed → paid → delivering → active → returning → completed
                  ↘ cancelled
                            ↘ refunded
```
- Cancellation/refund auto-releases blocked dates
- Auto-generated booking refs: `RA-20260619-XXXX`
- Timestamps auto-set on status transitions

Schema: `supabase/schema.sql`
Booking v2 migration: `supabase/migrations/20260707_booking_system_v2.sql`
Seed data: `supabase/seed_1_categories.sql` → `seed_2_products.sql` → `seed_3_pricing.sql`

### Bundle Routes
```
GET /valencia/kits
  Data-driven bundle hub for scenario-led rental kits

GET /valencia/kits/[slug]
  SEO landing page for each kit with related products, guides, add-ons, configurator UI, and WhatsApp handoff
```

### Bundle Configurator
The first bundle configurator is client-side only. It collects dates, area, selected included items, add-ons, and notes, then generates a structured WhatsApp message. It does not reserve inventory or create a booking draft yet. Future work should connect bundle selections to availability checks, multi-item booking drafts, and admin request visibility.

### Booking API v2
```
GET /api/availability
  Accepts legacy start/end dates and v2 startAt/endAt timestamps
  Returns availability, quote, pickup locations, and service zones

POST /api/booking-drafts
  Resolves product and pricing server-side
  Creates a booking_draft and temporary inventory hold

POST /api/checkout
  Preferred input: draftId
  Creates Stripe Checkout using the stored draft totals

POST /api/webhooks/stripe
  Fulfills checkout.session.completed from booking_draft_id
  Creates paid booking and converts hold into a booking inventory block
```

---

## API Routes

### Public
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/bookings` | POST | Create booking + block dates |
| `/api/checkout` | POST | Create Stripe Checkout session for paid bookings |
| `/api/checkout/session` | GET | Read a completed Checkout session for the success page |
| `/api/webhooks/stripe` | POST | Verify Stripe events, create paid bookings, block dates |
| `/api/contact` | POST | Send contact email via Resend |
| `/api/newsletter` | POST | Store newsletter consent + send welcome email |
| `/api/availability` | GET | Check product availability for date range |
| `/api/documents/[token]/pdf` | GET | Customer-safe invoice/refund PDF download |

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
- Stripe should send live webhooks to `https://www.rentanything.es/api/webhooks/stripe`; the apex domain redirects and should not be used for webhook delivery.
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
| `/api/admin/products/[id]/content` | GET, PUT | Product copy, FAQs, image-rights record, and readiness status |
| `/api/admin/availability` | GET, POST, DELETE | View, block, and unblock product availability dates |
| `/api/admin/bookings` | GET | List bookings (optional status filter) |
| `/api/admin/bookings/[id]` | PUT | Update booking status |
| `/api/admin/bookings/[id]/ops-tasks` | PATCH | Toggle internal booking operations checklist tasks |
| `/api/admin/bookings/[id]/documents/[documentId]/pdf` | GET | Download protected invoice/refund PDF |
| `/api/admin/bookings/[id]/documents/[documentId]/email` | POST | Email customer a document PDF link |
| `/api/admin/categories` | GET | List categories (for dropdowns) |

---

## Admin Dashboard (`/admin`)

Protected by Supabase Auth. Server-side cookie check in `admin/layout.tsx` — redirects to `/admin/login` if unauthenticated.

| Page | Features |
|------|----------|
| `/admin` | Stats overview, quick actions, and migration readiness checks |
| `/admin/products` | Product table, catalogue-quality status, active/archived filters, archive/restore, edit modal (core details, category, image upload/preview, features, specs, stock, pricing tiers) |
| `/admin/products/new` | Full creation form: auto-slug, category dropdown, image upload, dynamic features, key-value specs, pricing tiers |
| `/admin/products/import` | CSV template, row preview/validation, draft-only bulk import |
| `/admin/products/[id]/content` | Locale content editor, product FAQs, image-use record, and readiness checklist |
| `/admin/availability` | Calendar availability manager with selected-date actions plus selected/all-product range blocking |
| `/admin/bookings` | Expandable booking cards, status filter tabs, ops checklist, lifecycle transition buttons |
| `/admin/login` | Supabase Auth email/password login |

---

## i18n Architecture

Prefix-based routing for SEO parity:
- English: `/product/[slug]`, `/rental/[category]`, `/valencia`
- Spanish: `/es/product/[slug]`, `/es/rental/[category]`, `/es/valencia`

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
| `src/data/bundles.ts` | Static kit/bundle definitions for scenario-led rental pages |
| `src/lib/product-service.ts` | Supabase-first product fetching with static fallback |
| `src/lib/supabase.ts` | Public Supabase client (anon key, RLS) |
| `src/lib/supabase-admin.ts` | Admin Supabase client (service role, bypasses RLS) |
| `src/lib/admin-auth.ts` | Admin auth verification (cookie → Supabase getUser) |
| `src/lib/queries.ts` | Direct Supabase query functions |
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
BOOKINGS_PAUSED                 # Server-side online booking kill switch
NEXT_PUBLIC_BOOKINGS_PAUSED     # Client-side booking widget kill switch
STRIPE_SECRET_KEY               # Stripe server-side API key
STRIPE_WEBHOOK_SECRET           # Stripe webhook signing secret
NEXT_PUBLIC_SITE_URL            # Public site URL for Checkout redirects
```

Analytics event definitions live in `docs/ANALYTICS_SETUP.md`.

Email templates are centralized in `src/lib/email.ts`; deliverability and lifecycle coverage are documented in `docs/EMAIL_DELIVERABILITY.md`.
Newsletter consent records live in `newsletter_subscribers` and are created only through `/api/newsletter` using the server-side service role.
