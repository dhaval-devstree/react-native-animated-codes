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
    gap: 14,
    padding: 16,
    borderRadius: 24,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  formatTxt: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.INK
  },
  formatCodeTxt: {
    overflow: 'hidden',
    borderRadius: RADIUS.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: MONO_FONT,
    fontSize: 12,
    color: Colors.ACCENT,
    backgroundColor: Colors.ACCENT_SOFT
  },
  barcodeStageView: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE_MUTED
  },
  valueTxt: {
    fontFamily: MONO_FONT,
    color: Colors.INK
  },
  errorTxt: {
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
  galleryButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.HERO
  },
  galleryTextView: { flex: 1 },
  galleryButtonTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.WHITE
  },
  gallerySubtitleTxt: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.HERO_TEXT_MUTED
  },
  galleryChevronTxt: {
    fontSize: 26,
    fontWeight: '300',
    color: Colors.HERO_TEXT_MUTED
  }
});
