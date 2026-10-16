import { Platform } from 'react-native';
import Colors from './Colors';

export const MONO_FONT = Platform.select({ ios: 'Menlo', android: 'monospace' });

export const RADIUS = { sm: 10, md: 14, lg: 20, pill: 999 };

// Soft card elevation that looks the same on both platforms
export const SHADOW = {
  shadowColor: Colors.INK,
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2
};
