// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Custom domain on GitHub Pages: the site lives at the domain root, so no `base`.
  site: 'https://villacanmiro.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl', 'de', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    // Allow Astro to optimize local placeholder images.
    responsiveStyles: true,
  },
});
