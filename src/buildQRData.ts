import QRCodeGenerator from 'qrcode';
import { clamp01 } from './easing';
import { pseudoRandom } from './order';
import { modulePath } from './shapes';
import type { BuildOptions, QRData } from './types';

// Top-left, top-right and bottom-left 7×7 corner squares, drawn by FinderPattern instead of the ripple
const isFinderModule = (i: number, j: number, count: number) =>
  (i < 7 && j < 7) || (i < 7 && j >= count - 7) || (i >= count - 7 && j < 7);

// Custom orders may return anything, keep starts inside the timeline window
const safeOrder = (v: number) => {
  if (Number.isNaN(v)) return 0;
  return clamp01(v);
};

export const buildQRData = (value: string, options: BuildOptions): QRData => {
  const { size, ecl, quietZone, shape, moduleScale, order, timeline } = options;
  if (typeof value !== 'string' || value.length === 0) throw new Error('AnimatedQRCode: `value` must be a non-empty string');
  if (!(size > 0)) throw new Error('AnimatedQRCode: size must be > 0');
  if (!(moduleScale > 0 && moduleScale <= 1)) throw new Error('AnimatedQRCode: `moduleScale` must be in (0, 1]');
  if (!(quietZone >= 0)) throw new Error('AnimatedQRCode: `quietZone` must be >= 0');

  const { modules } = QRCodeGenerator.create(value, { errorCorrectionLevel: ecl });
  const count = modules.size;
  const cellSize = size / (count + quietZone * 2);
  const offset = quietZone * cellSize;
  const codeSize = cellSize * count;
  const half = (cellSize * moduleScale) / 2;
  // Merged runs give a seamless final render, only possible for full-size squares
  const mergeRuns = shape === 'square' && moduleScale === 1;

  const dataModules: number[] = [];
  let finalPath = '';

  for (let i = 0; i < count; i++) {
    let runStart = -1;
    for (let j = 0; j <= count; j++) {
      const isDark = j < count && !!modules.get(i, j) && !isFinderModule(i, j, count);
      if (isDark) {
        const cx = offset + j * cellSize + cellSize / 2;
        const cy = offset + i * cellSize + cellSize / 2;
        const rank = safeOrder(order({ row: i, col: j, count, x: (cx - offset) / codeSize, y: (cy - offset) / codeSize }));
        const start = timeline.moduleStart + rank * timeline.moduleSpread + pseudoRandom(i, j) * timeline.moduleJitter;
        dataModules.push(cx, cy, start);
        if (mergeRuns) {
          if (runStart < 0) runStart = j;
        } else {
          finalPath += modulePath(cx, cy, half, shape);
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
    { row: 0, col: 0 },
    { row: 0, col: count - 7 },
    { row: count - 7, col: 0 },
  ];

  return { count, cellSize, offset, dataModules, finalPath, finders };
};
