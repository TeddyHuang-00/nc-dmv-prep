# Evaluation: yuki4266/nc-dmv-chinese — supplementary NC DMV question bank

Repo cloned 2026-09-27: `git clone --depth 1 https://github.com/yuki4266/nc-dmv-chinese` into
`/home/teddyhuang/.hermes/cache/scratch/ncdmv-bank-eval/repo` (single 3.6 MB `index.html`, pure frontend,
no backend, MIT claimed in LICENSE with a carve-out that the exam questions themselves belong to their
original compilers / authorities).

## Language
**Chinese only.** Every question stem, statement I/II, option, and explanation is written in Simplified
Chinese (`什么情况下须携带驾驶证？…`). No English text anywhere in the question data. The README and
site chrome are bilingual, but the questions are not. Numbers/units use Chinese phrasing (`限速 55 英里`,
`记 12 点`).

## Count
**140 questions** (`const DATA = [...]` array, lines 566-847 of index.html; verified by parsing the array:
140 entries, `n` = 1..140 unbroken). Catégorie spread over 17 topics (安全驾驶 15, 紧急故障 13,
酒精药物 12, 路权 12, 驾照制度 11, 超车 11, …).

## Format
- Two shapes: `mc` (95) — 4 explicit options A-D; and `io` (45) — "I/II" statement pairs with the fixed
  option set A=only I, B=only II, C=both, D=neither (exactly the NC written-test point system).
- Answer key: **explicit and complete** — every question carries `ans:"A|B|C|D"` (distribution A 30 / B 39 /
  C 32 / D 39 — no giveaway bias). No missing or null answers.
- Explanations: **all 140 questions have an `exp` field** (Chinese, HTML-formatted), naming the point tested,
  why the right answer is right, why each wrong option is wrong, plus mnemonic lines.
- Structure: JS object literal inside index.html (not JSON) — `{n, cat, type, q, [i, ii | opts], ans, exp, [img, cap]}`.
  11 questions (12, 25, 29, 31, 32, 33, 36, 38, 40, 41, 42) are figure-based; their figures **are** embedded in the
  same file as a `QIMG` base64 map (11 keys present), so they render and are answerable.
- Provenance: explanations cite "本卷（PDF 答案表）" — i.e. an old NC sample-test answer table, not the current
  handbook. Line references are internal ("见第 100 题").

## Quality assessment
- High effort on explanations; consistent, self-referential, 17 categories with a category index and
  sign-chart figures. Clean data model, no duplicate `n`, no missing options, no missing answers.
- Caveats: (1) Chinese-only; (2) the figures are base64-embedded (fine for the web page, awkward to extract);
  (3) some numbers come from an older answer key ("38% of accidental deaths involve alcohol") rather than the
  current handbook — one of the spot checks below shows the option set can be softer than handbook guidance.

## Cross-check vs official handbook (5 random questions, seed 42 → #7, #29, #58, #63, #71)
Handbooks: `/home/teddyhuang/.hermes/cache/scratch/ncdmv-research/handbook/*.md`. Extraction:
`sample.json` (first 20 verbatim) and the full parse of all 140 in this directory.

| # | Question (zh) | Repo answer | Handbook evidence | Result |
|---|---|---|---|---|
| 7 | 取回被撤销的驾照，必须做到… | C (both: get permission + pay restoration fee & re-apply) | 03-your-driving-privilege.md "Driver License Restoration": restoration fee ($83.50 / $167.25 DWI) "must be paid to the DMV before a suspension or revocation can be cleared" + reinstatement procedure | ✅ consistent |
| 29 | 图中表明哪辆车转弯正确？ | C (3 号车) | Figure question; figure is embedded (QIMG[29]); correct-turn semantics (turn into nearest lane) match handbook ch. 06 but the specific picture cannot be checked as text | ⚠️ not text-verifiable (figure present) |
| 58 | 在浓雾中驾驶，应该… | B (减慢速度) | 04-your-driving.md "Fog": "Reduce your driving speed and be alert… (turn on low beam headlights)" | ✅ consistent |
| 63 | 如果刹车失灵，应该… | C (both: 换低档 + 使用紧急刹车) | 04-your-driving.md "Brake Failure": "Shift into a lower gear … and apply the emergency brake" | ✅ consistent |
| 71 | 如果不得不在结冰的路面上停车，应该… | D (轻踩刹车) | 04-your-driving.md snow/ice: "keep your foot off the brake and let the engine slow the vehicle" — A/B/C are clearly wrong; D (light braking) is the only safe option offered, though the handbook's exact advice (engine braking) is not among the options | ✅/⚠️ consistent, option set weaker than handbook |

Agreement: **4 of 5 verified consistent with the handbook** (one of them by "least-wrong option"),
1 figure-dependent and not text-verifiable. No outright wrong answer found.

## Verdict
**SKIP** — question text is Chinese-only, so it cannot populate an English question bank without a full
translation pass (and the LICENSE disclaims copyright in the questions themselves; they are an old sample-test
translation). Answer keys and explanations are otherwise good enough to be worth re-mining later if a
localized/Chinese-language mode is ever added.

## Files
- `repo/` — shallow clone
- `parsed.json` — all 140 questions, structured (n, cat, type, q, i, ii, opts, ans, img, explanation length)
- `sample.json` — first 20 questions verbatim for eyeballing
- `REPORT_E.md` — this report

## Provenance note (found during the official-page side task)
The official ncdot.gov "Sample Test Questions" page is JS-only and not retrievable (live or archived
stubs), but a third-party mirror of the official 90-question sample test with its answer sheet was
found and saved verbatim to `official-sample.md`. The repo's Chinese questions match that PDF item-for-item
(Q1, Q2, Q7, Q8, Q9, Q21-23 …), i.e. the bank is a faithful translation of the old NC sample test.
Checking the sampled 5 against that original answer sheet: #7=C ✅, #29=C ✅, #58=B ✅, #63=C ✅, #71=D ✅ —
all agree. One extra check found a divergence: repo Q6 ("a driver will lose his license if convicted of…")
answers **D** (55-zone speeding >70), the original sheet answers **B** (passing a stopped school bus);
both are license-consequence offenses in NC law and the handbook text does not adjudicate between them.
