import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { addDays, daysBetween, todayIso } from "./date";
import { computeStreak, computeWorkoutStats, milesPerWeek, phaseIndex } from "./stats";
import type { WorkoutRow } from "./types";

function row(date: string, overrides: Partial<WorkoutRow> = {}): WorkoutRow {
  return {
    week: 1,
    phase: "Base",
    date,
    day: null,
    type: "Run",
    slug: "run",
    category: "run",
    prescribed: null,
    done: 1,
    notes: null,
    distanceMi: null,
    durationMin: null,
    rpe: null,
    takeaway: null,
    ...overrides,
  };
}

const originalTz = process.env.TZ;
afterEach(() => {
  process.env.TZ = originalTz;
});

describe("date helpers", () => {
  it("todayIso uses the Los Angeles calendar day", () => {
    assert.equal(todayIso(new Date("2026-04-21T05:00:00Z")), "2026-04-20");
    assert.equal(todayIso(new Date("2026-04-21T08:00:00Z")), "2026-04-21");
  });

  it("addDays crosses month, year, and DST boundaries", () => {
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
    assert.equal(addDays("2025-12-31", 1), "2026-01-01");
    assert.equal(addDays("2026-03-08", 1), "2026-03-09");
  });

  it("daysBetween counts calendar days in any server timezone", () => {
    for (const tz of ["UTC", "America/Los_Angeles", "Asia/Kolkata", "Pacific/Kiritimati"]) {
      process.env.TZ = tz;
      assert.equal(daysBetween("2026-03-01", "2026-03-15"), 14, tz);
      assert.equal(daysBetween("2026-03-15", "2026-03-01"), -14, tz);
      assert.equal(daysBetween("2026-06-01", "2026-06-01"), 0, tz);
    }
  });
});

describe("computeStreak", () => {
  it("counts consecutive done days ending at the latest row, including rest", () => {
    const rows = [
      row("2026-04-15"),
      row("2026-04-16", { done: 0 }),
      row("2026-04-17"),
      row("2026-04-18", { category: "rest" }),
      row("2026-04-19", { done: 0.5 }),
    ];
    assert.equal(computeStreak(rows), 3);
  });

  it("breaks on a missing day", () => {
    assert.equal(computeStreak([row("2026-04-17"), row("2026-04-19")]), 1);
  });

  it("is zero when the latest row was missed or there are no rows", () => {
    assert.equal(computeStreak([row("2026-04-18"), row("2026-04-19", { done: 0 })]), 0);
    assert.equal(computeStreak([]), 0);
  });

  it("does not depend on the server timezone", () => {
    const rows = [row("2026-03-07"), row("2026-03-08"), row("2026-03-09")];
    for (const tz of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
      process.env.TZ = tz;
      assert.equal(computeStreak(rows), 3, tz);
    }
  });
});

describe("milesPerWeek / phaseIndex", () => {
  it("sums miles by week, sorted, skipping rows without week or distance", () => {
    const rows = [
      row("2026-04-01", { week: 2, distanceMi: 3 }),
      row("2026-04-02", { week: 1, distanceMi: 2.5 }),
      row("2026-04-03", { week: 2, distanceMi: 1 }),
      row("2026-04-04", { week: null, distanceMi: 10 }),
      row("2026-04-05", { week: 1, distanceMi: null }),
    ];
    assert.deepEqual(milesPerWeek(rows), [
      { week: 1, miles: 2.5 },
      { week: 2, miles: 4 },
    ]);
  });

  it("matches phases by their first word, case-insensitively", () => {
    assert.equal(phaseIndex("base 2"), 0);
    assert.equal(phaseIndex("Taper"), 4);
    assert.equal(phaseIndex(null), -1);
  });
});

describe("computeWorkoutStats", () => {
  it("aggregates totals and drops future rows", () => {
    const rows = [
      row("2026-04-17", { distanceMi: 3, durationMin: 30, phase: "Base" }),
      row("2026-04-18", { category: "rest", done: 1 }),
      row("2026-04-19", { distanceMi: 2, durationMin: 20, done: 0.5, phase: "Build 1" }),
      row("2026-04-20", { distanceMi: 100, durationMin: 600 }),
    ];
    const stats = computeWorkoutStats(rows, "2026-05-01", "2026-04-19");

    assert.equal(stats.rows.length, 3);
    assert.equal(stats.daysToRace, 12);
    assert.equal(stats.trainedCount, 2);
    assert.equal(stats.miles, 5);
    assert.equal(stats.minutes, 50);
    assert.equal(stats.streak, 3);
    assert.equal(stats.scheduledCount, 2);
    assert.equal(stats.completion, 75);
    assert.equal(stats.phaseIdx, 1);
  });

  it("reports zero completion and race day when nothing is scheduled", () => {
    const stats = computeWorkoutStats([], "2026-04-19", "2026-04-19");
    assert.equal(stats.completion, 0);
    assert.equal(stats.daysToRace, 0);
    assert.equal(stats.phaseIdx, -1);
  });
});
