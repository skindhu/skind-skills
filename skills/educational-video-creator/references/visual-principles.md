# Visual Principles Guide

Information visualization, composition, and layout principles for educational videos.

## Table of Contents

- [Information Visualization](#information-visualization)
  - [Abstract to Visual Mapping](#abstract-to-visual-mapping)
  - [Visualization Techniques](#visualization-techniques)
- [Composition Principles](#composition-principles)
  - [The Rule of Thirds](#the-rule-of-thirds)
  - [Visual Hierarchy](#visual-hierarchy)
  - [Balance and Symmetry](#balance-and-symmetry)
  - [Whitespace](#whitespace-negative-space)
- [Focus and Attention](#focus-and-attention)
- [Information Density](#information-density)
  - [Cognitive Load Management](#cognitive-load-management)
  - [Progressive Disclosure](#progressive-disclosure)
  - [Text on Screen](#text-on-screen)
- [Layout Patterns](#layout-patterns)
- [Color in Information Design](#color-in-information-design)
- [Visual Consistency Checklist](#visual-consistency-checklist)

---

## Information Visualization

### Core Principle: Show, Don't Tell

```
❌ Narration: "The force of lift is very strong"
   Visual: Text saying "Lift is strong"

✓ Narration: "The force of lift is very strong"
   Visual: Large arrow pushing airplane up, with pulsing animation
```

### Abstract to Visual Mapping

| Abstract Concept | Visual Representation |
|------------------|----------------------|
| Quantity/Amount | Size, number of elements, bar height |
| Comparison | Side-by-side, overlay with different colors |
| Process/Flow | Arrows, animated paths, sequence |
| Relationship | Lines connecting, nesting, grouping |
| Change over time | Animation, before/after, timeline |
| Cause and effect | Arrow pointing from cause to effect |

### Visualization Techniques

**Magnification**
```
Use when: Showing small or invisible things
Example: Zooming into wing to show air molecules
Implementation: Animated zoom with circular callout
```

**Simplification**
```
Use when: Real thing is too complex
Example: Airplane as simple geometric shape
Implementation: Reduce to essential recognizable features
```

**Metaphor/Analogy**
```
Use when: Concept is abstract or unfamiliar
Example: "Lift is like a hand pushing up"
Implementation: Show familiar object doing similar action
```

**Comparison**
```
Use when: Showing relative size, speed, or amount
Example: "A 747 weighs as much as 40 elephants"
Implementation: Split screen or sequential reveal
```

**Animation**
```
Use when: Showing motion, process, or change
Example: Air flowing over wing
Implementation: Particle systems, flow lines, morphing
```

## Composition Principles

### The Rule of Thirds

```
┌─────────┬─────────┬─────────┐
│         │    ●    │         │  ← Place key elements
│─────────┼─────────┼─────────│    at intersections
│    ●    │         │    ●    │
│─────────┼─────────┼─────────│
│         │    ●    │         │
└─────────┴─────────┴─────────┘
```

### Visual Hierarchy

**Size Hierarchy**
```tsx
const HIERARCHY = {
  primary: 100,    // Main subject - largest
  secondary: 70,   // Supporting elements
  tertiary: 50,    // Background/context
  detail: 30,      // Labels, annotations
};
```

**Position Hierarchy**
```
┌─────────────────────────────────────────┐
│              Header Area                │  ← Titles, scene labels
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         Main Content            │   │  ← Primary focus area
│  │           (Center)              │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│              Footer Area                │  ← Subtitles, annotations
└─────────────────────────────────────────┘
```

**Contrast Hierarchy**
```css
/* Primary elements: High contrast */
--primary-fg: #ffffff;
--primary-bg: #1a1a2e;

/* Secondary elements: Medium contrast */
--secondary-fg: #b0b0b0;

/* Background elements: Low contrast */
--tertiary-fg: #606060;
```

### Balance and Symmetry

**Symmetrical Balance** (formal, stable)
```
┌─────────────────────────────────────────┐
│                                         │
│    [Element]    ●    [Element]          │
│                 │                       │
│                 │                       │
│                                         │
└─────────────────────────────────────────┘
Use for: Comparisons, formal explanations
```

**Asymmetrical Balance** (dynamic, interesting)
```
┌─────────────────────────────────────────┐
│                                         │
│    [Large Element]        [Small]       │
│         ↑                   [Small]     │
│         │                   [Small]     │
│         ← Heavier visual    ↑           │
│            weight           Balanced by │
│                             multiple    │
└─────────────────────────────────────────┘
Use for: Dynamic scenes, storytelling
```

### Whitespace (Negative Space)

```
❌ Crowded - Hard to focus
┌─────────────────────────────────────────┐
│[A][B][C][D][E][F][G][H][I][J][K][L][M] │
│[N][O][P][Q][R][S][T][U][V][W][X][Y][Z] │
└─────────────────────────────────────────┘

✓ Breathing room - Clear focus
┌─────────────────────────────────────────┐
│                                         │
│           [Main Element]                │
│                                         │
│      [A]        [B]        [C]          │
│                                         │
└─────────────────────────────────────────┘
```

**Spacing Scale**
```tsx
const SPACING = {
  tight: 8,      // Related elements
  normal: 16,    // Standard separation
  loose: 32,     // Distinct sections
  spacious: 64,  // Major divisions
};
```

## Focus and Attention

### Directing Viewer Attention

**Method 1: Size and Scale**
```tsx
// Emphasize by making larger
const emphasized = { scale: 1.2 };
const normal = { scale: 1.0 };
const deemphasized = { scale: 0.8, opacity: 0.6 };
```

**Method 2: Color and Contrast**
```tsx
// Highlight with accent color
const highlighted = { color: '#e94560' };  // Accent
const normal = { color: '#ffffff' };
const background = { color: '#666666' };
```

**Method 3: Motion**
```tsx
// Moving elements draw attention
const attention = spring({
  frame,
  fps,
  config: { damping: 8 }, // Bouncy = eye-catching
});
```

**Method 4: Isolation**
```tsx
// Dim surroundings to focus
const dimBackground = {
  backgroundColor: 'rgba(0,0,0,0.7)',
};
```

### Focus Transitions

When moving focus between elements:

```tsx
const FocusTransition = ({ 
  currentFocus, 
  elements 
}) => {
  return elements.map((el, i) => {
    const isFocused = i === currentFocus;
    const opacity = isFocused ? 1 : 0.3;
    const scale = isFocused ? 1.1 : 0.9;
    
    return (
      <div
        key={i}
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'none', // Remember: no CSS transitions!
        }}
      >
        {el}
      </div>
    );
  });
};
```

## Information Density

### Cognitive Load Management

**Rule: Maximum 3-5 elements actively animated at once**

```
Scene complexity levels:

SIMPLE (1-2 concepts)
├── 1 main element
├── 1-2 supporting elements
└── Clean background

MODERATE (2-3 concepts)
├── 1-2 main elements
├── 2-3 supporting elements
├── Simple labels
└── Subtle background

COMPLEX (3-4 concepts)
├── 2-3 main elements
├── 3-4 supporting elements
├── Labels and annotations
├── Connection lines
└── Structured background

⚠️ AVOID: More than this
```

### Progressive Disclosure

Build complexity gradually:

```tsx
const ProgressiveScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Phase 1: Show main subject (0-2s)
  const showMain = frame >= 0;
  
  // Phase 2: Add first detail (2-4s)
  const showDetail1 = frame >= 2 * fps;
  
  // Phase 3: Add second detail (4-6s)
  const showDetail2 = frame >= 4 * fps;
  
  // Phase 4: Show relationships (6-8s)
  const showRelationships = frame >= 6 * fps;
  
  return (
    <>
      {showMain && <MainElement />}
      {showDetail1 && <Detail1 />}
      {showDetail2 && <Detail2 />}
      {showRelationships && <ConnectionLines />}
    </>
  );
};
```

### Text on Screen

**Subtitle Guidelines**
```
Maximum: 2 lines
Characters per line: 15-20 (Chinese), 40-50 (English)
Display time: Minimum 1.5 seconds
Font size: 36px minimum at 1080p
```

**Label Guidelines**
```
Keep short: 2-4 words
Position: Near but not overlapping element
Size: Large enough to read at a glance
Color: Contrasting but not distracting
```

## Layout Patterns

### Common Educational Layouts

**Center Stage**
```
┌─────────────────────────────────────────┐
│                 Title                   │
│                                         │
│          ┌─────────────┐                │
│          │             │                │
│          │   Subject   │                │
│          │             │                │
│          └─────────────┘                │
│                                         │
│              Subtitle                   │
└─────────────────────────────────────────┘
Use for: Introduction, single focus
```

**Split Comparison**
```
┌─────────────────────────────────────────┐
│           Before    │    After          │
│                     │                   │
│     [Element A]     │   [Element B]     │
│                     │                   │
│                     │                   │
└─────────────────────────────────────────┘
Use for: Comparisons, before/after
```

**Diagram Layout**
```
┌─────────────────────────────────────────┐
│                  Title                  │
│         ┌───────────────┐               │
│    ↑    │               │    ↓          │
│  [Label]│    Subject    │  [Label]      │
│         │               │               │
│    ←    └───────────────┘    →          │
│  [Label]      [Label]      [Label]      │
└─────────────────────────────────────────┘
Use for: Force diagrams, relationships
```

**List/Steps Layout**
```
┌─────────────────────────────────────────┐
│                  Title                  │
│                                         │
│   ①  First step                         │
│                                         │
│   ②  Second step                        │
│                                         │
│   ③  Third step                         │
│                                         │
└─────────────────────────────────────────┘
Use for: Processes, sequences
```

**Timeline Layout**
```
┌─────────────────────────────────────────┐
│                                         │
│   ●──────●──────●──────●──────●         │
│   │      │      │      │      │         │
│ Event  Event  Event  Event  Event       │
│   1      2      3      4      5         │
│                                         │
└─────────────────────────────────────────┘
Use for: Historical events, processes
```

## Color in Information Design

### Semantic Color Usage

```tsx
const SEMANTIC_COLORS = {
  // Status
  positive: '#00b894',  // Good, correct, increase
  negative: '#e17055',  // Bad, wrong, decrease
  neutral: '#74b9ff',   // Neutral, info
  warning: '#fdcb6e',   // Caution, attention
  
  // Categories (max 5-6 for clarity)
  category1: '#4facfe',
  category2: '#fa709a',
  category3: '#38ef7d',
  category4: '#f9ed69',
  category5: '#a29bfe',
};
```

### Color Accessibility

```
Ensure sufficient contrast:
- Text on background: 4.5:1 minimum
- Large text/graphics: 3:1 minimum

Don't rely solely on color:
- Add patterns, labels, or icons
- Use different shapes for different meanings
```

## Visual Consistency Checklist

- [ ] Same style for same type of element throughout
- [ ] Consistent color coding
- [ ] Uniform spacing and margins
- [ ] Matching animation timings for similar actions
- [ ] Consistent typography scale
- [ ] Same visual language for icons
- [ ] Unified background treatment
