import { StyleSheet } from 'react-native';
import Colors from '../../Helper/Colors';
import { MONO_FONT, RADIUS, SHADOW } from '../../Helper/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 10
  },
  previewView: {
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 24,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  qrStageView: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE_MUTED
  },
  previewLabelTxt: {
    maxWidth: 260,
    fontFamily: MONO_FONT,
    fontSize: 12,
    color: Colors.TEXT_SECONDARY
  },
  errorTxt: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    textAlign: 'center',
    borderRadius: RADIUS.sm,
    padding: 10,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.RED,
    backgroundColor: Colors.RED_SOFT
  },
  inputContainer: { gap: 10 },
  inputTitleTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.INK,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.SURFACE_MUTED
  },
  customLogoView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PINK
  },
  customLogoTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.WHITE
  }
});
