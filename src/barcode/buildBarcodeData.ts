import { clamp01 } from '../easing';
import { pseudoRandom } from '../order';
import { dotPath } from '../shapes';
import { barPath, hexPath } from './barcodeShapes';
import { encodeBarcode } from './encode';
import type { BarcodeBuildOptions, BarcodeData } from '../types';

// MaxiCode geometry from bwip-js, in its own units: 30 columns, 33 rows, odd rows shifted half a hexagon
const MAXI_COL = (1.04 * 100) / 30;
const MAXI_ROW = 3;
const MAXI_HEX_W = MAXI_COL - 0.5;
const MAXI_HEX_H = 3.5;
const MAXI_WIDTH = MAXI_COL * 30.5;
const MAXI_HEIGHT = MAXI_ROW * 32 + MAXI_HEX_H;
// Bullseye center sits on row 15.5, column 14 of the even rows
const MAXI_BULLSEYE_X = 14.5 * MAXI_COL;
const MAXI_BULLSEYE_Y = MAXI_HEX_H / 2 + 15.5 * MAXI_ROW;
const MAXI_RING_RADII = [0.5774, 1.3359, 2.1058, 2.8644, 3.6229, 4.3814].map((k) => k * 3.5);

// Linear codes: top / bottom margin is the quiet zone, capped so short bars stay tall
const LINEAR_MAX_VERTICAL_INSET = 0.1;

const safeOrder = (v: number) => (Number.isNaN(v) ? 0 : clamp01(v));

export const buildBarcodeData = (value: string, options: BarcodeBuildOptions): BarcodeData => {
  const { format, width, height, quietZone, shape, dotScale, barRadius, order, timeline } = options;
  if (typeof value !== 'string' || value.length === 0) throw new Error('AnimatedBarcode: `value` must be a non-empty string');
  if (!(width > 0) || !(height > 0)) throw new Error('AnimatedBarcode: width and height must be > 0');
  if (!(dotScale > 0 && dotScale <= 1)) throw new Error('AnimatedBarcode: `dotScale` must be in (0, 1]');
  if (!(quietZone >= 0)) throw new Error('AnimatedBarcode: `quietZone` must be >= 0');

  const symbol = encodeBarcode(format, value, options.encoderOptions);
  const startOf = (rank: number, i: number, j: number) =>
    timeline.dotStart + safeOrder(rank) * timeline.dotSpread + pseudoRandom(i, j) * timeline.dotJitter;

  const elements: number[] = [];
  let finalPath = '';

  if (symbol.kind === 'linear') {
    const scaleX = width / (symbol.units + quietZone * 2);
    const insetY = Math.min(quietZone * scaleX, height * LINEAR_MAX_VERTICAL_INSET);
    const barsHeight = height - insetY * 2;
    const offsetX = quietZone * scaleX;
    const codeWidth = symbol.units * scaleX;
    const count = symbol.bars.length;

    symbol.bars.forEach((bar, i) => {
      const x = offsetX + bar.x * scaleX;
      const w = bar.w * scaleX;
      const y = insetY + bar.top * barsHeight;
      const h = bar.h * barsHeight;
      const rank = order({ row: 0, column: i, count, x: (x + w / 2 - offsetX) / codeWidth, y: (y + h / 2 - insetY) / barsHeight });
      elements.push(x, y, w, h, startOf(rank, 0, i));
      finalPath += barPath(x, y, w, h, barRadius);
    });

    return { kind: 'linear', width, height, elements, stride: 5, cellSize: scaleX, cellHeight: barsHeight, finalPath, bullseye: null };
  }

  if (symbol.kind === 'matrix') {
    const { cols, rows, dark } = symbol;
    const cell = Math.min(width / (cols + quietZone * 2), height / (rows + quietZone * 2));
    const offsetX = (width - cols * cell) / 2;
    const offsetY = (height - rows * cell) / 2;
    const half = (cell * dotScale) / 2;
    const count = Math.max(cols, rows);
    // Merged runs give a seamless final render, only possible for full-size squares
    const mergeRuns = shape === 'square' && dotScale === 1;

    for (let i = 0; i < rows; i++) {
      let runStart = -1;
      for (let j = 0; j <= cols; j++) {
        const isDark = j < cols && dark[i * cols + j] === 1;
        if (isDark) {
          const cx = offsetX + j * cell + cell / 2;
          const cy = offsetY + i * cell + cell / 2;
          const rank = order({ row: i, column: j, count, x: (j + 0.5) / cols, y: (i + 0.5) / rows });
          elements.push(cx, cy, startOf(rank, i, j));
          if (mergeRuns) {
            if (runStart < 0) runStart = j;
          } else {
            finalPath += dotPath(cx, cy, half, shape);
          }
        } else if (mergeRuns && runStart >= 0) {
          const x0 = offsetX + runStart * cell;
          const y0 = offsetY + i * cell;
          finalPath += `M${x0} ${y0}H${offsetX + j * cell}V${y0 + cell}H${x0}Z`;
          runStart = -1;
        }
      }
    }

    return { kind: 'matrix', width, height, elements, stride: 3, cellSize: cell, cellHeight: cell, finalPath, bullseye: null };
  }

  // MaxiCode: quiet zone is counted in hexagon widths
  const scale = Math.min(width / (MAXI_WIDTH + quietZone * MAXI_COL * 2), height / (MAXI_HEIGHT + quietZone * MAXI_COL * 2));
  const offsetX = (width - MAXI_WIDTH * scale) / 2;
  const offsetY = (height - MAXI_HEIGHT * scale) / 2;
  const halfW = (MAXI_HEX_W * scale * dotScale) / 2;
  const halfH = (MAXI_HEX_H * scale * dotScale) / 2;

  for (const index of symbol.hexes) {
    const column = index % 30;
    const row = Math.floor(index / 30);
    const ux = column * MAXI_COL + (row & 1 ? MAXI_COL : MAXI_COL / 2);
    const uy = MAXI_HEX_H / 2 + row * MAXI_ROW;
    const cx = offsetX + ux * scale;
    const cy = offsetY + uy * scale;
    const rank = order({ row, column, count: 33, x: ux / MAXI_WIDTH, y: uy / MAXI_HEIGHT });
    elements.push(cx, cy, startOf(rank, row, column));
    finalPath += hexPath(cx, cy, halfW, halfH);
  }

  return {
    kind: 'maxicode',
    width,
    height,
    elements,
    stride: 3,
    cellSize: MAXI_HEX_W * scale,
    cellHeight: MAXI_HEX_H * scale,
    finalPath,
    bullseye: {
      cx: offsetX + MAXI_BULLSEYE_X * scale,
      cy: offsetY + MAXI_BULLSEYE_Y * scale,
      radii: MAXI_RING_RADII.map((r) => r * scale),
    },
  };
};
