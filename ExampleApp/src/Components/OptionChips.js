// Global Imports
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Local Imports
import Colors from '../Helper/Colors';
import { RADIUS } from '../Helper/Theme';

// Single-select row of chips, `options` is [{ label, value }] or plain values
const OptionChips = ({ title, options, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>{title}</Text>
      <View style={styles.chipsRow}>
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : String(option);
          const isSelected = optionValue === value;
          return (
            <TouchableOpacity key={optionLabel} activeOpacity={0.7} onPress={() => onChange(optionValue)}
              accessibilityRole='button' accessibilityState={{ selected: isSelected }}
              style={[styles.chipView, isSelected && styles.chipSelectedView]}>
              <Text style={[styles.chipTxt, isSelected && styles.chipSelectedTxt]}>{optionLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default OptionChips;

const styles = StyleSheet.create({
  container: { gap: 10 },
  titleTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  chipView: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    backgroundColor: Colors.SURFACE_MUTED
  },
  chipSelectedView: { backgroundColor: Colors.INK },
  chipTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY
  },
  chipSelectedTxt: {
    fontWeight: '600',
    color: Colors.WHITE
  }
});
