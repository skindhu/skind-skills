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

---

Execute the following automated check and fix workflow during SKILL.md Phase 5.

## Step 1: Code Scanning

Use the `style-scan.ts` script to automatically scan all TSX files for style compliance:

```bash
cd remotion_video
npx tsx <skill-scripts-path>/style-scan.ts <CompositionName>
# Optional: --output <report-path>  (defaults to stdout)
```

The script will automatically:
- Extract project color palette from `constants.ts` (hex colors + black/white exemptions)
- Glob `src/<CompositionName>/**/*.tsx` to discover all files
- Scan each file against [style-check-rules.md](style-check-rules.md) rules
- Generate Markdown report by severity (🔴Critical / 🟡Important / 🟢Minor)
- Exit with code 1 if any 🔴Critical issues found

**Check Items:**

| Check Item | Extraction Method | Rule Source |
|------------|-------------------|-------------|
| Font size | `fontSize: N` | style-check-rules.md §1 |
| Colors | Compare hex values against palette | style-check-rules.md §2 |
| Safe zones | left/top/right/bottom values | style-check-rules.md §3 |
| Spacing | padding/margin/gap values | style-check-rules.md §4 |
| Element size | size prop | style-check-rules.md §5 |
| Stroke/radius | strokeWidth, borderRadius | style-check-rules.md §5-6 |
| Disabled patterns | transition:, animate-, setTimeout, etc. | style-check-rules.md §7 |
| Layout conflicts | Non-subtitle text with bottom ≥ 850 | style-check-rules.md §8 |

## Step 2: Keyframe Screenshot Review

Render actual frame screenshots and use image analysis to check visual issues that code scanning cannot detect:

**Steps:**

1. **Batch render keyframe screenshots**: Execute the script to automatically calculate frame numbers and render:
   ```bash
   cd remotion_video
   npx tsx <skill-scripts-path>/render-keyframes.ts <CompositionName>
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
   | Safe zones | Is key content cropped or too close to edges | 🟡Important |
   | Icon appropriateness | Do icons match content, appropriate size, consistent style | 🟡Important |
   | Animation reasonableness | Is animation smooth, rhythm matches content, aids understanding | 🟡Important |
   | Transparent/checkerboard frames | Are there frames showing checkerboard (transparent) or pure white/black backgrounds | 🟡Important |

3. **Generate visual report**: For each issue found, include:
   - Screenshot filename and frame number
   - Problem area description (e.g., "text in bottom-left obscured by arrow")
   - Corresponding source file and likely fix location
   - Specific fix suggestions

## Step 3: Auto-Fix

Based on issues from Step 1/2 reports, automatically modify TSX source code:

1. **Process by priority**: Fix 🔴Critical first, then 🟡Important, 🟢Minor can be skipped
2. **Fix each issue**: Read file:line from report, open source file, apply fix strategy from [style-check-rules.md](style-check-rules.md) for the corresponding rule
3. **Special handling for disabled patterns**: §7 disabled patterns require rewriting animation logic to Remotion API, larger changes needed, verify each rewrite is correct
4. **Screenshot issue fixes**: §9 screenshot review issues require locating source code based on specific report descriptions and fix suggestions
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
