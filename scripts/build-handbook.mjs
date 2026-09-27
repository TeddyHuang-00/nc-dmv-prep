// Builds src/data/handbook.json from research/handbook/*.md.
// Missing directory => empty handbook, so the app still builds and /handbook says "not installed yet".
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "research", "handbook");
const outFile = path.join(root, "src", "data", "handbook.json");

const chapters = [];
if (existsSync(srcDir)) {
  const files = (await readdir(srcDir)).filter((f) => f.toLowerCase().endsWith(".md") && f !== "TOC.md").sort(); // TOC.md is the chapter map, not a chapter
  for (const file of files) {
    const slug = file.replace(/\.md$/i, "");
    const md = await readFile(path.join(srcDir, file), "utf8");
    const title = (md.match(/^#\s+(.+?)\s*$/m)?.[1] ?? slug).trim();
    let html = await marked.parse(md);
    html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/, ""); // page renders the title itself
    html = html.replace(/\[p\.\s*(\d+)\]/g, '<a id="p$1"></a>'); // [p.23] -> anchor for /handbook/<slug>#p23
    chapters.push({ slug, title, html });
  }
}

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(chapters, null, 2) + "\n");
console.log(`handbook: ${chapters.length} chapter(s) from ${path.relative(root, srcDir)}`);
