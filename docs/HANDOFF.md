# Handoff — RV Farm website (Oct 2, 2026)

For the next session (Claude or a person). Read this, then `tasks/status.md` and `tasks/todo.md`. The approved plan is `docs/plan.md`; the client vault is `../Buro Enterprise`.

## Where things stand
- **Branches on GitHub (`HamesInFlames/rvfarm-web`):**
  - `interim` (eb0f3d6) is the one-page interim site meant to replace Turnkey.
  - `dev` holds the full site (Phases 0–2 and part of Phase 3).
  - **There is no `main` yet.** Claude was blocked from creating or merging it; James does that.
- **Built:** 40 static pages.
  - Home; inventory (19 used units, 305 watermarked photos); 5 type pages; 19 unit pages with the all-in price breakdown, estimator and lead form.
  - Sell/consign, financing, delivery, how our prices work, about, reviews, FAQ, contact, legal drafts, site map, 404.
- **Last checks (all actual):**
  - `npm run verify` green: contrast, 18 unit tests, `astro check` 0/0/0, build, banned-words scan, 127 Playwright tests (link crawl, axe at 1440 and 375, tap targets, text size, reduced motion, filter).
  - Lighthouse mobile median of 3: performance 98–100 on every page type, LCP 1.5–2.3 s, CLS ≈ 0, accessibility and best practices 100. SEO is 69 only because `robots.txt` blocks indexing until launch (intended).
- **Not verified:**
  - The Docker/Caddy image has never been built (Docker Desktop was off). Railway will be its first build.
  - Form delivery: there's no Web3Forms key yet.
  - A real Android phone check.
  - Lighthouse against a Railway URL.

## Do next, in order
1. **Fix the 16 code-review findings** listed in `tasks/status.md` (file, problem, fix for each). Start with the two highs:
   - **Canonical URLs end in `.html`** (`Base.astro`): strip `.html` and `/index`.
   - **Dockerfile:** add `ARG`/`ENV` for `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_ALLOW_INDEX`, `PUBLIC_REVIEW` (plus a site-origin variable) before `npm run build`. Without them, Railway variables never reach the build, so the forms can't send and indexing can never be turned on.
   - Then medium 3–8: plates shown as an optional extra and the "licensing" wording; lead-form a11y and the missing-key/no-JS path; gating the testimonials; a `confirm-report --strict` launch gate.
2. Run `npm run verify`, `npx lhci autorun`, `npx playwright test screenshots`, then look at the screenshots and commit.
3. **Railway:** point a service at `interim` first. Watch the first build. Measure Lighthouse on the Railway URL.
4. **James merges to `main`.** Keep Railway production on `interim` until the full site is approved.

## Waiting on James / Rae
- **A Web3Forms access key**, set as `PUBLIC_WEB3FORMS_KEY` locally and on Railway.
- **Rae's answers to `docs/confirm-report.md`** (120 items). Most important:
  - Are the old prices now unit prices, with the $2,995 package and the admin fee added on top?
  - Admin fee: $599 or $499?
  - Does "admin & licensing" already include the $72 plates? If so, the site double-counts them.
  - Which units are really on the lot? The Maxlite's old page is 410 Gone.
  - The real hours (four versions conflict).
  - Which email to publish, and the launch domain.
  - Permission to reuse the four testimonials.
- **Domain control** before anything goes live (vault `92-domains-2026-10-02.md`).

## Uncommitted outside this repo
- The vault's `30-worklog.md` has entries for this session (5:01–6:45 pm), but they aren't committed. Claude's commit was blocked by the permission check. From the vault: `git add 30-worklog.md && git commit -m "Worklog: RV Farm site build, Oct 2" && git push`.
- `91-discovery-questionnaire.md` in the vault also has uncommitted changes that Claude didn't make.

## How to work in this repo
- Start Claude Code **in this folder** so `.claude/settings.json` and the guard hook load. The hook blocks force pushes, pushes to `main`, `rm -rf`, and edits to `.env` and the guardrail files.
- **Commands:**
  - `npm run verify`: everything except Lighthouse.
  - `npx lhci autorun`: Lighthouse.
  - `npm run photos`: re-watermark photos from the vault.
  - `npm run confirm-report`: regenerate the list of open items.
- **Data:** NAP is only in `src/data/dealership.json`, fees only in `src/data/fees.json`, and the advertised price is computed only in `src/lib/price.ts`.
- `PUBLIC_REVIEW=1 npm run build` shows the yellow `[confirm]` chips for client review. `PUBLIC_ALLOW_INDEX=1` is for the production launch build only.
