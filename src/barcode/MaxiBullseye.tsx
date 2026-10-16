import React from 'react';
import { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { clamp01, easeOutBack } from '../easing';
import { circlePath } from './barcodeShapes';
import type { Timeline } from '../types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  cx: number;
  cy: number;
  radii: number[];
  color: string;
  animated: boolean;
  timeline: Timeline;
  progress: SharedValue<number>;
};

// Three dark rings, each one an inner / outer circle pair filled even-odd; rings open from the center out
export const MaxiBullseye = ({ cx, cy, radii, color, animated, timeline, progress }: Props) => {
  const { finderStart, finderDuration, finderStagger } = timeline;
  const finalPath = radii.map((r) => circlePath(cx, cy, r)).join('');

  const animatedProps = useAnimatedProps(() => {
    if (!animated || progress.value >= 1) return { d: finalPath };
    let d = '';
    for (let i = 0; i < radii.length; i += 2) {
      const local = clamp01((progress.value - finderStart - (i / 2) * finderStagger) / finderDuration);
      if (local <= 0) continue;
      const e = easeOutBack(local);
      d += circlePath(cx, cy, radii[i] * e) + circlePath(cx, cy, radii[i + 1] * e);
    }
    return { d: d || 'M0 0' };
  });

  return <AnimatedPath fill={color} fillRule="evenodd" animatedProps={animatedProps} />;
};
