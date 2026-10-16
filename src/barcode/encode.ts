import bwipjs from 'bwip-js/generic';
import type { BarcodeFormat, BarcodeEncoderOptions } from '../types';

type RawSymbol = {
  sbs?: number[];
  bhs?: number[];
  bbs?: number[];
  pixs?: number[];
  pixx?: number;
  pixy?: number;
};

// bwip-js typings describe raw() as a union per symbol kind and a closed options type, read it loosely instead
const rawEncode = bwipjs.raw as unknown as (bcid: string, text: string, options: Record<string, unknown>) => RawSymbol[];

// Encoder output in symbol units, independent of the final pixel size
export type EncodedSymbol =
  // Bars left to right, top / height as fractions of the full bar height (postal codes use partial bars)
  | { kind: 'linear'; units: number; bars: { x: number; w: number; top: number; h: number }[] }
  // Row-major dark dots
  | { kind: 'matrix'; cols: number; rows: number; dark: Uint8Array }
  // Dark hexagon indices on the fixed 30 × 33 MaxiCode grid
  | { kind: 'maxicode'; hexes: number[] };

type Point = [number, number];

// Renders through a recording drawing at 1 unit per dot and fills the traced outlines back into a bitmap
const renderBitmap = (format: BarcodeFormat, value: string, opts: Record<string, unknown>) => {
  let width = 0;
  let height = 0;
  const polygons: Point[][] = [];
  const noop = () => {};
  bwipjs.render({ ...opts, bcid: format, text: value, scale: 1 }, {
    setopts: noop, line: noop, hexagon: noop, ellipse: noop, fill: noop, clip: noop, unclip: noop,
    scale: () => [1, 1],
    measure: () => ({ width: 0, ascent: 0, descent: 0 }),
    init: (w: number, h: number) => { width = Math.round(w); height = Math.round(h); },
    polygon: (pts: Point[]) => { polygons.push(pts.map(([x, y]) => [x, y])); },
    end: noop,
  });

  // Even-odd scanline fill: outlines are axis aligned with integer corners
  const bitmap = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const cy = y + 0.5;
    const crossings: number[] = [];
    for (const poly of polygons) {
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        if (a[0] === b[0] && a[1] < cy !== b[1] < cy) crossings.push(Math.round(a[0]));
      }
    }
    crossings.sort((a, b) => a - b);
    for (let k = 0; k + 1 < crossings.length; k += 2) {
      for (let x = Math.max(crossings[k], 0); x < Math.min(crossings[k + 1], width); x++) bitmap[y * width + x] ^= 1;
    }
  }
  return { width, height, bitmap };
};

const stackedRowMap = (
  format: BarcodeFormat, value: string, opts: Record<string, unknown>,
  pixs: number[], pixx: number, pixy: number, storedRows: number
): number[] => {
  // Fallback: same height for every stored row
  const uniform = Array.from({ length: pixy }, (_, y) => Math.min(Math.floor((y * storedRows) / pixy), storedRows - 1));
  let drawn: ReturnType<typeof renderBitmap>;
  try {
    drawn = renderBitmap(format, value, opts);
  } catch {
    return uniform;
  }
  if (drawn.height !== pixy || drawn.width > pixx) return uniform;

  // The rendered bitmap may be cropped to its ink: try every horizontal offset, rows must map in order
  for (let dx = 0; dx <= pixx - drawn.width; dx++) {
    const map: number[] = [];
    let row = 0;
    for (let y = 0; y < pixy && row < storedRows; y++) {
      while (row < storedRows && !sameRow(drawn.bitmap, y * drawn.width, drawn.width, pixs, row * pixx + dx, pixx, dx)) row++;
      if (row < storedRows) map.push(row);
    }
    if (map.length === pixy) return map;
  }
  return uniform;
};

// Compares a rendered line with a stored row, cells outside the cropped window must be light
const sameRow = (drawn: Uint8Array, start: number, width: number, pixs: number[], rowStart: number, pixx: number, dx: number) => {
  for (let x = 0; x < width; x++) if (drawn[start + x] !== (pixs[rowStart + x] ? 1 : 0)) return false;
  const base = rowStart - dx;
  for (let x = 0; x < pixx; x++) if ((x < dx || x >= dx + width) && pixs[base + x]) return false;
  return true;
};

// Options that only affect bwip-js own text / border drawing, never the symbol geometry
const DRAWING_ONLY = ['includetext', 'showborder', 'guardwhitespace', 'height', 'width', 'alttext'];

export const encodeBarcode = (format: BarcodeFormat, value: string, options?: BarcodeEncoderOptions): EncodedSymbol => {
  const opts: Record<string, unknown> = { ...options };
  for (const key of DRAWING_ONLY) delete opts[key];

  let symbols: RawSymbol[];
  try {
    symbols = rawEncode(format, value, opts);
  } catch (e) {
    // BWIPP raises plain strings / errors like "bwipp.ean13badLength: ...", keep the message readable
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`AnimatedBarcode (${format}): ${message}`);
  }
  const symbol = symbols?.[0];
  if (!symbol) throw new Error(`AnimatedBarcode (${format}): encoder returned no symbol`);

  if (symbol.sbs) {
    const { sbs, bhs = [], bbs = [] } = symbol;
    // Regular codes use integer bar widths, postal codes use fractional ones: normalize to the narrowest element
    const unit = Math.min(...sbs.filter((w) => w > 0));
    const maxTop = Math.max(...bhs.map((h, i) => h + (bbs[i] ?? 0)), 0) || 1;
    const bars = [];
    let x = 0;
    // sbs alternates bar, space, bar... starting with a bar
    for (let i = 0; i < sbs.length; i++) {
      const w = sbs[i] / unit;
      if (i % 2 === 0 && w > 0) {
        const k = i / 2;
        const h = (bhs[k] ?? maxTop) / maxTop;
        const bottom = (bbs[k] ?? 0) / maxTop;
        bars.push({ x, w, top: 1 - bottom - h, h });
      }
      x += w;
    }
    return { kind: 'linear', units: x, bars };
  }

  if (symbol.pixs && symbol.pixx && symbol.pixy) {
    const { pixs, pixx, pixy } = symbol;
    const dark = new Uint8Array(pixx * pixy);
    const storedRows = Math.floor(pixs.length / pixx);
    // Stacked codes (PDF417, Codablock, DataBar stacked, composites...) store each row once and repeat it
    // `rowheights` times when drawn, but raw() drops `rowheights`: recover the row of every output line
    const rowOf = storedRows < pixy ? stackedRowMap(format, value, opts, pixs, pixx, pixy, storedRows) : null;
    for (let y = 0; y < pixy; y++) {
      const src = (rowOf ? rowOf[y] : y) * pixx;
      for (let x = 0; x < pixx; x++) dark[y * pixx + x] = pixs[src + x] ? 1 : 0;
    }
    return { kind: 'matrix', cols: pixx, rows: pixy, dark };
  }

  if (symbol.pixs) return { kind: 'maxicode', hexes: symbol.pixs };

  throw new Error(`AnimatedBarcode (${format}): unsupported encoder output`);
};
