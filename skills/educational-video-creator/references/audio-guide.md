# Audio Guide

Phase 4.5 详细步骤：TTS 音频生成、时间线重建、AudioLayer 集成。

## Step 1: Install Edge TTS

```bash
pip install edge-tts
```

Recommended voice: `zh-CN-XiaoxiaoNeural` (female, clear, natural). No API key required.

## Step 2: Generate TTS Audio

```bash
cd remotion_video
npx tsx ../scripts/generate-tts.ts <CompositionName>
# Options: --voice <name>  --rate <rate>  --output-dir <dir>
```

The script auto-extracts text from `NARRATION` in constants.ts, preprocesses it (remove markers, convert numbers to Chinese, handle abbreviations), and generates per-segment mp3 files to `public/audio/narration/`.

> ✅ **Checkpoint**: Update PROGRESS.md — mark `[x] TTS audio generated` and note segment count.

## Step 3: Rebuild Timeline

```bash
cd remotion_video
npx tsx ../scripts/rebuild-timeline.ts <CompositionName> --write
# Options: --audio-dir <dir>  --fps <N>  --gap <frames>  --pad <frames>  --transition <frames>
```

The script measures audio durations via ffprobe, recalculates SCENES/TOTAL_FRAMES/AUDIO_SEGMENTS with proper padding (PAD=15, GAP=6), and writes directly to constants.ts with `--write`.

**Timeline algorithm**: Each scene = PAD + segments(duration + GAP) + PAD. Scenes chain with TransitionSeries overlap = TRANSITION_DURATION.

> ✅ **Checkpoint**: Update PROGRESS.md — mark `[x] Timeline rebuilt` and `[x] AUDIO_SEGMENTS updated with real timing`.

## Step 4: Align Animation Keyframes to AUDIO_SEGMENTS

After timeline rebuild, visual animation keyframes must be re-aligned to the updated `AUDIO_SEGMENTS` timing:

1. **Already referencing AUDIO_SEGMENTS?** → No action needed. The code already reads from `AUDIO_SEGMENTS.sceneKey[N].startFrame`, which was updated by Step 3.

2. **Using hardcoded frame numbers?** → Replace with `AUDIO_SEGMENTS` references:
   ```tsx
   // Before (hardcoded — WRONG):
   const arrowStart = 30;
   // After (derived — CORRECT):
   const arrowStart = AUDIO_SEGMENTS.forces[0].startFrame;
   ```

3. **Decorative animations** (particles, ambient effects) that don't correspond to narration: scale proportionally:
   ```
   ratio = newDuration / oldDuration
   newKeyframe = Math.round(oldKeyframe * ratio)
   ```

> ✅ **Checkpoint**: Update PROGRESS.md — mark `[x] Animation keyframes aligned to AUDIO_SEGMENTS`.

## Step 5: Background Music

Search for free royalty-free BGM (YouTube Audio Library, Free Music Archive, Incompetech, etc.). Save to `public/audio/bgm.mp3`. Criteria: instrumental only, low energy, non-distracting, smooth loops.

## Step 6: Create AudioLayer Component

Create `src/<Composition>/components/AudioLayer.tsx`:

```typescript
import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { SCENES, AUDIO_SEGMENTS } from '../constants';

const SceneNarration: React.FC<{ sceneKey: string }> = ({ sceneKey }) => {
  const segments = AUDIO_SEGMENTS[sceneKey as keyof typeof AUDIO_SEGMENTS];
  if (!segments) return null;
  return (
    <>
      {segments.map((seg, i) => (
        <Sequence key={i} from={seg.startFrame} durationInFrames={seg.endFrame - seg.startFrame}>
          <Audio src={staticFile(seg.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

export const AudioLayer: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile('audio/bgm.mp3')} volume={0.12} loop />
      {Object.entries(SCENES).map(([key, scene]) => (
        <Sequence key={key} from={scene.start} durationInFrames={scene.duration}>
          <SceneNarration sceneKey={key} />
        </Sequence>
      ))}
    </>
  );
};
```

> ✅ **Checkpoint**: Update PROGRESS.md — mark `[x] AudioLayer component created`.

## Step 7: Integrate AudioLayer

**AudioLayer must be a SIBLING of `TransitionSeries`, NOT inside it.** TransitionSeries manages timing/opacity for children — placing AudioLayer inside breaks audio timing.

```typescript
<AbsoluteFill>
  <TransitionSeries>
    {/* scene sequences with transitions */}
  </TransitionSeries>
  <AudioLayer />  {/* ← OUTSIDE TransitionSeries */}
</AbsoluteFill>
```

## Step 8: Update Subtitle References

Replace hardcoded subtitle segments with shared `AUDIO_SEGMENTS`:

```typescript
// Before: <SubtitleSequence segments={[{ text: '...', startFrame: 60, endFrame: 130 }]} />
// After:
<SubtitleSequence segments={AUDIO_SEGMENTS.hook} />
```

## Step 9: Verify Sync

Run `npm start` and verify narration audio matches subtitle display timing for each scene.
