---
name: educational-video-creator
description: "Create educational videos using Remotion with Kurzgesagt/回形针 style. Use when users want to: (1) create teaching or educational videos, (2) design video storyboards, (3) produce animated explainer videos, (4) build SVG-based animations for learning content, (5) visualize complex concepts with motion graphics, (6) make science/tech explainer videos, (7) create 可视化讲解视频 or 科普视频. Triggers on requests like '帮我做一个教学视频', 'create an explainer video about X', '制作科普动画', 'make a video explaining Y'. This skill requires remotion-best-practices skill for technical implementation."
allowed-tools: Read, Write, WebSearch, Bash(python3.11:*, npx:*, npm:*, node:*, ffprobe:*, edge-tts:*, mkdir:*, ls:*)
---

# Educational Video Creator

Create professional educational videos with Kurzgesagt/回形针 visual style using Remotion.

## Prerequisites

This skill requires **remotion-best-practices** for Remotion technical implementation.

**Check and install (MUST complete before Phase 1):**
```bash
# Check if already installed, install if not
npx skills list 2>/dev/null | grep remotion-best-practices || npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

Once installed, **read the remotion-best-practices skill** to load Remotion API details into context. This is essential — without it, Phase 4 code will have incorrect Remotion API usage.

**External dependencies (needed for Phase 4.5 audio generation):**
```bash
# ffmpeg (provides ffprobe for audio duration measurement)
brew install ffmpeg        # macOS
# apt install ffmpeg       # Linux

# edge-tts (Python TTS engine for narration generation)
pip install edge-tts
```

## Project Setup

This skill creates videos in a dedicated `remotion_video` subdirectory within the current workspace.

**First-time setup (recommended — non-interactive):**
```bash
# Create video project directory
mkdir -p remotion_video
cd remotion_video

# Initialize without interactive prompts
npm init -y
npm install remotion @remotion/cli @remotion/google-fonts @remotion/transitions react react-dom
npm install -D typescript @types/react

# Create minimal project structure
mkdir -p src public/audio/narration
```

Then create the required entry files:
- `src/Root.tsx` — Main composition registry
- `src/index.ts` — Remotion entry point with `registerRoot(Root)`
- `remotion.config.ts` — Remotion configuration
- `tsconfig.json` — TypeScript config

**Alternative (interactive — may block in automated environments):**
```bash
mkdir -p remotion_video && cd remotion_video
npx create-video@latest --blank
npm install
```

> **Note**: `npx create-video` may prompt for project name, package manager, etc. In CLI/automation contexts, use the non-interactive method above to avoid blocking.

**Existing project:**
```bash
cd remotion_video
npm install  # Ensure dependencies are installed
```

**Project structure:**
```
your-workspace/
├── remotion_video/           # Video project root
│   ├── src/
│   │   ├── Root.tsx          # Main composition registry
│   │   └── YourVideo/        # Video-specific components
│   │       ├── index.tsx
│   │       ├── scenes/
│   │       └── components/
│   ├── public/               # Static assets
│   └── package.json
└── ... (other workspace files)
```

## Quick Start

1. **Setup project** → create `remotion_video` directory if needed
2. Gather requirements → confirm topic, audience, duration
3. Write script → complete narrative with story arc and pacing
4. Create storyboard → break script into visual scenes with animation specs
5. Design visuals → apply style guide, create SVG components
6. Implement animations → code scenes in Remotion
7. Quality assurance → auto-check, auto-fix, auto-start preview

## ⚠️ Context Recovery Protocol

Every conversation turn may follow a context loss (compaction, new session). **Before doing ANY work:**

1. **Check** if `remotion_video/PROGRESS.md` exists
   - If YES → Read it completely to determine current phase and last completed step
   - If NO → This is a new project, proceed to Phase 1
2. **Read supporting files** referenced in PROGRESS.md (only if that phase is marked complete):
   - `remotion_video/script.md` (if Phase 1.5+ completed)
   - `remotion_video/storyboard.md` (if Phase 2+ completed)
   - `src/<Composition>/constants.ts` (if Phase 3+ completed — contains COLORS, SCENES, NARRATION, AUDIO_SEGMENTS)
3. **Verify** files listed in "Files Created" section actually exist on disk
4. **Resume** from the first unchecked item in the current phase

> Skipping this protocol causes repeated work or file corruption. Always run it first.

## Progress Tracking

Maintain a progress file at `remotion_video/PROGRESS.md` throughout execution:

1. **Create** the file at the start of Phase 1 using the template from [progress-template.md](assets/progress-template.md)
2. **Update** after completing each checkbox item — mark `[ ]` → `[x]` and add notes
3. **Update "Current State"** section whenever you change phases or steps
4. **Log decisions** in the Decisions table so they survive context loss
5. **Add every created file** to the "Files Created" section for recovery verification

## Workflow

### Phase 1: Requirements Gathering

> ⚠️ **First**: Complete the [Prerequisites](#prerequisites) section (install remotion-best-practices skill and read it). Then create `remotion_video/PROGRESS.md` from [progress-template.md](assets/progress-template.md) and fill in Project Info.

Before starting, confirm these essential details with the user:

- **Topic**: What concept/subject to explain?
- **Audience**: Who is watching? (children/adults, beginners/experts)
- **Language**: Chinese/English/other?
- **Duration**: Short (1-3min), Medium (3-5min), or Long (5-10min)?
- **Key points**: What must the viewer learn?

For detailed question templates, see [requirements-guide.md](references/requirements-guide.md).

### Phase 1.5: Script Writing

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 1.5 items as you complete them.

Write a complete narrative script before designing the storyboard. This phase focuses purely on **storytelling** — what to say and how to say it well — without worrying about visual specs, frame numbers, or animation parameters.

**IMPORTANT**: Write the FULL narration text — every word that will be spoken. Do NOT write summaries, bullet points, or placeholders. The script is the final spoken content.

The script must include:

1. **Core message** — one-line summary, learning objectives
2. **Narrative strategy** — apply techniques from script-and-narration.md:
   - Entry angle (question / scenario / challenge / story)
   - Core metaphor that runs through the entire video
   - Knowledge scaffolding order (what depends on what)
   - Emotional curve (curiosity → understanding → wonder → satisfaction)
3. **Full narration text** — complete word-for-word script for every chapter:
   - Include emphasis markers (**bold** for stress, *italic* for softer tone)
   - Mark pauses with `[.]` (short), `[..]` (medium), `[...]` (long), `[PAUSE]` or `[BEAT]` (dramatic) — see script-and-narration.md Part 3 for duration semantics
   - Add visual intents after each chapter (1-2 sentences describing what viewers should see — enough for Phase 2 to design scenes, but no animation specs)
4. **Pacing notes** — where to speed up, slow down, and pause
5. **Self-review** — run through the checklist in script-and-narration.md before presenting to user

Quality gate: Present the complete script to the user for approval. Do NOT proceed to Phase 2 until the user explicitly approves the narrative.

Why script first:
- Separates "what to tell" from "how to show" — two different creative activities
- LLM produces better narratives when not simultaneously calculating frame ranges
- Pure text is cheap to iterate; storyboard with animation specs is expensive to revise
- Users can easily review "is the story good?" without wading through technical details

**Output**: Save the approved script as `remotion_video/script.md`

See [script-and-narration.md](references/script-and-narration.md) for video structure templates, narrative techniques, writing techniques, and TTS notes.

### Phase 2: Storyboard Design

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 2 items as you complete them.

Convert the approved script into a production-ready storyboard. The script provides **what to say**; the storyboard defines **how to show it**.

Input: Completed script (approved in Phase 1.5)

Tasks:
1. Break script chapters into visual scenes (5-15 scenes)
2. Assign narration text from the script to each scene
3. Design visual layers for each scene (background / midground / foreground / UI)
4. Add frame-level animation specifications (spring, easing, timing)
5. Define visual-narration sync points
6. Plan the asset inventory (SVG components, colors, typography)

The cognitive load is much lower than creating everything from scratch — the narrative is already decided, so you only need to focus on visual execution.

**Output**: Save the completed storyboard as `remotion_video/storyboard.md` for design traceability and iteration reference.

See [storyboard-template.md](references/storyboard-template.md) for templates.
See [script-and-narration.md](references/script-and-narration.md) Part 4 for subtitle formatting and TTS notes.

### Phase 3: Visual Design

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 3 items as you complete them.

Apply the Kurzgesagt/回形针 style. Concrete steps:

1. **Choose color palette** — Select from [design-tokens.ts](assets/design-tokens.ts) Section 1 or create a custom palette matching the topic
2. **Create `constants.ts`** — Define `COLORS`, `TYPOGRAPHY`, `SCENES`, `NARRATION`, and estimated `AUDIO_SEGMENTS` following [design-tokens.ts](assets/design-tokens.ts) Section 3
3. **Set up fonts** — Use Remotion's `loadFont()` from `@remotion/google-fonts` (see [design-tokens.ts](assets/design-tokens.ts) Section 2 for reference)
4. **Create shared SVG components** — Build reusable visual elements (icons, illustrations, decorative elements) following [svg-components.md](references/svg-components.md)
5. **Design scene layouts** — Plan visual layers (background / midground / foreground / UI) per scene following [visual-principles.md](references/visual-principles.md)

Style principles:
- Flat design with subtle gradients
- Bold, saturated color palette
- Geometric shapes with rounded corners (rx/ry)
- Clean sans-serif typography

See [style-guide.md](references/style-guide.md) for complete visual standards.
See [visual-principles.md](references/visual-principles.md) for composition and layout.

### Phase 4: Animation Production

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 4 items as you complete them. Log key file paths in "Key files".

Implement scenes using Remotion:

1. Create SVG components for visual elements
2. Use `useCurrentFrame()` for all animations
3. Apply appropriate easing (spring for natural motion)
4. Add scene transitions

**Subtitle & narration rules (critical for Phase 4.5 compatibility):**
- All narration text **must** be stored in the `NARRATION` object in `constants.ts` — never hardcode text directly in scene TSX files
- Create an estimated `AUDIO_SEGMENTS` in `constants.ts` with approximate timing. Phase 4.5 will overwrite it with real audio-based timing
- Subtitle components **must** reference `AUDIO_SEGMENTS.sceneKey` — never use inline segment arrays with hardcoded frame numbers
- `AUDIO_SEGMENTS` 中的 `startFrame`/`endFrame` **必须使用场景本地帧号**（每个场景从 `SCENE_PAD`=15 开始），**不是全局帧号**。因为 AudioLayer 和 SubtitleSequence 都在场景的 `<Sequence>` 内部运行，`useCurrentFrame()` 返回的是本地帧号。如果使用全局帧号，后续场景的字幕会延迟或完全不显示
- This ensures `rebuild-timeline.ts --write` in Phase 4.5 can update timing without modifying any scene files

**Background rules (prevents transparent/checkerboard frames during transitions):**
- The main composition **must** have a persistent `<AbsoluteFill>` background layer (using `COLORS.background`) that sits behind all scenes and never participates in transitions
- Each scene component **must** also have its own solid background as the first child element
- During `fade()` transitions, both scenes have reduced opacity — without a persistent background, transparent frames appear as a checkerboard pattern in preview and black in renders
- See [animation-guide.md](references/animation-guide.md) "Preventing Transparent Frames" for the implementation pattern

**Visual richness rules (prevents PPT-like output):**
- 每个场景必须有至少一个 **非文字的视觉主体元素**（SVG 插画、图表、动画图形等）。纯文字标签 + 方块不是合格的视觉内容
- 流程图/因果链必须用 **图标或插画** 配合文字，不能只用纯色方块装文字。参考 [svg-components.md](references/svg-components.md) "Illustrated Flow Node" 模式
- 每个场景应有 **环境氛围层**（粒子、光晕、纹理等），参考 [style-guide.md](references/style-guide.md) Ambient Effects 章节
- SVG 插画应体现 Kurzgesagt 风格：圆角几何形状（rx/ry）、扁平化但有层次（多 path 叠加）、柔和渐变（linearGradient/radialGradient）、适当描边
- 参考 [visual-principles.md](references/visual-principles.md) "Show, Don't Tell" 原则：能用图示表达的概念不要用文字方块
- 参考 [scene-template.tsx](assets/scene-template.tsx) 中 ForceDiagramScene 的 SVG 飞机插画作为具象插画的最低质量标准

**Color rules (critical for Phase 5 style-scan compliance):**
- All colors **must** be referenced via the `COLORS` object from `constants.ts` (e.g., `COLORS.accent.rose`) — never write hex values directly in TSX files
- The only exception is `rgba()` for opacity variations (e.g., `rgba(0, 0, 0, 0.7)` for subtitle backgrounds)
- This prevents the common issue where style-scan reports dozens of "color not in approved palette" warnings

See [design-tokens.ts](assets/design-tokens.ts) Section 3 for the complete constants.ts structure (COLORS, SCENES, NARRATION, AUDIO_SEGMENTS, font loading).
See [svg-components.md](references/svg-components.md) for component patterns.
See [animation-guide.md](references/animation-guide.md) for timing and easing.

### Phase 4.5: Audio Generation

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 4.5 items as you complete them. Record audio file count.

完成动画编码后，生成视频音频并同步时间线：

1. **生成 TTS 音频** — 用 `generate-tts.ts` 从 NARRATION 提取文本生成 mp3
2. **重建时间线** — 用 `rebuild-timeline.ts --write` 根据实际音频时长更新 constants.ts
3. **调整动画关键帧** — 按 `newDuration / oldDuration` 比例缩放
4. **添加背景音乐** — 免版税 BGM 到 `public/audio/bgm.mp3`
5. **创建 AudioLayer** — 播放旁白 + BGM 的组件
6. **集成并验证** — AudioLayer 必须在 TransitionSeries **外部**

详细步骤、命令参数、AudioLayer 模板见 [audio-guide.md](references/audio-guide.md)。

### Phase 5: Quality Assurance

> 📋 Update `remotion_video/PROGRESS.md`: mark Phase 5 items as you complete them. Record scan results in Report.

完成编码后，执行自动质量检查流程：

1. **代码扫描** → 检查样式合规性（字号、颜色、安全区域等）
2. **截图审查** → 渲染关键帧，视觉检查
3. **自动修复** → 根据检查报告修复问题，循环直到通过
4. **启动项目** → 所有检查通过后，自动启动 Remotion 预览

详细检查步骤和规则见 [quality-checklist.md](references/quality-checklist.md)。

### Phase 6: Final Export

After preview looks correct, render the final video:

```bash
cd remotion_video
npx remotion render src/index.ts <CompositionName> out/video.mp4
```

Options:
- `--codec h264` (default) or `--codec h265` for smaller file size
- `--quality 80` to `100` (default: 80)
- `--scale 1` (1080p) — use `--scale 2` for 4K if source assets support it
- Add `--log verbose` if debugging render issues

The output file will be at `remotion_video/out/video.mp4`.

## Video Structure

Standard educational video structure:

```
1. Hook (5-10s)      - Attention-grabbing question or statement
2. Intro (10-20s)    - Topic introduction
3. Content (main)    - Core explanation, broken into segments
4. Summary (10-20s)  - Key takeaways
5. Outro (5-10s)     - Call to action or closing
```

See [script-and-narration.md](references/script-and-narration.md) Part 1 for detailed structure templates.

## Key Principles

### Content Clarity
- One concept per scene
- Build complexity gradually
- Use visual metaphors for abstract ideas

### Visual Simplicity
- Minimal elements on screen
- Clear visual hierarchy
- Consistent style throughout

### Animation Purpose
- Every animation serves understanding
- Avoid decorative motion
- Sync with narration pace

## Reference Files

| File | When to Use |
|------|-------------|
| [requirements-guide.md](references/requirements-guide.md) | Starting a new video project (Phase 1) |
| [script-and-narration.md](references/script-and-narration.md) | Video structure, script writing, narration, subtitle/TTS (Phase 1.5 + 2) |
| [storyboard-template.md](references/storyboard-template.md) | Converting script into visual scenes (Phase 2) |
| [style-guide.md](references/style-guide.md) | Designing visual elements (Phase 3 + 4) |
| [visual-principles.md](references/visual-principles.md) | Layout and composition decisions (Phase 3 + 4) |
| [animation-guide.md](references/animation-guide.md) | Implementing animations (Phase 4) |
| [svg-components.md](references/svg-components.md) | Creating reusable components (Phase 4) |
| [audio-guide.md](references/audio-guide.md) | TTS 生成、时间线重建、AudioLayer 集成详细步骤 (Phase 4.5) |
| [quality-checklist.md](references/quality-checklist.md) | Quality assurance + style check rules (Phase 5) |
| [design-tokens.ts](assets/design-tokens.ts) | Color palettes, typography presets, constants.ts template (Phase 3) |
| [progress-template.md](assets/progress-template.md) | 执行进度跟踪模板 (全流程) |
| [scene-template.tsx](assets/scene-template.tsx) | 场景组件模板 (Phase 4) |
| [subtitle-sequence-template.tsx](assets/subtitle-sequence-template.tsx) | 字幕序列组件模板 (Phase 4) |
| [common-icons.tsx](assets/common-icons.tsx) | 通用 SVG 图标组件 (Phase 4) |
| [generate-tts.ts](scripts/generate-tts.ts) | 字幕提取 + TTS 音频生成脚本 (Phase 4.5) |
| [rebuild-timeline.ts](scripts/rebuild-timeline.ts) | 音频时长测量 + 时间线重建脚本 (Phase 4.5) |
| [style-scan.ts](scripts/style-scan.ts) | 代码样式扫描脚本 (Phase 5) |
| [render-keyframes.ts](scripts/render-keyframes.ts) | 关键帧批量截图脚本 (Phase 5) |
| [shared.ts](scripts/shared.ts) | 脚本共享函数（内部依赖，无需直接调用） |
