// Served under a sub-path on GitHub Pages; must match `basePath` in next.config.ts.
// Plain <img> tags are not rewritten by Next, so they prefix this manually.
export const BASE_PATH = "/nc-dmv-prep";

export const PRACTICE_ROUND = 20;
export const EXAM_SIZE = 25;
export const EXAM_PASS = 20;

// ponytail: pass mark scales with a short bank (302-question bank, 25-question exam, pass 20); at EXAM_SIZE it is exactly EXAM_PASS.
export const examPassMark = (total: number) => Math.ceil((total * EXAM_PASS) / EXAM_SIZE);
