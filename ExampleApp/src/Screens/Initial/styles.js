import { StyleSheet } from 'react-native';
import Colors from '../../Helper/Colors';
import { MONO_FONT, RADIUS, SHADOW } from '../../Helper/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE
  },
  contentContainer: {
    padding: 16,
    gap: 12
  },
  heroView: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: Colors.HERO
  },
  badgeView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 10
  },
  badgeDotView: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399'
  },
  badgeTxt: {
    fontFamily: MONO_FONT,
    fontSize: 12,
    color: Colors.WHITE
  },
  titleTxt: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.WHITE
  },
  subtitleTxt: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.HERO_TEXT_MUTED
  },
  heroTabsView: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 20,
    padding: 4,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  heroTabView: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm
  },
  heroTabActiveView: { backgroundColor: Colors.WHITE },
  heroTabTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.HERO_TEXT_MUTED
  },
  heroTabActiveTxt: {
    fontWeight: '700',
    color: Colors.INK
  },
  // Fixed height so the hero doesn't jump when switching between QR and barcode
  heroStageView: {
    height: 270,
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroReplayView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  heroLabelTxt: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.HERO_TEXT_MUTED
  },
  barcodeCardView: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: Colors.WHITE
  },
  barcodeCardHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  barcodeKindTxt: {
    overflow: 'hidden',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.pill,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.ACCENT,
    backgroundColor: Colors.ACCENT_SOFT
  },
  barcodeMetaTxt: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: Colors.TEXT_MUTED
  },
  barcodeScanTxt: { marginTop: 14 },
  sectionTitleTxt: {
    marginTop: 12,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.TEXT_MUTED
  },
  tilesView: { gap: 10 },
  tileView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  tileIconView: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileIconTxt: {
    fontSize: 22,
    fontWeight: '700'
  },
  tileTextView: { flex: 1 },
  tileTitleTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.INK
  },
  tileDescriptionTxt: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.TEXT_SECONDARY
  },
  tileChevronView: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SURFACE_MUTED
  }
});
