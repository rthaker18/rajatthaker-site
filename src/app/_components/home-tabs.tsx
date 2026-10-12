"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Most recently built first. */
const PROJECTS = [
  { href: "/av-safety", label: "AV Safety" },
  { href: "/workouts", label: "Workouts" },
];

function ProjectsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="projects-menu"
        className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
          open ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Projects
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <ul
          id="projects-menu"
          className="absolute left-0 z-10 mt-2 min-w-40 rounded-2xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/70"
        >
          {PROJECTS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
        <ProjectsMenu />
      </div>

      {active?.content}
    </section>
  );
}
