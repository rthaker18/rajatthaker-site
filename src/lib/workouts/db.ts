import { head } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import type { WorkoutDb } from "./types";

export async function getWorkoutDb(): Promise<WorkoutDb | null> {
  const local = process.env.WORKOUTS_DB_LOCAL;
  if (local) {
    try {
      return JSON.parse(await readFile(local, "utf8")) as WorkoutDb;
    } catch {
      return null;
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const meta = await head("workouts/db.json");
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as WorkoutDb;
  } catch {
    return null;
  }
}
