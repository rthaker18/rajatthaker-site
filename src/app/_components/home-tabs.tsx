"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export default function HomeTabs({
  panels,
}: {
  panels: { label: string; content: ReactNode }[];
}) {
  const [activeTab, setActiveTab] = useState(panels[0]?.label);
  const active = panels.find((p) => p.label === activeTab) ?? panels[0];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="flex flex-wrap items-center gap-2">
        {panels.map(({ label }) => {
          const isActive = label === active?.label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
        <Link
          href="/workouts"
          className="rounded-full px-4 py-2 text-sm font-semibold transition bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          Workouts
        </Link>
      </div>

      {active?.content}
    </section>
  );
}
