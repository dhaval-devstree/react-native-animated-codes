import { StyleSheet } from 'react-native';
import Colors from '../../Helper/Colors';
import { MONO_FONT, RADIUS, SHADOW } from '../../Helper/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE
  },
  contentContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4
  },
  cardView: {
    gap: 10,
    padding: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: Colors.SURFACE,
    ...SHADOW
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconView: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconTxt: {
    fontSize: 17,
    fontWeight: '700'
  },
  titleTxt: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.INK
  },
  descriptionTxt: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.TEXT_SECONDARY
  },
  propsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2
  },
  propTxt: {
    overflow: 'hidden',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: Colors.INK,
    backgroundColor: Colors.SURFACE_MUTED
  }
});
