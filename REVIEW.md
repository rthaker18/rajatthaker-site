# Review Guidelines

## Critical areas
- `scripts/` data pipeline: check dedupe logic, date parsing, and that bad rows are logged rather than silently dropped.
- Anything that could ship a secret or API key to the client bundle.

## Conventions to enforce
- No `any` types.
- `"use client"` only where needed; flag Server Components that were made client components without reason.
- Pages must stay statically renderable; flag runtime fetches to external APIs.
- No new dependencies without a stated reason in the PR description.

## Performance
- Flag large JSON imported into client components (should be pre-aggregated in the pipeline).
- Flag unnecessary re-renders in chart components.

## Accessibility
- Charts need a text summary or accessible label.
- Images need alt text; interactive elements must be keyboard reachable.

## Ignore
- Generated files in `src/data/` (review the script, not its output).
- `package-lock.json` unless dependencies changed.
