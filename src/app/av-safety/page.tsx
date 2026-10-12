import Link from "next/link";
import type { ReactNode } from "react";
import { getAvSafetyData } from "@/lib/av-safety/data";
import { SITE_TIME_ZONE } from "@/lib/workouts/date";
import CrashWith from "./charts/crash-with";
import InjurySeverity from "./charts/injury-severity";
import ReportsByEntity from "./charts/reports-by-entity";
import ReportsOverTime from "./charts/reports-over-time";

export const metadata = { title: "AV Safety — Rajat Thaker" };

function formatMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-2xl font-bold text-orange-400">{value}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  );
}

function ChartCard({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      {note && <p className="mt-0.5 text-xs text-zinc-500">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function AvSafetyPage() {
  const data = getAvSafetyData();
  const months = data.reportsByMonth;
  const dateRange = months.length
    ? `${formatMonth(months[0].month)} – ${formatMonth(months[months.length - 1].month)}`
    : "—";
  const updated = new Date(data.updatedAt).toLocaleDateString("en-US", {
    timeZone: SITE_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back home
        </Link>
        <section className="mt-4 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
          <p className="text-xs uppercase tracking-widest text-orange-500">
            NHTSA Standing General Order 2021-01
          </p>
          <h1 className="mt-1 text-4xl font-black text-zinc-50 sm:text-5xl">
            Automated driving <span className="text-orange-500">crash reports</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-400">
            Counts are of de-duplicated SGO incident reports (latest version per Report ID) for
            ADS-equipped vehicles, not necessarily unique physical crashes. Reports are
            self-submitted by companies and do not imply fault.
          </p>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Total reports" value={data.totalReports.toLocaleString("en-US")} />
          <StatTile label="Reporting entities" value={String(data.reportsByEntity.length)} />
          <StatTile label="Date range" value={dateRange} />
          <StatTile label="Last updated" value={updated} />
        </section>

        <div className="mt-6 grid gap-4">
          <ChartCard
            title="Reports over time"
            note="By incident month. The most recent months are incomplete due to reporting lag."
          >
            <ReportsOverTime data={months} />
          </ChartCard>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Reports by entity" note="Top 10 reporting companies; the rest grouped as Other.">
              <ReportsByEntity data={data.reportsByEntity} />
            </ChartCard>
            <ChartCard title="Crash with" note="What the ADS vehicle collided with.">
              <CrashWith data={data.crashWith} />
            </ChartCard>
          </div>
          <ChartCard title="Highest injury severity alleged">
            <InjurySeverity data={data.injurySeverity} />
          </ChartCard>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Source:{" "}
          <a href={data.source} className="underline hover:text-zinc-300">
            NHTSA SGO ADS incident reports (CSV)
          </a>
        </p>
      </main>
    </div>
  );
}
