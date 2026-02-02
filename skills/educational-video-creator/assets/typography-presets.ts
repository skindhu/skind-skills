/**
 * Typography Presets for Educational Videos
 * 
 * Font configurations following style guide standards.
 * Copy and customize for your project.
 */

import React from 'react';

// ============================================
// FONT FAMILY DEFINITIONS
// ============================================

export const FONT_FAMILIES = {
  // Primary - for Chinese text
  chinese: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  
  // Secondary - for English/numbers
  english: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
  
  // Monospace - for code/technical
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

// ============================================
// FONT SIZE SCALE (1920x1080)
// ============================================

export const FONT_SIZES = {
  title: 72,       // Main titles
  heading: 48,     // Section headings
  body: 36,        // Body text, subtitles
  caption: 24,     // Small labels, captions
  tiny: 24,        // Disclaimers, credits (matches absolute minimum)
  
  // Absolute minimum for readability
  minimum: 24,
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
  bottom: 40, // Standard subtitle position. Must be 40-120; style-scan flags values outside this range.
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
