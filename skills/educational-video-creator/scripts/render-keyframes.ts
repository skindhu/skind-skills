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

import { execSync } from "child_process";
import { mkdirSync, existsSync, readdirSync, unlinkSync } from "fs";
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
// Main (wrapped in async IIFE to support dynamic import in CJS mode)
// ---------------------------------------------------------------------------

(async () => {
  const constantsPath = path.resolve(`./src/${compositionName}/constants.ts`);

  if (!existsSync(constantsPath)) {
    console.error(`constants.ts not found: ${constantsPath}`);
    process.exit(1);
  }

  const mod = await import(constantsPath);

  // Support both formats:
  // 1. SCENES: { name: { start, duration } }
  // 2. SCENE_FRAMES: { name: duration } (compute start from cumulative durations)
  let SCENES: Record<string, SceneDef>;

  if (mod.SCENES && typeof mod.SCENES === "object") {
    SCENES = mod.SCENES;
  } else if (mod.SCENE_FRAMES && typeof mod.SCENE_FRAMES === "object") {
    const transitionFrames = mod.TRANSITION_FRAMES ?? 15;
    const entries = Object.entries(mod.SCENE_FRAMES) as [string, number][];
    SCENES = {};
    let currentStart = 0;
    for (const [name, duration] of entries) {
      SCENES[name] = { start: currentStart, duration };
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

  let successCount = 0;
  let failCount = 0;
  const failures: { scene: string; frame: number; error: string }[] = [];

  for (const kf of keyframes) {
    const outputFile = path.join(
      outputDir,
      `scene-${kf.scene}-f${kf.frame}.png`,
    );
    const cmd = `npx remotion still --frame ${kf.frame} --output "${outputFile}" ${compositionName}`;

    try {
      console.log(`Rendering frame ${kf.frame} (${kf.scene})...`);
      execSync(cmd, { stdio: "pipe" });
      successCount++;
    } catch (err: any) {
      failCount++;
      const msg =
        err.stderr?.toString().trim() ||
        err.message ||
        "unknown error";
      failures.push({ scene: kf.scene, frame: kf.frame, error: msg });
      console.error(`  FAILED: ${msg.split("\n")[0]}`);
    }
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
