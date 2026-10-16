export const clamp01 = (value: number) => {
  'worklet';
  return Math.min(Math.max(value, 0), 1);
};

// Overshoots past 1 before settling, gives each dot a "pop"
export const easeOutBack = (t: number) => {
  'worklet';
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeOutCubic = (t: number) => {
  'worklet';
  return 1 - Math.pow(1 - t, 3);
};

export const easeInOutCubic = (t: number) => {
  'worklet';
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
