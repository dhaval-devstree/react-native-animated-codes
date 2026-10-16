// Global Imports
import { useEffect, useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Local Imports
import Colors from '../Helper/Colors';
import { RADIUS, SHADOW } from '../Helper/Theme';
import Icon from './Icon';

// White accordion card grouping related controls; tap the header to expand / collapse
const Section = ({ title, children, initiallyExpanded = false }) => {

  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  // Chevron rotation runs on its own, matching the easeInEaseOut preset (300ms). Toggling a static
  // transform style flattens / un-flattens the wrapper view on Fabric, and iOS LayoutAnimation then
  // animates the freshly mounted view in from the card's top-left corner.
  const rotation = useSharedValue(initiallyExpanded ? 0 : -90);

  useEffect(() => {
    rotation.value = withTiming(isExpanded ? 0 : -90, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, [isExpanded, rotation]);

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((expanded) => !expanded);
  };

  if (!title) return <View style={[styles.cardView, styles.bodyView]}>{children}</View>;

  return (
    <View style={styles.cardView}>
      <TouchableOpacity activeOpacity={0.7} onPress={handleToggle}
        accessibilityRole='button' accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title} section`} style={styles.headerRow}>
        <Text style={styles.titleTxt}>{title}</Text>
        <Animated.View collapsable={false} style={chevronAnimatedStyle}>
          <Icon name='chevron-down' size={20} color={Colors.TEXT_MUTED} strokeWidth={2.2} />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded ? <View style={[styles.bodyView, styles.dividerView]}>{children}</View> : null}
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  cardView: {
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 16
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: Colors.INK
  },
  bodyView: {
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  dividerView: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.BORDER
  }
});
