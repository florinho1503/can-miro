# CLAUDE.md: Can Miró

Guidance for AI coding sessions on this repo. Read this first.

## What this is

Marketing website for **Can Miró**, a private rental villa with a heated pool in the
**Lluca district** of Jávea (Xàbia), Costa Blanca, Spain. Single **long-scroll page**
whose job is to make the villa look irresistible and convert visitors into **direct
enquiries** (WhatsApp + email). Not a booking platform. Modern, warm, luxurious feel.

## Stack

- **Astro 5** (static output). No UI framework, no Tailwind: hand-written CSS.
- Built-in **i18n**: English (default, `/`), Dutch (`/nl/`), German (`/de/`), Spanish
  (`/es/`). All four are fully translated and hand-polished for fluency (see Copy tone).
- Images via **`astro:assets`** (auto WebP/AVIF). Lightbox: **PhotoSwipe**. Map: **Leaflet + OSM**.
- Node 22, npm.

```bash
npm run dev      # http://localhost:4321/can-miro/
npm run build    # -> dist/  (static)
```

## Live deployment (GitHub Pages)

- **Live URL:** https://florinho1503.github.io/can-miro/  (a *family preview* for now)
- **Repo:** `florinho1503/can-miro`, **public** (GitHub Pages on a free account requires
  a public repo). Auto-deploys on every push to `main` via `.github/workflows/deploy.yml`
  (withastro/action + actions/deploy-pages). Just `git push` and it is live in ~40s.
- **Base path:** it is a *project* site served under `/can-miro/`, so `astro.config.mjs`
  sets `site: 'https://florinho1503.github.io'` + `base: '/can-miro'`. All root-absolute
  internal links go through `localizePath()` / `withBase()` so they include the base. If
  you add a new absolute asset link, prefix it with `import.meta.env.BASE_URL`.
- **`noindex`:** `Base.astro` includes `<meta name="robots" content="noindex, nofollow">`
  so the preview stays out of search engines. **Remove it at the real public launch.**
- GitHub account in use this session: `florinho1503` (a second account `tamgroningen` is
  also authenticated in `gh`). Commit identity: Floris Bokx <florisbokx@gmail.com>.

## Where things live

- `src/pages/index.astro` (en) + `src/pages/[lang]/index.astro` (nl/de/es) render
  `src/components/Home.astro`, which assembles all sections in order.
- Sections in `src/components/`: `Header`, `Hero`, `Intro`, `Gallery`, `Amenities`,
  `Area`, `Rates`, `Booking`, `Reviews`, `Faq`, `Enquiry`, `Footer`, `WhatsAppFab`, plus
  `Icon.astro` (inline SVG set) and `LangSwitcher.astro`.
- `src/layouts/Base.astro`: html shell, head meta/OG/hreflang, fonts, scroll-reveal
  IntersectionObserver, skip link, noindex.
- `src/styles/tokens.css` = design tokens; `global.css` = base + helpers
  (`.container`, `.section`, `.btn`, `.reveal`, `.eyebrow`).
- `src/data/villa.ts` = language-neutral facts (stats, amenity/distance ids + icons,
  rate figures, review meta, FAQ ids, registration number, map centre/radius).
- `src/data/availability.ts` = booking-calendar pricing + availability logic.
- `src/i18n/{en,nl,de,es}.json` = all copy, same nested shape; missing keys fall back to
  English (`useTranslations(locale)`, dot-path keys). `src/config.ts` = contact config.

## Content editing rules

- **Facts** (numbers, distances, rates, coords, registration no.) -> `src/data/villa.ts`.
- **Words** (any visible text, every language) -> `src/i18n/*.json`. Keep the four files
  structurally identical; add a key to `en.json` first, then the others. Edit JSON safely
  with a small Node script (JSON.parse -> set -> JSON.stringify) to avoid encoding issues
  with accents/apostrophes; `perl -CSD` mangled `ó` into mojibake earlier, so avoid it.

## Design & product decisions (this session)

- **Name: keep "Can Miró"** as the clean brand/display name (logo, H1). "Can" is
  Valencian/Catalan for "house of", so *Can Miró* = Miró's house: authentic, premium.
  Do **not** add "Villa" under the logo (dilutes it, no SEO value). **Never** write
  "Casa Can Miró" (redundant). Use **"Villa Can Miró"** only later in Airbnb/Booking
  listing titles, where a category word helps scanning. Findability comes from the
  keyword-rich `<title>`/description ("villa + Jávea/Xàbia + Costa Blanca + private pool"),
  which is already in `meta.title`.
- **Palette/type:** warm Mediterranean tokens (sand, terracotta, deep sea-blue), Fraunces
  (serif display) + Manrope (sans). Generous whitespace, subtle scroll reveals + hover-zoom.
- **Pool is private AND heated** (reflected in hero chip, amenities, FAQ).
- **Pets: not allowed. Children: welcome, pool toys provided** (FAQ).
- **Copy tone:** all four languages are hand-polished to read naturally, NOT literal
  machine translation. Keep that bar: avoid word-for-word calques (e.g. don't reintroduce
  "trage ochtenden", "Platz zum Ausbreiten", "the light moves across the day"). Match the
  warm, unhurried, lightly editorial voice.
- **Distances are real**, measured by road from the actual address via OSRM, nearest-first.
- **Map shows a radius circle, no pin** (see below).

## Photos

- Originals: `photos-source/{ground,drone}` (git-ignored, large). Shipped/optimized copies
  in `src/assets/images/` are committed and are what the site uses.
- Pipeline: edit the `MAP` in `scripts/process-photos.mjs`, then
  `node scripts/process-photos.mjs` (rebuilds gallery + hero + intro + `public/og-image.jpg`;
  prints unused source files). Gallery caption comes from the filename token
  (`…-dining.jpg` -> `alfresco`), mapped in `Gallery.astro` (`captionByToken`); grid features
  tiles 0, 3, 6.
- **Interior photos are still missing** (living rooms, the two kitchens, bedrooms,
  bathrooms). The gallery is currently exterior/grounds only. The intro image is a natural
  landscape crop (a prior portrait crop looked stretched, so avoid hard portrait crops).

## Booking calendar

`Booking.astro` (section `#booking`, nav label `nav.book`) has **year / month / week**
views: year = month cards with a "from" nightly price + available-nights count; month/week
= per-day price + availability, tap arrival then departure (range highlighted); past days
disabled, booked days struck out. Selecting a range shows nights + total and a **Request
these dates** button that fills the enquiry form's date inputs (`#f-arrival`,
`#f-departure`) and scrolls to `#enquire`.

Pricing + availability: `src/data/availability.ts`. Nightly prices derive from the weekly
rates by season. Availability is **deterministic pseudo-random for now** (seeded by date,
current-date-aware). **To sync Booking.com / Airbnb later, replace `isAvailable()`** with a
lookup into the synced blocked-dates set (e.g. parsed from the platforms' iCal feeds).

Astro gotcha: calendar cells are injected by the client script at runtime, so they do NOT
get Astro's scoped-style attribute. Their CSS lives in the `<style is:global>` block in
`Booking.astro`, namespaced under `.booking`. Keep new cell styles there.

## Enquiry form & contact

`Enquiry.astro`, client-side. Posts to **Web3Forms** if `PUBLIC_WEB3FORMS_KEY` is set,
else falls back to a `mailto:` compose. WhatsApp deep-link works regardless. Honeypot
spam field included. Contact defaults are in `src/config.ts`:
- WhatsApp **+31 6 51475439** (`31651475439`), displayed contact email
  **florisbokx@gmail.com**. Committed as defaults (public info); overridable via `.env` /
  the workflow env.
- **Web3Forms is wired and tested** (returns `success: true`). The key lives in `.env`
  locally and in the GitHub Actions repo **variable** `PUBLIC_WEB3FORMS_KEY` (used in the
  deploy build; the key is public/client-side by design). Web3Forms delivers to the **email
  of the account the key was created under** — currently **florisbokx@gmail.com** (Floris's
  login), NOT the `PUBLIC_CONTACT_EMAIL`. So the displayed email is kept the same as the
  destination to stay consistent.
- **Planned:** move to a dedicated house inbox like **canmiro@gmail.com**. When that exists:
  create a Web3Forms account/key under it, swap `PUBLIC_WEB3FORMS_KEY` (repo variable +
  `.env`), and set `PUBLIC_CONTACT_EMAIL` to it in `config.ts` default + workflow env.
- Note: Web3Forms free blocks server-side (curl) submissions; test only via a real browser.

## Map & location privacy

Area map (`Area.astro`) = **Leaflet + OpenStreetMap tiles** (no API key), drawing a
**radius circle only, no pin**. Centre + radius: `villa.location` (`lat`, `lng`,
`mapRadiusMeters`). The villa is in the **Lluca district** near the golf; the map centre is
**intentionally offset ~150 m** from the real address, and the **street address is kept out
of the repo and off the site**. Distances in `villa.ts` are real (OSRM) so they stay
accurate despite the offset. The "open in Google Maps" link points to the neighbourhood
("La Lluca, Jávea"), never the address. Google tiles would need the paid Maps JS API + key.

## Next steps roadmap

Done so far: custom domain **villacanmiro.com** live on GitHub Pages (HTTPS enforced);
**Web3Forms** wired + tested (enquiries currently arrive at florisbokx@gmail.com).

**A. To turn the family preview into a real launch**
1. Create the dedicated house inbox (**canmiro@gmail.com**), make a Web3Forms key under it,
   and re-point (see Enquiry section). Then enquiries land in the house inbox.
2. Add the real **tourist rental registration number** in `villa.ts` (`registrationNumber`,
   still `VT-XXXXXX-A`; legally required in the footer for Comunidad Valenciana).
3. Replace **placeholder rates, reviews and rating** with real ones (`villa.ts` + i18n
   `reviews.*`). Note: placeholder reviews were written before distances were fixed.
4. Add **interior photography** (+ new `MAP` entries in `process-photos.mjs`).
5. **Remove the `noindex`** meta in `Base.astro`.
6. Hosting: fine on GitHub Pages for now. For production (private repo + serverless for the
   booking sync + commercial-OK), plan a move to **Cloudflare Pages** (same repo, free tier);
   the static build ports with no code change, just re-point DNS + drop the `CNAME` file.

**B. Bookings / channel management (when live)**
7. Connect **Booking.com / Airbnb iCal** feeds and replace `isAvailable()` so the calendar
   reflects real availability and prevents double bookings.
8. Optionally set real seasonal **date ranges** (not just month buckets) in
   `availability.ts`, and confirm nightly prices.

**C. Nice-to-haves**
9. A proper **enquiries dashboard / CRM** (beyond email) if volume grows (needs a small
   backend or a hosted service).
10. Analytics (privacy-friendly, e.g. Plausible) once public.

## Working preferences

- **Never use em-dashes** in any output or content. Use periods, commas, colons,
  parentheses, or sentence splits. En-dashes for ranges (e.g. "Jul–Aug") are fine.
- **Do not push to git without an explicit request.** This session the user asked to
  deploy, so pushing to `florinho1503/can-miro` is authorized; keep that scope.
- Iterate locally and verify visually (headless Chrome screenshots; the Chrome extension
  may be unavailable). Scroll-reveal hides below-fold content in a static shot, so temporarily
  neutralize `.reveal { opacity: 1 }` (and cap `.hero` height) while screenshotting, then revert.
