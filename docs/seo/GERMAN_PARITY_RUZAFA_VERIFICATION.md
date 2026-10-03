# Ruzafa verification — incomplete

The complete source-shaped German translation is installed, with original assets and inline formatting verified by `build-german-editorial.cjs` (15 editorial objects: 8 articles and 7 guides). This is not rendering or factual acceptance.

First EN/DE rendering comparison: request aborted; development logs show EN 200 and DE 500 after a German catalogue query timed out. The page contains three category widgets, and each loaded the same catalogue separately.

Changed-condition retry: introduced React's request-scoped cache around the existing approved catalogue loader. This reuses one catalogue snapshot per server render without global caching or changing revision/publication checks. All 9 German release contracts pass after this change. The single allowed rendering retry still aborted.

Do not repeat the Ruzafa render check again in this run. Preserve the complete translation and investigate actual provider/preview state in a later recovery. Continue other useful translation work. The shared neighbourhood hub must not be claimed fully verified or release-ready while this guide check remains incomplete.

Inherited source claims requiring pre-release checks include repeated 20–25-minute walking times to Malvarrosa, Bailén L1 and Xàtiva L7 references, obsolete bus lines, market hours vs the 17:00 itinerary, Valenbisi costs, coworking/monthly-rent prices, 240+ Mbps internet assumptions, cafe laptop policies, and absolute safety/accessibility claims. No factual acceptance claimed.

Later development-log evidence shows the changed-condition retry actually returned EN 200 in 24.9s and DE 200 in 19.8s. The checker retained the first response body until after fetching the second, so the first AbortSignal expired while it was waiting. Checker now reads/saves each body immediately before the next request. This explains the aborted comparison, but establishes neither structure nor image parity; do not rerun Ruzafa a third time in this run. Cache optimization remains justified by the first three-widget duplicate-load failure, and release contracts pass.


## Recovery: production renderer, 2026-10-03

After the next bounded continuation still returned a catalogue timeout, the exact public catalogue request was measured read-only: HTTP 200 in 993 ms, 128 products, 126 German translations, no other locales. Development filesystem-cache writes/compactions were taking 14–70 seconds. Positively identified only this repair’s preview starter, Next dev runner and server on port 3320; stopped that chain and ran a fresh successful production build. The new production renderer passes BIOPARC, Oceanogràfic, historic-centre and City of Arts comparisons. One changed-condition Ruzafa check then passed EN 200 / DE 200, 391 nodes each, identical classes/images, German language and localized internal links. The render blocker is resolved. Inherited source factual issues remain open; no screenshot, full responsiveness, SEO completion or deployment acceptance claimed.
