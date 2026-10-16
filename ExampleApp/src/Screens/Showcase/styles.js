import { StyleSheet } from 'react-native';
import Colors from '../../Helper/Colors';
import { RADIUS, SHADOW } from '../../Helper/Theme';

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
    gap: 6,
    padding: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  cardTitleTxt: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.INK
  },
  cardSubtitleTxt: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.TEXT_SECONDARY
  },
  replayButtonView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SURFACE_MUTED
  },
  qrView: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 20,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.SURFACE_MUTED
  },
  segmentedView: {
    flexDirection: 'row',
    marginTop: 6,
    padding: 4,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.SURFACE_MUTED
  },
  segmentView: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm
  },
  segmentActiveView: {
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  segmentTxt: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY
  },
  segmentActiveTxt: {
    fontWeight: '700',
    color: Colors.INK
  }
});
