/**
 * Availability & nightly pricing for the booking calendar.
 *
 * Can Miró is let in JULY AND AUGUST ONLY (see `villa.season`), so every date
 * outside that window is reported as unavailable and carries no price. Within
 * the window, availability is live: `Booking.astro` fetches the public
 * `availability()` RPC from Supabase on load and fills `blockedRanges`.
 */
import { villa } from './villa';

/** Nightly price (EUR). One rate across the season, as published by the owner. */
export const nightly = villa.rates.pricePerNight;

const SEASON_FROM = villa.season.from; // first bookable night, inclusive
const SEASON_TO = villa.season.to; // last bookable night, inclusive

export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Is this night inside the letting season at all? */
export function inSeason(d: Date): boolean {
  const iso = isoDay(d);
  return iso >= SEASON_FROM && iso <= SEASON_TO;
}

/** Nightly price, or null outside the season. */
export function priceForDate(d: Date): number | null {
  return inSeason(d) ? nightly : null;
}

/**
 * Lowest nightly price in a month, or **null** when the month is outside the
 * season. Callers must handle null: formatting it as a number renders "∞".
 */
export function fromPriceForMonth(year: number, month: number): number | null {
  const days = daysInMonth(year, month);
  let min: number | null = null;
  for (let day = 1; day <= days; day++) {
    const p = priceForDate(new Date(year, month, day));
    if (p !== null && (min === null || p < min)) min = p;
  }
  return min;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Confirmed bookings as [start, end) date strings (YYYY-MM-DD; `end` = checkout
 * day, i.e. that night is free again). Empty at build time and filled at
 * runtime from the Supabase `availability()` RPC.
 */
export interface BlockedRange {
  start: string; // first booked night, inclusive (YYYY-MM-DD)
  end: string; // checkout day, exclusive (YYYY-MM-DD)
}

export const blockedRanges: BlockedRange[] = [
  // Booked, told to us directly by the owner (Nov 2026). `end` is the checkout
  // day and is NOT itself blocked, so this covers the nights of 31 July up to
  // and including 6 August; 7 August is free again for the next arrival.
  // The live Supabase rows are pushed on top of this list, never replacing it,
  // so adding the same stay in /admin later only duplicates it harmlessly.
  { start: '2027-07-31', end: '2027-08-07' },
];

export function isAvailable(d: Date, today: Date): boolean {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (day < start) return false; // past
  if (!inSeason(day)) return false; // outside July/August
  const iso = isoDay(day);
  return !blockedRanges.some((r) => iso >= r.start && iso < r.end);
}
