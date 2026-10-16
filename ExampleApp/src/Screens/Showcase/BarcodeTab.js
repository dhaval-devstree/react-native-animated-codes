// Global Imports
import React, { memo, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBarcode, BARCODE_FORMATS } from 'react-native-animated-codes';

// Local Imports
import styles from './barcodeStyles';
import Colors from '../../Helper/Colors';

// Components Imports
import Icon from '../../Components/Icon';

const KINDS = {
  linear: { label: 'Linear', color: Colors.ACCENT, background: Colors.ACCENT_SOFT },
  matrix: { label: '2D', color: Colors.PURPLE, background: Colors.PURPLE_SOFT },
  maxicode: { label: 'MaxiCode', color: Colors.ORANGE, background: Colors.ORANGE_SOFT },
};

const GalleryCard = memo(({ item }) => {

  const barcodeRef = useRef(null);
  const isLinear = item.kind === 'linear';
  const kindInfo = KINDS[item.kind];

  const handleReplay = () => {
    barcodeRef.current?.reset();
    barcodeRef.current?.play();
  };

  return (
    <View style={styles.cardView}>
    <View style={styles.cardHeaderRow}>
      <View style={styles.cardHeaderTextView}>
        <Text style={styles.cardTitleTxt}>{item.name}</Text>
        <Text style={styles.cardSubtitleTxt}>{item.format}</Text>
      </View>
      <Text style={[styles.kindTxt, { color: kindInfo.color, backgroundColor: kindInfo.background }]}>{kindInfo.label}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={handleReplay} hitSlop={8}
        accessibilityRole='button' accessibilityLabel='Replay animation' style={styles.replayButtonView}>
        <Icon name='rotate-ccw' size={18} color={Colors.INK} strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity activeOpacity={0.9} onPress={handleReplay} style={styles.barcodeView}>
      <AnimatedBarcode
        ref={barcodeRef}
        value={item.sample}
        format={item.format}
        options={item.options}
        width={isLinear ? 280 : 180}
        height={isLinear ? 100 : 180}
        labelStyle={styles.valueTxt}
        onError={(e) => console.warn(e.message)} />
    </TouchableOpacity>
    </View>
  );
});

const BarcodeShowcase = () => {

  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={BARCODE_FORMATS}
      keyExtractor={(item) => item.format}
      renderItem={({ item }) => <GalleryCard item={item} />}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]} />
  );
};

export default BarcodeShowcase;
