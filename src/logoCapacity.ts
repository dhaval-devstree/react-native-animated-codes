import type { ErrorCorrectionLevel } from './types';

const RECOVERY: Record<ErrorCorrectionLevel, number> = { low: 0.07, medium: 0.15, quartile: 0.25, high: 0.3 };

// Only half the recovery budget is spent on the logo, the rest absorbs print/scan damage
export const isLogoTooLarge = (logoBackgroundSize: number, qrSize: number, errorCorrection: ErrorCorrectionLevel) =>
  (logoBackgroundSize * logoBackgroundSize) / (qrSize * qrSize) > RECOVERY[errorCorrection] / 2;
