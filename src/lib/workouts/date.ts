export const SITE_TIME_ZONE = "America/Los_Angeles";

const DAY_MS = 86_400_000;

/** Today's date in America/Los_Angeles as yyyy-mm-dd. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
  }).format(now);
}

// Calendar math on yyyy-mm-dd strings is done in UTC so the result never
// depends on the server's local timezone.
function isoToUtcMs(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Shift a yyyy-mm-dd date by a number of calendar days. */
export function addDays(iso: string, days: number): string {
  return new Date(isoToUtcMs(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Whole calendar days from `fromIso` to `toIso` (negative if `toIso` is earlier). */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((isoToUtcMs(toIso) - isoToUtcMs(fromIso)) / DAY_MS);
}
