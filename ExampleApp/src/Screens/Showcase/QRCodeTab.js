// Global Imports
import React, { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import AnimatedQRCode from 'react-native-animated-codes';

// Local Imports
import styles from './styles';
import Colors from '../../Helper/Colors';
import { Images } from '../../Assets/Images';

// Components Imports
import Icon from '../../Components/Icon';
import PlaybackControls from '../../Components/PlaybackControls';

// Defined at module level so the reference stays stable between renders
const diagonalOrder = ({ x, y }) => (x + y) / 2;
const checkerOrder = ({ row, col }) => ((row + col) % 2 === 0 ? 0 : 1);

// Custom worklet easing, runs on the UI thread
const elasticEasing = (t) => {
  'worklet';
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

const SHOWCASE_ITEMS = [
  {
    title: 'Default ripple + logo fill',
    subtitle: 'Original badge look: ripple modules, traced finders, liquid logo fill.',
    props: {
      value: 'USER:2f1c7a1e-0000-4000-8000-000000000000',
      logo: Images.logo,
      logoSize: 56,
      logoBorderRadius: 14,
      logoBackgroundColor: Colors.CHARCOAL,
    },
  },
  {
    title: 'Sweep top → bottom',
    subtitle: "animation='sweep' direction='ttb' moduleTransition='grow'",
    props: { value: 'https://reactnative.dev', animation: 'sweep', direction: 'ttb', moduleTransition: 'grow', color: Colors.BLUE },
  },
  {
    title: 'Spiral dots with gradient',
    subtitle: 'Dot modules, rounded finders, linear gradient fill.',
    props: {
      value: 'https://github.com',
      animation: 'spiral',
      moduleShape: 'dot',
      moduleScale: 0.9,
      finderShape: 'rounded',
      gradient: { type: 'linear', colors: [Colors.PURPLE, Colors.SKY] },
    },
  },
  {
    title: 'Random rounded, radial gradient',
    subtitle: "animation='random' finderAnimation='pop' quietZone={2}",
    props: {
      value: 'random-order',
      animation: 'random',
      moduleShape: 'rounded',
      finderShape: 'rounded',
      finderAnimation: 'pop',
      quietZone: 2,
      cornerRadius: 20,
      gradient: { type: 'radial', colors: [Colors.ORANGE, Colors.PINK, Colors.PURPLE] },
    },
  },
  {
    title: 'Fade + label on top',
    subtitle: "animation='fade' with a custom styled top label.",
    props: {
      value: 'fade-preset',
      animation: 'fade',
      label: 'Scan at the counter',
      labelPosition: 'top',
      labelStyle: { fontSize: 15, fontWeight: '800', color: Colors.GREEN },
    },
  },
  {
    title: 'Scale + logo scale',
    subtitle: "animation='scale' logoAnimation='scale' on a dark background.",
    props: {
      value: 'scale-preset',
      animation: 'scale',
      color: Colors.WHITE,
      backgroundColor: Colors.BLACK_LIGHT,
      quietZone: 2,
      cornerRadius: 16,
      logo: Images.logo,
      logoAnimation: 'scale',
      logoSize: 48,
      logoBorderRadius: 24,
    },
  },
  {
    title: 'Custom order: diagonal wipe',
    subtitle: 'getModuleOrder + custom timeline + worklet moduleEasing.',
    props: {
      value: 'custom-diagonal',
      getModuleOrder: diagonalOrder,
      moduleEasing: elasticEasing,
      timeline: { moduleSpread: 0.6, moduleDuration: 0.25, moduleJitter: 0 },
      duration: 2000,
      color: Colors.PINK,
    },
  },
  {
    title: 'Custom order: checkerboard',
    subtitle: 'Two waves of modules, finder color overrides, looping.',
    props: {
      value: 'custom-checker',
      getModuleOrder: checkerOrder,
      finderColor: Colors.RED,
      finderInnerColor: Colors.BLUE,
      loop: true,
      loopDelay: 800,
      easing: Easing.inOut(Easing.quad),
    },
  },
  {
    title: 'Wide box (width / height)',
    subtitle: 'width={300} height={200} → QR fits the smaller side, styled container.',
    props: {
      value: 'wide-box',
      size: undefined,
      width: 300,
      height: 200,
      qrContainerStyle: { borderRadius: 20, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BACKGROUND_LIGHT },
      label: 'Label inside wide container',
    },
  },
];

const ShowcaseCard = ({ item }) => {

  const qrRef = useRef(null);

  const handleReplay = () => {
    qrRef.current?.reset();
    qrRef.current?.play();
  };

  return (
    <View style={styles.cardView}>
    <View style={styles.cardHeaderRow}>
      <Text style={styles.cardTitleTxt}>{item.title}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={handleReplay} hitSlop={8}
        accessibilityRole='button' accessibilityLabel='Replay animation' style={styles.replayButtonView}>
        <Icon name='rotate-ccw' size={18} color={Colors.INK} strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
    <Text style={styles.cardSubtitleTxt}>{item.subtitle}</Text>
    <View style={styles.qrView}>
      <AnimatedQRCode ref={qrRef} size={220} {...item.props} />
    </View>
    </View>
  );
};

// External progress: the app owns the shared value, the QR code only renders it
const ExternalProgressCard = () => {

  const progress = useSharedValue(0);
  const [activeStep, setActiveStep] = useState(0);

  const handleSetProgress = (target) => {
    setActiveStep(target);
    progress.value = withTiming(target, { duration: 500, easing: Easing.out(Easing.cubic) });
  };

  return (
    <View style={styles.cardView}>
    <Text style={styles.cardTitleTxt}>External progress</Text>
    <Text style={styles.cardSubtitleTxt}>Pass your own shared value as `progress` to drive the animation from gestures, scroll or steps.</Text>
    <View style={styles.qrView}>
      <AnimatedQRCode value='external-progress' size={220} progress={progress} logo={Images.logo} logoSize={48} logoBorderRadius={12} />
    </View>
    <View style={styles.segmentedView}>
      {[0, 0.25, 0.5, 0.75, 1].map((step) => {
        const isActive = step === activeStep;
        return (
          <TouchableOpacity key={step} activeOpacity={0.7} onPress={() => handleSetProgress(step)}
            accessibilityRole='button' accessibilityState={{ selected: isActive }}
            style={[styles.segmentView, isActive && styles.segmentActiveView]}>
            <Text style={[styles.segmentTxt, isActive && styles.segmentActiveTxt]}>{step * 100}%</Text>
          </TouchableOpacity>
        );
      })}
    </View>
    </View>
  );
};

// autoPlay={false}: nothing animates until play() is called through the ref
const ManualCard = () => {

  const qrRef = useRef(null);

  return (
    <View style={styles.cardView}>
    <Text style={styles.cardTitleTxt}>Manual playback</Text>
    <Text style={styles.cardSubtitleTxt}>autoPlay={'{false}'} with play / reset / complete through the ref.</Text>
    <View style={styles.qrView}>
      <AnimatedQRCode ref={qrRef} value='manual-playback' size={220} autoPlay={false} animation='spiral' moduleShape='rounded' />
    </View>
    <PlaybackControls targetRef={qrRef} />
    </View>
  );
};

const QRCodeShowcase = () => {

  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}>
      {SHOWCASE_ITEMS.map((item) => <ShowcaseCard key={item.title} item={item} />)}
      <ExternalProgressCard />
      <ManualCard />
    </ScrollView>
  );
};

export default QRCodeShowcase;
