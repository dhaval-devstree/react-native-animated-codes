import React from 'react';
import { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { easeOutBack, easeOutCubic } from './easing';
import { dotPath } from './shapes';
import type { DotShape, DotTransition, QRData, Timeline } from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  data: QRData;
  shape: DotShape;
  dotScale: number;
  fill: string;
  transition: DotTransition;
  dotEasing?: (t: number) => number;
  // fade / scale / none animate the whole group, dots render final immediately
  staticPath: boolean;
  timeline: Timeline;
  progress: SharedValue<number>;
};

export const QRDots = ({ data, shape, dotScale, fill, transition, dotEasing, staticPath, timeline, progress }: Props) => {
  const { dots, finalPath, cellSize } = data;
  const halfMax = (cellSize * dotScale) / 2;
  const dotDuration = timeline.dotDuration;
  const ease = dotEasing ?? (transition === 'grow' ? easeOutCubic : easeOutBack);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    if (staticPath || p >= 1) return { d: finalPath || 'M0 0' };
    let d = '';
    for (let k = 0; k < dots.length; k += 3) {
      const local = (p - dots[k + 2]) / dotDuration;
      if (local <= 0) continue;
      d += dotPath(dots[k], dots[k + 1], halfMax * ease(Math.min(local, 1)), shape);
    }
    // Empty `d` is not valid on all platforms, keep a zero-length move
    return { d: d || 'M0 0' };
  });

  return <AnimatedPath fill={fill} animatedProps={animatedProps} />;
};
