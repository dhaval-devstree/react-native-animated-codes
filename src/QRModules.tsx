import React from 'react';
import { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { easeOutBack, easeOutCubic } from './easing';
import { modulePath } from './shapes';
import type { ModuleShape, ModuleTransition, QRData, Timeline } from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  data: QRData;
  shape: ModuleShape;
  moduleScale: number;
  fill: string;
  transition: ModuleTransition;
  moduleEasing?: (t: number) => number;
  // fade / scale / none animate the whole group, modules render final immediately
  staticPath: boolean;
  timeline: Timeline;
  progress: SharedValue<number>;
};

export const QRModules = ({ data, shape, moduleScale, fill, transition, moduleEasing, staticPath, timeline, progress }: Props) => {
  const { dataModules, finalPath, cellSize } = data;
  const halfMax = (cellSize * moduleScale) / 2;
  const moduleDuration = timeline.moduleDuration;
  const ease = moduleEasing ?? (transition === 'grow' ? easeOutCubic : easeOutBack);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    if (staticPath || p >= 1) return { d: finalPath || 'M0 0' };
    let d = '';
    for (let k = 0; k < dataModules.length; k += 3) {
      const local = (p - dataModules[k + 2]) / moduleDuration;
      if (local <= 0) continue;
      d += modulePath(dataModules[k], dataModules[k + 1], halfMax * ease(Math.min(local, 1)), shape);
    }
    // Empty `d` is not valid on all platforms, keep a zero-length move
    return { d: d || 'M0 0' };
  });

  return <AnimatedPath fill={fill} animatedProps={animatedProps} />;
};
