# Storyboard Template

Convert a completed script into detailed visual storyboards for implementation. The script (from Phase 1.5) provides the narrative — what to say and in what order. This phase transforms that narrative into visual specifications — how to show it on screen.

**Input**: A complete, approved script with narration text, visual intents, and pacing notes.

**Your job here**: Break the script into scenes and add visual layers, animation specs, frame-level timing, sync points, and asset inventories. You do NOT need to write the narrative — it's already done.

### Frame Numbering: Global vs Local

The storyboard uses **global frame numbers** (absolute position in the full video timeline) for planning scene boundaries and total duration. However, when implementing in code:

- **`SCENES` in constants.ts** uses global frames: `{ start: 0, duration: 180 }`
- **`AUDIO_SEGMENTS` in constants.ts** uses **local frames** (each scene restarts from `SCENE_PAD`=15): `{ startFrame: 15, endFrame: 80 }`
- Inside each scene component, `useCurrentFrame()` returns the **local** frame number (0 at scene start)

This distinction is critical: if you accidentally put global frame numbers into `AUDIO_SEGMENTS`, subtitles in later scenes will be delayed or invisible because the local frame counter never reaches those values.

This template supports two levels of detail: Quick Template for initial brainstorming and Full Template for production-ready planning.

## Table of Contents

- [Template Types](#template-types)
- [Part 1: Video Metadata](#part-1-video-metadata)
- [Part 2: Quick Template](#part-2-quick-template)
- [Part 3: Full Template](#part-3-full-template)
- [Part 4: Timing Sheet](#part-4-timing-sheet)
- [Part 5: Complete Example](#part-5-complete-example-full-template)
- [Part 6: Storyboard Review Checklist](#part-6-storyboard-review-checklist)
- [Appendix: Field Reference](#appendix-field-reference)

---

## Template Types

| Template | Use Case | When to Use |
|----------|----------|-------------|
| **Quick Template** | Initial ideation, concept exploration | Early planning phase, client pitches |
| **Full Template** | Production-ready specifications | Pre-production, implementation handoff |

---

# Part 1: Video Metadata

Every storyboard starts with video-level metadata. This section captures the overall vision and requirements.

```markdown
# Video Metadata

## Basic Information
- **Title**: [Video title]
- **Total Duration**: [X minutes] ([X frames] @ 30fps)
- **Language**: [Chinese/English/Other]
- **Output Format**: 1920x1080 @ 30fps

## Target Audience
- **Age Range**: [e.g., 8-12 years / teenagers / adults]
- **Prior Knowledge**: [What viewers already know]
- **Learning Context**: [Classroom / self-study / entertainment]

## Learning Objectives
By the end of this video, viewers will be able to:
1. [Objective 1 - use action verbs: explain, describe, identify, compare]
2. [Objective 2]
3. [Objective 3]

## Visual Style
- **Reference Style**: [Kurzgesagt / 回形针 / Custom]
- **Color Palette**: [Primary colors for this video]
- **Mood**: [Playful / Professional / Dramatic / Calm]
- **Reference Links**: [URLs to inspiration videos/images]

## Audio Direction
- **Narration Tone**: [Friendly teacher / Curious explorer / Expert guide]
- **Music Style**: [Upbeat electronic / Ambient / Orchestral]
- **Sound Effects**: [Minimal / Moderate / Rich]

## Asset Inventory Summary
<!-- Auto-generated from scene assets -->
- **SVG Components**: [List of unique components needed]
- **Icons**: [List of icons]
- **Color Tokens**: [Consolidated color list]

## Review Milestones
- [ ] Storyboard draft review
- [ ] Visual design approval
- [ ] Animation timing review
- [ ] Final QA check
```

---

# Part 2: Quick Template

Use this template for rapid ideation and initial planning. Suitable for brainstorming sessions and early-stage development.

## Quick Scene Template

```markdown
## Scene [N]: [Title]
**Duration**: [X seconds] (frames [start]-[end])

### Visual
[Describe what's on screen - main elements and their arrangement]

### Narration
> "[Exact script for voiceover]"

### Animation
1. [Time range] [Element] [Action]
2. [Time range] [Element] [Action]

### Transition
[Type] → Scene [N+1]
```

### Quick Template Example

```markdown
## Scene 2: The Four Forces
**Duration**: 20 seconds (frames 240-840)

### Visual
- Airplane centered on screen
- Four arrows appear around it (Lift↑, Gravity↓, Thrust→, Drag←)

### Narration
> "要理解飞机怎么飞，我们需要认识四个重要的力：升力、重力、推力和阻力。"

### Animation
1. [0-5s] Airplane fades in at center
2. [5-17s] Four arrows spring in one by one
3. [17-20s] All arrows pulse gently

### Transition
Zoom into Lift arrow → Scene 3
```

---

# Part 3: Full Template

Use this template for production-ready storyboards. Each scene includes comprehensive specifications for implementation.

## Full Scene Template

```markdown
## Scene [N]: [Title]
**Duration**: [X seconds] (frames [start]-[end])

### Learning Goals
- **Objective**: [What viewer learns in this scene]
- **Key Concepts**: [Term 1], [Term 2]
- **Cognitive Level**: [Remember / Understand / Apply / Analyze]

### Visual Layers

#### Background Layer
- **Content**: [Description]
- **Animation**: [Static / Subtle motion / Active]
- **Colors**: [Color codes]

#### Midground Layer (Main Content)
- **Elements**:
  | Element | Position | Size | Initial State |
  |---------|----------|------|---------------|
  | [Name]  | [x, y]   | [w×h] | [visible/hidden, opacity, scale] |
- **Z-Order**: [Front to back listing]

#### Foreground Layer
- **Overlays**: [Any foreground elements]
- **Effects**: [Particles, glows, etc.]

#### UI Layer
- **Subtitles**: [Position: bottom-center, style]
- **Labels**: [Any on-screen text labels]
- **Progress**: [If showing chapter progress]

### Narration Script
> "[Exact script with emphasis markers]"
> 
> **Bold** = Stressed words
> *Italic* = Softer tone
> [.] = Short pause (0.3-0.5s)
> [..] = Medium pause (0.5-1s)
> [...] = Long pause (1-2s)
> [PAUSE] or [BEAT] = Dramatic pause (2-3s)

**Word Count**: [X words/characters]
**Estimated Duration**: [X seconds at Y words/sec]

### Audio Design

#### Background Music
- **Track/Style**: [Description or track name]
- **Volume Level**: [0-100%, relative to narration]
- **In Point**: [Frame or time]
- **Out Point**: [Frame or time, with fade duration]

#### Sound Effects
| Time | Frame | SFX Description | Notes |
|------|-------|-----------------|-------|
| 0:02 | 60    | Whoosh - element enters | Subtle |
| 0:05 | 150   | Pop - bounce animation | Playful |

#### Ambient Sound
- **Type**: [None / Light / Atmospheric]
- **Description**: [If applicable]

### Animation Specs

| Element | Animation | Duration | Easing/Spring | Start Frame | Notes |
|---------|-----------|----------|---------------|-------------|-------|
| [Name]  | Fade in   | 20 frames | ease-out-cubic | 0 | Opacity 0→1 |
| [Name]  | Spring in | 30 frames | spring(damping:12) | 20 | Scale 0→1 |
| [Name]  | Slide left | 25 frames | spring(damping:200) | 50 | x: 100→0 |

**Spring Presets Reference**:
- `smooth`: damping: 200 (no bounce)
- `snappy`: damping: 20, stiffness: 200
- `bouncy`: damping: 8
- `heavy`: damping: 15, stiffness: 80, mass: 2

### Camera / View
- **Initial View**: [Zoom level %, Focus point]
- **Movements**:
  | Time | Action | Duration | Easing |
  |------|--------|----------|--------|
  | 0:05 | Zoom to 120% | 1s | ease-in-out |
  | 0:10 | Pan right 100px | 0.5s | ease-out |
- **Composition**: [Rule of thirds / Center stage / Split screen]

### Visual-Narration Sync Points
| Narration Text | Frame | Visual Action |
|----------------|-------|---------------|
| "升力" | 150 | Lift arrow appears |
| "重力" | 240 | Gravity arrow appears |
| "这就是..." | 500 | All elements highlight |

### Required Assets

> **Important**: Each SVG asset must include a **Structure** description (geometric shapes that compose it) and a **Style** description (gradients, stroke, colors). This bridges the gap between storyboard design and Phase 4 implementation — without structural guidance, implementations tend to fall back to plain text boxes.

- **SVG Components**:
  - `Airplane`: Cartoon airplane, side view
    - Structure: Rounded-rect fuselage (rx=15) + triangular wings + elliptical tail fin + circular windows
    - Style: Light-to-dark gradient fill (#e8edf2→#b8c6d4), 1.5px stroke, rounded joins
  - `ForceArrow`: Directional arrow with label slot
    - Structure: Gradient line + chevron head
    - Style: Color gradient (0.6→1.0 opacity), feGaussianBlur glow filter, text-shadow on label
- **Icons**: [List with structure descriptions]
- **Colors Used**:
  - Background: #1a1a2e
  - Lift: #74b9ff
  - Gravity: #e17055
- **Typography**:
  - Labels: Inter Bold 24px
  - Subtitles: Noto Sans SC 36px
- **Ambient Effects**: [e.g., Floating clouds (3-5 ellipse clusters, rgba white 0.06-0.08, slow horizontal drift)]

### Transition to Next Scene
- **Type**: [Fade / Slide / Wipe / Zoom / Custom]
- **Duration**: [X frames / seconds]
- **Direction**: [If applicable]
- **Overlap**: [Whether scenes overlap during transition]

### References (Optional)
- **Mood/Style**: [Description or image links]
- **Similar Examples**: [Video URL + timestamp]
- **Sketch**: [Link to wireframe/sketch if available]

### Accessibility (Optional)
- **Alt-text**: [Text description of visual content for screen readers]
- **Color-blind Safe**: [Yes/No - whether info relies solely on color]
- **Subtitle Breaks**:
  ```
  Line 1: 要理解飞机怎么飞
  Line 2: 我们需要认识四个重要的力
  ```

### Review Checkpoint
- [ ] Learning objective is clear and measurable
- [ ] Visual-narration sync points marked
- [ ] Animation specs are implementable
- [ ] Asset list is complete
- [ ] Timing adds up correctly

**Reviewer Notes**: [Space for feedback]
```

---

# Part 4: Timing Sheet

For frame-accurate planning, use this timing sheet format alongside or instead of per-scene animation specs.

## Timing Sheet Format

```markdown
## Timing Sheet: [Video Title]

**FPS**: 30 | **Total Frames**: [X] | **Total Duration**: [X:XX]

### Scene [N]: [Title] (frames [start]-[end])

| Time Code | Frame | Layer | Element | Action | Audio Event |
|-----------|-------|-------|---------|--------|-------------|
| 0:00.00 | 0 | BG | Background | Fade in (20f) | Music starts |
| 0:00.67 | 20 | MG | Airplane | Spring in (30f) | - |
| 0:01.67 | 50 | MG | LiftArrow | Spring in (25f) | Whoosh SFX |
| 0:02.50 | 75 | FG | Label "升力" | Fade in (15f) | - |
| 0:02.50 | 75 | VO | Narration | Start | "首先来看升力..." |

### Legend
- **Layer**: BG (Background), MG (Midground), FG (Foreground), UI, VO (Voiceover)
- **Action Format**: [Animation type] ([duration in frames])
- **Time Code**: MM:SS.ms format
```

### Timing Sheet Example

```markdown
## Timing Sheet: 飞机是怎么飞起来的

**FPS**: 30 | **Total Frames**: 6600 | **Total Duration**: 3:40

### Scene 1: Hook (frames 0-240)

| Time Code | Frame | Layer | Element | Action | Audio Event |
|-----------|-------|-------|---------|--------|-------------|
| 0:00.00 | 0 | BG | SkyGradient | Instant show | Music fade in (60f) |
| 0:00.00 | 0 | BG | Clouds | Drift right (loop) | - |
| 0:00.33 | 10 | MG | Airplane | Enter from left (50f) | Engine hum |
| 0:02.00 | 60 | MG | Airplane | Hover bob (loop) | - |
| 0:02.00 | 60 | VO | Narration | Start | "你有没有想过..." |
| 0:04.00 | 120 | FG | QuestionMark | Bounce in (30f) | Pop SFX |
| 0:06.00 | 180 | ALL | - | Hold | - |
| 0:07.33 | 220 | ALL | Everything | Fade out (20f) | Music dip |

### Scene 2: Four Forces (frames 240-840)

| Time Code | Frame | Layer | Element | Action | Audio Event |
|-----------|-------|-------|---------|--------|-------------|
| 0:08.00 | 240 | BG | SimpleBG | Cross-fade in (15f) | - |
| 0:08.50 | 255 | MG | Airplane | Fade in center (30f) | - |
| 0:09.67 | 290 | VO | Narration | Start | "要理解飞机怎么飞..." |
| 0:10.50 | 315 | MG | LiftArrow | Spring up (25f) | Swoosh |
| 0:11.33 | 340 | UI | Label "升力" | Fade in (15f) | - |
| 0:12.17 | 365 | MG | GravityArrow | Spring down (25f) | Swoosh |
| ... | ... | ... | ... | ... | ... |
```

---

# Part 5: Complete Example (Full Template)

## Video: 飞机是怎么飞起来的

### Video Metadata

```markdown
# Video Metadata

## Basic Information
- **Title**: 飞机是怎么飞起来的
- **Total Duration**: 3 minutes 40 seconds (6600 frames @ 30fps)
- **Language**: Chinese (Simplified)
- **Output Format**: 1920x1080 @ 30fps

## Target Audience
- **Age Range**: 8-12 years (children)
- **Prior Knowledge**: Basic understanding of forces (push/pull)
- **Learning Context**: Educational entertainment, self-study

## Learning Objectives
By the end of this video, viewers will be able to:
1. Name the four forces acting on an airplane (Lift, Gravity, Thrust, Drag)
2. Explain how wing shape creates lift using simple terms
3. Describe how pilots control flight by balancing these forces

## Visual Style
- **Reference Style**: Kurzgesagt/回形针 hybrid
- **Color Palette**: 
  - Primary: Deep blue (#1a1a2e), Sky blue (#4facfe)
  - Accents: Coral (#e17055), Mint (#00b894), Yellow (#fdcb6e)
- **Mood**: Curious, playful, educational
- **Reference Links**: 
  - Kurzgesagt "How Planes Fly": [URL]
  - 回形针 style reference: [URL]

## Audio Direction
- **Narration Tone**: Friendly teacher, curious and encouraging
- **Music Style**: Light electronic, wonder-inducing
- **Sound Effects**: Moderate - whooshes, pops, ambient airplane sounds

## Asset Inventory Summary
- **SVG Components**: Airplane, Wing, ForceArrow, QuestionMark, CloudSet, PressureIndicator
- **Icons**: Checkmark, Force symbols
- **Color Tokens**: See palette above

## Review Milestones
- [ ] Storyboard draft review - [Date]
- [ ] Visual design approval - [Date]
- [ ] Animation timing review - [Date]  
- [ ] Final QA check - [Date]
```

---

### Scene 1: Hook (Full Template)

```markdown
## Scene 1: Hook
**Duration**: 8 seconds (frames 0-240)

### Learning Goals
- **Objective**: Capture attention and establish the central question
- **Key Concepts**: Heavy objects, flight (implicit)
- **Cognitive Level**: Remember (recall that airplanes are heavy)

### Visual Layers

#### Background Layer
- **Content**: Deep blue sky gradient with subtle animated clouds
- **Animation**: Clouds drift slowly right (parallax)
- **Colors**: #1a1a2e (top) → #16213e (bottom), clouds #ffffff @ 20% opacity

#### Midground Layer (Main Content)
- **Elements**:
  | Element | Position | Size | Initial State |
  |---------|----------|------|---------------|
  | Airplane | center | 300×120px | hidden, off-screen left |
  | QuestionMark | right-center | 150×200px | hidden, scale 0 |
- **Z-Order**: Airplane, QuestionMark (front)

#### Foreground Layer
- **Overlays**: None
- **Effects**: Subtle particle dust (optional)

#### UI Layer
- **Subtitles**: Bottom center, 80px from bottom
- **Labels**: None
- **Progress**: None (opening scene)

### Narration Script
> "你有没有想过，[...]
> 一架**重达几百吨**的大飞机，[PAUSE]
> 怎么能像*小鸟*一样在天上飞呢？"

**Word Count**: 32 characters
**Estimated Duration**: ~7 seconds at 4.5 char/sec

### Audio Design

#### Background Music
- **Track/Style**: Curious wonder theme, light electronic
- **Volume Level**: 30% (under narration)
- **In Point**: Frame 0 (fade in over 60 frames)
- **Out Point**: Continues to next scene

#### Sound Effects
| Time | Frame | SFX Description | Notes |
|------|-------|-----------------|-------|
| 0:00.33 | 10 | Airplane engine hum (subtle) | Distant, atmospheric |
| 0:04.00 | 120 | Pop/bounce | When question mark appears |

#### Ambient Sound
- **Type**: Light
- **Description**: Soft wind, high altitude atmosphere

### Animation Specs

| Element | Animation | Duration | Easing/Spring | Start Frame | Notes |
|---------|-----------|----------|---------------|-------------|-------|
| Clouds | Drift right | Loop | linear | 0 | Parallax, speed: 0.5px/frame |
| Airplane | Enter from left | 50 frames | ease-out-cubic | 10 | x: -400 → 0 |
| Airplane | Hover bob | Loop | sin wave | 60 | y: ±10px, period: 60f |
| QuestionMark | Bounce in | 30 frames | spring(damping:8) | 120 | scale: 0 → 1 |
| All | Fade out | 20 frames | ease-in | 220 | opacity: 1 → 0 |

### Camera / View
- **Initial View**: 100%, centered
- **Movements**: None (static wide shot)
- **Composition**: Airplane at horizontal center, slightly above vertical center (rule of thirds)

### Visual-Narration Sync Points
| Narration Text | Frame | Visual Action |
|----------------|-------|---------------|
| "你有没有想过" | 60 | Airplane reaches center |
| "重达几百吨" | 90 | Airplane emphasized (subtle scale pulse) |
| "在天上飞呢？" | 120 | Question mark bounces in |

### Required Assets
- **SVG Components**:
  - `Airplane`: Cute cartoon airplane, side view, rounded shapes
  - `QuestionMark`: Bold, rounded question mark with subtle gradient
  - `Cloud`: Fluffy cloud shapes (3 variations)
- **Icons**: None
- **Colors Used**:
  - Sky gradient: #1a1a2e → #16213e
  - Clouds: #ffffff @ 20% opacity
  - Airplane body: #4facfe, #74b9ff
  - Question mark: #fdcb6e
- **Typography**:
  - Subtitles: Noto Sans SC Medium 36px, white with shadow

### Transition to Next Scene
- **Type**: Cross-fade
- **Duration**: 15 frames (0.5s)
- **Direction**: N/A
- **Overlap**: 15 frames overlap with Scene 2

### References (Optional)
- **Mood/Style**: Wonder, curiosity - child looking up at sky
- **Similar Examples**: Kurzgesagt opening hooks
- **Sketch**: [Link to rough sketch]

### Accessibility (Optional)
- **Alt-text**: "A cartoon airplane flies across a blue sky. A large question mark appears, asking how heavy planes can fly."
- **Color-blind Safe**: Yes - no color-only information
- **Subtitle Breaks**:
  ```
  Line 1: 你有没有想过
  Line 2: 一架重达几百吨的大飞机
  Line 3: 怎么能像小鸟一样
  Line 4: 在天上飞呢？
  ```

### Review Checkpoint
- [x] Learning objective is clear and measurable
- [x] Visual-narration sync points marked
- [x] Animation specs are implementable
- [x] Asset list is complete
- [x] Timing adds up correctly (8s = 240 frames ✓)

**Reviewer Notes**: Approved - proceed to implementation
```

---

### Scene 3: Explaining Lift (Full Template - Complex Scene)

```markdown
## Scene 3: Explaining Lift
**Duration**: 45 seconds (frames 840-2190)

### Learning Goals
- **Objective**: Understand how wing shape creates lift through air pressure difference
- **Key Concepts**: Wing/airfoil, air flow, pressure, Bernoulli principle (simplified)
- **Cognitive Level**: Understand (explain the concept in own words)

### Visual Layers

#### Background Layer
- **Content**: Simplified gradient, focus on diagram
- **Animation**: Static
- **Colors**: #0f0f23 (neutral dark)

#### Midground Layer (Main Content)
- **Elements**:
  | Element | Position | Size | Initial State |
  |---------|----------|------|---------------|
  | WingCrossSection | center | 600×200px | hidden |
  | AirFlowLines (top) | above wing | variable | hidden |
  | AirFlowLines (bottom) | below wing | variable | hidden |
  | PressureZone (low) | above wing | 400×100px | hidden |
  | PressureZone (high) | below wing | 400×100px | hidden |
  | LiftArrow | above wing | 80×150px | hidden |
- **Z-Order**: Wing, FlowLines, PressureZones, LiftArrow (front)

#### Foreground Layer
- **Overlays**: None
- **Effects**: None

#### UI Layer
- **Subtitles**: Bottom center
- **Labels**: "低压", "高压", "升力" appear at appropriate times
- **Progress**: None

### Narration Script
> "首先来看**升力**。[...]
> 升力是让飞机飞起来的*最重要*的力量。
> 它来自飞机的翅膀，也叫**机翼**。[PAUSE]
>
> 看，机翼的形状很特别：
> 上面是**弯曲**的，下面比较**平**。[...]
>
> 当飞机向前移动时，
> 空气从机翼的上面和下面*同时*流过。[PAUSE]
>
> 因为上面弯曲，空气要走**更长**的路，
> 所以它流得**更快**。[...]
>
> 这里有个神奇的规律：
> 空气流得越快，压力就**越小**。[PAUSE]
>
> 所以机翼上面的压力...比下面小。
> 下面的空气就把机翼往上**推**！
>
> 这就是**升力**的秘密！"

**Word Count**: ~180 characters
**Estimated Duration**: ~42 seconds at 4.3 char/sec

### Audio Design

#### Background Music
- **Track/Style**: Continues from previous, slight build during explanation
- **Volume Level**: 25% (lower for complex explanation)
- **In Point**: Continuous
- **Out Point**: Continuous

#### Sound Effects
| Time | Frame | SFX Description | Notes |
|------|-------|-----------------|-------|
| 0:00 | 840 | Transition swoosh | Scene entry |
| 0:10 | 1140 | Air flow whoosh (subtle loop) | When flow lines animate |
| 0:30 | 1740 | Pressure indicator tone | Low/high pitch for zones |
| 0:40 | 2040 | Rising tone | When lift arrow appears |

#### Ambient Sound
- **Type**: Minimal
- **Description**: Soft air flow sound during animation

### Animation Specs

| Element | Animation | Duration | Easing/Spring | Start Frame | Notes |
|---------|-----------|----------|---------------|-------------|-------|
| WingCrossSection | Fade + scale in | 40f | spring(damping:200) | 840 | scale: 0.8→1 |
| TopCurveHighlight | Draw on | 30f | ease-out | 1000 | Stroke animation |
| BottomLineHighlight | Draw on | 30f | ease-out | 1050 | Stroke animation |
| AirFlowLines (all) | Flow animation | Loop | linear | 1140 | Particle flow effect |
| AirFlowLines (top) | Speed increase | 60f | ease-in-out | 1440 | Faster particles |
| PressureZone (low) | Fade in + pulse | 30f | ease-out | 1600 | Blue, opacity 0.6 |
| PressureZone (high) | Fade in + pulse | 30f | ease-out | 1650 | Red, opacity 0.6 |
| LiftArrow | Spring up | 40f | spring(damping:12) | 1900 | scale + position |
| Wing | Tilt up slightly | 60f | ease-in-out | 2050 | rotate: 0→5deg |

### Camera / View
- **Initial View**: 100%, centered on wing
- **Movements**:
  | Time | Action | Duration | Easing |
  |------|--------|----------|--------|
  | 0:00 | Zoom from 80% to 100% | 1s | ease-out |
- **Composition**: Wing centered, diagram-style layout

### Visual-Narration Sync Points
| Narration Text | Frame | Visual Action |
|----------------|-------|---------------|
| "升力" (first) | 860 | Wing begins appearing |
| "机翼" | 940 | Wing fully visible |
| "上面是弯曲的" | 1000 | Top curve highlights |
| "下面比较平" | 1050 | Bottom line highlights |
| "空气从机翼...流过" | 1140 | Air flow lines start |
| "流得更快" | 1440 | Top flow speeds up |
| "压力就越小" | 1600 | Low pressure zone appears |
| "往上推" | 1900 | Lift arrow springs up |

### Required Assets
- **SVG Components**:
  - `WingCrossSection`: Airfoil shape with curved top, flat bottom
  - `AirFlowLine`: Animated line/particle for air flow
  - `PressureZone`: Semi-transparent overlay shape
  - `LiftArrow`: Upward arrow with "升力" label
- **Icons**: None
- **Colors Used**:
  - Wing: #74b9ff (light blue)
  - Air flow: #ffffff @ 60%
  - Low pressure: #4facfe @ 40%
  - High pressure: #e17055 @ 40%
  - Lift arrow: #00b894
- **Typography**:
  - Labels: Inter Bold 28px

### Transition to Next Scene
- **Type**: Wipe left
- **Duration**: 20 frames
- **Direction**: Left to right
- **Overlap**: 10 frames

### Sub-scenes (for internal organization)
This scene can be broken into sub-scenes for implementation:
- **3a** (frames 840-1100): Wing shape introduction
- **3b** (frames 1100-1400): Air flow visualization  
- **3c** (frames 1400-1750): Pressure difference explanation
- **3d** (frames 1750-2190): Lift force demonstration

### Accessibility (Optional)
- **Alt-text**: "Cross-section of an airplane wing showing curved top and flat bottom. Animated air flows around the wing - faster on top, slower below. Blue shading shows low pressure above, red shows high pressure below. An arrow shows the resulting upward lift force."
- **Color-blind Safe**: Yes - pressure zones also differ in position and labeled
- **Subtitle Breaks**: [Standard 2-line breaks following narration pauses]

### Review Checkpoint
- [x] Learning objective is clear and measurable
- [x] Visual-narration sync points marked
- [x] Animation specs are implementable
- [x] Asset list is complete
- [x] Timing adds up correctly (45s = 1350 frames ✓)

**Reviewer Notes**: Complex scene - consider splitting into 2 scenes if implementation is difficult
```

---

## Timing Summary Table

| Scene | Title | Duration | Frames | Cumulative |
|-------|-------|----------|--------|------------|
| 1 | Hook | 8s | 0-240 | 0:08 |
| 2 | Four Forces Intro | 20s | 240-840 | 0:28 |
| 3 | Explaining Lift | 45s | 840-2190 | 1:13 |
| 4 | Explaining Gravity | 25s | 2190-2940 | 1:38 |
| 5 | Explaining Thrust | 30s | 2940-3840 | 2:08 |
| 6 | Explaining Drag | 25s | 3840-4590 | 2:33 |
| 7 | Balance of Forces | 35s | 4590-5640 | 3:08 |
| 8 | Summary | 20s | 5640-6240 | 3:28 |
| 9 | Outro / Fun Fact | 12s | 6240-6600 | 3:40 |
| **Total** | | **220s** | **6600** | **3:40** |

---

# Part 6: Storyboard Review Checklist

Before proceeding to implementation, verify the complete storyboard:

## Video-Level Checks
- [ ] Learning objectives are specific and measurable
- [ ] Target audience is clearly defined
- [ ] Visual style is consistent across all scenes
- [ ] Total duration matches requirements
- [ ] All review milestones are scheduled

## Per-Scene Checks
- [ ] Each scene has a clear learning goal
- [ ] Narration scripts are complete and timed
- [ ] Visual-narration sync points are marked
- [ ] Animation specs include easing/spring values
- [ ] Asset requirements are documented
- [ ] Transitions between scenes are specified

## Technical Checks
- [ ] Frame counts are accurate (duration × fps)
- [ ] No timing gaps or overlaps (unless intentional)
- [ ] Color palette is consistent
- [ ] Typography is consistent
- [ ] All assets are listed in inventory

## Accessibility Checks (Optional but Recommended)
- [ ] Alt-text provided for complex visuals
- [ ] Information not conveyed by color alone
- [ ] Subtitle breaks follow natural speech patterns

---

# Appendix: Field Reference

## Required vs Optional Fields

### Always Required (Quick & Full)
- Scene number and title
- Duration and frame range
- Visual description
- Narration script
- Animation sequence (basic)
- Transition

### Required for Full Template
- Learning goals
- Visual layers breakdown
- Audio design
- Animation specs (detailed)
- Visual-narration sync points
- Required assets
- Review checkpoint

### Optional (Enhance as Needed)
- Camera/view specifications
- References
- Accessibility
- Sub-scene breakdown
- Timing sheet

## Spring Preset Quick Reference

| Preset | Config | Use For |
|--------|--------|---------|
| smooth | `{damping: 200}` | Professional entrances |
| snappy | `{damping: 20, stiffness: 200}` | Quick responses |
| bouncy | `{damping: 8}` | Playful, attention-grabbing |
| heavy | `{damping: 15, stiffness: 80, mass: 2}` | Large/important elements |
| gentle | `{damping: 30, stiffness: 50}` | Soft, dreamy motion |

## Transition Quick Reference

| Type | Duration | Use For |
|------|----------|---------|
| Fade | 15-30f | Topic change, soft transitions |
| Slide | 15-20f | Continuing narrative |
| Wipe | 20-30f | Dramatic reveals |
| Zoom | 20-30f | Focus on detail |
| Cross-fade | 15-20f | Smooth scene changes |
