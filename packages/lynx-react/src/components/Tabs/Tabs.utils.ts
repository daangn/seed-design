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

export function getTabsOrderedItems<T extends { value: string }>(
  items: T[],
  values: string[],
): T[] {
  const itemsByValue = new Map(items.map((item) => [item.value, item]));
  const ordered = values.flatMap((value) => {
    const item = itemsByValue.get(value);
    if (!item) return [];
    itemsByValue.delete(value);
    return [item];
  });
  ordered.push(...itemsByValue.values());
  return ordered;
}

export function getTabsTriggerRects(
  values: string[],
  widths: Record<string, number>,
): Record<string, TabsLayoutRect> {
  const rects = Object.create(null) as Record<string, TabsLayoutRect>;
  let left = 0;
  let hasCompletePrefix = true;

  for (const value of values) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn is unavailable in supported Lynx runtimes.
    const width = Object.prototype.hasOwnProperty.call(widths, value) ? widths[value] : undefined;
    if (width === undefined) {
      hasCompletePrefix = false;
      continue;
    }
    if (hasCompletePrefix) rects[value] = { left, width };
    left += width;
  }

  return rects;
}
