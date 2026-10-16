import { roundedRectPath } from '../shapes';

// Pointy-top hexagon, MaxiCode dot
export const hexPath = (cx: number, cy: number, halfW: number, halfH: number) => {
  'worklet';
  if (halfW <= 0 || halfH <= 0) return '';
  const q = halfH / 2;
  return `M${cx} ${cy - halfH}L${cx - halfW} ${cy - q}L${cx - halfW} ${cy + q}L${cx} ${cy + halfH}L${cx + halfW} ${cy + q}L${cx + halfW} ${cy - q}Z`;
};

export const circlePath = (cx: number, cy: number, r: number) => {
  'worklet';
  if (r <= 0) return '';
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
};

export const barPath = (x: number, y: number, w: number, h: number, radius: number) => {
  'worklet';
  if (w <= 0 || h <= 0) return '';
  return roundedRectPath(x, y, w, h, radius);
};
