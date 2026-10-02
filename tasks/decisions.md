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
