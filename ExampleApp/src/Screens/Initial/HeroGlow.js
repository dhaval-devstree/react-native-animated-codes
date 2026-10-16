// Global Imports
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

// Local Imports
import Colors from '../../Helper/Colors';

// Soft blue and purple glows painted behind the hero content
const HeroGlow = () => {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents='none'>
      <Defs>
        <RadialGradient id='heroGlowTop' cx='15%' cy='0%' r='70%'>
          <Stop offset='0' stopColor={Colors.ACCENT} stopOpacity='0.45' />
          <Stop offset='1' stopColor={Colors.ACCENT} stopOpacity='0' />
        </RadialGradient>
        <RadialGradient id='heroGlowBottom' cx='100%' cy='85%' r='65%'>
          <Stop offset='0' stopColor={Colors.PURPLE} stopOpacity='0.4' />
          <Stop offset='1' stopColor={Colors.PURPLE} stopOpacity='0' />
        </RadialGradient>
      </Defs>
      <Rect width='100%' height='100%' fill='url(#heroGlowTop)' />
      <Rect width='100%' height='100%' fill='url(#heroGlowBottom)' />
    </Svg>
  );
};

export default HeroGlow;
