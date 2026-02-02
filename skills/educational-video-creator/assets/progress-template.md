# Video Production Progress

## Project Info
- **Topic**: [填入]
- **Composition**: [填入]
- **Created**: [日期]
- **Last Updated**: [日期时间]

## Phase Checklist

### Prerequisites
- [ ] `remotion-best-practices` skill installed (`npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices`)
- [ ] Read remotion-best-practices skill for Remotion API details

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

### Phase 3: Visual Design
- [ ] Color palette defined in constants.ts
- [ ] Scene-level background variants defined (COLORS.sceneBg) if needed
- [ ] Typography configured
- [ ] Font loading verified (`@remotion/google-fonts` loadFont() — no subset args)
- [ ] COLORS object created with all project colors
- **Output**: `src/<Composition>/constants.ts` (COLORS section)

### Phase 4: Animation Production
- [ ] Project structure created (Root.tsx, index.ts, etc.)
- [ ] constants.ts: SCENES, NARRATION, COLORS, estimated AUDIO_SEGMENTS
- [ ] Main composition with persistent background layer
- [ ] Each scene has its own solid background (first child element)
- [ ] Scene components created (list each):
  - [ ] Scene 1: [name] — [status]
  - [ ] Scene 2: [name] — [status]
  - [ ] ...
- [ ] SubtitleSequence component
- [ ] All colors via COLORS object (no hardcoded hex in TSX)
- [ ] All subtitles via AUDIO_SEGMENTS reference
- [ ] `npm start` — preview runs without errors
- **Key files**: [列出已创建的文件]

### Phase 4.5: Audio Generation
- [ ] edge-tts installed
- [ ] TTS audio generated (segments: __)
- [ ] Timeline rebuilt (rebuild-timeline.ts --write)
- [ ] AUDIO_SEGMENTS updated with real timing
- [ ] BGM sourced and placed
- [ ] AudioLayer component created
- [ ] Audio integrated into main composition
- [ ] Narration-subtitle sync verified
- **Audio files**: `public/audio/narration/` (__ files)

### Phase 5: Quality Assurance
- [ ] Round 1: style-scan — issues: __ critical, __ important
- [ ] Round 1: keyframe screenshots rendered
- [ ] Round 1: visual review completed
- [ ] Round 1: fixes applied
- [ ] Round 2 (if needed): re-scan — issues: __
- [ ] Round 2 (if needed): re-screenshot + review
- [ ] All critical issues resolved
- [ ] `npm start` — final preview launched
- **Report**: [扫描结果摘要]

## Decisions Log
<!-- Record key design decisions so they survive context compaction -->
| Decision | Chosen | Why |
|----------|--------|-----|

## Blockers / Issues
<!-- Track unresolved issues -->
- (none)
