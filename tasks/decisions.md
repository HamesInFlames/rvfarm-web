# Architecture Decisions — RV Farm website

<!-- Log all significant decisions here. Newest at the bottom. -->

### 2026-10-02 — Plan approved (`docs/plan.md`)
- James said "go" on the Stage 1 plan, including its 20 overrides of the vault's `40-mock-sites-plan.md` (plan §3a), Railway hosting via a Caddy container, and the `dev`/`interim` → James-merges-to-`main` workflow.

### 2026-10-02 — Approved packages (plan §4a)
| Package | Reason |
|---|---|
| astro 7 | Static pages, image pipeline, content collections with Zod |
| @astrojs/react, react, react-dom | Islands with state: filter, estimator, lightbox, lead form |
| tailwindcss, @tailwindcss/vite | Tokens via `@theme`; KC habit |
| @astrojs/sitemap | sitemap for SEO and for the link/axe crawls |
| motion | Reveal + filter-grid reorder; only animation library, ≤20 KB |
| sharp (dev) | Astro image service + `scripts/photos.mjs` resize and watermark |
| @types/react, @types/react-dom, @astrojs/check, typescript (dev) | Type checking |
| @playwright/test (dev) + Chromium | Link crawl, screenshots, reduced-motion check |
| @axe-core/playwright (dev) | Zero-violation a11y gate |
| @lhci/cli (dev) | Lighthouse mobile ≥90 |
| @fontsource/barlow-condensed, @fontsource/public-sans | Fallback only, if Astro's fonts API isn't usable |

Not installed: gsap (deferred; only the optional set-piece needed it), wrangler (Railway, not Cloudflare), lenis, any CMS.

### 2026-10-02 — Repo guardrails (model-usage report §5.3–§5.4)
- `.claude/settings.json`: §5.3 verbatim, except the two `npx wrangler *` ask rules became `Bash(railway *)` / `PowerShell(railway *)`. Includes `disableClaudeAiConnectors: true`, subagent model Sonnet, fast mode off.
- `.claude/hooks/guard.ps1`: §5.4 verbatim. Piped-payload test on Oct 2: 10/10 cases as expected (force push, push to main, `rm -rf`, `.env` write, settings edit, `cat .env.local` blocked; feature push, build, `.astro` edit, `cat .env.example` allowed).
- `.claude/agents/Explore.md`: §5.3 override, plus `tools: Read, Grep, Glob`.
- Consequence: pushes to `main` are blocked by the hook; James merges.

### 2026-10-02 — Inventory filter is plain TypeScript, not a React island (deviation from plan §3e)
- **Context:** Lighthouse mobile on `/inventory`: LCP 2.84 s with the filter as a React island hydrating the card grid. The same page with the filter rendered statically: LCP 1.74 s.
- **Decision:** cards are static HTML (UnitCard still renders through React at build time, zero client JS); the filter is server-rendered controls plus a ~3 KB script (`src/components/astro/InventoryFilter.astro`) that hides and re-orders the cards. Result: LCP 1.90 s, performance 99, CLS 0, 3 KB JS on listing pages. Behaviour covered by `tests/e2e/filter.spec.ts` (6 tests incl. no-JS).
- **React stays** for the estimator, lead form and lightbox (below the fold, `client:visible`/`client:idle`).

### 2026-10-05 — Railway CLI (global, not a project dependency)
- **Why:** James chose the CLI to set up the Railway service for `interim` instead of the dashboard or driving Chrome.
- **What:** `npm i -g @railway/cli`, installed globally on the MSI laptop. It isn't in `package.json`, and the build doesn't need it (Railway builds the Dockerfile from GitHub).
- **Guardrail:** `.claude/settings.json` already has `Bash(railway *)` / `PowerShell(railway *)` as ask rules, so every Railway command still asks James.

### 2026-10-05 — Railway: two services in project "empowering-wholeness"
- **Found:** James had already created the project (Oct 2). Service `rvfarm-web` deploys from `dev` at `rvfarm-web-production.up.railway.app` (Dockerfile, US East / us-east4).
- **Decision (James):** keep both.
  - `rvfarm-web` (`dev`): the review site for the Phase 4 walkthrough. `PUBLIC_REVIEW=1` shows the yellow [confirm] chips. `PUBLIC_SITE_ORIGIN` is the Railway URL.
  - `rvfarm-interim` (`interim`): the one-page site that replaces Turnkey once Paul controls the domain. It has no variables.
- **Gotcha:** `railway add --repo … --branch interim` built the repo's default branch (`dev`) first. Fixed by deploying the `interim` commit with `serviceInstanceDeployV2(commitSha)`. After that, pushes to `interim` deploy on their own.
- No custom domains. `robots.txt` on `dev` blocks indexing until `PUBLIC_ALLOW_INDEX=1` at launch.
- The empty project "tranquil-unity" (Oct 3) isn't used by this site.

### 2026-10-12 — Applying Rae and Paul's Oct 8 answers (vault `96a-answers-2026-10-08.md`)
- **Appointment-only hours are their own data, never "open".** `dealership.json` keeps walk-in hours in `hours` (Sat is `null`) and Saturday's 10–3 in `appointmentHours`. `openStatus()` never reports "open" during appointment hours ("By appointment only today, until 3:00 PM · no walk-ins"); `hoursRows()` marks the row and every hours table prints "By appointment only. No walk-ins." in bold. JSON-LD lists walk-in hours only. Covered by 4 new unit tests.
- **Stock number is optional.** The 4 units new on Rae's Oct 10 sheet have no stock number; inventing one would be a false fact. Pages show no "Stock" line for them, the photo folder falls back to the slug (`photoDir()`), and each carries a confirm note. Consigned units need no extra schema flag (`source: "consigned"` has no agreement check; only `partner` does).
- **VOW deep links.** Removal (RV Farm doesn't do it) and non-trailer consignment link to VOW. Review builds link to the VOW review site's `/park-home-removal` and `/consign`; production builds link to vacationsonwheels.ca's home page until the new VOW site is live there (`siblingUrl()` in `lib/site.ts`, confirm note in `dealership.json`).
- **Payment estimate stays, as an editable example.** Rae's lender range (7.9–29.9%, 4–15 years) and the lender payment are held for the lawyer. The 7.9% / 60 months / $500 down default is labelled "not a credit offer or an advertised rate" with every figure stated and editable. Lawyer note: 7.9% is also the bottom of the lenders' range, and cards show an estimated payment, so the lawyer should confirm this is fine under the credit-advertising rules or pick another example.
- **Admin fee stays $599** (Paul, Oct 5) with a confirm chip, because Rae wrote $499 on Oct 8. Paul picks.
