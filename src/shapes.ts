import type { DotShape } from './types';

export const squarePath = (cx: number, cy: number, half: number) => {
  'worklet';
  return `M${cx - half} ${cy - half}h${half * 2}v${half * 2}h${-half * 2}Z`;
};

export const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
  'worklet';
  if (r <= 0) return `M${x} ${y}h${w}v${h}h${-w}Z`;
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr} ${y}h${w - 2 * rr}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${h - 2 * rr}a${rr} ${rr} 0 0 1 ${-rr} ${rr}h${-(w - 2 * rr)}a${rr} ${rr} 0 0 1 ${-rr} ${-rr}v${-(h - 2 * rr)}a${rr} ${rr} 0 0 1 ${rr} ${-rr}Z`;
};

export const dotPath = (cx: number, cy: number, half: number, shape: DotShape) => {
  'worklet';
  if (half <= 0) return '';
  if (shape === 'circle') {
    return `M${cx - half} ${cy}a${half} ${half} 0 1 0 ${half * 2} 0a${half} ${half} 0 1 0 ${-half * 2} 0Z`;
  }
  if (shape === 'rounded') return roundedRectPath(cx - half, cy - half, half * 2, half * 2, half * 0.5);
  return squarePath(cx, cy, half);
};
