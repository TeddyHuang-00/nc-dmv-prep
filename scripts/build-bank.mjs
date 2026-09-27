// Builds src/data/questions.json by merging the authored chunks in src/data/chunks/.
// Regenerate with: pnpm bank:build   (no content edits beyond image-path reconciliation + exact-dupe drops)
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const outFile = path.join(root, "src", "data", "questions.json");

// Fixed chunk order = authored order of the merged bank.
const CHUNKS = ["license", "alcohol", "driving-rules", "safety-special", "signs", "sharing", "dmv"];
const TOPICS = ["license", "signs", "signals", "markings", "rules", "rightofway", "parking", "speed", "sharing", "alcohol", "safety", "emergencies", "special", "dmv"];

const source = {
  handbook: "North Carolina Driver's Handbook",
  edition: "Revised May 2025",
  url: "https://www.ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Documents/nc-driver-handbook.pdf",
};

const errors = [];
const fail = (msg) => errors.push(msg);

// --- load -------------------------------------------------------------------
const questions = [];
for (const batch of CHUNKS) {
  const file = path.join(root, "src", "data", "chunks", `${batch}.json`);
  if (!existsSync(file)) {
    fail(`missing chunk file: src/data/chunks/${batch}.json`);
    continue;
  }
  const chunk = JSON.parse(readFileSync(file, "utf8"));
  if (chunk.version !== 1 || !Array.isArray(chunk.questions)) {
    fail(`chunk ${batch}: expected {version:1, questions:[...]}`);
    continue;
  }
  questions.push(...chunk.questions);
}

// --- image-path reconciliation (.svg <-> .png, same basename) ---------------
const imageFixes = [];
for (const q of questions) {
  if (typeof q.image !== "string" || existsSync(path.join(publicDir, q.image))) continue;
  const alt = q.image.endsWith(".svg") ? q.image.replace(/\.svg$/, ".png")
    : q.image.endsWith(".png") ? q.image.replace(/\.png$/, ".svg") : null;
  if (alt && existsSync(path.join(publicDir, alt))) {
    imageFixes.push(`${q.id}: ${q.image} -> ${alt}`);
    q.image = alt;
  } else {
    fail(`${q.id}: image not found on disk: ${q.image}`);
  }
}

// --- duplicates -------------------------------------------------------------
// ponytail: identity = normalized text + image; sign questions share stems ("What does this sign mean?")
// but each points at a different sign, so text alone would drop 16 real questions.
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const identity = (q) => `${norm(q.question)} | ${q.image ?? ""}`;
const kept = new Map(); // identity -> id
const dropped = [];
const stems = new Map(); // normalized text -> [id, ...] (informational)
const seenIds = new Set();
const unique = [];
for (const q of questions) {
  if (seenIds.has(q.id)) { fail(`duplicate id: ${q.id}`); continue; }
  seenIds.add(q.id);
  const key = identity(q);
  const prior = kept.get(key);
  if (prior) {
    dropped.push(`${q.id} (duplicate of ${prior})`);
    continue;
  }
  kept.set(key, q.id);
  const stem = norm(q.question);
  if (!stems.has(stem)) stems.set(stem, []);
  stems.get(stem).push(q.id);
  unique.push(q);
}

// --- validation -------------------------------------------------------------
if (unique.length === 0 && errors.length === 0) fail("no questions loaded");
for (const q of unique) {
  const where = q.id ?? "(no id)";
  if (typeof q.id !== "string" || !q.id) fail(`${where}: missing id`);
  if (!TOPICS.includes(q.topic)) fail(`${where}: topic "${q.topic}" not in allowed list`);
  if (typeof q.question !== "string" || !q.question.trim()) fail(`${where}: empty question text`);
  if (!Array.isArray(q.choices) || q.choices.length < 3 || q.choices.length > 4)
    fail(`${where}: choices must have 3-4 entries (got ${q.choices?.length})`);
  else {
    if (q.choices.some((c) => typeof c !== "string" || !c.trim())) fail(`${where}: blank choice`);
    if (new Set(q.choices).size !== q.choices.length) fail(`${where}: duplicate choices`);
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.choices?.length ?? 0))
    fail(`${where}: answer ${q.answer} out of range`);
  if (!Number.isInteger(q.page) || q.page <= 0) fail(`${where}: page must be a positive int (got ${q.page})`);
  if (typeof q.explanation !== "string" || !q.explanation.trim()) fail(`${where}: empty explanation`);
  if (typeof q.sourceQuote !== "string" || !q.sourceQuote.trim()) fail(`${where}: empty sourceQuote`);
  else if (q.sourceQuote.length > 200) fail(`${where}: sourceQuote ${q.sourceQuote.length} chars (max 200)`);
  if (q.image !== null) {
    if (typeof q.image !== "string" || !q.image.startsWith("/signs/")) fail(`${where}: image must be null or /signs/...`);
    else if (!existsSync(path.join(publicDir, q.image))) fail(`${where}: image not found on disk: ${q.image}`);
  }
  if ((q.image === null) !== (q.imageAlt === null)) fail(`${where}: imageAlt null iff image null`);
  if (q.image !== null && (typeof q.imageAlt !== "string" || !q.imageAlt.trim())) fail(`${where}: empty imageAlt for a sign image`);
}

// --- report -----------------------------------------------------------------
const topicCounts = TOPICS.map((t) => [t, unique.filter((q) => q.topic === t).length]).filter(([, n]) => n > 0);
console.log(`bank: ${unique.length} questions from ${CHUNKS.length} chunks (${CHUNKS.join(", ")})`);
console.log(`topics: ${topicCounts.map(([t, n]) => `${t}=${n}`).join(" ")}`);
console.log(`ids: ${seenIds.size} unique`);
console.log(`images: ${unique.filter((q) => q.image).length} referenced, ${imageFixes.length} path fix(es)`);
for (const f of imageFixes) console.log(`  fix ${f}`);
console.log(`dupes: ${dropped.length} exact duplicate drop(s)`);
for (const d of dropped) console.log(`  drop ${d}`);
const stemGroups = [...stems.values()].filter((ids) => ids.length > 1);
if (stemGroups.length) console.log(`dupes: ${stemGroups.length} shared-stem group(s) kept (same text, different sign image): ${stemGroups.map((g) => g.join("/")).join(", ")}`);
const tokens = (q) => new Set(identity(q).split(" "));
const pairs = [];
for (let i = 0; i < unique.length; i++)
  for (let j = i + 1; j < unique.length; j++) {
    const a = tokens(unique[i]), b = tokens(unique[j]);
    const inter = [...a].filter((t) => b.has(t)).length;
    const sim = inter / (a.size + b.size - inter);
    if (sim >= 0.5) pairs.push([sim, unique[i].id, unique[j].id]);
  }
pairs.sort((x, y) => y[0] - x[0]);
console.log(`similar pairs (token overlap >= 0.5, top ${Math.min(10, pairs.length)}):`);
for (const [sim, a, b] of pairs.slice(0, 10)) console.log(`  ${sim.toFixed(2)}  ${a} / ${b}`);

// --- write ------------------------------------------------------------------
if (errors.length) {
  console.error(`\nBANK: FAIL (${errors.length} error(s))`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
await writeFile(outFile, JSON.stringify({ version: 1, source, questions: unique }, null, 2) + "\n");
console.log(`BANK: PASS (${unique.length} questions) -> src/data/questions.json`);
