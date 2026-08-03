/**
 * Font Awesome subsetter.
 *
 * The full Free-Solid set ships ~1400 glyphs (147 KB woff2) and ~1400 CSS
 * rules (99 KB) for the ~140 icons this site actually uses. This script scans
 * the source for `fa-*` class names, keeps only those rules, and rewrites the
 * font to just their codepoints.
 *
 *   node scripts/subset-fontawesome.mjs
 *
 * Inputs  : vendor/fontawesome/fa.min.css + fa-solid-900.woff2 (full originals)
 * Outputs : public/fa/fa.min.css + public/fa/fa-solid-900.woff2 (subset)
 *
 * Re-run after adding a new icon — a missing glyph renders as a blank box, so
 * `npm run build` runs it automatically via prebuild.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const VENDOR = join(ROOT, "vendor/fontawesome");
const OUT = join(ROOT, "public/fa");
const SCAN_DIRS = ["app", "components", "lib"];
const SCAN_EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".css"]);

/** Every `fa-foo` token that appears anywhere in the source. */
function usedTokens() {
  const found = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (SCAN_EXT.has(extname(p))) {
        for (const m of readFileSync(p, "utf8").matchAll(/fa-[a-z0-9-]+/g)) found.add(m[0]);
      }
    }
  };
  for (const d of SCAN_DIRS) if (existsSync(join(ROOT, d))) walk(join(ROOT, d));
  return found;
}

const used = usedTokens();
const css = readFileSync(join(VENDOR, "fa.min.css"), "utf8");

/**
 * Walk the minified CSS brace-by-brace and pull out top-level blocks. A naive
 * `split("}")` looks like it works and does not: FA ships `@keyframes fa-beat{
 * 0%,90%{...}45%{...}}`, and splitting mid-keyframe leaves unbalanced braces
 * that make the parser swallow every icon rule after it — the whole sheet goes
 * dead while still looking plausible in a diff.
 */
function topLevelBlocks(source) {
  const blocks = [];
  let start = 0;
  let depth = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        blocks.push(source.slice(start, i + 1));
        start = i + 1;
      }
    }
  }
  return blocks;
}

/**
 * Keep a block when it is structural (@font-face, @keyframes, the .fa base
 * rules, sizing and animation helpers) or an icon rule whose class is used.
 * Icon rules look like `.fa-house:before{content:"\f015"}`.
 */
const kept = [];
const codepoints = new Set();
for (const block of topLevelBlocks(css)) {
  const selector = block.slice(0, block.indexOf("{"));
  const iconClasses = [...selector.matchAll(/\.(fa-[a-z0-9-]+):{1,2}before/g)].map((m) => m[1]);

  if (iconClasses.length > 0) {
    // Selector lists are shared between aliases (.fa-times:before,.fa-xmark:before)
    // — keep the block if any alias is used, and drop the unused aliases from
    // the selector so the rule stays as small as its actual use.
    const live = iconClasses.filter((c) => used.has(c));
    if (live.length === 0) continue;
    const body = block.slice(block.indexOf("{"));
    kept.push(live.map((c) => `.${c}:before`).join(",") + body);
    for (const m of body.matchAll(/content:\s*"\\([0-9a-f]+)"/gi)) codepoints.add(m[1]);
    continue;
  }

  kept.push(block);
}

const outCss = kept.join("");
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "fa.min.css"), outCss);

/**
 * Subset the font to the glyphs those rules reference.
 *
 * fontTools is a Python package and is NOT on Vercel's build image, so the
 * font step cannot be assumed to run in CI. The subset font and a manifest of
 * what is inside it are committed; CI reuses them as long as the icon set has
 * not changed. If someone adds an icon and CI cannot rebuild the font, the
 * build fails loudly rather than shipping a page of blank squares.
 */
const wanted = [...codepoints].sort();
const fontOut = join(OUT, "fa-solid-900.woff2");
const manifestPath = join(OUT, "subset.json");
const current = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8")).codepoints ?? []
  : [];
const upToDate =
  existsSync(fontOut) &&
  current.length === wanted.length &&
  current.every((c, i) => c === wanted[i]);

let fontNote;
if (upToDate) {
  fontNote = "font unchanged";
} else {
  try {
    execFileSync(
      "python3",
      [
        "-m", "fontTools.subset",
        join(VENDOR, "fa-solid-900.woff2"),
        `--unicodes=${wanted.map((c) => `U+${c.toUpperCase()}`).join(",")}`,
        "--flavor=woff2",
        "--layout-features=",
        "--no-hinting",
        "--desubroutinize",
        `--output-file=${fontOut}`,
      ],
      { stdio: "pipe" },
    );
    writeFileSync(manifestPath, JSON.stringify({ codepoints: wanted }, null, 2) + "\n");
    fontNote = "font subset";
  } catch (err) {
    if (!existsSync(fontOut)) {
      copyFileSync(join(VENDOR, "fa-solid-900.woff2"), fontOut);
      fontNote = "FULL font copied — install fonttools to subset";
    } else {
      console.error(
        "[fa-subset] Icon set changed but fontTools is unavailable, so the committed " +
          "font cannot be rebuilt — the new icons would render as blank boxes.\n" +
          "           Run `pip3 install --user fonttools brotli && npm run build` locally " +
          "and commit public/fa/.",
      );
      process.exit(1);
    }
  }
}

const kb = (p) => Math.round(statSync(p).size / 1024);
console.log(
  `[fa-subset] ${codepoints.size} icons · css ${kb(join(VENDOR, "fa.min.css"))}KB -> ${kb(join(OUT, "fa.min.css"))}KB · ` +
    `${fontNote} ${kb(join(VENDOR, "fa-solid-900.woff2"))}KB -> ${kb(fontOut)}KB`,
);
