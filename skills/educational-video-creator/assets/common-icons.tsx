/**
 * Common SVG Icons for Educational Videos
 * 
 * Pre-built icon components with animation support.
 * Copy and customize for your project.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// ============================================
// COMMON PROPS
// ============================================

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  animateIn?: boolean;
  startFrame?: number;
  style?: React.CSSProperties;
}

// ============================================
// ANIMATION HELPER
// ============================================

const useIconAnimation = (animateIn: boolean, startFrame: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (!animateIn) return { scale: 1, opacity: 1 };
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  
  return {
    scale: interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
    opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
  };
};

// ============================================
// DIRECTIONAL ARROWS
// ============================================

export const ArrowUp: React.FC<IconProps> = ({
  size = 48,
  color = '#ffffff',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M24 40V8M24 8L12 20M24 8L36 20"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowDown: React.FC<IconProps> = ({
  size = 48,
  color = '#ffffff',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M24 8V40M24 40L12 28M24 40L36 28"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowLeft: React.FC<IconProps> = ({
  size = 48,
  color = '#ffffff',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M40 24H8M8 24L20 12M8 24L20 36"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowRight: React.FC<IconProps> = ({
  size = 48,
  color = '#ffffff',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M8 24H40M40 24L28 12M40 24L28 36"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// STATUS ICONS
// ============================================

export const Checkmark: React.FC<IconProps> = ({
  size = 48,
  color = '#00b894',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M8 24L18 34L40 12"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Cross: React.FC<IconProps> = ({
  size = 48,
  color = '#e17055',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M12 12L36 36M36 12L12 36"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const QuestionMark: React.FC<IconProps> = ({
  size = 48,
  color = '#fdcb6e',
  strokeWidth = 4,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M16 16C16 12 20 8 24 8C28 8 32 12 32 16C32 20 28 22 24 24V28"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="36" r="2" fill={color} />
    </svg>
  );
};

// ============================================
// COMMON SHAPES
// ============================================

export const Circle: React.FC<IconProps & { filled?: boolean }> = ({
  size = 48,
  color = '#4facfe',
  strokeWidth = 4,
  filled = false,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const Star: React.FC<IconProps & { filled?: boolean }> = ({
  size = 48,
  color = '#f9ed69',
  strokeWidth = 2,
  filled = true,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M24 4L29 18H44L32 28L37 42L24 34L11 42L16 28L4 18H19L24 4Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// EDUCATIONAL ICONS
// ============================================

export const Lightbulb: React.FC<IconProps> = ({
  size = 48,
  color = '#fdcb6e',
  strokeWidth = 3,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M24 4C16 4 10 10 10 18C10 24 14 28 16 32V36H32V32C34 28 38 24 38 18C38 10 32 4 24 4Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 40H30M20 44H28"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Gear: React.FC<IconProps> = ({
  size = 48,
  color = '#74b9ff',
  strokeWidth = 3,
  animateIn = false,
  startFrame = 0,
  style,
}) => {
  const { scale, opacity } = useIconAnimation(animateIn, startFrame);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scale(${scale})`, opacity, ...style }}
    >
      <path
        d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        d="M38 24C38 23.2 37.9 22.4 37.8 21.6L42 18L38 11L33.2 13.2C31.8 12 30.2 11 28.4 10.4L27.6 5H20.4L19.6 10.4C17.8 11 16.2 12 14.8 13.2L10 11L6 18L10.2 21.6C10.1 22.4 10 23.2 10 24C10 24.8 10.1 25.6 10.2 26.4L6 30L10 37L14.8 34.8C16.2 36 17.8 37 19.6 37.6L20.4 43H27.6L28.4 37.6C30.2 37 31.8 36 33.2 34.8L38 37L42 30L37.8 26.4C37.9 25.6 38 24.8 38 24Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// EXPORT ALL
// ============================================

export const Icons = {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Checkmark,
  Cross,
  QuestionMark,
  Circle,
  Star,
  Lightbulb,
  Gear,
};

export default Icons;
