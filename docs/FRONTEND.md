# RentAnything.es — Frontend Guide
> Status: 🔲 Scaffold — to be populated

## Routing
App Router with static generation (`generateStaticParams`).

## Key Pages
| Route | Type | Source |
|-------|------|--------|
| `/` | Static | `page.tsx` |
| `/product/[slug]` | SSG | `products.ts` data |
| `/rental/[category]` | SSG | `products.ts` categories |
| `/blog/[slug]` | SSG | `blog.ts` data (planned) |
| `/contact` | Static + Client | `ContactForm.tsx` |

## Component Patterns
- Server Components by default
- `"use client"` only for interactive widgets (BookingWidget, ContactForm)
- Metadata via `generateMetadata()` exports
