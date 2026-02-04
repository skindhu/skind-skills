# Video Production Progress

## Current State
- **Current Phase**: [1 / 1.5 / 2 / 3 / 4 / 4.5 / 5 / 6 / Done]
- **Current Step**: [简述当前正在做的事]
- **Last Updated**: [时间戳]

## Project Info
- **Topic**: [填入]
- **Composition**: [填入]
- **Created**: [日期]

## Phase Checklist

### Prerequisites (⚠️ Complete BEFORE Phase 1)
- [ ] `remotion-best-practices` skill installed — run: `npx skills list 2>/dev/null | grep remotion-best-practices || npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices`
- [ ] Read remotion-best-practices skill for Remotion API details (required for correct Remotion API usage in Phase 4)

### Phase 1: Requirements Gathering
- [ ] Confirmed topic and key learning points
- [ ] Confirmed audience (age, knowledge level)
- [ ] Confirmed language
- [ ] Confirmed target duration
- **Notes**: [用户的具体需求摘要]

### Phase 1.5: Script Writing
- [ ] Core message defined
- [ ] Narrative strategy designed
- [ ] Full narration text written
- [ ] Pacing notes added
- [ ] User approved script
- **Output**: `remotion_video/script.md`

### Phase 2: Storyboard Design
- [ ] Script broken into scenes (count: __)
- [ ] Narration assigned to each scene
- [ ] Visual layers designed per scene
- [ ] Animation specs added (spring, easing, timing)
- [ ] Visual-narration sync points defined
- [ ] Asset inventory planned
- [ ] User approved storyboard
- **Output**: `remotion_video/storyboard.md`
- **Scene list**: [列出场景键名，如 hook, intro, concept1, concept2, summary, outro]

### Phase 3: Visual Design
- [ ] Color palette defined → see `constants.ts` COLORS object
- [ ] Scene-level background variants defined (COLORS.sceneBg) if needed
- [ ] Typography configured (`@remotion/google-fonts` loadFont())
- [ ] COLORS object created with all project colors
- **Palette choice**: [调色板名称或自定义理由]
- **Output**: `src/<Composition>/constants.ts` (COLORS section)

### Phase 4: Animation Production
- [ ] Project structure created (Root.tsx, index.ts, etc.)
- [ ] constants.ts: SCENES, NARRATION, COLORS, estimated AUDIO_SEGMENTS
- [ ] Main composition with persistent background layer
- [ ] Each scene has its own solid background (first child element)
- [ ] Scene components created:
  <!-- 按 storyboard 场景数量填充，每场景一行。完成一个勾一个 -->
  - [ ] [scene_key]: Component + SVG elements + animations
  - [ ] [scene_key]: Component + SVG elements + animations
  <!-- ... 按实际场景数添加更多行 ... -->
- [ ] SubtitleSequence component
- [ ] All colors via COLORS object (no hardcoded hex in TSX)
- [ ] All subtitles via AUDIO_SEGMENTS reference
- [ ] `npm start` — preview runs without errors

### Phase 4.5: Audio Generation
- [ ] edge-tts installed and verified
- [ ] TTS audio generated (segments: __)
- [ ] Timeline rebuilt (rebuild-timeline.ts --write)
- [ ] AUDIO_SEGMENTS updated with real timing
- [ ] BGM sourced and placed
- [ ] AudioLayer component created
- [ ] Audio integrated into main composition
- [ ] Narration-subtitle sync verified
- **Audio files**: `public/audio/narration/` (__ files)

### Phase 5: Quality Assurance
- [ ] Round 1: style-scan — Critical: __, Important: __, Minor: __
  <!-- 列出 Critical issues（如有），每个一行 -->
- [ ] Round 1: keyframe screenshots rendered
- [ ] Round 1: visual review completed
- [ ] Round 1: fixes applied
- [ ] Round 2 (if needed): re-scan — Critical: __, Important: __
- [ ] Round 2 (if needed): re-screenshot + review
- [ ] All critical issues resolved
- [ ] `npm start` — final preview launched
- **Report**: [扫描结果摘要]

### Phase 6: Final Export
- [ ] `npx remotion render` — video exported
- **Output**: `remotion_video/out/video.mp4`

## Files Created
<!-- 每创建一个文件就添加一行。Context recovery 时用于验证文件是否存在 -->
- `src/<Composition>/constants.ts`
- `src/<Composition>/index.tsx`
<!-- - `src/<Composition>/scenes/SceneHook.tsx` -->
<!-- - `src/<Composition>/components/AudioLayer.tsx` -->
<!-- - `src/<Composition>/components/SubtitleSequence.tsx` -->

## Decisions Log
<!-- Record key design decisions so they survive context compaction -->
| Decision | Chosen | Why |
|----------|--------|-----|

## Blockers / Errors
<!-- 记录脚本失败或阻塞问题，附恢复命令 -->
| Error | Phase | Status | Recovery Command |
|-------|-------|--------|-----------------|
| (none) | — | — | — |
