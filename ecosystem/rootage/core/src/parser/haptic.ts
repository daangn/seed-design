const systemPresets = ["select", "lightFeedback", "success", "error"] as const;
type SystemPreset = (typeof systemPresets)[number];

export type HapticValue = { sharpness: number; intensity: number } | { system: SystemPreset };

function isUnitInterval(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}

export function isHapticValue(value: unknown): value is HapticValue {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const fieldCount = Object.keys(value).length;

  if ("system" in value) {
    return fieldCount === 1 && systemPresets.some((preset) => preset === value.system);
  }

  return (
    fieldCount === 2 &&
    "sharpness" in value &&
    isUnitInterval(value.sharpness) &&
    "intensity" in value &&
    isUnitInterval(value.intensity)
  );
}
