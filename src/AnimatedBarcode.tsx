import React, { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import { BarcodeElements } from './barcode/BarcodeElements';
import { buildBarcodeData } from './barcode/buildBarcodeData';
import { BARCODE_FORMATS } from './barcode/formats';
import { MaxiBullseye } from './barcode/MaxiBullseye';
import { clamp01, easeInOutCubic, easeOutBack } from './easing';
import { GradientDefs } from './GradientDefs';
import { resolveDotOrder } from './order';
import { QRLabel } from './QRLabel';
import { resolveTimeline } from './timeline';
import { useQRProgress } from './useQRProgress';
import type { AnimatedBarcodeProps, AnimatedBarcodeRef, BarcodeData, BarcodeFormat, BarcodeKind } from './types';

const KIND_BY_FORMAT = new Map<BarcodeFormat, BarcodeKind>(BARCODE_FORMATS.map((f) => [f.format, f.kind]));

export const getBarcodeKind = (format: BarcodeFormat): BarcodeKind => KIND_BY_FORMAT.get(format) ?? 'matrix';

const DEFAULT_LINEAR_WIDTH = 300;
const LINEAR_HEIGHT_RATIO = 0.4;
const DEFAULT_2D_SIZE = 200;
const DEFAULT_QUIET_ZONE: Record<BarcodeKind, number> = { linear: 10, matrix: 2, maxicode: 1 };

export const AnimatedBarcode = forwardRef<AnimatedBarcodeRef, AnimatedBarcodeProps>((props, ref) => {
  const { value, format = 'code128', encoderOptions } = props;
  const kind = getBarcodeKind(format);
  const isLinear = kind === 'linear';

  const {
    size, width: widthProp, height: heightProp, quietZone = DEFAULT_QUIET_ZONE[kind],
    style, containerStyle, borderRadius = 0,
    color = '#000000', backgroundColor = '#FFFFFF', gradient, bullseyeColor,
    dotShape = format.includes('dotcode') ? 'circle' : 'square', dotScale = 1, barRadius = 0,
    showValue = isLinear, label: labelProp, labelStyle, labelContainerStyle,
    labelPosition = 'bottom', labelGap = 8, animateLabel = true,
    animation = 'sweep', direction = 'leftToRight', dotTransition = isLinear ? 'grow' : 'pop', dotEasing,
    getDotOrder, timeline: timelineProp,
    duration = 1200, delay = 350, easing = Easing.linear,
    loop = false, loopDelay = 1000, autoPlay = true, respectReduceMotion = true,
    progress: externalProgress,
    onAnimationStart, onAnimationComplete, onError,
    testID, accessibilityLabel,
  } = props;

  // Linear codes default to a wide box, 2D codes to a square
  const width = widthProp ?? size ?? (isLinear ? DEFAULT_LINEAR_WIDTH : heightProp ?? DEFAULT_2D_SIZE);
  const height = heightProp ?? (isLinear ? width * LINEAR_HEIGHT_RATIO : size ?? width);
  const isGroup = animation === 'fade' || animation === 'scale' || animation === 'none';

  // Inline `timeline={{ ... }}` / `encoderOptions={{ ... }}` objects are a new reference every render, key on content instead
  const timelineKey = JSON.stringify(timelineProp ?? {});
  const encoderOptionsKey = JSON.stringify(encoderOptions ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeline = useMemo(() => resolveTimeline(timelineProp), [timelineKey]);
  const order = useMemo(() => resolveDotOrder(animation, direction, getDotOrder), [animation, direction, getDotOrder]);

  const { data, error } = useMemo<{ data: BarcodeData | null; error: Error | null }>(() => {
    try {
      return {
        data: buildBarcodeData(value, { format, encoderOptions, width, height, quietZone, shape: dotShape, dotScale, barRadius, order, timeline }),
        error: null,
      };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format, encoderOptionsKey, width, height, quietZone, dotShape, dotScale, barRadius, order, timeline]);

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  useEffect(() => {
    if (error) onErrorRef.current?.(error);
  }, [error]);

  const { progress, play, reset, complete } = useQRProgress({
    animation, duration, delay, easing, loop, loopDelay, autoPlay, respectReduceMotion,
    external: externalProgress,
    disabled: error != null,
    // Only data / timing props restart, visual props never do
    resetKey: [value, format, encoderOptionsKey, width, height, quietZone, animation, direction, duration, delay, loop, loopDelay, timelineKey].join('|'),
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
  const gradientId = `bcg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const hasGradient = gradient != null && gradient.colors.length > 1;
  const fill = hasGradient ? `url(#${gradientId})` : gradient?.colors[0] ?? color;

  const label = labelProp ?? (showValue ? value : undefined);
  const labelNode = label != null ? (
    <QRLabel
      label={label}
      labelStyle={[labelProp == null && styles.valueText, labelStyle]}
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
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : `${format} barcode`)}
    >
      {labelPosition === 'top' && labelNode}
      <Animated.View testID={testID ? `${testID}-box` : undefined} style={[{ width, height }, containerStyle, groupStyle]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {hasGradient && <GradientDefs id={gradientId} gradient={gradient} width={width} height={height} />}
          <Rect width={width} height={height} rx={borderRadius} ry={borderRadius} fill={backgroundColor} />
          {data && (
            <BarcodeElements
              data={data}
              shape={dotShape}
              dotScale={dotScale}
              barRadius={barRadius}
              fill={fill}
              transition={dotTransition}
              dotEasing={dotEasing}
              staticPath={isGroup}
              timeline={timeline}
              progress={progress}
            />
          )}
          {data?.bullseye && (
            <MaxiBullseye
              cx={data.bullseye.cx}
              cy={data.bullseye.cy}
              radii={data.bullseye.radii}
              color={bullseyeColor ?? fill}
              animated={!isGroup}
              timeline={timeline}
              progress={progress}
            />
          )}
        </Svg>
      </Animated.View>
      {labelPosition === 'bottom' && labelNode}
    </View>
  );
});

AnimatedBarcode.displayName = 'AnimatedBarcode';

export default AnimatedBarcode;

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  valueText: {
    fontSize: 14,
    letterSpacing: 2,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
});
