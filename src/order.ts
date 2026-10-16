import type { AnimationType, ModuleOrder, SweepDirection } from './types';

// Deterministic 0..1 noise so the ripple looks organic but stays stable between renders
export const pseudoRandom = (i: number, j: number) => {
  const x = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const distanceFromCenter = (x: number, y: number) => Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;

export const resolveModuleOrder = (
  animation: AnimationType,
  direction: SweepDirection,
  custom?: ModuleOrder
): ModuleOrder => {
  if (custom) return custom;
  switch (animation) {
    case 'sweep':
      return ({ x, y }) =>
        direction === 'ltr' ? x : direction === 'rtl' ? 1 - x : direction === 'ttb' ? y : 1 - y;
    case 'spiral':
      return ({ x, y }) => {
        const angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (2 * Math.PI);
        return (angle + distanceFromCenter(x, y)) / 2;
      };
    case 'random':
      return ({ row, col }) => pseudoRandom(row + 101, col + 57);
    default:
      // ripple, also used by fade / scale / none where per-module order is ignored
      return ({ x, y }) => distanceFromCenter(x, y);
  }
};
