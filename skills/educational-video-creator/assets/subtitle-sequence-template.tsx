/**
 * SubtitleSequence Component Template
 *
 * Displays narration subtitles synchronized with audio segments.
 * Each segment fades in/out and is timed to match TTS audio.
 *
 * IMPORTANT:
 * - AUDIO_SEGMENTS uses LOCAL frame numbers (each scene starts from SCENE_PAD)
 * - This component runs INSIDE a scene's <Sequence>, so useCurrentFrame()
 *   returns local frame numbers — matching AUDIO_SEGMENTS directly
 * - Never use global frame numbers in AUDIO_SEGMENTS
 *
 * Usage:
 *   <SubtitleSequence segments={AUDIO_SEGMENTS.hook} />
 */

import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  Sequence,
} from 'remotion';

// ============================================
// TYPES
// ============================================

interface AudioSegment {
  text: string;
  file: string;
  startFrame: number;
  endFrame: number;
}

interface SubtitleSequenceProps {
  segments: readonly AudioSegment[];
  /** Font size for subtitle text (default: 36) */
  fontSize?: number;
  /** Bottom position in pixels (default: 20) */
  bottom?: number;
  /** Background color (default: rgba(0,0,0,0.7)) */
  backgroundColor?: string;
  /** Text color (default: #ffffff) */
  color?: string;
}

// ============================================
// COMPONENT
// ============================================

export const SubtitleSequence: React.FC<SubtitleSequenceProps> = ({
  segments,
  fontSize = 36,
  bottom = 20,
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  color = '#ffffff',
}) => {
  const FADE_FRAMES = 5; // Frames for fade in/out

  return (
    <>
      {segments.map((seg, i) => {
        const duration = seg.endFrame - seg.startFrame;

        // Skip segments with zero or negative duration
        if (duration <= 0) return null;

        return (
          <Sequence
            key={i}
            from={seg.startFrame}
            durationInFrames={duration}
          >
            <SubtitleText
              text={seg.text}
              duration={duration}
              fadeFrames={FADE_FRAMES}
              fontSize={fontSize}
              bottom={bottom}
              backgroundColor={backgroundColor}
              color={color}
            />
          </Sequence>
        );
      })}
    </>
  );
};

// ============================================
// SUBTITLE TEXT (extracted to avoid inline component)
// ============================================

const SubtitleText: React.FC<{
  text: string;
  duration: number;
  fadeFrames: number;
  fontSize: number;
  bottom: number;
  backgroundColor: string;
  color: string;
}> = ({ text, duration, fadeFrames, fontSize, bottom, backgroundColor, color }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeFrames, duration - fadeFrames, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 100px',
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '12px 24px',
          borderRadius: 8,
          maxWidth: '80%',
        }}
      >
        <span
          style={{
            fontFamily: 'inherit',
            fontSize,
            fontWeight: 400,
            lineHeight: 1.5,
            color,
            textAlign: 'center' as const,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default SubtitleSequence;
