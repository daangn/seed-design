/** Calculates the scale ratio for SEED's fixed-distance Scale Feedback. */
export function calculateScaleFeedback(width: number, height: number): number {
  const basis = Math.max(height, width / 4, 24);
  return basis > 0 ? (basis - 2) / basis : 1;
}

/** Treats unknown values as default motion and matches only the exact reduced value. */
export function isReducedMotion(value: unknown): boolean {
  return value === "reduced";
}
