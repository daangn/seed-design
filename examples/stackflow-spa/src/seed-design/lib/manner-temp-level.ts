export type MannerTempLevel = "l1" | "l2" | "l3" | "l4" | "l5" | "l6";

const MANNER_TEMP_BOUNDARIES = [
  Number.NEGATIVE_INFINITY,
  30,
  36.3,
  37.6,
  42,
  52,
  Number.POSITIVE_INFINITY,
] as const;
const MANNER_TEMP_LEVELS: MannerTempLevel[] = [
  "l1",
  "l2",
  "l3",
  "l4",
  "l5",
  "l6",
];

export function mannerTempToLevel(
  temperature: number,
): MannerTempLevel | undefined {
  for (let i = 0; i < MANNER_TEMP_BOUNDARIES.length - 1; i++) {
    const lower = MANNER_TEMP_BOUNDARIES[i];
    const upper = MANNER_TEMP_BOUNDARIES[i + 1];

    if (temperature >= lower && temperature < upper) {
      return MANNER_TEMP_LEVELS[i];
    }
  }

  // Should never happen; boundaries are exhaustive
  throw new Error(`Invalid manner temperature: ${temperature}`);
}
