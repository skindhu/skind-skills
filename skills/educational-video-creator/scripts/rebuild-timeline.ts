/**
 * rebuild-timeline.ts
 *
 * Measure generated TTS audio file durations, rebuild frame-based timeline,
 * and output updated constants.ts code (SCENES, TOTAL_FRAMES, AUDIO_SEGMENTS).
 *
 * Usage (run from remotion_video/ directory):
 *   npx tsx <path>/rebuild-timeline.ts <CompositionName>
 *
 * Options:
 *   --audio-dir <dir>      Audio directory (default: public/audio/narration)
 *   --fps <number>         Frame rate (default: 30)
 *   --gap <frames>         Gap between segments in frames (default: 6)
 *   --pad <frames>         Scene start/end padding in frames (default: 15)
 *   --transition <frames>  TransitionSeries overlap per transition (default: auto from TRANSITION_DURATION in constants.ts, or 0)
 *   --write                Write directly to constants.ts (default: stdout only)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, globSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { splitNarrationText, deriveSceneKey } from "./shared";

// ---------------------------------------------------------------------------
// Dependency check
// ---------------------------------------------------------------------------

try {
  execSync("ffprobe -version", { stdio: "pipe", timeout: 5000 });
} catch {
  console.error("ffprobe not found. Install ffmpeg: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)");
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

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

const compositionName = process.argv[2];

if (!compositionName || compositionName.startsWith("--")) {
  console.error(
    "Usage: npx tsx rebuild-timeline.ts <CompositionName> [--audio-dir <dir>] [--fps <n>] [--gap <n>] [--pad <n>] [--transition <n>] [--write]",
  );
  process.exit(1);
}

const audioDir = getArg("--audio-dir") || "public/audio/narration";
const FPS = Number(getArg("--fps") || "30");
const GAP_FRAMES = Number(getArg("--gap") || "6");
const SCENE_PAD = Number(getArg("--pad") || "15");
const transitionArg = getArg("--transition"); // resolved after constants.ts is read
const writeMode = hasFlag("--write");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SceneDef {
  start: number;
  duration: number;
}

interface AudioFile {
  sceneKey: string;
  segIndex: number;
  filename: string;
  durationMs: number;
}

interface SegmentTiming {
  text: string;
  file: string;
  startFrame: number;
  endFrame: number;
}

// ---------------------------------------------------------------------------
// 1. Read current SCENES from constants.ts
// ---------------------------------------------------------------------------

const constantsPath = path.resolve(`./src/${compositionName}/constants.ts`);

if (!existsSync(constantsPath)) {
  console.error(`constants.ts not found: ${constantsPath}`);
  process.exit(1);
}

const constantsContent = readFileSync(constantsPath, "utf-8");

// Parse SCENES object
function parseScenes(source: string): Record<string, SceneDef> {
  const scenesMatch = source.match(
    /export\s+const\s+SCENES\s*=\s*\{([\s\S]*?)\}\s*as\s+const/,
  );
  if (!scenesMatch) {
    console.error("Could not find SCENES export in constants.ts");
    process.exit(1);
  }

  const block = scenesMatch[1];
  const scenes: Record<string, SceneDef> = {};
  const entryRe = /(\w+)\s*:\s*\{\s*start\s*:\s*(\d+)\s*,\s*duration\s*:\s*(\d+)\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(block)) !== null) {
    scenes[match[1]] = {
      start: Number(match[2]),
      duration: Number(match[3]),
    };
  }

  return scenes;
}

const originalScenes = parseScenes(constantsContent);
const sceneKeys = Object.keys(originalScenes);

if (sceneKeys.length === 0) {
  console.error("No scenes found in SCENES export");
  process.exit(1);
}

// Parse old TOTAL_FRAMES
const totalFramesMatch = constantsContent.match(
  /export\s+const\s+TOTAL_FRAMES\s*=\s*(\d+)/,
);
const oldTotalFrames = totalFramesMatch ? Number(totalFramesMatch[1]) : 0;

// Parse TRANSITION_DURATION from constants.ts (CLI --transition overrides)
const transitionMatch = constantsContent.match(
  /export\s+const\s+TRANSITION_DURATION\s*=\s*(\d+)/,
);
const TRANSITION_FRAMES = Number(
  transitionArg ?? transitionMatch?.[1] ?? "0",
);

console.log(`Composition: ${compositionName}`);
console.log(`Scenes: ${sceneKeys.length} (${sceneKeys.join(", ")})`);
console.log(`Original TOTAL_FRAMES: ${oldTotalFrames}`);
console.log(`Audio directory: ${audioDir}`);
console.log(`FPS: ${FPS}, GAP: ${GAP_FRAMES} frames, PAD: ${SCENE_PAD} frames, TRANSITION: ${TRANSITION_FRAMES} frames\n`);

// ---------------------------------------------------------------------------
// 2. Scan audio files
// ---------------------------------------------------------------------------

if (!existsSync(audioDir)) {
  console.error(`Audio directory not found: ${audioDir}`);
  process.exit(1);
}

const audioFilePattern = /^(\w+)-seg(\d+)\.mp3$/;
const allFiles = readdirSync(audioDir).filter((f) => audioFilePattern.test(f)).sort();

if (allFiles.length === 0) {
  console.error(`No audio files matching <sceneKey>-seg<NN>.mp3 found in ${audioDir}`);
  process.exit(1);
}

console.log(`Found ${allFiles.length} audio files\n`);

// Group by scene key
const audioByScene = new Map<string, AudioFile[]>();

for (const filename of allFiles) {
  const match = filename.match(audioFilePattern)!;
  const sceneKey = match[1];
  const segIndex = Number(match[2]);

  audioByScene.set(sceneKey, [
    ...(audioByScene.get(sceneKey) || []),
    { sceneKey, segIndex, filename, durationMs: 0 },
  ]);
}

// Sort segments within each scene
for (const [, files] of audioByScene) {
  files.sort((a, b) => a.segIndex - b.segIndex);
}

// ---------------------------------------------------------------------------
// 3. Measure audio duration with ffprobe
// ---------------------------------------------------------------------------

console.log("Measuring audio durations...");

for (const [, files] of audioByScene) {
  for (const af of files) {
    const filePath = path.join(audioDir, af.filename);
    try {
      const output = execSync(
        `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
        { encoding: "utf-8", timeout: 10000 },
      ).trim();
      af.durationMs = Math.round(parseFloat(output) * 1000);
    } catch (err: any) {
      console.error(`  Failed to measure ${af.filename}: ${err.message}`);
      af.durationMs = 0;
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Extract segment texts (for AUDIO_SEGMENTS output)
// ---------------------------------------------------------------------------

/**
 * Try to get the original text for each segment.
 * Strategy: check NARRATION in constants, or SubtitleSequence in TSX.
 */
function extractTexts(): Map<string, string[]> {
  const texts = new Map<string, string[]>();

  // Try NARRATION object
  const narrationMatch = constantsContent.match(
    /export\s+const\s+NARRATION\s*(?::[^=]*)?\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const)?/,
  );
  if (narrationMatch) {
    const block = narrationMatch[1];
    const entryRe = /(\w+)\s*:\s*(?:'([^']*)'|"([^"]*)")/g;
    let match: RegExpExecArray | null;
    while ((match = entryRe.exec(block)) !== null) {
      const key = match[1];
      const fullText = match[2] || match[3];
      if (fullText) {
        texts.set(key, splitNarrationText(fullText));
      }
    }
    return texts;
  }

  // Try TSX files
  const tsxPattern = `./src/${compositionName}/scenes/**/*.tsx`;
  const files = globSync(tsxPattern).map(String).sort();
  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const basename = path.basename(file, ".tsx");
    const sceneKey = deriveSceneKey(basename);
    const segTexts: string[] = [];
    const textRe = /text\s*:\s*(?:'([^']*)'|"([^"]*)")/g;
    let m: RegExpExecArray | null;
    while ((m = textRe.exec(content)) !== null) {
      const t = m[1] || m[2];
      if (t) segTexts.push(t.trim());
    }
    if (segTexts.length > 0) texts.set(sceneKey, segTexts);
  }

  return texts;
}

const segmentTexts = extractTexts();

// ---------------------------------------------------------------------------
// 5. Rebuild timeline
// ---------------------------------------------------------------------------

console.log("\nRebuilding timeline...\n");

const newScenes: Record<string, SceneDef> = {};
const audioSegments: Record<string, SegmentTiming[]> = {};

let chainStart = 0;

for (const sceneKey of sceneKeys) {
  const files = audioByScene.get(sceneKey);
  const texts = segmentTexts.get(sceneKey) || [];

  if (!files || files.length === 0) {
    // Scene has no audio — keep original duration
    newScenes[sceneKey] = {
      start: chainStart,
      duration: originalScenes[sceneKey].duration,
    };
    chainStart += originalScenes[sceneKey].duration - TRANSITION_FRAMES;
    console.log(
      `  ${sceneKey}: no audio files, keeping original duration ${originalScenes[sceneKey].duration}`,
    );
    continue;
  }

  let currentFrame = SCENE_PAD;
  const segTimings: SegmentTiming[] = [];

  for (let i = 0; i < files.length; i++) {
    const af = files[i];
    const durationFrames = Math.ceil((af.durationMs / 1000) * FPS);
    const startFrame = currentFrame;
    const endFrame = currentFrame + durationFrames;

    const text = i < texts.length ? texts[i] : `(segment ${i})`;
    const paddedIndex = String(af.segIndex).padStart(2, "0");

    segTimings.push({
      text,
      file: `audio/narration/${af.sceneKey}-seg${paddedIndex}.mp3`,
      startFrame,
      endFrame,
    });

    currentFrame = endFrame + GAP_FRAMES;
  }

  const sceneDuration = currentFrame - GAP_FRAMES + SCENE_PAD;
  // Remove last GAP_FRAMES since there's no next segment, then add PAD

  newScenes[sceneKey] = { start: chainStart, duration: sceneDuration };
  audioSegments[sceneKey] = segTimings;
  chainStart += sceneDuration - TRANSITION_FRAMES;
}

// chainStart already subtracted TRANSITION_FRAMES after the last scene,
// but there is no transition after the final scene — add it back.
const newTotalFrames = chainStart + TRANSITION_FRAMES;

// ---------------------------------------------------------------------------
// 6. Deviation check
// ---------------------------------------------------------------------------

const deviationPct =
  oldTotalFrames > 0
    ? ((newTotalFrames - oldTotalFrames) / oldTotalFrames) * 100
    : 0;
const deviationStr = deviationPct >= 0 ? `+${deviationPct.toFixed(1)}%` : `${deviationPct.toFixed(1)}%`;

// ---------------------------------------------------------------------------
// 7. Generate output
// ---------------------------------------------------------------------------

// Build TypeScript code snippet
const codeLines: string[] = [
  "// --- REBUILT TIMELINE (generated by rebuild-timeline.ts) ---",
  "",
  "export const SCENES = {",
];

for (const key of sceneKeys) {
  const s = newScenes[key];
  const durationSec = (s.duration / FPS).toFixed(1);
  codeLines.push(`  ${key}: { start: ${s.start}, duration: ${s.duration} }, // ${durationSec}s`);
}

codeLines.push("} as const;");
codeLines.push("");
codeLines.push(`export const TOTAL_FRAMES = ${newTotalFrames}; // ${(newTotalFrames / FPS / 60).toFixed(1)} minutes`);
codeLines.push("");
codeLines.push("export const AUDIO_SEGMENTS = {");

for (const key of sceneKeys) {
  const segs = audioSegments[key];
  if (!segs || segs.length === 0) continue;

  codeLines.push(`  ${key}: [`);
  for (const seg of segs) {
    const escapedText = seg.text.replace(/'/g, "\\'");
    codeLines.push(
      `    { text: '${escapedText}', file: '${seg.file}', startFrame: ${seg.startFrame}, endFrame: ${seg.endFrame} },`,
    );
  }
  codeLines.push("  ],");
}

codeLines.push("} as const;");
codeLines.push("");

const codeSnippet = codeLines.join("\n");

// Build summary
const summaryLines: string[] = [
  "========== Timeline Rebuild Summary ==========",
  `Original TOTAL_FRAMES: ${oldTotalFrames}`,
  `New TOTAL_FRAMES: ${newTotalFrames} (change: ${deviationStr})`,
];

if (Math.abs(deviationPct) > 20) {
  summaryLines.push(
    `⚠️  Deviation > 20%. Consider adjusting TTS --rate.`,
  );
  if (deviationPct > 20) {
    summaryLines.push(`   Suggestion: increase --rate (e.g., "+5%" or "+10%") to shorten audio`);
  } else {
    summaryLines.push(`   Suggestion: decrease --rate (e.g., "-15%" or "-20%") to lengthen audio`);
  }
}

summaryLines.push("");
summaryLines.push("Scene changes:");
for (const key of sceneKeys) {
  const oldDur = originalScenes[key].duration;
  const newDur = newScenes[key].duration;
  const change = newDur - oldDur;
  const changeStr = change >= 0 ? `+${change}` : `${change}`;
  summaryLines.push(`  ${key.padEnd(18)} ${oldDur} → ${newDur} frames (${changeStr})`);
}

// ---------------------------------------------------------------------------
// 8. Output
// ---------------------------------------------------------------------------

if (writeMode) {
  // Replace SCENES, TOTAL_FRAMES in constants.ts, append AUDIO_SEGMENTS
  let updated = constantsContent;

  // Replace SCENES block
  updated = updated.replace(
    /export\s+const\s+SCENES\s*=\s*\{[\s\S]*?\}\s*as\s+const\s*;/,
    codeLines
      .slice(
        codeLines.indexOf("export const SCENES = {"),
        codeLines.indexOf("} as const;") + 1,
      )
      .join("\n") + ";",
  );

  // Replace TOTAL_FRAMES (handles both single-line numbers and multi-line expressions)
  updated = updated.replace(
    /export\s+const\s+TOTAL_FRAMES\s*=[\s\S]*?;/,
    `export const TOTAL_FRAMES = ${newTotalFrames}; // ${(newTotalFrames / FPS / 60).toFixed(1)} minutes`,
  );

  // Remove existing AUDIO_SEGMENTS if present
  updated = updated.replace(
    /\n*export\s+const\s+AUDIO_SEGMENTS\s*=\s*\{[\s\S]*?\n\}\s*as\s+const\s*;\n*/,
    "\n",
  );

  // Append AUDIO_SEGMENTS
  const audioSegmentsCode = codeLines
    .slice(codeLines.indexOf("export const AUDIO_SEGMENTS = {"))
    .join("\n");
  updated = updated.trimEnd() + "\n\n" + audioSegmentsCode + "\n";

  writeFileSync(constantsPath, updated, "utf-8");
  console.log(`✅ constants.ts updated: ${constantsPath}\n`);
}

// Always output code snippet and summary
if (!writeMode) {
  console.log(codeSnippet);
}

console.log(summaryLines.join("\n"));

// Exit with warning code if deviation > 20%
if (Math.abs(deviationPct) > 20) {
  process.exit(2);
}
