/**
 * Sitemap, generated at build time from `locales` so it can never drift out of
 * step with the routes. Four URLs today (one per language), each listing the
 * other three as hreflang alternates, which is what tells Google these are
 * translations of one page rather than four thin duplicates.
 *
 * Add a page to the site and it must be added here too; there is no sitemap
 * integration installed, on purpose, for a site this size.
 */
import type { APIRoute } from 'astro';
import { locales, defaultLocale } from '../data/villa';
import { localizePath } from '../i18n';

const SITE = 'https://villacanmiro.com';

function url(locale: (typeof locales)[number]): string {
  return new URL(localizePath('/', locale), SITE).href;
}

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);

  const alternates = [
    ...locales.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l)}" />`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(defaultLocale)}" />`,
  ].join('\n');

  const entries = locales
    .map(
      (l) => `  <url>
    <loc>${url(l)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === defaultLocale ? '1.0' : '0.9'}</priority>
${alternates}
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
