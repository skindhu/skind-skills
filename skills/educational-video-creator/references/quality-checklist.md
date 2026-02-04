# Quality Checklist

Automated quality assurance workflow for Phase 5.

## Table of Contents

- [Quality Checklist](#quality-checklist)
  - [Table of Contents](#table-of-contents)
  - [Step 1: Code Scanning](#step-1-code-scanning)
  - [Step 2: Keyframe Screenshot Review](#step-2-keyframe-screenshot-review)
  - [Step 3: Auto-Fix](#step-3-auto-fix)
  - [Step 4: Start Project](#step-4-start-project)
  - [Report Format](#report-format)
  - [Appendix: Style Check Rules](#appendix-style-check-rules)

---

Execute the following automated check and fix workflow during SKILL.md Phase 5.

## Step 1: Code Scanning

Use the `style-scan.ts` script to automatically scan all TSX files for style compliance:

```bash
cd remotion_video
npx tsx ../scripts/style-scan.ts <CompositionName>
# Optional: --output <report-path>  (defaults to stdout)
```

The script will automatically:
- Extract project color palette from `constants.ts` (hex colors + black/white exemptions)
- Glob `src/<CompositionName>/**/*.tsx` to discover all files
- Scan each file against the [Style Check Rules](#appendix-style-check-rules) below
- Generate Markdown report by severity (🔴Critical / 🟡Important / 🟢Minor)
- Exit with code 1 if any 🔴Critical issues found

**Check Items:**

| Check Item | Extraction Method | Rule Source |
|------------|-------------------|-------------|
| Font size | `fontSize: N` | [§1 字号规则](#1-字号规则-1920×1080-画布) |
| Colors | Compare hex values against palette | [§2 调色板](#2-调色板动态提取) |
| Safe zones | left/top/right/bottom values | [§3 安全区域](#3-安全区域-1920×1080-画布) |
| Spacing | padding/margin/gap values | [§4 间距规范](#4-间距规范) |
| Element size | size prop | [§5 元素尺寸](#5-元素尺寸) |
| Stroke/radius | strokeWidth, borderRadius | [§5](#5-元素尺寸)-[§6](#6-圆角) |
| Disabled patterns | transition:, animate-, setTimeout, etc. | [§7 禁用模式](#7-禁用模式-remotion-项目通用) |
| Layout conflicts | Non-subtitle text with bottom ≥ 850 | [§8 布局区域](#8-布局区域-1920×1080-画布) |

## Step 2: Keyframe Screenshot Review

Render actual frame screenshots and use image analysis to check visual issues that code scanning cannot detect:

**Steps:**

1. **Batch render keyframe screenshots**: Execute the script to automatically calculate frame numbers and render:
   ```bash
   cd remotion_video
   npx tsx ../scripts/render-keyframes.ts <CompositionName>
   ```
   The script will automatically:
   - Read SCENES definition from `src/<CompositionName>/constants.ts`
   - Calculate keyframes for each scene (4 frames if ≤10 scenes, 2 frames if >10 scenes)
   - Execute `npx remotion still` for each frame, rendering to `/tmp/style-check/`
   - Output render summary (success/failure counts, file list)

   Optional parameters:
   - `--output-dir <path>` — Output directory (default: `/tmp/style-check`)
   - `--frames-per-scene <2|4>` — Frames per scene (default: auto)

2. **Analyze each image**:

   **Important**: You must use the Read tool to read each PNG screenshot file for visual analysis.

   Steps:
   - List all screenshot files in the output directory (script outputs file list after execution)
   - **Use Read tool to read each PNG file** (e.g., `Read /tmp/style-check/scene-hook-f0.png`)
   - For each image, analyze according to the check items table below
   - Record screenshot filename, issue description, and fix suggestions when issues are found

   Check the following visual issues:

   | Check Item | What to Check | Severity |
   |------------|---------------|----------|
   | Overall aesthetics | Is the frame clean, professional, visually appealing, matching educational video style | 🔴Critical |
   | Visual balance | Is the composition balanced, whitespace reasonable, elements well-distributed | 🔴Critical |
   | Color harmony | Is color scheme coordinated, colors pleasing to the eye, no jarring combinations | 🔴Critical |
   | Visual hierarchy | Is the main subject prominent, information hierarchy clear, focus guided properly | 🔴Critical |
   | Text readability | Is text clear and readable, font size adequate, contrast sufficient | 🔴Critical |
   | Element overlap | Is text obscured, elements improperly overlapping | 🔴Critical |
   | **Visual richness** | **Does the scene have non-text visual content (SVG illustrations, charts, animated graphics)? Scenes with only text labels in colored boxes are PPT-like and must be redesigned** | 🔴Critical |
   | **Illustration quality** | **Do SVG illustrations use gradients, rounded corners, and layered shapes (Kurzgesagt style)? Plain solid-fill rectangles with text are not acceptable** | 🔴Critical |
   | Safe zones | Is key content cropped or too close to edges | 🟡Important |
   | Icon appropriateness | Do icons match content, appropriate size, consistent style | 🟡Important |
   | Animation reasonableness | Is animation smooth, rhythm matches content, aids understanding | 🟡Important |
   | Transparent/checkerboard frames | Are there frames showing checkerboard (transparent) or pure white/black backgrounds | 🟡Important |
   | **Ambient atmosphere** | Does the scene have ambient effects (particles, glow, grain, subtle motion)? Completely static backgrounds feel flat | 🟡Important |

3. **Generate visual report**: For each issue found, include:
   - Screenshot filename and frame number
   - Problem area description (e.g., "text in bottom-left obscured by arrow")
   - Corresponding source file and likely fix location
   - Specific fix suggestions

## Step 3: Auto-Fix

Based on issues from Step 1/2 reports, automatically modify TSX source code:

1. **Process by priority**: Fix 🔴Critical first, then 🟡Important, 🟢Minor can be skipped
2. **Fix each issue**: Read file:line from report, open source file, apply fix strategy from the corresponding [Style Check Rule](#appendix-style-check-rules) section
3. **Special handling for disabled patterns**: [§7](#7-禁用模式-remotion-项目通用) disabled patterns require rewriting animation logic to Remotion API, larger changes needed, verify each rewrite is correct
4. **Screenshot issue fixes**: [§9](#9-截图审查规则图像识别) screenshot review issues require locating source code based on specific report descriptions and fix suggestions
5. **Regression verification**: After fixes complete, re-run Step 1 code scan + Step 2 screenshot review to confirm issues resolved and no new issues introduced
6. **Loop condition**: If regression check still has 🔴Critical issues, continue fix→check loop, maximum 3 rounds

## Step 4: Start Project

After all checks pass (no 🔴Critical issues), automatically start Remotion preview:

```bash
cd remotion_video && npm start
```

## Report Format

Output Markdown report, each issue contains:
- Severity: 🔴Critical / 🟡Important / 🟢Minor
- Source: [Code Scan] or [Screenshot Review]
- File:line or Screenshot:frame
- Current value/phenomenon vs rule requirement
- Specific fix suggestion

---

## Appendix: Style Check Rules

> 本规则集适用于所有教育视频项目。执行检查时，需先从当前项目的
> style-guide.md 和 constants.ts 中提取项目特定的值（如调色板）。

### 1. 字号规则 (1920×1080 画布)
| 元素类型 | 最低值 | 推荐值 | 判定方式 |
|----------|--------|--------|----------|
| 主标题 | 72px | 96px | grep fontSize，结合变量名/上下文判断 |
| 段落标题 | 48px | 64px | 同上 |
| 正文/标签 | 40px | 48px | 同上 |
| 字幕 | 32px | 36px | Subtitle 组件的 fontSize（不宜过大） |
| 小标注 | 32px | 36px | caption 相关上下文 |
| **绝对最低值** | **32px** | — | 任何 fontSize < 32 即为 🔴严重 |

**修复策略**: fontSize < 36 → 改为 36；fontSize 低于元素类型最低值 → 改为该类型推荐值（参照上表）。

来源: style-guide.md Typography 章节

### 2. 调色板（动态提取）

**执行时**从当前项目提取批准颜色:
1. 读取 style-guide.md 中 Color System 章节的所有 hex 值
2. 读取 constants.ts / theme.ts 中定义的颜色常量
3. 汇总为本次检查的 approved palette

通用豁免:
- `rgba()` 半透明色（如 `rgba(0,0,0,0.3)` 用于阴影/遮罩）
- `#000000`, `#ffffff` 黑白基础色
- 渐变过渡色（两端色在调色板内即可）

判定: 提取 TSX 中所有 hex 色值，与 approved palette 比对。不在列表中的标记为 🟡重要。

**修复策略**: 非批准颜色 → 在调色板中找色相距离最近的颜色替换。

### 3. 安全区域 (1920×1080 画布)
- left ≥ 100, right ≤ 1820 (即 left + width ≤ 1820)
- top ≥ 60, bottom ≤ 1020 (即 top + height ≤ 1020)
- 元素超出安全区: 🔴严重
- 位置值豁免: `left: 0`、`top: 0`、`right: 0`、`bottom: 0` 豁免检查（AbsoluteFill / 全尺寸容器的标准模式）
- 字幕区域特例: y 880-1000 为标准字幕位置

**修复策略**: left < 100 → 改为 100；top < 60 → 改为 60；left + width > 1820 → 调整 left 使其 ≤ 1820 - width；top + height > 1020 → 调整 top 使其 ≤ 1020 - height。即夹紧到安全区边界。

### 4. 间距规范
合法值 (8px 倍数体系): 8, 16, 24, 32, 48, 64

判定: 提取 padding / margin / gap 数值
- 不在合法列表但为 8 的倍数 (如 40, 56): 🟢轻微
- 不为 8 的倍数 (如 14, 15, 25): 🟡重要

**修复策略**: 非 8px 倍数 → 四舍五入到最近的 8px 倍数（如 14→16, 25→24）。

### 5. 元素尺寸
- 居中主体宽度: ≥ 画布宽度 20% (≥ 384px)，否则 🟡重要
- 图标/箭头最小尺寸: ≥ 72px（推荐 96px）
- SVG strokeWidth 标准值: 2, 4, 6，非标准值 🟢轻微

**修复策略**: 图标/箭头 < 72px → 改为 96；居中主体 < 384px → 按比例放大到 384px（同时等比调整高度）。

### 6. 圆角
标准 borderRadius 值: 4, 8, 16 (px) 或 "50%" (圆形)
非标准值: 🟢轻微

**修复策略**: 非标准值 → 四舍五入到最近的标准值（4/8/16）。如值 > 16 且非 "50%"，改为 16。

### 7. 禁用模式 (Remotion 项目通用)
| 禁用模式 | 检测方式 | 严重级别 |
|----------|----------|----------|
| CSS transition | grep `transition:` in style | 🔴严重 |
| Tailwind animate-* | grep `animate-` | 🔴严重 |
| setTimeout 做动画 | grep `setTimeout` + 上下文 | 🔴严重 |
| setInterval 做动画 | grep `setInterval` + 上下文 | 🔴严重 |
| CSS @keyframes | grep `@keyframes` | 🔴严重 |
| requestAnimationFrame | grep `requestAnimationFrame` | 🔴严重 |

正确做法: 所有动画通过 useCurrentFrame() + interpolate() 或 spring()

**修复策略**: 删除 CSS transition / @keyframes / setTimeout / setInterval / requestAnimationFrame / Tailwind animate-* 等禁用模式，改写为等效的 useCurrentFrame() + interpolate()（或 spring()）动画代码。需根据原动画效果逐个改写。

### 8. 布局区域 (1920×1080 画布)
| 区域 | Y 范围 | 用途 |
|------|--------|------|
| 标题区 | 60-200 | 场景标题 |
| 内容区 | 200-700 | 核心内容 |
| 信息卡区 | 650-850 | 补充说明 |
| 字幕区 | 880-1000 | 旁白字幕 |

坐标归一化:
- `top: N` → Y 起点 = N
- `bottom: N` → Y 终点 = 1080 - N，Y 起点 = 1080 - N - 元素估算高度
- 检查时需将所有定位统一转换为 top 值后再比对

重叠检查:
- 文字与文字重叠不可读: 🔴严重
- 非字幕组件（非 SubtitleSequence / Subtitle）的文字元素，其 bottom 边界进入字幕区（Y ≥ 850）: 🔴严重
- **任何 absolute 定位的文字/卡片元素**底部与字幕区顶部（Y=880）间距 < 30px: 🟡重要

字幕定位检查:
- 字幕组件（SubtitleSequence / Subtitle）的 `bottom` 值必须为 **20**
- `bottom < 10`: 🔴严重（超出安全区底边，字幕可能被裁切）
- `bottom > 30`: 🟡重要（字幕偏高，建议使用标准值 `bottom: 20`）
- `bottom ≠ 20`: 🟢轻微（建议使用标准值 `bottom: 20`）

**修复策略**: 元素底部侵入字幕区或与字幕间距 < 30px → 上移该元素（减小 top 值或增大 bottom 值）使其底部 ≤ 850（即与字幕区保持 ≥ 30px 间距）。字幕位置不标准 → 将 `bottom` 改为 20。

### 9. 截图审查规则（图像识别）

以下规则通过渲染关键帧截图 + 图像分析执行，用于发现代码扫描无法检测的问题:

#### 关键帧选取
- 读取 constants.ts 中 SCENES 对象（或等价的场景定义）
- 每个场景取 4 帧: start（入场）、start + duration/3（1/3 帧）、start + duration*2/3（2/3 帧）、start + duration - 30（尾帧）
- 渲染命令: `npx remotion still --frame <N> --output /tmp/style-check/scene-<name>-f<N>.png <CompositionName>`

#### 图像分析流程
**重要**: 必须使用 Read 工具逐张读取每个 PNG 截图进行视觉分析。

1. 列出输出目录中所有 PNG 文件
2. **使用 Read 工具读取每个图片文件**（如 `Read /tmp/style-check/scene-hook-f0.png`）
3. 对每张图片按下方检查项表格逐一分析
4. 发现问题时记录：截图文件名、问题区域描述、对应源码位置、修复建议

#### 图像检查项
| 检查项 | 具体检查 | 严重级别 |
|--------|----------|----------|
| 文字可读性 | 文字清晰度、字号视觉效果、背景对比度 | 🔴严重 |
| 元素重叠 | 文字被遮挡、元素不当重叠、信息丢失 | 🔴严重 |
| 安全区域 | 内容被裁切、关键元素贴边 | 🔴严重 |
| 视觉平衡 | 画面重心偏移、留白不合理 | 🟡重要 |
| 颜色和谐 | 配色刺眼、对比度不足 | 🟡重要 |
| 视觉层次 | 主体不突出、信息层级混乱 | 🟡重要 |
| 整体美观 | 画面整洁度、专业感、风格一致性 | 🟢轻微 |

**修复策略**: 截图审查发现的问题需根据具体描述定位源码并修复（无固定策略，靠 AI 根据报告中的修复建议判断）。

### 严重级别汇总
- 🔴严重(必修): fontSize < 32px、超出安全区、禁用动画模式、文字重叠不可读、截图中文字被遮挡
- 🟡重要(应修): 颜色不在调色板、间距非 8px 倍数、居中元素 < 20% 画布宽、图标 < 72px、画面视觉不平衡
- 🟢轻微(可优化): 间距微偏、圆角不标准、strokeWidth 非标准、整体美观微调
