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
| `/valencia/kits` | Static | `bundles.ts` data | Photo-backed kit cards |
| `/valencia/kits/[slug]` | SSG | `bundles.ts` data | Kit hero image |
| `/product/[slug]` | Dynamic | Supabase via `product-service.ts` | Product image |
| `/rental/[category]` | Dynamic | Supabase via `product-service.ts` | Category photo |
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
| `/admin/products` | Client | Product list, edit, archive/restore, active/archived filters |
| `/admin/products/new` | Client | Add new product form |
| `/admin/fulfillment` | Client | Pickup locations, service zones, instructions, fees |
| `/admin/bookings` | Client | Booking management, finance ledger, document PDF downloads and email resend controls |

## Component Patterns
- Server Components by default
- `"use client"` only for interactive widgets:
  - `HeroCarousel` — auto-advancing homepage photo carousel
  - `BookingWidget` — booking flow with rental window, availability check, draft creation, and Stripe handoff
  - `BundleConfigurator` — kit request builder with selectable included items/add-ons and WhatsApp handoff
  - `ContactForm` — contact form with Resend
  - `NewsletterSignup` — newsletter consent capture with `/api/newsletter`
  - `Header` / `Footer` — locale-aware navigation (detects `/es/` prefix)
  - `AdminShell` — admin sidebar layout
- Metadata via `generateMetadata()` exports
- Photo-backed cards use the two-layer overlay pattern (see DESIGN.md)

## Key Data Sources
| File | Provides |
|------|----------|
| `src/data/products.ts` | Static product data + helpers (`getProductBySlug`, `getProductsByCategory`) |
| `src/data/bundles.ts` | Static kit/bundle data + helpers (`getBundleBySlug`, `getBundleProducts`) |
| `src/lib/product-service.ts` | Supabase-first product fetching with static fallback |
| `src/content/destinations.ts` | Discover guide data + `ProductWidget` interface |
| `src/content/blog.ts` | Blog post data |
| `src/i18n/dictionaries/es.ts` | Spanish translations for all public pages |

Product images from Supabase must be either site-relative paths such as
`/products/example.png` or public `https://` URLs. Local filesystem paths are
rejected in admin APIs and normalized to the placeholder image on public pages.
In the admin product UI, images are upload-only: staff should use the image
picker, which stores the file in the `product-images` Supabase Storage bucket
and saves the returned public URL.
The upload API validates the file signature against its declared image type, then
checks that Supabase serves the new public URL as an image before returning it to
the admin UI. Failed verification removes only the just-uploaded storage object.
Next image optimisation explicitly allows public Supabase Storage URLs under
`/storage/v1/object/public/`. Product and subcategory slugs are validated by
the admin API to use lowercase letters, numbers, and hyphens only.

`/admin/products/import` provides a CSV template and previews every row before
import. Imported and manually created products are always inactive drafts.
Staff must upload an image, complete content review, and mark the product
`content_ready` before the admin can activate it.

`/admin/products/[id]/content` is the editorial workflow for product content.
It stores English and Spanish page copy, FAQs, SEO snippets, and the primary
image's alt text/source/rights status. It requires
`supabase/migrations/20260711_product_content_readiness.sql` before use.
Public product pages use those fields only when a product is explicitly marked
`content_ready`; drafts and fact-review records never replace current live copy,
metadata, FAQs, or image alt text. If the additive content tables are unavailable,
the existing product data remains the safe fallback.
The product list displays core rental setup separately from the editorial state:
`Content draft`, `Facts verified`, or `Content ready`.

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
1. **Booking options** — `/api/booking-options` loads active pickup locations and service zones from Supabase.
2. **Rental window** — Pick start/end date, start/end time, fulfillment mode, pickup location or delivery/collection zones, and delivery option.
3. **Availability** — `/api/availability` resolves the product server-side and checks stock, blocked dates, datetime inventory holds, and server pricing.
4. **Details** — Customer enters contact details plus delivery/collection address where required.
5. **Draft** — `/api/booking-drafts` calculates pricing server-side and creates a temporary inventory hold.
6. **Checkout** — `/api/checkout` creates Stripe Checkout from `draftId`; Stripe metadata contains stable server IDs only.
7. **Webhook** — `/api/webhooks/stripe` turns paid drafts into bookings and converts the hold into a booking inventory block.

Falls back to WhatsApp deep-link if checkout cannot be created.


## Bundle configurator flow

Kit pages at `/valencia/kits/[slug]` include a client-side `BundleConfigurator`. It lets users choose dates, accommodation area, included items, optional add-ons, and notes. The first version does not reserve inventory or create checkout sessions; it generates a structured WhatsApp request and tracks `bundle_configurator_whatsapp_click`. Future iterations should connect selections to multi-item availability, booking drafts, and admin visibility.


## Newsletter signup flow

`NewsletterSignup` posts email, source, locale, and explicit consent to `/api/newsletter`. The API stores a consent record in `newsletter_subscribers`, including consent text/version, source, IP, user agent, active status, and unsubscribe token, then sends `sendSignupWelcome`. The form is currently used on `/blog`.
