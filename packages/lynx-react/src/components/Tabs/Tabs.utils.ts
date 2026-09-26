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
  triggerGap = 0,
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
    left += width + triggerGap;
  }

  return rects;
}

/**
 * Trigger rectangles begin at the first trigger, so they exclude list-content
 * padding. Scroll offsets are measured from the scroll content edge.
 */
export function getTabsScrollOffset({
  scrollAlign,
  currentOffset,
  viewportWidth,
  contentWidth,
  contentInsetStart,
  contentInsetEnd,
  triggerRect,
}: {
  scrollAlign: "nearest" | "start" | "center" | "end";
  currentOffset: number;
  viewportWidth: number;
  contentWidth: number;
  contentInsetStart: number;
  contentInsetEnd: number;
  triggerRect: TabsLayoutRect;
}): number {
  const maxOffset = Math.max(0, contentWidth - viewportWidth);
  const clampOffset = (offset: number) => Math.min(maxOffset, Math.max(0, offset));
  const clampedCurrentOffset = clampOffset(currentOffset);
  if (maxOffset === 0) return clampedCurrentOffset;

  const triggerStart = contentInsetStart + triggerRect.left;
  const triggerEnd = triggerStart + triggerRect.width;
  if (scrollAlign === "nearest") {
    // Visibility is the scroll-view's actual viewport. Insets provide the
    // additional room only after a clipped trigger needs to move.
    const visibleStart = clampedCurrentOffset;
    const visibleEnd = clampedCurrentOffset + viewportWidth;

    if (triggerStart >= visibleStart && triggerEnd <= visibleEnd) return clampedCurrentOffset;
    return clampOffset(
      triggerStart < visibleStart
        ? triggerStart - contentInsetStart
        : triggerEnd + contentInsetEnd - viewportWidth,
    );
  }

  if (scrollAlign === "start") return clampOffset(triggerStart - contentInsetStart);
  if (scrollAlign === "center") {
    return clampOffset(triggerStart + triggerRect.width / 2 - viewportWidth / 2);
  }
  return clampOffset(triggerEnd + contentInsetEnd - viewportWidth);
}

export function areTabsTransitionsEnabled(
  values: string[],
  rects: Record<string, TabsLayoutRect>,
): boolean {
  return values.length > 0 && values.every((value) => rects[value] !== undefined);
}
