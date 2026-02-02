/**
 * Pre-defined Color Palettes for Educational Videos
 * 
 * Kurzgesagt/回形针 inspired color schemes.
 * Copy and customize for your project.
 */

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
// UTILITY FUNCTIONS
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
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
