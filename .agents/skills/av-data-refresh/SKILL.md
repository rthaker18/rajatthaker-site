---
name: av-data-refresh
description: Re-run the NHTSA SGO data pipeline, sanity-check the output, and open a PR if the data changed.
triggers: ["user"]
---

## Run
1. `npm ci`
2. Run the data pipeline script (see `package.json` scripts; e.g. `npm run data`).

## Sanity checks
1. Compare record counts to the previous JSON: flag if the incident count dropped, or grew by more than 25%.
2. Confirm no company name variants slipped through normalization (list unique company names).
3. Confirm the latest incident date is plausible (not in the future, not older than the previous file's latest).

## Ship
1. If the JSON is unchanged, stop and report "no new data."
2. Otherwise run `@skills:test-before-pr`, then open a PR titled "Data refresh: <date>" with the count diff and the sanity-check results.
