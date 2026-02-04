# Animation Design Guide

Comprehensive guide for creating smooth, purposeful animations in Remotion.

## Table of Contents

- [Animation Fundamentals](#animation-fundamentals)
- [Timing Systems](#timing-systems)
  - [Linear Interpolation](#linear-interpolation)
  - [Spring Animation](#spring-animation)
  - [Spring Presets](#spring-presets)
  - [Easing Functions](#easing-functions)
- [Duration Standards](#duration-standards)
- [Animation Patterns](#animation-patterns)
  - [Entrance Animations](#entrance-animations)
  - [Exit Animations](#exit-animations)
  - [Attention Animations](#attention-animations)
  - [Staggered Animations](#staggered-animations)
- [Scene Transitions](#scene-transitions)
- [Advanced Techniques](#advanced-techniques)
  - [SVG Draw-On Animation](#svg-draw-on-animation)
  - [Virtual Camera](#virtual-camera)
  - [Number Counter](#number-counter)
  - [Per-Character Text Animation](#per-character-text-animation)
  - [Parallax Depth Layers](#parallax-depth-layers)
  - [Looping Animations](#looping-animations)
- [Narration-Synced Animation](#narration-synced-animation)
- [Animation Composition](#animation-composition)
- [Performance Tips](#performance-tips)
- [Animation Checklist](#animation-checklist)

---

## Animation Fundamentals

### Core Rule

**Every animation must be driven by `useCurrentFrame()`**

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // All animation values derived from frame
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  
  return <div style={{ opacity }}>Content</div>;
};
```

### Forbidden Approaches

```tsx
// ❌ CSS Transitions - Will not render correctly
<div style={{ transition: 'opacity 0.3s' }}>

// ❌ CSS Animations - Will not render correctly  
<div style={{ animation: 'fadeIn 1s' }}>

// ❌ Tailwind Animation Classes - Will not render correctly
<div className="animate-fade-in">

// ❌ setTimeout/setInterval - Breaks video rendering
setTimeout(() => setVisible(true), 1000);
```

## Timing Systems

### Linear Interpolation

Basic value mapping over time:

```tsx
import { interpolate } from 'remotion';

// Fade in over 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Move from left to center
const x = interpolate(frame, [0, 60], [-200, 0], {
  extrapolateRight: 'clamp',
});
```

### Spring Animation

Natural, physics-based motion:

```tsx
import { spring } from 'remotion';

const progress = spring({
  frame,
  fps,
  config: {
    damping: 200,     // Higher = less bounce
    stiffness: 100,   // Higher = faster
    mass: 1,          // Higher = heavier feel
  },
});
```

### Spring Presets

> **Canonical source**: The presets below are the single source of truth. When defining `SPRING_PRESETS` in your project's `constants.ts` or scene files, copy values from here. Do not invent new values — consistency across scenes matters more than per-scene tuning.

```tsx
// Recommended configurations for different purposes

const SPRING_PRESETS = {
  // Smooth entrance - no bounce, professional
  smooth: { damping: 200 },
  
  // Snappy response - quick, minimal bounce
  snappy: { damping: 20, stiffness: 200 },
  
  // Bouncy entrance - playful, attention-grabbing
  bouncy: { damping: 8 },
  
  // Heavy movement - slow, substantial feel
  heavy: { damping: 15, stiffness: 80, mass: 2 },
  
  // Gentle float - soft, dreamy
  gentle: { damping: 30, stiffness: 50 },
};
```

### Easing Functions

For non-spring animations:

```tsx
import { Easing } from 'remotion';

// Ease types
Easing.linear        // Constant speed
Easing.in(curve)     // Start slow, accelerate
Easing.out(curve)    // Start fast, decelerate
Easing.inOut(curve)  // Slow start and end

// Curve types (more curved = more dramatic)
Easing.quad    // Subtle
Easing.cubic   // Moderate
Easing.sin     // Smooth
Easing.exp     // Dramatic
Easing.circle  // Very dramatic

// Usage
const opacity = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.out(Easing.cubic),
  extrapolateRight: 'clamp',
});
```

## Duration Standards

### By Animation Type

| Animation Type | Frames (30fps) | Seconds | Use Case |
|---------------|----------------|---------|----------|
| Micro | 3-6 | 0.1-0.2 | Button feedback, toggles |
| Fast | 6-12 | 0.2-0.4 | Small element entrance |
| Normal | 12-18 | 0.4-0.6 | Standard transitions |
| Slow | 18-30 | 0.6-1.0 | Large element entrance |
| Dramatic | 30-60 | 1.0-2.0 | Scene transitions |

### By Element Size

```tsx
// Small elements (icons, badges): 6-12 frames
const smallEntrance = spring({
  frame,
  fps,
  config: { damping: 20, stiffness: 200 },
});

// Medium elements (cards, panels): 12-18 frames
const mediumEntrance = spring({
  frame,
  fps,
  config: { damping: 200 },
});

// Large elements (full-screen): 18-30 frames
const largeEntrance = spring({
  frame,
  fps,
  config: { damping: 200 },
  durationInFrames: 30,
});
```

## Animation Patterns

### Entrance Animations

**Fade In**
```tsx
const FadeIn = ({ children, startFrame = 0, duration = 20 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  
  return <div style={{ opacity }}>{children}</div>;
};
```

**Scale In (Pop)**
```tsx
const ScaleIn = ({ children, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
```

**Slide In**
```tsx
const SlideIn = ({ 
  children, 
  direction = 'left', // 'left' | 'right' | 'top' | 'bottom'
  startFrame = 0,
  distance = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });
  
  const transforms = {
    left: `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`,
    top: `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    bottom: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
  };
  
  return (
    <div style={{ 
      transform: transforms[direction],
      opacity: progress,
    }}>
      {children}
    </div>
  );
};
```

### Exit Animations

**Fade Out**
```tsx
const FadeOut = ({ children, startFrame, duration = 20 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - startFrame,
    [0, duration],
    [1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  
  return <div style={{ opacity }}>{children}</div>;
};
```

**Scale Out**
```tsx
const ScaleOut = ({ children, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });
  
  const scale = interpolate(progress, [0, 1], [1, 0]);
  const opacity = interpolate(progress, [0, 1], [1, 0]);
  
  return (
    <div style={{ transform: `scale(${scale})`, opacity }}>
      {children}
    </div>
  );
};
```

### Attention Animations

**Pulse**
```tsx
const Pulse = ({ children, intensity = 0.1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Continuous pulse
  const pulse = Math.sin((frame / fps) * Math.PI * 2) * intensity;
  const scale = 1 + pulse;
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
```

**Highlight Flash**
```tsx
const Highlight = ({ children, startFrame, color = '#ffff00' }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame - startFrame,
    [0, 10, 20],
    [0, 0.5, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: -4,
          backgroundColor: color,
          opacity,
          borderRadius: 4,
        }}
      />
      {children}
    </div>
  );
};
```

### Staggered Animations

```tsx
const StaggeredEntrance = ({ 
  items, 
  staggerDelay = 5, // frames between each item
  renderItem,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <>
      {items.map((item, index) => {
        const itemStartFrame = index * staggerDelay;
        const progress = spring({
          frame: frame - itemStartFrame,
          fps,
          config: { damping: 200 },
        });
        
        return (
          <div
            key={index}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </>
  );
};
```

## Scene Transitions

### Using TransitionSeries

```tsx
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

const MyComposition = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={90}>
      <Scene1 />
    </TransitionSeries.Sequence>
    
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 15 })}
    />
    
    <TransitionSeries.Sequence durationInFrames={120}>
      <Scene2 />
    </TransitionSeries.Sequence>
    
    <TransitionSeries.Transition
      presentation={slide({ direction: 'from-right' })}
      timing={springTiming({ config: { damping: 200 } })}
    />
    
    <TransitionSeries.Sequence durationInFrames={90}>
      <Scene3 />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

### Transition Types

| Transition | When to Use | Duration |
|------------|-------------|----------|
| `fade()` | Topic change, soft transition | 15-30 frames |
| `slide({ direction })` | Continuing narrative | 15-20 frames |
| `wipe({ direction })` | Dramatic reveal | 20-30 frames |
| `flip()` | Before/after comparison | 20-30 frames |
| `clockWipe()` | Time-based content | 30-45 frames |

### Custom Transitions

```tsx
const customZoomTransition = () => ({
  enter: ({ progress }) => ({
    transform: `scale(${interpolate(progress, [0, 1], [1.2, 1])})`,
    opacity: progress,
  }),
  exit: ({ progress }) => ({
    transform: `scale(${interpolate(progress, [0, 1], [1, 0.8])})`,
    opacity: 1 - progress,
  }),
});
```

### Preventing Transparent Frames (Checkerboard Pattern)

During `fade()` transitions, both the outgoing and incoming scenes may have low opacity simultaneously. Without a solid background behind them, this reveals transparent frames — displayed as a **checkerboard pattern** in Remotion preview and as black/transparent in rendered output.

**Solution: Always add a persistent global background layer** in your main composition that never participates in transitions:

```tsx
import { AbsoluteFill } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { COLORS } from './constants';

export const MyVideo: React.FC = () => (
  <AbsoluteFill>
    {/* Global background — always visible, never fades */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background.dark}, ${COLORS.background.medium})`,
      }}
    />

    {/* Scenes with transitions — these fade, but background stays solid */}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES.hook.duration}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={SCENES.intro.duration}>
        <IntroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {/* Audio layer */}
    <AudioLayer />
  </AbsoluteFill>
);
```

**Additionally**, each scene component should have its own solid background as the first child element. This provides defense in depth — even if the global background is accidentally removed, no frame will be transparent.

```tsx
const HookScene: React.FC = () => (
  <AbsoluteFill>
    {/* Scene-level background */}
    <AbsoluteFill style={{ backgroundColor: COLORS.background.dark }} />
    {/* Scene content */}
    ...
  </AbsoluteFill>
);
```

## Advanced Techniques

### SVG Draw-On Animation

Progressively draw SVG paths — signature technique of 3Blue1Brown and Kurzgesagt for revealing diagrams, flowcharts, and formulas.

**Core Concept**: Animate `strokeDashoffset` from the path's total length to 0.

```tsx
const SVGDrawOn: React.FC<{
  d: string;
  pathLength: number;  // Measure with path.getTotalLength() or estimate
  startFrame?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ d, pathLength, startFrame = 0, duration = 60, color, strokeWidth = 4 }) => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <path
      d={d}
      stroke={color ?? COLORS.accent.rose}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={pathLength}
      strokeDashoffset={pathLength * (1 - drawProgress)}
    />
  );
};
```

**Multi-path staggered drawing** (e.g., flowchart with arrows):

```tsx
const paths = [
  { d: 'M50,50 L200,50', length: 150 },
  { d: 'M200,50 L200,150', length: 100 },
  { d: 'M200,150 L350,150', length: 150 },
];
const staggerDelay = 30;

<svg viewBox="0 0 400 200">
  {paths.map((p, i) => (
    <SVGDrawOn
      key={i}
      d={p.d}
      pathLength={p.length}
      startFrame={i * staggerDelay}
      duration={40}
    />
  ))}
</svg>
```

**Draw + Fill**: Draw the outline first, then fill with color:

```tsx
const drawDone = interpolate(frame - startFrame, [0, drawDuration], [0, 1], {
  extrapolateRight: 'clamp',
});
const fillOpacity = interpolate(
  frame - startFrame - drawDuration,
  [0, 20],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

<path
  d={d}
  stroke={COLORS.accent.rose}
  strokeWidth={4}
  fill={COLORS.accent.rose}
  fillOpacity={fillOpacity}
  strokeDasharray={pathLength}
  strokeDashoffset={pathLength * (1 - drawDone)}
/>
```

---

### Virtual Camera

Simulate camera movement (pan, zoom, dolly) by transforming a container that holds the entire scene. Guides viewer attention across complex compositions.

**Zoom to Detail**

```tsx
const VirtualCamera: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
}> = ({
  children,
  startFrame = 0,
  duration = 45,
  fromScale = 1,
  toScale = 2.5,
  fromX = 0,
  toX = -300,
  fromY = 0,
  toY = -150,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  const x = interpolate(progress, [0, 1], [fromX, toX]);
  const y = interpolate(progress, [0, 1], [fromY, toY]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
```

**Pan across a wide scene** (e.g., timeline, landscape):

```tsx
// Slow horizontal pan over a scene wider than 1920px
const panX = interpolate(frame, [0, durationInFrames], [0, -800], {
  extrapolateRight: 'clamp',
});

<div style={{ transform: `translateX(${panX}px)` }}>
  <WideScene /> {/* e.g., 2720px wide */}
</div>
```

**Camera shake** (for impact/emphasis):

```tsx
const shakeIntensity = interpolate(frame - impactFrame, [0, 5, 15], [0, 8, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
const shakeX = Math.sin(frame * 5) * shakeIntensity;
const shakeY = Math.cos(frame * 7) * shakeIntensity;

<div style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
  {children}
</div>
```

---

### Number Counter

Animate numbers from 0 to a target value — essential for data-driven educational content (statistics, measurements, comparisons).

```tsx
const NumberCounter: React.FC<{
  target: number;
  startFrame?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}> = ({ target, startFrame = 0, duration = 60, decimals = 0, prefix = '', suffix = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const value = interpolate(progress, [0, 1], [0, target]);
  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString();

  return (
    <span style={TYPOGRAPHY.number}>
      {prefix}{display}{suffix}
    </span>
  );
};

// Usage:
<NumberCounter target={1000000} suffix="+" startFrame={30} />
// Shows: 0 → ... → 1,000,000+
```

**Multiple counters with stagger** (comparison stats):

```tsx
const stats = [
  { label: '全球用户', target: 2500000, suffix: '+' },
  { label: '每日请求', target: 180000000, suffix: '' },
  { label: '准确率', target: 99.7, suffix: '%', decimals: 1 },
];

{stats.map((stat, i) => (
  <div key={i}>
    <span style={TYPOGRAPHY.caption}>{stat.label}</span>
    <NumberCounter
      target={stat.target}
      suffix={stat.suffix}
      decimals={stat.decimals ?? 0}
      startFrame={i * 20}
    />
  </div>
))}
```

---

### Per-Character Text Animation

Reveal text character by character or word by word — more expressive than block fade-in for titles and key concepts.

**Character-by-character reveal**:

```tsx
const AnimatedText: React.FC<{
  text: string;
  startFrame?: number;
  charDelay?: number;  // frames between each character
}> = ({ text, startFrame = 0, charDelay = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <span>
      {text.split('').map((char, i) => {
        const charStart = startFrame + i * charDelay;
        const progress = spring({
          frame: frame - charStart,
          fps,
          config: { damping: 20, stiffness: 200 },
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};
```

**Word-by-word reveal** (better for longer text):

```tsx
const WordByWord: React.FC<{
  text: string;
  startFrame?: number;
  wordDelay?: number;
}> = ({ text, startFrame = 0, wordDelay = 5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <span>
      {words.map((word, i) => {
        const wordStart = startFrame + i * wordDelay;
        const progress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 200 },
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: progress,
              marginRight: 12,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
```

---

### Parallax Depth Layers

Multiple background layers moving at different speeds create an illusion of depth. Used extensively by Kurzgesagt for space, ocean, and microscopic scenes.

```tsx
const ParallaxScene: React.FC<{
  /** Speed factor: 0 = static, 1 = moves with frame. Larger = faster. */
  layers: Array<{
    content: React.ReactNode;
    speed: number;   // 0.1 = slow (far), 0.5 = medium, 1 = fast (near)
    zIndex: number;
    opacity?: number;
  }>;
}> = ({ layers }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {layers.map((layer, i) => (
        <AbsoluteFill
          key={i}
          style={{
            transform: `translateX(${-frame * layer.speed}px)`,
            zIndex: layer.zIndex,
            opacity: layer.opacity ?? 1,
          }}
        >
          {layer.content}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

// Usage: Space scene with star parallax
<ParallaxScene
  layers={[
    { content: <DistantStars />, speed: 0.05, zIndex: 0, opacity: 0.4 },
    { content: <Nebula />, speed: 0.15, zIndex: 1, opacity: 0.6 },
    { content: <NearStars />, speed: 0.4, zIndex: 2 },
    { content: <MainContent />, speed: 0, zIndex: 3 },  // Static foreground
  ]}
/>
```

**Vertical parallax** (for underwater or atmospheric scenes):

```tsx
const verticalOffset = -frame * speed;
<div style={{ transform: `translateY(${verticalOffset}px)` }}>
  {children}
</div>
```

---

### Looping Animations

Continuous motion for ongoing processes — engine cycles, planetary orbits, wave propagation, heartbeats.

**Continuous rotation**:

```tsx
const Rotating: React.FC<{
  children: React.ReactNode;
  speed?: number;  // rotations per second
}> = ({ children, speed = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = (frame / fps) * 360 * speed;

  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      {children}
    </div>
  );
};
```

**Sine wave oscillation** (floating, bobbing, breathing):

```tsx
const Floating: React.FC<{
  children: React.ReactNode;
  amplitude?: number;  // pixels
  frequency?: number;  // cycles per second
}> = ({ children, amplitude = 10, frequency = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const y = Math.sin((frame / fps) * Math.PI * 2 * frequency) * amplitude;

  return (
    <div style={{ transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
};
```

**Looping path animation** (e.g., orbit):

```tsx
const Orbiting: React.FC<{
  children: React.ReactNode;
  radiusX?: number;
  radiusY?: number;
  speed?: number;  // orbits per second
}> = ({ children, radiusX = 150, radiusY = 80, speed = 0.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const angle = (frame / fps) * Math.PI * 2 * speed;
  const x = Math.cos(angle) * radiusX;
  const y = Math.sin(angle) * radiusY;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
      }}
    >
      {children}
    </div>
  );
};
```

**Wave propagation** (for physics/water scenes):

```tsx
// Generate wave points
const WaveLine: React.FC<{
  width: number;
  amplitude?: number;
  wavelength?: number;
  speed?: number;
}> = ({ width, amplitude = 20, wavelength = 100, speed = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const points = Array.from({ length: Math.ceil(width / 4) + 1 }, (_, i) => {
    const x = i * 4;
    const phase = (frame / fps) * Math.PI * 2 * speed;
    const y = Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
    return `${x},${50 + y}`;
  });

  return (
    <svg width={width} height={100}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={COLORS.accent.rose}
        strokeWidth={4}
      />
    </svg>
  );
};
```

---

## Narration-Synced Animation

### Core Principle

Visual elements that illustrate narrated content **MUST** derive their timing from `AUDIO_SEGMENTS`, not from hardcoded frame numbers. This ensures animations stay aligned with narration even after Phase 4.5 rebuilds the timeline with real audio durations.

### Pattern: Derive startFrame from AUDIO_SEGMENTS

```tsx
import { AUDIO_SEGMENTS } from '../constants';

const ForcesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ✓ CORRECT: Visual element timing derived from narration segments
  const segments = AUDIO_SEGMENTS.forces;
  const liftStart = segments[0].startFrame;      // "升力" segment
  const gravityStart = segments[1].startFrame;    // "重力" segment
  const thrustStart = segments[2].startFrame;     // "推力" segment

  const liftProgress = spring({ frame: frame - liftStart, fps, config: { damping: 200 } });
  const gravityProgress = spring({ frame: frame - gravityStart, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <ForceArrow direction="up" label="升力" progress={liftProgress} />
      <ForceArrow direction="down" label="重力" progress={gravityProgress} />
    </AbsoluteFill>
  );
};
```

### Anti-Pattern: Hardcoded "visual rhythm"

```tsx
// ✗ WRONG: Timing based on "looks good" — will desync after timeline rebuild
const liftProgress = spring({ frame: frame - 30, fps, ... });
const gravityProgress = spring({ frame: frame - 50, fps, ... });
const thrustProgress = spring({ frame: frame - 70, fps, ... });
```

### What to sync vs. what's free

| Element Type | Timing Source | Example |
|-------------|--------------|---------|
| Content visuals (illustrate narrated concepts) | `AUDIO_SEGMENTS.sceneKey[N].startFrame` | Arrow appears when narrator says "升力" |
| Scene title | `SCENE_PAD` (first few frames) | Title fades in at scene start |
| Decorative / ambient | Free (hardcoded OK) | Background particles, floating clouds |
| Exit animations | Scene duration - exit buffer | Elements fade before scene transition |

### Lead time for visual anticipation

Sometimes you want a visual to appear slightly BEFORE the narration (1-5 frames) to give viewers visual context. This is acceptable:

```tsx
const VISUAL_LEAD = 5; // frames of anticipation
const liftStart = segments[0].startFrame - VISUAL_LEAD;
```

Do NOT exceed 10 frames (0.33s at 30fps) of lead time — beyond that it becomes a desync.

---

## Animation Composition

### Combining Multiple Properties

```tsx
const ComplexEntrance = ({ children, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15 },
  });
  
  // Derive multiple values from single progress
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);
  const blur = interpolate(progress, [0, 0.5], [10, 0], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
};
```

### Sequential Animations

```tsx
const SequentialAnimation = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Phase 1: Element appears (frames 0-30)
  const phase1 = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });
  
  // Phase 2: Element moves (frames 30-60)
  const phase2 = spring({
    frame: frame - startFrame - 30,
    fps,
    config: { damping: 200 },
  });
  
  // Phase 3: Element highlights (frames 60-90)
  const phase3Progress = interpolate(
    frame - startFrame - 60,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return (
    <div
      style={{
        opacity: phase1,
        transform: `translateX(${interpolate(phase2, [0, 1], [0, 200])}px)`,
        backgroundColor: interpolate(
          phase3Progress,
          [0, 1],
          ['#ffffff', '#4facfe']
        ),
      }}
    >
      Content
    </div>
  );
};
```

## Performance Tips

### Define Components at Module Level (Critical)

**Never** define components inside a render function. In Remotion, the parent re-renders every frame — inner components get unmounted and remounted 30 times per second, destroying all internal state and causing visible flicker.

```tsx
// ✗ WRONG: Component defined inside render — recreated every frame
const MyScene: React.FC = () => {
  const CloudSVG = () => <svg>...</svg>;  // ← new function identity each frame
  return <CloudSVG />;
};

// ✓ CORRECT: Component defined at module level
const CloudSVG: React.FC<{ x: number }> = ({ x }) => <svg>...</svg>;

const MyScene: React.FC = () => {
  return <CloudSVG x={100} />;
};
```

### Use React.memo for Static SVGs

Wrap SVG components that don't depend on `useCurrentFrame()` with `React.memo` to prevent unnecessary re-renders:

```tsx
const AirplaneSVG = React.memo<{ color: string }>(({ color }) => (
  <svg viewBox="0 0 200 100">
    <path d="..." fill={color} />
  </svg>
));
```

### useMemo for Expensive Computations

```tsx
// ✓ Good: Memoize wave path generation
const WaveLine: React.FC<{ amplitude: number; phase: number }> = ({ amplitude, phase }) => {
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 1920; x += 4) {
      const y = 540 + Math.sin(x * 0.01 + phase) * amplitude;
      pts.push(`${x},${y}`);
    }
    return `M${pts.join(' L')}`;
  }, [amplitude, phase]);

  return <path d={points} stroke="#fff" fill="none" />;
};
```

### SVG Complexity Guidelines

- Keep SVG `<path>` count per component under 50
- Prefer `<circle>`, `<rect>`, `<ellipse>` over complex `<path>` when possible
- For `AnimatedText`, limit to ~100 characters (each character is an individually animated element)
- Use `viewBox` and scale via CSS `width`/`height` rather than transforming individual elements

### Avoid Unnecessary Re-renders

```tsx
// ✓ Good: Extract animation logic into custom hooks
const useEntrance = (startFrame: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });
};
```

### Optimize Complex Scenes

```tsx
// Only render when visible — saves rendering cost for off-screen elements
const LazyElement: React.FC<{
  enterFrame: number;
  exitFrame: number;
  children: React.ReactNode;
}> = ({ enterFrame, exitFrame, children }) => {
  const frame = useCurrentFrame();

  if (frame < enterFrame || frame > exitFrame) {
    return null;
  }

  return <>{children}</>;
};
```

### Particle / Ambient Effect Performance

- Cap particle count at 15–20 per scene
- Use simple shapes (`<circle>`, `<rect>`) rather than complex SVGs for particles
- Pre-compute particle positions in a `useMemo` array, only animate opacity/transform per frame
- If ambient effects slow preview, wrap in `<LazyElement>` to skip rendering before scene entry

## Animation Checklist

Before finalizing animations:

- [ ] All animations use `useCurrentFrame()`
- [ ] No CSS transitions or animations
- [ ] Components defined at module level, not inside render functions
- [ ] Static SVGs wrapped in `React.memo`
- [ ] Expensive computations wrapped in `useMemo`
- [ ] Consistent timing across similar elements
- [ ] Appropriate easing for the content
- [ ] Animations serve understanding, not decoration
- [ ] Tested at different playback speeds
- [ ] Smooth at 30fps minimum
