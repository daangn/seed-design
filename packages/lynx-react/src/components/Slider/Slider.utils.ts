export interface SliderGeometry {
  left: number;
  width: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function percentageForValue(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

export function valueForPercentage(
  percent: number,
  min: number,
  max: number,
  dir: "ltr" | "rtl",
): number {
  const ratio = clamp(percent, 0, 100) / 100;
  return dir === "rtl" ? max - ratio * (max - min) : min + ratio * (max - min);
}

export function decimalCount(value: number): number {
  const text = String(value);
  const exponent = text.toLowerCase().split("e");
  const fraction = exponent[0].split(".")[1]?.length ?? 0;
  return fraction + (exponent[1] ? Math.max(0, -Number(exponent[1])) : 0);
}

export function roundValue(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function closestAllowedValue(value: number, allowedValues: readonly number[]): number {
  if (allowedValues.length === 0) return value;
  let closest = allowedValues[0];
  let distance = Math.abs(value - closest);
  for (let index = 1; index < allowedValues.length; index += 1) {
    const candidate = allowedValues[index];
    const candidateDistance = Math.abs(value - candidate);
    if (candidateDistance < distance) {
      closest = candidate;
      distance = candidateDistance;
    }
  }
  return closest;
}

export function normalizeValue(
  value: number,
  min: number,
  max: number,
  step: number,
  allowedValues?: readonly number[],
): number {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const candidate = Number.isFinite(value) ? value : safeMin;
  if (allowedValues && allowedValues.length > 0) {
    return clamp(closestAllowedValue(candidate, allowedValues), safeMin, safeMax);
  }
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const decimals = Math.max(decimalCount(safeStep), decimalCount(safeMin));
  return clamp(
    roundValue(Math.round((candidate - safeMin) / safeStep) * safeStep + safeMin, decimals),
    safeMin,
    safeMax,
  );
}

export function normalizeValues(
  values: readonly number[] | undefined,
  min: number,
  max: number,
  step: number,
  allowedValues?: readonly number[],
): number[] {
  const source = values && values.length > 0 ? values : [(min + max) / 2];
  return source
    .map((value) => normalizeValue(value, min, max, step, allowedValues))
    .sort((a, b) => a - b);
}

export function nearestValueIndex(values: readonly number[], value: number): number {
  if (values.length < 2) return 0;
  let index = 0;
  let distance = Math.abs(values[0] - value);
  for (let candidate = 1; candidate < values.length; candidate += 1) {
    const candidateDistance = Math.abs(values[candidate] - value);
    if (candidateDistance < distance) {
      index = candidate;
      distance = candidateDistance;
    }
  }
  return index;
}

export function hasMinimumSteps(
  values: readonly number[],
  minimumSteps: number,
  step: number,
): boolean {
  if (minimumSteps <= 0 || values.length < 2) return true;
  const required = minimumSteps * step;
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] - values[index - 1] < required) return false;
  }
  return true;
}

export function getThumbInBoundsOffset(width: number, percent: number, direction: 1 | -1): number {
  if (!width) return 0;
  const halfWidth = width / 2;
  const scaledOffset = (clamp(percent, 0, 100) / 50) * halfWidth;
  return (halfWidth - scaledOffset * direction) * direction;
}

export function getStickyLabelOffset(
  labelWidth: number,
  percent: number,
  thumbWidth: number,
  trackWidth: number,
  direction: 1 | -1,
): number {
  if (!labelWidth || !trackWidth) return 0;
  const thumbOffset = getThumbInBoundsOffset(thumbWidth, percent, direction);
  const naturalCenter = (percent / 100) * trackWidth + thumbOffset;
  const halfLabel = labelWidth / 2;
  const center = clamp(naturalCenter, halfLabel, trackWidth - halfLabel);
  return (center - (percent / 100) * trackWidth) * direction;
}

export function eventPageX(event: unknown): number {
  const target = event as {
    touches?: Array<{ pageX?: unknown; clientX?: unknown }>;
    changedTouches?: Array<{ pageX?: unknown; clientX?: unknown }>;
    pageX?: unknown;
    clientX?: unknown;
    detail?: { x?: unknown };
  } | null;
  const touch = target?.touches?.[0] ?? target?.changedTouches?.[0];
  const candidates = [
    touch?.pageX,
    touch?.clientX,
    target?.pageX,
    target?.clientX,
    target?.detail?.x,
  ];
  for (const candidate of candidates) {
    const number = Number(candidate);
    if (Number.isFinite(number)) return number;
  }
  return Number.NaN;
}

export function geometryFromRect(value: unknown): SliderGeometry | null {
  const rect = value as { left?: unknown; width?: unknown } | null | undefined;
  const left = Number(rect?.left);
  const width = Number(rect?.width);
  return Number.isFinite(left) && Number.isFinite(width) && width > 0 ? { left, width } : null;
}
