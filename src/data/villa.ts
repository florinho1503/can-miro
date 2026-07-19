/**
 * Can Miró, language-neutral facts.
 *
 * Numbers, ids, icons and structural data live here so they stay DRY across
 * every language. Human-readable labels live in the per-language dictionaries
 * (src/i18n/*.json), keyed by the ids below. Swap real values in here.
 */

export const villa = {
  name: 'Can Miró',
  location: {
    urbanisation: 'La Lluca',
    town: 'Jávea (Xàbia)',
    region: 'Costa Blanca, Spain',
    // Map centre for the privacy circle. Intentionally offset ~150 m from the
    // real address so the exact villa is NOT pinpointed; the 800 m radius circle
    // then covers the wider Lluca/golf area. The street address is kept out of
    // the codebase and off the website. Distances below are real (measured by
    // road from the actual address), so they stay accurate despite the offset.
    lat: 38.7545,
    lng: 0.1441,
    // Radius (metres) of the privacy circle drawn on the map.
    mapRadiusMeters: 800,
  },

  /** Headline stats shown as chips in the hero. */
  stats: [
    { id: 'guests', icon: 'guests', value: 8 },
    { id: 'bedrooms', icon: 'bed', value: 4 },
    { id: 'bathrooms', icon: 'bath', value: 3 },
    { id: 'pool', icon: 'pool', value: null },
  ],

  /**
   * Amenities grouped for the "The Villa" section. `id` maps to a label in the
   * dictionaries under `amenities.items.<id>`; `icon` maps to an inline SVG.
   */
  amenityGroups: [
    {
      id: 'space',
      items: [
        { id: 'bedrooms4', icon: 'bed' },
        { id: 'bathrooms3', icon: 'bath' },
        { id: 'sleeps8', icon: 'guests' },
        { id: 'twoKitchens', icon: 'kitchen' },
      ],
    },
    {
      id: 'outdoor',
      items: [
        { id: 'privatePool', icon: 'pool' },
        { id: 'fourSeating', icon: 'sun' },
        { id: 'tableTennis', icon: 'pingpong' },
        { id: 'bbq', icon: 'bbq' },
      ],
    },
    {
      id: 'comfort',
      items: [
        { id: 'airConditioning', icon: 'ac' },
        { id: 'wifi', icon: 'wifi' },
        { id: 'tv', icon: 'tv' },
        { id: 'parking', icon: 'car' },
      ],
    },
  ],

  /** Distances for the Area section. `id` maps to `area.places.<id>`. */
  // Distances by road from the actual address (rounded km), nearest first.
  // Rough drive times: golf ~3 min, supermarket ~7, old town ~9, port ~10,
  // Arenal beach ~11, Alicante airport ~1h35, Valencia airport ~1h30.
  distances: [
    { id: 'golf', icon: 'flag', km: 2 },
    { id: 'supermarket', icon: 'cart', km: 4 },
    { id: 'oldTown', icon: 'town', km: 6 },
    { id: 'port', icon: 'boat', km: 7 },
    { id: 'arenalBeach', icon: 'beach', km: 8 },
    { id: 'alicanteAirport', icon: 'plane', km: 100 },
    { id: 'valenciaAirport', icon: 'plane', km: 125 },
  ],

  /**
   * Seasonal rates, PLACEHOLDER figures (price per week, EUR). Season labels
   * come from `rates.seasons.<id>`.
   */
  rates: {
    currency: '€',
    unit: 'week',
    rows: [
      { id: 'low', pricePerWeek: 1750, minNights: 5 },
      { id: 'mid', pricePerWeek: 2450, minNights: 7 },
      { id: 'high', pricePerWeek: 3600, minNights: 7 },
      { id: 'peak', pricePerWeek: 4500, minNights: 7 },
    ],
  },

  /**
   * Guest reviews, PLACEHOLDER. `quoteId` maps to `reviews.items.<quoteId>`.
   * name/date shown as-is.
   */
  reviews: [
    { quoteId: 'r1', name: 'Sophie & Mark', origin: 'London, UK', rating: 5, date: 'August 2025' },
    { quoteId: 'r2', name: 'Familie de Vries', origin: 'Utrecht, NL', rating: 5, date: 'July 2025' },
    { quoteId: 'r3', name: 'Anna & Thomas', origin: 'Munich, DE', rating: 5, date: 'June 2025' },
  ],
  ratingAverage: 4.9,
  ratingCount: 37,

  /** FAQ, `id` maps to `faq.items.<id>.q` and `.a`. */
  faq: ['checkin', 'deposit', 'cancellation', 'pets', 'pool', 'kids', 'cleaning', 'parking'],

  /** Tourist rental registration number, REQUIRED in the footer. Placeholder. */
  registrationNumber: 'VT-XXXXXX-A',
} as const;

export type Locale = 'en' | 'nl' | 'de' | 'es';
export const locales: Locale[] = ['en', 'nl', 'de', 'es'];
export const defaultLocale: Locale = 'en';
