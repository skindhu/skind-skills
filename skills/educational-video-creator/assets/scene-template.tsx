/**
 * Standard Scene Template for Educational Videos
 *
 * Copy this template when creating new scenes.
 * Customize the content while keeping the structure.
 */

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import React from 'react';

// ============================================
// CONFIGURATION
// ============================================

interface SceneProps {
  title?: string;
  subtitle?: string;
}

// Design tokens - customize per video
const COLORS = {
  background: '#1a1a2e',
  backgroundGradientEnd: '#16213e',
  primary: '#4facfe',
  secondary: '#fa709a',
  text: '#ffffff',
  textMuted: '#b0b0b0',
  accent: '#e94560',
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
    fontSize: 32,
    fontWeight: 400,
    fontFamily: 'Noto Sans SC, sans-serif',
  },
  label: {
    fontSize: 24,
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
        bottom: 80,
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
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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

/**
 * Example scene showing how to create a force diagram
 */
export const ForceDiagramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrance for arrows
  const arrowDelay = 20; // frames between each arrow

  // Arrow component
  const ForceArrow: React.FC<{
    direction: 'up' | 'down' | 'left' | 'right';
    color: string;
    label: string;
    delay: number;
  }> = ({ direction, color, label, delay }) => {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: SPRING_PRESETS.bouncy,
    });

    const rotation = {
      up: -90,
      down: 90,
      left: 180,
      right: 0,
    }[direction];

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
            <linearGradient id={`gradient-${direction}`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          <line
            x1="15"
            y1="50"
            x2="65"
            y2="50"
            stroke={`url(#gradient-${direction})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 55 30 L 85 50 L 55 70"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            ...TYPOGRAPHY.label,
            color: color,
            marginTop: 8,
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      {/* Title */}
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

      {/* Center: Airplane placeholder */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Airplane shape */}
        <AnimatedEntrance delay={10} type="scale">
          <div
            style={{
              width: 200,
              height: 80,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: COLORS.textMuted }}>✈️ 飞机</span>
          </div>
        </AnimatedEntrance>
      </div>

      {/* Force arrows positioned around the airplane */}
      {/* Lift - top */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
        <ForceArrow direction="up" color="#4facfe" label="升力" delay={30} />
      </div>

      {/* Gravity - bottom */}
      <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)' }}>
        <ForceArrow direction="down" color="#fa709a" label="重力" delay={50} />
      </div>

      {/* Thrust - right */}
      <div style={{ position: 'absolute', top: '50%', right: '25%', transform: 'translateY(-50%)' }}>
        <ForceArrow direction="right" color="#38ef7d" label="推力" delay={70} />
      </div>

      {/* Drag - left */}
      <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translateY(-50%)' }}>
        <ForceArrow direction="left" color="#eb3349" label="阻力" delay={90} />
      </div>

      {/* Subtitle */}
      <SubtitleBar text="这四个力共同决定了飞机能不能飞起来" />
    </AbsoluteFill>
  );
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default SceneTemplate;
