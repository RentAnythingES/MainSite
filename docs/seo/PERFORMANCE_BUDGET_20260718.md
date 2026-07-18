# Production Performance Budget

> Baseline date: 2026-07-18

## Purpose

Core Web Vitals field telemetry identifies real-user regressions after traffic has
accumulated. The production budget audit provides an immediate deployment check
for the page weight, first-party assets, caching and response latency that most
directly influence those metrics.

Run:

```bash
npm run audit:performance
```

The default audit covers the homepage plus representative category, product, kit
and Discover guide templates.

## Enforced budgets

| Measure | Budget |
|---------|--------|
| HTML per page | 120,000 bytes |
| First-party JavaScript per page | 800,000 bytes |
| First-party CSS per page | 120,000 bytes |
| Largest preloaded image | 150,000 bytes |
| Document response time | 2,000 ms warning threshold |

The audit also fails if a document or discovered first-party resource returns an
error, or if a Next.js static chunk is missing immutable caching.

## Initial production baseline

Five templates passed every hard budget:

- Maximum HTML: 90,969 bytes
- Maximum first-party JavaScript: 706,069 bytes
- Maximum CSS: 81,165 bytes
- Maximum preloaded image: 75,935 bytes
- Maximum response time in the saved baseline: 1,997 ms

An earlier calibration run recorded 2,260 ms for the category template and
produced the only warning. Investigation found that public
catalogue list reads enriched every eligible product with three separate Supabase
queries. A category containing 20 eligible products therefore caused 60 optional
content requests after the core catalogue query.

`src/lib/product-service.ts` now fetches localizations, FAQs and primary images in
three batched requests for the complete result set. This keeps catalogue changes
immediately visible—unlike a time-based page cache—while removing the N+1 request
pattern from homepage and category rendering.

The follow-up optimization adds a five-minute tagged server-data cache and removes
the separate category-ID lookup. Successful admin product and editorial writes
expire the shared tag immediately, including partial-write error paths. Repeated
public requests therefore avoid Supabase latency without delaying normal backend
updates; the TTL only protects against changes made directly in the database.

The cold catalogue path now embeds localizations, FAQs and the approved primary
image in the core PostgREST query. This reduces an uncached category render from
four Supabase round trips to one. A production-build test against live Supabase
recorded 704 ms for the first category request and 117-125 ms for the next two
requests; all returned the expected five live Travel & Outdoors products.

Production still recorded 2,084 ms for a cold dynamic category invocation despite
the faster database path, while ten warm requests averaged 330 ms. Category pages
therefore now use five-minute static regeneration. The generated response carries
`s-maxage=300`, retains immediate tag-based invalidation after admin changes, and
keeps English and Spanish `Content-Language` responses separate. This removes the
serverless cold start from normal category-page delivery.

Machine-readable baseline: `docs/seo/performance-budget-live-20260718.json`.

## Post-deployment verification

After commit `0106e88` reached production, the same five-template audit passed
with zero errors and zero warnings. The category response improved from 1,997 ms
in the saved baseline to 1,248 ms, while the slowest document across all five
templates was 1,400 ms. These are individual network samples rather than a field
percentile, so GA4 Core Web Vitals remains the source for long-term user-impact
assessment.

## Interpreting results

Response latency is intentionally a warning because a single remote request can
reflect network variance or a cold server. Investigate repeated warnings across
several runs. Asset and cache violations are deterministic and fail immediately.
Use GA4 `web_vital` field data to confirm whether lab-budget changes improve LCP,
INP and CLS for actual visitors.
