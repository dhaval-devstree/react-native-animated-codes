import React, { type ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { clamp01, easeInOutCubic, easeOutBack } from './easing';
import type { LogoAnimation, Timeline } from './types';

type Props = {
  logo?: ImageSourcePropType;
  renderLogo?: (size: number) => ReactNode;
  logoSize: number;
  logoMargin: number;
  logoBorderRadius: number;
  logoBackgroundColor: string;
  backgroundColor: string;
  ghostOpacity: number;
  animation: LogoAnimation;
  logoStyle?: StyleProp<ImageStyle>;
  logoContainerStyle?: StyleProp<ViewStyle>;
  timeline: Timeline;
  progress: SharedValue<number>;
};

// Shared by Image and View, so only keys valid on both
type ContentStyle = { opacity?: number; position?: 'absolute'; left?: number; top?: number };

// Anchored to the top so the logo stays still while the fill grows
const FILL_CONTENT: ContentStyle = { position: 'absolute', left: 0, top: 0 };

export const QRLogo = ({
  logo, renderLogo, logoSize, logoMargin, logoBorderRadius, logoBackgroundColor,
  backgroundColor, ghostOpacity, animation, logoStyle, logoContainerStyle, timeline, progress,
}: Props) => {
  const backgroundSize = logoSize + logoMargin * 2;
  const backgroundRadius = logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;
  const { logoStart, logoDuration } = timeline;

  // Logo fills top → bottom, like liquid pouring in, while the code ripples out around it
  const fillStyle = useAnimatedStyle(() => {
    const local = clamp01((progress.value - logoStart) / logoDuration);
    return { height: logoSize * easeInOutCubic(local) };
  });

  const wrapStyle = useAnimatedStyle(() => {
    const local = animation === 'none' ? 1 : clamp01((progress.value - logoStart) / logoDuration);
    if (animation === 'fade') return { opacity: easeInOutCubic(local), transform: [{ scale: 1 }] };
    if (animation === 'scale') return { opacity: local > 0 ? 1 : 0, transform: [{ scale: easeOutBack(local) }] };
    return { opacity: 1, transform: [{ scale: 1 }] };
  });

  const renderContent = (extra?: ContentStyle) =>
    renderLogo ? (
      <View style={[{ width: logoSize, height: logoSize }, extra]}>{renderLogo(logoSize)}</View>
    ) : (
      <Image source={logo!} style={[{ width: logoSize, height: logoSize }, logoStyle, extra]} resizeMode="cover" />
    );

  return (
    <View style={[StyleSheet.absoluteFill, styles.wrapper]} pointerEvents="none">
      <Animated.View
        style={[
          { width: backgroundSize, height: backgroundSize, borderRadius: backgroundRadius, padding: logoMargin, backgroundColor },
          logoContainerStyle,
          wrapStyle,
        ]}
      >
        <View style={[styles.clip, { borderRadius: logoBorderRadius }]}>
          {animation === 'fill' ? (
            <>
              {renderContent({ opacity: ghostOpacity })}
              <Animated.View style={[styles.fill, { backgroundColor: logoBackgroundColor }, fillStyle]}>
                {renderContent(FILL_CONTENT)}
              </Animated.View>
            </>
          ) : (
            <View style={{ backgroundColor: logoBackgroundColor }}>{renderContent()}</View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  clip: { flex: 1, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, right: 0, top: 0, overflow: 'hidden' },
});
