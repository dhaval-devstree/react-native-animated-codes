// Global Imports
import React, { useRef, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedQRCode from 'react-native-animated-codes';

// Local Imports
import styles from './styles';
import Colors from '../../Helper/Colors';
import { Images } from '../../Assets/Images';
import { navigateToPage } from '../../../AppNavigator';

// Components Imports
import HeroBarcode from './HeroBarcode';
import HeroGlow from './HeroGlow';
import Icon from '../../Components/Icon';

const DESTINATIONS = [
  {
    route: 'Playground',
    glyph: '⚙︎',
    title: 'Playground',
    description: 'Tweak every prop live on a QR code or any barcode format.',
    tint: Colors.ACCENT,
    tintSoft: Colors.ACCENT_SOFT,
  },
  {
    route: 'Showcase',
    glyph: '✦',
    title: 'Showcase',
    description: 'Curated QR presets and a gallery of every barcode format.',
    tint: Colors.PURPLE,
    tintSoft: Colors.PURPLE_SOFT,
  },
  {
    route: 'Features',
    glyph: 'ⓘ',
    title: 'Features',
    description: 'Everything AnimatedQRCode and AnimatedBarcode can do.',
    tint: Colors.GREEN,
    tintSoft: Colors.GREEN_SOFT,
  },
];

const HERO_TABS = [
  { key: 'qrcode', label: 'QR Code' },
  { key: 'barcode', label: 'Barcode' },
];

const Initial = () => {

  const insets = useSafeAreaInsets();
  const heroCodeRef = useRef(null);
  const [heroTab, setHeroTab] = useState('qrcode');
  const { width: windowWidth } = useWindowDimensions();
  // Screen padding (16) + hero padding (20) + card padding (20), on both sides
  const barcodeWidth = Math.min(windowWidth - 112, 320);

  const handleReplay = () => {
    heroCodeRef.current?.reset();
    heroCodeRef.current?.play();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar backgroundColor={Colors.PAGE} barStyle='dark-content' />
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroView}>
          <HeroGlow />
          {/* <Text style={styles.titleTxt}>Animated QR codes & Barcodes for React Native</Text> */}
          <View style={styles.badgeView}>
            <Text style={styles.badgeTxt}>react-native-animated-codes</Text>
          </View>
          <View style={styles.heroTabsView}>
            {HERO_TABS.map((tab) => {
              const isActive = tab.key === heroTab;
              return (
                <TouchableOpacity key={tab.key} activeOpacity={0.7} onPress={() => setHeroTab(tab.key)}
                  accessibilityRole='tab' accessibilityState={{ selected: isActive }}
                  style={[styles.heroTabView, isActive && styles.heroTabActiveView]}>
                  <Text style={[styles.heroTabTxt, isActive && styles.heroTabActiveTxt]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.heroStageView}>
            {heroTab === 'qrcode' ? (
              <AnimatedQRCode
                ref={heroCodeRef}
                value='https://www.npmjs.com/package/react-native-animated-codes'
                size={220}
                quietZone={2}
                borderRadius={24}
                logo={Images.logo}
                logoSize={48}
                logoBorderRadius={24}
                logoPadding={3}
                label='Scan me'
                labelStyle={styles.heroLabelTxt} />
            ) : (
              <HeroBarcode ref={heroCodeRef} width={barcodeWidth} />
            )}
            <TouchableOpacity activeOpacity={0.7} onPress={handleReplay} hitSlop={8}
              accessibilityRole='button' accessibilityLabel='Replay animation' style={styles.heroReplayView}>
              <Icon name='rotate-ccw' size={16} color={Colors.WHITE} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitleTxt}>Explore</Text>
        <View style={styles.tilesView}>
          {DESTINATIONS.map((item) => (
            <TouchableOpacity key={item.route} activeOpacity={0.75} onPress={() => navigateToPage(item.route, item.route === 'Features' ? undefined : { tab: heroTab })}
              accessibilityRole='button' style={styles.tileView}>
              <View style={[styles.tileIconView, { backgroundColor: item.tintSoft }]}>
                <Text style={[styles.tileIconTxt, { color: item.tint }]}>{item.glyph}</Text>
              </View>
              <View style={styles.tileTextView}>
                <Text style={styles.tileTitleTxt}>{item.title}</Text>
                <Text style={styles.tileDescriptionTxt}>{item.description}</Text>
              </View>
              <View style={styles.tileChevronView}>
                <Icon name='chevron-right' size={18} color={Colors.INK} strokeWidth={2.4} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Initial;
