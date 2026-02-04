/**
 * Standard Scene Template for Educational Videos
 *
 * Copy this template when creating new scenes.
 * Customize the content while keeping the structure.
 *
 * PERFORMANCE RULES demonstrated in this template:
 * - All sub-components are defined OUTSIDE the parent render function
 *   (defining components inside render causes React to unmount/remount every frame)
 * - SVG gradient/filter IDs use an `idPrefix` prop to avoid global collisions
 * - Static SVG components use React.memo to skip unnecessary re-renders
 * - useCurrentFrame() is only called where animation actually needs it
 */

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import React, { useMemo } from 'react';

// ============================================
// CONFIGURATION
// ============================================

interface SceneProps {
  title?: string;
  subtitle?: string;
}

// Design tokens - import from constants.ts in real projects.
// In actual projects, use: import { COLORS, FONTS } from '../constants';
// The fontFamily values below are hardcoded for template portability.
// In production, always use the fontFamily returned by loadFont() via FONTS.notoSansSC.
const COLORS = {
  background: {
    dark: '#1a1a2e',
    medium: '#16213e',
    light: '#0f3460',
  },
  accent: {
    rose: '#e94560',
    yellow: '#f9ed69',
    teal: '#00b8a9',
  },
  text: '#ffffff',
  textMuted: '#b0b0b0',
};

const TYPOGRAPHY = {
  title: {
    fontSize: 72,
    fontWeight: 700,
    fontFamily: 'Noto Sans SC, sans-serif',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 400,
    fontFamily: 'Noto Sans SC, sans-serif',
  },
  body: {
    fontSize: 36,
    fontWeight: 400,
    fontFamily: 'Noto Sans SC, sans-serif',
  },
  label: {
    fontSize: 32, // Minimum 32px per quality-checklist.md §1 (fontSize < 32 = Critical)
    fontWeight: 600,
    fontFamily: 'Noto Sans SC, sans-serif',
  },
};

// Animation presets
const SPRING_PRESETS = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  gentle: { damping: 30, stiffness: 50 },
};

// ============================================
// HELPER COMPONENTS
// (Defined at module level — never inside a render function!)
// ============================================

/**
 * Animated entrance wrapper
 */
const AnimatedEntrance: React.FC<{
  children: React.ReactNode;
  delay?: number;
  type?: 'fade' | 'scale' | 'slide';
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, delay = 0, type = 'fade', direction = 'up' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_PRESETS.smooth,
  });

  let transform = '';
  if (type === 'scale') {
    transform = `scale(${interpolate(progress, [0, 1], [0.8, 1])})`;
  } else if (type === 'slide') {
    const distance = 30;
    const offsets = {
      up: [distance, 0],
      down: [-distance, 0],
      left: [distance, 0],
      right: [-distance, 0],
    };
    const [from, to] = offsets[direction];
    const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
    transform = `translate${axis}(${interpolate(progress, [0, 1], [from, to])}px)`;
  }

  return (
    <div
      style={{
        opacity: progress,
        transform: transform || undefined,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Scene title component
 */
const SceneTitle: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  return (
    <AnimatedEntrance delay={delay} type="scale">
      <h1
        style={{
          ...TYPOGRAPHY.title,
          color: COLORS.text,
          margin: 0,
          textAlign: 'center',
        }}
      >
        {text}
      </h1>
    </AnimatedEntrance>
  );
};

/**
 * Scene subtitle component
 */
const SceneSubtitle: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 10 }) => {
  return (
    <AnimatedEntrance delay={delay} type="slide" direction="up">
      <p
        style={{
          ...TYPOGRAPHY.subtitle,
          color: COLORS.textMuted,
          margin: 0,
          textAlign: 'center',
        }}
      >
        {text}
      </p>
    </AnimatedEntrance>
  );
};

/**
 * Subtitle bar (for narration text)
 */
const SubtitleBar: React.FC<{
  text: string;
  visible?: boolean;
}> = ({ text, visible = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = visible
    ? spring({
        frame,
        fps,
        config: SPRING_PRESETS.smooth,
      })
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '12px 24px',
          borderRadius: 8,
          maxWidth: '80%',
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.body,
            color: COLORS.text,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCENE COMPONENT
// ============================================

/**
 * Standard Scene Template
 *
 * Structure:
 * - Full-screen background with gradient
 * - Title area (top)
 * - Main content area (center)
 * - Subtitle area (bottom)
 *
 * Customize by:
 * 1. Changing COLORS and TYPOGRAPHY constants
 * 2. Adding your content in the Main Content section
 * 3. Adjusting timing with Sequence components
 */
export const SceneTemplate: React.FC<SceneProps> = ({
  title = 'Scene Title',
  subtitle = 'Scene subtitle goes here',
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background.dark} 0%, ${COLORS.background.medium} 100%)`,
      }}
    >
      {/* ========== TITLE SECTION ========== */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <SceneTitle text={title} delay={0} />
          <SceneSubtitle text={subtitle} delay={15} />
        </div>
      </Sequence>

      {/* ========== MAIN CONTENT SECTION ========== */}
      <Sequence from={30} durationInFrames={durationInFrames - 30}>
        <div
          style={{
            position: 'absolute',
            top: 200,
            left: 100,
            right: 100,
            bottom: 230,  // 1080 - 850 = 230, keeps content above subtitle zone
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/*
            ADD YOUR MAIN CONTENT HERE

            Examples:
            - Animated diagrams
            - SVG illustrations
            - Charts and graphs
            - Character animations
          */}
          <AnimatedEntrance delay={0} type="scale">
            <div
              style={{
                width: 400,
                height: 300,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  color: COLORS.textMuted,
                }}
              >
                Main Content Area
              </span>
            </div>
          </AnimatedEntrance>
        </div>
      </Sequence>

      {/* ========== SUBTITLE SECTION ========== */}
      <Sequence from={30} durationInFrames={durationInFrames - 30}>
        <SubtitleBar text="这里是字幕文字示例" />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================
// EXAMPLE: FORCE DIAGRAM SCENE
// ============================================

// ---- Sub-components defined OUTSIDE the scene (critical for performance) ----

/**
 * Ambient floating cloud for atmospheric depth.
 * Uses React.memo since the SVG structure is static — only position changes per frame.
 */
const AmbientCloud = React.memo<{
  x: number;
  y: number;
  size: number;
  drift: number;
  opacity: number;
}>(({ x, y, size, drift, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: x + drift,
      top: y,
      opacity: opacity * 0.6,
    }}
  >
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60">
      <ellipse cx="60" cy="40" rx="50" ry="18" fill="rgba(255,255,255,0.08)" />
      <ellipse cx="40" cy="30" rx="30" ry="16" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="80" cy="32" rx="25" ry="14" fill="rgba(255,255,255,0.06)" />
    </svg>
  </div>
));

/**
 * Kurzgesagt-style SVG airplane illustration.
 * Built from geometric shapes with gradients and rounded corners.
 *
 * Uses `idPrefix` to generate unique SVG gradient/filter IDs — this prevents
 * collisions when multiple instances exist in the same React tree.
 * ALWAYS use an idPrefix or React.useId() for SVG defs in reusable components.
 */
const AirplaneSVG = React.memo<{ idPrefix?: string }>(({ idPrefix = 'plane' }) => (
  <svg width={280} height={120} viewBox="0 0 280 120">
    <defs>
      {/* Fuselage gradient — light to darker blue-gray */}
      <linearGradient id={`${idPrefix}-fuselage`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8edf2" />
        <stop offset="100%" stopColor="#b8c6d4" />
      </linearGradient>
      {/* Wing gradient — slightly darker with blue tint */}
      <linearGradient id={`${idPrefix}-wing`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9fb3c8" />
        <stop offset="100%" stopColor="#7a94ab" />
      </linearGradient>
      {/* Engine glow */}
      <radialGradient id={`${idPrefix}-engine`}>
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Main wing (behind fuselage) */}
    <path
      d="M 100 58 L 60 35 L 180 35 L 170 58 Z"
      fill={`url(#${idPrefix}-wing)`}
      stroke="#6a849b"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Horizontal stabilizer (tail wing) */}
    <path
      d="M 30 55 L 15 42 L 65 42 L 60 55 Z"
      fill={`url(#${idPrefix}-wing)`}
      stroke="#6a849b"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Vertical tail fin */}
    <path
      d="M 35 55 L 25 20 L 50 20 L 55 55 Z"
      fill={`url(#${idPrefix}-fuselage)`}
      stroke="#9fb3c8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Fuselage — rounded capsule shape */}
    <rect
      x="30"
      y="45"
      width="210"
      height="30"
      rx="15"
      ry="15"
      fill={`url(#${idPrefix}-fuselage)`}
      stroke="#9fb3c8"
      strokeWidth="1.5"
    />
    {/* Nose cone — slightly darker */}
    <ellipse cx="240" cy="60" rx="18" ry="15" fill="#d0d8e0" stroke="#9fb3c8" strokeWidth="1.5" />
    {/* Cockpit window */}
    <path
      d="M 235 52 Q 250 52 252 58 Q 250 64 235 64 Z"
      fill="#4facfe"
      opacity="0.7"
    />
    {/* Passenger windows (row of small circles) */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle
        key={i}
        cx={100 + i * 22}
        cy={58}
        r={4}
        fill="#4facfe"
        opacity="0.5"
      />
    ))}
    {/* Engine under wing */}
    <ellipse cx="130" cy="72" rx="14" ry="8" fill="#8a9bb0" stroke="#6a849b" strokeWidth="1" />
    {/* Engine exhaust glow */}
    <circle cx="116" cy="72" r="8" fill={`url(#${idPrefix}-engine)`} />
  </svg>
));

/**
 * Force arrow with glow effect.
 * Uses `idPrefix` for unique SVG def IDs to prevent collisions.
 */
const ForceArrow: React.FC<{
  direction: 'up' | 'down' | 'left' | 'right';
  color: string;
  label: string;
  progress: number;
  idPrefix?: string;
}> = ({ direction, color, label, progress, idPrefix = 'arrow' }) => {
  const rotation = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
  }[direction];

  const gradId = `${idPrefix}-grad-${direction}`;
  const glowId = `${idPrefix}-glow-${direction}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: progress,
        transform: `scale(${progress})`,
      }}
    >
      <svg
        width={80}
        height={80}
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          {/* Glow filter for polished arrow effect */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#${glowId})`}>
          <line
            x1="15"
            y1="50"
            x2="65"
            y2="50"
            stroke={`url(#${gradId})`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 55 30 L 85 50 L 55 70"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <span
        style={{
          ...TYPOGRAPHY.label,
          color: color,
          marginTop: 8,
          textShadow: `0 0 8px ${color}`,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---- Main scene component ----

/**
 * Example scene showing how to create a force diagram
 *
 * KEY QUALITY STANDARDS demonstrated here:
 * 1. SVG illustration (not emoji/placeholder boxes) — the airplane is built from
 *    geometric shapes with gradients, rounded corners, and layered structure
 * 2. Ambient particles — floating clouds add depth and atmosphere
 * 3. Glow effects on arrows — subtle filter blur creates a polished look
 * 4. Multi-layer composition — background gradient + ambient layer + main content + UI
 *
 * PERFORMANCE STANDARDS demonstrated here:
 * 1. All sub-components (AmbientCloud, AirplaneSVG, ForceArrow) are defined
 *    OUTSIDE this function — never define components inside render!
 * 2. Static SVG (AirplaneSVG) uses React.memo to skip re-renders
 * 3. SVG def IDs use idPrefix to prevent collisions across instances
 * 4. Cloud drift is computed once per frame and passed as a prop (not via closure)
 *
 * When creating your own scenes, use this as the MINIMUM quality baseline.
 * Never use placeholder boxes or emoji as visual substitutes for real SVG illustrations.
 */
export const ForceDiagramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Pre-compute cloud drifts (one calculation per cloud per frame)
  const cloudConfigs = useMemo(() => [
    { x: -50, y: 120, size: 160, speed: 0.3, opacity: 1 },
    { x: 600, y: 80, size: 120, speed: 0.2, opacity: 0.8 },
    { x: 1200, y: 200, size: 140, speed: 0.25, opacity: 0.9 },
    { x: 300, y: 700, size: 100, speed: 0.15, opacity: 0.6 },
    { x: 900, y: 650, size: 130, speed: 0.35, opacity: 0.7 },
  ], []);

  // Pre-compute arrow spring values (avoids re-creating spring in child)
  const arrowProgress = (delay: number) =>
    spring({ frame: frame - delay, fps, config: SPRING_PRESETS.bouncy });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background.dark} 0%, ${COLORS.background.medium} 100%)`,
      }}
    >
      {/* ========== AMBIENT LAYER (depth & atmosphere) ========== */}
      {cloudConfigs.map((c, i) => (
        <AmbientCloud
          key={i}
          x={c.x}
          y={c.y}
          size={c.size}
          drift={interpolate(frame, [0, durationInFrames], [0, c.speed * 100], {
            extrapolateRight: 'clamp',
          })}
          opacity={c.opacity}
        />
      ))}

      {/* ========== TITLE ========== */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <SceneTitle text="飞机飞行的四个力" delay={0} />
      </div>

      {/* ========== CENTER: SVG Airplane illustration ========== */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <AnimatedEntrance delay={10} type="scale">
          <AirplaneSVG idPrefix="force-plane" />
        </AnimatedEntrance>
      </div>

      {/* ========== FORCE ARROWS with glow ========== */}
      {/* Lift - top */}
      <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)' }}>
        <ForceArrow direction="up" color="#4facfe" label="升力" progress={arrowProgress(30)} idPrefix="force" />
      </div>

      {/* Gravity - bottom */}
      <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)' }}>
        <ForceArrow direction="down" color="#fa709a" label="重力" progress={arrowProgress(50)} idPrefix="force" />
      </div>

      {/* Thrust - right */}
      <div style={{ position: 'absolute', top: '50%', right: '22%', transform: 'translateY(-50%)' }}>
        <ForceArrow direction="right" color="#38ef7d" label="推力" progress={arrowProgress(70)} idPrefix="force" />
      </div>

      {/* Drag - left */}
      <div style={{ position: 'absolute', top: '50%', left: '22%', transform: 'translateY(-50%)' }}>
        <ForceArrow direction="left" color="#eb3349" label="阻力" progress={arrowProgress(90)} idPrefix="force" />
      </div>

      {/* ========== SUBTITLE ========== */}
      <SubtitleBar text="这四个力共同决定了飞机能不能飞起来" />
    </AbsoluteFill>
  );
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default SceneTemplate;
