# AGENTS.md - rajatthaker-site

Personal website. Next.js 16 (App Router) + React 19 + TypeScript, styled with Tailwind CSS v4, React Compiler enabled (`next.config.ts`). Deployed on Vercel via GitHub Actions. Node 20 (matches CI).

## Layout
- `src/app/` - routes and pages (App Router). One folder per route: `/` (`page.tsx`) and `/workouts` (`workouts/`).
- `src/lib/workouts/` - workouts data access (`db.ts`), shared types (`types.ts`), date helpers (`date.ts`).
- `public/` - static assets.
- `scripts/` - local-only scripts run with `tsx` (e.g. `sync-workouts.ts`); never shipped to the client.
- `.github/workflows/` - CI (`ci.yml`), Vercel deploys (`deploy-staging.yml` on push to `main`, `deploy-prod.yml` manual), and Codex issue automation (`codex-*.yml`).

## Commands
- Install: `npm ci`
- Dev: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Build: `npm run build`
- Sync workouts: `npm run sync:workouts -- <xlsx> [--dry-run]`
- There is no test script yet; CI runs `npm test --if-present`, lint, and build.

## Conventions
- Prefer Server Components; add `"use client"` only for interactivity (charts, toggles, filters like `workouts/workout-grid.tsx`).
- Keep pages statically renderable where possible. `/workouts` is the exception: it is `force-dynamic` and reads the dB server-side. No runtime calls to third-party APIs from the client and no client-side API keys.
- Match the existing styling approach: Tailwind utility classes in `src/app/`. Don't add a UI or component library without asking.
- Keep chart/interactive code in its own client component; pass data in as props.
- Type everything. Avoid `any`.

## Working rules
- Small PRs. One feature or fix per PR.
- Before opening a PR, use the `test-before-pr` skill (lint, typecheck, build, screenshots at 1280px and 375px for UI changes).
- Don't modify `.github/workflows/` or `next.config.ts` unless the task requires it, and call it out in the PR.
- Ask before adding new dependencies; say why the existing ones aren't enough.

## Workouts data (logging a workout)
The source of truth for training data is the spreadsheet `spartan_hyrox_workout_log_v3.xlsx` (in ~/Downloads). To log a workout:

1. Edit the **Workout Log** sheet - add/fill the row for that day (done ✓ or ½, actual notes, distance, duration, weight, macros, RPE, takeaway).
2. Run the sync to push data + badge images to Vercel Blob ("the dB"):

   ```
   npm run sync:workouts -- ~/Downloads/spartan_hyrox_workout_log_v3.xlsx
   ```

   The site picks up changes on the next page load - no redeploy needed. Add `--dry-run` to print the parsed JSON (and write it to `/tmp/workouts-db.json`) without touching Blob or OpenAI.

Conventions:
- Badge images are generated **once per workout category** (`images/<category>.png` in Blob - ~11 categories like run, climbing, rest); re-syncs skip existing images, so they cost nothing.
- The sync script parses sheets by header name (loose match), not column letter - keep header names recognizable when editing the spreadsheet.
- Dates in the sheet have no year ("Apr 20"); the script assumes year 2026.

## Required env (.env.local, gitignored - see .env.example)
- `BLOB_READ_WRITE_TOKEN` - write access for the dB (sync + server reads). Without it (and without `WORKOUTS_DB_LOCAL`), `/workouts` renders with no data; build still passes.
- `OPENAI_API_KEY` - generates a badge image per new workout type. Only used by the local sync script; never deployed.
- `WORKOUTS_DB_LOCAL` - optional path to a local db.json for dev preview (e.g. `/tmp/workouts-db.json` after a `--dry-run`).
