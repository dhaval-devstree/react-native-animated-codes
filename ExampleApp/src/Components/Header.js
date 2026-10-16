// Global Imports
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Local Imports
import Colors from '../Helper/Colors';
import Icon from './Icon';
import { SHADOW } from '../Helper/Theme';
import { goBack } from '../../AppNavigator';

const Header = ({ title, subtitle }) => {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity activeOpacity={0.7} onPress={goBack} style={styles.backButtonView}
        hitSlop={8} accessibilityRole='button' accessibilityLabel='Go back'>
        <Icon name='chevron-left' size={22} color={Colors.INK} strokeWidth={2.4} />
      </TouchableOpacity>
      <View style={styles.titleView}>
        <Text style={styles.headerTitleTxt} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitleTxt} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12
  },
  backButtonView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  titleView: { flex: 1 },
  headerTitleTxt: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.INK
  },
  headerSubtitleTxt: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.TEXT_MUTED
  }
});
