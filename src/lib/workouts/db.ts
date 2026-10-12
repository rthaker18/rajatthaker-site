import { head } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import type { WorkoutDb } from "./types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const isNullableNumber = (v: unknown) => v === null || typeof v === "number";
const isNullableString = (v: unknown) => v === null || typeof v === "string";

/** Returns a description of the first problem found, or null if `data` matches WorkoutDb. */
export function findWorkoutDbProblem(data: unknown): string | null {
  if (!isRecord(data)) return "root is not an object";
  if (typeof data.updatedAt !== "string") return "updatedAt is not a string";
  if (!isRecord(data.race)) return "race is not an object";
  if (typeof data.race.name !== "string") return "race.name is not a string";
  if (typeof data.race.date !== "string" || !ISO_DATE.test(data.race.date)) {
    return "race.date is not yyyy-mm-dd";
  }
  if (!Array.isArray(data.weeks)) return "weeks is not an array";
  if (!isRecord(data.badges)) return "badges is not an object";
  if (!Array.isArray(data.rows)) return "rows is not an array";

  for (const [i, r] of data.rows.entries()) {
    const at = `rows[${i}]`;
    if (!isRecord(r)) return `${at} is not an object`;
    if (typeof r.date !== "string" || !ISO_DATE.test(r.date)) return `${at}.date is not yyyy-mm-dd`;
    for (const k of ["type", "slug", "category"]) {
      if (typeof r[k] !== "string") return `${at}.${k} is not a string`;
    }
    for (const k of ["week", "done", "distanceMi", "durationMin", "rpe"]) {
      if (!isNullableNumber(r[k])) return `${at}.${k} is not a number or null`;
    }
    for (const k of ["phase", "day", "prescribed", "notes", "takeaway"]) {
      if (!isNullableString(r[k])) return `${at}.${k} is not a string or null`;
    }
  }
  return null;
}

function validate(data: unknown, source: string): WorkoutDb | null {
  const problem = findWorkoutDbProblem(data);
  if (problem) {
    console.error(`[workouts] Invalid db from ${source}: ${problem}`);
    return null;
  }
  return data as WorkoutDb;
}

export async function getWorkoutDb(): Promise<WorkoutDb | null> {
  const local = process.env.WORKOUTS_DB_LOCAL;
  if (local) {
    try {
      return validate(JSON.parse(await readFile(local, "utf8")), local);
    } catch (err) {
      console.error(`[workouts] Failed to read ${local}:`, err);
      return null;
    }
  }

  // No token means the first sync hasn't been set up yet; not an error.
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const meta = await head("workouts/db.json");
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`[workouts] Fetching db.json from Blob returned HTTP ${res.status}`);
      return null;
    }
    return validate(await res.json(), "Blob workouts/db.json");
  } catch (err) {
    console.error("[workouts] Failed to load db.json from Blob:", err);
    return null;
  }
}
