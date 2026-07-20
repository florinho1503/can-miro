# CLAUDE.md: Can Miró

Guidance for AI coding sessions on this repo. Read this first.

## What this is

Marketing website for **Can Miró**, a private rental villa with a heated pool in the
**Lluca district** of Jávea (Xàbia), Costa Blanca, Spain. A long-scroll single page in four
languages, plus a private **`/admin`** booking portal. It converts visitors into direct
enquiries (WhatsApp + email) that also sync into a booking calendar. Not a public
pay-online booking platform. Modern, warm, luxurious feel.

## Stack

- **Astro 5** (static output). No UI framework, no Tailwind: hand-written CSS.
- Built-in **i18n**: English (default, `/`), Dutch (`/nl/`), German (`/de/`), Spanish
  (`/es/`). All four fully translated and hand-polished for fluency (see Copy tone).
- Images via **`astro:assets`** (WebP/AVIF). Lightbox **PhotoSwipe**. Map **Leaflet + OSM**.
  Booking backend **Supabase**. Node 22, npm.

```bash
npm run dev      # http://localhost:4321/
npm run build    # -> dist/  (static)
```

## Live deployment

- **Live:** https://villacanmiro.com (custom domain, HTTPS enforced). Private portal at
  https://villacanmiro.com/admin.
- **Host:** GitHub Pages, repo **`florinho1503/can-miro`** (public; free Pages needs a
  public repo). Auto-deploys on every push to `main` via `.github/workflows/deploy.yml`
  (withastro/action + actions/deploy-pages). `git push` -> live in ~40s. If only repo
  variables changed (no code), trigger a rebuild with `gh workflow run deploy.yml`.
- **Custom domain / no base path:** the site is at the domain **root**, so `astro.config.mjs`
  has `site: 'https://villacanmiro.com'` and **no `base`**. `public/CNAME` holds
  `villacanmiro.com`; DNS is at TransIP (4 A records to GitHub Pages IPs + `www` CNAME).
  Root-absolute links still route through `localizePath()` / `withBase()` (base resolves to
  `/`), so they keep working if a base is ever reintroduced.
- **`noindex`:** `Base.astro` and `admin.astro` carry `<meta name="robots" content="noindex,
  nofollow">` (family preview). **Remove it from `Base.astro` at the real public launch**
  (keep it on `admin.astro`).
- **Build env:** contact + keys come from GitHub Actions **repo variables** (repo Settings ->
  Secrets and variables -> Actions -> Variables): `PUBLIC_WEB3FORMS_KEY`,
  `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`. `PUBLIC_WHATSAPP_NUMBER` +
  `PUBLIC_CONTACT_EMAIL` are hardcoded in the workflow `env`. Locally the same values live in
  `.env` (git-ignored). All are public-by-design keys (no secrets committed).
- GitHub accounts: `florinho1503` (active) + `tamgroningen` (also authed in `gh`).
  Commit identity: Floris Bokx <florisbokx@gmail.com>.

## Where things live

- `src/pages/index.astro` (en) + `src/pages/[lang]/index.astro` (nl/de/es) render
  `src/components/Home.astro`, which assembles the public sections in order.
- `src/pages/admin.astro` = standalone private booking portal (not part of Home).
- Sections in `src/components/`: `Header`, `Hero`, `Intro`, `Gallery`, `Amenities`, `Area`,
  `Rates`, `Booking`, `Reviews`, `Faq`, `Enquiry`, `Footer`, `WhatsAppFab`, plus `Icon.astro`
  (inline SVG set) and `LangSwitcher.astro`.
- `src/layouts/Base.astro`: html shell, head meta/OG/hreflang, fonts, scroll-reveal, noindex.
- `src/styles/tokens.css` = design tokens; `global.css` = base + helpers.
- `src/data/villa.ts` = language-neutral facts (stats, amenity/distance ids + icons, rate
  figures, review meta, FAQ ids, registration number, map centre/radius).
- `src/data/availability.ts` = nightly pricing per season + `blockedRanges` + `isAvailable`.
- `src/i18n/{en,nl,de,es}.json` = all copy, same nested shape; missing keys fall back to
  English. `src/config.ts` = contact config (Supabase env is read directly via
  `import.meta.env` in `Booking`/`Enquiry`/`admin`).

## Content editing rules

- **Facts** (numbers, distances, rates, coords, registration no.) -> `src/data/villa.ts`.
- **Words** (any visible text, every language) -> `src/i18n/*.json`. Keep the four files
  structurally identical; add a key to `en.json` first, then the others. Edit JSON with a
  small Node script (JSON.parse -> set -> JSON.stringify); `perl -CSD` mangled `ó` into
  mojibake earlier, so avoid it for accented text.

## Design & product decisions

- **Name: keep "Can Miró"** as the clean brand/display name (logo, H1). "Can" is
  Valencian/Catalan for "house of". Do **not** add "Villa" under the logo. **Never** write
  "Casa Can Miró" (redundant). Use "Villa Can Miró" only in Airbnb/Booking listing titles
  later. Findability comes from the keyword-rich `<title>`/description, already in `meta.title`.
- **Palette/type:** warm Mediterranean tokens (sand, terracotta, deep sea-blue), Fraunces
  (serif) + Manrope (sans). Generous whitespace, subtle scroll reveals + hover-zoom.
- **Pool is private AND heated.** **Pets: not allowed. Children: welcome, pool toys provided.**
- **Copy tone:** all four languages hand-polished to read naturally, NOT literal machine
  translation. Avoid word-for-word calques; keep the warm, unhurried, editorial voice.
- **Distances are real** (road distance from the actual address via OSRM), nearest-first.
- **Map shows a radius circle, no pin** (see Map section).

## Photos

- Originals: `photos-source/{ground,drone}` (git-ignored, large). Shipped/optimized copies in
  `src/assets/images/` are committed and are what the site uses.
- Pipeline: edit the `MAP` in `scripts/process-photos.mjs`, then
  `node scripts/process-photos.mjs` (rebuilds gallery + hero + intro + `public/og-image.jpg`;
  prints unused sources). Gallery caption comes from the filename token (`…-dining.jpg` ->
  `alfresco`), mapped in `Gallery.astro` (`captionByToken`); grid features tiles 0, 3, 6.
- **Interior photos still missing** (living rooms, the two kitchens, bedrooms, bathrooms).
  Gallery is exterior/grounds only. Intro image is a natural landscape crop (avoid hard
  portrait crops, one looked stretched).

## Booking calendar + availability

`Booking.astro` (`#booking`, nav label `nav.book`): **year / month / week** views, per-day
nightly price, tap arrival then departure (range highlighted), **Request these dates** fills
the enquiry form's date inputs and scrolls to `#enquire`.

- Nightly prices in `availability.ts` (derived per season from the weekly rates).
- **Availability is LIVE from Supabase:** on load the client fetches the public
  `availability()` RPC, fills `blockedRanges`, and re-renders. If Supabase env is unset it
  degrades to fully-available.
- `availability()` returns only date ranges of bookings with **status in
  ('confirmed','blocked')**. So **tentative options (enquiries) do NOT block the public
  calendar** until the owner confirms them.
- Astro gotcha: calendar cells are injected at runtime, so their CSS lives in the
  `<style is:global>` block (namespaced `.booking`), not the scoped block.

## Enquiry form

`Enquiry.astro`, client-side. **Required fields: name, email, phone, arrival, departure**
(dates are required so the request can sync to the calendar). The `message` field maps to
the booking's **notes** ("bijzonderheden").

On submit it does two things:
1. **Emails** the owner via **Web3Forms** (or a `mailto:` fallback if no key). WhatsApp
   deep-link works regardless. Honeypot spam field included.
2. **Creates a tentative booking** in Supabase via the `create_enquiry` RPC (best-effort,
   background) -> the enquiry shows in `/admin` as an **"Optie"** (paid = false).

- **Web3Forms:** key in `.env` + GH variable `PUBLIC_WEB3FORMS_KEY`. Delivers to the email of
  the account the key was created under = **florisbokx@gmail.com** (also the displayed
  contact email, kept in sync on purpose). Free plan **blocks server-side (curl) submits**,
  so test via a real browser. First-time Gmail may mark it spam; owner has a "never spam"
  filter on subject `Can Miró enquiry`.
- **Planned:** dedicated house inbox `canmiro@gmail.com` (new Web3Forms key under it, then
  swap `PUBLIC_WEB3FORMS_KEY` + `PUBLIC_CONTACT_EMAIL`).

## Admin portal & bookings (Supabase)

`/admin` (`src/pages/admin.astro`): standalone, `noindex`, not linked. Login via **Supabase
Auth**; then CRUD on the `bookings` table (arrival, departure, guest_name, contact, guests,
paid, status, notes) incl. a quick paid toggle.

- **Project:** "Javea bookings" (org florisbokxprojects, region eu-central-1), URL
  `https://lnzzjpzoijobzwdfzmhb.supabase.co`.
- **Keys:** the **publishable** key (`sb_publishable_...`) as `PUBLIC_SUPABASE_ANON_KEY`
  (public by design; RLS protects data). In `.env` + GH variables. Never the
  `service_role`/secret key.
- **Security model:** RLS on `bookings` = authenticated users full access, anon none. The
  public site never reads the table; it uses two `SECURITY DEFINER` functions (no PII),
  both granted to `anon`:
  - `availability()` -> confirmed/blocked date ranges (public calendar).
  - `create_enquiry(...)` -> inserts a **tentative, unpaid** booking (used by the enquiry
    form). anon can call it but cannot read/update/delete.
- **Status flow:** enquiry -> `tentative` (Optie: private, does not block public) -> owner
  confirms in `/admin` -> `confirmed` (shows as "Bezet" publicly). `blocked` = owner block
  (own use/maintenance). `paid` defaults false, toggled manually when paid.
- **Add a manager:** Supabase -> Authentication -> Users -> Add user (Auto Confirm). Any
  authenticated user is treated as admin.
- **Schema + policies + the two functions** were created via SQL in the Supabase SQL Editor
  (see git history / session notes). Re-run that SQL if recreating the project.

## Map & location privacy

Area map (`Area.astro`) = **Leaflet + OpenStreetMap tiles** (no API key), a **radius circle
only, no pin**. Centre + radius: `villa.location` (`lat`, `lng`, `mapRadiusMeters`). Centre
is **intentionally offset ~150 m** from the real address; the **street address is kept out
of the repo and off the site**. Distances in `villa.ts` are real (OSRM) so they stay accurate
despite the offset. "Open in Google Maps" links to the neighbourhood, never the address.

## Next steps roadmap

**Done:** custom domain villacanmiro.com (HTTPS); Web3Forms enquiry email (-> florisbokx@gmail.com);
Supabase `/admin` booking portal; enquiry -> calendar sync as tentative options; live
availability on the public calendar.

**A. To a real public launch**
1. Dedicated house inbox **canmiro@gmail.com** -> new Web3Forms key + repoint
   `PUBLIC_CONTACT_EMAIL` (variable + `.env` + workflow).
2. Real **tourist registration number** in `villa.ts` (still `VT-XXXXXX-A`; legally required
   in the footer for Comunidad Valenciana).
3. Real **rates + reviews** (currently placeholders; reviews predate the distance fix).
4. **Interior photography** (+ new `MAP` entries in `process-photos.mjs`).
5. **Remove `noindex`** from `Base.astro` (keep it on `admin.astro`).

**B. Channels / bookings (later)**
6. Airbnb/Booking **iCal** sync: export our confirmed bookings as an iCal feed for the
   platforms to import, and a scheduled function to import their feeds into `bookings`
   (status `blocked`). Or use a channel manager (Smoobu etc.). Low urgency: our form is
   enquiry-only + handled manually, so there is no instant-double-book risk on our side.

**C. Nice-to-haves**
7. Real seasonal **date ranges** in `availability.ts` (not just month buckets).
8. Privacy-friendly **analytics** (e.g. Plausible) once public.
9. Consider **Cloudflare Pages** if a private repo / serverless is wanted (static build ports
   with no code change; re-point DNS, drop `CNAME`).

## Working preferences

- **Never use em-dashes** in any output or content. Use periods, commas, colons, parentheses,
  or sentence splits. En-dashes for ranges (e.g. "Jul–Aug") are fine.
- This project runs an **ongoing deploy flow**: pushing a requested change to
  `florinho1503/can-miro` to make it live is expected. Still, do not push unrelated or
  experimental work without asking.
- Verify visually with **headless Chrome / `puppeteer-core`** (install `--no-save`; a later
  `npm install` prunes it, so reinstall when needed). The Chrome MCP extension may be
  unavailable. Scroll-reveal hides below-fold content in a static screenshot: neutralize
  `.reveal { opacity: 1 }` (and cap `.hero`) while shooting, then revert. For state checks,
  evaluate element classes directly (reveal only affects opacity).
