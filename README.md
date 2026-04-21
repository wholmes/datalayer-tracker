# DataLayer Tracker — Marketing Site

Marketing website for [DataLayer Tracker](https://datalayer-tracker.com), an enterprise WordPress analytics plugin with server-side tracking, automatic data enrichment, and smart consent management.

## Pages

| File | URL | Description |
|------|-----|-------------|
| `index.html` | `/` | Homepage — hero, scroll story, feature spotlights, horizontal feature showcase |
| `wordpress-analytics-plugin.html` | `/wordpress-analytics-plugin/` | Full feature breakdown — 18 features with card-stack scroll sections |
| `pricing.html` | `/pricing/` | Pricing plans, value highlights, comparison table, FAQ |
| `knowledge-base.html` | `/knowledge-base/` | Docs hub — categories, most-read articles, support |
| `features.html` | `/features/` | Legacy features page (kept for SEO continuity) |

## Tech stack

- **Vanilla HTML/CSS/JS** — no build step, no framework
- **GSAP + ScrollTrigger** — scroll-driven animations, card-stack effects, parallax, pinned sections
- **Lenis** — smooth inertia scrolling
- **Canvas 2D** — particle mesh background in hero sections
- **CSS custom properties** — design tokens for colour, spacing, typography, shadows

## Structure

```
datalayer-tracker/
├── index.html
├── wordpress-analytics-plugin.html
├── pricing.html
├── knowledge-base.html
├── features.html
└── assets/
    ├── css/
    │   ├── styles.css      # All component and layout styles
    │   └── scroll.css      # Lenis, word-split, pre-hide animation states
    └── js/
        ├── main.js         # UI: cursor, nav, accordion, tabs, tilt, section rail
        └── scroll.js       # GSAP ScrollTrigger animations + Lenis init
```

## Running locally

No build step needed — open any HTML file directly in a browser or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Key animation patterns

**Card stack** — sections with stacked `feature-full-card` elements use `position: sticky` + GSAP `ScrollTrigger` scrub to create a deck-peel effect as you scroll.

**Section rail** — fixed lower-left collapsible nav that reads `section[id][data-rail-label]` attributes and builds jump links automatically. State persisted in `localStorage`.

**Hero entrance** — CSS keyframe animations gated on `.hero-animated` class. Class is stripped and re-added via `ScrollTrigger` every time the hero scrolls back into view, restarting all staggered entrance animations.

**Word split** — section `h2[data-split]` elements are split into individual word spans at runtime. Each word slides up from a clipped overflow container on scroll entry.

## Adding a new page

1. Copy the `<head>`, nav, and footer from an existing page
2. Add `<link rel="stylesheet" href="assets/css/styles.css">` and `scroll.css`
3. Add `id` + `data-rail-label` attributes to each `<section>` for the section rail
4. Use `data-split` on `h2` headings and `data-fade-up` on sub-paragraphs for scroll reveals
5. Wrap groups of cards in `<div class="card-group">` for staggered cascade animations
