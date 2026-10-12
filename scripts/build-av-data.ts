/**
 * Build the static AV-safety dataset from NHTSA's Standing General Order
 * 2021-01 ADS incident reports (the ADS file, not the ADAS/L2 file).
 *
 * Usage (npm script name: `sync:av-safety`):
 *   npm run sync:av-safety -- [csv-path-or-url] [--dry-run]
 *
 * Writes compact JSON to src/data/av-safety.json, which is committed and
 * imported by /av-safety at build time. No API keys needed.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AvSafetyData } from "../src/lib/av-safety/types";

const DEFAULT_SOURCE =
  "https://static.nhtsa.gov/odi/ffdd/sgo-2021-01/SGO-2021-01_Incident_Reports_ADS.csv";
const OUT_PATH = path.join(process.cwd(), "src", "data", "av-safety.json");

const DRY_RUN = process.argv.includes("--dry-run");
const source = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? DEFAULT_SOURCE;

// ---------- CSV ----------

/** Minimal RFC 4180 parser (quoted fields may contain commas, quotes, newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

const normHeader = (h: string) => h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, " ");

/** Loose header match by name: exact, then prefix, then substring. */
function findColumns<K extends string>(header: string[], wanted: Record<K, string>): Record<K, number> {
  const hs = header.map(normHeader);
  const cols = {} as Record<K, number>;
  const missing: string[] = [];
  for (const [key, name] of Object.entries(wanted) as [K, string][]) {
    const w = name.toLowerCase();
    let idx = hs.indexOf(w);
    if (idx < 0) idx = hs.findIndex((h) => h.startsWith(w));
    if (idx < 0) idx = hs.findIndex((h) => h.includes(w));
    if (idx < 0) missing.push(name);
    else cols[key] = idx;
  }
  if (missing.length)
    throw new Error(
      `SGO CSV is missing expected columns: ${missing.join(", ")}. ` +
        `NHTSA may have renamed them; update the header names in build-av-data.ts.`
    );
  return cols;
}

// ---------- cleaning ----------

const EMPTY = new Set([
  "", "—", "-", "–", "null", "n/a", "na", "none", "unknown", "unk",
  "[redacted]", "redacted", "[redacted, may contain confidential business information]",
  "[may contain confidential business information]", "cbi",
]);

function clean(s: string | undefined): string | null {
  if (s == null) return null;
  const t = s.trim().replace(/\s+/g, " ");
  if (EMPTY.has(t.toLowerCase())) return null;
  if (/^\[.*redact.*\]$/i.test(t)) return null;
  return t;
}

const ENTITY_RULES: [RegExp, string][] = [
  [/waymo/i, "Waymo"],
  [/cruise/i, "Cruise"],
  [/zoox/i, "Zoox"],
  [/tesla/i, "Tesla"],
  [/avride/i, "Avride"],
  [/may mobility/i, "May Mobility"],
  [/motional/i, "Motional"],
  [/aurora/i, "Aurora"],
  [/nuro/i, "Nuro"],
  [/beep/i, "Beep"],
  [/stack av/i, "Stack AV"],
  [/hyundai/i, "Hyundai"],
  [/moia/i, "MOIA"],
  [/gatik/i, "Gatik"],
  [/plus ?ai/i, "PlusAI"],
  [/weride/i, "WeRide"],
  [/ohmio/i, "Ohmio"],
  [/oxbotica/i, "Oxbotica"],
  [/pony/i, "Pony.ai"],
  [/kodiak/i, "Kodiak"],
  [/argo/i, "Argo AI"],
  [/transdev/i, "Transdev"],
  [/apple/i, "Apple"],
  [/toyota/i, "Toyota"],
  [/mercedes/i, "Mercedes-Benz"],
];

function canonicalEntity(s: string | null): string | null {
  const t = clean(s ?? undefined);
  if (!t) return null;
  for (const [re, name] of ENTITY_RULES) if (re.test(t)) return name;
  return t.replace(/,?\s+(inc\.?|llc|corp\.?|corporation|co\.?|ltd\.?)$/i, "").trim();
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const isoMonth = (y: number, m: number) =>
  y >= 2000 && y <= 2100 && m >= 1 && m <= 12 ? `${y}-${String(m).padStart(2, "0")}` : null;

/** Bucket dates like "JUL-2026", "July 2026", "2026-07-14", "07/14/2026" to "2026-07". */
function parseMonth(s: string | null): string | null {
  const t = clean(s ?? undefined);
  if (!t) return null;
  let m = t.match(/^(\d{4})-(\d{1,2})/);
  if (m) return isoMonth(+m[1], +m[2]);
  m = t.match(/^(\d{1,2})\/(?:\d{1,2}\/)?(\d{4})/);
  if (m) return isoMonth(+m[2], +m[1]);
  m = t.match(/^([A-Za-z]{3,})[\s.\-/]*(?:\d{1,2},?\s*)?(\d{4})$/);
  if (m) {
    const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
    return mon ? isoMonth(+m[2], mon) : null;
  }
  return null;
}

const SEVERITIES = ["Fatality", "Serious", "Moderate", "Minor", "No injury", "Unknown"] as const;

function normalizeSeverity(s: string | null): (typeof SEVERITIES)[number] {
  const t = clean(s ?? undefined)?.toLowerCase();
  if (!t) return "Unknown";
  if (t.includes("fatal")) return "Fatality";
  if (t.includes("serious")) return "Serious";
  if (t.includes("moderate")) return "Moderate";
  if (t.includes("minor")) return "Minor";
  if (t.includes("no injur") || t.includes("property damage")) return "No injury";
  return "Unknown";
}

function normalizeCrashWith(s: string | null): string {
  const t = clean(s ?? undefined)?.toLowerCase();
  if (!t) return "Unknown";
  if (t.includes("pedestrian")) return "Pedestrian";
  if (t.includes("cyclist") || t.includes("bicycl")) return "Cyclist";
  if (t.includes("non-motorist")) return "Other non-motorist";
  if (t.includes("motorcycle")) return "Motorcycle";
  if (t.includes("first responder")) return "First responder";
  if (t.includes("heavy truck") || t.includes("bus")) return "Heavy truck / bus";
  if (/passenger car|suv|van|pickup/.test(t)) return "Passenger vehicle";
  if (t.includes("fixed object") || t.includes("pole") || t.includes("tree")) return "Fixed object";
  if (t.includes("animal")) return "Animal";
  return "Other";
}

// ---------- aggregate ----------

function countBy<T>(items: T[], key: (t: T) => string | null): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (k != null) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

const sortedDesc = (m: Map<string, number>) => [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

function monthRange(first: string, last: string): string[] {
  const out: string[] = [];
  let [y, m] = first.split("-").map(Number);
  for (let s = first; s <= last; s = isoMonth(y, m)!) {
    out.push(s);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

type Report = {
  id: string;
  version: number;
  entity: string | null;
  month: string | null;
  severity: string;
  crashWith: string;
  state: string | null;
};

async function loadCsv(src: string): Promise<string> {
  if (!/^https?:\/\//.test(src)) return readFile(src, "utf8");
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to download ${src}: ${res.status} ${res.statusText}`);
  return res.text();
}

async function main() {
  console.log(`Reading ${source}`);
  const [header, ...body] = parseCsv(await loadCsv(source));
  if (!header) throw new Error("SGO CSV is empty");
  const c = findColumns(header, {
    id: "report id",
    version: "report version",
    entity: "reporting entity",
    incidentDate: "incident date",
    crashWith: "crash with",
    severity: "highest injury severity alleged",
    state: "state",
  });

  const latest = new Map<string, Report>();
  for (const r of body) {
    const id = clean(r[c.id]);
    if (!id) continue;
    const version = Number(clean(r[c.version]) ?? 1) || 1;
    const prev = latest.get(id);
    if (prev && prev.version >= version) continue;
    const state = clean(r[c.state])?.toUpperCase() ?? null;
    latest.set(id, {
      id,
      version,
      entity: canonicalEntity(r[c.entity]),
      month: parseMonth(r[c.incidentDate]),
      severity: normalizeSeverity(r[c.severity]),
      crashWith: normalizeCrashWith(r[c.crashWith]),
      state: state && /^[A-Z]{2}$/.test(state) ? state : null,
    });
  }

  const reports = [...latest.values()].filter((r) => r.month != null);
  const dropped = latest.size - reports.length;
  if (!reports.length) throw new Error("No reports with a parseable incident date");

  const byMonth = countBy(reports, (r) => r.month);
  const months = [...byMonth.keys()].sort();
  const severity = countBy(reports, (r) => r.severity);

  const data: AvSafetyData = {
    updatedAt: new Date().toISOString(),
    source,
    totalReports: reports.length,
    reportsByMonth: monthRange(months[0], months[months.length - 1]).map((month) => ({
      month,
      count: byMonth.get(month) ?? 0,
    })),
    reportsByEntity: sortedDesc(countBy(reports, (r) => r.entity ?? "Unknown")).map(
      ([entity, count]) => ({ entity, count })
    ),
    injurySeverity: SEVERITIES.filter((s) => severity.has(s)).map((s) => ({
      severity: s,
      count: severity.get(s)!,
    })),
    crashWith: sortedDesc(countBy(reports, (r) => r.crashWith)).map(([counterparty, count]) => ({
      counterparty,
      count,
    })),
    reportsByState: sortedDesc(countBy(reports, (r) => r.state)).map(([state, count]) => ({
      state,
      count,
    })),
  };

  console.log(
    `${body.length} rows → ${latest.size} unique reports → ${reports.length} with a date (${dropped} dropped)`
  );

  if (DRY_RUN) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(data) + "\n");
  console.log(`Wrote ${path.relative(process.cwd(), OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
