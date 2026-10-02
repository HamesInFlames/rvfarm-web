# Session Status — RV Farm website

## Last session
- **Date:** 2026-10-02 (5:01 pm → Phase 0 done)
- **Tool used:** Claude Code (Opus 5.5), started in this repo with the vault added
- **What was done:**
  - Stage 1: `docs/plan.md` (scorecard, differentiators, reconciled plan with 20 overrides, packages, `[confirm]` list, risks). James: "go".
  - Phase 0: Astro 7 scaffold on branch `dev`; `init-project.sh`; AGENTS.md rewritten for Astro; guardrails (`.claude/settings.json`, `guard.ps1` tested 10/10, Explore override); approved packages installed and logged in `tasks/decisions.md`.
  - Tokens from logo v2 (red `#A30000` text-safe / `#B80000` brand, orange `#F07A1C`), `npm run contrast` all pairs ≥ target. Header wordmark cropped from logo v2; favicons from the "RV" letters.
  - `dealership.json`, `fees.json` (with `confirm` lists), `lib/hours.ts` (+10 unit tests), `lib/format.ts`, `lib/seo.ts` (AutoDealer JSON-LD), `lib/site.ts` (nav renders only built routes; `PUBLIC_REVIEW=1` shows `[confirm]` chips).
  - Components: UtilityRow (live open/closed in America/Toronto), Header (full/interim, `<details>` mobile menu), StickyBar, Footer (motion toggle), HoursTable, Confirm. `Base.astro` with self-hosted fonts via Astro's fonts API.
  - Interim page at `/` (name, logo, phone, address, hours, VOW link, "call about inventory").
  - Test harness: Playwright link crawl, axe (wcag2a–22aa + best-practice, both widths, menu open), tap targets ≥44 px, body ≥17/18 px, reduced motion (OS + toggle), screenshot tiles; content grep; Lighthouse CI.
  - Dockerfile (node build → caddy:2-alpine) + Caddyfile for Railway.
- **Verification (Phase 0, actual results):** `npm run verify` green — contrast all pass; unit 10/10; `astro check` 0 errors; build OK; content grep 0 hits; e2e 7/7 (links, axe 1440 + 375 + menu, tap targets, font size, reduced motion ×2). Lighthouse mobile on `/`: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, 139 KB. Screenshots at 1440 and 375 reviewed and fixed (phone overflow in the utility row, duplicate interim footer, wrapped hours).
- **Not verified:** Docker image build (Docker Desktop not running). Nothing pushed or deployed.
- **Phase 1 (same session, 5:35–6:00 pm):**
  - Sonnet subagent cleaned the 19 used units into `src/data/inventory.json` from the audit + live old-site pages (notes: `docs/inventory-cleanup.md`). 5 prices switched to the live old-site price (changed since Sept 17), each with a confirm note. Maxlite page is 410 Gone.
  - `scripts/photos.mjs` (`npm run photos`): 305 photos, 1,400 px, logo-v2 watermark, 55 MB in `src/assets/inventory/`. Vault originals only read.
  - `lib/price.ts` (all-in = unit + PDI package + admin; HST; amortized payments) with 8 unit tests; `content.config.ts` Zod schema (unpriced unsold units and partner units without agreement fail the build).
  - Pages: `/inventory`, `/inventory/type/*` (5 types with units), 19 unit pages, `/thanks`. Islands: InventoryFilter (URL state, facet counts, collapses on phones), PaymentEstimator, LeadForm (Web3Forms, no-JS POST), Lightbox; UnitCard renders statically and inside the filter.
- **Verification (Phase 1, actual results):** contrast pass; unit 18/18; `astro check` 0 errors/0 hints; build 27 pages; content grep 0 hits on 27 pages; Playwright 90/90 (link crawl incl. external, axe 27 pages × 2 widths + menu, tap targets, font size, reduced motion per page, screenshots). Lighthouse mobile (median of 3): `/` 99, `/inventory` 95, unit page 98, type page 98; accessibility/best practices/SEO 100. **LCP assertion fails on `/inventory`: 2.81 s vs 2.5 s** (was 3.03 s; card images now cropped 4:3, filter hydrates on visible). Screenshots at 1440/375 reviewed; fixed misaligned card buttons, sleeps facet on sparse data, filter panel pushing cards down on phones, header overflow on phones, wrapped call button.
- **Not verified:** form delivery (no Web3Forms key yet); Docker image build.
- **What's next:** Phase 2 pages per `tasks/todo.md`. Index on `dev` is still the interim page until the home page lands.
- **Findings for James:** `kimconsultant.net` (apex) doesn't resolve in DNS; only `www.kimconsultant.net` does. The footer links to `www`.
