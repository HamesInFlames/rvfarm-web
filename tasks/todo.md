# Tasks — RV Farm website

Plan: `docs/plan.md` (§3g phases). Approved Oct 2, 2026.

## In progress
- [ ] Phase 3 (James) — real mid-range Android check; Lighthouse on the Railway URL
- [ ] Phase 4 — walkthrough with Paul and Rae (James)

## Blocked / waiting on James
- [x] `main` created from `dev` at ed56551 (James, Oct 5)
- [ ] Rae's answers go in `docs/confirm-answers.md`; then Claude applies them to the data files
- [ ] Railway project: point a service at `interim` (Dockerfile build). Not deployed; domain stays untouched until Paul controls it (vault `92`)
- [x] Docker image built and run locally (Oct 5): fixed the Caddy `@html` startup crash on dev and interim
- [ ] Web3Forms access key: set `PUBLIC_WEB3FORMS_KEY` in a local `.env` and on Railway. Until then the form says "call us" instead of sending; "a test form reaches James's inbox" (Phase 1 acceptance) is NOT verified
- [ ] 2006 Maxlite 25RS: its old-site page returns 410 Gone (probably sold); still listed with a confirm flag
- [ ] Prices: 5 units now use the live old-site price (it changed since the Sept 17 audit); Stone Ridge page says $18,000, the old list says $22,900
- [ ] Rae's `[confirm]` list (plan §5); hours on the interim page are one of four conflicting versions

## Completed
- [x] Phase 3 — React-free inventory filter (LCP 2.84 → 1.90 s), print spec sheet, filter tests, code review with all 16 findings fixed + 6 regression tests (Oct 2–5)
- [x] Phase 2 — home, sell-or-consign, financing, delivery, pricing, about, reviews, FAQ, contact, privacy/terms/accessibility drafts, HTML sitemap, 404, robots.txt (noindex until `PUBLIC_ALLOW_INDEX=1`), `docs/confirm-report.md` (120 open items) (Oct 2)
- [ ] Launch checklist: `npm run confirm-report -- --strict` passes, `PUBLIC_ALLOW_INDEX=1` on the production build, lawyer reads the legal drafts and deposit copy
- [x] Phase 1 — 19 used units in `inventory.json` (cleanup notes in `docs/inventory-cleanup.md`), 305 photos watermarked (55 MB), price lib + tests, card, filter, type pages, detail page, gallery + lightbox, estimator, lead form, `/thanks`, Product/Offer + Breadcrumb JSON-LD (Oct 2)
- [x] Phase 0 — scaffold, guardrails, AGENTS/CLAUDE/tasks, tokens + contrast check, fonts, Base layout, utility row (open/closed), header, footer, sticky bar, `dealership.json`, `fees.json`, interim page, test harness, Dockerfile + Caddyfile (Oct 2)
