# RentAnything.es — Frontend Guide
> **Last updated**: 2026-07-07

## Routing
App Router with static generation (`generateStaticParams`). Prefix-based i18n (`/es/` for Spanish).

## Key Pages

### Public (English)
| Route | Type | Source | Hero |
|-------|------|--------|------|
| `/` | Static | `page.tsx` | Photo carousel (3 images) |
| `/valencia` | Static | `page.tsx` | Beach photo background |
| `/product/[slug]` | SSG | `products.ts` data | Product image |
| `/rental/[category]` | SSG | `products.ts` categories | Category photo |
| `/blog/[slug]` | SSG | `blog.ts` data | Blog hero image |
| `/discover` | Static | `page.tsx` | Aerial Valencia photo |
| `/discover/[slug]` | SSG | `destinations.ts` data | Destination hero photo |
| `/contact` | Static + Client | `ContactForm.tsx` | — |
| `/how-it-works` | Static | `page.tsx` | — |

### Public (Spanish — `/es/` prefix)
| Route | Type | Source |
|-------|------|--------|
| `/es` | Static | `es/page.tsx` + `i18n/dictionaries/es.ts` |
| `/es/valencia` | Static | `es/valencia/page.tsx` |
| `/es/product/[slug]` | SSG | Same products, Spanish dictionary |
| `/es/rental/[category]` | SSG | Same categories, Spanish dictionary |

### Admin (protected)
| Route | Type | Purpose |
|-------|------|---------|
| `/admin/login` | Client | Supabase Auth login |
| `/admin` | Server + Client | Dashboard overview |
| `/admin/products` | Client | Product list, edit, toggle |
| `/admin/products/new` | Client | Add new product form |
| `/admin/bookings` | Client | Booking management |

## Component Patterns
- Server Components by default
- `"use client"` only for interactive widgets:
  - `HeroCarousel` — auto-advancing homepage photo carousel
  - `BookingWidget` — booking flow with rental window, availability check, draft creation, and Stripe handoff
  - `ContactForm` — contact form with Resend
  - `Header` / `Footer` — locale-aware navigation (detects `/es/` prefix)
  - `AdminShell` — admin sidebar layout
- Metadata via `generateMetadata()` exports
- Photo-backed cards use the two-layer overlay pattern (see DESIGN.md)

## Key Data Sources
| File | Provides |
|------|----------|
| `src/data/products.ts` | Static product data + helpers (`getProductBySlug`, `getProductsByCategory`) |
| `src/lib/product-service.ts` | Supabase-first product fetching with static fallback |
| `src/content/destinations.ts` | Discover guide data + `ProductWidget` interface |
| `src/content/blog.ts` | Blog post data |
| `src/i18n/dictionaries/es.ts` | Spanish translations for all public pages |

## Product Widget System
Discover guide pages use inline product strips defined in `destinations.ts`:
```ts
interface ProductWidget {
  categorySlug: string;   // pulls all products from this category
  heading: string;        // thematic heading
  afterSection: string;   // which section the strip appears after
}
```
The `[slug]/page.tsx` template resolves widgets via `getProductsByCategory()` and renders compact horizontal strips.

## Booking Flow (BookingWidget)
Online checkout is server-gated by `BOOKINGS_PAUSED`; product widgets still let customers check availability and contact WhatsApp when inventory is blocked.

Normal v2 flow:
1. **Rental window** — Pick start/end date, start/end time, fulfillment mode, and delivery option.
2. **Availability** — `/api/availability` resolves the product server-side and checks stock, blocked dates, and datetime inventory holds.
3. **Details** — Customer enters contact details plus delivery/collection address where required.
4. **Draft** — `/api/booking-drafts` calculates pricing server-side and creates a temporary inventory hold.
5. **Checkout** — `/api/checkout` creates Stripe Checkout from `draftId`; Stripe metadata contains stable server IDs only.
6. **Webhook** — `/api/webhooks/stripe` turns paid drafts into bookings and converts the hold into a booking inventory block.

Falls back to WhatsApp deep-link if checkout cannot be created.
