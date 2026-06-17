# Agent Instructions — RentAnything.es

> [!CAUTION]
> **WORK IN SMALL CHUNKS.** Break all work into incremental steps that complete in under 60 seconds. Never attempt large one-shot generations. Report progress after each chunk. This applies to documentation, code changes, and research equally.

## Overview
This workspace contains **RentAnything.es** — an equipment rental platform for tourists, families, and digital nomads visiting Valencia, Spain. Built with Next.js 15 (App Router), Tailwind CSS 4, Supabase, and Resend.

**Business**: Escalera Labs S.L. · Valencia, Spain
**Domain**: rentanything.es
**Stack**: Next.js 15 · Tailwind 4 · Supabase · Resend · Vercel

---

## Workflow — Plan → Build → Test → Summarize

Every task follows this cycle:

1. **Plan** — Understand the requirement. Check docs. Create a plan for non-trivial work.
2. **Build** — Implement in small incremental chunks (<60s each).
3. **Test** — `npx next build` must pass. Verify locally when possible.
4. **Summarize** — Update relevant documentation with learnings and changes.

---

## Documentation Map (MANDATORY)

> [!CAUTION]
> **Every document below has a purpose and a trigger.** Read the "When to read" column. If your task matches a trigger, you MUST read the doc BEFORE writing code or copy.

### Project Core

| Document | Path | When to read |
|----------|------|-------------|
| **Architecture** | `docs/ARCHITECTURE.md` | Before changing data flow, adding API routes, or modifying Supabase schema |
| **Design System** | `docs/DESIGN.md` | Before creating UI components or changing visual styling |
| **Frontend Guide** | `docs/FRONTEND.md` | Before adding pages, changing routing, or modifying component patterns |
| **Product Sense** | `docs/PRODUCT_SENSE.md` | Before writing ANY user-facing copy or making product decisions |

### Brand & Copy

**Key brand rules (always apply):**
- **Friendly + Trustworthy** tone. We talk to families, elderly, and nomads. Like a caring, knowledgeable friend who lives in Valencia.
- **Lead with convenience and trust**, not price. Our moat = local expertise + premium brands + door-to-door delivery.
- **Never use fake urgency** — ❌ "Only 2 left!" ❌ "Book NOW!" → ✅ "Check availability for your dates"
- **Never disparage competitors** — acknowledge alternatives exist, explain why we're different
- **Core value props (rank order)**: Convenience → Trust → Savings → Local expertise
- **Valencia-first** — Always ground copy in local context (Malvarrosa, Turia Gardens, Ciudad de las Artes)

### SEO Strategy & Tracking

| Document | Path | When to update |
|----------|------|---------------|
| **SEO Strategy** | `docs/seo/SEO_STRATEGY.md` | After any page count change, cluster restructure, or audit |
| **SEO Roadmap** | `docs/seo/SEO_ROADMAP.md` | After completing any roadmap item or discovering new issues |
| **Blog Content Strategy** | `docs/seo/BLOG_CONTENT_STRATEGY.md` | Before writing or reviewing ANY blog post |
| **Competitor Reference** | `docs/seo/COMPETITOR_REFERENCE.md` | When performing fresh competitor crawls — ALL crawl data goes here |

### Localization (i18n)

RentAnything serves two primary languages: **English** (international tourists, digital nomads) and **Spanish** (domestic + LATAM visitors).

> [!IMPORTANT]
> i18n infrastructure is not yet implemented. When it is, per-locale translation reference docs will live at `docs/seo/{LOCALE}_TRANSLATION_REFERENCE.md`.

---

## Content Architecture

### Data-Driven Pages
Product data lives in `src/data/products.ts`. Templates render from this data.

| Content Source | Template | Count |
|---------------|----------|-------|
| `products.ts` | `product/[slug]/page.tsx` | 16 products |
| `products.ts` (categories) | `rental/[category]/page.tsx` | 5 categories |
| `blog.ts` (planned) | `blog/[slug]/page.tsx` | 4 posts (planned) |

### Adding New Products
1. Add the data entry to `src/data/products.ts`
2. The template auto-renders it (no new page file needed)
3. The sitemap auto-includes it
4. Add a product image to `public/products/`
5. Update `supabase/seed_2_products.sql` with the database row
6. Update `docs/seo/SEO_STRATEGY.md` with new counts

### Adding Blog Posts
1. Add the entry to `src/content/blog.ts` (data-driven, auto-publishes by date)
2. Generate a hero image and save to `public/blog/{slug}/`
3. Include: title ≤60 chars, description 130-155 chars, keywords, FAQs, cross-links
4. Verify with `npx next build`

---

## SEO Change Checklist

After any SEO-related code change, verify:

- [ ] **Sitemap**: `src/app/sitemap.ts` includes all new routes
- [ ] **Titles**: All title tags ≤60 characters, include primary keyword
- [ ] **Canonicals**: Set in `generateMetadata()`
- [ ] **JSON-LD**: Product pages have structured data, blog posts have Article schema
- [ ] **Internal links**: Every page links to ≥2 other sections of the site
- [ ] **SEO Strategy doc**: Updated with new page counts and status changes
- [ ] **Build**: `npx next build` passes with zero errors

---

## Research Persistence Rule (MANDATORY)

> [!CAUTION]
> **NEVER discard research.** If you crawl a competitor page, analyze content structure, or gather any SEO/keyword data, you MUST save it to the appropriate doc in `docs/seo/` BEFORE moving on. Conversation context is ephemeral — project docs are permanent. Research that isn't persisted is wasted.

---

## CI/CD Rules

> [!CAUTION]
> **Git identity**: Always push as `Johannes Schiefer <johannes.schiefer1@gmail.com>`. Verify with `git config user.email` before pushing. Vercel will reject pushes from other identities.

1. **Build before pushing** — Always run `npx next build` and verify it passes before any git push.
2. **Batch commits** — Combine related fixes into a SINGLE commit. Don't push 5 incremental commits that trigger 5 Vercel builds.
3. **Descriptive commit messages** — Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.
4. **Never push secrets** — `.env` is in `.gitignore`. Use `.env.example` as the template.

---

## Build & Deploy

```bash
cd f:\rentanything
npm run dev          # Local development (port 3000)
npx next build       # Production build (verify before commit)
git push             # Auto-deploys to Vercel
```

Always run `npx next build` before pushing to verify no build errors.

---

## Design System Quick Reference

- **Primary**: Teal (`#0d9488` / teal-600)
- **Accent**: Amber (`#f59e0b` / amber-500)
- **Background**: Neutral-50 (`#fafafa`)
- **Fonts**: Outfit (headings), Inter (body)
- **Cards**: `card` class — rounded-2xl, border, shadow-sm
- **CTAs**: `btn btn-primary` — teal gradient
- **Layout**: `container-site` — max-w-7xl centered

See `docs/DESIGN.md` for full details.
