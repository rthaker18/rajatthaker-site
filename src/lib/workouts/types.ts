export interface WorkoutRow {
  week: number | null;
  phase: string | null;
  date: string; // ISO yyyy-mm-dd
  day: string | null;
  type: string;
  slug: string;
  category: string; // badge grouping: race, hyrox, climbing, hike, bike, rest, recovery, strength, run, walk, training
  prescribed: string | null;
  done: number | null; // 1 = ✓, 0.5 = ½, 0 = missed
  notes: string | null;
  distanceMi: number | null;
  durationMin: number | null;
  rpe: number | null;
  takeaway: string | null;
}

export interface WeekTarget {
  week: number;
  phase: string | null;
  dates: string | null;
  notes: string | null;
}

export interface WorkoutDb {
  updatedAt: string;
  race: { name: string; date: string }; // ISO date
  rows: WorkoutRow[];
  weeks: WeekTarget[];
  badges: Record<string, string>; // slug -> public blob url
}
