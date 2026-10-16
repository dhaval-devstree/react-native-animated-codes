// Global Imports
import React, { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { AnimatedBarcode } from 'react-native-animated-codes';

// Local Imports
import styles from './styles';
import Colors from '../../Helper/Colors';

// Barcode for the home hero. Uses the same ripple + pop animation as the hero QR code
// so both tabs feel consistent. Plays once on mount.
const HeroBarcode = forwardRef(({ width }, ref) => {
  return (
    <>
      <View style={styles.barcodeCardView}>
        <View style={styles.barcodeCardHeaderRow}>
          <Text style={styles.barcodeKindTxt}>CODE 128</Text>
          <Text style={styles.barcodeMetaTxt}>ripple · pop</Text>
        </View>
        <AnimatedBarcode
          ref={ref}
          value='RN-ANIMATED-QR'
          format='code128'
          width={width}
          height={96}
          quietZone={0}
          barRadius={1}
          color={Colors.INK}
          displayValue={false}
          animation='ripple'
          moduleTransition='pop' />
      </View>
      <Text style={[styles.heroLabelTxt, styles.barcodeScanTxt]}>Scan me</Text>
    </>
  );
});

export default HeroBarcode;
