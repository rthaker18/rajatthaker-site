export default function Resume() {
  return (
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
  );
}
