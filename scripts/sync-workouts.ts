/**
 * Sync the Spartan/HYROX workout spreadsheet to "the dB" (Vercel Blob).
 *
 * Usage:
 *   npm run sync:workouts -- <path-to.xlsx> [--dry-run]
 *
 * Env:
 *   BLOB_READ_WRITE_TOKEN  - required unless --dry-run
 *   OPENAI_API_KEY         - required unless --dry-run (badge generation)
 */
import ExcelJS from "exceljs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorkoutDb, WorkoutRow, WeekTarget } from "../src/lib/workouts/types";
import { todayIso } from "../src/lib/workouts/date";

const YEAR = 2026;
const DRY_RUN = process.argv.includes("--dry-run");
const xlsxPath = process.argv
  .slice(2)
  .find((a) => !a.startsWith("--"));

if (!xlsxPath) {
  console.error("usage: npm run sync:workouts -- <file.xlsx> [--dry-run]");
  process.exit(1);
}

// ---------- cell helpers ----------

function cellText(v: ExcelJS.CellValue): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") {
    const o = v as unknown as Record<string, unknown>;
    if (o.richText)
      return (o.richText as { text: string }[]).map((t) => t.text).join("");
    if (o.text) return String(o.text);
    if (o.result != null) return cellText(o.result as ExcelJS.CellValue);
    if (o.error) return null;
    return String(v);
  }
  return String(v);
}

const EMPTY = new Set(["", "—", "-", "–", "null", "n/a", "N/A"]);

function clean(s: string | null): string | null {
  if (s == null) return null;
  const t = s.trim();
  return EMPTY.has(t) ? null : t;
}

function num(s: string | null): number | null {
  const t = clean(s);
  if (t == null) return null;
  const m = t.replace(/[~≈]/g, "").replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function parseDone(s: string | null): number | null {
  const t = clean(s);
  if (t == null) return null;
  if (t.includes("✓") || /y(es)?/i.test(t)) return 1;
  if (t.includes("½") || t.includes("half")) return 0.5;
  if (t.includes("✗") || /^x/i.test(t) || /no/i.test(t)) return 0;
  return null;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseDate(s: string | null): string | null {
  const t = clean(s);
  if (t == null) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = t.match(/([A-Za-z]+)\.?\s+(\d{1,2})/);
  if (!m) return null;
  const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
  if (!mon) return null;
  return `${YEAR}-${String(mon).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

/** Strip parentheticals like "(swapped)" but keep "(Primary)"/"(Volume)";
 *  also drop trailing "— swapped …" qualifiers and collapse REST variants. */
function baseType(type: string): string {
  return type
    .replace(/\(([^)]*)\)/g, (_, inner: string) =>
      /^(primary|volume)$/i.test(inner.trim()) ? ` (${inner.trim()})` : " "
    )
    .replace(/\s+[—–-]\s*swapped.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ordered keyword rules → badge category. First match wins. */
function categorize(type: string): string {
  const t = type.toLowerCase();
  const has = (...ks: string[]) => ks.some((k) => t.includes(k));
  if (
    has("spartan beast", "hyrox dallas", "race day") ||
    (/\brace\b/.test(t) && !t.includes("eve"))
  )
    return "race";
  if (has("hyrox", "sled", "ski erg", "compromised", "ocr")) return "hyrox";
  if (has("boulder", "climb")) return "climbing";
  if (has("hike")) return "hike";
  if (has("bike")) return "bike";
  if (has("rest", "travel", "moving day")) return "rest";
  if (has("recovery", "mobility", "stretch", "yoga")) return "recovery";
  if (has("strength", "push-up", "circuit", "carries", "pt ", "pt-", "weakness", "chest"))
    return "strength";
  if (has("run", "jog", "fartlek", "interval", "tempo", "marathon", "shakeout", "5k", "sharpener"))
    return "run";
  if (has("walk")) return "walk";
  return "training";
}

function slugify(type: string): string {
  const base = baseType(type)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
  if (/^rest\b/i.test(base)) return "rest";
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "misc";
}

// ---------- sheet parsing ----------

type ColMap = Record<string, number>;

function findHeader(ws: ExcelJS.Worksheet, required: string[]): { headerRow: number; cols: ColMap } {
  let headerRow = 0;
  const cols: ColMap = {};
  for (let r = 1; r <= Math.min(ws.rowCount, 15); r++) {
    const row = ws.getRow(r);
    const found: ColMap = {};
    row.eachCell({ includeEmpty: false }, (cell, cn) => {
      const t = cellText(cell.value)?.toLowerCase();
      if (t) found[t] = cn;
    });
    const match = (want: string) =>
      Object.keys(found).find((h) => h.includes(want));
    if (required.every((req) => match(req))) {
      headerRow = r;
      for (const req of required) cols[req] = found[match(req)!];
      // also capture all headers for optional columns
      cols.__all = -1;
      (cols as unknown as { all: Record<string, number> }).all = found as unknown as Record<string, number>;
      break;
    }
  }
  if (!headerRow)
    throw new Error(`Could not find header row with ${required.join(", ")} in sheet "${ws.name}"`);
  return { headerRow, cols };
}

function col(row: ExcelJS.Row, all: Record<string, number>, ...keys: string[]): string | null {
  for (const k of keys) {
    const cn = Object.entries(all).find(([h]) => h.includes(k))?.[1];
    if (cn != null) {
      const v = cellText(row.getCell(cn).value);
      if (v != null) return v;
    }
  }
  return null;
}

function parseWorkoutLog(ws: ExcelJS.Worksheet): WorkoutRow[] {
  const { headerRow, cols } = findHeader(ws, ["workout type", "date"]);
  const all = (cols as unknown as { all: Record<string, number> }).all;
  const rows: WorkoutRow[] = [];
  ws.eachRow({ includeEmpty: false }, (row, rn) => {
    if (rn <= headerRow) return;
    const type = clean(col(row, all, "workout type"));
    const date = parseDate(col(row, all, "date"));
    if (!type || !date) return;
    rows.push({
      week: num(col(row, all, "week")),
      phase: clean(col(row, all, "phase")),
      date,
      day: clean(col(row, all, "day")),
      type,
      slug: slugify(type),
      category: categorize(type),
      prescribed: clean(col(row, all, "prescribed")),
      done: parseDone(col(row, all, "done")),
      notes: clean(col(row, all, "actual notes", "what i did")),
      distanceMi: num(col(row, all, "distance")),
      durationMin: num(col(row, all, "duration")),
      rpe: num(col(row, all, "rpe")),
      takeaway: clean(col(row, all, "takeaway", "how i felt")),
    });
  });
  return rows;
}

function parseWeeklySummary(ws: ExcelJS.Worksheet): WeekTarget[] {
  const { headerRow, cols } = findHeader(ws, ["week", "phase"]);
  const all = (cols as unknown as { all: Record<string, number> }).all;
  const weeks: WeekTarget[] = [];
  ws.eachRow({ includeEmpty: false }, (row, rn) => {
    if (rn <= headerRow) return;
    const week = num(col(row, all, "week"));
    if (week == null) return;
    weeks.push({
      week,
      phase: clean(col(row, all, "phase")),
      dates: clean(col(row, all, "dates")),
      notes: clean(col(row, all, "notes")),
    });
  });
  return weeks;
}

function parseRace(ws: ExcelJS.Worksheet): { name: string; date: string } {
  const { headerRow, cols } = findHeader(ws, ["date", "weight"]);
  const all = (cols as unknown as { all: Record<string, number> }).all;
  let race: { name: string; date: string } | null = null;
  ws.eachRow({ includeEmpty: false }, (row, rn) => {
    if (rn <= headerRow || race) return;
    const notes = clean(col(row, all, "notes")) ?? "";
    if (/race day/i.test(notes)) {
      const date = parseDate(col(row, all, "date"));
      const name = notes.replace(/[^\w\s-]/g, "").replace(/race day/i, "").trim() || "Race";
      if (date) race = { name, date };
    }
  });
  if (!race) throw new Error('No "race day" row found in Progress Tracker');
  return race;
}

// ---------- blob + image generation ----------

async function uploadBadges(categories: string[]) {
  const { put, list } = await import("@vercel/blob");
  const OpenAI = (await import("openai")).default;

  const existing = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "images/", cursor });
    for (const b of page.blobs) {
      const m = b.pathname.match(/^images\/(.+)\.png$/);
      if (m) existing.add(m[1]);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const badges: Record<string, string> = {};
  const missing: string[] = [];
  for (const cat of categories) {
    if (existing.has(cat)) {
      badges[cat] = `images/${cat}.png`; // resolved to full URL below
    } else missing.push(cat);
  }

  if (missing.length > 0) {
    if (!process.env.OPENAI_API_KEY)
      throw new Error(`OPENAI_API_KEY required to generate ${missing.length} missing badges`);
    const openai = new OpenAI();
    for (const cat of missing) {
      console.log(`generating badge: ${cat}`);
      const img = await openai.images.generate({
        model: "gpt-image-1",
        size: "1024x1024",
        prompt: `Flat vector sticker badge, bold shapes, high contrast, energetic Spartan race / HYROX fitness aesthetic, dark background with red and orange accents, no text, representing the workout category: "${cat}".`,
      });
      const b64 = img.data?.[0]?.b64_json;
      if (!b64) throw new Error(`no image returned for ${cat}`);
      const blob = await put(`images/${cat}.png`, Buffer.from(b64, "base64"), {
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "image/png",
      });
      badges[cat] = blob.url;
    }
  }

  // Resolve cached image URLs to full URLs
  const stillPartial = Object.entries(badges).filter(([, u]) => !u.startsWith("http"));
  if (stillPartial.length > 0) {
    let cursor2: string | undefined;
    const urls = new Map<string, string>();
    do {
      const page = await list({ prefix: "images/", cursor: cursor2 });
      for (const b of page.blobs) urls.set(b.pathname, b.url);
      cursor2 = page.hasMore ? page.cursor : undefined;
    } while (cursor2);
    for (const [slug, u] of stillPartial) {
      const full = urls.get(u);
      if (full) badges[slug] = full;
    }
  }
  return badges;
}

// ---------- main ----------

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.resolve(xlsxPath!));

  const logWs = wb.getWorksheet("Workout Log");
  const trackerWs = wb.getWorksheet("Progress Tracker");
  const summaryWs = wb.getWorksheet("Weekly Summary");
  if (!logWs || !trackerWs || !summaryWs)
    throw new Error(
      `Missing sheet(s). Found: ${wb.worksheets.map((w) => w.name).join(", ")}`
    );

  const parsed = parseWorkoutLog(logWs);
  const today = todayIso();
  const rows = parsed.filter((r) => r.date <= today);
  const dropped = parsed.length - rows.length;
  if (dropped > 0)
    console.error(`dropped ${dropped} future-dated rows (after ${today})`);
  const weeks = parseWeeklySummary(summaryWs);
  const race = parseRace(trackerWs);

  const catCounts = new Map<string, number>();
  for (const r of rows) catCounts.set(r.category, (catCounts.get(r.category) ?? 0) + 1);
  const categories = [...catCounts.keys()].sort();
  console.error("categories: " + categories.map((c) => `${c}=${catCounts.get(c)}`).join(", "));
  const fallback = rows.filter((r) => r.category === "training");
  if (fallback.length)
    console.error(
      `"training" fallback rows: ${[...new Set(fallback.map((r) => r.type))].join(" | ")}`
    );

  console.error(
    `parsed ${rows.length} rows, ${weeks.length} weeks, ${categories.length} badge categories, race: ${race.name} ${race.date}`
  );

  const db: WorkoutDb = {
    updatedAt: new Date().toISOString(),
    race,
    rows,
    weeks,
    badges: {},
  };

  if (DRY_RUN) {
    const json = JSON.stringify(db, null, 2);
    console.log(json);
    await writeFile("/tmp/workouts-db.json", json);
    console.error(
      "dry-run: wrote /tmp/workouts-db.json (no blob writes, no image generation)"
    );
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN)
    throw new Error("BLOB_READ_WRITE_TOKEN required (or use --dry-run)");

  db.badges = await uploadBadges(categories);

  const { put } = await import("@vercel/blob");
  const res = await put("workouts/db.json", JSON.stringify(db), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
  console.log(`uploaded ${res.url}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
