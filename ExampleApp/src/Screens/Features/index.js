// Global Imports
import React from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BARCODE_FORMATS } from 'react-native-animated-codes';

// Local Imports
import styles from './styles';
import Colors from '../../Helper/Colors';

// Components Imports
import Header from '../../Components/Header';

const FEATURES = [
  {
    glyph: '✦',
    title: 'Animation presets',
    description: 'Seven built-in ways to draw the code. Ripple spreads out from the center, sweep wipes across in any of four directions, spiral winds in from the edges, random scatters dots, fade and scale animate the whole code at once, and none renders it instantly.',
    props: ['animation', 'direction', 'dotTransition', 'finderAnimation'],
    tint: Colors.ACCENT,
    tintSoft: Colors.ACCENT_SOFT,
  },
  {
    glyph: '∿',
    title: 'Custom animations',
    description: 'Go beyond the presets. Return your own order for every dot, pass a worklet easing per dot, fine-tune when dots, finders, logo and label start and how long they take, or drive the whole animation from your own shared value for gestures, scroll or step flows.',
    props: ['getDotOrder', 'dotEasing', 'timeline', 'easing', 'progress'],
    tint: Colors.PURPLE,
    tintSoft: Colors.PURPLE_SOFT,
  },
  {
    glyph: '▦',
    title: 'Dot and finder shapes',
    description: 'Render dots as squares, rounded squares or circles, and shrink them with a scale factor for a lighter look. Finder patterns (the three corner squares) can be square or rounded and get their own animation: traced, popped or static.',
    props: ['dotShape', 'dotScale', 'finderShape'],
    tint: Colors.GREEN,
    tintSoft: Colors.GREEN_SOFT,
  },
  {
    glyph: '◐',
    title: 'Colors and gradients',
    description: 'Use a solid foreground and background color, or fill the code with a linear or radial gradient. Finder outer and inner colors can be overridden separately so the corners match your brand.',
    props: ['color', 'backgroundColor', 'gradient', 'finderColor', 'finderInnerColor'],
    tint: Colors.PINK,
    tintSoft: Colors.RED_SOFT,
  },
  {
    glyph: '⤢',
    title: 'Size and layout',
    description: 'Set a single size or a width and height box; the code fits the smaller side and stays centered. Add a quiet zone, round the container corners and style the outer and code containers freely.',
    props: ['size', 'width', 'height', 'quietZone', 'borderRadius', 'containerStyle'],
    tint: Colors.ORANGE,
    tintSoft: Colors.ORANGE_SOFT,
  },
  {
    glyph: '◉',
    title: 'Logo in the center',
    description: 'Place an image or any custom element in the middle of the code. Control its size, margin, corner radius and backdrop, and animate it with a liquid fill, fade or scale. In development you get a warning when the logo covers too much for the chosen error correction level.',
    props: ['logo', 'renderLogo', 'logoSize', 'logoAnimation', 'errorCorrection'],
    tint: Colors.ACCENT,
    tintSoft: Colors.ACCENT_SOFT,
  },
  {
    glyph: 'T',
    title: 'Label',
    description: 'Show a caption above or below the code, as plain text or any React element. Style the text and its container, adjust the gap, and let it fade in as part of the animation or stay static.',
    props: ['label', 'labelPosition', 'labelStyle', 'labelGap', 'animateLabel'],
    tint: Colors.PURPLE,
    tintSoft: Colors.PURPLE_SOFT,
  },
  {
    glyph: '▶',
    title: 'Playback control',
    description: 'Start, clear or finish the animation from a ref with play, reset and complete. Turn off autoplay to trigger it yourself, loop it with a pause between runs, add a start delay, and respect the system reduce motion setting automatically.',
    props: ['ref.play()', 'ref.reset()', 'ref.complete()', 'autoPlay', 'loop', 'delay', 'respectReduceMotion'],
    tint: Colors.GREEN,
    tintSoft: Colors.GREEN_SOFT,
  },
  {
    glyph: '⚑',
    title: 'Events and errors',
    description: 'Know when an animation starts and finishes to chain UI after it. Invalid or too-long values never crash the app; they are reported through onError so you can show a message instead.',
    props: ['onAnimationStart', 'onAnimationComplete', 'onError'],
    tint: Colors.RED,
    tintSoft: Colors.RED_SOFT,
  },
  {
    glyph: '║',
    title: 'AnimatedBarcode',
    description: `The same animation engine for ${BARCODE_FORMATS.length} barcode formats powered by bwip-js: linear codes like EAN, UPC and Code 128, 2D codes like Data Matrix, PDF417 and Aztec, MaxiCode with its bullseye, and postal codes. Bars can grow or pop in, with optional rounded bars and a human-readable value underneath.`,
    props: ['format', 'encoderOptions', 'barRadius', 'showValue', 'bullseyeColor'],
    tint: Colors.ORANGE,
    tintSoft: Colors.ORANGE_SOFT,
  },
];

const Features = () => {

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar backgroundColor={Colors.PAGE} barStyle='dark-content' />
      <Header title='Features' />
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.cardView}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconView, { backgroundColor: feature.tintSoft }]}>
                <Text style={[styles.iconTxt, { color: feature.tint }]}>{feature.glyph}</Text>
              </View>
              <Text style={styles.titleTxt}>{feature.title}</Text>
            </View>
            <Text style={styles.descriptionTxt}>{feature.description}</Text>
            <View style={styles.propsView}>
              {feature.props.map((prop) => (
                <Text key={prop} style={styles.propTxt}>{prop}</Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Features;
