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
- **Indexing:** public since Nov 2026. `Base.astro` sends `index, follow,
  max-image-preview:large`; `admin.astro` keeps `noindex, nofollow` and `public/robots.txt`
  disallows `/admin`.
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
- Sections in `src/components/`: `Header`, `Hero`, `Intro`, `Gallery`, `Amenities`, `Layout`,
  `Area`, `Rates`, `Booking`, `HouseRules`, `Reviews`, `Faq`, `Enquiry`, `Footer`,
  `WhatsAppFab`, plus `Icon.astro` (inline SVG set) and `LangSwitcher.astro`.
- `src/layouts/Base.astro`: html shell, head meta/OG/hreflang, fonts, scroll-reveal, noindex.
- `src/styles/tokens.css` = design tokens; `global.css` = base + helpers.
- `src/data/villa.ts` = language-neutral facts (stats, amenity/distance/facility/room ids +
  icons, `season`, rate periods + extras, house-rule ids and times, review meta, FAQ ids,
  registration number, map centre/radius).
- `src/data/availability.ts` = season window + nightly price + `blockedRanges` +
  `isAvailable`. `priceForDate()` and `fromPriceForMonth()` return **null** outside the
  season, so callers must not format the result as a number without checking.
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
- **Distances are real** (road distance from the actual address via OSRM); owner-supplied
  figures win over the measured ones. Nearest-first, except **Arenal beach is pinned to the
  top** (main draw). Decimals render per language (`1,5` in nl/de/es) via `Intl` in `Area.astro`.
- **Map shows a radius circle, no pin** (see Map section).

## Photos

- Originals: `photos-source/` (git-ignored, large). The shipped set is
  **`photos-source/wendy-20261123/`**: 38 numbered photos from the Nov 2026 shoot, the first
  coherent full set (interiors included). The older `ground/` + `drone/` phone shots stay on
  disk as a fallback but nothing selects them any more. Optimized copies in
  `src/assets/images/` are committed and are what the site uses.
- **Only the first photo of each block carries a visible label** (owner, Nov 2026: a caption
  on every tile left text lying across every small photo on a phone, where captions are
  always shown). `groupLeadByNumber` in `Gallery.astro` maps a filename's leading number to
  a `gallery.groups.<id>` label: 01 pool, 11 outdoor, 15 indoor, 19 kitchens, 21 bedrooms,
  25 bathrooms, 28 arrival, 31 gardens, 35 evening. Renumber it alongside the MAP. The
  per-photo caption is still the alt text and is what the lightbox shows, so nothing is
  lost; tiles without a label get a small zoom glyph instead.
- Pipeline: edit the `MAP` in `scripts/process-photos.mjs`, then
  `node scripts/process-photos.mjs` (rebuilds gallery + hero + intro + `public/og-image.jpg`;
  prints unused sources). Gallery caption comes from the filename token (`…-dining.jpg` ->
  `dining`), mapped in `Gallery.astro` (`captionByToken`); that is a **substring match in key
  order**, so compound tokens must be listed before the shorter tokens they contain
  (`living-dining` before `living`). Grid features tiles 0, 3, 6, so keep three strong photos
  at those positions.
- **Every photo in the shoot is used.** Hero = `02.jpg` (dusk), intro = `05.jpg` (laid
  table), and the gallery holds **37**: the other 36, ordered as a walk-through (pool,
  outdoor living, indoor living, kitchens, the four bedrooms, the three bathrooms, arrival,
  gardens, evening), plus `02.jpg` again as `03-pool-dusk.jpg`. The owner asked for the
  dusk shot in the gallery too (Nov 2026), because phones never see it as the hero.
- **Two cuts of the dusk photo, split at 520px.** A 16:9 frame squeezed into a tall phone
  screen keeps only a narrow strip, and letting the browser take that strip from the middle
  lost half the picture. So phones load `hero-phone.jpg`, a deliberate portrait cut of the
  same `02.jpg` (`mode: 'phone'` in the photo script: centre crop to 1200x2600, full
  height). It keeps the two palms, the arched garden gate, the parasol and the loungers in
  frame above the pool, with the pink sky along the top. `Hero.astro` serves the two
  through a `<picture>` with `<source media="(max-width: 520px)">`, so a browser downloads
  only one. The breakpoint stops at phones on purpose: a tablet would crop the portrait
  image hard, and a phone held sideways is wider than 520px.
- **A daylight shot of the house was tried on phones and rejected** (Nov 2026). It showed
  the villa more plainly and put the text on calm water, but the owner found the evening
  light far more attractive, and on a short viewport the daylight crop came down to a wall
  beside a pool. Do not "improve" the phone hero back to a house shot without asking.
- **The phone hero drives two style blocks**, both at the same 520px: the hero content is
  compacted (smaller kicker, chips and buttons, tighter margins), and `Header.astro` turns
  the logo, the menu button and the language pill light while the bar is still transparent,
  which reads on both the pale sky and the palms. Under 400px the two buttons are shrunk
  further so they stay on one row; wrapping costs about 50px of height and pushes the whole
  block up. `WhatsAppFab.astro` is 48px on phones so it clears the second button. Keep
  these breakpoints in step if the phone photo is ever changed.
- **The hero's second button jumps to `#gallery-grid`, not `#gallery`.** The section
  anchor stops at the heading and leaves the photos below the fold on a phone, so the
  visitor had to scroll again. The grid carries a `scroll-margin-top: 24px` to cancel the
  `.reveal` shift, otherwise the top row lands under the fixed header.
- **Language menu order is the order of `locales` in `villa.ts`**: en, nl, es, de (owner,
  Nov 2026). It also drives hreflang and the generated routes, where order does not matter.

## House video

The owner's own YouTube clip ("Villa Can Miro, Javea", 2:19, channel Robert Bokx) sits
behind a **Watch the video** button placed AFTER the photo grid (owner, Nov 2026: the
gallery should open with the house, not with a film). The id lives in `villa.video`;
`Gallery.astro` builds the player URL. The iframe is **created on first click**, on
`youtube-nocookie.com`, so nothing is fetched from YouTube and no cookie is set for
visitors who never press play. Closing resets the src, otherwise the clip plays on behind
the overlay. Labels: `gallery.video`, `gallery.videoTitle`, `gallery.videoClose`.

## Season, rates & terms

Source of truth is the owner's own Micazu listing (read Nov 2026):
`micazu.nl/vakantiehuis/spanje/costa-blanca/javea/villa-met-privezwembad-en-2000m-tuin-55143/`.

- **Let in JULY AND AUGUST ONLY**, minimum 7 nights. The window lives in `villa.season`;
  `availability.ts` reads it, so the calendar greys out the rest of the year and `Booking`
  opens on the season's first month instead of today when today is before it.
- **One flat rate across the season** (owner, Nov 2026): €5,000 a week, 1 Jul-1 Sep, in
  `villa.rates.periods`. Split that back into several dated rows if the weeks ever differ
  again; `Rates.astro` renders however many there are and centres a single card. Period
  labels are generated from the dates per locale, nothing to translate.
- **The nightly price (€750) deliberately does NOT divide into the week price.** 7 x €750 =
  €5,250 against €5,000 for the same week, and the calendar totals per night, so it quotes
  €5,250 for seven nights. The owner was shown this and chose to keep it (Nov 2026): €750 is
  the single-night rate. `rates.perNightExtra` says so under the price and points the guest
  at the weekly rate, so it does not read as a bug. Do not "fix" it silently.
- **Blocked by hand:** 31 Jul-7 Aug 2027 is booked and sits in `blockedRanges` in
  `availability.ts`. Live Supabase rows are pushed on top of that list, never replacing it.
- **Extras are NOT included** (`villa.rates.extras`): bed linen €30pp, final cleaning €350,
  deposit €750, late-arrival surcharge €50 (after 20:00), cot €45, high chair €45. Only
  water/electricity/Wi-Fi, air conditioning, pool and garden maintenance are in the price.
- Payment (30% deposit, balance per confirmation, full amount within 60 days) and the
  cancellation terms are the owner's own wording, reused with permission.
- **Known conflict with Micazu: the pool.** Micazu says "niet verwarmd"; the owner confirmed
  (Nov 2026) the site is right and the pool IS heated. Micazu is the one to correct.
- The lower floor is a **self-contained apartment** (own entrance, bedroom, bathroom,
  kitchen). That is why there are two kitchens. It is a selling point: say so.

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

- **Web3Forms:** key in `.env` + GH variable `PUBLIC_WEB3FORMS_KEY`. It delivers to the
  account the key was created under, and the request sets no `to` field, so **the key alone
  decides where enquiries land**. Free plan **blocks server-side (curl) submits**, so test
  via a real browser. First-time Gmail may mark it spam; there is a "never spam" filter on
  subject `Can Miró enquiry`.
- **Everything points at michaelabokx@gmail.com** (Nov 2026): the printed address and the
  `mailto:` fallback via `PUBLIC_CONTACT_EMAIL`, and the enquiries themselves via a
  Web3Forms key created under that mailbox (GH variable `PUBLIC_WEB3FORMS_KEY`, swapped 24
  Nov 2026). The old key belonged to florisbokx@gmail.com. Changing the displayed address
  alone does NOT move the enquiries; the key is the only thing that decides that.

## Review form

`Reviews.astro` carries a **Write a review** button and an overlay with the form (owner,
Nov 2026: guests found mailing their review awkward). What it does and does not do:

- It **only sends an e-mail**, through the same Web3Forms key as the enquiry form, with
  subject `Can Miró review`. **Nothing a visitor types reaches the site by itself.** A real
  review is added to `villa.reviews` plus `reviews.items.<quoteId>` in the four
  dictionaries by hand afterwards. That is on purpose: it keeps out spam and invented
  praise, and lets the owner check the sender really stayed.
- Fields: name, e-mail (not published, so the owner can reply), place (optional), month +
  year of the stay, a 1-5 star rating, the review itself, and a **required consent tick**
  ("I stayed here and my review may be published with my name"). Both date dropdowns start
  empty so `required` actually fires. Honeypot spam trap included.
- The stars are five radios in **reverse DOM order** inside a `row-reverse` row, so plain
  CSS lights the chosen star and everything to its left with `~`. They are visually hidden
  and therefore carry **no `required`**: the browser cannot focus an invisible invalid
  control and swallows its own warning, so the script checks the rating itself.
- **The section is always on the page now**, also with no reviews: with an empty list it
  shows a plain heading (`reviews.titleEmpty`), the invitation and the button, not the
  "Loved by our guests" claim. The **nav item in the header and footer is always there**
  too (owner, Nov 2026, who wanted the menu to read as before). It was briefly conditional
  on `villa.reviews`; it is not any more.
- **Link to mail to a guest: `https://villacanmiro.com/nl/#review`** (any language prefix).
  The form opens straight away on that hash, and closing it takes the hash back out.

## Phone layout: the min-width: 0 trap

A grid or flex child keeps its **min-content** width unless told otherwise, and that broke
the page sideways on phones until Nov 2026. Two cases, both fixed, both worth remembering
before adding another grid:

- `Enquiry.astro`: an `<input>` carries a browser default of roughly 170px, so the
  two-column form would not go below ~404px inside a 350px track. Fixed with `min-width: 0`
  on `.enquiry__aside`, `.enquiry__form` and `.field`, one column under 560px, and
  `overflow-wrap: anywhere` on the e-mail address, which is one unbreakable word.
- `Booking.astro`: `.btn` sets `white-space: nowrap`, so the two summary buttons could not
  shrink. Fixed by letting the row wrap under 560px and allowing the labels to break.

To check: `document.documentElement.scrollWidth` must equal `clientWidth` at 360px and
390px. Elements inside the hero and the Leaflet map legitimately exceed the viewport; they
sit in `overflow: hidden` containers and do not move the page.

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

## Search engines

Opened to indexing in Nov 2026, when the owner asked to be findable. What is in place:

- `Base.astro`: `index, follow, max-image-preview:large`, a canonical URL, hreflang for all
  four languages plus `x-default`, Open Graph and Twitter cards.
- `public/robots.txt`: everything allowed except `/admin`, and it points at the sitemap.
- `src/pages/sitemap.xml.ts`: a build-time endpoint, generated from `locales`, one entry per
  language with the other three as `xhtml:link` alternates. **Add a page and you must add it
  here**; there is no sitemap integration, on purpose, for four URLs.
- **JSON-LD** (`VacationRental`) in `Base.astro`: name, description, locality, the offset
  coordinates, contact, bedrooms, occupancy, check-in/out and amenities. It deliberately
  carries **no street address** and **no rating**: the reviews are still placeholders, and
  marking up invented ratings earns a manual penalty.
- `meta.title` / `meta.description` in the four dictionaries carry the rental intent
  ("to rent", "te huur", "zu mieten", "en alquiler") plus Jávea, Xàbia and Costa Blanca.
  Keep titles near 55 characters and descriptions near 155, or they get cut off.

Registered with both engines on 25 Nov 2026: Google Search Console (verified by the
`google-site-verification` meta tag in `Base.astro`, which must stay) and Bing Webmaster
Tools (imported from Search Console, so no second tag). Bing also feeds DuckDuckGo and
Ecosia. Everything else in those accounts is the owner's own; the repo cannot reach them.

## Map & location privacy

Area map (`Area.astro`) = **Leaflet + OpenStreetMap tiles** (no API key), a **radius circle
only, no pin**. Centre + radius: `villa.location` (`lat`, `lng`, `mapRadiusMeters`). Centre
is **intentionally offset ~150 m** from the real address; the **street address is kept out
of the repo and off the site**. Distances in `villa.ts` are real (OSRM) so they stay accurate
despite the offset. "Open in Google Maps" links to the neighbourhood, never the address.

## Next steps roadmap

**Done:** full photo set incl. interiors (Nov 2026 shoot); real rates, extras, house rules,
room-by-room layout and full facilities list (from the Micazu listing); real registration
number VT-510483-A; custom domain
villacanmiro.com (HTTPS); Web3Forms enquiry email (-> michaelabokx@gmail.com); Supabase
`/admin` booking portal; enquiry -> calendar sync as tentative options; live availability on
the public calendar.

**A. To a real public launch**
1. Real **reviews**. The invented ones were removed in Nov 2026, the day the site went
   public. **Two real ones are up** (25 Nov 2026), both sent through the form and both
   approved by the owner. Only quotes from guests who actually stayed, with the rating
   figures they actually gave. What the form sends still has to be copied into
   `villa.reviews` by hand (see Review form).
   - A review's `date` is **"YYYY-MM"**, never a month name: `Reviews.astro` writes it out
     per language, so a Spanish reader gets "Julio de 2026".
   - The Dutch text is the original; the other three dictionaries carry a translation of
     the same quote, so every visitor can read it.
   - `ratingAverage` / `ratingCount` are still **null** on purpose. "5.0 from 2 stays"
     reads thin, and a figure in the structured data has to be one real guests gave. Fill
     them in once there are enough reviews to average honestly.
2. **Google Search Console:** the domain is verified (25 Nov 2026) through the
   `google-site-verification` meta tag in `Base.astro`, which must stay in the head.
   `sitemap.xml` was submitted there on 25 Nov 2026. Anything else in that account is the
   owner's own; nothing in the repo can reach it. Direct link to the sitemaps page:
   `search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fvillacanmiro.com%2F`

**B. Channels / bookings (later)**
5. Airbnb/Booking **iCal** sync: export our confirmed bookings as an iCal feed for the
   platforms to import, and a scheduled function to import their feeds into `bookings`
   (status `blocked`). Or use a channel manager (Smoobu etc.). Low urgency: our form is
   enquiry-only + handled manually, so there is no instant-double-book risk on our side.

**C. Nice-to-haves**
6. Real seasonal **date ranges** in `availability.ts` (not just month buckets).
7. Privacy-friendly **analytics** (e.g. Plausible) once public.
8. Consider **Cloudflare Pages** if a private repo / serverless is wanted (static build ports
   with no code change; re-point DNS, drop `CNAME`).

## Plain-language git (the family works on this site)

Floris's parents edit this site too and do **not** speak git. Never ask them to run or
approve git commands, and never answer them with command names. Recognize these phrases in
normal conversation (Dutch or English) and just do the work:

| They say | You do |
| --- | --- |
| "sla het op", "opslaan", "bewaar dit", "zet het live", "publiceer" | `/opslaan`: build check, commit, push, wait for the deploy, confirm it is live |
| "ververs", "haal op", "update", "wat is er veranderd?" | `/ververs`: pull (rebase), `npm install` if deps changed, summarize the changes in plain language |
| "start de site", "laat het zien", "/start" | `/start`: `npm install` if needed, `npm run dev` in the background, give them the http://localhost:4321/ link |

The full recipes live in `.claude/commands/opslaan.md`, `.claude/commands/ververs.md`
and `.claude/commands/start.md`.

- **"Opslaan" means publishing.** A push goes live on villacanmiro.com in ~40s. Always say so
  in the confirmation, so nobody is surprised.
- **Never push a broken site:** run `npm run build` first. On failure, explain the problem in
  plain language and do not push.
- Reply in the language they wrote in (usually Dutch), and report results without git jargon.
- On a fresh machine git may error with "Author identity unknown". Set it repo-locally to
  Floris Bokx <florisbokx@gmail.com> and carry on; do not make them fix it.

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
