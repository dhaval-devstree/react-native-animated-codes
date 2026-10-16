// Minimal typing of the bwip-js platform-neutral build, only the raw encoder is used.
// Fallback for the build tsconfig: Node resolution ignores package `exports`, so bwip-js own typings are not found there.
declare module 'bwip-js/generic' {
  export type RawSymbol = {
    sbs?: number[];
    bhs?: number[];
    bbs?: number[];
    pixs?: number[];
    pixx?: number;
    pixy?: number;
    width?: number;
    height?: number;
  };

  const bwipjs: {
    raw(bcid: string, text: string, options?: Record<string, unknown>): RawSymbol[];
    render(params: Record<string, unknown>, drawing: Record<string, unknown>): unknown;
    BWIPJS_VERSION: string;
    BWIPP_VERSION: string;
  };

  export default bwipjs;
}
