# RentAnything.es — Frontend Guide
> **Last updated**: 2026-06-18

## Routing
App Router with static generation (`generateStaticParams`).

## Key Pages
| Route | Type | Source | Hero |
|-------|------|--------|------|
| `/` | Static | `page.tsx` | Photo carousel (3 images) |
| `/valencia` | Static | `page.tsx` | Beach photo background |
| `/product/[slug]` | SSG | `products.ts` data | Product image |
| `/rental/[category]` | SSG | `products.ts` categories | — |
| `/blog/[slug]` | SSG | `blog.ts` data | — |
| `/discover` | Static | `page.tsx` | Aerial Valencia photo |
| `/discover/[slug]` | SSG | `destinations.ts` data | Destination hero photo |
| `/contact` | Static + Client | `ContactForm.tsx` | — |

## Component Patterns
- Server Components by default
- `"use client"` only for interactive widgets:
  - `HeroCarousel` — auto-advancing homepage photo carousel
  - `BookingWidget` — date picker + pricing calculator
  - `ContactForm` — contact form with Resend
- Metadata via `generateMetadata()` exports
- Photo-backed cards use the two-layer overlay pattern (see DESIGN.md)

## Key Data Sources
| File | Provides |
|------|----------|
| `src/data/products.ts` | Product data + helpers (`getProductBySlug`, `getProductsByCategory`) |
| `src/content/destinations.ts` | Discover guide data + `ProductWidget` interface |
| `src/content/blog.ts` | Blog post data |

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
