export function computeRingGeometry(numSize: number) {
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;
  return { halfSize, innerR, ringCenterR, capSize };
}
