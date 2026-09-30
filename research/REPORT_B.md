# REPORT_B — sign manifest, NC bank survey, exam-day logistics (2026-09-27)

## Executive Summary
A 42-entry road-sign manifest (`signs.json`) was assembled from Wikimedia Commons public-domain MUTCD
SVGs: **32 of 42 URLs were curl-verified to HTTP 200 with `image/svg+xml`** and real bytes downloaded for
31 of them, while the remaining 10 are flagged `verified: false` after Wikimedia's IP-level rate limiter
(HTTP 429) blocked the original-file fetch despite paced retries — their existence, license, and a
200px render were confirmed through the Commons API and thumbnail endpoint instead. In parallel, a
timeboxed GitHub survey found exactly one usable NC-specific question bank
(`yuki4266/nc-dmv-chinese`, MIT, ~140 Q&A), and an official-source logistics checklist (10 bullets,
ncdot.gov) covers documents, appointment rules, fee, tests, and retake policy.

## Quick Overview
| Item | Result |
|---|---|
| Signs in manifest | **42** (categories: 14 regulatory, 21 warning, 1 workzone, 1 railroad, 2 school, 2 guide, 1 NC-specific) |
| Curl-verified (200 + image/svg+xml, bytes size recorded) | **32** |
| Flagged `verified: false` (HTTP 429 at deadline) | **10** (listed below; existence + thumbnail render + PD license confirmed) |
| NOT SOURCED from required list | **none** — all 30+ required signs covered; "no entry" has no distinct US sign (R5-1 DO NOT ENTER used, noted) |
| Licenses | **all 42 = PD** (MUTCD federal works / PD-released files; verified per-file via Commons API) |
| Best bank | `yuki4266/nc-dmv-chinese` — **USE** (MIT code/explanation text, NC-specific, 140 Q&A) |
| Key logistics | bring identity + SSN + residency docs; appointment via skiptheline.ncdot.gov (confirm within 15 min); Level 1 permit **$25.50**; tests = knowledge + signs + vision; 7-day retake rule |

## Deep Dive

### 1. `signs.json` — verified Wikimedia Commons sign manifest
Path: `~/.hermes/cache/scratch/ncdmv-research/signs.json`

Stable URL form per entry: `https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>` (redirect),
`page` = the Commons file description page, `license` = per-file license from the Commons API
(all PD), `notes` = teaching hint for quiz-app use.

**Verification method (per task spec):** `curl` follow-redirect check per URL; success criteria =
final HTTP 200 + `image/` content type. Byte downloads (≥5 samples required; 31 saved): e.g.
Stop 1702 b, Yield 2142 b, Do Not Enter 2836 b, Wrong Way 2389 b, Speed Limit 3773 b,
Railroad Crossbuck 11690 b, Slippery When Wet 5888 b, Interstate shield 7416 b, NC 24 4333 b —
all saved under `verify/svg/` (31 files) with sizes recorded in `signs.json` (`size_bytes`).

**Rate-limit incident (honest record):** Wikimedia's CDN began returning `HTTP 429 ... Too many
requests … use thumbnail images` for bulk original-file fetches from this IP (IPv6 first, then IPv4).
Retries were paced (sleep 2 s, backoff 5 s / 15 s) and IPv4 was preferred; that recovered the 32
verified entries (evidenced in `verify/curl_results*.txt`, `verify/status.tsv`,
`verify/status_final.tsv`, `verify/final_results.tsv`). The 10 below stayed 429 through the deadline
and are flagged `"verified": false` with a `verify_note`; each was confirmed via the Commons API
(`imageinfo` returns a real upload URL + size) and a 200px thumbnail render returned
`HTTP 200 image/png` (bytes in `verify/thumbs/`).

| Flagged entry | File | Evidence |
|---|---|---|
| Minimum Speed | `Minimum Speed 50.svg` | API exists (10 655 b) + thumb 200 (7 415 b) |
| Divided Highway Begins | `MUTCD_W6-1.svg` | API exists + thumb 200 (7 904 b) |
| Divided Highway Ends | `MUTCD_W6-2.svg` | API exists + thumb 200 (7 910 b) |
| Two-Way Traffic | `MUTCD_W6-3.svg` | API exists + thumb 200 (3 586 b) |
| Railroad Advance Warning | `MUTCD_W10-1.svg` | API exists + thumb 200 (16 184 b) |
| Bicycle Crossing | `MUTCD_W11-1.svg` | API exists + thumb 200 (10 993 b) |
| Pedestrian Crossing | `MUTCD_W11-2.svg` | API exists + thumb 200 (7 159 b) |
| Deer Crossing | `MUTCD_W11-3.svg` | API exists + thumb 200 (6 754 b) |
| Road Work | `MUTCD_W20-1.svg` | API exists + thumb 200 (8 325 b) |
| School Crossing | `MUTCD Sign Assembly - S1-1 with W16-7PL.svg` | API exists + thumb 200 (11 565 b) |

**Visual QA (correct sign for each filename):** all downloadable bytes were rendered
(`rsvg-convert` via ImageMagick) into a labeled 41-tile montage `verify/montage_final.png` and a
7-tile disambiguation montage `verify/montage_disambig.png`. Every tile matched its label, with one
correction made in the process: **MUTCD R3-3 is the "NO TURNS" word sign**, not a No-U-Turn symbol —
so the manifest carries `No Turns` = `MUTCD_R3-3.svg` and `No U-Turn` = `MUTCD_R3-4.svg`
(the symbol sign, curl-verified 200 / 1481 b in run 1 and visually confirmed).

**Candidates that did not resolve (404; dropped, alternates kept):** `MUTCD_R2-4P.svg`,
`MUTCD_W7-2.svg`, `MUTCD_S2-1.svg`, `NC-24.svg`, `North_Carolina_24.svg`,
`North Carolina Highway 24.svg`. Required signs all remain covered by the kept files.

**NC-specific:** `NC 24.svg` — North Carolina diamond state route marker (curl-verified 200, 4 333 b);
no other NC-specific sign files found on Commons (NC uses standard MUTCD designs).

### 2. `existing_banks.md` — timeboxed GitHub survey (full detail in that file)
Queries (api.github.com/search/repositories, 2026-09-27):
`north+carolina+dmv` (7), `dmv+quiz` (44), `driving+test+questions` (121), `topic:dmv` (49),
`north+carolina+permit+test` (0), `dmv+practice+test+json` (0).
- **USE** — https://github.com/yuki4266/nc-dmv-chinese — MIT (code/app/explanation text; question
  text disclaimed as reference), NC-specific, 140 Q&A Chinese bank in a single `index.html`;
  live at https://yuki4266.github.io/nc-dmv-chinese/
- DON'T USE — https://github.com/ullbergm/nc-cdl-trainer — MIT but CDL scope (562 questions,
  `data/questions.js`), off-topic for a learner permit
- DON'T USE — https://github.com/Ayyanchira/DMV_NC — NC data.json (~78 questions) but **no license**
- Commercial sites (driving-tests.org etc.): copyrighted, do-not-scrape; direct fetch of their ToS
  page returned HTTP 403 (bot wall) on 2026-09-27. Official NCDMV sample-questions page
  (https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/test.aspx) renders no
  questions to non-JS fetchers — browser-only.

### 3. `logistics.md` — exam-day checklist (10 bullets, official ncdot.gov sources)
Covers: document list (identity, SSN proof, residency — REAL ID needs two proofs; non-US-citizens:
I-20/DS-2019 + I-94 or passport stamp per DL-231 Table 5); appointment rules (7 days ahead,
confirm within 15 min, arrive 5–10 min early, ≥15 min late = cancelled); **$25.50** Level 1 permit
fee; tests at the office (knowledge, traffic signs, vision — driving skills later); 7-calendar-day
retake rule; permit mailed within 20 business days with temporary certificate.
NOT FOUND: explicit "SSN denial letter" acceptance in official lists (the rule is: if not eligible
for an SSN, provide legal-presence documentation); adult Class C learner-permit fee row
(the fee table is JS-rendered; Level 1 $25.50 verified instead).

## Files written (all under ~/.hermes/cache/scratch/ncdmv-research/)
- `signs.json` — deliverable 1 (42 entries)
- `existing_banks.md` — deliverable 2
- `logistics.md` — deliverable 3
- `REPORT_B.md` — this report
- Support: `candidates.txt`, `verify_signs.sh`, `verify_sweep4.sh`, `verify_final.sh`,
  `verify_thumbs.sh`, `build_manifest.py`, `build_manifest2.py` (authoritative builder),
  `final_assembly.py`, `validate_manifest.py`, `find_nc_shield.py`,
  `gh/probe_banks.py`, `gh/probe2.py`
- `verify/`: `curl_results.txt`, `curl_results2.txt`, `status.tsv`, `status_final.tsv`,
  `final_results.tsv`, `thumbs_results.tsv`, `licmeta.json`, `fees_page.html`, `tile_map.txt`,
  `not_sourced.json`, `sample_*.svg` (14), `svg/` (31 byte-verified SVGs), `thumbs/` (10 PNGs),
  `png/`, `png2/`, `montage_final.png`, `montage_disambig.png`, `montage_test.png`
- `gh/`: `yuki_index.html`, `ayyanchira_data.json`, `ullbergm_questions.js` (inspection copies)
- Sibling-owned files (`handbook.pdf`, `handbook/`, `TOC.md`, `exam_facts.md`, `REPORT.md`)
  were **not modified**.

## NOT FOUND / UNVERIFIED
1. 10 sign URLs carrying `"verified": false` (table above) — blocked by HTTP 429, not by absence.
2. "SSN denial letter" as an accepted NCDMV document — NOT FOUND in official lists.
3. Adult Class C learner-permit fee amount — NOT FOUND (JS-rendered table); Level 1 $25.50 verified.
4. Any cleanly-licensed NC learner-permit question bank other than `yuki4266/nc-dmv-chinese` — none found.
