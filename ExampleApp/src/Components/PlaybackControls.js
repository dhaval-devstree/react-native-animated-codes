// Global Imports
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Local Imports
import Colors from '../Helper/Colors';
import Icon from './Icon';
import { RADIUS } from '../Helper/Theme';

// Restart button for any ref exposing the imperative API
const PlaybackControls = ({ targetRef }) => {

  // Clear back to the empty code, then replay from scratch
  const handleRestart = () => {
    targetRef.current?.reset();
    targetRef.current?.play();
  };

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={handleRestart}
      accessibilityRole='button' accessibilityLabel='Restart animation' style={styles.buttonView}>
      <Icon name='rotate-ccw' size={17} color={Colors.WHITE} strokeWidth={2.4} />
      <Text style={styles.buttonTxt}>Restart animation</Text>
    </TouchableOpacity>
  );
};

export default PlaybackControls;

const styles = StyleSheet.create({
  buttonView: {
    alignSelf: 'stretch',
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: Colors.INK
  },
  buttonTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.WHITE
  }
});
