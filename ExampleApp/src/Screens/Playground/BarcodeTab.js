// Global Imports
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBarcode, BARCODE_FORMATS } from 'react-native-animated-codes';

// Local Imports
import styles from './barcodeStyles';
import Colors from '../../Helper/Colors';
import { navigateToPage } from '../../../AppNavigator';

// Components Imports
import OptionChips from '../../Components/OptionChips';
import PlaybackControls from '../../Components/PlaybackControls';
import Section from '../../Components/Section';

const KIND_OPTIONS = [
  { label: 'Linear', value: 'linear' },
  { label: '2D', value: 'matrix' },
  { label: 'MaxiCode', value: 'maxicode' },
];

const ANIMATIONS = ['sweep', 'ripple', 'spiral', 'random', 'fade', 'scale', 'none'];
const DIRECTIONS = ['leftToRight', 'rightToLeft', 'topToBottom', 'bottomToTop'];
const DOT_TRANSITIONS = ['grow', 'pop'];
const DOT_SHAPES = ['square', 'rounded', 'circle'];
const BAR_RADII = [0, 1, 2];
const DURATIONS = [600, 1200, 2400];

const COLOR_OPTIONS = [
  { label: 'Black', value: Colors.BLACK },
  { label: 'Blue', value: Colors.BLUE },
  { label: 'Purple', value: Colors.PURPLE },
  { label: 'Green', value: Colors.GREEN },
];

const GRADIENT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const GRADIENTS = {
  linear: { type: 'linear', colors: [Colors.PURPLE, Colors.SKY], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  radial: { type: 'radial', colors: [Colors.ORANGE, Colors.PINK, Colors.PURPLE] },
};

const BOOLEAN_OPTIONS = [
  { label: 'Off', value: false },
  { label: 'On', value: true },
];

const BarcodePlayground = () => {

  const insets = useSafeAreaInsets();
  const barcodeRef = useRef(null);

  const [kind, setKind] = useState('linear');
  const [format, setFormat] = useState('code128');
  const [value, setValue] = useState('Hello 123');
  const [animation, setAnimation] = useState('sweep');
  const [direction, setDirection] = useState('leftToRight');
  const [dotTransition, setDotTransition] = useState('grow');
  const [dotShape, setDotShape] = useState('square');
  const [barRadius, setBarRadius] = useState(0);
  const [color, setColor] = useState(Colors.BLACK);
  const [gradientType, setGradientType] = useState('none');
  const [duration, setDuration] = useState(1200);
  const [showValue, setShowValue] = useState(true);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState(null);

  const formatInfo = BARCODE_FORMATS.find((item) => item.format === format);
  const formatOptions = useMemo(() => (
    BARCODE_FORMATS.filter((item) => item.kind === kind).map((item) => ({ label: item.name, value: item.format }))
  ), [kind]);

  /*
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  // Each format has its own valid input, start from its sample value
  const handleSelectFormat = (nextFormat) => {
    const info = BARCODE_FORMATS.find((item) => item.format === nextFormat);
    setFormat(nextFormat);
    setValue(info.sample);
    setError(null);
    setDotTransition(info.kind === 'linear' ? 'grow' : 'pop');
    setShowValue(info.kind === 'linear');
  };

  const handleSelectKind = (nextKind) => {
    setKind(nextKind);
    handleSelectFormat(BARCODE_FORMATS.find((item) => item.kind === nextKind).format);
  };

  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##...
  */

  const renderPreview = () => {
    return (
      <View style={styles.previewView}>
        <View style={styles.previewHeaderRow}>
          <Text style={styles.formatTxt} numberOfLines={1}>{formatInfo?.name}</Text>
          <Text style={styles.formatCodeTxt}>{format}</Text>
        </View>
        <View style={styles.barcodeStageView}>
          <AnimatedBarcode
            ref={barcodeRef}
            value={value}
            format={format}
            encoderOptions={formatInfo?.encoderOptions}
            width={kind === 'linear' ? 280 : 220}
            height={kind === 'linear' ? 120 : 220}
            borderRadius={12}
            color={color}
            gradient={gradientType === 'none' ? undefined : GRADIENTS[gradientType]}
            dotShape={dotShape}
            barRadius={barRadius}
            animation={animation}
            direction={direction}
            dotTransition={dotTransition}
            showValue={showValue}
            labelStyle={styles.valueTxt}
            duration={duration}
            delay={250}
            loop={loop}
            onAnimationStart={() => setError(null)}
            onError={(e) => setError(e.message)} />
        </View>
        {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
        <PlaybackControls targetRef={barcodeRef} />
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <>
        <Section title='Format'>
          <OptionChips title='Kind' options={KIND_OPTIONS} value={kind} onChange={handleSelectKind} />
          <OptionChips title={`Format (${formatOptions.length})`} options={formatOptions} value={format} onChange={handleSelectFormat} />
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitleTxt}>Value</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Data to encode'
              placeholderTextColor={Colors.TEXT_MUTED}
              style={styles.input} />
          </View>
          <OptionChips title='Show value' options={BOOLEAN_OPTIONS} value={showValue} onChange={setShowValue} />
        </Section>
        <Section title='Animation'>
          <OptionChips title='Preset' options={ANIMATIONS} value={animation} onChange={setAnimation} />
          {animation === 'sweep' &&
            <OptionChips title='Sweep direction' options={DIRECTIONS} value={direction} onChange={setDirection} />
          }
          <OptionChips title='Transition' options={DOT_TRANSITIONS} value={dotTransition} onChange={setDotTransition} />
          <OptionChips title='Duration (ms)' options={DURATIONS} value={duration} onChange={setDuration} />
          <OptionChips title='Loop' options={BOOLEAN_OPTIONS} value={loop} onChange={setLoop} />
        </Section>
        <Section title='Style'>
          <OptionChips title='Color' options={COLOR_OPTIONS} value={color} onChange={setColor} />
          <OptionChips title='Gradient' options={GRADIENT_OPTIONS} value={gradientType} onChange={setGradientType} />
          {kind === 'linear'
            ? <OptionChips title='Bar radius' options={BAR_RADII} value={barRadius} onChange={setBarRadius} />
            : <OptionChips title='Dot shape' options={DOT_SHAPES} value={dotShape} onChange={setDotShape} />
          }
        </Section>
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
      keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
      {renderPreview()}
      <TouchableOpacity activeOpacity={0.75} onPress={() => navigateToPage('Showcase', { tab: 'barcode' })}
        accessibilityRole='button' style={styles.galleryButtonView}>
        <View style={styles.galleryTextView}>
          <Text style={styles.galleryButtonTxt}>Browse the gallery</Text>
          <Text style={styles.gallerySubtitleTxt}>All {BARCODE_FORMATS.length} formats, rendered from samples</Text>
        </View>
        <Text style={styles.galleryChevronTxt}>›</Text>
      </TouchableOpacity>
      {renderOptions()}
    </ScrollView>
  );
};

export default BarcodePlayground;
