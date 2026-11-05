export const LOOP_BUFFER_VIEWPORTS = 12;

export function getLoopSideCycleCount(optionCount: number, visibleItemCount: number) {
  if (optionCount <= 1) return 0;

  return Math.ceil((LOOP_BUFFER_VIEWPORTS * visibleItemCount) / optionCount);
}

export function getPhysicalOptionCount(
  optionCount: number,
  visibleItemCount: number,
  loop: boolean,
) {
  if (!loop || optionCount <= 1) return optionCount;

  return optionCount * (getLoopSideCycleCount(optionCount, visibleItemCount) * 2 + 1);
}

export function toLogicalIndex(physicalIndex: number, optionCount: number) {
  if (optionCount === 0) return -1;

  return ((physicalIndex % optionCount) + optionCount) % optionCount;
}

export function getCentralPhysicalIndex(
  logicalIndex: number,
  optionCount: number,
  visibleItemCount: number,
  loop: boolean,
) {
  if (!loop || optionCount <= 1) return logicalIndex;

  return getLoopSideCycleCount(optionCount, visibleItemCount) * optionCount + logicalIndex;
}

export function clampPhysicalIndex(index: number, physicalOptionCount: number) {
  return Math.min(Math.max(index, 0), Math.max(physicalOptionCount - 1, 0));
}
