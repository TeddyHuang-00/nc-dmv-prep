# REPORT — NC DMV Driver Handbook download, extraction & exam facts

*Agent run: 2026-09-27, ~18:00–18:20 EDT. All paths relative to `/home/teddyhuang/.hermes/cache/scratch/ncdmv-research/`.*

## Executive Summary

The current official NC Driver's Handbook PDF (108 pages, back cover "Revised May 2025", PDF modified 2026-09-10) was downloaded from ncdot.gov and its full text was extracted with `pdftotext -layout` into 7 per-chapter markdown files (34,108 words) with `[p.N]` printed-page markers at every page boundary. Official test facts were verified from ncdot.gov pages and DMV forms (7-day retake rule, $25.50 Level 1 permit, 5 a.m.–9 p.m. supervised window and 60-hour/10-night driving log); the 25-question / 80%-to-pass knowledge-test spec exists only on third-party sites, not on any official page found.

## Quick Overview

| Item | Value |
|---|---|
| PDF page count | **108** (`pdfinfo`; last printed page 106 + unnumbered back cover, chunk offset: printed page = physical page − 1) |
| Chapters extracted | **7** (`handbook/01-…` … `07-…`), 34,108 words total |
| Edition / year | **"Revised May 2025"** (statement on printed p.106 back cover). PDF metadata: CreationDate 2026-04-22, ModDate 2026-09-10, Producer Adobe PDF Library 18.0 |
| Source URL | https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Documents/nc-driver-handbook.pdf |
| Test spec numbers | 7 calendar-day retake; $25.50 Level 1 / Level 2 permit fee; Level 1 = 15–18 y/o, driver ed (30 h classroom + 6 h behind wheel), 5 a.m.–9 p.m. supervised for first 6 months, driving log ≥60 h (≥10 h night), hold permit 9 months for Level 2. Question count/passing score: **NOT FOUND officially** (25 q / 20 correct / 80% per third-party sites only) |
| Extraction quality | **Good.** `pdftotext -layout` on all 108 pages; 0 suspicious/garbage lines across all 7 chapter files; page markers continuous and contiguous (8–102); no fallback extractor needed |

## Deep Dive

### 1. Handbooks — locating the current edition

- `pdfinfo` on the downloaded file: Title "DMV Driver Handbook", Author "North Carolina DMV", 108 pages, 7,283,104 bytes, not encrypted, AcroForm present.
- The official Handbooks index page https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/handbooks.aspx is JavaScript-rendered; the PDF links were confirmed instead via search results linking to the same official PDF URL, and by HTTP 200 on the direct download.
- NCDMV splits material into separate handbooks (CDL, motorcycle); **the "NC Driver Handbook" PDF is the official source of the Class C knowledge-test material** (knowledge test "covers traffic laws and safe-driving practice"; the traffic-signs test is fed by the separate regulatory-signs.pdf / warning-signs.pdf links on the Driver License Tests page). Handbooks are also announced as available "at any driver license office".
- Edition line quoted from the PDF itself, back cover (printed p.106): *"Motor vehicle laws and fees are subject to change by the North Carolina General Assembly. Revised May 2025. The North Carolina Driver Handbook is available online at NCDMV.gov by searching Driver Handbook."* — so the PDF currently served is the May-2025 revision, re-generated 2026-09/2026-04 per metadata; there is no newer edition visible on the site today.
- Spanish counterpart (official, not downloaded): https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Documents/driver-handbook-spanish.pdf (HTTP 200, Last-Modified 2026-05-12, 6,492,574 bytes).

### 2. Extraction method & quality

- `pdftotext -layout handbook.pdf handbook_layout.txt` (poppler ≥ installed at /usr/bin/pdftotext). Raw text = 4,326 lines / 249,013 bytes.
- Split script: the layout text is cut on form-feeds (109 chunks = 108 pages + trailing fragment); the first non-empty line of each page is the running header/footer which carries the **printed** page number (e.g. `8 Chapter 1 — Your License` or `Chapter 1 — Your License 9`); that header line is stripped, then `[p.N]` is inserted with N = printed number. Front matter (cover, letter, DMVdirectAccess, pp.1–7) and back matter (Notes pp.103–105, back cover p.106) contain no test content and were left out of the chapter files.
- Only `-layout` mode was needed; no chapter required the plain fallback, and no PyMuPDF/pdfplumber fallback was needed.
- Quality checks: word counts (see table below), page-marker continuity, heuristic scan for mojibake/garbage lines → **0 suspicious lines in all 7 files**. Known artifact: the textbook tables in Chapter 1 (identity documents, DACA, no-fee IDs, schedule of fees) extract in flat two-column form — readable but loses strict column alignment; noted here because question authoring from those tables should read carefully. Illustration captions in Chapter 5 (shop signs) appear as running text and are preserved; sign *images* themselves are of course not in the text layer (see signs.json from the sibling agent).

| Chapter file | Words | Page markers |
|---|---|---|
| 01-your-license.md | 7,719 | p.8–30 (23) |
| 02-alcohol-and-the-law.md | 948 | p.31–33 (3) |
| 03-your-driving-privilege.md | 2,020 | p.34–39 (6) |
| 04-your-driving.md | 16,450 | p.40–79 (40) |
| 05-signals-signs-and-pavement-markings.md | 2,239 | p.80–88 (9) |
| 06-sharing-the-road.md | 2,522 | p.89–95 (7) |
| 07-how-dmv-serves-you.md | 2,210 | p.96–102 (7) |

### 3. TOC.md

Written at `handbook/TOC.md`: chapter ↔ file ↔ printed and physical page ranges ↔ one-line topic summary, plus a per-chapter sub-topic list (taken from the handbook's own Table of Contents) that downstream question assignment can use, and the Chapter 5 title discrepancy (official TOC "Signals, Signs and Pavement Markings" vs running header "Signals and Signs").

### 4. exam_facts.md — official test facts with citations

Every fact carries its exact source. Highlights and their status:

- **(official)** Retake: "Applicants who do not pass the knowledge test or driving test for a regular Class C license may retake the test in seven calendar days." — Driver License Tests page.
- **(official)** Knowledge test description, languages ("Tests offered in different languages"), oral tests "upon request"; separate traffic-signs test; vision test also required.
- **(official)** Fees: Level 1 permit $25.50 (level1.aspx + handbook Schedule of Fees p.29); Level 2 $25.50. **No official standalone knowledge-test fee found.**
- **(official)** Appointment: handbook p.8 — appointments online at skiptheline.ncdot.gov "but an appointment is not necessary. Walk-ins also are accepted all day, or until capacity is reached."
- **(official)** Level 1 eligibility: 15–<18 (DL-214, handbook p.12; driver-ed 30 h classroom + 6 h behind-wheel; 14½ to enroll per level1.aspx); adults 18+ get a plain learner permit (handbook p.8; Licenses & Fees page).
- **(official)** Level 1 restrictions: supervised at all times, supervising driver 5+ years licensed seated beside; 5 a.m.–9 p.m. with supervising driver for first six months (any time after); hold 9 months for Level 2; no cell phone under 18 (G.S. 20-137.3); front seat only driver + supervising driver.
- **(official)** Driving log: ≥60 hours, ≥10 hours at night, signed by supervising driver, submitted with Level 2 application (handbook p.12; DL-4A adds "no more than 10 hours per week may count").
- **(secondary)** Knowledge test = 25 multiple-choice questions, 20 correct (80%) to pass, no time limit — 5 independent third-party sites agree, **no official source states it** (marked NOT FOUND officially in exam_facts.md).
- **(secondary)** Test languages English/Spanish/Hindi per epermittest (official wording only says "different languages").

### 5. What was NOT found / caveats

- Official question count / passing score: **NOT FOUND** on ncdot.gov (test spec itself is not published; only the 7-day retake rule is).
- Official knowledge-test fee in isolation: **NOT FOUND** (only the $25.50 permit fee is official).
- Official "Sample Test Questions" page (https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Pages/test.aspx, last modified 2018) exists but renders its content via JavaScript; extraction returned no question text (browser navigation also failed on the site's JS redirect). Content not retrieved.
- The Handbook index page HTML is JS-rendered — PDF URL confirmed by direct download + search-engine indexing of the same ncdot.gov PDF URL, not by scraping the index page links.

## Files written (full list, sizes)

| Path | Bytes |
|---|---|
| `handbook.pdf` | 7,283,104 |
| `handbook_layout.txt` (raw extraction; kept for re-splitting) | 249,013 |
| `err_layout.txt` (pdftotext stderr, non-fatal font warnings) | 823 |
| `handbook/01-your-license.md` | 54,615 |
| `handbook/02-alcohol-and-the-law.md` | 5,809 |
| `handbook/03-your-driving-privilege.md` | 14,164 |
| `handbook/04-your-driving.md` | 101,899 |
| `handbook/05-signals-signs-and-pavement-markings.md` | 15,679 |
| `handbook/06-sharing-the-road.md` | 15,341 |
| `handbook/07-how-dmv-serves-you.md` | 13,961 |
| `handbook/TOC.md` | 3,735 |
| `exam_facts.md` | 8,524 |
| `REPORT.md` (this file) | 9,359 |

*(Not created by this agent but present in the same directory: `candidates.txt`, `verify/` — sibling agent artifacts; untouched.)*
