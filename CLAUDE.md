# CLAUDE.md: Can Miró

Guidance for AI coding sessions on this repo. Read this first.

## What this is

Marketing website for **Can Miró**, a private rental villa with pool in **La Lluca,
Jávea** (Costa Blanca, Spain). It is a **single long-scroll page** whose job is to
convert visitors into **direct enquiries** (WhatsApp + email), not a booking platform.
Design brief: modern, luxurious, photography-first, warm Mediterranean feel.

## Stack

- **Astro 5** (static output). No UI framework, no Tailwind, hand-written CSS.
- Built-in **i18n**: English (default, at `/`), Dutch (`/nl/`), German (`/de/`),
  Spanish (`/es/`). All four are fully translated.
- Images via **`astro:assets`** (auto WebP/AVIF). Lightbox via **PhotoSwipe**.
- Node 22, npm.

```bash
npm run dev      # http://localhost:4321
npm run build    # -> dist/  (static)
```

## Where things live

- `src/pages/index.astro` (en) + `src/pages/[lang]/index.astro` (nl/de/es), thin
  routes that render `src/components/Home.astro`, which assembles all sections.
- `src/components/`, one component per section: `Header`, `Hero`, `Intro`, `Gallery`,
  `Amenities`, `Area`, `Rates`, `Reviews`, `Faq`, `Enquiry`, `Footer`, `WhatsAppFab`,
  plus `Icon.astro` (inline SVG set) and `LangSwitcher.astro`.
- `src/layouts/Base.astro`, html shell, `<head>` meta/OG/hreflang, fonts, the global
  scroll-reveal `IntersectionObserver`, skip link.
- `src/styles/tokens.css`, **design tokens** (colours, type scale, spacing, motion).
  `global.css`, base styles + helpers (`.container`, `.section`, `.btn`, `.reveal`, `.eyebrow`).
- `src/data/villa.ts`, **language-neutral facts** (stats, amenity/distance ids + icons,
  rate figures, review meta, FAQ ids, registration number, map coords). Edit numbers here.
- `src/i18n/{en,nl,de,es}.json`, **all copy**, same nested shape. Missing keys fall back
  to English (`src/i18n/index.ts` → `useTranslations(locale)`, dot-path keys).
- `src/config.ts`, contact config from `PUBLIC_*` env vars (`whatsappLink()` helper).

## Content editing rules

- **Facts** (numbers, distances, rates, coords, registration no.) → `src/data/villa.ts`.
- **Words** (any visible text, in every language) → `src/i18n/*.json`. Keep the four
  files structurally identical; add a key to `en.json` first, then the others.
- Amenities/distances/FAQ are driven by `id`s in `villa.ts` that resolve to
  `amenities.items.<id>`, `area.places.<id>`, `faq.items.<id>.{q,a}` in the dictionaries.

## Photos

- Originals: `photos-source/{ground,drone}` (git-ignored, large).
- Shipped/optimized copies: `src/assets/images/` (`hero.jpg`, `intro.jpg`, `gallery/NN-token.jpg`).
- Pipeline: edit the `MAP` in `scripts/process-photos.mjs`, then
  `node scripts/process-photos.mjs` (rebuilds gallery + hero + intro + `public/og-image.jpg`).
- Gallery captions come from the **filename token** (e.g. `…-dining.jpg` → `alfresco`
  caption). Token→caption map is in `Gallery.astro` (`captionByToken`). Grid features
  tiles at index 0, 3, 6 (the `big` flag).
- **Interior photos are still missing** (living rooms, the two kitchens, bedrooms,
  bathrooms). Gallery is currently exterior/grounds only. Add interiors + `MAP` entries later.

## Enquiry form

Client-side in `Enquiry.astro`. Posts to **Web3Forms** if `PUBLIC_WEB3FORMS_KEY` is set,
otherwise falls back to a `mailto:` compose. WhatsApp deep-link works regardless. Has a
honeypot spam field.

## Booking calendar

`Booking.astro` (section `#booking`, nav label `nav.book`) is a self-contained
availability calendar with **year / month / week** views:
- **Year**: 12 month cards with a "from" nightly price and an available-nights count.
- **Month / Week**: per-day nightly price, tap to pick arrival then departure (range
  highlighted); past days disabled, booked days struck out.
- Selecting a range shows nights + total and a **Request these dates** button that fills
  the enquiry form's date inputs (`#f-arrival`, `#f-departure`) and scrolls to `#enquire`.

Pricing + availability live in `src/data/availability.ts`. Nightly prices derive from the
weekly rates by season. Availability is **deterministic pseudo-random for now** (seeded by
date, current-date-aware). **To connect Booking.com / Airbnb / a channel manager later,
replace `isAvailable()`** with a lookup into the synced blocked-dates set (e.g. parsed from
the platforms' iCal feeds). Nothing else changes.

Important Astro gotcha: calendar cells are injected by the client script at runtime, so
they do NOT get Astro's scoped-style attribute. Their CSS lives in the `<style is:global>`
block in `Booking.astro`, namespaced under `.booking`. Keep new cell styles there, not in
the scoped block.

## Map & location privacy

The Area map (`Area.astro`) is **Leaflet + OpenStreetMap tiles** (no API key) drawing a
**radius circle only, no pin**, so the exact villa is not pinpointed. Centre + radius come
from `villa.location` (`lat`, `lng`, `mapRadiusMeters`). The villa is in the **Lluca
district** of Jávea (near the golf); the map centre is **intentionally offset ~150 m** from
the real address and the **street address is kept out of the repo and off the site** (owner
reference only). The `distances` in `villa.ts` are **real, measured by road** from the
actual address (via OSRM), so they stay accurate despite the offset. The "open in Google
Maps" link points to the **neighbourhood** (`La Lluca, Jávea`), never the address. If Google
tiles are ever wanted instead, that needs the paid Maps JS API + key; the circle logic ports
over.

## Before launch (see README checklist)

Real rates/reviews/distances in `villa.ts`; the **tourist rental registration number**
(`registrationNumber`, legally required in footer); `.env` (WhatsApp, email, Web3Forms
key); real `site` domain in `astro.config.mjs`; check the map circle centre/radius still
keep the address private.

## Verifying visually

The Chrome extension may not be connected. Fallback used in this repo: headless Chrome
screenshots, `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
--screenshot --window-size=W,H <url>`. Note the scroll-reveal hides below-fold content in a
static shot; temporarily neutralize `.reveal { opacity:1 }` (and cap `.hero` height) while
screenshotting, then revert.

## Working preferences

- **Never use em-dashes** in any output or content. Use periods, commas, colons,
  parentheses, or sentence splits. En-dashes for ranges are fine.
- **Do not push to git without an explicit request.** Note: this folder currently sits
  inside a git repo rooted at the user's home directory, confirm the intended repo before
  running any `git` commands. Commit only when asked.
