# RentAnything.es — Design System
> **Last updated**: 2026-06-18

## Colors
- **Brand (Teal)**: `#0E7C73` / Tailwind fallback `teal-600`
- **Secondary Teal**: `#30A596`
- **Accent (Amber)**: `#F59E0B` / `amber-500`
- **Warm Cream**: `#FFF3E0`
- **Soft Grey**: `#8E9BA3`
- **Ink**: `#1F2937`
- **Background**: `#fafafa` (neutral-50)
- **Card borders**: `#e5e7eb` (neutral-200)
- **Text on photos**: Always white with `text-shadow` — never dark text on photo backgrounds


## Brand Assets
- Source concept sheet: `docs/Home.png`
- Transparent icon: `public/brand/rentanything-icon.png`
- Rounded app icon: `public/brand/rentanything-app-icon.png`
- Next app icons: `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`
- Header uses the transparent suitcase-house icon alongside the wordmark text.

## Typography
- **Headings**: Outfit (Google Fonts) — inherits color from context (no hardcoded color)
- **Body**: Inter (Google Fonts)

## Photography & Overlays

All photo-backed sections use the **two-layer overlay pattern**:

```html
<!-- Layer 1: uniform darkening (guarantees minimum contrast) -->
<div class="absolute inset-0 bg-black/50" />
<!-- Layer 2: gradient for extra depth at bottom -->
<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
```

> ⚠️ **CRITICAL**: Never use a gradient-only overlay. Bright image areas (sky, buildings) will wash out text.
> Always start with a flat `bg-black/50` base.

Text on photo backgrounds always gets `style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}`.

### Image assets
| Directory | Purpose |
|-----------|---------|
| `public/hero/` | Homepage carousel images (3 Valencia scenes) |
| `public/categories/` | Category card lifestyle photos (6 categories) |
| `public/discover/` | Discover guide hero images (per destination) |
| `public/discover/hubs/` | Discover hub category photos (4 hub types) |
| `public/products/` | Product images (16 products) |

## Components
- `card` — rounded-2xl, border, shadow-sm
- `btn btn-primary` — teal gradient CTA
- `btn btn-outline` — bordered secondary
- `container-site` — max-w-7xl mx-auto px-4
- `HeroCarousel` — Client component, auto-advancing photo carousel (5s interval, opacity crossfade)
- `ProductCard` — Reusable product display card
- `BundleCard` — Photo-backed scenario card for rental kits
- `DestinationMap` — Schematic Valencia city/region explorer with numbered markers, accessible controls, and a linked detail card

## Photo Card Pattern (categories, hubs, discover)
```tsx
<div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
  <Image src={...} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 p-4">
    <h3 className="text-white font-bold" style={{ textShadow: '...' }}>Title</h3>
    <p className="text-white/80 text-xs">Description</p>
  </div>
</div>
```

## Product Widget Strips (Discover pages)
Compact, category-based horizontal scrolling strips that appear between content sections:
- Pull up to four product previews from a `categorySlug` automatically
- 144px square thumbnails with hover scale
- Thematic heading + "View all →" link
- The category link names the full result count so the complete catalogue remains discoverable
- Placed contextually: mobility after accessibility, baby gear after food, remote work after "staying here"
- **Never stack two strips back-to-back** — always separated by content


