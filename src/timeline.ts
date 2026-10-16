import type { Timeline } from './types';

// Fractions of the main progress (0 → 1)
export const DEFAULT_TIMELINE: Timeline = {
  dotStart: 0.08,
  dotSpread: 0.55,
  dotJitter: 0.06,
  dotDuration: 0.18,
  finderStart: 0.42,
  finderDuration: 0.3,
  finderCenterStart: 0.7,
  finderCenterDuration: 0.2,
  finderStagger: 0.04,
  logoStart: 0,
  logoDuration: 0.85,
  labelStart: 0.75,
  labelDuration: 0.25,
};

export const LOGO_PLACEHOLDER_OPACITY = 0.15;

const MIN_DURATION = 0.001;
const DURATION_KEYS = ['dotDuration', 'finderDuration', 'finderCenterDuration', 'logoDuration', 'labelDuration'] as const;

export const resolveTimeline = (partial?: Partial<Timeline>): Timeline => {
  const timeline = { ...DEFAULT_TIMELINE, ...partial };
  // Durations are divisors in the worklets, never let them hit zero
  for (const key of DURATION_KEYS) timeline[key] = Math.max(timeline[key], MIN_DURATION);
  return timeline;
};
