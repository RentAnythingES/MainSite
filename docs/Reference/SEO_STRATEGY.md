# VoiceChanger.Live — SEO Strategy & Audit
> **Last updated**: 2026-06-16 · **Build**: ✅ Clean · **Total indexed pages**: ~2,500+ (13 locales)

This is the **living SEO strategy document** for voicechanger.live. It is updated after every SEO-related change. For the full roadmap of prioritized fixes, see [SEO_ROADMAP.md](./SEO_ROADMAP.md).

---

## Quick Reference

| Document | Purpose |
|----------|---------|
| **This file** (`SEO_STRATEGY.md`) | Current site state, metrics, cluster health |
| [SEO_ROADMAP.md](./SEO_ROADMAP.md) | Prioritized action items and fixes |
| [COMPETITOR_REFERENCE.md](./COMPETITOR_REFERENCE.md) | Crawl-verified Voicemod + Voice.ai page data |
| [MULTILINGUAL_KEYWORD_STRATEGY.md](./MULTILINGUAL_KEYWORD_STRATEGY.md) | Per-language keyword targets |

---

## Site Architecture

```
voicechanger.live/
├── /                           Homepage (SoftwareSchema JSON-LD)
├── /download                   Download page (SoftwareSchema JSON-LD)
│
├── /tools/                     Tools hub (14 browser-based audio tools)
│   └── /tools/[tool]           14 pages
│
├── /voices/                    Voice library hub
│   ├── /voices/[voice]         84 individual voice pages (DSP + RVC + iOS)
│   ├── /voices/anime           Category: anime characters
│   ├── /voices/scary           Category: horror voices
│   ├── /voices/celebrity       Category: celebrity parody
│   ├── /voices/gaming          Category: gaming tactical
│   ├── /voices/girl            Category: girl/female voices (NEW — 12K+ vol keyword)
│   └── /voices/rvc-community   Category: community RVC models
│
├── /apps/                      Platform hub
│   └── /apps/[platform]        31 pages: discord, valorant, obs, zoom...
│
├── /use/                       Use case hub
│   └── /use/[usecase]          6 pages: gaming, streaming, pc, mac, content-creators, dnd
│
├── /hub/                       Knowledge hub
│   └── /hub/[article]          9 articles: what-is-rvc, dsp-effects-explained, voice-changer-for-roleplay...
│
├── /compare/                   Comparison hub
│   └── /compare/[competitor]   5 pages (1 indexed: vs-okada)
│
├── /blog/                      Blog
│   └── /blog/[slug]            31 posts (19 live, 12 scheduled)
│
├── /ai-voice-changer           KW authority page (30K+ vol) — ~1,200w editorial
├── /free-voice-changer         ⛔ KILLED — 301 → /ai-voice-changer (2026-05-30)
├── /real-time-voice-changer    ⛔ KILLED — 301 → /ai-voice-changer (2026-05-30)
│
├── /faq                        Global FAQ
├── /signin                     Auth
├── /privacy                    Legal
└── /terms                      Legal
```

### Product Feature Pages (NEW)
| Page | Target Keyword | Est. Volume | Status |
|------|---------------|-------------|--------|
| `/soundboard` | soundboard app | 10K+ | ✅ Live |
| `/voice-cloning` | voice cloning | 8K+ | ✅ Live |
| `/voicelab` | voice lab, voice effects | 3K+ | ✅ Live |

---

## Cluster Health

### 🔧 Tools (13 pages) — ✅ Complete
- All pages have: useCases (3-6 cards), seoSections (H2 prose), relatedTools (4-5 grid), open FAQ prose (first 3), cross-cluster links (hub + download)
- Titles: all ≤60 chars with `| Echo` suffix
- Sitemap: dynamic via `getAllToolSlugs()`

### 🎭 Voices (84 individual + 6 category pages) — ✅ Complete
- Open FAQ prose (first 2 visible), cross-cluster links, related voices grid
- Category hubs: anime, scary, celebrity, gaming, girl, rvc-community
- All 6 category pages have editorial H2 prose sections, open FAQ prose, and cross-cluster links
- Includes iOS app voices and RVC community voices
- Sitemap: dynamic via `getAllVoiceSlugs()`

### 📱 Apps/Platforms (31 pages) — ✅ Complete
- Unique intro, setup guide, tech explainer, open FAQ prose (first 2)
- Related platforms grid, related content links
- Sitemap: ✅ dynamic via `getAllPlatformSlugs()`

### 🎯 Use Cases (6 pages) — ✅ Complete
- Long-form editorial, pain points, features, tech explainer
- Open FAQ prose (first 2), related content links
- Sitemap: dynamic via `getAllUseCaseSlugs()`

### 📚 Knowledge Hub (9 articles) — ✅ AAA+ Hardened
- 9 articles live (3 new added 2026-05-19: RVC training, DSP effects, roleplay)
- **RVC cluster upgraded to AAA+ (May 28)**: `what-is-rvc`, `how-to-train-rvc-model`, `voice-model-guide` all rewritten with verified technical data (UVR5 pipeline, f0 methods, VRAM scaling, model file types, evaluation criteria)
- `best-voice-changers` upgraded: added Voice.ai, Vonovox, corrected w-okada positioning, expanded to 6 FAQs
- `how-voice-changers-work` upgraded: added audio routing, processing pipeline, latency, GPU sections, 6 FAQs
- All virtual microphone references corrected to accurately reference VB-Cable/BlackHole requirement
- Primary cross-link targets from tools and voice pages
- Hub articles linked in footer Learn section

### ⚔️ Comparisons (5 pages) — ⚠️ Noindex (partially revised)
- Feature matrices, switching reasons, open FAQ prose
- Currently `robots: { index: false }` — content needs full review before enabling
- **vs-okada page corrected (May 28)**: removed 2 false "built-in virtual mic" claims, added "Model Architectures" row (RVC-only vs multi-model), updated positioning to "scope vs polish" framing, rewrote hero subtitle and FAQs
- Other 4 comparison pages still need audit before indexing

### ✍️ Blog (31 posts — 19 live, 12 scheduled) — ✅ On cadence
- Expanded from 11 → 31 posts since May
- Scheduled posts auto-publish on date
- Blog localization infrastructure complete (locale-aware static params, hreflang)
- Blog JSON-LD structured data (Article schema + FAQ schema + iOS App schema)

---

## Technical SEO Checklist

| Item | Status | Notes |
|------|--------|-------|
| Sitemap | ✅ Fully dynamic | All 7 clusters use dynamic imports (`getAllToolSlugs`, `getAllPlatformSlugs`, `getAllBlogSlugs`, etc.) |
| Footer links | ✅ Updated | Tools 3→8, Voices +girl +rvc-community, Learn +4 hub articles |
| Title tags | ✅ All ≤60 | Using `| Echo` suffix |
| Canonical tags | ✅ | `alternates.canonical` in `generateMetadata()` |
| Favicon | ✅ Branded | Red recording dot (replaced Vercel ▲) |
| SoftwareApplication schema | ✅ | JSON-LD on homepage + download page |
| FAQ schema | ✅ | `FAQSchema` component on all FAQ pages |
| Open Graph / Twitter | ✅ | Title, description, image on all pages |
| Open FAQ prose | ✅ | First 2-3 FAQs visible (not hidden in accordions) |
| Cross-cluster links | ✅ | All page templates link to ≥2 other clusters |
| Robots.txt | ⚠️ | Needs verification |
| Google Search Console | ✅ | Domain verified, sitemap submitted (early May 2026) |
| i18n / hreflang | ✅ | 12 locales live, hreflang on all 7 clusters, translation-aware sitemap |

---

## Keyword Coverage

| Keyword | Est. Volume | Page | Cluster |
|---------|------------|------|---------|
| voice changer | 100K+ | `/` (homepage) | Core |
| ai voice changer | 30K+ | `/ai-voice-changer` | KW Landing |
| voice changer for pc | 25K+ | `/use/pc` | Use Case |
| free voice changer | 20K+ | `/ai-voice-changer` (301 redirect) | KW Landing |
| vocal remover | 20K+ | `/tools/vocal-remover` | Tools |
| voice changer for discord | 15K+ | `/apps/discord` | Platform |
| how to remove vocals | 15K+ | `/blog/how-to-remove-vocals-from-song` | Blog |
| girl voice changer | 12K+ | `/voices/girl` | Voice Category |
| voice changer for gaming | 10K+ | `/use/gaming` | Use Case |
| stem splitter | 10K+ | `/tools/stem-splitter` | Tools |
| real-time voice changer | 8K+ | `/ai-voice-changer` (301 redirect) | KW Landing |
| anime voice changer | 8K+ | `/voices/anime` | Voice Category |
| best free voice changers | 8K+ | `/blog/best-free-voice-changers-2026` | Blog |
| voicemod alternative | 5K+ | `/compare/vs-voicemod` | Compare |

---

## Competitor Gap Analysis

| Metric | Echo (Current) | Voicemod | Voice.ai | LALAL.AI |
|--------|---------------|----------|----------|---------|
| Total indexed pages | ~2,500+ (13 locales) | ~300+ | ~100+ | ~200+ |
| Homepage word count | ~360w | ~400w | ~350w | — |
| Product page word count | ~1,200w | ~1,500w | ~1,200w | — |
| Tool pages avg words | ~1,800 | ~2,500 | ~1,200 | ~3,000 |
| Blog posts | 31 (19 live) | 50+ | 20+ | 30+ |
| Hub articles | 9 | 10+ | 5+ | 15+ |
| Languages | 12 + EN | 9 | 3 | 12 |
| Comparison pages | 5 (1 indexed) | 3+ | — | — |
| H2 sections per tool | 9 | 8-10 | 4-6 | 10-12 |
| Footer tool links | 8 | 10+ | 5 | 8 |
| Internal links per page | 8-12 | 12-15 | 5-6 | 8-10 |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-19 | Phase 1 complete: dynamic sitemap, title trimming, canonicals |
| 2026-05-19 | Phase 2 complete: SEO content on all tools + voices (use cases, H2 sections, related tools, open FAQ prose, cross-cluster links) |
| 2026-05-19 | Phase 3: /voices/girl page, blog calendar + 2 P1 posts, open FAQ prose on use/apps/compare, all 13 tools have SEO content |
| 2026-05-19 | Created AGENTS.md, SEO_STRATEGY.md (this file), SEO_ROADMAP.md |
| 2026-05-19 | **CRITICAL FIX**: Sitemap was missing 17 platform pages (hardcoded 9 slugs) + all 7 blog posts. Now fully dynamic across all clusters. |
| 2026-05-19 | Footer expanded: Tools 3→8, Voices +girl +rvc-community, Learn section replaced with hub article links |
| 2026-05-19 | Hub expanded 5→8: added RVC training guide, DSP effects explainer, roleplay guide |
| 2026-05-19 | Voice page cross-cluster links expanded 3→6 (added gaming, voice model guide, pitch detector) |
| 2026-05-19 | Blog expanded 7→11: added VTuber guide, RVC training tutorial, karaoke apps guide + 1 more |
| 2026-05-19 | Product feature pages: `/soundboard`, `/voice-cloning`, `/voicelab` (3 new pages, all in sitemap) |
| 2026-05-20 | Audit: corrected documented counts — platforms 26→27, hub 8→9, blog 10→11, total ~165→~170 |
| 2026-05-20 | Category page editorial prose: added 2 H2 sections, open FAQ prose (first 2), and cross-cluster links to anime, scary, celebrity, gaming (girl + rvc-community already had them) |
| 2026-05-28 | **RVC cluster AAA+ upgrade**: `what-is-rvc` rewritten with 4-stage pipeline, ContentVec/FAISS/RMVPE/NSF-HiFiGAN detail |
| 2026-05-28 | **RVC training guide AAA+**: `how-to-train-rvc-model` rewritten with UVR5 pipeline, f0 method comparison, VRAM scaling, troubleshooting |
| 2026-05-28 | **Voice model guide AAA+**: `voice-model-guide` rewritten — file types (.pth/.index/.onnx), sourcing, evaluation, troubleshooting, 8 FAQs |
| 2026-05-28 | **vs-okada comparison fix**: removed 2 false "built-in virtual mic" claims, added Model Architectures row, corrected positioning |
| 2026-05-28 | **best-voice-changers upgrade**: added Voice.ai (#4), Vonovox (honorable mention), corrected w-okada to "multi-model" framing, 6 FAQs |
| 2026-05-28 | **how-voice-changers-work upgrade**: added audio routing, pipeline steps, latency, GPU acceleration sections, 6 FAQs |
| 2026-05-28 | **Blog content audit**: removed anti-subscription language from launch post, refactored karaoke article positioning |
| 2026-05-28 | **Competitor intelligence**: Vonovox added to competitor reference with verified technical profile |
| 2026-05-30 | **Cannibalization kill**: 301 redirects for `/free-voice-changer` and `/real-time-voice-changer` → `/ai-voice-changer` |
| 2026-05-30 | **Authority page**: `/ai-voice-changer` rewritten to ~1,200w with editorial prose, FAQs, platform grid |
| 2026-05-30 | **Beta purge**: "Free during beta" removed from 40+ files sitewide |
| 2026-05-30 | **Jargon purge**: DSP/RVC jargon removed from user-facing platform and feature pages |
| 2026-05-30 | **Branding purge**: "73+ voice effects" removed from layout, comparisons, content |
| 2026-05-31 | **Homepage enrichment**: Copy expanded to ~360w, hero updated, dead links fixed |
| 2026-05-31 | **Dead link sweep**: Fixed broken links in FeatureSection, Footer, SeoText, Roblox, GTA content |
| 2026-05-31 | **Competitor crawl**: Fresh analysis of Voicemod + Voice.ai homepage vs product page strategy |
| 2026-06-16 | **Sitemap overhaul**: All 7 content clusters now use `translatedAlternates()` — only emits hreflang for pages with actual translations. Previously used blind `alternates()` that emitted all 12 locales regardless |
| 2026-06-16 | **Sitemap localized entries**: Every translated page now gets its own standalone `<url>` entry. Previously localized pages were only referenced via hreflang alternates |
| 2026-06-16 | **IndexNow localized URLs**: Updated API route to submit all translated URLs alongside English to Bing/Yandex/Naver |
| 2026-06-16 | **hreflang on all clusters**: Added `alternates.languages` to `generateMetadata()` on hub, tools, blog, voices, usecases (apps + comparisons already had it) |
| 2026-06-16 | **Locale static params**: Added locale-aware `generateStaticParams()` to blog, voices, usecases (hub, tools, apps, comparisons already had it) |
| 2026-06-16 | **Redirect guards**: Added untranslated URL redirect guard to hub, tools, blog, usecases (apps + comparisons already had it) |
| 2026-06-16 | **SEO docs updated**: SEO_STRATEGY.md + SEO_ROADMAP.md updated to reflect June 2026 state — 12 locales, 31 blog posts, 84 voices, 31 platforms |
