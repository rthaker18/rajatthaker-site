"use client";

import { useState } from "react";

const tabs = ["Home", "How it Works"] as const;

export default function Home() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Home");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#ffffff_55%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-xl shadow-blue-100/60 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Rajat Thaker
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Welcome to Rajat Thaker&apos;s website!
          </h1>
          <p className="mt-4 text-base text-slate-600">
            A quick home base for updates, links, and how this site stays
            fresh.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {activeTab === "Home" ? (
            <div className="mt-6 space-y-4 text-left text-base text-slate-700">
              <p>
                Thanks for stopping by. I&apos;m Rajat, and this page is a
                lightweight spot to share what I&apos;m working on.
              </p>
              <a
                href="https://linkedin.com/in/rthaker2"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </div>
          ) : (
            <div className="mt-6 space-y-4 text-left text-base text-slate-700">
              <p>
                I use Codex to pull requests from GitHub issues, apply the
                smallest safe change, and run checks before sharing updates.
                That keeps this site current without a big manual workflow.
              </p>
              <p>
                You can explore the full history and open issues in the
                repository:
              </p>
              <a
                href="https://github.com/rthaker18/rajatthaker-site"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:text-slate-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                View the GitHub repo
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
