/**
 * Availability & nightly pricing for the booking calendar.
 *
 * For now availability is generated deterministically (a stable pseudo-random
 * pattern seeded by the date) so the calendar looks realistic without a backend.
 * When you connect Booking.com / Airbnb / a channel manager later, replace
 * `isAvailable()` with a lookup into the synced blocked-dates set (e.g. parsed
 * from the platforms' iCal feeds). Nothing else needs to change.
 */

export type Season = 'low' | 'mid' | 'high' | 'peak';

/** Nightly price (EUR) per season, aligned with the weekly rates in villa.ts. */
export const nightly: Record<Season, number> = {
  low: 250,
  mid: 350,
  high: 515,
  peak: 645,
};

/** Month (0=Jan … 11=Dec) → season, tuned for the Costa Blanca calendar. */
const MONTH_SEASON: Season[] = [
  'low', // Jan
  'low', // Feb
  'low', // Mar
  'mid', // Apr
  'mid', // May
  'high', // Jun
  'peak', // Jul
  'peak', // Aug
  'high', // Sep
  'mid', // Oct
  'low', // Nov
  'low', // Dec
];

export function seasonForDate(d: Date): Season {
  return MONTH_SEASON[d.getMonth()];
}

export function priceForDate(d: Date): number {
  return nightly[seasonForDate(d)];
}

/** The lowest nightly price occurring in a given month (for the "from" label). */
export function fromPriceForMonth(year: number, month: number): number {
  let min = Infinity;
  const days = daysInMonth(year, month);
  for (let day = 1; day <= days; day++) {
    min = Math.min(min, priceForDate(new Date(year, month, day)));
  }
  return min;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Deterministic pseudo-random availability. Same date always yields the same
 * result, and short "booked" clusters appear so it reads like a real calendar.
 * ~75% of future nights are available. Past dates are never available.
 */
export function isAvailable(d: Date, today: Date): boolean {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (day < start) return false;

  const key = day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate();
  // Cheap hash → 0..1
  const rand = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  // Book occasional multi-night blocks by seeding on a ~4-day bucket, plus a
  // little per-day noise, so unavailability comes in believable runs.
  const bucket = Math.floor(key / 3);
  return !(rand(bucket) < 0.22 || rand(key) < 0.08);
}
