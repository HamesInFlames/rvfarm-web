# RV Farm website: competitive brief and build plan

Stage 1 of `../Buro Enterprise/prompts/build-rvfarm-web.md`, written Oct 2, 2026. No code yet. James approving this file approves §4 (packages and guardrails), which then gets logged in `tasks/decisions.md` during Phase 0.

Sources (vault paths): `20-decisions.md` (the latest entry wins), `40-mock-sites-plan.md` ("`40`"), `10-research-digest.md`, `research/competitor-rv-dealer-patterns.md` ("CP"), `research/keiths-trailers-deep-dive.md` + `keiths-browser-notes.md` ("Keith's"), `research/design-no-slop-and-retail-patterns.md`, `research/existing-sites-audit.md` ("audit"), `research/tech-stack-2026.md`, `80-meeting-2026-09-29.md` ("`80`"), `92-domains-2026-10-02.md`, `forms/bill-of-sale/` (README + `fee-benchmarks.md`), `research/claude-models-and-usage-for-web-builds.md` §2 and §5.

Anything marked `[confirm]` is unverified until Rae answers (§5).

---

## 1. Competitive scorecard

Who does it best (named site and exact behaviour), what RV Farm will do, and whether that matches (=) or beats (+) them. None of the research files has Lighthouse numbers, so the performance rows compare architecture, not scores.

### 1a. The conventions (CP Part 4.1 and 4.6, digest §2–3, Keith's)

| # | Convention | Best in class today | RV Farm will do | vs best |
|---|---|---|---|---|
| 1 | Phone and today's hours in the header | Hitch House: "Open Today from 9:00 AM – 6:00 PM" next to the sales phone. Keith's: bold 18 px `tel:` phone, but no hours in the header. | Utility row on every page: "Open today until 5:00 PM" or "Closed now · opens Mon 9:00 AM", worked out from `dealership.json` in the browser (with a static fallback in the HTML). Then **905-605-7056** as a text `tel:` link, then the address linking to the map. All three sit on one line on mobile. | + Hitch House has the hours but not the computed closed state. Keith's has no hours in the header. |
| 2 | A price on everything, with a plain line saying what's included | Campkin's: biweekly "(Includes HST & Campkin's Advantage package)" on cards, with "No Hidden Fees" and a Pricing Policy link. Bish's: "The Low Price Is The Price". Keith's: 0 of 272 units are "Call for price". | Every card and detail page shows the **all-in price = unit price + PDI package + admin fee**, then "+ HST". On the detail page a "What's in this price" breakdown expands to show the unit, $2,995 package and admin `[confirm $599/$499]`. Below it, "Optional extras" (warranty, delivery) are listed with their prices and are never added in. A `/pricing` page explains the rule. | + Campkin's puts the package inside its price but shows the breakdown only on its policy page. We show the breakdown on the unit itself. |
| 3 | Department or type tiles | Fraserway: shop-by-type grid with 10 types and New/Used links. Keith's: a 7-icon line-art type bar. | Type tiles are generated from the inventory, and **only types with at least one unit appear**. Today that's travel trailers, fifth wheels, park models/mobile homes and tent/hybrid. Each tile shows its live count ("Travel trailers · 11"). | + Neither shows counts, and neither hides empty types. |
| 4 | Filters with counts, sort, and "Showing 1–N of N" | Fraserway: Condition New 685 / Used 478, 16 price tiers, 13 payment brackets. Keith's: 11 facets with counts. | Filter rail: Type, Price, Sleeps, Length, Year, Make, each with counts. Filters live in the URL so they can be shared and the back button works, and the page works without JS (full list rendered on the server). Applied filters show as chips. Sort by price, year, length or newest. "Showing 19 of 19". With 19 units there is no pagination; everything shows on one page. | = on depth, + on usability: it's a static page, the filter result is instant, and no AJAX is needed. Can-Am and Hitch House render inventory with JS and can't be read without a browser. |
| 5 | Product-grid card | Keith's: Dealer Price bold, MSRP struck through, Save, "Payments From $184 /mo." in green, full-width "View Details ›". | Card: a 4:3 real photo with its count ("17 photos"), year-make-model in Barlow Condensed at 22 px or more, stock #, one spec line ("Sleeps 6 · 26 ft · 1 slide · 5,400 lb dry"), the **all-in price** with "+ HST", a payment estimate with an asterisk, a status tag, and one button "View this unit". Card titles are 22 px; Keith's are 13 px. | + Bigger type and an honest price. We use **no struck-through MSRP or "Save $X"** on used units, because the old site's "Retail $0 / Savings -$4,900" is exactly the trust problem. |
| 6 | Payment framing next to the price | Fraserway: "$188/mo" on every card. Campkin's: biweekly including HST. Bucars: "$1095*/Bi Weekly". | "Est. $X bi-weekly*" on every card and detail page, calculated from the all-in price including HST, with the rate, term and down payment written out in the footnote. The rate is labelled an example rate until a lender is confirmed `[confirm lender]`. No "OAC" or "from $99" promo until a lender stands behind it. | = Campkin's on the HST-inclusive maths. + Our assumptions are printed on the card, not only in the footer. |
| 7 | Big plain buttons: Call · Text · Email · Directions | Keith's: sticky detail bar with Contact Sales / Send Email / Call Us. Bish's: phone plus Schedule Service in the header. | Sticky bottom bar on mobile on every page: **Call · Text · Directions · Inventory**, 56 px tall with text labels. On detail pages "Inventory" becomes "Ask about this unit". | + **No site in the research has a sticky mobile bar** (CP Part 4.7 #5; Keith's lacks one too). |
| 8 | Store page: map, address, hours, building photo | Camp-Out: two-location footer, each with address, phone and hours. | `/contact`: static map image linking to Google Maps, address in text, an hours table with today in bold, and a holiday note. The building photo is a sand "Photo coming: the lot from Hwy 7" block. The footer repeats the address and hours on every page. | = We match it now and beat it once the photo shoot is done. |
| 9 | Star rating plus "family-owned since" | Bucars: 4.5★ Google with owner replies. Campkin's: since 1973. | **No rating badge on RV Farm** (D10, given the Yelp 1.3 and BBB F record). `/reviews` shows the four 2021 testimonials, dated `[confirm permission]`, a "Leave a Google review" link, and a "Had a problem? Call us" line. No "since 2001" or "25 years" claim until it's verified `[confirm]`. | − on social proof, deliberately. We gain trust by fixing the price and contact problems instead. |
| 10 | Plain-language labels, breadcrumbs, a printable page | Keith's: Print Page and a factory brochure PDF. Owasco: Send To Friend / Print. | Plain labels throughout: "Trailers", "Sell us your RV", "What's in this price". Hierarchical breadcrumbs on every inner page. A print stylesheet on detail pages that turns them into a one-page spec sheet with the price breakdown and phone number. | = Keith's, plus the print version carries the fee breakdown. |
| 11 | Hero | Every site uses a 3–5-slide promo slider (12/12). Keith's has text baked into its images and 5 auto-rotating slides. | One static real photo (best unit shot, enhanced when available), with the H1 and two buttons in HTML: **See the trailers** and **Call 905-605-7056**. No slider. The search strip sits directly under the hero. | + That's CP's own recommendation, and none of the 12 sites follows it. |
| 12 | Search widget above the fold | 10 of 12 sites. Keith's hides it on mobile. | Search under the hero (Type · Max price · Sleeps · Search), which posts to `/inventory?…`. It's also on mobile, as one row of selects. | + It stays on mobile. |
| 13 | Featured inventory on the home page | Campkin's: 4 units with web price and biweekly. | "Newest on the lot": 4 cards sorted by `addedAt`, plus "See all 19". The number is counted at build time, never typed in. | = |
| 14 | Shop-by tiles (sleeps / weight / payment) | Keith's: "Shop smarter" with Sleeps 4–6, Under 3,500 lb, Under $15k. Owasco and Camp-Out: payment brackets under $199 to $499. | A chip row: Under $15k all-in · Sleeps 4–6 · Sleeps 6+ · Park models · Fits a half-ton `[only if dry weights are known]`. **A chip only shows if it matches at least one unit**, so there are no dead ends. | + No empty results. |
| 15 | Financing / pre-qualify block | 8 of 12 sites. Fraserway, Owasco and Keith's: estimator modal with tax, trade-in and fees. | The payment estimator is an island on each detail page and on `/financing`: price prefilled with the all-in figure, trade-in, down payment, term, rate, HST at 13% (on by default), and weekly/bi-weekly/monthly. The pre-approval form has 7 fields and **no SIN, DOB or banking details**. | = Fraserway's inputs. + The price is already all-in, so the estimate doesn't jump at the desk. |
| 16 | Unit detail layout | Keith's: 8/4 gallery and price card, sticky title bar, jump-nav, 2-column spec table. Campkin's: 22 photos plus floorplan. Fraserway: 29 photos. | Keith's layout: gallery on the left with every real photo (15–25 per unit, the most-photographed unit has 25), price panel on the right, sticky title bar (Call · Ask), jump tabs, a 6-tile quick-spec row, a grouped spec table with plain labels and the industry term in brackets, a tow hint where the weight is known, "Similar units" ×3, and a prefilled contact form. | = Campkin's photo count. + Keith's used example had 1 photo. |
| 17 | List to detail continuity | Nobody does it. | A native view transition morphs the card image into the detail hero (Chromium and Safari; other browsers fall back silently with no JS cost). It's off under reduced motion. | + |
| 18 | Trade-in / sell form | Bish's: "Value Your Trade" modal. Fraserway: "Value My Trade" on every card. | `/sell-or-consign`: one form with "I want to: Sell · Trade · Consign" plus photo upload. It's linked from every detail panel ("Trading in? Tell us what you have"). | = |
| 19 | Disclaimers | Owasco: "excludes tax/registration/delivery; payments are estimates". Fraserway: the $425 fee is disclosed. | A one-sentence disclaimer under every price ("Price includes the PDI package and admin fee. HST and licensing extra. Payment is an estimate, not a credit offer."), plus the full version on `/pricing`. | = Owasco, but it's shorter and sits beside the price. |

### 1b. The five things dealer sites do badly (CP Part 4.7)

| # | Failure | Worst offender in the research | RV Farm fix | Check |
|---|---|---|---|---|
| 1 | Stale or empty content | TCC: "reopening February 5, 2024", "No Results" on /used/. Keith's: "NEW trailers starting Spring 2021!" | All NAP, hours and holiday banners come from **one config file**. Empty types and chips are hidden. An "Inventory updated [date]" stamp is built from the newest `updatedAt`. Sold units show a SOLD tag for 14 days and are then dropped by the build. | The build fails if a type page would be empty or if an `[confirm]` placeholder leaks into the rendered HTML in production mode. |
| 2 | Hidden prices | Can-Am: 112 of 160 unpriced. Owasco: "Call for Price". | Every used unit is priced, all-in. The schema requires `unitPriceCad` when `status` is not `sold`. | Zod rejects an unpriced in-stock used unit. |
| 3 | Form sprawl | Fraserway 3 forms, Owasco 4, plus "confirm email" fields. | One `LeadForm` component with 6–8 fields, labels above the fields, any phone format accepted, and a prefilled stock #. It's used for contact, ask-about-a-unit, sell/consign, financing and delivery. | An axe check on forms and a manual no-JS submit test. |
| 4 | Service pages that describe instead of sell | CampMart is phone-only. | RV Farm doesn't run the service side. It's one clear "Service & parts → Vacations on Wheels, same address" band with the VOW phone number. The VOW site (later) does the catalogue. | The link crawl covers the cross-link. |
| 5 | Weak mobile | No sticky call bar anywhere. Keith's blocks pinch-zoom and uses 13 px titles. | A sticky Call · Text · Directions bar, 17 px body text, pinch-zoom allowed, one search widget, hours in the header. | Screenshots at 375 px, the axe target-size rule, and a manual check on a mid-range Android. |
| Bonus | Orphaned parts | Text only. | Out of scope for RV Farm. The parts link goes to VOW. | |

---

## 2. Differentiators RV Farm can own

Each one uses only what RV Farm actually has. Nothing is invented.

1. **The price you see is the price before tax.** RV Farm lists every unit all-in: unit price + $2,995 PDI package + admin `[confirm]`, "+ HST", with the breakdown on the unit page and optional extras priced separately. Of the dealers in `fee-benchmarks.md`, only Tonbridge says its price "includes PDI & sales admin", and Campkin's buries its $3,500 Advantage Package in a policy page. Hidden fees are a recurring theme in RV Farm's own bad reviews (audit), so this answers the reputation problem directly instead of covering it with a badge. The Competition Act makes it mandatory anyway (decision 2026-09-29), so it costs nothing to lead with.
2. **Consignment with the terms written down.** Today's terms, from the audit: 20% commission on the sale price excluding repairs, a PPSA lien check, a written consignment agreement, and payout after sale "can take up to 90 days" `[confirm current terms]`. Mobile-home consignment covers 12'+ wide units, with permits, axles reattached, oversized-permit transport and deck or shed removal. Keith's has a Consignment tile but publishes no terms. Bucars lists consignment in a carousel. None of the competitors publishes a payout timeline. Consignment payout is also a complaint on Yelp, so a plain 4-step "How consignment works" with the timeline in writing turns a liability into a reason to call.
3. **Park models and mobile homes handled end to end.** RV Farm's used stock already includes a 1994 Franklin 10×40, a 2006 Northlander 12×40, a 2007 Hy-Line and a 2001 Travelaire. It also offers mobile-home removal and transport and delivery priced per km (`$6.50/km` `[confirm; it's 2–4× hauler rates in fee-benchmarks]`). None of the Ontario dealers surveyed publishes a delivery rate. A `/delivery` page with the published rate and a "how far are you?" line ("150 km ≈ $975 + HST") is concrete and can be checked.
4. **Buy here, get it serviced next door.** Vacations on Wheels is at the same address (1841 Hwy 7). It has a Google rating of 4.4–4.5★ on ~140 reviews, handles insurance claims and warranty work, and has three Spanish-speaking diesel techs (handoff). RV Farm can't borrow VOW's rating as its own badge, but every detail page can say "Service and parts are next door at Vacations on Wheels, 905-738-1253", which no small used lot in the research can say. "Se habla español en el taller de servicio" goes in a single line on the service band only. The RV Farm sales desk gets no Spanish claim unless Rae confirms a Spanish-speaking salesperson `[confirm]`.
5. **A small lot you can see all of on one phone screen.** With 19 used units, the whole lot fits on one fast static page with honest counts, every photo per unit, real stock status and an "updated [date]" stamp. The big dealers can't offer that (Fraserway has 1,163 units behind 16 facets). The copy says it plainly: "19 trailers and park models on the lot. All of them are here." The number is computed, so it's never stale. The tagline "We're closer than you think!" goes under the logo only. We don't make a distance claim until Rae confirms what it refers to `[confirm]`.

---

## 3. Reconciled plan (`40` with every override applied)

### 3a. Overrides and where they come from

| # | Override | Replaces in `40` | Source |
|---|---|---|---|
| O1 | RV Farm first. VOW later and gets cross-links only. QC is not in this repo. | §9 order and the Sept 22 "VOW + QC first" | `80` §8, decision 2026-09-29 |
| O2 | The name is **"RV Farm"** (singular, "The" dropped). The legal line stays `[confirm]` until the lawyer files. | "The RV Farm" everywhere, "The RV Farm Inc." in the footer | decision 2026-09-29 (rename route) |
| O3 | **Logo v2** (`brand/rv-farm-logo-v2.png`, no barn). It's raster only, so a vector is requested. | Old airstream/farm logo | decision 2026-10-01 |
| O4 | **Red replaces pine** as the primary colour. Sampled from logo v2: red `#B80000`, orange `#F07A1C`. Tokens in §3d. | Pine `#1E4D3A`, sky `#2F5D8A` | decision 2026-09-29 (logo brief), `80` §8 |
| O5 | Tagline **"We're closer than you think!"** under the logo. "Buy · Sell · Trade · Consign" moves to a section label. | 2021 tagline as the main line | prompt; logo v2. `[confirm]`: the audit says it's an Islington-era line |
| O6 | **No OMVIC or dealer-act wording anywhere.** The footer "OMVIC #—" placeholder and the ask-list item are removed. | `40` §3 footer, §5 `omvic` key, §10 #3 | decisions 2026-09-22, 2026-09-28, 2026-09-29 |
| O7 | **Advertised price = unit + PDI package + admin, plus HST.** Warranty and delivery are optional and listed separately. The fees live in one `fees.json`, and admin is marked `[confirm]`. | D9 ("Prices shown on every used unit") is extended | decision 2026-09-29 (Competition Act) |
| O8 | **Used inventory only.** The 13 new "On Order" units are excluded. **The `/brands/[brand]` pages and the home-page brands row are cut** (they existed for the four new-unit lines). Brand becomes a filter on Make. | `40` §3 `/brands/*` ×4, home section 9, "Call for price" path | decision 2026-09-30 (bill of sale used-only) `[confirm]`. The cut follows from it (found while reconciling). |
| O9 | **`source` field** (own / consigned / partner). No partner-dealer or "John / Niagara" units without a written arrangement. | Schema | `80` §5, §8 |
| O10 | **Turnkey goes early, behind an interim page.** Phase 0's deployable result is that page. | Phase 0 "empty shell" | decision 2026-09-29 (Turnkey), `92` |
| O11 | **Photos get a logo-v2 watermark** before they're published. Originals stay clean in the vault. | D11 pipeline | decision 2026-10-01 |
| O12 | **Never "new owner".** "Under new management" only, and not on the site for now. | none (new rule) | decision 2026-09-29 |
| O13 | **Hosting: Railway** (James, Oct 2: "when ready I will make a railway"). It serves the static `dist/` from a Caddy container. Wrangler, `wrangler.jsonc` and the Cloudflare deploy are dropped. Cloudflare can still sit in front later as DNS/CDN once Paul controls the domain (`92`). | D2 (Cloudflare Workers) | James, this session |
| O14 | **Repo: `github.com/HamesInFlames/rvfarm-web`** (already created and empty). The local folder stays `buro-rvfarm-web`. | "KC GitHub org" (`40` §8) | James, this session |
| O15 | **No "Free delivery / Free warranty", no "Payments from $99 OAC", no "since 2001", "Toronto's Largest" or "Voted Best".** The new prices conflict with the free offers, and the other claims are unverified. | `40` home sections 7–8, H1 "since 2001" | audit §claims, `fee-benchmarks.md`, bill of sale rev 6 |
| O16 | **No motorhomes** on RV Farm (they can only be brokered through VOW). | `40` type list (already had none) | decision 2026-09-22 |
| O17 | **The warranty page folds into `/pricing#extras`.** The provider and coverage are open, so a full page would make claims we can't back. | `40` `/warranty` | decision 2026-09-29 ("warranty provider still open") |
| O18 | **Staff names don't go on the site without consent.** The `/thanks` line becomes "We call back within one business day" with no names. | `40` `/thanks` ("Steve or Rae calls back"), `/about` staff grid | audit (no consent on file) |
| O19 | **Domain kept in one config value.** `80` says rvfarm.ca going forward; the vault `CLAUDE.md` says thervfarm.ca. The value is `[confirm]`, and nothing gets connected until the domains are in Paul's hands. | `40` §0 | `80` §4, `92` |
| O20 | **GSAP is deferred.** The only GSAP use was the optional consignment set-piece. It isn't installed until that set-piece is approved, which keeps JS down. | D1 (GSAP in the base stack) | `40` §7 ("cut first if Lighthouse drops") |

### 3b. Sitemap (`40` §3, reconciled)

Global chrome:
- **Utility row:** open-until status · "1841 Hwy 7, Concord" → `/contact#map` · **905-605-7056** → `tel:`.
- **Header:** logo → `/`. Nav: **Inventory** (click-to-open panel: All units · one link per type that has units · Under $15k · Park models) · **Sell or consign** · **Financing** · **Delivery** · **Service & parts ↗** (VOW, labelled "opens Vacations on Wheels") · **About** (panel: About us · Reviews · How our prices work · FAQ · Contact). Search field "Search, e.g. bunkhouse under $20k" goes to `/inventory?q=`. A red **Call** button shows the number on desktop.
- **Mobile header:** logo · Inventory · Call · Menu (full-screen list, 48 px rows).
- **Sticky mobile bar:** Call · Text (`sms:`, only if a text-capable line is confirmed, otherwise Email) · Directions · Inventory.
- **Footer:**
  - Inventory by type
  - Sell & finance (Sell or consign, Financing, Delivery, How our prices work)
  - RV Farm (About, Reviews, FAQ, Contact, Vacations on Wheels ↗)
  - Contact block (address, phone, email `[confirm]`, hours table with today in bold)
  - Memberships (Priority RV Network `[confirm]`; no OMVIC)
  - Legal: © 2026 RV Farm `[confirm legal name]` · Privacy · Terms · Accessibility · Sitemap
  - "Reduce motion" toggle
  - "Site by Kim Consultant" (small)

| Route | Sections (top → bottom) |
|---|---|
| `/` | 1. Hero: one real unit photo; H1 "Used trailers and park models on Hwy 7 in Concord"; a deck line with the computed unit count; **See the trailers** / **Call 905-605-7056**. 2. Search strip. 3. Type tiles with counts. 4. Chip row (only chips that match units). 5. "Newest on the lot" ×4. 6. "Buy · Sell · Trade · Consign": 4 tiles. 7. "How our prices work": an all-in price explained with one real unit as the worked example. 8. Financing band (estimator link, pre-approval). 9. Delivery and mobile-home moves band. 10. Three facts with numbers, no icons (e.g. "19 units on the lot", "$6.50/km delivery" `[confirm]`, "20% consignment commission" `[confirm]`; only verified facts make the cut). 11. Testimonials ×3, dated 2021 `[confirm permission]`. 12. VOW service band. 13. Map and hours. |
| `/inventory` | Breadcrumb · H1 "19 trailers and park models on the lot" (computed) · "Updated [date]" · filter rail and chips · sort · card grid 3/2/1 · disclaimer · empty state ("Nothing matches. Call 905-605-7056, or tell us what you're after" → form) |
| `/inventory/type/[type]` | Generated only for types with units: travel-trailers, fifth-wheels, park-models-and-mobile-homes, tent-and-hybrid (destination-trailers if the Puma 38PTB and Lakeview are reclassified). H1, a 2-sentence plain explainer with a tow hint, then the filtered grid. |
| `/inventory/[slug]` ×19 | Detail page per §1 row 16. Price panel: all-in price · "+ HST" · "What's in this price" (unit / PDI package / admin) · "Optional extras" (warranty from $1,995/yr `[confirm]`, delivery $6.50/km `[confirm]`) · est. payment · status · stock # · buttons **Call about this unit**, **Ask a question**, **Book a viewing**, **Trading in?**. Sold units render with a SOLD banner plus "Similar units". |
| `/sell-or-consign` | H1 "Sell us your RV, trade it in, or let us sell it for you" · three columns with real terms · "How consignment works" in 4 steps, with the payout timeline · form · FAQ |
| `/financing` | How it works ×3 · estimator · pre-approval form (Name, Phone, Email, Unit of interest, Monthly budget, Down payment, Best time to call; no SIN, DOB or banking) · lender line `[confirm]` · disclaimer |
| `/delivery` | Rate and worked examples `[confirm]` · pick-up at the lot · mobile-home removal and transport · request form (From/To town, Unit, Name, Phone) |
| `/pricing` (new) | "How our prices work": what the all-in price includes (PDI package contents per the bill of sale: PDI, demo, starter kit `[confirm contents]`), admin and licensing, HST, government plate fees ($72 / $32 per the bill of sale), optional extras (warranty, delivery), deposits `[pending Paul's terms]`, payment terms (funds held 10 days `[confirm business/calendar]`) |
| `/about` | Real facts only: same lot as VOW, consignment, delivery. "Family owned 25+ years" and "Priority RV Network" stay `[confirm]` and are hidden in production until confirmed. Lot photo placeholder. |
| `/reviews` | 2021 testimonials `[confirm]` · "Leave a Google review" · "Had a problem? Call 905-605-7056" |
| `/faq` | Deposits and holds (pending Paul's terms), consignment payout, delivery, financing, viewing appointments, as-is sales `[confirm]` |
| `/contact` | Map · address · phone · email `[confirm]` · hours with today highlighted · form · "Service? That's Vacations on Wheels" card |
| `/thanks`, `/privacy`, `/terms`, `/accessibility`, `/sitemap`, `/404` | As in `40`. The 404 reads "That unit may have sold." plus search and the 4 newest units. |

Total: about 36 static pages (19 units, 4–5 types, 13 others).

**Interim page (Phase 0 deliverable, its own branch `interim`):** logo v2 · "RV Farm · used trailers, park models and mobile homes" · "Our new website is on its way. Call us about what's on the lot today." · **905-605-7056** (big `tel:`) · 1841 Hwy 7, Concord + Directions · hours `[confirm]` · "Service and parts: Vacations on Wheels, same address, 905-738-1253" (+ link) · footer: © RV Farm. It has no inventory, no forms and no "under construction" GIF. It's a single HTML page under 50 KB and scores Lighthouse 100.

### 3c. Data schema

**`src/data/dealership.json`** is the only NAP source. Keys:
- `brandName` "RV Farm"
- `legalName` `[confirm]`
- `tagline`
- `siteUrl` `[confirm]`
- `address` {street "1841 Hwy 7", city "Concord", region "ON", postal "L4K 1V4", mapsUrl}
- `phones` {main "905-605-7056", tollFree "1-855-844-0068" `[confirm still live]`, sms `[confirm]`}
- `email` `[confirm]`
- `hours` (Mon–Fri 9–5, Sat 10–5, Sun by appointment, from the current RV Farm site; four versions conflict, so `[confirm]`)
- `holidayNote`
- `memberships` `[confirm]`
- `social` {facebook, instagram, youtube "@thervfarm"}
- `sibling` {name, url, phone "905-738-1253"}

No `omvic` key.

**`src/data/fees.json`** is the only fee source:
```json
{
  "pdiPackage": { "label": "PDI, demo and starter kit", "amountCad": 2995, "includedInAdvertisedPrice": true, "confirm": "exact figure and customer-facing name" },
  "admin":      { "label": "Admin and licensing", "amountCad": 599, "includedInAdvertisedPrice": true, "confirm": "$599 (Paul) vs $499 (Rae)" },
  "hstRate": 0.13,
  "plates":     { "plateAndPermitCad": 72, "permitOnlyCad": 32, "note": "government fees, added at sale" },
  "optional": {
    "warranty": { "label": "Extended warranty", "amountCadPerYear": 1995, "maxYears": 5, "confirm": "provider and coverage" },
    "delivery": { "label": "Delivery", "ratePerKmCad": 6.5, "confirm": "rate" }
  },
  "estimator": { "exampleAprPct": 7.9, "termMonths": 60, "downCad": 500, "confirm": "lender and rate" }
}
```
The advertised price is computed in one place (`lib/price.ts`) and never stored, so changing the admin fee re-prices the whole site in one edit.

**`src/data/inventory.json`** is validated by Zod in `content.config.ts`. It keeps `40` §5's keys, with these changes:
- **`unitPriceCad`** replaces `priceCad`. It's the unit price before fees. Whether the old listed prices become unit prices or Paul reprices is `[confirm]`; see §6 risk 1.
- **Added:**
  - `source`: `own` | `consigned` | `partner` (required; `partner` is refused by the build unless `partnerAgreement: true`)
  - `location` (default "On the lot, 1841 Hwy 7")
  - `confirm[]` (open questions per unit)
  - `soldAt?`
  - `photoCredit` (`own` default)
- **Removed:** `msrpCad`, `callForPrice`, `callForPriceReason`, `paymentFrom` (computed).
- **Kept:** `condition` keeps `new` in the enum for later, but every seed record is `used`.
- **`status`:** in-stock | pending | sold. Of the 19 used units, 11 have a blank status, so all are seeded `in-stock` with `confirm: ["still on the lot?"]`.
- **`type` enum:** travel-trailer | fifth-wheel | park-model | mobile-home | destination-trailer | tent-trailer | hybrid.
- **Photos:** `photos[]` point at the watermarked derivatives in `src/assets/inventory/<stockNumber>/`.

**Seed data:** the 19 used units from the audit, with these fixes on import:
- Jayco X19H year: 2012 vs 2010 `[confirm]`
- Stone Ridge year: 2011 vs 2010
- Apex model: 269RBSS, not 288BHS
- Heartland Breckenridge Lakeview 441QB make/model
- Puma 38PTB, filed as a park model: it's a destination trailer
- Drop the fake countdown, "$0 USD" and "Savings -$4,900"

Stock numbers are blank on the old site, so they're seeded as `RVF-<feed itemid>` until Rae supplies real ones `[confirm]`.

### 3d. Design tokens (from logo v2)

- **Brand red** `#B80000` (sampled). The **red used for text and buttons** is `#A30000`: white on it is about 8.2:1, which passes the 7:1 target. It's used for the header band, primary buttons and the phone button.
- **Sun orange** `#F07A1C` (sampled) is an accent only: rules under section heads, the tagline underline, and the "+ HST" pill. Text on orange is near-black `#1A1714` (about 7.5:1). Orange is never used as text on sand.
- **Neutrals** stay from `40`: sand `#F4EFE6` page · paper `#FBF9F4` cards · bark `#3B342C` text · bark-60 `#6E6659` secondary (checked against the 7:1 target in Phase 0, and darkened if it fails) · rule `#D9D2C5`.
- **Status colours:** in-stock `#2E7D4F`, pending `#8A5A00`, sold `#5B616B`. All are checked against paper.
- **Type:** Barlow Condensed 600/700 + Public Sans 400/600, self-hosted WOFF2, 2–3 files. The `40` §2 type scale stays: body 18/17 px, H1 52/36.
- **Shape:** 4 px radius, borders not shadows, 12-column grid, 1,280 px max width, 16 px phone gutter.
- **Header lockup:** logo v2 is square and detailed, and unreadable at 48 px. The header uses a horizontal crop of the v2 wordmark and tagline (no new artwork). The full square logo goes in the footer, on the interim page and in the watermark. A vector file is requested `[confirm]`.

There's no dark mode. A contrast script in Phase 0 checks every token pair and fails the build check below 7:1 for body text.

### 3e. Components (`40` §6, reconciled)

- **Astro (static):**
  - Layout and chrome: `Base` · `UtilityRow` · `Header` · `NavPanel` (click to open, Esc closes) · `MobileMenu` · `StickyBar` · `Footer` · `Breadcrumbs` · `Hero`
  - Inventory and pricing: `SearchStrip` · `TypeTiles` · `ChipRow` · `UnitCard` · `PricePanel` (all-in price, breakdown and extras; reads `fees.json`) · `SpecTable` · `Gallery`
  - Content blocks: `Band` · `FactRow` · `Testimonial` · `MapHours` · `Disclaimer` · `Placeholder` ("Photo coming: …")
  - **Cut:** `ServiceTile` (VOW only) and the brand row.
- **React islands:**
  - `InventoryFilter` (`client:idle`, URL-driven, enhances the server-rendered list)
  - `PaymentEstimator` (`client:visible`)
  - `Lightbox` (`client:visible`)
  - `LeadForm` (a real `<form method="post">` to Web3Forms with a honeypot; works without JS)
  - `Reveal` (Motion, used sparingly)
  - **Cut:** `HeroKenBurns`. It's done in CSS instead (desktop only, off under reduced motion), so there's no GSAP.
- **lib:** `hours.ts` · `price.ts` (all-in, HST, payment) · `seo.ts` (Product + Offer JSON-LD with the all-in price, AutoDealer LocalBusiness, BreadcrumbList) · `format.ts`.
- **Scripts:** `scripts/photos.mjs` (copies from the vault's `PHOTOS-TO-ENHANCE/thervfarm/`, or `enhanced/rv-farm/` where a file exists; resizes to a 1,600 px long edge; adds the logo-v2 watermark bottom-right at about 14% width and 85% opacity on a soft plate, plus a corner "© RV Farm"; writes `src/assets/inventory/<stock>/`; never touches the originals) · `scripts/contrast.mjs`.

### 3f. Animation budget (`40` §7, reconciled)

Allowed:
- `Reveal` on at most 4 elements per viewport (opacity plus 12 px, 250–300 ms, once)
- Card image 1.02× on hover (200 ms)
- Accordion 200 ms
- Sticky header shrink 200 ms
- Count-up on the home fact row (1.2 s or less, once)
- Hero Ken Burns 1.0→1.06 over 16 s, one pass, desktop only, CSS
- List-to-detail native view transition

Optional set-piece: the consignment 4-step pinned scroll. It's **not planned**, and needs separate approval plus GSAP.

Forbidden: sliders, auto-carousels, entry modals, smooth-scroll, parallax on text, cursor effects, loops, fade-up on everything.

`prefers-reduced-motion` and the footer toggle turn everything off via a `data-motion="reduce"` attribute on `<html>`, read before first paint. Motion JS stays at or under 20 KB.

### 3g. Phases and hours (RV Farm only; VOW stays at `40`'s 12 h and is planned later)

| Phase | Work | Hours | Done when |
|---|---|---|---|
| **0 Setup + interim** | Scaffold (§4 packages) · `init-project.sh` → AGENTS.md (Astro stack line and layout), CLAUDE.md, tasks/ · guardrails (§4b) and a piped test of the hook · `git remote add origin` · tokens, fonts, contrast script · `Base`, header, footer, sticky bar, `UtilityRow` with `hours.ts` (unit tested) · `dealership.json`, `fees.json` · Dockerfile + Caddyfile for Railway · interim page on branch `interim` | 6 | Build is green, interim page passes axe at 0 violations, Lighthouse 100 at 375 px, screenshots at 1440 and 375, reduced-motion check · ready for James to point Railway at the branch (deploy needs his approval) |
| **1 Inventory** | Clean the 19 units into `inventory.json` · `photos.mjs` with watermark · `UnitCard`, `PricePanel`, `InventoryFilter`, detail page, `Gallery` + `Lightbox`, `PaymentEstimator`, `LeadForm`, type pages · JSON-LD | 11 | All 19 detail pages build; prices match `price.ts` tests; filters work with JS on and off; a test form reaches James's inbox; full verification set |
| **2 Pages** | Home, sell-or-consign, financing, delivery, pricing, about, reviews, FAQ, contact, thanks, legal, sitemap, 404 · copy ban-list grep | 8 | Link crawl and axe green; no ban-list words; the build lists every `[confirm]` in `docs/confirm-report.md` |
| **3 QA + polish** | Lighthouse CI on every page type · real mid-range Android check · print stylesheet · repo size check · `/code-review high` in a fresh session | 3 | The D13 gate is green and the results are written in `tasks/status.md` |
| **4 Review** | Walkthrough with Paul and Rae (James runs it) | 2 | Corrections logged |
| | **Total** | **30 h** | Was 22 h for these phases in `40`. It grows with the guardrails, interim page, fee logic and watermarking, and shrinks with 19 units instead of 32 and no brand pages. |

Model and effort per phase follow the model-usage report §2.1: Opus medium for Phase 0 and the stateful islands, Sonnet for the 19-unit data cleanup and the repeated pages, Opus high for Phase 3 review, and Sonnet low for subagents.

---

## 4. Packages and setup

### 4a. Packages (approving the plan approves this list; it's logged in `tasks/decisions.md` in Phase 0)

| Package | Why |
|---|---|
| `astro` (7.x, via `npm create astro@latest -- --template minimal --typescript strict`) | Static pages, image pipeline, content collections with Zod (D1) |
| `@astrojs/react`, `react`, `react-dom` | The four islands that need state: filter, estimator, lightbox, lead form |
| `tailwindcss`, `@tailwindcss/vite` | Tokens via `@theme`; the KC habit |
| `@astrojs/sitemap` | `sitemap-0.xml` for SEO, and the URL list the link and axe crawls walk |
| `motion` | `Reveal` and the filter-grid reorder; it's the only animation library, capped at 20 KB |
| `sharp` (dev) | Astro's image service plus `photos.mjs` (resize and watermark) |
| `@types/react`, `@types/react-dom`, `@astrojs/check`, `typescript` (dev) | Type checking in `npm run check` |
| `@playwright/test` (dev) + Chromium | Link crawl, screenshots at 1440 and 375, reduced-motion check |
| `@axe-core/playwright` (dev) | Zero-violation a11y gate |
| `@lhci/cli` (dev) | Lighthouse mobile at 90 or more in CI |
| `@fontsource/barlow-condensed`, `@fontsource/public-sans` | Self-hosted WOFF2 without a Google request. Only used if Astro 7's built-in fonts API turns out not to be stable. |

**Not installed:** `gsap` (O20), `wrangler` (O13), `lenis`, any CMS. Railway's CLI isn't needed either: Railway builds the Dockerfile (`caddy:2-alpine` serving `dist/` with immutable caching on `/_astro/*` and the 404 page) from GitHub. Web3Forms is a plain HTTPS POST, so it needs no package.

### 4b. Repo guardrails (model-usage report §5.3 and §5.4, applied in Phase 0)

1. **`.claude/settings.json`:** the §5.3 file, copied verbatim from the vault report, with one change for O13. The two `npx wrangler *` ask rules become `Bash(railway *)` / `PowerShell(railway *)`. It includes:
   - deny rules for `.env` reads and edits, guardrail-file edits, force/delete pushes, `gh repo delete`, and the GitHub MCP repo create/fork tools
   - ask rules for `git push`, PR create and merge, the MCP push and merge tools, and Railway
   - **`"disableClaudeAiConnectors": true`**
   - `env`: `CLAUDE_CODE_SUBAGENT_MODEL=sonnet`, `CLAUDE_CODE_DISABLE_FAST_MODE=1`
   - the PreToolUse hook wiring
2. **`.claude/hooks/guard.ps1`:** the §5.4 script, copied with the Write tool (not a heredoc). It's then tested with piped payloads: a force push, a push to main, `rm -rf`, an `.env` edit and a normal command should exit 2, 2, 2, 2 and 0.
3. **`.claude/agents/Explore.md`:** the §5.3 Sonnet/low override, with a `tools:` read-only restriction added.
4. **Branch workflow this forces:** the hook blocks pushes to `main` and pushes made while on `main`. The `HamesInFlames` account is likely on GitHub Free, so `main` can't be protected server-side on a private repo. So I work on `dev` (and `interim`), ask before each push, and you merge to `main`. Railway deploys `main` for production later, and `dev` and `interim` for previews.
5. The user-level §5.5 changes (`disableBypassPermissionsMode`, Gmail/Drive ask rules) are in your `~/.claude`. I won't touch them; that list is for you.

---

## 5. `[confirm]` list for Rae (`40` §10, updated)

1. **Name:** the registered name once "The" is dropped, and the footer legal line.
2. **Logo:** a vector file of logo v2. Is "We're closer than you think!" final, and what does it refer to?
3. **Phones and email:** one sales number to publish (905-605-7056?). Is 1-855-844-0068 still live? Is there a text-capable line? Which email gets published?
4. **Hours:** the real hours, including Saturday and Sunday (four versions conflict), and holiday closures.
5. **Inventory:** which of the 19 used units are on the lot today, real stock numbers, and VINs if they want them shown.
6. **Prices:** are the old site's prices the unit price (with $2,995 + admin now added on top), or will Paul reprice? This is the biggest open item (§6 risk 1).
7. **Fees:** admin $599 or $499; the exact PDI package figure and what's in it; the customer-facing name ("PDI package" vs "road-ready package"); whether an as-is price (no package) is offered.
8. **Optional extras:** the warranty provider, coverage and age limits; whether $6.50/km delivery is the published rate.
9. **Financing:** the lender, an example rate they'll stand behind, and any "payments from" figure.
10. **Consignment:** the current commission (20%?), the payout timeline (up to 90 days?), and whether the mobile-home consignment terms still stand.
11. **Deposits:** Paul's deposit terms (pending the lawyer) for `/pricing` and the FAQ.
12. **Claims:** "family owned 25+ years", "100 years combined experience", Priority RV Network membership. Each one is shown only if confirmed.
13. **Testimonials:** permission to reuse the four 2021 testimonials (Tim T., Sandra A., Denise F., Judy H.).
14. **Spanish:** does anyone on the RV Farm sales side speak Spanish, or only the VOW techs?
15. **Photos:** are the inventory photos RV Farm's own (for the watermark and copyright)? Are the "lot" photos tagged "Grand River Trailer Sales" another dealer's? A date for Martin's lot, sign and staff shoot.
16. **Domains:** which domain the site launches on (rvfarm.ca vs thervfarm.ca), the GoDaddy login, and the Turnkey agreement (`92` asks).
17. **Lead inbox:** where form leads should go long-term (they come to James during the build).
18. **Google Business Profile access** (to fix the Islington address and link reviews).

---

## 6. Risks, and what I'll verify at each phase

**Risks**
1. **All-in prices look high.** If $2,995 + $599 is added to the old prices, a $4,900 Maxlite lists at $8,494 + HST, while Smithville and Tonbridge include their fees. *Mitigation:* the fee math lives in one file, `/pricing` explains it, and Paul reprices before launch (asked in §5 #6). The mock shows the formula with the old prices, labelled `[confirm]`.
2. **Stale inventory.** 11 of 19 statuses are blank and the data dates from Sept 17. *Mitigation:* every unit carries `confirm`, the review build shows a visible "[confirm] still on the lot?" chip, and the production build refuses to ship while any unit has an open confirm.
3. **Reputation.** Yelp 1.3 and BBB F will show up next to the launch. *Mitigation:* no badge, a "Had a problem? Call us" line, and no fake praise. Paul answering the BBB complaints is still recommended.
4. **Railway serves from one origin with no edge CDN.** That costs time to first byte for Ontario users compared with Cloudflare. *Mitigation:* pick a Railway US-East region (nearest Toronto), keep pages static and small, use immutable caching, and put Cloudflare DNS proxying in front once Paul controls the domain. I'll measure Lighthouse against the Railway URL as well as locally.
5. **Repo size.** About 330 inventory photos. *Mitigation:* commit only watermarked 1,600 px derivatives at around 80% quality (estimated 40–60 MB). Originals stay in the vault. If it goes over 60 MB I'll stop and ask about Git LFS or R2.
6. **The logo is raster only, and the header crop may look soft.** *Mitigation:* use the crop at 2× density, and swap in the vector when it arrives.
7. **Fee wording is legal-adjacent** (Competition Act, deposits). *Mitigation:* the wording comes from the bill of sale and Rae's decision; the deposit and as-is copy wait for the lawyer.
8. **The guard hook blocks pushes to `main`**, and if it fails it fails open (an error lets the command through). *Mitigation:* test it in Phase 0; you merge.
9. **Domains aren't in Paul's control** (`92`). *Mitigation:* nothing gets connected. The site lives on the Railway preview URL until you approve.
10. **Astro 7 font API or package versions differ from the research.** *Mitigation:* `@fontsource` fallback, already on the approved list.

**Verification per phase** (the prompt's gate; I'll report actual results, including failures)

| Check | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| `npm run build` + `astro check`, 0 errors | ✓ | ✓ | ✓ | ✓ |
| Unit tests: `hours.ts` (open/closed/Sunday/holiday), `price.ts` (all-in, HST, payment) | ✓ | ✓ | | ✓ |
| Playwright link crawl, every `<a>` returns 200 (internal, plus `tel:`/`sms:` format and external HEAD) | ✓ | ✓ | ✓ | ✓ |
| axe (wcag2a/2aa/21aa/22aa), 0 violations on every built page | ✓ | ✓ | ✓ | ✓ |
| Lighthouse mobile performance at 90 or more (target 100 on the interim page) | ✓ | ✓ | ✓ | ✓ + Railway URL |
| Screenshots at 1440 and 375 of every page type, viewed and fixed (viewport tiles, not full-page) | ✓ | ✓ | ✓ | ✓ |
| Reduced motion: emulate `reduce`, assert no transitions or animations run, view transitions off | ✓ | ✓ | ✓ | ✓ |
| Contrast script: 7:1 body, 4.5:1 large | ✓ | | | ✓ |
| Content grep: ban list, "OMVIC", "new owner", "Islington", "free delivery", "$0 USD" all return 0 | ✓ | ✓ | ✓ | ✓ |
| Price check: every card price = `price.ts` output; no unit is missing a price | | ✓ | ✓ | ✓ |
| No-JS: filters show the full list, forms submit | | ✓ | ✓ | ✓ |
| Commit on `dev` + `tasks/status.md` updated + vault worklog row | ✓ | ✓ | ✓ | ✓ |
