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
- [Data Visualization Components](#data-visualization-components)
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
          // No CSS transitions — all width changes driven by interpolate() above
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

## Data Visualization Components

Animated charts and graphs for data-driven educational content. All values animate from zero to target for visual impact.

### Animated Bar Chart

```tsx
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  startFrame?: number;
  staggerDelay?: number;
}

export const AnimatedBarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  startFrame = 0,
  staggerDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = (width - (data.length + 1) * 16) / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((item, i) => {
        const progress = spring({
          frame: frame - startFrame - i * staggerDelay,
          fps,
          config: { damping: 200 },
        });

        const barHeight = (item.value / maxValue) * (height - 80) * progress;
        const x = 16 + i * (barWidth + 16);
        const y = height - 40 - barHeight;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={item.color ?? COLORS.accent.rose}
            />
            {/* Value label */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill={COLORS.text}
              fontSize={32}
              fontWeight={700}
              opacity={progress}
            >
              {Math.round(item.value * progress)}
            </text>
            {/* Category label */}
            <text
              x={x + barWidth / 2}
              y={height - 12}
              textAnchor="middle"
              fill={COLORS.textMuted ?? '#b0b0b0'}
              fontSize={32}
              opacity={progress}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
```

### Animated Line Chart

```tsx
interface LineChartProps {
  points: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
  color?: string;
  startFrame?: number;
  drawDuration?: number;
}

export const AnimatedLineChart: React.FC<LineChartProps> = ({
  points,
  width = 600,
  height = 300,
  color,
  startFrame = 0,
  drawDuration = 60,
}) => {
  const frame = useCurrentFrame();
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxX = Math.max(...points.map((p) => p.x));
  const maxY = Math.max(...points.map((p) => p.y));

  const scaledPoints = points.map((p) => ({
    x: padding.left + (p.x / maxX) * chartW,
    y: padding.top + chartH - (p.y / maxY) * chartH,
  }));

  const pathD = scaledPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ');

  // Estimate path length
  let pathLength = 0;
  for (let i = 1; i < scaledPoints.length; i++) {
    const dx = scaledPoints[i].x - scaledPoints[i - 1].x;
    const dy = scaledPoints[i].y - scaledPoints[i - 1].y;
    pathLength += Math.sqrt(dx * dx + dy * dy);
  }

  const drawProgress = interpolate(
    frame - startFrame,
    [0, drawDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <svg width={width} height={height}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <line
          key={frac}
          x1={padding.left}
          y1={padding.top + chartH * (1 - frac)}
          x2={width - padding.right}
          y2={padding.top + chartH * (1 - frac)}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
      ))}
      {/* Animated line */}
      <path
        d={pathD}
        fill="none"
        stroke={color ?? COLORS.accent.rose}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - drawProgress)}
      />
      {/* Data points */}
      {scaledPoints.map((p, i) => {
        const pointProgress = interpolate(
          frame - startFrame - (i / scaledPoints.length) * drawDuration,
          [0, 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6 * pointProgress}
            fill={color ?? COLORS.accent.rose}
          />
        );
      })}
    </svg>
  );
};
```

### Animated Pie Chart

```tsx
interface PieChartProps {
  segments: Array<{ label: string; value: number; color: string }>;
  size?: number;
  startFrame?: number;
}

export const AnimatedPieChart: React.FC<PieChartProps> = ({
  segments,
  size = 300,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  // Total sweep angle based on progress
  const totalAngle = 360 * progress;
  let currentAngle = -90; // Start from top

  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        const segAngle = (seg.value / total) * totalAngle;
        const startAngle = currentAngle;
        const endAngle = currentAngle + segAngle;
        currentAngle = endAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const largeArc = segAngle > 180 ? 1 : 0;

        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        // Skip if segment is too small to render
        if (segAngle < 0.5) return null;

        return (
          <path
            key={i}
            d={`M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
            fill={seg.color}
            stroke={COLORS.background?.dark ?? '#1a1a2e'}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
};
```

### Usage Example

```tsx
// Bar chart comparison
<AnimatedBarChart
  data={[
    { label: '中国', value: 1400, color: COLORS.accent.rose },
    { label: '印度', value: 1380, color: COLORS.accent.teal },
    { label: '美国', value: 331, color: COLORS.accent.yellow },
    { label: '日本', value: 126, color: COLORS.semantic?.neutral ?? '#74b9ff' },
  ]}
  startFrame={30}
/>

// Line chart trend
<AnimatedLineChart
  points={[
    { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 22 },
    { x: 3, y: 45 }, { x: 4, y: 60 }, { x: 5, y: 85 },
  ]}
  startFrame={30}
/>
```

---

## Domain-Specific Illustration Patterns

When building educational videos, **every scene needs at least one visual illustration** — not just text labels in colored boxes. This section shows how to create Kurzgesagt-style domain illustrations and upgrade common "PPT-like" patterns.

### Illustration Design Principles

Kurzgesagt-style SVG illustrations follow these rules:

1. **Geometric shapes with rounded corners** — use `rx`/`ry` on `<rect>`, rounded `<path>` segments, `<ellipse>` for organic forms
2. **Gradient fills** — `<linearGradient>` or `<radialGradient>` instead of flat solid fills; typically light-to-dark of the same hue
3. **Multi-layer composition** — build up from background shapes to foreground details; overlap layers for depth
4. **Consistent stroke** — `strokeWidth` 1-2px, `strokeLinejoin="round"`, slightly darker than fill color
5. **Limited detail** — simplify real objects to 5-10 essential shapes; avoid photorealism
6. **Accent details** — small highlights (windows, buttons, glow effects) add polish without complexity

### Example: Kurzgesagt-Style Object Illustration

```tsx
/**
 * A simplified lightbulb illustration — Kurzgesagt style.
 * Demonstrates: gradient fills, rounded geometry, glow effects, layered composition.
 */
const LightbulbIllustration: React.FC<{ glowing?: boolean }> = ({ glowing = true }) => (
  <svg width={120} height={160} viewBox="0 0 120 160">
    <defs>
      <linearGradient id="bulb-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffeaa7" />
        <stop offset="100%" stopColor="#fdcb6e" />
      </linearGradient>
      <linearGradient id="base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b2bec3" />
        <stop offset="100%" stopColor="#636e72" />
      </linearGradient>
      {glowing && (
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#ffeaa7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffeaa7" stopOpacity="0" />
        </radialGradient>
      )}
    </defs>
    {/* Outer glow */}
    {glowing && <circle cx="60" cy="60" r="55" fill="url(#glow)" />}
    {/* Glass bulb — rounded shape */}
    <ellipse cx="60" cy="60" rx="38" ry="42" fill="url(#bulb-grad)" stroke="#f0c040" strokeWidth="2" />
    {/* Filament */}
    <path d="M 48 65 Q 55 45 60 65 Q 65 45 72 65" fill="none" stroke="#e17055" strokeWidth="2.5" strokeLinecap="round" />
    {/* Metal base — stacked rounded rects */}
    <rect x="42" y="98" width="36" height="8" rx="2" fill="url(#base-grad)" stroke="#636e72" strokeWidth="1" />
    <rect x="44" y="106" width="32" height="6" rx="2" fill="url(#base-grad)" stroke="#636e72" strokeWidth="1" />
    <rect x="46" y="112" width="28" height="6" rx="2" fill="url(#base-grad)" stroke="#636e72" strokeWidth="1" />
    {/* Bottom contact */}
    <circle cx="60" cy="122" r="6" fill="#636e72" />
  </svg>
);
```

### Illustrated Flow Node Pattern

**Problem**: Flow charts with plain colored boxes + text look like PPT slides.

**Solution**: Replace text-only boxes with icon+text nodes.

```tsx
/**
 * An illustrated flow node — replaces plain text boxes in flow charts.
 * Each node has an icon/mini-illustration above the label.
 */
const FlowNode: React.FC<{
  icon: React.ReactNode;  // SVG icon or mini illustration
  label: string;
  color: string;
  delay: number;
}> = ({ icon, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      opacity: progress, transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
    }}>
      {/* Icon area with soft background glow */}
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      {/* Label */}
      <span style={{
        fontSize: 22, fontWeight: 600, color: '#ffffff',
        textShadow: `0 0 8px ${color}`,
      }}>
        {label}
      </span>
    </div>
  );
};

// Usage in a flow chart:
// <FlowNode
//   icon={<FactoryIcon />}           // SVG component, not emoji
//   label="企业抢人"
//   color="#4facfe"
//   delay={30}
// />
// Instead of:
// <div style={{ background: '#334', padding: 16, borderRadius: 8 }}>
//   <span>企业抢人</span>           // ← This is the PPT anti-pattern
// </div>
```

### Flow Arrow Connector

```tsx
/**
 * Animated arrow connecting flow nodes — with gradient and glow.
 */
const FlowArrow: React.FC<{ delay: number; color?: string }> = ({ delay, color = '#ffffff' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <svg width={50} height={24} viewBox="0 0 50 24" style={{ opacity: progress }}>
      <defs>
        <linearGradient id="arrow-connector-grad" x1="0%" x2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="0" y1="12" x2="35" y2="12" stroke="url(#arrow-connector-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 30 4 L 46 12 L 30 20" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
```

### Ambient Effects Helper

Every scene should have an ambient layer. Here is a reusable pattern:

```tsx
/**
 * Floating particle system — adds depth and atmosphere.
 * Use different shapes for different topics:
 *   - Circles → general / science
 *   - Stars → space / cosmic
 *   - Bubbles → underwater / biology
 */
const AmbientParticles: React.FC<{
  count?: number;
  color?: string;
  maxSize?: number;
}> = ({ count = 8, color = 'rgba(255,255,255,0.06)', maxSize = 60 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Deterministic pseudo-random positions (no Math.random — Remotion requires determinism)
  const particles = Array.from({ length: count }, (_, i) => ({
    x: ((i * 137.5) % 100),  // Golden angle distribution
    y: ((i * 89.3 + 20) % 100),
    size: maxSize * (0.4 + (i % 3) * 0.3),
    speed: 0.1 + (i % 4) * 0.08,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const drift = interpolate(frame, [0, durationInFrames], [0, p.speed * 150], {
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `translateX(${drift}px)`,
          }}>
            <svg width={p.size} height={p.size} viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill={color} />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

---

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
