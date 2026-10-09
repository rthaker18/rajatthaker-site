/** Today's date in America/Los_Angeles as yyyy-mm-dd. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
  }).format(new Date());
}
