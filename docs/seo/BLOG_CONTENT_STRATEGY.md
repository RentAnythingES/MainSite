# Blog Content Strategy & Creation Guide — RentAnything.es

> **Last updated**: 2026-06-17
> **Applies to**: All blog posts at `/blog/[slug]` — powered by `src/content/blog.ts`

Spanish adaptations live in `src/content/blog-es.ts` and render at
`/es/blog/[slug]`. A Spanish route is published only when the full article,
metadata, FAQs and internal links are localized. Hreflang must never point an
untranslated article to a generic Spanish page.

This document defines quality standards, structural patterns, and guardrails for blog content on rentanything.es.

---

## 1. How Publishing Works

Blog posts are data-driven via `src/content/blog.ts`. They auto-publish based on their `date` field.

```typescript
function isPublished(post: BlogPost): boolean {
  return new Date(post.date) <= new Date();
}
```

**Setting a date = committing to publish.** Posts with future dates build but return 404 and are excluded from the sitemap.

**Cadence**: 1-2 posts per week initially, scaling as we find what resonates.

---

## 2. Post Objective (Define Before Writing)

Every post must have a documented objective before content is written.

| Field | Question | Example |
|-------|----------|---------|
| **Primary keyword** | What search query are we ranking for? | "stroller rental Valencia" |
| **Search intent** | Comparing, learning, or booking? | Informational (planning a trip) |
| **Strategic aim** | Why does this post exist? | Capture top-funnel family travel traffic |
| **Content archetype** | Which template? (§4) | Local Guide |

### Cannibalization check (MANDATORY)

Before creating a new post, verify no existing page targets the same keyword:
1. Check existing product/category pages in `products.ts`
2. Check existing blog entries in `blog.ts`
3. If overlap: merge content or differentiate the angle

---

## 3. Pre-Writing Research

Never write based on assumptions. Every post must be informed by actual research.

- [ ] **SERP analysis** — Search the primary keyword. What ranks? What format? What word count?
- [ ] **Competitor check** — Do Babonbo, Amigo 24, Motion4rent cover this topic?
- [ ] **People Also Ask** — Capture PAA questions for FAQ content
- [ ] **Content gap** — What do top results NOT cover that we can?
- [ ] **Framing decision** — Standard coverage or differentiated angle?

> [!CAUTION]
> All research must be saved — either in comments in `blog.ts` or in `docs/seo/COMPETITOR_REFERENCE.md`. Research that isn't persisted is wasted.

---

## 4. Content Archetypes

### 4.1 Local Guide (`category: 'guide'`)
**Purpose**: Capture informational traffic from travellers planning Valencia trips.

**Structure**:
1. Opening hook — Valencia-specific context
2. Practical information — neighbourhood tips, timing, logistics
3. Our perspective — how rental equipment fits into the experience
4. Internal links — to relevant products/categories
5. FAQ section — 3-5 questions from PAA research

**Example topics**: "Valencia with Kids", "Accessible Valencia Guide", "Digital Nomad Valencia Setup"

### 4.2 Practical How-To (`category: 'tutorial'`)
**Purpose**: Capture "how to" queries and drive bookings through practical value.

**Structure**:
1. Why this matters (1-2 sentences)
2. What you need
3. Step-by-step instructions
4. Pro tips
5. What to watch out for

**Example topics**: "How to Get Around Valencia with a Baby", "Setting Up a Remote Office in Your Valencia Rental"

### 4.3 Seasonal / Situational (`category: 'seasonal'`)
**Purpose**: Capture time-sensitive search spikes.

**Structure**:
1. Timely hook
2. Practical checklist
3. Equipment recommendations (linked to products)
4. Local insider tips

**Example topics**: "Valencia Summer Survival Guide", "Las Fallas with Kids", "Beach Season Essentials"

### 4.4 Comparison / Decision Helper (`category: 'comparison'`)
**Purpose**: Help visitors choose between options. Build trust through honest analysis.

**Structure**:
1. Define evaluation criteria
2. Compare options honestly
3. Recommendation matrix ("If you want X, choose Y")
4. FAQ

**Example topics**: "Renting vs Buying Baby Gear for Your Holiday", "Coworking vs Home Office in Valencia"

---

## 5. Brand Voice in Blog Posts

### Core rules
- **Friendly + Trustworthy** — Like a caring friend who lives in Valencia
- **Lead with value** — Earn trust before mentioning our products
- **Valencia-grounded** — Every post mentions specific places (Malvarrosa, Turia, Ciudad de las Artes)
- **Never use fake urgency** — ❌ "Book NOW!" → ✅ "Here's how to plan ahead"
- **Acknowledge alternatives** — Mention other options honestly, explain why we're different

### Self-promotion guardrails

| Rule | Why |
|------|-----|
| **Never open with RentAnything** | Earn attention with useful info first |
| **Max 2 product mentions per post** | It's a blog post, not a catalogue |
| **CTA at the end only** | One clear call-to-action, not scattered throughout |
| **Acknowledge limitations** | If we don't carry something, say so |
| **Value test** | Would this post be useful even without RentAnything? |

### The Trust Equation
```
Trust = (Useful info given) ÷ (Self-promotion density)
```

---

## 6. SEO Minimum Bar

Every blog post must meet these requirements:

| Field | Constraint | Example |
|-------|-----------|---------| 
| `title` | ≤60 chars, include primary keyword | "Valencia with Kids: A Family Travel Guide" |
| `description` | 130-155 chars, compelling | "Everything you need to know about visiting Valencia with young children..." |
| `h1` | Different from title, natural language | "Your complete guide to Valencia with kids" |
| `keywords` | 3-7, primary first | `['Valencia with kids', 'family travel Valencia', ...]` |
| `faqs` | 3-6 with JSON-LD schema | Question + concise answer |
| `crossLinks` | 3+ links to products/categories | Product pages, category pages |

### Word count targets

| Archetype | Minimum | Ideal |
|-----------|---------|-------|
| Local Guide | 1,200w | 1,500-2,000w |
| How-To | 800w | 1,000-1,500w |
| Seasonal | 600w | 800-1,200w |
| Comparison | 1,000w | 1,200-1,800w |

### Internal linking rules
- Every post links to ≥2 product/category pages
- Every post links to ≥1 other blog post (once we have multiple)
- Use natural anchor text, not "click here"

---

## 7. Image & Visual Style

| Image type | When required | Spec |
|-----------|--------------|------|
| **Hero image** | Every post | 1200×630px, OG-compatible |
| **Section images** | Tutorials (step photos) | Descriptive alt text required |

### Style rules
- Light/bright aesthetic matching our teal + neutral palette
- Valencia imagery where possible (beach, old town, Turia Gardens)
- No generic stock photos — use generated images or real Valencia photos
- All images need descriptive `alt` text

---

## 8. LLM Citation Optimization

LLMs surface content that is authoritative, structured, and comprehensive.

### LLM-friendly patterns
| Pattern | Why LLMs prefer it |
|---------|-------------------|
| **Definition-first paragraphs** | LLMs extract first sentence as definition |
| **FAQ with concise answers** | Direct Q&A pairs are highly citable |
| **Structured lists** | Easy to extract and reason over |
| **Clear attribution** | "rentanything.es" mentioned naturally |
| **Year in title** | Signals freshness |

### Anti-patterns
- ❌ Walls of text (LLMs skip them)
- ❌ Vague claims ("It's really good")
- ❌ Self-promotional tone (LLMs deprioritize ads)
- ❌ Missing definitions (define terms on first use)

---

## 9. Content Pipeline — Initial Posts

### Planned (4 launch posts)

| # | Title | Archetype | Primary Keyword | Strategic Aim |
|---|-------|-----------|----------------|---------------|
| 1 | Valencia with Kids: The Complete Family Guide | Local Guide | `Valencia with kids` | Capture family travel traffic → baby gear rentals |
| 2 | Accessible Valencia: A Wheelchair & Mobility Guide | Local Guide | `wheelchair accessible Valencia` | Capture accessibility traffic → mobility rentals |
| 3 | The Digital Nomad's Guide to Valencia | Local Guide | `digital nomad Valencia` | Capture nomad traffic → remote work rentals |
| 4 | Valencia Summer Survival Guide (2026) | Seasonal | `Valencia summer tips` | Seasonal traffic → AC + beach gear rentals |

### Future concepts (backlog)

| Concept | Keyword | Archetype |
|---------|---------|-----------|
| Renting vs Buying Baby Gear for Your Holiday | rent vs buy baby gear travel | Comparison — ✅ EN/ES live 21 July 2026 |
| Best Beaches in Valencia for Families | best beaches Valencia families | Local Guide |
| Las Fallas with Kids — A Survival Guide | Las Fallas with kids | Seasonal |
| How to Set Up a Home Office in Valencia | remote office Valencia | How-To |
| Valencia in Winter — What to Rent | Valencia winter travel | Seasonal |

---

## 10. Pre-Publish Quality Checklist

### Content
- [ ] Opening paragraph makes you want to keep reading
- [ ] Valencia-specific — mentions real places, not generic "your destination"
- [ ] Self-promotion limited to end CTA + max 2 inline product mentions
- [ ] Would be useful even without RentAnything
- [ ] Tone: friendly expert, not marketing department

### SEO
- [ ] `title` ≤60 chars with primary keyword
- [ ] `description` 130-155 chars
- [ ] `keywords` array (3-7 entries)
- [ ] `faqs` present (≥3)
- [ ] Internal links to ≥2 product/category pages
- [ ] Hero image generated and saved

### Technical
- [ ] Blog entry added to `src/content/blog.ts`
- [ ] `npx next build` passes
- [ ] Date set (not clustering with other posts)
- [ ] SEO_STRATEGY.md updated with new post count
