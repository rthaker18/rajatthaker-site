import Link from "next/link";
import { getWorkoutDb } from "@/lib/workouts/db";
import { SITE_TIME_ZONE, todayIso } from "@/lib/workouts/date";
import { PHASES, computeWorkoutStats } from "@/lib/workouts/stats";
import type { WorkoutDb } from "@/lib/workouts/types";
import WorkoutGrid from "./workout-grid";

export const dynamic = "force-dynamic";

export const metadata = { title: "Workouts — Rajat Thaker" };

function WeeklyMiles({ perWeek }: { perWeek: { week: number; miles: number }[] }) {
  const max = Math.max(...perWeek.map((w) => w.miles), 1);
  return (
    <div className="flex h-24 items-end gap-1">
      {perWeek.map((w) => (
        <div
          key={w.week}
          title={`Week ${w.week}: ${w.miles.toFixed(1)} mi`}
          className="flex-1 rounded-t bg-orange-500/80 hover:bg-orange-400"
          style={{ height: `${Math.max(2, (w.miles / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-2xl font-bold text-orange-400">{value}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  );
}

export default async function WorkoutsPage() {
  const db: WorkoutDb | null = await getWorkoutDb();

  if (!db) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Workouts</h1>
          <p className="mt-4 text-zinc-400">
            No training data yet — the first sync hasn&apos;t run. Check back soon.
          </p>
        </main>
      </div>
    );
  }

  const {
    rows,
    daysToRace,
    trainedCount,
    miles,
    minutes,
    streak,
    perWeek,
    scheduledCount,
    completion,
    phaseIdx,
  } = computeWorkoutStats(db.rows, db.race.date, todayIso());

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          ← Back home
        </Link>
        <section className="mt-4 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <p className="text-xs uppercase tracking-widest text-orange-500">
          {db.race.name}
        </p>
        <h1 className="mt-1 text-4xl font-black text-zinc-50 sm:text-5xl">
          {daysToRace > 0 ? (
            <>
              {daysToRace} day{daysToRace === 1 ? "" : "s"}{" "}
              <span className="text-orange-500">to race</span>
            </>
          ) : (
            <>
              Race <span className="text-orange-500">complete</span> 🏁
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {db.race.date} · last sync {new Date(db.updatedAt).toLocaleDateString("en-US", {
            timeZone: SITE_TIME_ZONE,
          })}
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Workouts done" value={String(trainedCount)} />
        <StatTile label="Miles logged" value={miles.toFixed(1)} />
        <StatTile label="Hours trained" value={(minutes / 60).toFixed(1)} />
        <StatTile label="Day streak" value={String(streak)} />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">Completion</h2>
            <span className="text-xs text-zinc-500">
              {scheduledCount} scheduled sessions
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {completion}% of prescribed workouts done (½ counts half)
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-2 text-sm font-semibold text-zinc-200">
            Miles per week
          </h2>
          <WeeklyMiles perWeek={perWeek} />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">Phases</h2>
        <div className="flex flex-wrap gap-2">
          {PHASES.map((p, i) => (
            <span
              key={p}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i === phaseIdx
                  ? "bg-orange-500 text-black"
                  : i < phaseIdx
                    ? "bg-zinc-700 text-zinc-400 line-through"
                    : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </section>

        <div className="mt-8">
          <WorkoutGrid rows={[...rows].reverse()} badges={db.badges} />
        </div>
      </main>
    </div>
  );
}
