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
import { execSync } from "child_process";
import path from "path";

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
  // Match NARRATION = { ... } as const
  const narrationMatch = source.match(
    /export\s+const\s+NARRATION\s*=\s*\{([\s\S]*?)\}\s*as\s+const/,
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
 * Split narration text into subtitle-sized segments (5-20 chars ideally).
 * Splits on Chinese punctuation boundaries.
 */
function splitNarrationText(text: string): string[] {
  // Split on sentence-ending punctuation: 。！？；
  const sentences = text.split(/(?<=[。！？；])/);
  const result: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    // If sentence is short enough, keep as-is
    if (trimmed.length <= 25) {
      result.push(trimmed);
    } else {
      // Further split on comma/pause: ，、
      const clauses = trimmed.split(/(?<=[，、])/);
      let buffer = "";
      for (const clause of clauses) {
        if (buffer.length + clause.length <= 25) {
          buffer += clause;
        } else {
          if (buffer) result.push(buffer.trim());
          buffer = clause;
        }
      }
      if (buffer.trim()) result.push(buffer.trim());
    }
  }

  return result;
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

/**
 * Derive a scene key from a filename.
 * Examples:
 *   Scene01Hook.tsx -> hook
 *   Scene02Introduction.tsx -> introduction
 *   HookScene.tsx -> hook
 */
function deriveSceneKey(basename: string): string {
  // Remove "Scene" prefix with optional number
  let key = basename.replace(/^Scene\d*/, "");
  // Remove "Scene" suffix
  key = key.replace(/Scene$/, "");
  // Convert to camelCase lowercase first letter
  if (key.length > 0) {
    key = key[0].toLowerCase() + key.slice(1);
  }
  return key || basename.toLowerCase();
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

const NUMBER_MAP: Record<string, string> = {
  "0": "零",
  "1": "一",
  "2": "二",
  "3": "三",
  "4": "四",
  "5": "五",
  "6": "六",
  "7": "七",
  "8": "八",
  "9": "九",
  "10": "十",
  "100": "一百",
  "1000": "一千",
};

function preprocessText(text: string): string {
  let result = text;

  // Remove pause markers
  result = result.replace(/\[PAUSE\]/gi, "");
  result = result.replace(/\[BEAT\]/gi, "");
  result = result.replace(/\[\.{1,3}\]/g, "");

  // Remove emphasis markers: **text** -> text, *text* -> text
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
  result = result.replace(/\*([^*]+)\*/g, "$1");

  // Convert standalone digits to Chinese (basic mapping)
  // Handle patterns like "100万" -> "一百万", "3个" -> "三个"
  result = result.replace(/(\d+)(万|亿|千|百|十|个|种|次|年|月|天|秒|分钟|小时|米|公里|吨|度)/g, (_, num, unit) => {
    if (NUMBER_MAP[num]) return NUMBER_MAP[num] + unit;
    // For complex numbers, spell out digit by digit
    return num
      .split("")
      .map((d: string) => NUMBER_MAP[d] || d)
      .join("") + unit;
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

  // Escape double quotes and single quotes in text for shell
  const escapedText = processedText.replace(/"/g, '\\"');
  const cmd = `edge-tts --voice ${voice} --rate="${rate}" --text "${escapedText}" --write-media "${outputFile}"`;

  try {
    execSync(cmd, { stdio: "pipe", timeout: 30000 });
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
