/**
 * render-keyframes.ts
 *
 * Render keyframe screenshots for visual QA review.
 * Reads SCENES from a composition's constants.ts, computes keyframe numbers,
 * and batch-renders them via `npx remotion still`.
 *
 * Usage (run from remotion_video/ directory):
 *   npx tsx <path>/render-keyframes.ts <CompositionName>
 *
 * Options:
 *   --output-dir <path>        Output directory (default: /tmp/style-check)
 *   --frames-per-scene <2|4>   Frames per scene (default: auto — ≤10 scenes: 4, >10: 2)
 */

import { execSync, exec } from "child_process";
import { mkdirSync, existsSync, readdirSync, unlinkSync, readFileSync } from "fs";
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
    "Usage: npx tsx render-keyframes.ts <CompositionName> [--output-dir <path>] [--frames-per-scene <2|4>]",
  );
  process.exit(1);
}

const outputDir = getArg("--output-dir") || "/tmp/style-check";
const fpOverride = getArg("--frames-per-scene");

if (fpOverride && fpOverride !== "2" && fpOverride !== "4") {
  console.error("--frames-per-scene must be 2 or 4");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Import SCENES from the composition's constants.ts
// ---------------------------------------------------------------------------

interface SceneDef {
  start: number;
  duration: number;
}

interface Keyframe {
  scene: string;
  frame: number;
}

function getKeyframes(
  scenes: Record<string, SceneDef>,
  override?: string,
): Keyframe[] {
  const entries = Object.entries(scenes);
  const sceneCount = entries.length;
  const framesPerScene = override
    ? Number(override)
    : sceneCount > 10
      ? 2
      : 4;

  console.log(
    `Scenes: ${sceneCount}, frames per scene: ${framesPerScene}`,
  );

  const keyframes: Keyframe[] = [];

  for (const [name, scene] of entries) {
    if (framesPerScene === 4) {
      keyframes.push(
        { scene: name, frame: scene.start },
        {
          scene: name,
          frame: scene.start + Math.floor(scene.duration / 3),
        },
        {
          scene: name,
          frame: scene.start + Math.floor((scene.duration * 2) / 3),
        },
        {
          scene: name,
          frame: Math.max(scene.start, scene.start + scene.duration - 30),
        },
      );
    } else {
      keyframes.push(
        {
          scene: name,
          frame: scene.start + Math.floor(scene.duration / 3),
        },
        {
          scene: name,
          frame: scene.start + Math.floor((scene.duration * 2) / 3),
        },
      );
    }
  }

  return keyframes;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  const constantsPath = path.resolve(`./src/${compositionName}/constants.ts`);

  if (!existsSync(constantsPath)) {
    console.error(`constants.ts not found: ${constantsPath}`);
    process.exit(1);
  }

  // Parse constants.ts as text (avoids dynamic import which may execute
  // loadFont() and other browser-only code in a Node.js environment)
  const source = readFileSync(constantsPath, "utf-8");

  // Support both formats:
  // 1. SCENES: { name: { start, duration } }
  // 2. SCENE_FRAMES: { name: duration } (compute start from cumulative durations)
  let SCENES: Record<string, SceneDef>;

  const scenesMatch = source.match(
    /export\s+const\s+SCENES\s*(?::[^=]*)?\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const)?/,
  );
  const sceneFramesMatch = source.match(
    /export\s+const\s+SCENE_FRAMES\s*(?::[^=]*)?\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const)?/,
  );

  if (scenesMatch) {
    SCENES = {};
    const entryRe = /(\w[\w-]*)\s*:\s*\{\s*start\s*:\s*(\d+)\s*,\s*duration\s*:\s*(\d+)\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(scenesMatch[1])) !== null) {
      SCENES[m[1]] = { start: Number(m[2]), duration: Number(m[3]) };
    }
  } else if (sceneFramesMatch) {
    const transitionMatch = source.match(
      /export\s+const\s+TRANSITION_DURATION\s*=\s*(\d+)/,
    );
    const transitionFrames = transitionMatch ? Number(transitionMatch[1]) : 15;
    SCENES = {};
    const entryRe = /(\w[\w-]*)\s*:\s*(\d+)/g;
    let m: RegExpExecArray | null;
    let currentStart = 0;
    while ((m = entryRe.exec(sceneFramesMatch[1])) !== null) {
      const duration = Number(m[2]);
      SCENES[m[1]] = { start: currentStart, duration };
      currentStart += duration - transitionFrames;
    }
  } else {
    console.error(
      `SCENES or SCENE_FRAMES export not found in ${constantsPath}`,
    );
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  mkdirSync(outputDir, { recursive: true });

  // Clean up old screenshots
  const oldFiles = readdirSync(outputDir).filter((f) => f.endsWith(".png"));
  if (oldFiles.length > 0) {
    console.log(`Cleaning ${oldFiles.length} old screenshots...`);
    for (const f of oldFiles) {
      unlinkSync(path.join(outputDir, f));
    }
  }

  const keyframes = getKeyframes(SCENES, fpOverride);
  console.log(`\nTotal keyframes to render: ${keyframes.length}`);
  console.log(`Output directory: ${outputDir}\n`);

  const CONCURRENCY = 3; // Parallel renders (Chromium is memory-heavy)
  let successCount = 0;
  let failCount = 0;
  const failures: { scene: string; frame: number; error: string }[] = [];

  // Render keyframes in parallel batches
  for (let batchStart = 0; batchStart < keyframes.length; batchStart += CONCURRENCY) {
    const batch = keyframes.slice(batchStart, batchStart + CONCURRENCY);
    const promises = batch.map(
      (kf) =>
        new Promise<void>((resolve) => {
          const outputFile = path.join(
            outputDir,
            `scene-${kf.scene}-f${kf.frame}.png`,
          );
          const cmd = `npx remotion still --frame ${kf.frame} --output "${outputFile}" -- ${compositionName}`;
          console.log(`Rendering frame ${kf.frame} (${kf.scene})...`);

          const child = exec(cmd, { timeout: 60000 }, (err, _stdout, stderr) => {
            if (err) {
              failCount++;
              const msg = stderr?.trim() || err.message || "unknown error";
              failures.push({ scene: kf.scene, frame: kf.frame, error: msg });
              console.error(`  FAILED: ${msg.split("\n")[0]}`);
            } else {
              successCount++;
            }
            resolve();
          });
        }),
    );
    await Promise.all(promises);
    console.log(`Progress: ${Math.min(batchStart + CONCURRENCY, keyframes.length)}/${keyframes.length}`);
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------

  console.log("\n========== Render Summary ==========");
  console.log(`Total:   ${keyframes.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed:  ${failCount}`);

  if (failures.length > 0) {
    console.log("\nFailed frames:");
    for (const f of failures) {
      console.log(`  - ${f.scene} frame ${f.frame}: ${f.error.split("\n")[0]}`);
    }
  }

  // List generated files
  const files = readdirSync(outputDir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  console.log(`\nGenerated files (${files.length}):`);
  for (const f of files) {
    console.log(`  ${outputDir}/${f}`);
  }

  if (failCount > 0) {
    process.exit(1);
  }
})();
