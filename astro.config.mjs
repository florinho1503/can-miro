// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://florinho1503.github.io/can-miro/
  // On a custom domain later, set `site` to it and remove `base`.
  site: 'https://florinho1503.github.io',
  base: '/can-miro',
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
