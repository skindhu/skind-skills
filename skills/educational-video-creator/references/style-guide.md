# Visual Style Guide

Kurzgesagt/回形针 inspired visual style for educational videos.

## Table of Contents

- [Core Aesthetic](#core-aesthetic)
- [Color System](#color-system)
  - [Primary Palette](#primary-palette)
  - [Semantic Colors](#semantic-colors)
  - [Color Usage Rules](#color-usage-rules)
- [Typography](#typography)
- [Shape Language](#shape-language)
- [Visual Elements](#visual-elements)
- [Gradients](#gradients)
- [Shadows & Depth](#shadows--depth)
- [Layout Guidelines](#layout-guidelines)
- [Animation Style](#animation-style)
- [Do's and Don'ts](#dos-and-donts)

---

## Core Aesthetic

### Design Philosophy

- **Flat Design**: Minimal shadows, clean shapes
- **Geometric**: Based on circles, rectangles, rounded shapes
- **Playful but Informative**: Approachable yet educational
- **Consistent**: Same style across all elements

## Color System

### Primary Palette

```css
/* Background Colors */
--bg-dark: #1a1a2e;      /* Deep space blue - default background */
--bg-medium: #16213e;    /* Medium blue - secondary backgrounds */
--bg-light: #0f3460;     /* Lighter blue - highlights */

/* Accent Colors */
--accent-orange: #e94560; /* Warm accent - important elements */
--accent-yellow: #f9ed69; /* Bright accent - highlights */
--accent-teal: #00b8a9;   /* Cool accent - secondary info */

/* Neutral Colors */
--white: #ffffff;
--light-gray: #f0f0f0;
--dark-gray: #2d2d2d;
```

### Semantic Colors

```css
/* For Force Diagrams */
--lift-blue: #4facfe;     /* Lift force */
--gravity-orange: #fa709a; /* Gravity force */
--thrust-green: #38ef7d;  /* Thrust force */
--drag-red: #eb3349;      /* Drag force */

/* For Status/Emphasis */
--positive: #00b894;      /* Good, correct, success */
--negative: #e17055;      /* Bad, wrong, warning */
--neutral: #74b9ff;       /* Neutral information */
```

### Color Usage Rules

1. **Background**: Always use dark backgrounds for better contrast
2. **Text**: White or light colors on dark backgrounds
3. **Accents**: Use sparingly for emphasis (max 2-3 accent colors per scene)
4. **Consistency**: Same element = same color throughout video

## Typography

### Font Selection

```css
/* Primary Font - Headings & Emphasis */
font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
font-weight: 700;

/* Secondary Font - Body Text & Narration */
font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
font-weight: 400;

/* For English/Numbers */
font-family: 'Inter', 'Roboto', sans-serif;
```

### Font Loading in Remotion

**Important**: Remotion requires explicit font loading. Use `@remotion/google-fonts` for reliable cross-platform rendering.

```tsx
// In your Root.tsx or top-level component:
import { loadFont } from '@remotion/google-fonts/NotoSansSC';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

// Call loadFont() with NO arguments to load all subsets.
// Do NOT pass subsets: ["chinese-simplified"] — Remotion v4 uses
// Unicode range numbers ([0], [1], [2]...) as subset names,
// not human-readable names. Passing wrong subset names causes
// all frames to fail rendering silently.
const { fontFamily: notoSansSC } = loadFont();
const { fontFamily: inter } = loadInter();
```

**Common pitfall**: `loadFont({ subsets: ["chinese-simplified"] })` will **fail silently** in Remotion v4. The NotoSansSC font uses numeric Unicode range subset identifiers. Always use `loadFont()` without arguments to load all subsets.

### Font Sizes (1920x1080)

```css
--title-size: 72px;       /* Main titles */
--heading-size: 48px;     /* Section headings */
--body-size: 36px;        /* Body text, subtitles */
--caption-size: 24px;     /* Small labels, captions */
--tiny-size: 18px;        /* Disclaimers, credits */
```

### Text Styling

```tsx
// Title style
const titleStyle = {
  fontSize: 72,
  fontWeight: 700,
  color: '#ffffff',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
};

// Subtitle style
const subtitleStyle = {
  fontSize: 36,
  fontWeight: 400,
  color: '#f0f0f0',
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: '8px 16px',
  borderRadius: 8,
};
```

## Shape Language

### Basic Shapes

```
┌─────────────────────────────────────────┐
│  Circles: Characters, icons, emphasis   │
│  Rounded Rectangles: Containers, cards  │
│  Triangles: Arrows, direction           │
│  Lines: Connections, flow, emphasis     │
└─────────────────────────────────────────┘
```

### Corner Radius Standards

```css
--radius-small: 4px;      /* Small UI elements */
--radius-medium: 8px;     /* Buttons, small cards */
--radius-large: 16px;     /* Large cards, containers */
--radius-round: 50%;      /* Circles, avatars */
```

### Stroke & Border

```css
--stroke-thin: 2px;       /* Subtle outlines */
--stroke-medium: 4px;     /* Standard outlines */
--stroke-thick: 6px;      /* Emphasis, arrows */
```

## Visual Elements

### Icons

```tsx
// Icon component pattern
const Icon = ({ size = 48, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {/* Simple, geometric shapes */}
    {/* Consistent stroke width */}
    {/* Rounded line caps */}
  </svg>
);
```

Icon Design Rules:
- Use consistent stroke width (2-4px scaled)
- Round line caps and joins
- Simple, recognizable shapes
- Single color or simple gradients

### Arrows (Force Diagrams)

```tsx
const ForceArrow = ({ direction, color, size }) => {
  // Thick, bold arrows
  // Rounded tips
  // Optional gradient for depth
  // Label integrated or nearby
};
```

### Characters (if used)

- Simple, geometric faces
- Minimal features (dots for eyes, simple curves)
- Expressive through pose, not detail
- Consistent proportions

## Gradients

### Linear Gradients

```tsx
// Background gradient
const bgGradient = {
  background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
};

// Element gradient (subtle)
const elementGradient = {
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
};
```

### Gradient Rules

1. Maximum 2 colors per gradient
2. Subtle transitions (not harsh)
3. Use for backgrounds and large elements
4. Avoid gradients on small icons/text

## Shadows & Depth

### Shadow System

```css
/* Subtle shadow - floating elements */
--shadow-subtle: 0 2px 8px rgba(0,0,0,0.2);

/* Medium shadow - cards, panels */
--shadow-medium: 0 4px 16px rgba(0,0,0,0.3);

/* Strong shadow - popups, emphasis */
--shadow-strong: 0 8px 32px rgba(0,0,0,0.4);
```

### Glow Effects

```css
/* Accent glow */
--glow-accent: 0 0 20px rgba(233,69,96,0.5);

/* Soft glow for emphasis */
--glow-soft: 0 0 40px rgba(255,255,255,0.2);
```

## Layout Guidelines

### Safe Zones

```
┌────────────────────────────────────────────┐
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │            Safe Content Area           │ │
│ │              (1720 x 880)              │ │
│ │                                        │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│   100px margin on all sides for 1080p      │
└────────────────────────────────────────────┘
```

### Grid System

```
12-column grid with 20px gutters
Column width: ~140px at 1920px
Use 4, 6, or 12 column layouts
```

### Spacing Scale

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-xxl: 64px;
```

### Element Layering & Overlap

**Intentional overlap** can create visual depth and hierarchy:
- Cards overlapping background elements ✓
- Decorative elements behind text ✓
- Stacked info panels with offset ✓

**Avoid problematic overlap:**
- Text overlapping text (unreadable)
- Interactive elements covering each other
- Important info obscured by other elements

**When overlapping:**
- Ensure contrast: use shadows, borders, or backgrounds to separate layers
- Maintain readability: text must always be fully legible
- Z-index clarity: establish clear visual hierarchy
- Sufficient spacing between text of different containers

**Common layout zones (1080p):**
```
┌─────────────────────────────────────────┐
│  Title Zone (y: 60-200px)               │
│─────────────────────────────────────────│
│                                         │
│         Main Content Zone               │
│         (flexible, y: 200-700px)        │
│                                         │
│─────────────────────────────────────────│
│  Info Cards Zone (y: 650-850px)         │
│  ─────────── clear separation ───────── │
│  Subtitle Zone (y: 880-1000px)          │
└─────────────────────────────────────────┘
```

## Animation Style

### Motion Principles

1. **Natural**: Use spring animations for organic feel
2. **Purposeful**: Every animation conveys meaning
3. **Smooth**: 30fps minimum, prefer 60fps for complex motion
4. **Consistent**: Same timing for same actions

### Standard Timings

```tsx
const timings = {
  instant: 100,      // 0.1s - micro-interactions
  fast: 200,         // 0.2s - small elements
  normal: 300,       // 0.3s - standard transitions
  slow: 500,         // 0.5s - large elements
  dramatic: 800,     // 0.8s - scene transitions
};
```

### Recommended Springs

```tsx
// Smooth entrance (no bounce)
const smoothSpring = { damping: 200 };

// Snappy UI response
const snappySpring = { damping: 20, stiffness: 200 };

// Playful bounce
const bouncySpring = { damping: 8 };
```

## Do's and Don'ts

### Do ✓

- Use consistent colors throughout
- Keep shapes simple and geometric
- Apply smooth, purposeful animations
- Maintain visual hierarchy
- Use sufficient contrast for readability

### Don't ✗

- Mix too many colors (max 5 per scene)
- Use complex, realistic illustrations
- Add decorative animations without purpose
- Clutter the screen with elements
- Use thin fonts on dark backgrounds
