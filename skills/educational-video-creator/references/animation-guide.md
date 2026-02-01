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

### Avoid Unnecessary Re-renders

```tsx
// ✓ Good: Memoize static content
const StaticElement = React.memo(() => (
  <svg>...</svg>
));

// ✓ Good: Extract animation logic
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
// Only render when visible
const LazyElement = ({ enterFrame, exitFrame, children }) => {
  const frame = useCurrentFrame();
  
  if (frame < enterFrame || frame > exitFrame) {
    return null;
  }
  
  return children;
};
```

## Animation Checklist

Before finalizing animations:

- [ ] All animations use `useCurrentFrame()`
- [ ] No CSS transitions or animations
- [ ] Consistent timing across similar elements
- [ ] Appropriate easing for the content
- [ ] Animations serve understanding, not decoration
- [ ] Tested at different playback speeds
- [ ] Smooth at 30fps minimum
