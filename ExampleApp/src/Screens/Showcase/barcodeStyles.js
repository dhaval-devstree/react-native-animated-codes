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
    gap: 14
  },
  cardView: {
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cardHeaderTextView: { flex: 1 },
  cardTitleTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.INK
  },
  cardSubtitleTxt: {
    marginTop: 2,
    fontFamily: MONO_FONT,
    fontSize: 12,
    color: Colors.TEXT_MUTED
  },
  kindTxt: {
    overflow: 'hidden',
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '700'
  },
  replayButtonView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SURFACE_MUTED
  },
  barcodeView: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.SURFACE_MUTED
  },
  valueTxt: {
    maxWidth: 280,
    fontFamily: MONO_FONT,
    fontSize: 12,
    color: Colors.INK
  }
});
