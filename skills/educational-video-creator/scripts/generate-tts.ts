/**
 * generate-tts.ts
 *
 * Extract subtitle text from a composition's source code, preprocess it,
 * and batch-generate TTS audio files using edge-tts.
 *
 * Usage (run from remotion_video/ directory):
 *   npx tsx <path>/generate-tts.ts <CompositionName>
 *
 * Options:
 *   --voice <name>      TTS voice (default: zh-CN-XiaoxiaoNeural)
 *   --rate <rate>        Speech rate (default: "-10%")
 *   --output-dir <dir>   Audio output directory (default: public/audio/narration)
 */

import { readFileSync, mkdirSync, existsSync, globSync } from "fs";
import { execFileSync } from "child_process";
import path from "path";
import { splitNarrationText, deriveSceneKey } from "./shared";

// ---------------------------------------------------------------------------
// Dependency check
// ---------------------------------------------------------------------------

try {
  execFileSync("edge-tts", ["--help"], { stdio: "pipe", timeout: 5000 });
} catch {
  console.error("edge-tts not found. Install: pip install edge-tts");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && idx + 1 < process.argv.length
    ? process.argv[idx + 1]
    : undefined;
}

const compositionName = process.argv[2];

if (!compositionName || compositionName.startsWith("--")) {
  console.error(
    "Usage: npx tsx generate-tts.ts <CompositionName> [--voice <name>] [--rate <rate>] [--output-dir <dir>]",
  );
  process.exit(1);
}

const voice = getArg("--voice") || "zh-CN-XiaoxiaoNeural";
const rate = getArg("--rate") || "-10%";
const outputDir = getArg("--output-dir") || "public/audio/narration";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Segment {
  sceneKey: string;
  index: number;
  text: string;
}

// ---------------------------------------------------------------------------
// 1. Extract subtitle text
// ---------------------------------------------------------------------------

const constantsPath = path.resolve(`./src/${compositionName}/constants.ts`);

if (!existsSync(constantsPath)) {
  console.error(`constants.ts not found: ${constantsPath}`);
  process.exit(1);
}

const constantsContent = readFileSync(constantsPath, "utf-8");

/**
 * Strategy 1: Extract from NARRATION object in constants.ts.
 * Splits each narration into segments by Chinese sentence-ending punctuation.
 */
function extractFromNarration(source: string): Segment[] | null {
  // Match NARRATION = { ... } with optional type annotation and optional "as const"
  const narrationMatch = source.match(
    /export\s+const\s+NARRATION\s*(?::[^=]*)?\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const)?/,
  );
  if (!narrationMatch) return null;

  const block = narrationMatch[1];
  const segments: Segment[] = [];

  // Parse each key: 'value' pair
  const entryRe = /(\w+)\s*:\s*(?:'([^']*)'|"([^"]*)")/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(block)) !== null) {
    const sceneKey = match[1];
    const fullText = match[2] || match[3];
    if (!fullText) continue;

    // Split on Chinese sentence-ending punctuation while keeping segments meaningful
    const parts = splitNarrationText(fullText);
    for (let i = 0; i < parts.length; i++) {
      const text = parts[i].trim();
      if (text.length > 0) {
        segments.push({ sceneKey, index: i, text });
      }
    }
  }

  return segments.length > 0 ? segments : null;
}

/**
 * Strategy 2: Extract from SubtitleSequence segments in TSX files.
 */
function extractFromTSX(): Segment[] | null {
  const tsxPattern = `./src/${compositionName}/scenes/**/*.tsx`;
  const files = globSync(tsxPattern).sort();
  if (files.length === 0) return null;

  const segments: Segment[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const basename = path.basename(file, ".tsx");

    // Derive scene key from filename, e.g. Scene01Hook -> hook, HookScene -> hook
    const sceneKey = deriveSceneKey(basename);

    // Match text fields in segment arrays: { text: '...', ... }
    const textRe = /text\s*:\s*(?:'([^']*)'|"([^"]*)")/g;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = textRe.exec(content)) !== null) {
      const text = match[1] || match[2];
      if (text && text.trim()) {
        segments.push({ sceneKey, index: idx, text: text.trim() });
        idx++;
      }
    }
  }

  return segments.length > 0 ? segments : null;
}

// Try extraction strategies in priority order
let extractedSegments = extractFromNarration(constantsContent);
let source = "NARRATION object in constants.ts";

if (!extractedSegments) {
  extractedSegments = extractFromTSX();
  source = "SubtitleSequence segments in TSX files";
}

if (!extractedSegments || extractedSegments.length === 0) {
  console.error(
    "ERROR: Could not extract subtitle text. " +
      "Expected either a NARRATION object in constants.ts or " +
      "SubtitleSequence segments in scene TSX files.",
  );
  process.exit(1);
}

const segments: Segment[] = extractedSegments;

console.log(`Text source: ${source}`);
console.log(`Extracted ${segments.length} segments\n`);

// ---------------------------------------------------------------------------
// 2. Text preprocessing
// ---------------------------------------------------------------------------

const DIGIT_MAP = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function numberToChinese(num: number): string {
  if (num < 0) return "负" + numberToChinese(-num);
  if (num <= 9) return DIGIT_MAP[num];
  if (num === 10) return "十";
  if (num < 20) return "十" + (num % 10 === 0 ? "" : DIGIT_MAP[num % 10]);
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return DIGIT_MAP[tens] + "十" + (ones === 0 ? "" : DIGIT_MAP[ones]);
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return DIGIT_MAP[hundreds] + "百";
    if (remainder < 10) return DIGIT_MAP[hundreds] + "百零" + DIGIT_MAP[remainder];
    return DIGIT_MAP[hundreds] + "百" + numberToChinese(remainder);
  }
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    if (remainder === 0) return DIGIT_MAP[thousands] + "千";
    if (remainder < 100) return DIGIT_MAP[thousands] + "千零" + numberToChinese(remainder);
    return DIGIT_MAP[thousands] + "千" + numberToChinese(remainder);
  }
  // For numbers >= 10000, fall back to digit-by-digit
  return String(num).split("").map((d) => DIGIT_MAP[Number(d)] || d).join("");
}

function preprocessText(text: string): string {
  let result = text;

  // Remove pause markers
  result = result.replace(/\[PAUSE\]/gi, "");
  result = result.replace(/\[BEAT\]/gi, "");
  result = result.replace(/\[\.{1,3}\]/g, "");

  // Remove emphasis markers: **text** -> text, *text* -> text
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
  result = result.replace(/\*([^*]+)\*/g, "$1");

  // Convert standalone digits to Chinese
  // Handle patterns like "100万" -> "一百万", "3个" -> "三个", "42种" -> "四十二种"
  result = result.replace(/(\d+)(万|亿|千|百|十|个|种|次|年|月|天|秒|分钟|小时|米|公里|吨|度)/g, (_, num, unit) => {
    return numberToChinese(Number(num)) + unit;
  });

  // English abbreviations: all-caps words -> hyphenated letters
  result = result.replace(/\b([A-Z]{2,})\b/g, (word) => {
    return word.split("").join("-");
  });

  // Remove special symbols
  result = result.replace(/[→×÷]/g, "");

  // Clean up extra whitespace
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

// ---------------------------------------------------------------------------
// 3. Batch TTS generation
// ---------------------------------------------------------------------------

mkdirSync(outputDir, { recursive: true });

interface TTSResult {
  segment: Segment;
  filename: string;
  success: boolean;
  error?: string;
}

function generateTTS(segment: Segment): TTSResult {
  const paddedIndex = String(segment.index).padStart(2, "0");
  const filename = `${segment.sceneKey}-seg${paddedIndex}.mp3`;
  const outputFile = path.join(outputDir, filename);
  const processedText = preprocessText(segment.text);

  // Use execFileSync (array form) to avoid shell injection
  try {
    execFileSync("edge-tts", [
      `--voice=${voice}`,
      `--rate=${rate}`,
      `--text=${processedText}`,
      `--write-media=${outputFile}`,
    ], { stdio: "pipe", timeout: 30000 });
    return { segment, filename, success: true };
  } catch (err: any) {
    const msg =
      err.stderr?.toString().trim() || err.message || "unknown error";
    return { segment, filename, success: false, error: msg.split("\n")[0] };
  }
}

// Run TTS generation sequentially
const results: TTSResult[] = [];
for (let i = 0; i < segments.length; i++) {
  results.push(generateTTS(segments[i]));
  if ((i + 1) % 5 === 0 || i === segments.length - 1) {
    console.log(`Progress: ${i + 1}/${segments.length} segments`);
  }
}

// ---------------------------------------------------------------------------
// 4. Summary
// ---------------------------------------------------------------------------

const successCount = results.filter((r) => r.success).length;
const failCount = results.filter((r) => !r.success).length;

// Count unique scenes
const sceneKeys = new Set(segments.map((s) => s.sceneKey));

console.log("\n========== TTS Generation Summary ==========");
console.log(`Scenes: ${sceneKeys.size}, Total segments: ${segments.length}`);
console.log(`Success: ${successCount}, Failed: ${failCount}`);
console.log(`Output: ${outputDir}/`);

if (failCount > 0) {
  console.log("\nFailed:");
  for (const r of results.filter((r) => !r.success)) {
    console.log(`  ${r.filename}: ${r.error}`);
  }
}

console.log("\nFiles:");
for (const r of results.filter((r) => r.success)) {
  console.log(`  ${r.filename}`);
}

if (failCount > 0) {
  process.exit(1);
}
