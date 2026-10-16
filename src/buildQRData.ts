import QRCodeGenerator from 'qrcode';
import { clamp01 } from './easing';
import { pseudoRandom } from './order';
import { dotPath } from './shapes';
import type { BuildOptions, ErrorCorrectionLevel, QRData } from './types';

// qrcode expects the single-letter level names
const LEVEL_LETTER: Record<ErrorCorrectionLevel, 'L' | 'M' | 'Q' | 'H'> = { low: 'L', medium: 'M', quartile: 'Q', high: 'H' };

// Top-left, top-right and bottom-left 7×7 corner squares, drawn by FinderPattern instead of the ripple
const isFinderCell = (i: number, j: number, count: number) =>
  (i < 7 && j < 7) || (i < 7 && j >= count - 7) || (i >= count - 7 && j < 7);

// Custom orders may return anything, keep starts inside the timeline window
const safeOrder = (v: number) => {
  if (Number.isNaN(v)) return 0;
  return clamp01(v);
};

export const buildQRData = (value: string, options: BuildOptions): QRData => {
  const { size, errorCorrection, quietZone, shape, dotScale, order, timeline } = options;
  if (typeof value !== 'string' || value.length === 0) throw new Error('AnimatedQRCode: `value` must be a non-empty string');
  if (!(size > 0)) throw new Error('AnimatedQRCode: size must be > 0');
  if (!(dotScale > 0 && dotScale <= 1)) throw new Error('AnimatedQRCode: `dotScale` must be in (0, 1]');
  if (!(quietZone >= 0)) throw new Error('AnimatedQRCode: `quietZone` must be >= 0');

  const { modules } = QRCodeGenerator.create(value, { errorCorrectionLevel: LEVEL_LETTER[errorCorrection] });
  const count = modules.size;
  const cellSize = size / (count + quietZone * 2);
  const offset = quietZone * cellSize;
  const codeSize = cellSize * count;
  const half = (cellSize * dotScale) / 2;
  // Merged runs give a seamless final render, only possible for full-size squares
  const mergeRuns = shape === 'square' && dotScale === 1;

  const dots: number[] = [];
  let finalPath = '';

  for (let i = 0; i < count; i++) {
    let runStart = -1;
    for (let j = 0; j <= count; j++) {
      const isDark = j < count && !!modules.get(i, j) && !isFinderCell(i, j, count);
      if (isDark) {
        const cx = offset + j * cellSize + cellSize / 2;
        const cy = offset + i * cellSize + cellSize / 2;
        const rank = safeOrder(order({ row: i, column: j, count, x: (cx - offset) / codeSize, y: (cy - offset) / codeSize }));
        const start = timeline.dotStart + rank * timeline.dotSpread + pseudoRandom(i, j) * timeline.dotJitter;
        dots.push(cx, cy, start);
        if (mergeRuns) {
          if (runStart < 0) runStart = j;
        } else {
          finalPath += dotPath(cx, cy, half, shape);
        }
      } else if (mergeRuns && runStart >= 0) {
        const x0 = offset + runStart * cellSize;
        const y0 = offset + i * cellSize;
        finalPath += `M${x0} ${y0}H${offset + j * cellSize}V${y0 + cellSize}H${x0}Z`;
        runStart = -1;
      }
    }
  }

  const finders = [
    { row: 0, column: 0 },
    { row: 0, column: count - 7 },
    { row: count - 7, column: 0 },
  ];

  return { count, cellSize, offset, dots, finalPath, finders };
};
