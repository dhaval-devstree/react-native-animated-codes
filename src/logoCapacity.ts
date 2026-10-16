import type { ErrorCorrectionLevel } from './types';

const RECOVERY: Record<ErrorCorrectionLevel, number> = { L: 0.07, M: 0.15, Q: 0.25, H: 0.3 };

// Only half the recovery budget is spent on the logo, the rest absorbs print/scan damage
export const isLogoTooLarge = (logoBackgroundSize: number, qrSize: number, ecl: ErrorCorrectionLevel) =>
  (logoBackgroundSize * logoBackgroundSize) / (qrSize * qrSize) > RECOVERY[ecl] / 2;
