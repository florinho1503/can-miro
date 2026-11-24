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
  // Distances by road from the actual address, in km. Owner-supplied figures
  // take precedence over the OSRM measurements.
  // Order is nearest-first EXCEPT the Arenal beach row, deliberately pinned to
  // the top by the owner because it is the main draw. Decimals are rendered
  // per language in Area.astro (nl/de/es use a comma).
  // Rough drive times: golf ~3 min, supermarket ~7, old town ~9, port ~10,
  // Arenal beach ~11, Alicante airport ~1h35, Valencia airport ~1h30.
  distances: [
    { id: 'arenalBeach', icon: 'beach', km: 6 },
    { id: 'golf', icon: 'flag', km: 1.5 },
    { id: 'supermarket', icon: 'cart', km: 3 },
    { id: 'oldTown', icon: 'town', km: 6 },
    { id: 'port', icon: 'boat', km: 7 },
    { id: 'alicanteAirport', icon: 'plane', km: 100 },
    { id: 'valenciaAirport', icon: 'plane', km: 125 },
  ],

  /**
   * Letting season. Can Miró is let in JULY AND AUGUST ONLY, minimum 7 nights.
   * `availability.ts` uses this window, so the booking calendar shows the rest
   * of the year as not available. Widen the window here to open more months.
   */
  season: {
    year: 2027,
    from: '2027-07-01',
    /** Last night that can be booked (checkout is the next morning). */
    to: '2027-08-31',
    minNights: 7,
  },

  /**
   * Rates per stay, EUR, as published on the owner's Micazu listing (Nov 2026).
   * `from`/`to` are arrival dates; `to` is exclusive. The first two Micazu
   * periods (1-10 and 10-17 July) carry the same price and are merged here.
   * `perNight` is the same across the season and drives the booking calendar
   * via `availability.ts` — keep the two in sync.
   */
  rates: {
    currency: '€',
    unit: 'week',
    periods: [
      // One flat rate across the whole season (owner, Nov 2026). Split this
      // back into several dated rows if the weeks ever differ in price again;
      // Rates.astro renders however many there are.
      { id: 'season', from: '2027-07-01', to: '2027-09-01', pricePerWeek: 5000, minNights: 7 },
    ],
    pricePerNight: 750,
    /**
     * Mandatory and optional extras. `per`: 'stay' | 'person'.
     * `when`: 'booking' (paid when booking) | 'arrival' (paid on site).
     * Labels come from `rates.extras.<id>`.
     */
    extras: [
      { id: 'linen', amount: 30, per: 'person', required: true, when: 'booking' },
      { id: 'cleaning', amount: 350, per: 'stay', required: true, when: 'booking' },
      { id: 'deposit', amount: 750, per: 'stay', required: true, when: 'booking' },
      { id: 'lateArrival', amount: 50, per: 'stay', required: true, when: 'arrival' },
      { id: 'cot', amount: 45, per: 'stay', required: false, when: 'booking' },
      { id: 'highChair', amount: 45, per: 'stay', required: false, when: 'arrival' },
    ],
  },

  /**
   * Room-by-room layout. `floor` maps to `layout.floors.<floor>`, the rest of
   * the text to `layout.rooms.<id>` (name, body, specs[]). The lower floor is
   * a SELF-CONTAINED APARTMENT (own entrance, bedroom, bathroom, kitchen),
   * which is also why the villa has two kitchens.
   */
  rooms: [
    { id: 'living', icon: 'sofa', floor: 'ground' },
    { id: 'kitchen', icon: 'kitchen', floor: 'ground' },
    { id: 'bedroom1', icon: 'bed', floor: 'ground' },
    { id: 'bedroom2', icon: 'bed', floor: 'ground' },
    { id: 'bedroom3', icon: 'bed', floor: 'ground' },
    { id: 'bathroom1', icon: 'bath', floor: 'ground' },
    { id: 'bathroom2', icon: 'bath', floor: 'ground' },
    { id: 'bedroom4', icon: 'bed', floor: 'lower' },
    { id: 'bathroom3', icon: 'bath', floor: 'lower' },
    { id: 'pool', icon: 'pool', floor: 'outside' },
  ],

  /**
   * House rules. The four figures are shown as chips; `items` are the written
   * rules, text in `houseRules.items.<id>`.
   */
  houseRules: {
    checkIn: { from: '16:00', to: '20:00' },
    checkOut: '10:00',
    quietHours: { from: '22:00', to: '08:00' },
    minBookerAge: 28,
    items: [
      'mainBooker',
      'pets',
      'smoking',
      'events',
      'photography',
      'children',
      'poolSupervision',
      'visitors',
      'maintenance',
      'leaveTidy',
      'report',
    ],
  },

  /**
   * Full facilities list, shown under the icon grid. Group titles come from
   * `amenities.facilityGroups.<id>`, item labels from `amenities.facilities.<id>`.
   */
  facilityGroups: [
    { id: 'property', items: ['villaType', 'livingArea', 'gardenArea', 'energyLabel', 'renovated'] },
    { id: 'climate', items: ['airConditioning', 'centralHeating', 'wifi', 'television'] },
    {
      id: 'outside',
      items: [
        'privatePool',
        'poolSize',
        'outdoorKitchen',
        'barbecue',
        'sixTerraces',
        'roofTerrace',
        'veranda',
        'balcony',
        'loungeSet',
        'gardenFurniture',
        'sunLoungers',
        'parasols',
        'outdoorShower',
        'outdoorToilet',
        'outdoorLighting',
        'fencedGarden',
        'privateDriveway',
        'parking',
      ],
    },
    {
      id: 'kitchenLaundry',
      items: [
        'twoKitchens',
        'oven',
        'microwave',
        'dishwasher',
        'fridgeFreezer',
        'coffeeMachine',
        'kettle',
        'cutleryCrockery',
        'washingMachine',
        'tumbleDryer',
        'iron',
        'vacuum',
      ],
    },
    { id: 'linen', items: ['bedLinen', 'towels', 'beachTowels', 'kitchenLinen', 'hairdryer'] },
    { id: 'children', items: ['cot', 'highChair', 'tableTennis', 'poolToys'] },
  ],

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
  faq: ['season', 'apartment', 'checkin', 'deposit', 'cancellation', 'cleaning', 'pool', 'kids', 'pets', 'parking'],

  /**
   * Tourist rental registration number, REQUIRED in the footer by Comunidad
   * Valenciana. Taken from the owner's own Micazu listing (Nov 2026).
   */
  registrationNumber: 'VT-510483-A',
} as const;

export type Locale = 'en' | 'nl' | 'de' | 'es';
export const locales: Locale[] = ['en', 'nl', 'de', 'es'];
export const defaultLocale: Locale = 'en';
