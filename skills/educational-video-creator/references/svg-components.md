# SVG Components Guide

Create reusable, animated SVG components for educational videos.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Common Components](#common-components)
  - [Arrow Component](#arrow-component)
  - [Force Arrow](#force-arrow-kurzgesagt-style)
  - [Icon Component](#icon-component)
  - [Progress Bar](#progress-bar)
  - [Animated Text](#animated-text)
- [Composition Patterns](#composition-patterns)
  - [Animated Diagram](#animated-diagram)
  - [Staggered List](#staggered-list)
- [Lottie Integration](#lottie-integration)
- [Best Practices](#best-practices)

---

## Component Architecture

### Basic Pattern

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface ComponentProps {
  size?: number;
  color?: string;
  animateIn?: boolean;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const MyComponent: React.FC<ComponentProps> = ({
  size = 100,
  color = '#ffffff',
  animateIn = true,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Calculate animation progress
  const progress = animateIn
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 200 },
      })
    : 1;
  
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {/* SVG content */}
    </svg>
  );
};
```

## Common Components

### Arrow Component

```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ArrowProps {
  direction: Direction;
  size?: number;
  color?: string;
  strokeWidth?: number;
  animateIn?: boolean;
  startFrame?: number;
  label?: string;
  labelColor?: string;
}

const rotationMap: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

export const Arrow: React.FC<ArrowProps> = ({
  direction,
  size = 80,
  color = '#4facfe',
  strokeWidth = 6,
  animateIn = true,
  startFrame = 0,
  label,
  labelColor = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = animateIn
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 15, stiffness: 120 },
      })
    : 1;
  
  const scale = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  const rotation = rotationMap[direction];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        <defs>
          <linearGradient id={`arrow-gradient-${direction}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Arrow body */}
        <line
          x1="50"
          y1="85"
          x2="50"
          y2="35"
          stroke={`url(#arrow-gradient-${direction})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Arrow head */}
        <path
          d="M 30 45 L 50 15 L 70 45"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {label && (
        <span
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: 600,
            color: labelColor,
            opacity: scale,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
```

### Force Arrow (Kurzgesagt Style)

```tsx
interface ForceArrowProps {
  type: 'lift' | 'gravity' | 'thrust' | 'drag';
  size?: number;
  showLabel?: boolean;
  animateIn?: boolean;
  startFrame?: number;
}

const FORCE_CONFIG = {
  lift: { color: '#4facfe', label: '升力', direction: 'up' },
  gravity: { color: '#fa709a', label: '重力', direction: 'down' },
  thrust: { color: '#38ef7d', label: '推力', direction: 'right' },
  drag: { color: '#eb3349', label: '阻力', direction: 'left' },
} as const;

export const ForceArrow: React.FC<ForceArrowProps> = ({
  type,
  size = 120,
  showLabel = true,
  animateIn = true,
  startFrame = 0,
}) => {
  const config = FORCE_CONFIG[type];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = animateIn
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 12, stiffness: 100 },
      })
    : 1;
  
  return (
    <Arrow
      direction={config.direction as Direction}
      size={size}
      color={config.color}
      label={showLabel ? config.label : undefined}
      labelColor={config.color}
      animateIn={false}
      style={{
        transform: `scale(${progress})`,
        opacity: progress,
      }}
    />
  );
};
```

### Icon Component

```tsx
interface IconProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  animateIn?: boolean;
  startFrame?: number;
}

export const Icon: React.FC<IconProps> = ({
  children,
  size = 64,
  backgroundColor = 'rgba(255,255,255,0.1)',
  borderRadius = 16,
  padding = 12,
  animateIn = true,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = animateIn
    ? spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 200 },
      })
    : 1;
  
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        transform: `scale(${progress})`,
        opacity: progress,
      }}
    >
      {children}
    </div>
  );
};
```

### Progress Bar

```tsx
interface ProgressBarProps {
  progress: number; // 0 to 1
  width?: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 300,
  height = 20,
  backgroundColor = 'rgba(255,255,255,0.2)',
  fillColor = '#4facfe',
  borderRadius = 10,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const animatedProgress = animated
    ? spring({
        frame,
        fps,
        config: { damping: 200 },
        from: 0,
        to: progress,
      })
    : progress;
  
  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        borderRadius,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${animatedProgress * 100}%`,
          height: '100%',
          backgroundColor: fillColor,
          borderRadius,
          transition: animated ? 'none' : 'width 0.3s',
        }}
      />
    </div>
  );
};
```

### Animated Text

```tsx
interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  animationType?: 'fade' | 'typewriter' | 'scale';
  startFrame?: number;
  duration?: number; // in frames
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 36,
  color = '#ffffff',
  fontWeight = 400,
  animationType = 'fade',
  startFrame = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const localFrame = frame - startFrame;
  
  if (animationType === 'typewriter') {
    const charsToShow = Math.floor(
      interpolate(localFrame, [0, duration], [0, text.length], {
        extrapolateRight: 'clamp',
      })
    );
    
    return (
      <span style={{ fontSize, color, fontWeight }}>
        {text.slice(0, charsToShow)}
        <span style={{ opacity: localFrame % 30 < 15 ? 1 : 0 }}>|</span>
      </span>
    );
  }
  
  if (animationType === 'scale') {
    const scale = spring({
      frame: localFrame,
      fps,
      config: { damping: 12 },
    });
    
    return (
      <span
        style={{
          fontSize,
          color,
          fontWeight,
          display: 'inline-block',
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </span>
    );
  }
  
  // Default: fade
  const opacity = interpolate(localFrame, [0, duration / 2], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <span style={{ fontSize, color, fontWeight, opacity }}>
      {text}
    </span>
  );
};
```

## Composition Patterns

### Animated Diagram

```tsx
interface DiagramProps {
  centerElement: React.ReactNode;
  surroundingElements: Array<{
    element: React.ReactNode;
    position: 'top' | 'bottom' | 'left' | 'right';
    delay: number;
  }>;
  spacing?: number;
}

export const AnimatedDiagram: React.FC<DiagramProps> = ({
  centerElement,
  surroundingElements,
  spacing = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const centerProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  const positionOffsets = {
    top: { x: 0, y: -spacing },
    bottom: { x: 0, y: spacing },
    left: { x: -spacing, y: 0 },
    right: { x: spacing, y: 0 },
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Center element */}
      <div
        style={{
          transform: `scale(${centerProgress})`,
          opacity: centerProgress,
        }}
      >
        {centerElement}
      </div>
      
      {/* Surrounding elements */}
      {surroundingElements.map((item, index) => {
        const progress = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 15 },
        });
        
        const offset = positionOffsets[item.position];
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${progress})`,
              opacity: progress,
            }}
          >
            {item.element}
          </div>
        );
      })}
    </div>
  );
};
```

### Staggered List

```tsx
interface StaggeredListProps {
  items: React.ReactNode[];
  staggerDelay?: number; // frames between each item
  direction?: 'vertical' | 'horizontal';
  gap?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  staggerDelay = 10,
  direction = 'vertical',
  gap = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap,
      }}
    >
      {items.map((item, index) => {
        const progress = spring({
          frame: frame - index * staggerDelay,
          fps,
          config: { damping: 200 },
        });
        
        const translateAxis = direction === 'vertical' ? 'Y' : 'X';
        const translateValue = interpolate(progress, [0, 1], [20, 0]);
        
        return (
          <div
            key={index}
            style={{
              transform: `translate${translateAxis}(${translateValue}px)`,
              opacity: progress,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
```

## Lottie Integration

For complex animations, use Lottie files:

```tsx
import { Lottie } from '@remotion/lottie';
import animationData from './animation.json';

export const LottieAnimation: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 300, height = 300 }) => {
  return (
    <Lottie
      animationData={animationData}
      style={{ width, height }}
      playbackRate={1}
    />
  );
};
```

### When to Use Lottie

| Use SVG Components | Use Lottie |
|-------------------|------------|
| Simple shapes | Complex illustrations |
| Geometric animations | Character animations |
| Data-driven visuals | Pre-designed animations |
| Interactive elements | Decorative motion |

## Best Practices

### Performance

```tsx
// ✓ Good: Memoize expensive calculations
const MemoizedComponent = React.memo(({ value }) => {
  const expensiveResult = useMemo(() => calculate(value), [value]);
  return <div>{expensiveResult}</div>;
});

// ✗ Bad: Recalculating every frame
const SlowComponent = ({ value }) => {
  const result = calculate(value); // Runs every frame!
  return <div>{result}</div>;
};
```

### Reusability

```tsx
// ✓ Good: Configurable component
export const Badge = ({ 
  children, 
  color = '#4facfe',
  size = 'medium',
  ...props 
}) => { ... };

// ✗ Bad: Hard-coded values
export const BlueMediumBadge = ({ children }) => {
  return <div style={{ color: '#4facfe', fontSize: 16 }}>{children}</div>;
};
```

### Animation Consistency

```tsx
// Define shared spring configs
export const SPRING_CONFIGS = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
};

// Use consistently
const MyComponent = () => {
  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth, // Consistent across app
  });
};
```
