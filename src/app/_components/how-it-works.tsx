export default function HowItWorks() {
  return (
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
  );
}
