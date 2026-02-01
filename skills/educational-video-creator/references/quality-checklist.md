# Quality Checklist

Comprehensive review checklist before video delivery.

## Table of Contents

- [Automated Quality Assurance](#automated-quality-assurance)
  - [Step 1: 代码扫描检查](#step-1-代码扫描检查)
  - [Step 2: 关键帧截图审查](#step-2-关键帧截图审查)
  - [Step 3: 自动修复](#step-3-自动修复)
  - [Step 4: 启动项目](#step-4-启动项目)
  - [报告格式](#报告格式)
- [Pre-Flight Checklist](#pre-flight-checklist)
- [1. Content Quality](#1-content-quality)
- [2. Visual Quality](#2-visual-quality)
- [3. Animation Quality](#3-animation-quality)
- [4. Narration & Audio](#4-narration--audio)
- [5. Technical Quality](#5-technical-quality)
- [6. User Experience](#6-user-experience)
- [7. Final Verification](#7-final-verification)
- [Quick Reference: Common Issues](#quick-reference-common-issues)
- [Sign-Off Template](#sign-off-template)
- [Severity Levels](#severity-levels)

---

## Automated Quality Assurance

执行 SKILL.md Phase 5 时，按以下流程自动检查和修复。

### Step 1: 代码扫描检查

使用 `style-scan.ts` 脚本自动扫描所有 TSX 文件，检查样式合规性：

```bash
cd remotion_video
npx tsx <skill-scripts-path>/style-scan.ts <CompositionName>
# 可选: --output <report-path>  (默认输出到 stdout)
```

脚本会自动：
- 从 `constants.ts` 提取项目调色板（hex 颜色 + 黑白豁免）
- Glob `src/<CompositionName>/**/*.tsx` 发现所有文件
- 逐文件扫描，对照 [style-check-rules.md](style-check-rules.md) 验证
- 按严重级别（🔴严重 / 🟡重要 / 🟢轻微）生成 Markdown 报告
- 有 🔴严重问题时 exit 1

**检查项:**

| 检查项 | 提取方式 | 规则来源 |
|--------|----------|----------|
| 字号 | `fontSize: N` | style-check-rules.md §1 |
| 颜色 | hex 值与调色板比对 | style-check-rules.md §2 |
| 安全区域 | left/top/right/bottom 值 | style-check-rules.md §3 |
| 间距 | padding/margin/gap 值 | style-check-rules.md §4 |
| 元素尺寸 | size prop | style-check-rules.md §5 |
| 描边/圆角 | strokeWidth, borderRadius | style-check-rules.md §5-6 |
| 禁用模式 | transition:, animate-, setTimeout 等 | style-check-rules.md §7 |
| 布局冲突 | 非字幕文字 bottom ≥ 850 | style-check-rules.md §8 |

### Step 2: 关键帧截图审查

通过渲染实际画面截图，用图像识别检查代码扫描无法发现的视觉问题：

**步骤:**

1. **批量渲染关键帧截图**: 执行脚本自动完成帧号计算和渲染：
   ```bash
   cd remotion_video
   npx tsx <skill-scripts-path>/render-keyframes.ts <CompositionName>
   ```
   脚本会自动：
   - 读取 `src/<CompositionName>/constants.ts` 中的 SCENES 定义
   - 计算每个场景的关键帧（≤10 场景取 4 帧，>10 场景取 2 帧）
   - 逐帧执行 `npx remotion still` 渲染截图到 `/tmp/style-check/`
   - 输出渲染结果汇总（成功/失败数量、文件列表）

   可选参数：
   - `--output-dir <path>` — 输出目录（默认 `/tmp/style-check`）
   - `--frames-per-scene <2|4>` — 每场景帧数（默认 auto）

2. **逐张图像分析**: 读取每张截图，检查以下视觉问题:

   | 检查项 | 检查内容 | 严重级别 |
   |--------|----------|----------|
   | 文字可读性 | 文字是否清晰可读、字号是否过小、对比度是否足够 | 🔴严重 |
   | 元素重叠 | 文字是否被遮挡、元素是否不当重叠 | 🔴严重 |
   | 安全区域 | 关键内容是否被裁切或过于贴边 | 🔴严重 |
   | 图标合理性 | 图标是否与内容匹配、尺寸是否合适、风格是否一致 | 🔴严重 |
   | 动画合理性 | 动画是否流畅、节奏是否与内容匹配、是否有助于理解 | 🔴严重 |
   | 视觉平衡 | 画面是否偏重一侧、留白是否合理 | 🟡重要 |
   | 颜色和谐 | 配色是否协调、是否有刺眼的颜色组合 | 🟡重要 |
   | 视觉层次 | 主体是否突出、信息层级是否清晰 | 🟡重要 |
   | 整体美观 | 画面是否整洁、专业、符合教育视频风格 | 🟢轻微 |

4. **生成视觉报告**: 对每个发现的问题，附上:
   - 截图文件名和帧号
   - 问题区域描述（如"左下角文字被箭头遮挡"）
   - 对应的源码文件和可能的修复位置
   - 具体修复建议

### Step 3: 自动修复

根据 Step 1/2 报告中的问题，自动修改 TSX 源码：

1. **按优先级处理**: 先修 🔴严重，再修 🟡重要，🟢轻微可跳过
2. **逐问题修复**: 读取报告中每个问题的文件:行号，打开源文件，按 [style-check-rules.md](style-check-rules.md) 中对应规则的修复策略执行修改
3. **禁用模式特殊处理**: §7 禁用模式需重写动画逻辑为 Remotion API，修改幅度较大，需逐个确认改写是否正确
4. **截图问题修复**: §9 截图审查发现的问题，根据报告中的具体描述和修复建议定位源码并修改
5. **回归验证**: 修复完成后，重新执行 Step 1 代码扫描 + Step 2 截图审查，确认问题已解决且未引入新问题
6. **循环条件**: 若回归检查仍有 🔴严重问题，继续修复→检查循环，最多 3 轮

### Step 4: 启动项目

所有检查通过后（无 🔴严重问题），自动启动 Remotion 预览：

```bash
cd remotion_video && npm start
```

### 报告格式

输出 Markdown 报告，每个问题包含:
- 严重级别: 🔴严重 / 🟡重要 / 🟢轻微
- 来源: [代码扫描] 或 [截图审查]
- 文件:行号 或 截图:帧号
- 当前值/现象 vs 规则要求
- 具体修复建议

---

## Pre-Flight Checklist

Use this checklist before rendering the final video.

---

## 1. Content Quality

### Accuracy
- [ ] All facts and figures are correct
- [ ] Technical terms are used correctly
- [ ] No misleading simplifications
- [ ] Sources can be cited if needed

### Completeness
- [ ] All learning objectives are covered
- [ ] No unexplained concepts
- [ ] Introduction sets up the topic properly
- [ ] Conclusion summarizes key points
- [ ] No abrupt endings or missing transitions

### Clarity
- [ ] One main idea per scene
- [ ] Complex ideas broken into steps
- [ ] Jargon is explained when used
- [ ] Examples are relevant and helpful

### Flow
- [ ] Logical progression of ideas
- [ ] Smooth transitions between topics
- [ ] No jarring jumps in content
- [ ] Builds from simple to complex

---

## 2. Visual Quality

> **自动检查**: 执行上方 Automated Quality Assurance 流程可覆盖以下大部分项目。
> 规则详见 [style-check-rules.md](style-check-rules.md)。

### Style Consistency
- [ ] Colors match style guide throughout
- [ ] Typography is consistent
- [ ] Element sizes follow hierarchy
- [ ] Same style for same type of element
- [ ] Background treatment is uniform

### Composition
- [ ] Key elements are clearly visible
- [ ] Appropriate use of whitespace
- [ ] Text is readable at viewing size
- [ ] No elements cut off at edges
- [ ] Safe zones respected (100px margins)

### Layout & Layering
- [ ] All text remains fully readable
- [ ] Overlapping elements have clear visual separation
- [ ] No unintentional element collisions
- [ ] Visual hierarchy is clear (what's in front vs behind)
- [ ] Subtitle text not obscured by other UI elements
- [ ] Overlapping design looks intentional and polished
- [ ] Info cards and subtitles don't compete for same space

### Visual Clarity
- [ ] Main subject is obvious in each scene
- [ ] No visual clutter
- [ ] Labels don't overlap elements
- [ ] Sufficient contrast for readability
- [ ] Color coding is consistent

### Asset Quality
- [ ] All images are high resolution
- [ ] No pixelation or artifacts
- [ ] SVGs render crisply
- [ ] No placeholder content remaining

---

## 3. Animation Quality

### Smoothness
- [ ] Animations play at consistent frame rate
- [ ] No stuttering or jumping
- [ ] Transitions are smooth
- [ ] No sudden appearance/disappearance

### Timing
- [ ] Animation duration feels natural
- [ ] Not too fast to follow
- [ ] Not too slow (boring)
- [ ] Consistent timing for similar actions
- [ ] Staggered animations feel rhythmic

### Purpose
- [ ] Every animation serves understanding
- [ ] No purely decorative motion
- [ ] Animations direct attention appropriately
- [ ] Exit animations are complete before scene ends

### Technical
- [ ] All animations use useCurrentFrame()
- [ ] No CSS transitions in code
- [ ] No Tailwind animation classes
- [ ] Springs have appropriate damping

---

## 4. Narration & Audio

### Script Quality
- [ ] Natural, conversational tone
- [ ] Appropriate for target audience
- [ ] Matches the visual content
- [ ] No tongue-twisters or awkward phrasing

### Timing Sync
- [ ] Narration matches visual timing
- [ ] Key words align with key visuals
- [ ] Pauses at appropriate moments
- [ ] Not too rushed or too slow

### Subtitles (if applicable)
- [ ] Accurate transcription
- [ ] Proper timing (min 1.5s display)
- [ ] Line breaks at natural points
- [ ] Readable font size and contrast
- [ ] No spelling or grammar errors

### 音频检查

#### 文件完整性
- [ ] 所有 TTS 音频文件已生成且不为空
- [ ] 音频文件数量与字幕段落数量一致
- [ ] 背景音乐文件存在

#### 同步检查
- [ ] 旁白音频起止时间与字幕显示时间一致
- [ ] 相邻旁白段之间无重叠
- [ ] BGM 音量不压制旁白（建议 0.1-0.15）

#### 听觉质量
- [ ] 无音频爆音或杂音
- [ ] 段落边界过渡自然
- [ ] BGM 循环衔接自然
- [ ] TTS 发音准确，语速适当

---

## 5. Technical Quality

### Resolution & Format
- [ ] Correct resolution (1920x1080 or specified)
- [ ] Correct frame rate (30fps or specified)
- [ ] Aspect ratio is correct
- [ ] No black bars unless intended

### Performance
- [ ] Preview plays smoothly
- [ ] No rendering errors
- [ ] No missing assets
- [ ] Composition duration is correct

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Components are properly typed
- [ ] Reusable code is extracted

---

## 6. User Experience

### Pacing
- [ ] Viewers have time to read text
- [ ] Viewers have time to absorb visuals
- [ ] Appropriate pace for audience
- [ ] Engaging without overwhelming

### Engagement
- [ ] Hook captures attention
- [ ] Content maintains interest
- [ ] Visual variety prevents monotony
- [ ] Ending feels satisfying

### Accessibility
- [ ] Text is large enough to read
- [ ] Sufficient color contrast
- [ ] Important info not only in color
- [ ] Animations not too fast or flashy

---

## 7. Final Verification

### Test Renders
- [ ] Preview entire video start to finish
- [ ] Test on different screen sizes
- [ ] Check with and without sound
- [ ] Verify first and last frames

### Edge Cases
- [ ] Beginning frames look correct
- [ ] Ending frames look correct
- [ ] Transitions mid-video work
- [ ] Any dynamic content loads properly

---

## Quick Reference: Common Issues

### Visual Issues
| Problem | Solution |
|---------|----------|
| Blurry text | Increase font size, check resolution |
| Elements cut off | Adjust positioning, check safe zones |
| Color inconsistency | Review style guide, check hex values |
| Animation stuttering | Reduce complexity, check frame rate |

### Content Issues
| Problem | Solution |
|---------|----------|
| Confusing explanation | Break into smaller steps |
| Too much on screen | Progressive disclosure |
| Pacing too fast | Extend scene duration, add pauses |
| Abrupt transitions | Add fade or transition between scenes |

### Technical Issues
| Problem | Solution |
|---------|----------|
| Render fails | Check for missing assets, TypeScript errors |
| Wrong duration | Verify frame calculations |
| Animation wrong | Check useCurrentFrame usage |
| Asset not showing | Check path, use staticFile() |

---

## Sign-Off Template

```markdown
## Video Quality Sign-Off

**Video Title**: ________________________
**Date**: ________________________
**Reviewer**: ________________________

### Checklist Completion
- [ ] Content Quality: ____/4 sections passed
- [ ] Visual Quality: ____/4 sections passed
- [ ] Animation Quality: ____/4 sections passed
- [ ] Narration & Audio: ____/4 sections passed
- [ ] Technical Quality: ____/3 sections passed
- [ ] User Experience: ____/3 sections passed

### Issues Found
1. ________________________
2. ________________________
3. ________________________

### Resolution Status
- [ ] All issues resolved
- [ ] Ready for delivery

### Notes
________________________
________________________
```

---

## Severity Levels

When issues are found, categorize them:

**🔴 Critical** - Must fix before delivery
- Factual errors
- Missing content
- Render failures
- Major visual bugs

**🟡 Major** - Should fix if time allows
- Timing issues
- Style inconsistencies
- Minor visual bugs
- Suboptimal pacing

**🟢 Minor** - Nice to fix
- Small alignment issues
- Slight timing tweaks
- Polish and refinement
