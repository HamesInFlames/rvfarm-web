# Tasks — RV Farm website

Plan: `docs/plan.md` (§3g phases). Approved Oct 2, 2026.

## In progress
- [ ] Phase 1 — Inventory: clean the 19 used units into `src/data/inventory.json` (Zod schema in `src/content.config.ts`, `source` field, `confirm[]` per unit)
- [ ] Phase 1 — `scripts/photos.mjs`: copy from the vault's `PHOTOS-TO-ENHANCE/thervfarm/` (or `enhanced/rv-farm/` when a file exists), 1,600 px long edge, logo-v2 watermark, write `src/assets/inventory/<stock>/`
- [ ] Phase 1 — `lib/price.ts` + unit tests; `UnitCard`, `PricePanel`, `InventoryFilter`, detail page, `Gallery` + `Lightbox`, `PaymentEstimator`, `LeadForm`, type pages, Product/Offer JSON-LD

## Next
- [ ] Phase 2 — home, sell-or-consign, financing, delivery, pricing, about, reviews, FAQ, contact, thanks, legal, sitemap, 404; `docs/confirm-report.md`
- [ ] Phase 3 — Lighthouse on every page type, real mid-range Android, print stylesheet, repo size, `/code-review high`
- [ ] Phase 4 — walkthrough with Paul and Rae (James)

## Blocked / waiting on James
- [ ] Push `dev` and `interim` to github.com/HamesInFlames/rvfarm-web (needs approval)
- [ ] Railway project: point a service at `interim` (Dockerfile build). Not deployed; domain stays untouched until Paul controls it (vault `92`)
- [ ] Docker image build untested locally (Docker Desktop wasn't running) — first real test is Railway, or start Docker Desktop and run `docker build -t rvfarm-web .`
- [ ] Web3Forms access key for the lead forms (Phase 1); goes in an env var, not the repo
- [ ] Rae's `[confirm]` list (plan §5); hours on the interim page are one of four conflicting versions

## Completed
- [x] Phase 0 — scaffold, guardrails, AGENTS/CLAUDE/tasks, tokens + contrast check, fonts, Base layout, utility row (open/closed), header, footer, sticky bar, `dealership.json`, `fees.json`, interim page, test harness, Dockerfile + Caddyfile (Oct 2)
