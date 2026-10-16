// Global Imports
import React, { useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedQRCode from 'react-native-animated-codes';

// Local Imports
import styles from './styles';
import Colors from '../../Helper/Colors';
import { Images } from '../../Assets/Images';

// Components Imports
import OptionChips from '../../Components/OptionChips';
import PlaybackControls from '../../Components/PlaybackControls';
import Section from '../../Components/Section';

const ANIMATIONS = ['ripple', 'sweep', 'spiral', 'random', 'fade', 'scale', 'none'];
const DIRECTIONS = ['ltr', 'rtl', 'ttb', 'btt'];
const MODULE_TRANSITIONS = ['pop', 'grow'];
const FINDER_ANIMATIONS = ['trace', 'pop', 'none'];
const LOGO_ANIMATIONS = ['fill', 'fade', 'scale', 'none'];
const MODULE_SHAPES = ['square', 'rounded', 'dot'];
const FINDER_SHAPES = ['square', 'rounded'];
const ECL_LEVELS = ['L', 'M', 'Q', 'H'];
const SIZES = [160, 220, 280];
const MODULE_SCALES = [1, 0.85, 0.7];
const DURATIONS = [600, 1200, 2400];
const QUIET_ZONES = [0, 1, 2, 4];

const COLOR_OPTIONS = [
  { label: 'Black', value: Colors.BLACK },
  { label: 'Blue', value: Colors.BLUE },
  { label: 'Purple', value: Colors.PURPLE },
  { label: 'Green', value: Colors.GREEN },
  { label: 'Red', value: Colors.RED },
];

const BACKGROUND_OPTIONS = [
  { label: 'White', value: Colors.WHITE },
  { label: 'Card', value: Colors.CARD_BACKGROUND },
  { label: 'Black', value: Colors.BLACK_LIGHT },
];

const GRADIENT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const GRADIENTS = {
  linear: { type: 'linear', colors: [Colors.PURPLE, Colors.SKY], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  radial: { type: 'radial', colors: [Colors.ORANGE, Colors.PINK, Colors.PURPLE] },
};

const LOGO_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Image', value: 'image' },
  { label: 'Custom', value: 'custom' },
];

const LABEL_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

const BOOLEAN_OPTIONS = [
  { label: 'Off', value: false },
  { label: 'On', value: true },
];

const QRCodePlayground = () => {

  const insets = useSafeAreaInsets();
  const qrRef = useRef(null);

  const [value, setValue] = useState('https://github.com');
  const [size, setSize] = useState(220);
  const [ecl, setEcl] = useState('M');
  const [quietZone, setQuietZone] = useState(0);
  const [color, setColor] = useState(Colors.BLACK);
  const [backgroundColor, setBackgroundColor] = useState(Colors.WHITE);
  const [gradientType, setGradientType] = useState('none');
  const [moduleShape, setModuleShape] = useState('square');
  const [moduleScale, setModuleScale] = useState(1);
  const [finderShape, setFinderShape] = useState('square');
  const [animation, setAnimation] = useState('ripple');
  const [direction, setDirection] = useState('ltr');
  const [moduleTransition, setModuleTransition] = useState('pop');
  const [finderAnimation, setFinderAnimation] = useState('trace');
  const [logoType, setLogoType] = useState('image');
  const [logoAnimation, setLogoAnimation] = useState('fill');
  const [labelPosition, setLabelPosition] = useState('bottom');
  const [duration, setDuration] = useState(1200);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState(null);

  /*
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  const handleAnimationStart = () => {
    setError(null);
  };

  const handleError = (qrError) => {
    setError(qrError.message);
  };

  const handleRenderCustomLogo = (logoSize) => {
    return (
      <View style={[styles.customLogoView, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
        <Text style={styles.customLogoTxt}>QR</Text>
      </View>
    );
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
        <View style={styles.qrStageView}>
          <AnimatedQRCode
            ref={qrRef}
            value={value}
            size={size}
            ecl={ecl}
            quietZone={quietZone}
            cornerRadius={quietZone > 0 ? 16 : 0}
            color={color}
            backgroundColor={backgroundColor}
            gradient={gradientType === 'none' ? undefined : GRADIENTS[gradientType]}
            moduleShape={moduleShape}
            moduleScale={moduleScale}
            finderShape={finderShape}
            animation={animation}
            direction={direction}
            moduleTransition={moduleTransition}
            finderAnimation={finderAnimation}
            logo={logoType === 'image' ? Images.logo : undefined}
            renderLogo={logoType === 'custom' ? handleRenderCustomLogo : undefined}
            logoSize={size * 0.22}
            logoMargin={3}
            logoBorderRadius={size * 0.11}
            logoAnimation={logoAnimation}
            label={labelPosition === 'none' ? undefined : value}
            labelPosition={labelPosition === 'none' ? 'bottom' : labelPosition}
            labelStyle={styles.previewLabelTxt}
            duration={duration}
            delay={250}
            loop={loop}
            onAnimationStart={handleAnimationStart}
            onError={handleError} />
        </View>
        {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
        <PlaybackControls targetRef={qrRef} />
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <>
        <Section title='Content'>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitleTxt}>Value</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Text or URL to encode'
              placeholderTextColor={Colors.TEXT_MUTED}
              style={styles.input} />
          </View>
          <OptionChips title='Error correction' options={ECL_LEVELS} value={ecl} onChange={setEcl} />
          <OptionChips title='Label' options={LABEL_OPTIONS} value={labelPosition} onChange={setLabelPosition} />
        </Section>
        <Section title='Animation'>
          <OptionChips title='Preset' options={ANIMATIONS} value={animation} onChange={setAnimation} />
          {animation === 'sweep' &&
            <OptionChips title='Sweep direction' options={DIRECTIONS} value={direction} onChange={setDirection} />
          }
          <OptionChips title='Module transition' options={MODULE_TRANSITIONS} value={moduleTransition} onChange={setModuleTransition} />
          <OptionChips title='Finder animation' options={FINDER_ANIMATIONS} value={finderAnimation} onChange={setFinderAnimation} />
          <OptionChips title='Duration (ms)' options={DURATIONS} value={duration} onChange={setDuration} />
          <OptionChips title='Loop' options={BOOLEAN_OPTIONS} value={loop} onChange={setLoop} />
        </Section>
        <Section title='Layout'>
          <OptionChips title='Size' options={SIZES} value={size} onChange={setSize} />
          <OptionChips title='Quiet zone (modules)' options={QUIET_ZONES} value={quietZone} onChange={setQuietZone} />
          <OptionChips title='Module shape' options={MODULE_SHAPES} value={moduleShape} onChange={setModuleShape} />
          <OptionChips title='Module scale' options={MODULE_SCALES} value={moduleScale} onChange={setModuleScale} />
          <OptionChips title='Finder shape' options={FINDER_SHAPES} value={finderShape} onChange={setFinderShape} />
        </Section>
        <Section title='Color'>
          <OptionChips title='Foreground' options={COLOR_OPTIONS} value={color} onChange={setColor} />
          <OptionChips title='Background' options={BACKGROUND_OPTIONS} value={backgroundColor} onChange={setBackgroundColor} />
          <OptionChips title='Gradient' options={GRADIENT_OPTIONS} value={gradientType} onChange={setGradientType} />
        </Section>
        <Section title='Logo'>
          <OptionChips title='Type' options={LOGO_OPTIONS} value={logoType} onChange={setLogoType} />
          {logoType !== 'none' &&
            <OptionChips title='Logo animation' options={LOGO_ANIMATIONS} value={logoAnimation} onChange={setLogoAnimation} />
          }
        </Section>
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
      keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
      {renderPreview()}
      {renderOptions()}
    </ScrollView>
  );
};

export default QRCodePlayground;
