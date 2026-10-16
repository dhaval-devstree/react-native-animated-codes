import { useCallback, useEffect, useRef } from 'react';
import {
  cancelAnimation, runOnJS, useReducedMotion, useSharedValue,
  withDelay, withRepeat, withSequence, withTiming,
  type EasingFunction, type SharedValue,
} from 'react-native-reanimated';
import type { AnimationType } from './types';

type Options = {
  animation: AnimationType;
  duration: number;
  delay: number;
  easing: EasingFunction;
  loop: boolean;
  loopDelay: number;
  autoPlay: boolean;
  respectReduceMotion: boolean;
  external?: SharedValue<number>;
  disabled: boolean;
  resetKey: string;
  onStart?: () => void;
  onComplete?: () => void;
};

export const useQRProgress = (options: Options) => {
  const reduceMotion = useReducedMotion();
  const internal = useSharedValue(0);
  const skip = options.animation === 'none' || (options.respectReduceMotion && reduceMotion);

  // Latest config + callbacks live in a ref so inline props never restart the animation
  const latest = useRef({ ...options, skip });
  latest.current = { ...options, skip };

  const fireComplete = useCallback(() => latest.current.onComplete?.(), []);

  const play = useCallback(() => {
    const o = latest.current;
    if (o.external || o.disabled) return;
    o.onStart?.();
    cancelAnimation(internal);
    if (o.skip) {
      internal.value = 1;
      fireComplete();
      return;
    }
    internal.value = 0;
    if (o.loop) {
      // withRepeat restarts from 0 each round, the trailing no-op timing holds the finished code
      internal.value = withDelay(o.delay, withRepeat(withSequence(
        withTiming(1, { duration: o.duration, easing: o.easing }),
        withDelay(o.loopDelay, withTiming(1, { duration: 0 }))
      ), -1, false));
      return;
    }
    internal.value = withDelay(o.delay, withTiming(1, { duration: o.duration, easing: o.easing }, (finished) => {
      if (finished) runOnJS(fireComplete)();
    }));
  }, [internal, fireComplete]);

  const reset = useCallback(() => {
    cancelAnimation(internal);
    internal.value = 0;
  }, [internal]);

  const complete = useCallback(() => {
    if (latest.current.external) return;
    cancelAnimation(internal);
    internal.value = 1;
    fireComplete();
  }, [internal, fireComplete]);

  useEffect(() => {
    if (options.autoPlay) play();
    else reset();
  }, [options.resetKey, options.autoPlay, options.disabled, skip, play, reset]);

  return { progress: options.external ?? internal, play, reset, complete };
};
