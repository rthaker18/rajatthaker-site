import { addDays, daysBetween } from "./date";
import type { WorkoutRow } from "./types";

export const PHASES = ["Base", "Build", "Peak", "Sharpen", "Taper & Race"];

export interface WorkoutStats {
  rows: WorkoutRow[];
  daysToRace: number;
  trainedCount: number;
  miles: number;
  minutes: number;
  streak: number;
  perWeek: { week: number; miles: number }[];
  scheduledCount: number;
  completion: number;
  phaseIdx: number;
}

/** Consecutive days ending at the latest row with done > 0 (rest counts as done). */
export function computeStreak(rows: WorkoutRow[]): number {
  const byDate = new Map(rows.map((r) => [r.date, r]));
  const latest = rows.map((r) => r.date).sort().at(-1);
  let streak = 0;
  for (let key = latest; key; key = addDays(key, -1)) {
    const row = byDate.get(key);
    if (!row || (row.done ?? 0) <= 0) break;
    streak++;
  }
  return streak;
}

export function milesPerWeek(rows: WorkoutRow[]): { week: number; miles: number }[] {
  const milesByWeek = new Map<number, number>();
  for (const r of rows) {
    if (r.week == null || r.distanceMi == null) continue;
    milesByWeek.set(r.week, (milesByWeek.get(r.week) ?? 0) + r.distanceMi);
  }
  return [...milesByWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([week, miles]) => ({ week, miles }));
}

export function phaseIndex(phase: string | null | undefined): number {
  return PHASES.findIndex((p) =>
    (phase ?? "").toLowerCase().includes(p.toLowerCase().split(" ")[0])
  );
}

/** All stats for the workouts page. `today` is a yyyy-mm-dd string (see todayIso). */
export function computeWorkoutStats(
  allRows: WorkoutRow[],
  raceDate: string,
  today: string
): WorkoutStats {
  // Never show future-dated rows (defense-in-depth; sync already drops them)
  const rows = allRows.filter((r) => r.date <= today);

  const trained = rows.filter((r) => (r.done ?? 0) > 0 && r.category !== "rest");
  const scheduled = rows.filter((r) => r.category !== "rest" && r.done != null);
  const completion =
    scheduled.length > 0
      ? Math.round(
          (scheduled.reduce((s, r) => s + (r.done ?? 0), 0) / scheduled.length) * 100
        )
      : 0;

  return {
    rows,
    daysToRace: daysBetween(today, raceDate),
    trainedCount: trained.length,
    miles: rows.reduce((s, r) => s + (r.distanceMi ?? 0), 0),
    minutes: rows.reduce((s, r) => s + (r.durationMin ?? 0), 0),
    streak: computeStreak(rows),
    perWeek: milesPerWeek(rows),
    scheduledCount: scheduled.length,
    completion,
    phaseIdx: phaseIndex(rows.at(-1)?.phase),
  };
}
