import React from 'react';
import { Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import type { Gradient } from './types';

type Props = { id: string; gradient: Gradient; width: number; height: number };

export const GradientDefs = ({ id, gradient, width, height }: Props) => {
  const stops = gradient.colors.map((c, i, all) => (
    <Stop key={`${c}-${i}`} offset={all.length > 1 ? i / (all.length - 1) : 0} stopColor={c} />
  ));

  return (
    <Defs>
      {gradient.type === 'radial' ? (
        <RadialGradient id={id} cx={width / 2} cy={height / 2} r={Math.max(width, height) / 2} gradientUnits="userSpaceOnUse">
          {stops}
        </RadialGradient>
      ) : (
        <LinearGradient
          id={id}
          x1={(gradient.start?.x ?? 0) * width}
          y1={(gradient.start?.y ?? 0) * height}
          x2={(gradient.end?.x ?? 1) * width}
          y2={(gradient.end?.y ?? 1) * height}
          gradientUnits="userSpaceOnUse"
        >
          {stops}
        </LinearGradient>
      )}
    </Defs>
  );
};
