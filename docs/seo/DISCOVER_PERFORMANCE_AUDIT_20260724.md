# Discover Guide Performance Audit — 24 July 2026

## Scope

The production performance-budget audit checks representative commercial,
product, kit, and Discover pages against raw HTML, compressed transfer, script,
stylesheet, image-preload, and response-time budgets.

## Finding

`/discover/malvarrosa-beach` was the only failing route. Its HTML response was
181,413 bytes against the 150,000-byte budget. Transfer size, scripts,
stylesheets, preloaded imagery, and response time all remained within budget.

The guide rendered two category widgets containing 20 product cards in total.
The product service correctly returned the complete active categories, but
embedding every item in a contextual guide caused HTML to grow whenever the
catalogue expanded.

## Resolution

English Discover product strips now render up to four representative product
previews per widget and retain a category link labelled with the complete active
result count. Category pages remain the full transactional result owners.
Spanish Discover guides already use a bounded commercial category callout rather
than embedding product-card strips.

The optimized production-build artifact for Malvarrosa is 122,143 bytes, a
59,270-byte (32.7%) reduction from the live pre-fix response and safely below the
150,000-byte budget.

## Guardrail

`npm run audit:performance` remains the regression check. It must pass against
production after deployment so catalogue growth cannot silently push a
representative guide beyond the HTML budget again.
