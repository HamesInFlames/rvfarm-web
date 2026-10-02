# AGENTS.md — project conventions

## Project
- Name: RV Farm website (used trailers, park models and mobile homes; 1841 Hwy 7, Concord, ON)
- Client: Paul Buro (RV Farm). Developer: James (Kim Consultant)
- Stack: Astro 7 (static output) + React 19 islands + Tailwind 4 + Motion; inventory as typed JSON via Astro content collections (Zod); images via astro:assets/sharp; forms POST to Web3Forms
- Hosting: Railway, Dockerfile (Caddy serving `dist/`). Nothing deploys without James's approval.
- Repo: github.com/HamesInFlames/rvfarm-web. Work on `dev` (full site) and `interim` (one-page interim site); James merges to `main`.
- Brief: `docs/plan.md` (approved Oct 2, 2026). Research and client facts live in the vault `../Buro Enterprise` (read-only from here, except `30-worklog.md`).

## Code conventions
- TypeScript strict; ESM only
- Astro components for static UI; React islands only where state is needed (filter, estimator, lightbox, lead form)
- Motion for island animation; CSS for hover/accordion; everything off under `prefers-reduced-motion` or `html[data-motion="reduce"]`
- Tailwind 4 with tokens in `src/styles/global.css` `@theme`; no raw hex in components
- NAP, hours and phones come only from `src/data/dealership.json`; fees only from `src/data/fees.json`; the advertised price is computed only in `src/lib/price.ts`

## Content rules (non-negotiable)
- Real client facts only (vault `research/existing-sites-audit.md`); unverified facts carry `[confirm]` and are hidden in production builds
- Advertised price = unit price + PDI package + admin fee, plus HST. Warranty and delivery are optional extras, listed separately
- No OMVIC or dealer-act wording. Never "new owner". No rating badge. No invented reviews, staff, numbers, awards
- Real photos only (watermarked derivatives); otherwise a sand "Photo coming: [what]" block. No AI or stock imagery
- No customer PII in the repo. Forms never ask for SIN, DOB or banking
- Banned copy: unlock, elevate, seamless, empower, effortless, leverage, streamline, journey, robust, cutting-edge, next-level, "it's not just X", "look no further"
- Readability: body 17–18 px, 7:1 contrast target, 44–48 px targets, labels above fields, phone in text on every screen. No Inter/Geist, no dark mode, no sliders, no smooth-scroll, no parallax on text, no entry modals

## File structure
- /src/pages — routes (interim branch: `index.astro` only)
- /src/layouts/Base.astro — document shell, meta, fonts, reduced-motion flag
- /src/components/astro — static components; /src/components/islands — React islands
- /src/data — `dealership.json`, `fees.json`, `inventory.json`
- /src/lib — `hours.ts`, `price.ts`, `seo.ts`, `format.ts`
- /src/assets — brand files and watermarked inventory photos (`inventory/<stock>/`)
- /src/styles/global.css — Tailwind `@theme` tokens
- /scripts — `photos.mjs` (resize + watermark from the vault), `contrast.mjs`
- /tests — Playwright: link crawl, axe, screenshots, reduced motion; unit tests for lib
- /docs/plan.md — approved plan; /tasks — todo, status, decisions

## Workflow
- Read tasks/todo.md and tasks/status.md before starting work
- Update tasks/status.md after each session; log decisions in tasks/decisions.md
- `npm run verify` (build + checks) must pass before committing
- Scope: do what the task asks; don't fix, optimize or extend unrelated code in the same change

## Do NOT
- Install packages that aren't in tasks/decisions.md without asking James (log the reason there)
- Push, deploy, connect a domain or contact the client without James's approval
- Delete .env files or edit .claude/settings.json / .claude/hooks
