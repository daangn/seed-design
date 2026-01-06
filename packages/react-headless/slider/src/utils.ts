// This code includes portions derived from radix-ui/primitives (https://github.com/radix-ui/primitives).
// Used under the MIT License: https://opensource.org/licenses/MIT

export function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

export function getNextSortedValues(prevValues: number[], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;

  return nextValues.sort((a, b) => a - b);
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);

  return clamp(percentage, [0, 100]);
}

/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
export function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0;

  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);

  return distances.indexOf(closestDistance);
}

/**
 * Offsets the thumb centre point while sliding to ensure it remains
 * within the bounds of the slider when reaching the edges
 */
export function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;

  const offset = linearScale([0, halfPercent], [0, halfWidth]);

  return (halfWidth - offset(left) * direction) * direction;
}

/**
 * Calculates the offset needed to keep a label centered on the thumb position
 * but sticky to the track edges when it would overflow.
 *
 * @param labelWidth - The width of the label element
 * @param thumbPosition - The thumb position as a percentage (0-100)
 * @param thumbWidth - The width of the thumb element
 * @param trackWidth - The width of the track
 * @param direction - 1 for LTR, -1 for RTL
 * @returns The offset in pixels to apply to the label
 */
export function getStickyLabelOffset(
  labelWidth: number,
  thumbPosition: number,
  thumbWidth: number,
  trackWidth: number,
  direction: number
) {
  // If we don't have dimensions, no offset
  if (!labelWidth || !trackWidth) return 0;

  const halfLabelWidth = labelWidth / 2;

  // First calculate the thumb's offset to keep it in bounds
  const thumbOffset = getThumbInBoundsOffset(thumbWidth, thumbPosition, direction);

  // Calculate the actual thumb center position (percentage position + thumb offset)
  const naturalCenterPx = (thumbPosition / 100) * trackWidth + thumbOffset;

  // Calculate the bounds where the label can be positioned (in pixels)
  const minCenterPx = halfLabelWidth;
  const maxCenterPx = trackWidth - halfLabelWidth;

  // Clamp the center position within bounds
  const clampedCenterPx = Math.max(minCenterPx, Math.min(maxCenterPx, naturalCenterPx));

  // Calculate the offset from the natural position (which already includes thumb offset)
  // So we return the total offset needed from the base percentage position
  const totalOffsetPx = clampedCenterPx - (thumbPosition / 100) * trackWidth;

  return totalOffsetPx * direction;
}

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
export function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues <= 0) return true;

  const stepsBetweenValues = getStepsBetweenValues(values);
  const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);

  return actualMinStepsBetweenValues >= minStepsBetweenValues;
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);

    return output[0] + ratio * (value - input[0]);
  };
}

export function getDecimalCount(value: number) {
  return (String(value).split(".")[1] || "").length;
}

export function roundValue(value: number, decimalCount: number) {
  const rounder = 10 ** decimalCount;

  return Math.round(value * rounder) / rounder;
}

/**
 * Given a value and an array of allowed values, returns the closest allowed value.
 * If no allowed values are provided, returns the original value.
 *
 * @example
 * // returns 20
 * getClosestAllowedValue(23, [10, 20, 30, 40]);
 *
 * @example
 * // returns 30
 * getClosestAllowedValue(25, [10, 20, 30, 40]);
 */
export function getClosestAllowedValue(value: number, allowedValues?: number[]): number {
  if (!allowedValues || allowedValues.length === 0) return value;

  // Find the closest allowed value
  let closestValue = allowedValues[0];
  let minDistance = Math.abs(value - closestValue);

  for (const allowedValue of allowedValues) {
    const distance = Math.abs(value - allowedValue);

    if (distance < minDistance) {
      minDistance = distance;
      closestValue = allowedValue;
    }
  }

  return closestValue;
}

/**
 * Given a current value, direction, and an array of allowed values, returns the next allowed value in that direction.
 * If no allowed values are provided or no next value exists, returns null.
 *
 * @example
 * // returns 30
 * getNextAllowedValue(20, 1, [10, 20, 30, 40]);
 *
 * @example
 * // returns 10
 * getNextAllowedValue(20, -1, [10, 20, 30, 40]);
 */
export function getNextAllowedValue(
  currentValue: number,
  direction: 1 | -1,
  allowedValues?: number[],
): number | null {
  if (!allowedValues || allowedValues.length === 0) {
    return null;
  }

  // Sort allowed values to ensure correct order
  const sortedValues = [...allowedValues].sort((a, b) => a - b);

  // Find current value index
  const currentIndex = sortedValues.indexOf(currentValue);

  // Current value is not in allowed values, find the closest and then move from there
  if (currentIndex === -1) {
    const closest = getClosestAllowedValue(currentValue, sortedValues);
    const closestIndex = sortedValues.indexOf(closest);

    if (direction === 1 && closestIndex < sortedValues.length - 1)
      return sortedValues[closestIndex + 1];

    if (direction === -1 && closestIndex > 0) return sortedValues[closestIndex - 1];

    return closest;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex >= 0 && nextIndex < sortedValues.length) return sortedValues[nextIndex];

  return null;
}
