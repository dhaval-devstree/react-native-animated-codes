import React from 'react';
import { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { easeOutBack, easeOutCubic } from '../easing';
import { modulePath } from '../shapes';
import { barPath, hexPath } from './barcodeShapes';
import type { BarcodeData, ModuleShape, ModuleTransition, Timeline } from '../types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  data: BarcodeData;
  shape: ModuleShape;
  moduleScale: number;
  barRadius: number;
  fill: string;
  transition: ModuleTransition;
  moduleEasing?: (t: number) => number;
  // fade / scale / none animate the whole group, elements render final immediately
  staticPath: boolean;
  timeline: Timeline;
  progress: SharedValue<number>;
};

export const BarcodeElements = ({ data, shape, moduleScale, barRadius, fill, transition, moduleEasing, staticPath, timeline, progress }: Props) => {
  const { kind, elements, stride, finalPath, cellSize, cellHeight } = data;
  const moduleDuration = timeline.moduleDuration;
  const ease = moduleEasing ?? (transition === 'grow' ? easeOutCubic : easeOutBack);
  const grow = transition === 'grow';
  const half = (cellSize * moduleScale) / 2;
  const halfH = (cellHeight * moduleScale) / 2;

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    if (staticPath || p >= 1) return { d: finalPath || 'M0 0' };
    let d = '';
    for (let k = 0; k < elements.length; k += stride) {
      const start = elements[k + stride - 1];
      const local = (p - start) / moduleDuration;
      if (local <= 0) continue;
      const e = ease(Math.min(local, 1));
      if (kind === 'linear') {
        const x = elements[k];
        const y = elements[k + 1];
        const w = elements[k + 2];
        const h = elements[k + 3];
        const nh = h * e;
        // grow rises from the bar bottom, pop opens from the bar middle
        d += barPath(x, grow ? y + h - nh : y + (h - nh) / 2, w, nh, barRadius);
      } else if (kind === 'maxicode') {
        d += hexPath(elements[k], elements[k + 1], half * e, halfH * e);
      } else {
        d += modulePath(elements[k], elements[k + 1], half * e, shape);
      }
    }
    // Empty `d` is not valid on all platforms, keep a zero-length move
    return { d: d || 'M0 0' };
  });

  return <AnimatedPath fill={fill} animatedProps={animatedProps} />;
};
