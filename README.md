# Can Miró

Marketing website for **Can Miró**, a private villa with pool in La Lluca, Jávea
(Costa Blanca, Spain). Single long-scroll page, built with [Astro](https://astro.build),
available in **English, Dutch, German and Spanish**.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview the production build
```

Requires Node 18+ (built on Node 22).

## Languages

- English is served at `/`, the others at `/nl/`, `/de/`, `/es/`.
- All copy lives in `src/i18n/{en,nl,de,es}.json`. Any missing key falls back to English.
- Villa facts (numbers, distances, rate figures) live once in `src/data/villa.ts`.

## Photos

Full-size originals live in `photos-source/{ground,drone}` (git-ignored, they're
large). The site ships the **optimized copies** in `src/assets/images/`, which Astro
converts to WebP/AVIF at build time.

To add, remove or re-order photos:

1. Drop originals into `photos-source/ground` or `photos-source/drone`.
2. Edit the `MAP` array in `scripts/process-photos.mjs`, each entry maps a source
   file to a destination (`hero.jpg`, `intro.jpg`, or a `gallery/NN-token.jpg`).
   The gallery caption is derived from the filename token (e.g. `…-dining.jpg` →
   the `alfresco` caption in `src/i18n/*.json`); the grid features tiles 1, 4 and 7.
3. Run `node scripts/process-photos.mjs`. It rebuilds `src/assets/images/gallery`,
   the hero/intro, and `public/og-image.jpg`, and prints any unused source files.

**Still needed:** interior photography (living rooms, the two kitchens, bedrooms,
bathrooms). The gallery is currently exterior/grounds only, add interior shots to
`photos-source` and new `MAP` entries when available.

## Configuration (`.env`)

Copy `.env.example` to `.env` and set:

- `PUBLIC_WHATSAPP_NUMBER`, international format, digits only (e.g. `34600123456`).
- `PUBLIC_CONTACT_EMAIL`, the enquiry / contact address.
- `PUBLIC_WEB3FORMS_KEY`, free access key from [web3forms.com](https://web3forms.com).
  With a key, the enquiry form submits by email in the background. **Without** a key
  it falls back to opening the visitor's mail client (mailto). WhatsApp works either way.

## Before going live

- [ ] Real photos in place (see above).
- [ ] `.env` set with WhatsApp number, email and Web3Forms key.
- [ ] Confirm real **rates**, **reviews**, and **distances** in `src/data/villa.ts`.
- [ ] Set the **tourist rental registration number** (`registrationNumber` in
      `src/data/villa.ts`), legally required in the footer for Comunidad Valenciana.
- [ ] Set the real domain in `astro.config.mjs` (`site`) for correct canonical/OG URLs.
- [ ] Check the map circle in `villa.location` (`lat`/`lng`/`mapRadiusMeters`). It shows
      a radius only, no pin. Keep the centre approximate so the exact address stays private.

## Deploy

Static output, host `dist/` anywhere. Cloudflare Pages / Netlify: build command
`npm run build`, output directory `dist`. Set the `PUBLIC_*` env vars in the host's
dashboard.
