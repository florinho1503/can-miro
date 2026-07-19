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
 * Past dates are never available.
 *
 * `blockedRanges` holds confirmed bookings as [start, end) date strings
 * (YYYY-MM-DD; `end` = checkout day, i.e. that night is free again). It is
 * EMPTY for now (no bookings yet, no fake data). When the admin/booking backend
 * is connected, populate this list (at build time or via a client-side fetch of
 * a PII-free availability feed) and the calendar updates automatically.
 */
export interface BlockedRange {
  start: string; // first booked night, inclusive (YYYY-MM-DD)
  end: string; // checkout day, exclusive (YYYY-MM-DD)
}

export const blockedRanges: BlockedRange[] = [];

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isAvailable(d: Date, today: Date): boolean {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (day < start) return false; // past
  const iso = isoDay(day);
  return !blockedRanges.some((r) => iso >= r.start && iso < r.end);
}
