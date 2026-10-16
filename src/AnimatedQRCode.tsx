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
import { resolveModuleOrder } from './order';
import { QRLabel } from './QRLabel';
import { QRLogo } from './QRLogo';
import { QRModules } from './QRModules';
import { LOGO_GHOST_OPACITY, resolveTimeline } from './timeline';
import { useQRProgress } from './useQRProgress';
import type { AnimatedQRCodeProps, AnimatedQRCodeRef, QRData } from './types';

export const AnimatedQRCode = forwardRef<AnimatedQRCodeRef, AnimatedQRCodeProps>((props, ref) => {
  const {
    value, ecl = 'M',
    size, width, height, quietZone = 0,
    style, qrContainerStyle, cornerRadius = 0,
    color = '#000000', backgroundColor = '#FFFFFF', gradient, finderColor, finderInnerColor,
    moduleShape = 'square', moduleScale = 1, finderShape = 'square',
    logo, renderLogo, logoSize: logoSizeProp, logoMargin = 2, logoBorderRadius = 0,
    logoBackgroundColor = 'transparent', logoGhostOpacity = LOGO_GHOST_OPACITY,
    logoStyle, logoContainerStyle, logoAnimation = 'fill',
    label, labelStyle, labelContainerStyle, labelPosition = 'bottom', labelGap = 12, labelAnimated = true,
    animation = 'ripple', direction = 'ltr', moduleTransition = 'pop', moduleEasing,
    finderAnimation = 'trace', getModuleOrder, timeline: timelineProp,
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
  const order = useMemo(() => resolveModuleOrder(animation, direction, getModuleOrder), [animation, direction, getModuleOrder]);

  const { data, error } = useMemo<{ data: QRData | null; error: Error | null }>(() => {
    try {
      return { data: buildQRData(value, { size: qrSize, ecl, quietZone, shape: moduleShape, moduleScale, order, timeline }), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }, [value, qrSize, ecl, quietZone, moduleShape, moduleScale, order, timeline]);

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  useEffect(() => {
    if (error) onErrorRef.current?.(error);
  }, [error]);

  const logoBackgroundSize = logoSize + logoMargin * 2;
  useEffect(() => {
    if (__DEV__ && hasLogo && isLogoTooLarge(logoBackgroundSize, qrSize, ecl)) {
      console.warn(`AnimatedQRCode: logo covers too much of the code for ecl="${ecl}", use a smaller logo or higher ecl`);
    }
  }, [hasLogo, logoBackgroundSize, qrSize, ecl]);

  const { progress, play, reset, complete } = useQRProgress({
    animation, duration, delay, easing, loop, loopDelay, autoPlay, respectReduceMotion,
    external: externalProgress,
    disabled: error != null,
    // Only data / timing props restart, visual props never do
    resetKey: [value, qrSize, ecl, quietZone, animation, direction, duration, delay, loop, loopDelay, timelineKey].join('|'),
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
      animated={labelAnimated}
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
      <View testID={testID ? `${testID}-box` : undefined} style={[styles.box, { width: boxWidth, height: boxHeight }, qrContainerStyle]}>
        <Animated.View style={[{ width: qrSize, height: qrSize }, groupStyle]}>
          <Svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
            {hasGradient && <GradientDefs id={gradientId} gradient={gradient} width={qrSize} height={qrSize} />}
            <Rect width={qrSize} height={qrSize} rx={cornerRadius} ry={cornerRadius} fill={backgroundColor} />
            {data && (
              <QRModules
                data={data}
                shape={moduleShape}
                moduleScale={moduleScale}
                fill={fill}
                transition={moduleTransition}
                moduleEasing={moduleEasing}
                staticPath={isGroup}
                timeline={timeline}
                progress={progress}
              />
            )}
            {data?.finders.map((finder, index) => (
              <FinderPattern
                key={`finder-${index}`}
                row={finder.row}
                col={finder.col}
                index={index}
                cellSize={data.cellSize}
                offset={data.offset}
                color={ringColor}
                innerColor={centerColor}
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
              logoMargin={logoMargin}
              logoBorderRadius={logoBorderRadius}
              logoBackgroundColor={logoBackgroundColor}
              backgroundColor={backgroundColor}
              ghostOpacity={logoGhostOpacity}
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
