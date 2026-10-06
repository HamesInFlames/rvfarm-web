# Answers to the [confirm] items

Fill-in sheet for Rae's (or Paul's) answers. The questions come from `docs/confirm-report.md` (generated, 123 open items as of 2026-10-05). Duplicates are merged here, and the questions that change prices on every page come first.

**How to use it**
- Write each answer after `Answer:`. Note who said it and the date, e.g. `$599 (Rae, Oct 8)`.
- Leave a line blank if there's no answer yet. The site keeps hiding that item in production and shows the yellow chip in review builds.
- "Doesn't apply" is an answer. Write it, so the item can be closed.
- Once answers are in, Claude applies them to `src/data/*.json` and the pages, then re-runs `npm run confirm-report`. Launch needs `npm run confirm-report -- --strict` to pass with 0 open items.

Status: **not yet sent to Rae** (James, Oct 5).

---

## 1. Answer these first (they change prices or block launch)

1. Are the prices on the old site **unit prices**, with the PDI package and admin fee added on top?
   - Answer:
2. Admin fee: **$599** (Paul) or **$499** (Rae)?
   - Answer: $599 (Paul's Oct 5 fee list; final per vault `20-decisions.md` 2026-10-06). Already on the site.
3. PDI package: exact amount ($2,995 on the bill of sale; Paul said about $3,000), the name customers see ("PDI package" or "road-ready package"), and exactly what's in it.
   - Answer: $1,995 (Paul's Oct 5 fee list; final per vault `20-decisions.md` 2026-10-06). Already on the site. Still open: does it still include the starter kit and demo, the name customers see, and what's in it.
4. Plates: does "admin & licensing" already include the plates ($72 / $32)? If yes, the site removes the separate plates line so they aren't charged twice.
   - Answer:
5. Which units are really on the lot today? (Fill the "On the lot?" column in section 6.)
   - Answer:
6. The real opening hours. Four versions conflict; the site currently shows Mon–Fri 9–5, Sat 10–5, Sun by appointment.
   - Answer:
7. Launch domain: **rvfarm.ca** or **thervfarm.ca**?
   - Answer:
8. Which email address to publish (the current site has none)?
   - Answer:

## 2. Business details (`src/data/dealership.json`)

- Registered legal name once "The" is dropped (lawyer filing):
  - Answer:
- Is the toll-free line 1-855-844-0068 still live? (Left off the site until confirmed.)
  - Answer:
- Is there a line that can receive texts? (The phone sticky bar shows "Text" only if there is.)
  - Answer:
- Is the Priority RV Network membership still current?
  - Answer:
- Social accounts to link: Facebook theRVfarm, Instagram theRVFarm, YouTube @thervfarm. Are these right?
  - Answer:
- Is "We're closer than you think!" the final tagline, and what does it refer to?
  - Answer:

## 3. Fees, financing, warranty, delivery

- Warranty: provider, what it covers, and age limits on units:
  - Answer:
- Delivery: is $6.50/km the published rate?
  - Answer:
- Delivery: how is the distance measured (from the lot, one way or round trip)?
  - Answer:
- Financing: which lender, and an example rate they'll stand behind? (The old site's calculator used 7.9% / 60 months / $500 down.)
  - Answer:
- Price-related wording on `/pricing`: "10 business days" or "10 calendar days"?
  - Answer:
- Paul's deposit terms (the lawyer is reviewing them):
  - Answer:

## 4. Selling and consigning (`/sell-or-consign`)

- Current consignment commission:
  - Answer:
- Payout timeline after a consigned unit sells:
  - Answer:
- Is the mobile-home removal service still offered, and on what terms?
  - Answer:

## 5. Claims, testimonials, legal

- "Family owned and operated for over 25 years." True as written?
  - Answer:
- "100 years of combined experience in sales, service, buying, selling, trading and consigning." True as written?
  - Answer:
- "Member of the Priority RV Network." (Same as the membership question in section 2.)
  - Answer:
- Permission to reuse the four testimonials on the new site:
  - Answer:
- Privacy, terms and accessibility pages are drafts. Has the client's lawyer reviewed them?
  - Answer:

## 6. Units (`src/data/inventory.json`)

Fill one row per unit. "Unit price" is the price before the PDI package and admin fee. "Sold" in the first column removes the unit from the site.

| Unit | Site stock # | On the lot? | Real stock # | Unit price |
|---|---|---|---|---|
| 1994 Franklin 2 Bedroom 10x40 | RVF-39030074 | | | (audit $12,900 / now $10,900) |
| 2001 Travelaire 391PA | RVF-67474297 | | | |
| 2006 Maxlite 25RS | RVF-68003546 | (old page is 410 Gone) | | |
| 2006 Northlander 2 Bedroom 12x40 | RVF-67644139 | | | |
| 2006 Sunset Creek 298BH | RVF-68109072 | | | (audit $4,900 / now $14,900) |
| 2007 Hy-Line 39 | RVF-39591074 | | | |
| 2008 K-Z Sportsmen S245RL2 | RVF-39067962 | | | (audit $5,900 / now $4,900) |
| 2011 KZ Stone Ridge D3255PX3 | RVF-33878421 | | | (detail page $18,000 / list $22,900) |
| 2011 Zinger ZT250SB | RVF-67705020 | | | |
| 2012 Jayco Jay Feather Ultra Lite Select X19H | RVF-37610459 | | | |
| 2013 Forest River Sabre SRT260RLS | RVF-67137840 | | | |
| 2014 Coachmen Maple Leaf Edition 322RLDS | RVF-67137629 | | | |
| 2015 Coachmen Apex 269RBSS | RVF-40302349 | | | |
| 2016 Forest River Flyte 3150K | RVF-68003706 | | | |
| 2016 Forest River Salem 26T | RVF-40120742 | | | |
| 2016 Palomino Puma 38PTB | RVF-67681183 | | | (audit $15,900 / now $14,900) |
| 2016 Crossroads Sunset Trail 32RL | RVF-66522140 | | | |
| 2017 Heartland Breckenridge Lakeview 441QB | RVF-35118627 | | | (audit $36,900 / now $34,900 sale, $36,900 dealer) |
| 2017 Starcraft Launch Ultra Lite 24RLS | RVF-34055074 | | | |

### Per-unit details

**1994 Franklin 2 Bedroom 10x40**
- Mobile home or park model? (Listed under Trailers; set to mobile home.)
  - Answer:

**2001 Travelaire 391PA**
- Exact length (source says "approx. 39 ft"):
  - Answer:

**2006 Maxlite 25RS**
- If still for sale: length, weights, sleeps, slides, floorplan.
  - Answer:

**2006 Northlander 2 Bedroom 12x40**
- Mobile home or park model? (Title says mobile home; category says park model.)
  - Answer:
- Measured dimensions (12x40 comes from the model name):
  - Answer:
- Relocation cost and arrangements:
  - Answer:
- Better single photos (current files are 1024 px collages): who takes them, and when?
  - Answer:

**2006 Sunset Creek 298BH**
- Length and weights:
  - Answer:

**2007 Hy-Line 39**
- GVWR in lbs (only 3,178 kg given):
  - Answer:

**2008 K-Z Sportsmen S245RL2**
- Fifth wheel or travel trailer? (Set to fifth wheel from the photos.)
  - Answer:
- Exact length (source says "approx. 26–27 ft"):
  - Answer:

**2011 KZ Stone Ridge D3255PX3**
- Model year 2010 or 2011 (check the VIN):
  - Answer:
- Fifth wheel? (Set from the model and front-bedroom layout.)
  - Answer:

**2011 Zinger ZT250SB**
- Length, number of slides, GVWR in lbs:
  - Answer:

**2012 Jayco Jay Feather Ultra Lite Select X19H**
- Model year 2010 or 2012? (VIN reads as 2012.)
  - Answer:
- Hybrid or tent trailer? (Set to hybrid.)
  - Answer:

**2013 Forest River Sabre SRT260RLS**
- Exact length (source says "approx. 27 ft"):
  - Answer:

**2014 Coachmen Maple Leaf Edition 322RLDS**
- Is the model 322RLDS? (Taken from the title.)
  - Answer:
- Exact length (source says "approx. 35 ft"):
  - Answer:

**2015 Coachmen Apex 269RBSS**
- Is the model 269RBSS? (The feed said 288BHS; the title and VIN plate photo say 269RBSS.)
  - Answer:
- Length, dry weight, GVWR in lbs:
  - Answer:

**2016 Forest River Flyte 3150K**
- Length, slides, weights:
  - Answer:

**2016 Forest River Salem 26T**
- Exact length (source says "approx. 26–27 ft"):
  - Answer:

**2016 Palomino Puma 38PTB**
- Destination trailer or park model? (Set to destination trailer.)
  - Answer:
- Exact length (source says "approx. 38 ft"):
  - Answer:

**2016 Crossroads Sunset Trail 32RL**
- Exact length (source says "approx. 35 ft"):
  - Answer:

**2017 Heartland Breckenridge Lakeview 441QB**
- Make and model correct? (Filled in from the title.)
  - Answer:
- Destination trailer or park model? (Set to destination trailer.)
  - Answer:
- Features checked on the lot? (The old page warns that the unit may differ from the description.)
  - Answer:

**2017 Starcraft Launch Ultra Lite 24RLS**
- Exact model name (a photo shows an "Elite" badge):
  - Answer:
- Exact dry weight (source says "just over 5,300 lbs"):
  - Answer:
- Larger photos (current ones are 526 px): who takes them, and when?
  - Answer:
