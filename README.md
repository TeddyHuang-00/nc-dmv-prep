# NC DMV Permit Prep
Local learner-permit practice app (Next.js App Router + shadcn/ui, light mode): dashboard, weighted practice rounds, 25-question exam, handbook reader. `pnpm install` then `pnpm dev`.

Scripts: `pnpm dev` · `pnpm test` · `pnpm build` (runs `scripts/build-handbook.mjs` first) · `pnpm start`.

Question bank: 302 questions merged from `src/data/chunks/*.json` into `src/data/questions.json` (regenerate: `pnpm bank:build`). Handbook markdown in `research/handbook/*.md` → `src/data/handbook.json`; sign images in `public/signs/`. Tunables in `src/lib/config.ts`.

Progress lives in localStorage under `ncdmv-stats-v1` — reset it with the dashboard button or by clearing that key.
