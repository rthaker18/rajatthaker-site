# Agent notes

## Logging a workout (the workflow)

The source of truth for training data is the spreadsheet
`spartan_hyrox_workout_log_v3.xlsx` (in ~/Downloads). To log a workout:

1. Edit the **Workout Log** sheet — add/fill the row for that day
   (done ✓ or ½, actual notes, distance, duration, weight, macros, RPE, takeaway).
2. Run the sync to push data + badge images to Vercel Blob ("the dB"):

   ```
   npm run sync:workouts -- ~/Downloads/spartan_hyrox_workout_log_v3.xlsx
   ```

   The site picks up changes on the next page load — no redeploy needed.
   Add `--dry-run` to print the parsed JSON (and write it to
   /tmp/workouts-db.json) without touching Blob or OpenAI.

## Required env (.env.local, gitignored — see .env.example)

- `BLOB_READ_WRITE_TOKEN` — write access for the dB (sync + server reads).
- `OPENAI_API_KEY` — generates a badge image per new workout type.
  Only used by the local sync script; never deployed.
- `WORKOUTS_DB_LOCAL` — optional path to a local db.json for dev preview
  (e.g. `/tmp/workouts-db.json` after a `--dry-run`).

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm run sync:workouts -- <xlsx> [--dry-run]` — sync spreadsheet → Blob

## Conventions

- Badge images are generated **once per workout category** (`images/<category>.png`
  in Blob — ~11 categories like run, climbing, rest); re-syncs skip existing
  images, so they cost nothing.
- The sync script parses sheets by header name (loose match), not column
  letter — keep header names recognizable when editing the spreadsheet.
- Dates in the sheet have no year ("Apr 20"); the script assumes year 2026.
