"use client";

import { useState } from "react";

const tabs = ["Home", "Resume", "How it Works"] as const;

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
          ) : activeTab === "Resume" ? (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-left">
              <h2 className="text-xl font-semibold text-slate-900">Resume</h2>
              <p className="mt-2 text-xs text-slate-500">
                Last updated: February 11, 2026
              </p>
              <div className="mt-4 space-y-6 text-sm text-slate-700">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    RAJAT THAKER
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    thaker.rajat@gmail.com • +1 (650) 889-0464 •
                    github.com/rthaker18 • US Citizen
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Work Experience
                  </p>
                  <div className="mt-3 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          Senior Software Engineer, Gemini for Home
                        </p>
                        <p className="text-xs text-slate-500">
                          January 2023 — Present
                        </p>
                      </div>
                      <p className="text-sm text-slate-600">
                        Google • Mountain View, CA
                      </p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                        <li>
                          Architected and deployed AutoRCA, a RAG-based root
                          cause analysis agent serving 15+ engineering teams,
                          processing 25,000+ user feedback reports and 25,000+
                          bugs, reducing manual triage and root-cause analysis
                          (RCA) time by 60+ engineer-hours/week.
                        </li>
                        <li>
                          Designed end-to-end batch processing ML pipeline
                          using Apache Beam (Dataflow) and Gemini API to
                          pre-compute RCA predictions for 25,000+ monthly
                          reports, achieving 90% precision/recall on cached
                          results.
                        </li>
                        <li>
                          Led cross-functional ML product development for
                          LLM-based bug triage agent, validated through
                          bespoke evaluation framework (2,400+ human-labeled
                          examples), improving the existing triage flow by 15%
                          over the keyword+rule-based baseline model to 93.4%
                          triage accuracy.
                        </li>
                        <li>
                          Built production MCP (Model Context Protocol)
                          service enabling 5+ teams to integrate LLM-based
                          tooling via RPC for gemini-cli and other agents,
                          creating a more interactive developer experience for
                          AutoRCA and increasing monitoring, reliability, and
                          observability of the product through GCP logging and
                          monitoring tools.
                        </li>
                        <li>
                          Diagnosed and fixed critical feedback pipeline data
                          loss by implementing automated user identity
                          mapping, recovering 5.5% of missing reports
                          (3,000+/month) and improving debuggability for
                          10,000+
                          internal test reports.
                        </li>
                        <li>
                          Presented at BAGEL 2025 (Google/DeepMind AI
                          Conference) on resilient AI agent design and scaling
                          LLM-based triage systems to 500+ engineers.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          Software Engineer, Android Auto &amp; Embedded Systems
                        </p>
                        <p className="text-xs text-slate-500">
                          March 2022 — January 2023
                        </p>
                      </div>
                      <p className="text-sm text-slate-600">
                        Google • Mountain View, CA
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        Built fleet management infrastructure for Android Auto
                        policy enforcement across distributed systems for 3
                        major car rental agencies managing 50,000+ connected
                        vehicles.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Projects
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        SWE-Bench Code Repair with DPO
                      </p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                        <li>
                          Implemented supervised fine-tuning + Direct Preference
                          Optimization pipeline for code generation, fine-tuning
                          Qwen 2.5 Coder on 700+ SWE-Bench Pro examples from
                          Scale AI&apos;s public dataset.
                        </li>
                        <li>
                          Identified and debugged structured output format
                          issues in model generation.
                        </li>
                        <li>
                          Tech: PyTorch, Transformers, PEFT/LoRA, TRL, Hugging
                          Face.
                        </li>
                        <li>
                          Links: github.com/rthaker18/swe_bench_sft_dpo |
                          huggingface.co/rahjeetee/swe-patch-sft
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Technical Skills
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>
                      Languages: Python, C++, Java, SQL, Go
                    </li>
                    <li>
                      ML/AI: PyTorch, Vertex AI, Transformers (Hugging Face),
                      RAG Engine, Prompt Engineering, PEFT/LoRA, TRL
                    </li>
                    <li>
                      Infrastructure: Apache Beam, Protocol Buffers, gRPC, Git,
                      Cloud Spanner, BigQuery, Kubernetes
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Awards and Leadership Experience
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>
                      Speaker, Health &amp; Home AI Summit (2024) —
                      &quot;Building AI-Enabled Developer Tools at Scale&quot; (500+
                      attendees)
                    </li>
                    <li>
                      Speaker, BAGEL 2025 (Google/DeepMind AI Conference) —
                      &quot;Resilient AI Agents for Production Triage Systems&quot;
                      (300+ attendees)
                    </li>
                    <li>
                      Nominee, Google SWEETY Awards (Software Engineering
                      Excellence)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Education
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        University of Illinois at Urbana-Champaign
                      </p>
                      <p className="text-xs text-slate-500">
                        December 2021
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      B.S., Computer Engineering
                    </p>
                    <p className="text-sm text-slate-600">
                      James Scholar, Dean&apos;s List 2019 Recipient
                    </p>
                    <p className="text-sm text-slate-600">
                      Relevant Coursework: Computer Architecture (ECE 411),
                      Artificial Intelligence (CS 440), Parallel Programming
                      (ECE 408)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="mt-6 space-y-6 text-left text-base text-slate-700">
              <div className="space-y-4">
                <p>
                  I use Codex to pull requests from GitHub issues, apply the
                  smallest safe change, and run checks before sharing updates.
                  That keeps this site current without a big manual workflow.
                </p>
                <p>
                  The workflow is simple: I open an issue describing the
                  update, Codex prepares a PR, and I approve it. That means I
                  can keep this site up to date just by filing issues and
                  reviewing PRs, even from my phone.
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
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Ephemeral websites
                </h3>
                <p>
                  LLMs make it possible to generate dynamic content at a level
                  we have never seen before, where a website could
                  theoretically never exist until the moment a user interacts
                  with it. The way this site works is a stepping stone toward
                  that future: it lets me dynamically update and interact with
                  the content without directly touching the code.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Contact Me
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Send a quick note
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This form opens your email client with the details filled in so
              you can send me a message.
            </p>
          </div>
          <form
            className="mt-6 grid gap-4"
            action="mailto:thaker.rajat@gmail.com"
            method="post"
            encType="text/plain"
          >
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Your name
              <input
                name="Name"
                type="text"
                required
                className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Jane Doe"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Contact info
              <input
                name="Contact"
                type="text"
                required
                className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Email or phone number"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Message
              <textarea
                name="Message"
                required
                rows={5}
                className="resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-200/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="What would you like to share?"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
            >
              Send email
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
