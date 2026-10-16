import React from 'react';
import { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { clamp01, easeInOutCubic, easeOutBack } from './easing';
import { roundedRectPath, squarePath } from './shapes';
import type { FinderAnimation, FinderShape, Timeline } from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  row: number;
  column: number;
  index: number;
  cellSize: number;
  offset: number;
  color: string;
  innerColor: string;
  // Fills the gap between ring and center, nothing drawn when unset
  backgroundColor?: string;
  shape: FinderShape;
  animation: FinderAnimation;
  timeline: Timeline;
  progress: SharedValue<number>;
};

export const FinderPattern = ({ row, column, index, cellSize, offset, color, innerColor, backgroundColor, shape, animation, timeline, progress }: Props) => {
  const x = offset + column * cellSize + cellSize / 2;
  const y = offset + row * cellSize + cellSize / 2;
  const side = cellSize * 6;
  const ringRadius = shape === 'rounded' ? cellSize * 1.5 : 0;
  const perimeter = 4 * (side - 2 * ringRadius) + 2 * Math.PI * ringRadius;
  const centerX = offset + (column + 3.5) * cellSize;
  const centerY = offset + (row + 3.5) * cellSize;
  const ringPath = roundedRectPath(x, y, side, side, ringRadius);
  // Inside edge of the ring: 5×5 cells, corner follows the ring's inner curve
  const backgroundSide = cellSize * 5;
  const backgroundRadius = shape === 'rounded' ? cellSize : 0;
  const backgroundPath = roundedRectPath(centerX - backgroundSide / 2, centerY - backgroundSide / 2, backgroundSide, backgroundSide, backgroundRadius);
  const { finderStart, finderDuration, finderCenterStart, finderCenterDuration, finderStagger } = timeline;

  // trace: ring drawn like a pen stroke; pop: ring scales out from its center
  const ringAnimatedProps = useAnimatedProps(() => {
    const local = animation === 'none' ? 1 : clamp01((progress.value - finderStart - index * finderStagger) / finderDuration);
    if (animation === 'pop') {
      if (local === 0) return { d: 'M0 0', strokeDashoffset: 0, strokeOpacity: 0 };
      const s = side * easeOutBack(local);
      return {
        d: roundedRectPath(centerX - s / 2, centerY - s / 2, s, s, ringRadius * easeOutBack(local)),
        strokeDashoffset: 0,
        strokeOpacity: 1,
      };
    }
    return {
      d: ringPath,
      strokeDashoffset: perimeter * (1 - easeInOutCubic(local)),
      strokeOpacity: local > 0 ? 1 : 0,
    };
  });

  // Background follows the ring: fades in while tracing, scales with it on pop
  const backgroundAnimatedProps = useAnimatedProps(() => {
    const local = animation === 'none' ? 1 : clamp01((progress.value - finderStart - index * finderStagger) / finderDuration);
    if (local === 0) return { d: 'M0 0', fillOpacity: 0 };
    if (animation === 'pop') {
      const s = backgroundSide * easeOutBack(local);
      return { d: roundedRectPath(centerX - s / 2, centerY - s / 2, s, s, backgroundRadius * easeOutBack(local)), fillOpacity: 1 };
    }
    return { d: backgroundPath, fillOpacity: animation === 'trace' ? easeInOutCubic(local) : 1 };
  });

  // Inner 3×3 square pops in once the ring is closed
  const centerAnimatedProps = useAnimatedProps(() => {
    const local = animation === 'none' ? 1 : clamp01((progress.value - finderCenterStart - index * finderStagger) / finderCenterDuration);
    if (local === 0) return { d: 'M0 0' };
    const half = (cellSize * 3 * easeOutBack(local)) / 2;
    return {
      d: shape === 'rounded'
        ? roundedRectPath(centerX - half, centerY - half, half * 2, half * 2, half * 0.4)
        : squarePath(centerX, centerY, half),
    };
  });

  return (
    <>
      {backgroundColor != null && <AnimatedPath fill={backgroundColor} animatedProps={backgroundAnimatedProps} />}
      {/* Square caps cover the corner where the trace closes on itself */}
      <AnimatedPath
        fill="none"
        stroke={color}
        strokeWidth={cellSize}
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeDasharray={animation === 'trace' ? [perimeter, perimeter] : undefined}
        animatedProps={ringAnimatedProps}
      />
      <AnimatedPath fill={innerColor} animatedProps={centerAnimatedProps} />
    </>
  );
};
