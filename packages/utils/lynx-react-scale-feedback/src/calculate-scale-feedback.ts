/** Calculates SEED's fixed-distance scale ratio directly on the Main Thread. */
export function calculateScaleFeedback(width: number, height: number): number {
  "main thread";

  // packages/qvism-preset/src/utils/scale-feedback.ts의 WIDTH_DIVISOR·MIN_BASIS·SCALE_DEPTH와 같은 값이다.
  // 둘을 대조하는 검사가 없으므로 함께 고친다.
  const basis = Math.max(height, width / 4, 24);
  return basis > 0 ? (basis - 2) / basis : 1;
}

/** Treats unknown values as default motion and matches only the exact reduced value. */
export function isReducedMotion(value: unknown): boolean {
  return value === "reduced";
}
