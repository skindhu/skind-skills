/**
 * style-scan.ts
 *
 * Automated style compliance scanner for educational video compositions.
 * Scans all TSX files in a composition directory against quantified rules
 * from style-check-rules.md and outputs a Markdown report.
 *
 * Usage (run from remotion_video/ directory):
 *   npx tsx <path>/style-scan.ts <CompositionName>
 *
 * Options:
 *   --output <report-path>   Write report to file (default: stdout)
 */

import { readFileSync, writeFileSync, existsSync, globSync } from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && idx + 1 < process.argv.length
    ? process.argv[idx + 1]
    : undefined;
}

const compositionName = process.argv[2];

if (!compositionName || compositionName.startsWith("--")) {
  console.error(
    "Usage: npx tsx style-scan.ts <CompositionName> [--output <report-path>]",
  );
  process.exit(1);
}

const outputPath = getArg("--output");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = "critical" | "important" | "minor";

interface Issue {
  severity: Severity;
  file: string;
  line: number;
  message: string;
  fix: string;
}

// ---------------------------------------------------------------------------
// 1. Extract palette from constants.ts
// ---------------------------------------------------------------------------

const constantsPath = path.resolve(`./src/${compositionName}/constants.ts`);

if (!existsSync(constantsPath)) {
  console.error(`constants.ts not found: ${constantsPath}`);
  process.exit(1);
}

const constantsContent = readFileSync(constantsPath, "utf-8");

function extractHexColors(source: string): Set<string> {
  const matches = source.match(/#[0-9a-fA-F]{3,6}\b/g) || [];
  return new Set(matches.map((c) => c.toLowerCase()));
}

const approvedPalette = extractHexColors(constantsContent);
// Always exempt black, white
approvedPalette.add("#000000");
approvedPalette.add("#000");
approvedPalette.add("#ffffff");
approvedPalette.add("#fff");

// ---------------------------------------------------------------------------
// 2. Glob TSX files
// ---------------------------------------------------------------------------

const tsxPattern = `./src/${compositionName}/**/*.tsx`;
const tsxFiles = globSync(tsxPattern).sort();

if (tsxFiles.length === 0) {
  console.error(`No TSX files found matching: ${tsxPattern}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Scanning rules
// ---------------------------------------------------------------------------

const DISABLED_PATTERNS = [
  { pattern: /transition\s*:/, label: "CSS transition" },
  { pattern: /animate-/, label: "Tailwind animate-*" },
  { pattern: /setTimeout/, label: "setTimeout" },
  { pattern: /setInterval/, label: "setInterval" },
  { pattern: /@keyframes/, label: "@keyframes" },
  { pattern: /requestAnimationFrame/, label: "requestAnimationFrame" },
];

const VALID_BORDER_RADIUS = new Set([4, 8, 16]);
const VALID_STROKE_WIDTH = new Set([2, 4, 6]);

function isMultipleOf8(n: number): boolean {
  return n % 8 === 0;
}

function scanFile(filePath: string): Issue[] {
  const issues: Issue[] = [];
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relPath = path.relative(".", filePath);

  // Determine if this is a subtitle component file
  const isSubtitleComponent =
    /Subtitle/i.test(path.basename(filePath)) ||
    /SubtitleSequence/i.test(content.split("\n").slice(0, 10).join(""));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip comments and imports
    if (/^\s*(\/\/|\/\*|\*|import\s)/.test(line)) continue;

    // --- fontSize check ---
    const fontSizeMatch = line.match(/fontSize\s*:\s*(\d+)/);
    if (fontSizeMatch) {
      const size = Number(fontSizeMatch[1]);
      if (size < 24) {
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `fontSize: ${size} (minimum: 24)`,
          fix: "Change to 24",
        });
      }
    }

    // --- Color check ---
    const hexMatches = line.match(/#[0-9a-fA-F]{3,6}\b/g);
    if (hexMatches) {
      for (const hex of hexMatches) {
        const normalized = hex.toLowerCase();
        if (!approvedPalette.has(normalized)) {
          // Check if it's inside a comment
          const beforeHex = line.indexOf(hex);
          const prefix = line.slice(0, beforeHex);
          if (/\/\//.test(prefix)) continue;

          issues.push({
            severity: "important",
            file: relPath,
            line: lineNum,
            message: `Color ${hex} not in approved palette`,
            fix: "Replace with nearest palette color from constants.ts",
          });
        }
      }
    }

    // --- rgba exemption: skip rgba colors entirely ---
    // (no check needed — rgba is exempt)

    // --- Safe area check ---
    const leftMatch = line.match(/\bleft\s*:\s*(\d+)/);
    if (leftMatch) {
      const val = Number(leftMatch[1]);
      if (val < 100) {
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `left: ${val} (safe zone minimum: 100)`,
          fix: "Change to 100",
        });
      }
    }

    const topMatch = line.match(/\btop\s*:\s*(\d+)/);
    if (topMatch) {
      const val = Number(topMatch[1]);
      if (val < 60) {
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `top: ${val} (safe zone minimum: 60)`,
          fix: "Change to 60",
        });
      }
    }

    const rightMatch = line.match(/\bright\s*:\s*(\d+)/);
    if (rightMatch) {
      const val = Number(rightMatch[1]);
      if (val < 100) {
        // right: N means N px from right edge → actual right position = 1920 - N
        // If right < 100, content extends to within 100px of right edge — that's okay
        // Actually: CSS right: N means element's right edge is N px from container right
        // So right < 100 means element is within 100px of right edge — OUTSIDE safe zone
        // But wait: right: 50 means 50px from right → position 1870, which is > 1820
        // So small right values are violations
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `right: ${val} (element extends beyond safe zone, right edge at ${1920 - val})`,
          fix: "Change to at least 100",
        });
      }
    }

    const bottomMatch = line.match(/\bbottom\s*:\s*(\d+)/);
    if (bottomMatch) {
      const val = Number(bottomMatch[1]);
      if (val < 60) {
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `bottom: ${val} (element extends beyond safe zone, bottom edge at ${1080 - val})`,
          fix: "Change to at least 60",
        });
      }
    }

    // --- Spacing check (padding / margin / gap) ---
    const spacingPatterns = [
      /padding\s*:\s*(\d+)/,
      /paddingTop\s*:\s*(\d+)/,
      /paddingBottom\s*:\s*(\d+)/,
      /paddingLeft\s*:\s*(\d+)/,
      /paddingRight\s*:\s*(\d+)/,
      /margin\s*:\s*(\d+)/,
      /marginTop\s*:\s*(\d+)/,
      /marginBottom\s*:\s*(\d+)/,
      /marginLeft\s*:\s*(\d+)/,
      /marginRight\s*:\s*(\d+)/,
      /gap\s*:\s*(\d+)/,
    ];

    for (const sp of spacingPatterns) {
      const m = line.match(sp);
      if (m) {
        const val = Number(m[1]);
        if (val === 0) continue; // 0 is always fine
        if (!isMultipleOf8(val)) {
          issues.push({
            severity: "important",
            file: relPath,
            line: lineNum,
            message: `Spacing ${m[0].trim()}: ${val} is not a multiple of 8`,
            fix: `Round to nearest 8px multiple: ${Math.round(val / 8) * 8}`,
          });
        }
      }
    }

    // --- Element size check (icons) ---
    const sizeMatch = line.match(/\bsize\s*:\s*(\d+)/);
    if (sizeMatch) {
      const val = Number(sizeMatch[1]);
      if (val < 48 && val > 0) {
        issues.push({
          severity: "important",
          file: relPath,
          line: lineNum,
          message: `Icon/element size: ${val} (minimum: 48)`,
          fix: "Change to 48",
        });
      }
    }

    // --- strokeWidth check ---
    const strokeMatch = line.match(/strokeWidth\s*:\s*(\d+)/);
    if (strokeMatch) {
      const val = Number(strokeMatch[1]);
      if (!VALID_STROKE_WIDTH.has(val)) {
        issues.push({
          severity: "minor",
          file: relPath,
          line: lineNum,
          message: `strokeWidth: ${val} (standard values: 2, 4, 6)`,
          fix: `Change to nearest standard value: ${[2, 4, 6].reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a)}`,
        });
      }
    }

    // --- borderRadius check ---
    const radiusMatch = line.match(/borderRadius\s*:\s*(\d+)/);
    if (radiusMatch) {
      const val = Number(radiusMatch[1]);
      if (!VALID_BORDER_RADIUS.has(val)) {
        issues.push({
          severity: "minor",
          file: relPath,
          line: lineNum,
          message: `borderRadius: ${val} (standard values: 4, 8, 16 or "50%")`,
          fix: `Change to nearest standard value: ${[4, 8, 16].reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a)}`,
        });
      }
    }
    // borderRadius with "50%" is always fine — string match won't hit the numeric regex

    // --- Disabled patterns ---
    for (const dp of DISABLED_PATTERNS) {
      if (dp.pattern.test(line)) {
        issues.push({
          severity: "critical",
          file: relPath,
          line: lineNum,
          message: `Disabled pattern detected: ${dp.label}`,
          fix: "Remove and rewrite using useCurrentFrame() + interpolate() or spring()",
        });
      }
    }

    // --- Subtitle position check: ensure subtitle stays near bottom ---
    if (isSubtitleComponent) {
      const subtitleBottomMatch = line.match(/\bbottom\s*:\s*(\d+)/);
      if (subtitleBottomMatch) {
        const bottomVal = Number(subtitleBottomMatch[1]);
        if (bottomVal < 60) {
          issues.push({
            severity: "critical",
            file: relPath,
            line: lineNum,
            message: `Subtitle bottom: ${bottomVal} (below safe zone minimum: 60)`,
            fix: "Change to 60 (standard subtitle position)",
          });
        } else if (bottomVal > 120) {
          issues.push({
            severity: "important",
            file: relPath,
            line: lineNum,
            message: `Subtitle bottom: ${bottomVal} (too high, may overlap with content. Standard range: 60-120)`,
            fix: "Change to 60 (standard subtitle position)",
          });
        }
      }
    }

    // --- Layout conflict: non-subtitle text entering subtitle zone ---
    if (!isSubtitleComponent) {
      // Check for bottom positioning that might enter subtitle area (Y >= 850)
      const bottomPosMatch = line.match(/\bbottom\s*:\s*(\d+)/);
      if (bottomPosMatch) {
        const bottomVal = Number(bottomPosMatch[1]);
        const yPosition = 1080 - bottomVal;
        // Already handled in safe area check above for < 60
        // Check for text entering subtitle zone
        if (yPosition >= 850 && bottomVal >= 60) {
          // Check context: is this a text element?
          const contextLines = lines.slice(Math.max(0, i - 5), i + 5).join("\n");
          if (/fontSize|fontWeight|fontFamily|text|Text|label|Label|<p|<h|<span/.test(contextLines)) {
            issues.push({
              severity: "critical",
              file: relPath,
              line: lineNum,
              message: `Text element bottom at Y=${yPosition} (≥850) intrudes into subtitle zone`,
              fix: "Move element up so bottom edge ≤ 850",
            });
          }
        }
      }

      // Also check top-based positioning
      const topPosMatch = line.match(/\btop\s*:\s*(\d+)/);
      if (topPosMatch) {
        const topVal = Number(topPosMatch[1]);
        if (topVal >= 850) {
          const contextLines = lines.slice(Math.max(0, i - 5), i + 5).join("\n");
          if (/fontSize|fontWeight|fontFamily|text|Text|label|Label|<p|<h|<span/.test(contextLines)) {
            issues.push({
              severity: "critical",
              file: relPath,
              line: lineNum,
              message: `Text element at top: ${topVal} (≥850) intrudes into subtitle zone`,
              fix: "Move element up so its position is ≤ 850",
            });
          }
        }
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 4. Run scan
// ---------------------------------------------------------------------------

const allIssues: Issue[] = [];

for (const file of tsxFiles) {
  allIssues.push(...scanFile(file));
}

// ---------------------------------------------------------------------------
// 5. Generate report
// ---------------------------------------------------------------------------

const critical = allIssues.filter((i) => i.severity === "critical");
const important = allIssues.filter((i) => i.severity === "important");
const minor = allIssues.filter((i) => i.severity === "minor");

function formatIssue(issue: Issue): string {
  return `- \`${issue.file}:${issue.line}\` ${issue.message}\n  Fix: ${issue.fix}`;
}

const reportLines: string[] = [
  `# Style Scan Report: ${compositionName}`,
  "",
  `Scanned ${tsxFiles.length} files, found ${allIssues.length} issues (${critical.length} critical)`,
  "",
];

if (critical.length > 0) {
  reportLines.push("## 🔴 Critical", "");
  for (const issue of critical) {
    reportLines.push(formatIssue(issue));
    reportLines.push("");
  }
}

if (important.length > 0) {
  reportLines.push("## 🟡 Important", "");
  for (const issue of important) {
    reportLines.push(formatIssue(issue));
    reportLines.push("");
  }
}

if (minor.length > 0) {
  reportLines.push("## 🟢 Minor", "");
  for (const issue of minor) {
    reportLines.push(formatIssue(issue));
    reportLines.push("");
  }
}

if (allIssues.length === 0) {
  reportLines.push("No issues found. All checks passed.");
}

const report = reportLines.join("\n");

// ---------------------------------------------------------------------------
// 6. Output
// ---------------------------------------------------------------------------

if (outputPath) {
  writeFileSync(outputPath, report, "utf-8");
  console.log(`Report written to ${outputPath}`);
} else {
  console.log(report);
}

// Exit code: 1 if critical issues exist
if (critical.length > 0) {
  process.exit(1);
}
