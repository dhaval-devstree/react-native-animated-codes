import React, { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import { buildQRData } from './buildQRData';
import { clamp01, easeInOutCubic, easeOutBack } from './easing';
import { FinderPattern } from './FinderPattern';
import { GradientDefs } from './GradientDefs';
import { resolveLayout } from './layout';
import { isLogoTooLarge } from './logoCapacity';
import { resolveDotOrder } from './order';
import { QRLabel } from './QRLabel';
import { QRLogo } from './QRLogo';
import { QRDots } from './QRDots';
import { LOGO_PLACEHOLDER_OPACITY, resolveTimeline } from './timeline';
import { useQRProgress } from './useQRProgress';
import type { AnimatedQRCodeProps, AnimatedQRCodeRef, QRData } from './types';

export const AnimatedQRCode = forwardRef<AnimatedQRCodeRef, AnimatedQRCodeProps>((props, ref) => {
  const {
    value, errorCorrection = 'medium',
    size, width, height, quietZone = 0,
    style, containerStyle, borderRadius = 0,
    color = '#000000', backgroundColor = '#FFFFFF', gradient, finderColor, finderInnerColor, finderBackgroundColor,
    dotShape = 'square', dotScale = 1, finderShape = 'square',
    logo, renderLogo, logoSize: logoSizeProp, logoPadding = 2, logoBorderRadius = 0,
    logoBackgroundColor = 'transparent', logoPlaceholderOpacity = LOGO_PLACEHOLDER_OPACITY,
    logoStyle, logoContainerStyle, logoAnimation = 'fill',
    label, labelStyle, labelContainerStyle, labelPosition = 'bottom', labelGap = 12, animateLabel = true,
    animation = 'ripple', direction = 'leftToRight', dotTransition = 'pop', dotEasing,
    finderAnimation = 'trace', getDotOrder, timeline: timelineProp,
    duration = 1200, delay = 350, easing = Easing.linear,
    loop = false, loopDelay = 1000, autoPlay = true, respectReduceMotion = true,
    progress: externalProgress,
    onAnimationStart, onAnimationComplete, onError,
    testID, accessibilityLabel,
  } = props;

  const { qrSize, boxWidth, boxHeight } = resolveLayout({ size, width, height });
  const logoSize = logoSizeProp ?? qrSize * 0.2;
  const hasLogo = logo != null || renderLogo != null;
  const isGroup = animation === 'fade' || animation === 'scale' || animation === 'none';

  // Inline `timeline={{ ... }}` objects are a new reference every render, key on content instead
  const timelineKey = JSON.stringify(timelineProp ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeline = useMemo(() => resolveTimeline(timelineProp), [timelineKey]);
  const order = useMemo(() => resolveDotOrder(animation, direction, getDotOrder), [animation, direction, getDotOrder]);

  const { data, error } = useMemo<{ data: QRData | null; error: Error | null }>(() => {
    try {
      return { data: buildQRData(value, { size: qrSize, errorCorrection, quietZone, shape: dotShape, dotScale, order, timeline }), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }, [value, qrSize, errorCorrection, quietZone, dotShape, dotScale, order, timeline]);

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  useEffect(() => {
    if (error) onErrorRef.current?.(error);
  }, [error]);

  const logoBackgroundSize = logoSize + logoPadding * 2;
  useEffect(() => {
    if (__DEV__ && hasLogo && isLogoTooLarge(logoBackgroundSize, qrSize, errorCorrection)) {
      console.warn(`AnimatedQRCode: logo covers too much of the code for errorCorrection="${errorCorrection}", use a smaller logo or higher errorCorrection`);
    }
  }, [hasLogo, logoBackgroundSize, qrSize, errorCorrection]);

  const { progress, play, reset, complete } = useQRProgress({
    animation, duration, delay, easing, loop, loopDelay, autoPlay, respectReduceMotion,
    external: externalProgress,
    disabled: error != null,
    // Only data / timing props restart, visual props never do
    resetKey: [value, qrSize, errorCorrection, quietZone, animation, direction, duration, delay, loop, loopDelay, timelineKey].join('|'),
    onStart: onAnimationStart,
    onComplete: onAnimationComplete,
  });

  useImperativeHandle(ref, () => ({ play, reset, complete }), [play, reset, complete]);

  const groupStyle = useAnimatedStyle(() => {
    const p = clamp01(progress.value);
    if (animation === 'fade') return { opacity: easeInOutCubic(p), transform: [{ scale: 1 }] };
    if (animation === 'scale') return { opacity: clamp01(p * 4), transform: [{ scale: easeOutBack(p) }] };
    return { opacity: 1, transform: [{ scale: 1 }] };
  });

  // useId returns ":r0:" style ids, colons break `url(#id)` references
  const gradientId = `qrg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const hasGradient = gradient != null && gradient.colors.length > 1;
  const fill = hasGradient ? `url(#${gradientId})` : gradient?.colors[0] ?? color;
  const ringColor = finderColor ?? fill;
  const centerColor = finderInnerColor ?? ringColor;

  const labelNode = label != null ? (
    <QRLabel
      label={label}
      labelStyle={labelStyle}
      containerStyle={[labelPosition === 'top' ? { marginBottom: labelGap } : { marginTop: labelGap }, labelContainerStyle]}
      animated={animateLabel}
      timeline={timeline}
      progress={progress}
    />
  ) : null;

  return (
    <View
      testID={testID}
      style={[styles.root, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : 'QR code')}
    >
      {labelPosition === 'top' && labelNode}
      <View testID={testID ? `${testID}-box` : undefined} style={[styles.box, { width: boxWidth, height: boxHeight }, containerStyle]}>
        <Animated.View style={[{ width: qrSize, height: qrSize }, groupStyle]}>
          <Svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
            {hasGradient && <GradientDefs id={gradientId} gradient={gradient} width={qrSize} height={qrSize} />}
            <Rect width={qrSize} height={qrSize} rx={borderRadius} ry={borderRadius} fill={backgroundColor} />
            {data && (
              <QRDots
                data={data}
                shape={dotShape}
                dotScale={dotScale}
                fill={fill}
                transition={dotTransition}
                dotEasing={dotEasing}
                staticPath={isGroup}
                timeline={timeline}
                progress={progress}
              />
            )}
            {data?.finders.map((finder, index) => (
              <FinderPattern
                key={`finder-${index}`}
                row={finder.row}
                column={finder.column}
                index={index}
                cellSize={data.cellSize}
                offset={data.offset}
                color={ringColor}
                innerColor={centerColor}
                backgroundColor={finderBackgroundColor}
                shape={finderShape}
                animation={isGroup ? 'none' : finderAnimation}
                timeline={timeline}
                progress={progress}
              />
            ))}
          </Svg>
          {data && hasLogo && (
            <QRLogo
              logo={logo}
              renderLogo={renderLogo}
              logoSize={logoSize}
              logoPadding={logoPadding}
              logoBorderRadius={logoBorderRadius}
              logoBackgroundColor={logoBackgroundColor}
              backgroundColor={backgroundColor}
              placeholderOpacity={logoPlaceholderOpacity}
              animation={logoAnimation}
              logoStyle={logoStyle}
              logoContainerStyle={logoContainerStyle}
              timeline={timeline}
              progress={progress}
            />
          )}
        </Animated.View>
      </View>
      {labelPosition === 'bottom' && labelNode}
    </View>
  );
});

AnimatedQRCode.displayName = 'AnimatedQRCode';

export default AnimatedQRCode;

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  box: { alignItems: 'center', justifyContent: 'center' },
});
