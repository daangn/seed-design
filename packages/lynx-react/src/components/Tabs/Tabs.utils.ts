export interface TabsLayoutChangeEvent {
  detail?: {
    width?: number;
  };
  params?: {
    width?: number;
  };
}

export interface TabsLayoutRect {
  left: number;
  width: number;
}

export function getTabsLayoutWidth(event: TabsLayoutChangeEvent): number | null {
  const width = event.detail?.width ?? event.params?.width;
  if (typeof width !== "number" || !Number.isFinite(width)) return null;
  return Math.max(0, width);
}

export function getTabsTriggerRects(
  values: string[],
  widths: Record<string, number>,
): Record<string, TabsLayoutRect> {
  const rects: Record<string, TabsLayoutRect> = {};
  let left = 0;
  let hasCompletePrefix = true;

  for (const value of values) {
    const width = widths[value];
    if (width === undefined) {
      hasCompletePrefix = false;
      continue;
    }
    if (hasCompletePrefix) rects[value] = { left, width };
    left += width;
  }

  return rects;
}
