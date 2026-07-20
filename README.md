# Can Miró

Marketing website + private booking admin for **Can Miró**, a villa with a heated pool in
La Lluca, Jávea (Costa Blanca, Spain). Built with [Astro](https://astro.build), in
**English, Dutch, German and Spanish**.

**Live:** https://villacanmiro.com (private portal at `/admin`).

For the full architecture, decisions and roadmap, see **`CLAUDE.md`**.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview the production build
```

Requires Node 18+ (built on Node 22). Copy `.env.example` to `.env` first (see Configuration).

## Languages

- English is served at `/`, the others at `/nl/`, `/de/`, `/es/`.
- All copy lives in `src/i18n/{en,nl,de,es}.json`. Any missing key falls back to English.
- Villa facts (numbers, distances, rate figures) live once in `src/data/villa.ts`.

## Photos

Full-size originals live in `photos-source/{ground,drone}` (git-ignored). The site ships the
**optimized copies** in `src/assets/images/`, which Astro converts to WebP/AVIF at build.

To add, remove or re-order photos:

1. Drop originals into `photos-source/ground` or `photos-source/drone`.
2. Edit the `MAP` array in `scripts/process-photos.mjs` (each entry maps a source file to
   `hero.jpg`, `intro.jpg`, or a `gallery/NN-token.jpg`). Gallery caption is derived from the
   filename token (e.g. `…-dining.jpg` -> the `alfresco` caption); the grid features the 1st,
   4th and 7th tiles.
3. Run `node scripts/process-photos.mjs` (rebuilds gallery + hero + intro + `og-image.jpg`).

**Still needed:** interior photography (living rooms, the two kitchens, bedrooms, bathrooms).
The gallery is currently exterior/grounds only.

## Bookings & admin (`/admin`)

- `/admin` is a private portal (login via Supabase Auth) to manage bookings: dates, name,
  contact, guests, **paid** toggle, status, notes.
- The public enquiry form sends an **email** and also creates a **tentative "option"** in the
  calendar. The owner confirms it in `/admin` (status -> "confirmed"), which then shows the
  dates as booked on the public calendar. Options do not block the public calendar until
  confirmed.
- Backend is **Supabase** (Postgres + Auth). Guest data stays behind login; the public site
  only ever reads PII-free date ranges. Full setup + SQL in `CLAUDE.md`.

## Configuration (`.env`)

Copy `.env.example` to `.env` and set:

- `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_CONTACT_EMAIL` - contact shown across the site.
- `PUBLIC_WEB3FORMS_KEY` - enquiry email delivery ([web3forms.com](https://web3forms.com)).
  Without it, the form falls back to a `mailto:` compose. WhatsApp works either way.
- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` - booking backend + `/admin` portal.
  These are public-by-design keys (Supabase RLS protects the data).

For the **live site**, the same values are set as **GitHub Actions repo variables** (repo
Settings -> Secrets and variables -> Actions -> Variables), so `.env` is only for local dev.

## Before going live

- [ ] Dedicated house inbox (`canmiro@gmail.com`): new Web3Forms key + repoint contact email.
- [ ] Real **tourist rental registration number** (`registrationNumber` in `src/data/villa.ts`),
      legally required in the footer for Comunidad Valenciana.
- [ ] Confirm real **rates** and **reviews** (currently placeholders) in `villa.ts` + i18n.
- [ ] Add **interior photos**.
- [ ] Remove the `noindex` meta in `src/layouts/Base.astro` (keep it on `admin.astro`).

## Deploy

Hosted on **GitHub Pages** at **villacanmiro.com**; **auto-deploys on every push to `main`**
via GitHub Actions (`.github/workflows/deploy.yml`). Custom domain via `public/CNAME` + DNS.

The build is plain static output, so it can move to Cloudflare Pages / Netlify later with no
code change (build command `npm run build`, output `dist`); set the `PUBLIC_*` env vars in the
host and re-point DNS.
