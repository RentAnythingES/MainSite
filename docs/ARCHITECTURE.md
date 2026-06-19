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
Static data (src/data/products.ts)
  ↓ import at build time
Next.js Server Components (SSG)
  ↓ props
Client Components (BookingWidget, HeroCarousel)
  ↓ fetch
API Routes (/api/bookings, /api/availability)
  ↓ service role client
Supabase (write bookings, check blocked_dates)
```

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
| `categories` | 5 rental categories (baby-gear, mobility, etc.) | Public read |
| `products` | 16 products with specs, features, stock | Public read (active only) |
| `pricing_tiers` | Per-product tiered daily rates (in cents) | Public read |
| `bookings` | Customer bookings with lifecycle status | Admin only |
| `blocked_dates` | Date-level inventory blocking | Admin only |

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
Seed data: `supabase/seed_1_categories.sql` → `seed_2_products.sql` → `seed_3_pricing.sql`

---

## API Routes

### Public
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/bookings` | POST | Create booking + block dates |
| `/api/contact` | POST | Send contact email via Resend |
| `/api/availability` | GET | Check product availability for date range |

### Admin (require Supabase Auth cookie)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/login` | POST | Authenticate → set httpOnly cookies |
| `/api/admin/logout` | POST | Clear auth cookies |
| `/api/admin/products` | GET, POST | List all products / create new |
| `/api/admin/products/[id]` | PUT, DELETE | Update product / soft-deactivate |
| `/api/admin/bookings` | GET | List bookings (optional status filter) |
| `/api/admin/bookings/[id]` | PUT | Update booking status |
| `/api/admin/categories` | GET | List categories (for dropdowns) |

---

## Admin Dashboard (`/admin`)

Protected by Supabase Auth. Server-side cookie check in `admin/layout.tsx` — redirects to `/admin/login` if unauthenticated.

| Page | Features |
|------|----------|
| `/admin` | Stats overview (product count, booking counts), quick actions |
| `/admin/products` | Product table, inline active toggle, edit modal (name, brand, description, stock, pricing tiers with add/remove) |
| `/admin/products/new` | Full creation form: auto-slug, category dropdown, dynamic features, key-value specs, pricing tiers |
| `/admin/bookings` | Expandable booking cards, status filter tabs, lifecycle transition buttons |
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
NEXT_PUBLIC_GA_MEASUREMENT_ID   # Google Analytics
```
