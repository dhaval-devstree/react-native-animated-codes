import type { ReactNode } from 'react';
import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { EasingFunction, SharedValue } from 'react-native-reanimated';

export type ErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high';
export type DotShape = 'square' | 'rounded' | 'circle';
export type FinderShape = 'square' | 'rounded';
export type AnimationType = 'ripple' | 'sweep' | 'spiral' | 'random' | 'fade' | 'scale' | 'none';
export type SweepDirection = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop';
export type DotTransition = 'pop' | 'grow';
export type FinderAnimation = 'trace' | 'pop' | 'none';
export type LogoAnimation = 'fill' | 'fade' | 'scale' | 'none';
export type LabelPosition = 'top' | 'bottom';

export type Point = { x: number; y: number };

export type Gradient =
  | { type: 'linear'; colors: string[]; start?: Point; end?: Point }
  | { type: 'radial'; colors: string[] };

// Every value is a fraction of the main progress (0 → 1)
export type Timeline = {
  dotStart: number;
  dotSpread: number;
  dotJitter: number;
  dotDuration: number;
  finderStart: number;
  finderDuration: number;
  finderCenterStart: number;
  finderCenterDuration: number;
  finderStagger: number;
  logoStart: number;
  logoDuration: number;
  labelStart: number;
  labelDuration: number;
};

// x / y are the dot center normalized to 0..1 over the code area
export type DotContext = { row: number; column: number; count: number; x: number; y: number };
export type DotOrder = (ctx: DotContext) => number;

export type Finder = { row: number; column: number };

export type QRData = {
  count: number;
  cellSize: number;
  offset: number;
  // Flat [cx, cy, start, cx, cy, start, ...] keeps the worklet loop cheap
  dots: number[];
  finalPath: string;
  finders: Finder[];
};

export type BuildOptions = {
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  quietZone: number;
  shape: DotShape;
  dotScale: number;
  order: DotOrder;
  timeline: Timeline;
};

export type AnimatedQRCodeRef = {
  play: () => void;
  reset: () => void;
  complete: () => void;
};

export type AnimatedQRCodeProps = {
  value: string;
  errorCorrection?: ErrorCorrectionLevel;

  size?: number;
  width?: number;
  height?: number;
  quietZone?: number;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;

  color?: string;
  backgroundColor?: string;
  gradient?: Gradient;
  finderColor?: string;
  finderInnerColor?: string;
  finderBackgroundColor?: string;

  dotShape?: DotShape;
  dotScale?: number;
  finderShape?: FinderShape;

  logo?: ImageSourcePropType;
  renderLogo?: (size: number) => ReactNode;
  logoSize?: number;
  logoPadding?: number;
  logoBorderRadius?: number;
  logoBackgroundColor?: string;
  logoPlaceholderOpacity?: number;
  logoStyle?: StyleProp<ImageStyle>;
  logoContainerStyle?: StyleProp<ViewStyle>;
  logoAnimation?: LogoAnimation;

  label?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelPosition?: LabelPosition;
  labelGap?: number;
  animateLabel?: boolean;

  animation?: AnimationType;
  direction?: SweepDirection;
  dotTransition?: DotTransition;
  dotEasing?: (t: number) => number;
  finderAnimation?: FinderAnimation;
  getDotOrder?: DotOrder;
  timeline?: Partial<Timeline>;
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  loop?: boolean;
  loopDelay?: number;
  autoPlay?: boolean;
  respectReduceMotion?: boolean;
  progress?: SharedValue<number>;

  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onError?: (error: Error) => void;

  testID?: string;
  accessibilityLabel?: string;
};

// Every symbology bwip-js can encode, see BARCODE_FORMATS for names and sample values
export type BarcodeFormat =
  | 'ean5'
  | 'ean2'
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'upce'
  | 'isbn'
  | 'ismn'
  | 'issn'
  | 'mands'
  | 'code128'
  | 'gs1-128'
  | 'ean14'
  | 'sscc18'
  | 'code39'
  | 'code39ext'
  | 'code32'
  | 'pzn'
  | 'code93'
  | 'code93ext'
  | 'interleaved2of5'
  | 'itf14'
  | 'identcode'
  | 'leitcode'
  | 'databaromni'
  | 'databarstacked'
  | 'databarstackedomni'
  | 'databartruncated'
  | 'databarlimited'
  | 'databarexpanded'
  | 'databarexpandedstacked'
  | 'gs1northamericancoupon'
  | 'pharmacode'
  | 'pharmacode2'
  | 'code2of5'
  | 'industrial2of5'
  | 'iata2of5'
  | 'matrix2of5'
  | 'coop2of5'
  | 'datalogic2of5'
  | 'code11'
  | 'bc412'
  | 'rationalizedCodabar'
  | 'onecode'
  | 'postnet'
  | 'planet'
  | 'royalmail'
  | 'auspost'
  | 'kix'
  | 'japanpost'
  | 'msi'
  | 'plessey'
  | 'telepen'
  | 'telepennumeric'
  | 'posicode'
  | 'codablockf'
  | 'code16k'
  | 'code49'
  | 'channelcode'
  | 'flattermarken'
  | 'raw'
  | 'daft'
  | 'symbol'
  | 'pdf417'
  | 'pdf417compact'
  | 'micropdf417'
  | 'datamatrix'
  | 'datamatrixrectangular'
  | 'datamatrixrectangularextension'
  | 'mailmark'
  | 'qrcode'
  | 'swissqrcode'
  | 'microqrcode'
  | 'rectangularmicroqrcode'
  | 'maxicode'
  | 'azteccode'
  | 'azteccodecompact'
  | 'aztecrune'
  | 'codeone'
  | 'hanxin'
  | 'dotcode'
  | 'gs1-cc'
  | 'ean13composite'
  | 'ean8composite'
  | 'upcacomposite'
  | 'upcecomposite'
  | 'databaromnicomposite'
  | 'databarstackedcomposite'
  | 'databarstackedomnicomposite'
  | 'databartruncatedcomposite'
  | 'databarlimitedcomposite'
  | 'databarexpandedcomposite'
  | 'databarexpandedstackedcomposite'
  | 'gs1-128composite'
  | 'd3aqr'
  | 'gs1datamatrix'
  | 'gs1datamatrixrectangular'
  | 'gs1dldatamatrix'
  | 'gs1qrcode'
  | 'gs1dlqrcode'
  | 'gs1dotcode'
  | 'hibccode39'
  | 'hibccode128'
  | 'hibcdatamatrix'
  | 'hibcdatamatrixrectangular'
  | 'hibcpdf417'
  | 'hibcmicropdf417'
  | 'hibcqrcode'
  | 'hibccodablockf'
  | "hibcazteccode";

// linear: 1D bars (also postal 4-state), matrix: 2D dot grid (also stacked codes), maxicode: hexagon grid
export type BarcodeKind = 'linear' | 'matrix' | 'maxicode';

export type BarcodeFormatInfo = {
  format: BarcodeFormat;
  name: string;
  kind: BarcodeKind;
  sample: string;
  encoderOptions?: BarcodeEncoderOptions;
};

// Passed straight to the bwip-js / BWIPP encoder (includecheck, parse, eclevel, columns, version...)
export type BarcodeEncoderOptions = Record<string, string | number | boolean>;

// Elements are flat number arrays so the worklet loop stays cheap:
// bars  [x, y, w, h, start, ...]
// cells [cx, cy, start, ...] (matrix dots and maxicode hexagons)
export type BarcodeData = {
  kind: BarcodeKind;
  width: number;
  height: number;
  elements: number[];
  stride: number;
  // matrix: cell side, maxicode: hexagon width
  cellSize: number;
  // maxicode only: hexagon height
  cellHeight: number;
  finalPath: string;
  // maxicode only: bullseye center and ring radii [inner, outer, inner, outer, ...]
  bullseye: { cx: number; cy: number; radii: number[] } | null;
};

export type BarcodeBuildOptions = {
  format: BarcodeFormat;
  encoderOptions?: BarcodeEncoderOptions;
  width: number;
  height: number;
  quietZone: number;
  shape: DotShape;
  dotScale: number;
  barRadius: number;
  order: DotOrder;
  timeline: Timeline;
};

export type AnimatedBarcodeRef = AnimatedQRCodeRef;

export type AnimatedBarcodeProps = {
  value: string;
  format?: BarcodeFormat;
  encoderOptions?: BarcodeEncoderOptions;

  size?: number;
  width?: number;
  height?: number;
  quietZone?: number;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;

  color?: string;
  backgroundColor?: string;
  gradient?: Gradient;
  bullseyeColor?: string;

  dotShape?: DotShape;
  dotScale?: number;
  barRadius?: number;

  showValue?: boolean;
  label?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelPosition?: LabelPosition;
  labelGap?: number;
  animateLabel?: boolean;

  animation?: AnimationType;
  direction?: SweepDirection;
  dotTransition?: DotTransition;
  dotEasing?: (t: number) => number;
  getDotOrder?: DotOrder;
  timeline?: Partial<Timeline>;
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  loop?: boolean;
  loopDelay?: number;
  autoPlay?: boolean;
  respectReduceMotion?: boolean;
  progress?: SharedValue<number>;

  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onError?: (error: Error) => void;

  testID?: string;
  accessibilityLabel?: string;
};
