import React, { type ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { clamp01, easeInOutCubic } from './easing';
import type { Timeline } from './types';

type Props = {
  label: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  animated: boolean;
  timeline: Timeline;
  progress: SharedValue<number>;
};

const SLIDE_DISTANCE = 8;

export const QRLabel = ({ label, labelStyle, containerStyle, animated, timeline, progress }: Props) => {
  const { labelStart, labelDuration } = timeline;

  const style = useAnimatedStyle(() => {
    const local = animated ? clamp01((progress.value - labelStart) / labelDuration) : 1;
    const eased = easeInOutCubic(local);
    return { opacity: eased, transform: [{ translateY: (1 - eased) * SLIDE_DISTANCE }] };
  });

  return (
    <Animated.View style={[containerStyle, style]}>
      {typeof label === 'string' || typeof label === 'number'
        ? <Text style={[styles.text, labelStyle]}>{label}</Text>
        : label}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: { textAlign: 'center', fontSize: 16, color: '#000000' },
});
