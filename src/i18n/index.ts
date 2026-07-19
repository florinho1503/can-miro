/**
 * Tiny i18n helper. English is the canonical dictionary shape; other languages
 * fall back to English for any missing key, so a half-translated `de.json` still
 * renders a complete page.
 */
import en from './en.json';
import nl from './nl.json';
import de from './de.json';
import es from './es.json';
import type { Locale } from '../data/villa';

export type Dict = typeof en;

const dictionaries: Record<Locale, Dict> = {
  en,
  nl: nl as Dict,
  de: de as Dict,
  es: es as Dict,
};

/** Deep-get a dot path (e.g. "amenities.items.privatePool") with EN fallback. */
function lookup(dict: Dict, path: string): string | undefined {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], dict) as
    | string
    | undefined;
}

export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? en;
  return function t(path: string): string {
    const value = lookup(dict, path) ?? lookup(en, path);
    return value ?? path;
  };
}

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

/**
 * Locale-aware path for links, including Astro's configured `base` so links work
 * under a subpath (e.g. GitHub Pages /can-miro/). English lives at the base root.
 */
export function localizePath(path: string, locale: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' or '/can-miro'
  const rest = path.replace(/^\//, ''); // drop leading slash
  const localePrefix = locale === 'en' ? '' : `${locale}/`;
  return `${base}/${localePrefix}${rest}`.replace(/\/{2,}/g, '/');
}
