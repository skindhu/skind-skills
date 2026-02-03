# Audio Generation Guide

Complete technical guide for adding narration and background music to educational videos.

## Table of Contents

- [Audio Generation Guide](#audio-generation-guide)
  - [Table of Contents](#table-of-contents)
  - [Directory Structure](#directory-structure)
  - [TTS Service: Edge TTS](#tts-service-edge-tts)
  - [TTS Generation Steps](#tts-generation-steps)
    - [Steps 1-2: 提取字幕文本 + 批量生成 TTS 音频](#steps-1-2-提取字幕文本--批量生成-tts-音频)
    - [Steps 3-6: 测量音频时长 + 重建时间线](#steps-3-6-测量音频时长--重建时间线)
    - [Step 6 (手动): Adjust Animation Keyframes](#step-6-手动-adjust-animation-keyframes)
  - [Background Music](#background-music)
  - [AudioLayer Component](#audiolayer-component)
  - [Integration into Main Composition](#integration-into-main-composition)
  - [Update Scene Subtitle References](#update-scene-subtitle-references)

---

## Directory Structure

```
remotion_video/
├── public/audio/
│   ├── bgm.mp3                    # Background music
│   └── narration/
│       ├── {scene}-seg{NN}.mp3    # Per-segment TTS audio
│       └── ...
├── scripts/
│   └── generate-audio.sh          # (Optional) Batch generation script
└── src/{VideoName}/
    ├── constants.ts               # Add AUDIO_SEGMENTS
    └── components/
        └── AudioLayer.tsx         # New audio layer component
```

---

## TTS Service: Edge TTS

Edge TTS is completely free with no API key required.

**Install:**
```bash
pip install edge-tts
```

**Recommended Chinese voice:**
- `zh-CN-XiaoxiaoNeural` — Female, clear and natural

**Features:**
- Speed adjustment: `--rate="-10%"` slightly slower, good for teaching
- Output format: mp3
- No rate limits or authentication needed

**Command example:**
```bash
edge-tts --voice zh-CN-XiaoxiaoNeural --text "文本内容" --write-media output.mp3
```

---

## TTS Generation Steps

### Steps 1-2: 提取字幕文本 + 批量生成 TTS 音频

使用 `generate-tts.ts` 脚本一次完成文本提取、预处理和 TTS 生成：

```bash
cd remotion_video
npx tsx <skill-scripts-path>/generate-tts.ts <CompositionName>
# 可选:
#   --voice <name>     TTS 声音 (默认 zh-CN-XiaoxiaoNeural)
#   --rate <rate>      语速 (默认 "-10%")
#   --output-dir <dir> 音频输出目录 (默认 public/audio/narration)
```

脚本会自动：
1. **提取字幕文本** — 优先从 `constants.ts` 的 `NARRATION` 对象提取，备选从 TSX 的 `SubtitleSequence segments` 中正则提取
2. **文本预处理** — 移除停顿/强调标记、数字转中文、英文缩写加连字符、移除特殊符号
3. **批量 TTS 生成** — 逐段调用 edge-tts（顺序执行），输出到 `public/audio/narration/<sceneKey>-seg<NN>.mp3`

**文本提取优先级:**
1. `constants.ts` 中有 `NARRATION` 对象 → 自动按中文标点分段（≤25 字/段）
2. TSX 文件中的 `SubtitleSequence segments` → 提取 `text` 字段
3. 均无 → 报错退出

### Steps 3-6: 测量音频时长 + 重建时间线

使用 `rebuild-timeline.ts` 脚本完成音频测量和时间线重建：

```bash
cd remotion_video
npx tsx <skill-scripts-path>/rebuild-timeline.ts <CompositionName>
# 可选:
#   --audio-dir <dir>   音频目录 (默认 public/audio/narration)
#   --fps <number>      帧率 (默认 30)
#   --gap <frames>      段间间隔帧数 (默认 6)
#   --pad <frames>      场景首尾填充帧数 (默认 15)
#   --transition <frames> 过渡重叠帧数 (默认自动从 constants.ts 的 TRANSITION_DURATION 读取，未定义则为 0)
#   --write             直接写入 constants.ts (默认只输出到 stdout)
```

脚本会自动：
1. **读取当前 SCENES** — 从 `constants.ts` 导入场景顺序和时长
2. **扫描音频文件** — 读取 `<sceneKey>-seg<NN>.mp3` 文件并按场景分组
3. **测量时长** — 调用 ffprobe 获取每个 mp3 的精确时长
4. **重建时间线** — 按算法（PAD → segments + GAP → PAD）计算新的帧号
5. **偏差检查** — 新旧总帧数偏差 > 20% 时警告并建议调整 `--rate`
6. **输出代码** — 生成可直接粘贴到 constants.ts 的 `SCENES`、`TOTAL_FRAMES`、`AUDIO_SEGMENTS` 代码片段

**时间线算法:**

```
FPS = 30, GAP_FRAMES = 6, SCENE_PAD = 15, TRANSITION_FRAMES = 20

For each scene (按 SCENES key 顺序):
  current_frame = SCENE_PAD
  for each segment:
    startFrame = current_frame
    endFrame = current_frame + ceil(durationMs / 1000 * FPS)
    current_frame = endFrame + GAP_FRAMES
  scene.duration = current_frame + SCENE_PAD

Chain scenes (考虑 TransitionSeries 过渡重叠):
  scenes[0].start = 0
  scenes[i].start = scenes[i-1].start + scenes[i-1].duration - TRANSITION_FRAMES

TOTAL_FRAMES = sum(durations) - (N-1) * TRANSITION_FRAMES
```

> **注意**: `TRANSITION_FRAMES` 自动从 `constants.ts` 的 `TRANSITION_DURATION` 读取。
> 如果项目不使用 `TransitionSeries`（即没有定义 `TRANSITION_DURATION`），则默认为 0，行为与之前一致。

使用 `--write` 模式可直接更新 constants.ts（替换 SCENES/TOTAL_FRAMES，追加 AUDIO_SEGMENTS）。

### Step 6 (手动): Adjust Animation Keyframes

当场景时长变化后，需按比例缩放动画关键帧：

```
ratio = newDuration / oldDuration
newKeyframe = Math.round(oldKeyframe * ratio)
```

Apply this to all frame-based animation values within the affected scene (e.g., `interpolate()` ranges, `spring()` delays, conditional frame checks).

---

## Background Music

Search online for free, royalty-free background music.

1. **Search keywords**: "free background music for video", "royalty free ambient music", "creative commons background music", "CC0 music"
2. **Recommended sources** (for reference):
   - YouTube Audio Library (requires YouTube Studio login)
   - Free Music Archive (freemusicarchive.org)
   - Incompetech (incompetech.com)
   - Other platforms offering CC0 or royalty-free licenses
3. **Select**: A 2-4 minute track that loops well
4. **Download**: MP3 format, save to `public/audio/bgm.mp3`

**Note**: Always verify the license terms before downloading to ensure free commercial use.

**Selection criteria:**
- Instrumental only (no vocals)
- Low energy, non-distracting
- Smooth loop transitions
- Matches the educational tone

---

## AudioLayer Component

Create `src/{VideoName}/components/AudioLayer.tsx`:

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
      {/* Background music - low volume, looping */}
      <Audio src={staticFile('audio/bgm.mp3')} volume={0.12} loop />
      {/* Scene narrations */}
      {Object.entries(SCENES).map(([key, scene]) => (
        <Sequence key={key} from={scene.start} durationInFrames={scene.duration}>
          <SceneNarration sceneKey={key} />
        </Sequence>
      ))}
    </>
  );
};
```

**Notes:**
- BGM volume at 0.12 ensures narration is clearly audible
- Each narration segment is wrapped in its own `Sequence` for precise timing
- `staticFile()` resolves paths relative to `public/`

---

## Integration into Main Composition

In the video's `index.tsx`, import and add the AudioLayer:

```typescript
import { AudioLayer } from './components/AudioLayer';

// Inside the composition return:
export const MyVideo: React.FC = () => {
  return (
    <>
      {/* Existing scene sequences */}
      <Sequence from={SCENES.hook.start} durationInFrames={SCENES.hook.duration}>
        <HookScene />
      </Sequence>
      {/* ... other scenes ... */}

      {/* Audio layer - add before or after scene sequences */}
      <AudioLayer />
    </>
  );
};
```

---

## Update Scene Subtitle References

After generating `AUDIO_SEGMENTS`, update each scene to reference the shared data instead of hardcoded segments:

```typescript
// Before:
<SubtitleSequence segments={[
  { text: '你有没有想过', startFrame: 60, endFrame: 130 },
  { text: '飞机是怎么飞起来的', startFrame: 140, endFrame: 220 },
]} />

// After:
<SubtitleSequence segments={AUDIO_SEGMENTS.hook} />
```

This ensures subtitle display timing always matches the TTS audio timing, since both reference the same data source.
