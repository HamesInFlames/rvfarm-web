# Tasks — RV Farm website

Plan: `docs/plan.md` (§3g phases). Approved Oct 2, 2026.

## In progress
- [ ] Phase 3 — `/inventory` LCP is 2.84 s (median of 3) vs the 2.5 s assertion; performance score 95 passes the ≥90 gate. Ideas: fewer cards competing on first load on phones, smaller first card, measure on Railway too
- [ ] Phase 3 — Lighthouse on every page type, real mid-range Android, print stylesheet, repo size, `/code-review high`
- [ ] Phase 4 — walkthrough with Paul and Rae (James)

## Blocked / waiting on James
- [ ] Push Phase 2 on `dev` (Phase 0–1 pushed Oct 2 with James's OK); create `main` and merge (James; hook blocks pushes to main)
- [ ] Railway project: point a service at `interim` (Dockerfile build). Not deployed; domain stays untouched until Paul controls it (vault `92`)
- [ ] Docker image build untested locally (Docker Desktop wasn't running) — first real test is Railway, or start Docker Desktop and run `docker build -t rvfarm-web .`
- [ ] Web3Forms access key: set `PUBLIC_WEB3FORMS_KEY` in a local `.env` and on Railway. Until then the form says "call us" instead of sending; "a test form reaches James's inbox" (Phase 1 acceptance) is NOT verified
- [ ] 2006 Maxlite 25RS: its old-site page returns 410 Gone (probably sold); still listed with a confirm flag
- [ ] Prices: 5 units now use the live old-site price (it changed since the Sept 17 audit); Stone Ridge page says $18,000, the old list says $22,900
- [ ] Rae's `[confirm]` list (plan §5); hours on the interim page are one of four conflicting versions

## Completed
- [x] Phase 2 — home, sell-or-consign, financing, delivery, pricing, about, reviews, FAQ, contact, privacy/terms/accessibility drafts, HTML sitemap, 404, robots.txt (noindex until `PUBLIC_ALLOW_INDEX=1`), `docs/confirm-report.md` (120 open items) (Oct 2)
- [ ] Launch checklist: `npm run confirm-report -- --strict` passes, `PUBLIC_ALLOW_INDEX=1` on the production build, lawyer reads the legal drafts and deposit copy
- [x] Phase 1 — 19 used units in `inventory.json` (cleanup notes in `docs/inventory-cleanup.md`), 305 photos watermarked (55 MB), price lib + tests, card, filter, type pages, detail page, gallery + lightbox, estimator, lead form, `/thanks`, Product/Offer + Breadcrumb JSON-LD (Oct 2)
- [x] Phase 0 — scaffold, guardrails, AGENTS/CLAUDE/tasks, tokens + contrast check, fonts, Base layout, utility row (open/closed), header, footer, sticky bar, `dealership.json`, `fees.json`, interim page, test harness, Dockerfile + Caddyfile (Oct 2)
