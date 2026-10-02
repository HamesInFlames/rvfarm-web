# Inventory cleanup notes

Output: `src/data/inventory.json` (19 used units, prepared 2026-10-02, `addedAt`/`updatedAt` set to the audit date 2026-09-17).

## Method and rules applied

- Unit list, prices and feed IDs come from `research/existing-sites-audit.md` (inventory table, 2026-09-17 crawl). Only the 19 used units were kept; the 13 new/On Order units were skipped.
- Missing specs and descriptions come from the live detail pages on thervfarm.ca, fetched one at a time on 2026-10-02. Nothing was guessed. Where a source gave a range (for example "sleeps 4 to 5") the number field was left out and the range is in `features`. Weights given only in kg were not converted.
- Prices are the audit prices (as the brief specified). Several live pages now show different prices; each is listed under that unit and in its `confirm` array.
- Photos: files named by feed ID in `PHOTOS-TO-ENHANCE/thervfarm/`. Excluded `_400x0` thumbnails, 940x788 homepage "Random Advertisement" crops, and the unnumbered lower-resolution copy of the main photo where one exists. No exact duplicates (same pixel size and byte count) were found in any unit. Photos are listed hero first, then by feed index.
- Hero review: contact sheets of up to 4 candidates per unit (landscape files first) were opened. Filenames keep their on-disk `NNN-` prefix.
- Dropped everywhere: "Sale ends", "Retail $0", "$0 USD", "Savings", countdown text, "1st payment on us", free storage/winterizing/delivery offers, financing lines, emoji bullets, "!!" title decoration. VINs on the live pages were not carried over (no field in the schema).
- Every unit has `confirm` items "Still on the lot?" and "Real stock number". `stockNumber` is a placeholder (`RVF-<feedId>`). The live page "Stock Number" is the feed ID.

## Cross-cutting findings

- The live site has moved since the audit. The Maxlite 25RS page returns HTTP 410 Gone. The live Pre-Owned list has different prices for Sunset Creek ($14,900 vs $4,900), Sportsmen ($4,900 vs $5,900), Franklin ($10,900 vs $12,900), Puma ($14,900 vs $15,900), Heartland ($34,900 sale vs $36,900), and Stone Ridge ($22,900 in the list vs $18,000 on its page).
- The live Pre-Owned list also shows units not in the audit (for example 2019 Forest River Avenger 29RBS, 2013 Sunset Trail 28BH, 2013 Gulf Stream Kingsport 301TB, 2008 Keystone Laredo 284BH, 2006 Gulf Stream Conquest C38DLS, 2006 Northlander 10x40). These were not added; the brief limits the scope to the 19.
- The Jayco VIN on the live page has a model-year character that reads as 2012 (the Stone Ridge VIN reads as 2011), which supports the title years. This is an observation only; the year conflicts are still in `confirm`.
- Type calls: Franklin and Northlander are mobile-home; Puma and Lakeview are destination-trailer; Jayco is hybrid; Sportsmen is fifth-wheel (the page heading says fifth wheel, and the photos show a fifth-wheel nose); Stone Ridge is fifth-wheel (not stated by the page; from the model and front-bedroom layout). Northlander: the page title says "Mobile Home" while its category says Park Model, so mobile-home was kept.
- Photo quality: Starcraft is 526x526 for every photo, Northlander files are 1024 px collages. Seven units have no landscape exterior (Stone Ridge, Zinger, Jayco, Flyte, Salem, Heartland, Starcraft); a portrait exterior was used as hero, except Starcraft where no exterior was among the 4 photos opened.

## Units

### 1994 Franklin 2 Bedroom 10x40 (feed 39030074)
- Fixed: Removed "1st Payment On Us", delivery and financing promo lines, emoji bullets. Rewrote description. Dropped fake sale/savings text.
- Sources: Specs (size, bedrooms, sleeps), features, video: live page. Price, title, feed ID: audit. Stock number shown on live page is the feed ID, not a real stock number.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (286-inv_1994-FRANKLIN-2-BEDROOM-10X40_39030074_5.jpg), only landscape photo; full side elevation of the unit on the lot.
- Page fetch: live page fetched
- Open questions: Price: audit (2026-09-17) shows $12,900, live page now shows $10,900; Type: source text calls it a park model design but the category is Trailers; set to mobile-home per brief

### 2001 Travelaire 391PA (feed 67474297)
- Fixed: Removed "!!" title decoration and generic marketing phrasing. Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 18 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 4 (424-inv_2001-TRAVELAIRE-391PA_67474297_4.jpg), landscape full side view; idx 17 is a data-plate close-up, idx 1 and 2 are portrait corner angles.
- Page fetch: live page fetched
- Open questions: Length is "approx. 39 ft" in the source; confirm exact length

### 2006 Maxlite 25RS (feed 68003546)
- Fixed: Used the brief's "trailer" as travel-trailer. No description written because there is no source text; no specs guessed.
- Sources: Title, type, price, feed ID: audit and brief. Specs, features, description, video: none.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (477-inv_2006-MAXLITE-25RS_68003546_5.jpg), only landscape photo; full side view with awning out.
- Page fetch: NOT FETCHED: https://thervfarm.ca/items/itemid/68003546/2006-MAXLITE-25RS/ returned HTTP 410 Gone (rvfarm.ca mirror also 410)
- Open questions: Live detail page returns HTTP 410 Gone: unit may be sold or removed. Confirm availability first; No specs or description available; collect length, weights, sleeps, slides and floorplan from the unit

### 2006 Northlander 2 Bedroom 12x40 (feed 67644139)
- Fixed: Removed "!!" title decoration and financing lines. Rewrote description. Note: the page category is Park Model; the brief and source overview both say mobile home.
- Sources: Features, relocation wording: live page. Size from model name. Price, title: audit.
- Photos: 3 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 3 (432-inv_2006-Northlander-2-Bedroom-12X40_67644139_3.jpg), only exterior shot (a 4-photo collage of the front and sides); idx 1 and 2 are interior collages.
- Page fetch: live page fetched
- Open questions: Type call: source title and overview say "Mobile Home" while the category says Park Model; kept mobile-home. Confirm; Dimensions 12x40 come from the model name, not a measured spec; Relocation cost and arrangements; Photos are 1024 px and each file is a collage of several shots; better single photos needed

### 2006 Sunset Creek 298BH (feed 68109072)
- Fixed: Audit notes this unit is the 32nd page, missing from inventory.xml. Removed "!!" title and promo lines. Rewrote description.
- Sources: Specs, features, video: live page. Price used: audit/brief. Feed ID: audit.
- Photos: 14 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 14 (503-inv_2006-SUNSET-CREEK-298BH_68109072_14.jpg), only landscape photo; clear full side view; idx 4 to 6 are bathroom and bed interiors.
- Page fetch: live page fetched
- Open questions: PRICE CONFLICT: audit and brief say $4,900, live page and live Pre-Owned list show $14,900 CAD. Confirm the real price; Length and weights not given

### 2007 Hy-Line 39 (feed 39591074)
- Fixed: Removed "Free storage", "Free winterizing", "1st payment on us" and "Limited-time offer" lines. Fixed "maintainance" typo (line dropped). Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 15 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 4 (317-inv_2007-HY-LINE-39_39591074_4.jpg), only landscape photo; full side elevation with entry doors; the other three are portrait corner angles.
- Page fetch: live page fetched
- Open questions: GVWR is given only as 3,178 kg; kept out of the lbs field

### 2008 K-Z Sportsmen S245RL2 (feed 39067962)
- Fixed: Removed "!!" title, promo lines (free delivery, storage, first payment). Rewrote description. VIN on the page was not carried into the JSON (no field for it).
- Sources: Specs, features, video: live page. Price used: audit/brief.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (302-inv_2008-K-Z-SPORTSMEN-S245RL2_39067962_5.jpg), landscape full side view with awning out; idx 16 is a sticker close-up.
- Page fetch: live page fetched
- Open questions: Type: the brief calls it a trailer; the live page heading says "Lightweight Fifth Wheel" and photos show a fifth-wheel nose. Set to fifth-wheel. Confirm; PRICE CONFLICT: audit and brief say $5,900, live page shows $4,900; Length given only as "approx. 26-27 ft"; confirm exact

### 2011 KZ Stone Ridge D3255PX3 (feed 33878421)
- Fixed: Fixed year conflict (kept 2011). Fixed make "KZ RV" to "KZ" and moved Stone Ridge to series. Rewrote description.
- Sources: Specs, features, video: live page. Price, year conflict: audit.
- Photos: 18 kept, 2 excluded (1 400x0 thumbnail; 1 lower-resolution unnumbered copy of the main photo (141-inv_2011-K-Z-Stone-Ridge_33878421.jpg 1080x1080); 0 exact duplicates). Hero: idx 8 (158-inv_2011-K-Z-Stone-Ridge_33878421_8.jpg), no landscape exterior exists (idx 11 is an interior); idx 8 is the clearest full-length exterior side view, portrait.
- Page fetch: live page fetched
- Open questions: Year: title says 2011, audit says feed specs said 2010. Live page specs now say 2011. Check the VIN; Live Pre-Owned list showed this unit at $22,900; the detail page and audit show $18,000. Confirm price; Type: source calls it a "Trailer" category; set to fifth-wheel from the model and front-bedroom layout. Confirm

### 2011 Zinger ZT250SB (feed 67705020)
- Fixed: Removed "!!" title and quoted marketing fragments. Rewrote description.
- Sources: Features, video: live page. Price, title: audit.
- Photos: 14 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 4 (460-inv_2011-ZINGER-ZT250SB_67705020_4.jpg), no landscape photo exists; idx 4 is the clearest full-length exterior (door side), portrait.
- Page fetch: live page fetched
- Open questions: Length and slide count not given; GVWR is given only in kg

### 2012 Jayco Jay Feather Ultra Lite Select X19H (feed 37610459)
- Fixed: Fixed year conflict (kept title year 2012). Moved series. Removed "Free delivery within 100 km", free storage and financing lines. Rewrote description.
- Sources: Specs, features, video: live page. Year conflict: audit and live page.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (270-inv_2012-JAYCO-JAY-FEATHER-ULTRA-LITE-SELECT_37610459_5.jpg), no landscape photo exists; idx 5 is a full side view with tent ends out, portrait.
- Page fetch: live page fetched
- Open questions: Year: title says 2012, live specs table says 2010. Used 2012 (the VIN on the page has a model-year character that reads as 2012). Confirm; Category on page is "Tent Trailer"; set to hybrid per brief

### 2013 Forest River Sabre SRT260RLS (feed 67137840)
- Fixed: Removed "!!" title, "luxury" wording and financing lines. Moved Sabre to series. Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 18 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 4 (406-inv_2013-FOREST-RIVER-SABRE-SRT260RLS_67137840_4.jpg), landscape full side view with awning out; first indexed photo (1) is a front corner angle.
- Page fetch: live page fetched
- Open questions: Length is "approx. 27 ft" in the source; confirm exact

### 2014 Coachmen Maple Leaf Edition 322RLDS (feed 67137629)
- Fixed: Split series from model. Removed "!!" title and financing lines. Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 17 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (388-inv_2014-COACHMEN-MAPLE-LEAF-EDITION-322RLDS_67137629_5.jpg), landscape full side view with awning out; idx 2 to 4 are corner angles.
- Page fetch: live page fetched
- Open questions: Model number: page "Model" field says only "Maple Leaf Edition"; 322RLDS taken from the title; Length is "approx. 35 ft"; confirm exact

### 2015 Coachmen Apex 269RBSS (feed 40302349)
- Fixed: Fixed model 288BHS to 269RBSS. Removed free storage/winterizing/first-payment promo lines. Rewrote description.
- Sources: Specs, features, video: live page. Model fix: audit and title.
- Photos: 19 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 5 (354-inv_2015-COACHMEN-APEX-269RBSS_40302349_5.jpg), landscape full side view with awning out; idx 6 is a storage bay and idx 18 a data plate.
- Page fetch: live page fetched
- Open questions: Model fixed from "288BHS" (feed) to 269RBSS (title, listing text, VIN plate photo). Confirm; Length and dry weight not given; GVWR given only in kg

### 2016 Forest River Flyte 3150K (feed 68003706)
- Fixed: Make is listed as Forest River; moved Flyte to series. Removed "!!" title, bullet-dot slogans and "contact us" line. Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 2 (490-inv_2016-FLYTE-3150K_68003706_2.jpg), no landscape photo exists; idx 2 is the first indexed photo and a clear front three-quarter exterior, portrait.
- Page fetch: live page fetched
- Open questions: Length, slides and weights not given

### 2016 Forest River Salem 26T (feed 40120742)
- Fixed: Moved Salem to series. Removed free storage/winterizing/first-payment lines and fixed "maintainance" (line dropped). Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 15 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 2 (331-inv_2016-FOREST-RIVER-SALEM-26T_40120742_2.jpg), no landscape photo exists; idx 2 is a clear front three-quarter exterior showing the Salem badge, portrait.
- Page fetch: live page fetched
- Open questions: Length is "approx. 26-27 ft"; confirm exact

### 2016 Palomino Puma 38PTB (feed 67681183)
- Fixed: Fixed misfiled category (Park Model to destination-trailer). Removed "Spacious Family Travel Trailer" hype, financing line. Rewrote description.
- Sources: Specs, features, video: live page. Price used: audit/brief.
- Photos: 19 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 30 (437-inv_2016-PALOMINO-PUMA-38PTB_67681183_30.jpg), landscape full side view; idx 26 is a decal/data-plate close-up.
- Page fetch: live page fetched (twice, second fetch for the video link)
- Open questions: Category: listed as Park Model on the old site but it is a destination trailer; type set per brief; PRICE CONFLICT: audit and brief say $15,900, live page and Pre-Owned list show $14,900; Length is "approx. 38 ft"; confirm exact

### 2016 Crossroads Sunset Trail 32RL (feed 66522140)
- Fixed: Split series from model; make is Crossroads. Removed "luxury" wording and financing lines. Rewrote description.
- Sources: Specs, features, video: live page. Price, title: audit.
- Photos: 15 kept, 2 excluded (1 400x0 thumbnail; 1 homepage 940x788 crop; 0 exact duplicates). Hero: idx 43 (363-inv_2016-SUNSET-TRAIL-32RL_66522140_43.jpg), landscape full side view with awning and outdoor kitchen open; idx 53 is an outdoor-kitchen close-up.
- Page fetch: live page fetched
- Open questions: Length is "approx. 35 ft"; confirm exact

### 2017 Heartland Breckenridge Lakeview 441QB (feed 35118627)
- Fixed: Filled blank make/model (Heartland, Breckenridge, Lakeview 441QB). Removed "For Sale", "stunning", "Don't miss out" hype and the disclaimer shouting. Rewrote description. Fixed misfiled category.
- Sources: Specs, features, video: live page. Make/model fix: title and audit. Price used: audit/brief.
- Photos: 24 kept, 2 excluded (1 400x0 thumbnail; 1 lower-resolution unnumbered copy of the main photo (177-inv_2017-Heartland-Breckenridge-Lakeview-441_35118627.jpg 720x720); 0 exact duplicates). Hero: idx 3 (195-inv_2017-Heartland-Breckenridge-Lakeview-441_35118627_3.jpg), no landscape file exists; idx 3 is the first full-length exterior side view, with the awning out (idx 1 is an interior), portrait.
- Page fetch: live page fetched
- Open questions: Make and model were blank in the feed and are filled from the title. Confirm; PRICE CONFLICT: audit and brief say $36,900; live page shows $34,900 as the sale price and $36,900 as dealer price; Category: listed as Park Model; set to destination-trailer per brief; Live page carries a disclaimer that the actual unit can differ from the description. Verify features on the lot

### 2017 Starcraft Launch Ultra Lite 24RLS (feed 34055074)
- Fixed: Split series from model. Removed "serene retreat" and "breeze" phrasing. Rewrote description.
- Sources: Features, video: live page. Price, title: audit.
- Photos: 16 kept, 2 excluded (1 400x0 thumbnail; 1 lower-resolution unnumbered copy of the main photo (160-inv_2017-Starcraft-Launch-Ultra-Lite-24RLS_34055074.jpg 420x420); 0 exact duplicates). Hero: idx 4 (171-inv_2017-Starcraft-Launch-Ultra-Lite-24RLS_34055074_4.jpg), fallback only: the 4 photos opened were two badge close-ups, a data label and an interior; idx 4 (living area) is the best of them. Photos 5 to 17 were not reviewed and probably contain an exterior.
- Page fetch: live page fetched
- Open questions: Photo for the 24 RLS shows an "Elite" badge; confirm exact model name; Dry weight is only "just over 5,300 lbs" in the source; get the exact figure; All photos are 526x526 px (low resolution); retake or source larger images


| Unit | Type | Price (CAD) | Photos kept | Specs found |
|---|---|---|---|---|
| 1994 Franklin 2 Bedroom 10x40 | mobile-home | $12,900 | 16 | Y |
| 2001 Travelaire 391PA | park-model | $5,900 | 18 | Y |
| 2006 Maxlite 25RS | travel-trailer | $4,900 | 16 | N |
| 2006 Northlander 2 Bedroom 12x40 | mobile-home | $79,900 | 3 | Y |
| 2006 Sunset Creek 298BH | travel-trailer | $4,900 | 14 | Y |
| 2007 Hy-Line 39 | park-model | $10,900 | 15 | Y |
| 2008 K-Z Sportsmen S245RL2 | fifth-wheel | $5,900 | 16 | Y |
| 2011 KZ Stone Ridge D3255PX3 | fifth-wheel | $18,000 | 18 | Y |
| 2011 Zinger ZT250SB | travel-trailer | $6,900 | 14 | Y |
| 2012 Jayco Jay Feather Ultra Lite Select X19H | hybrid | $10,900 | 16 | Y |
| 2013 Forest River Sabre SRT260RLS | travel-trailer | $10,900 | 18 | Y |
| 2014 Coachmen Maple Leaf Edition 322RLDS | travel-trailer | $12,900 | 17 | Y |
| 2015 Coachmen Apex 269RBSS | travel-trailer | $18,900 | 19 | Y |
| 2016 Forest River Flyte 3150K | travel-trailer | $13,900 | 16 | Y |
| 2016 Forest River Salem 26T | travel-trailer | $14,900 | 15 | Y |
| 2016 Palomino Puma 38PTB | destination-trailer | $15,900 | 19 | Y |
| 2016 Crossroads Sunset Trail 32RL | travel-trailer | $18,900 | 15 | Y |
| 2017 Heartland Breckenridge Lakeview 441QB | destination-trailer | $36,900 | 24 | Y |
| 2017 Starcraft Launch Ultra Lite 24RLS | travel-trailer | $18,900 | 16 | Y |
