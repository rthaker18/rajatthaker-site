"use client";

import { useMemo, useState } from "react";
import type { WorkoutRow } from "@/lib/workouts/types";

function FlameMeter({ rpe }: { rpe: number | null }) {
  if (rpe == null) return null;
  const level = Math.max(0, Math.min(10, rpe));
  const color =
    level >= 8 ? "text-red-500" : level >= 5 ? "text-orange-400" : "text-yellow-300";
  return (
    <span className={`text-xs font-semibold ${color}`} title={`RPE ${rpe}`}>
      {"🔥".repeat(Math.max(1, Math.round(level / 3)))}
      <span className="ml-1 text-zinc-400">RPE {rpe}</span>
    </span>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  race: "Race",
  hyrox: "HYROX",
  climbing: "Climbing",
  hike: "Hike",
  bike: "Bike",
  rest: "Rest",
  recovery: "Recovery",
  strength: "Strength",
  run: "Run",
  walk: "Walk",
  training: "Training",
};

export default function WorkoutGrid({
  rows,
  badges,
}: {
  rows: WorkoutRow[];
  badges: Record<string, string>;
}) {
  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.category))].sort(),
    [rows]
  );
  const [filter, setFilter] = useState<string>("all");

  const visible =
    filter === "all" ? rows : rows.filter((r) => r.category === filter);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === "all"
              ? "bg-orange-500 text-black"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          All ({rows.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === cat
                ? "bg-orange-500 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r, i) => (
          <article
            key={`${r.date}-${i}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-start gap-3">
              {badges[r.category] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={badges[r.category]}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-lg">
                  {r.category === "rest" ? "😴" : "🏋️"}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-zinc-100">
                  {r.type}
                </h3>
                <p className="text-xs text-zinc-500">
                  {r.date}
                  {r.day ? ` · ${r.day}` : ""}
                  {r.week != null ? ` · Wk ${r.week}` : ""}
                </p>
              </div>
              <span className="ml-auto shrink-0 text-sm">
                {r.done === 1 ? "✅" : r.done === 0.5 ? "½" : r.done === 0 ? "❌" : ""}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
              {r.distanceMi != null && <span>{r.distanceMi} mi</span>}
              {r.durationMin != null && <span>{Math.round(r.durationMin)} min</span>}
              <FlameMeter rpe={r.rpe} />
            </div>
            {r.takeaway && (
              <p className="mt-2 line-clamp-3 text-xs text-zinc-400">{r.takeaway}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
