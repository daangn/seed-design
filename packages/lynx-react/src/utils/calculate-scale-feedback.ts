/** Calculates SEED's fixed-distance scale ratio directly on the Main Thread. */
export function calculateScaleFeedback(width: number, height: number): number {
  "main thread";

  const basis = Math.max(height, width / 4, 24);
  return basis > 0 ? (basis - 2) / basis : 1;
}

/** Treats unknown values as default motion and matches only the exact reduced value. */
export function isReducedMotion(value: unknown): boolean {
  return value === "reduced";
}
