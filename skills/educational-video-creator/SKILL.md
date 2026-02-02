---
name: educational-video-creator
description: "Create educational videos using Remotion with Kurzgesagt/回形针 style. Use when users want to: (1) create teaching or educational videos, (2) design video storyboards, (3) produce animated explainer videos, (4) build SVG-based animations for learning content, (5) visualize complex concepts with motion graphics, (6) make science/tech explainer videos, (7) create 可视化讲解视频 or 科普视频. Triggers on requests like '帮我做一个教学视频', 'create an explainer video about X', '制作科普动画', 'make a video explaining Y'. This skill requires remotion-best-practices skill for technical implementation."
allowed-tools: Read, Write, WebSearch, Bash(python3.11:*)
---

# Educational Video Creator

Create professional educational videos with Kurzgesagt/回形针 visual style using Remotion.

## Prerequisites

This skill requires **remotion-best-practices** for Remotion technical implementation.

**Check and install:**
```bash
# Install remotion-best-practices skill if not present
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

Once installed, read the remotion-best-practices skill for Remotion API details.

## Project Setup

This skill creates videos in a dedicated `remotion_video` subdirectory within the current workspace.

**First-time setup (recommended — non-interactive):**
```bash
# Create video project directory
mkdir -p remotion_video
cd remotion_video

# Initialize without interactive prompts
npm init -y
npm install remotion @remotion/cli @remotion/google-fonts react react-dom
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

## Workflow

### Phase 1: Requirements Gathering

Before starting, confirm these essential details with the user:

- **Topic**: What concept/subject to explain?
- **Audience**: Who is watching? (children/adults, beginners/experts)
- **Language**: Chinese/English/other?
- **Duration**: Short (1-3min), Medium (3-5min), or Long (5-10min)?
- **Key points**: What must the viewer learn?

For detailed question templates, see [requirements-guide.md](references/requirements-guide.md).

### Phase 1.5: Script Writing

Write a complete narrative script before designing the storyboard. This phase focuses purely on **storytelling** — what to say and how to say it well — without worrying about visual specs, frame numbers, or animation parameters.

The script should include:

1. **Core message** — one-line summary, learning objectives
2. **Narrative strategy** — entry angle, core metaphor, emotional arc, knowledge building order
3. **Full narration text** — complete script for every chapter, with visual intents (brief descriptions, not specs)
4. **Pacing notes** — where to speed up, slow down, and pause

Why script first:
- Separates "what to tell" from "how to show" — two different creative activities
- LLM produces better narratives when not simultaneously calculating frame ranges
- Pure text is cheap to iterate; storyboard with animation specs is expensive to revise
- Users can easily review "is the story good?" without wading through technical details

**Output**: Save the approved script as `remotion_video/script.md` for traceability and independent review.

See [script-template.md](references/script-template.md) for templates and writing techniques.
See [narration-guide.md](references/narration-guide.md) for narration style and audience adaptation.

### Phase 2: Storyboard Design

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
See [narration-guide.md](references/narration-guide.md) for subtitle formatting and TTS notes.

### Phase 3: Visual Design

Apply the Kurzgesagt/回形针 style:

- Flat design with subtle gradients
- Bold, saturated color palette
- Geometric shapes with rounded corners
- Clean sans-serif typography

See [style-guide.md](references/style-guide.md) for complete visual standards.
See [visual-principles.md](references/visual-principles.md) for composition and layout.

### Phase 4: Animation Production

Implement scenes using Remotion:

1. Create SVG components for visual elements
2. Use `useCurrentFrame()` for all animations
3. Apply appropriate easing (spring for natural motion)
4. Add scene transitions

**Subtitle & narration rules (critical for Phase 4.5 compatibility):**
- All narration text **must** be stored in the `NARRATION` object in `constants.ts` — never hardcode text directly in scene TSX files
- Create an estimated `AUDIO_SEGMENTS` in `constants.ts` with approximate timing. Phase 4.5 will overwrite it with real audio-based timing
- Subtitle components **must** reference `AUDIO_SEGMENTS.sceneKey` — never use inline segment arrays with hardcoded frame numbers
- This ensures `rebuild-timeline.ts --write` in Phase 4.5 can update timing without modifying any scene files

**Background rules (prevents transparent/checkerboard frames during transitions):**
- The main composition **must** have a persistent `<AbsoluteFill>` background layer (using `COLORS.background`) that sits behind all scenes and never participates in transitions
- Each scene component **must** also have its own solid background as the first child element
- During `fade()` transitions, both scenes have reduced opacity — without a persistent background, transparent frames appear as a checkerboard pattern in preview and black in renders
- See [animation-guide.md](references/animation-guide.md) "Preventing Transparent Frames" for the implementation pattern

**Color rules (critical for Phase 5 style-scan compliance):**
- All colors **must** be referenced via the `COLORS` object from `constants.ts` (e.g., `COLORS.accent.orange`) — never write hex values directly in TSX files
- The only exception is `rgba()` for opacity variations (e.g., `rgba(0, 0, 0, 0.7)` for subtitle backgrounds)
- This prevents the common issue where style-scan reports dozens of "color not in approved palette" warnings

See [svg-components.md](references/svg-components.md) for component patterns.
See [animation-guide.md](references/animation-guide.md) for timing and easing.

### Phase 4.5: Audio Generation

完成动画编码后，自动生成视频音频：

1. **TTS 旁白生成** — 从每个场景的字幕文本生成语音
2. **时间线重建** — 根据实际音频时长调整字幕帧范围和场景时长
3. **背景音乐** — 自动获取合适的免费背景音乐
4. **音频集成** — 创建 AudioLayer 组件整合旁白和 BGM
5. **同步验证** — 确保旁白与字幕显示时间匹配

详细步骤见 [audio-guide.md](references/audio-guide.md)

### Phase 5: Quality Assurance

完成编码后，执行自动质量检查流程：

1. **代码扫描** → 检查样式合规性（字号、颜色、安全区域等）
2. **截图审查** → 渲染关键帧，视觉检查
3. **自动修复** → 根据检查报告修复问题，循环直到通过
4. **启动项目** → 所有检查通过后，自动启动 Remotion 预览

详细检查步骤和规则见 [quality-checklist.md](references/quality-checklist.md)。

## Video Structure

Standard educational video structure:

```
1. Hook (5-10s)      - Attention-grabbing question or statement
2. Intro (10-20s)    - Topic introduction
3. Content (main)    - Core explanation, broken into segments
4. Summary (10-20s)  - Key takeaways
5. Outro (5-10s)     - Call to action or closing
```

See [video-structure.md](references/video-structure.md) for detailed templates.

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
| [requirements-guide.md](references/requirements-guide.md) | Starting a new video project |
| [script-template.md](references/script-template.md) | Writing the narrative script (Phase 1.5) |
| [storyboard-template.md](references/storyboard-template.md) | Converting script into visual scenes (Phase 2) |
| [narration-guide.md](references/narration-guide.md) | Narration style, subtitle formatting, TTS notes |
| [style-guide.md](references/style-guide.md) | Designing visual elements |
| [visual-principles.md](references/visual-principles.md) | Layout and composition decisions |
| [animation-guide.md](references/animation-guide.md) | Implementing animations |
| [svg-components.md](references/svg-components.md) | Creating reusable components |
| [video-structure.md](references/video-structure.md) | Organizing video content |
| [audio-guide.md](references/audio-guide.md) | Audio generation (TTS, BGM, timeline sync) |
| [quality-checklist.md](references/quality-checklist.md) | Final review before delivery |
| [style-check-rules.md](references/style-check-rules.md) | 自动样式检查的量化规则 |
| [render-keyframes.ts](scripts/render-keyframes.ts) | 关键帧批量截图脚本 (Phase 5 Step 2) |
| [style-scan.ts](scripts/style-scan.ts) | 代码样式扫描脚本 (Phase 5 Step 1) |
| [generate-tts.ts](scripts/generate-tts.ts) | 字幕提取 + TTS 音频生成脚本 (Phase 4.5 Steps 1-2) |
| [rebuild-timeline.ts](scripts/rebuild-timeline.ts) | 音频时长测量 + 时间线重建脚本 (Phase 4.5 Steps 3-6) |
