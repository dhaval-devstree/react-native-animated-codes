export const DEFAULT_SIZE = 200;

type LayoutInput = { size?: number; width?: number; height?: number };

// QR stays square: it fits the smaller side of the box unless `size` is explicit
export const resolveLayout = ({ size, width, height }: LayoutInput) => {
  const qrSize = size ?? Math.min(width ?? height ?? DEFAULT_SIZE, height ?? width ?? DEFAULT_SIZE);
  return { qrSize, boxWidth: width ?? qrSize, boxHeight: height ?? qrSize };
};
