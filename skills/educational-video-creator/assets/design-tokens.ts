/**
 * design-tokens.ts
 *
 * Combined design reference for Phase 3: Visual Design.
 * Contains color palettes, typography presets, and the constants.ts template.
 *
 * Section 1: Color Palettes — pre-defined Kurzgesagt/回形针 inspired color schemes
 * Section 2: Typography Presets — font loading, sizes, and style presets
 * Section 3: Constants Template — the constants.ts structure to copy into projects
 */

import React from 'react';
import { loadFont as loadNotoSansSC } from '@remotion/google-fonts/NotoSansSC';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

// ============================================================================
// SECTION 1: COLOR PALETTES
// ============================================================================

// ============================================
// DEFAULT PALETTE (Deep Space Theme)
// ============================================

export const DEFAULT_COLORS = {
  // Background Colors
  background: {
    dark: '#1a1a2e',      // Deep space blue - default background
    medium: '#16213e',    // Medium blue - secondary backgrounds
    light: '#0f3460',     // Lighter blue - highlights
  },

  // Accent Colors
  accent: {
    rose: '#e94560',      // Warm accent - important elements
    yellow: '#f9ed69',    // Bright accent - highlights
    teal: '#00b8a9',      // Cool accent - secondary info
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    lightGray: '#f0f0f0',
    darkGray: '#2d2d2d',
    muted: '#b0b0b0',
  },

  // Semantic Colors
  semantic: {
    positive: '#00b894',  // Good, correct, success
    negative: '#e17055',  // Bad, wrong, warning
    neutral: '#74b9ff',   // Neutral information
  },

  // Force Diagram Colors
  forces: {
    lift: '#4facfe',      // Lift force (blue)
    gravity: '#fa709a',   // Gravity force (pink)
    thrust: '#38ef7d',    // Thrust force (green)
    drag: '#eb3349',      // Drag force (red)
  },
};

// ============================================
// ALTERNATE PALETTES
// ============================================

/**
 * Warm Sunset Theme
 * For topics about energy, warmth, human body
 */
export const WARM_PALETTE = {
  background: {
    dark: '#2d1b2e',
    medium: '#3d2a3e',
    light: '#4d3a4e',
  },
  accent: {
    primary: '#ff6b6b',
    secondary: '#feca57',
    tertiary: '#ff9ff3',
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#f8f8f8',
    darkGray: '#3d3d3d',
    muted: '#a0a0a0',
  },
};

/**
 * Ocean Theme
 * For topics about water, marine life, environment
 */
export const OCEAN_PALETTE = {
  background: {
    dark: '#0a1628',
    medium: '#132743',
    light: '#1e3a5f',
  },
  accent: {
    primary: '#00cec9',
    secondary: '#74b9ff',
    tertiary: '#a29bfe',
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#dfe6e9',
    darkGray: '#2d3436',
    muted: '#b2bec3',
  },
};

/**
 * Nature Theme
 * For topics about plants, ecology, biology
 */
export const NATURE_PALETTE = {
  background: {
    dark: '#1a2e1a',
    medium: '#264d26',
    light: '#3d6b3d',
  },
  accent: {
    primary: '#55efc4',
    secondary: '#81ecec',
    tertiary: '#ffeaa7',
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#f0f5f0',
    darkGray: '#2d3d2d',
    muted: '#a0b0a0',
  },
};

// ============================================
// COLOR UTILITY FUNCTIONS
// ============================================

/**
 * Create a gradient string from two colors
 */
export const createGradient = (
  color1: string,
  color2: string,
  direction: 'vertical' | 'horizontal' | 'diagonal' = 'vertical'
): string => {
  const directionMap = {
    vertical: '180deg',
    horizontal: '90deg',
    diagonal: '135deg',
  };
  return `linear-gradient(${directionMap[direction]}, ${color1} 0%, ${color2} 100%)`;
};

/**
 * Get default background gradient
 */
export const getBackgroundGradient = (
  colors = DEFAULT_COLORS
): string => {
  return createGradient(colors.background.dark, colors.background.medium);
};

/**
 * Add alpha channel to hex color
 */
export const withAlpha = (hex: string, alpha: number): string => {
  // Normalize 3-digit hex (#fff) to 6-digit (#ffffff)
  let normalized = hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    normalized = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// SECTION 2: TYPOGRAPHY PRESETS
// ============================================================================

// ============================================
// FONT LOADING (Remotion Google Fonts)
// ============================================

// Load fonts via Remotion's bundler — these return the correct fontFamily strings
const notoSansSC = loadNotoSansSC();
const inter = loadInter();

// ============================================
// FONT FAMILY DEFINITIONS
// ============================================

export const FONT_FAMILIES = {
  // Primary - for Chinese text (loaded via @remotion/google-fonts)
  chinese: notoSansSC.fontFamily,

  // Secondary - for English/numbers (loaded via @remotion/google-fonts)
  english: inter.fontFamily,

  // Monospace - for code/technical (system fallback)
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

// ============================================
// FONT SIZE SCALE (1920x1080)
// ============================================

export const FONT_SIZES = {
  title: 72,       // Main titles
  heading: 48,     // Section headings
  body: 36,        // Body text, subtitles
  caption: 36,     // Small labels, captions (style-check-rules minimum: 32)
  tiny: 32,        // Disclaimers, credits (absolute minimum per style-check-rules)

  // Absolute minimum for readability (enforced by style-scan.ts)
  minimum: 32,
};

// ============================================
// TYPOGRAPHY PRESETS
// ============================================

export const TYPOGRAPHY = {
  // Main title - largest, boldest
  title: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.title,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,

  // Section heading
  heading: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.heading,
    fontWeight: 600,
    lineHeight: 1.3,
  } as React.CSSProperties,

  // Body text and subtitles
  body: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.body,
    fontWeight: 400,
    lineHeight: 1.5,
  } as React.CSSProperties,

  // Labels and captions
  caption: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.caption,
    fontWeight: 500,
    lineHeight: 1.4,
  } as React.CSSProperties,

  // Small text
  tiny: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.tiny,
    fontWeight: 400,
    lineHeight: 1.4,
  } as React.CSSProperties,

  // Bold emphasis
  emphasis: {
    fontFamily: FONT_FAMILIES.chinese,
    fontSize: FONT_SIZES.body,
    fontWeight: 700,
    lineHeight: 1.5,
  } as React.CSSProperties,

  // Numbers/statistics
  number: {
    fontFamily: FONT_FAMILIES.english,
    fontSize: FONT_SIZES.heading,
    fontWeight: 700,
    lineHeight: 1.2,
  } as React.CSSProperties,
};

// ============================================
// SUBTITLE STYLES
// ============================================

export const SUBTITLE_STYLE = {
  ...TYPOGRAPHY.body,
  color: '#ffffff',
  textAlign: 'center' as const,
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
};

export const SUBTITLE_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  bottom: 20, // Standard subtitle position. style-scan flags values !== 20.
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '0 100px',
};

export const SUBTITLE_BOX_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '12px 24px',
  borderRadius: 8,
  maxWidth: '80%',
};

// ============================================
// TEXT SHADOW PRESETS
// ============================================

export const TEXT_SHADOWS = {
  none: 'none',
  subtle: '1px 1px 2px rgba(0,0,0,0.2)',
  medium: '2px 2px 4px rgba(0,0,0,0.3)',
  strong: '3px 3px 6px rgba(0,0,0,0.5)',
  glow: '0 0 10px rgba(255,255,255,0.5)',
};

// ============================================================================
// SECTION 3: CONSTANTS TEMPLATE
// ============================================================================
//
// Template for the project's constants.ts — the central data hub.
// All scripts (generate-tts, rebuild-timeline, style-scan) read from this file.
//
// Copy this section into your composition directory and customize:
//   src/<CompositionName>/constants.ts
//
// ---------------------------------------------------------------------------
// Example constants.ts structure:
// ---------------------------------------------------------------------------
//
// import { loadFont } from "@remotion/google-fonts/NotoSansSC";
// import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
//
// // Font loading — call with NO arguments to load all subsets.
// // Do NOT pass subsets: ["chinese-simplified"] — Remotion v4 uses
// // Unicode range numbers as subset names, not human-readable names.
// const { fontFamily: notoSansSC } = loadFont();
// const { fontFamily: inter } = loadInter();
//
// export const FONTS = { notoSansSC, inter };
//
// // ---------------------------------------------------------------------------
// // Color Palette
// // ---------------------------------------------------------------------------
//
// export const COLORS = {
//   background: {
//     dark: "#1a1a2e",
//     medium: "#16213e",
//     light: "#0f3460",
//   },
//   accent: {
//     rose: "#e94560",
//     yellow: "#f9ed69",
//     teal: "#00b8a9",
//   },
//   text: "#ffffff",
//   textMuted: "#b0b0b0",
//
//   // Scene-level backgrounds (optional, see style-guide.md § Scene-Level Palette Variation)
//   sceneBg: {
//     space: ["#0a0a1a", "#1a1a2e"],
//     ocean: ["#0a1628", "#0f3460"],
//     biology: ["#1a2e1a", "#163e2e"],
//     energy: ["#2e1a1a", "#3e1621"],
//     tech: ["#1a1a2e", "#16213e"],
//   },
// };
//
// // ---------------------------------------------------------------------------
// // Scene Timeline
// // ---------------------------------------------------------------------------
// // Keys must match NARRATION keys below.
// // Phase 4: use estimated durations. Phase 4.5: rebuild-timeline.ts overwrites.
//
// export const SCENES = {
//   hook: { start: 0, duration: 150 },
//   concept: { start: 150, duration: 300 },
//   summary: { start: 450, duration: 120 },
// } as const;
//
// export const TRANSITION_DURATION = 20;
//
// export const TOTAL_FRAMES = 570;
//
// // ---------------------------------------------------------------------------
// // Narration Text (source for TTS)
// // ---------------------------------------------------------------------------
// // Keys should match SCENES keys. Values are the FULL spoken text.
// // generate-tts.ts extracts text from this object and auto-splits into segments.
//
// export const NARRATION = {
//   hook: "你有没有想过，为什么天空是蓝色的？",
//   concept:
//     "秘密要从阳光说起。阳光看起来是白色的，但其实它包含了所有颜色。当阳光进入大气层，蓝色光因为波长短，更容易被空气分子散射到各个方向。",
//   summary: "所以我们看到的蓝天，就是散射的蓝色光。",
// } as const;
//
// // ---------------------------------------------------------------------------
// // Audio Segments (auto-generated by rebuild-timeline.ts)
// // ---------------------------------------------------------------------------
// // Phase 4: Use estimated timing below. Phase 4.5: rebuild-timeline.ts --write
// // will overwrite this entire block with real durations from TTS audio files.
// //
// // ⚠️ IMPORTANT: startFrame / endFrame are SCENE-LOCAL frame numbers (NOT global).
// // Each scene's segments start from SCENE_PAD (default 15), because:
// //   - AudioLayer wraps each scene in <Sequence from={scene.start}>, so inner
// //     <Sequence from={seg.startFrame}> treats startFrame as relative to scene start.
// //   - Scene components inside TransitionSeries.Sequence get local frames from
// //     useCurrentFrame() (resets to 0 at scene start).
// // If you use global frame numbers here, subtitles in later scenes will be
// // delayed or invisible (startFrame exceeds scene duration).
//
// export const AUDIO_SEGMENTS = {
//   hook: [
//     {
//       text: "你有没有想过",
//       file: "audio/narration/hook-seg00.mp3",
//       startFrame: 15,
//       endFrame: 50,
//     },
//     {
//       text: "为什么天空是蓝色的",
//       file: "audio/narration/hook-seg01.mp3",
//       startFrame: 55,
//       endFrame: 110,
//     },
//   ],
//   concept: [
//     {
//       text: "秘密要从阳光说起",
//       file: "audio/narration/concept-seg00.mp3",
//       startFrame: 15,
//       endFrame: 60,
//     },
//     // ... more segments (each scene's frames restart from SCENE_PAD)
//   ],
//   summary: [
//     {
//       text: "所以我们看到的蓝天",
//       file: "audio/narration/summary-seg00.mp3",
//       startFrame: 15,
//       endFrame: 60,
//     },
//     {
//       text: "就是散射的蓝色光",
//       file: "audio/narration/summary-seg01.mp3",
//       startFrame: 65,
//       endFrame: 105,
//     },
//   ],
// } as const;
