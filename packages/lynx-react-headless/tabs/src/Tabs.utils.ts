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

type NativeRef<T> = { current: T | null } | ((value: T | null) => void | (() => void));

function setRef(ref: NativeRef<unknown>, value: unknown) {
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}
function setMainThreadRef(ref: NativeRef<unknown>, value: unknown) {
  "main thread";
  if (typeof ref === "function") return ref(value);
  ref.current = value;
}
function mergeRefs(refs: NativeRef<unknown>[]) {
  return (value: unknown) => {
    "background only";
    const cleanups = refs.map((ref) => setRef(ref, value));
    return () =>
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index];
        if (cleanup) cleanup();
        else setRef(ref, null);
      });
  };
}
function mergeMainThreadRefs(refs: NativeRef<unknown>[]) {
  return (value: unknown) => {
    "main thread";
    const cleanups: (void | (() => void))[] = [];
    for (let index = 0; index < refs.length; index++)
      cleanups.push(setMainThreadRef(refs[index], value));
    return () => {
      for (let index = 0; index < refs.length; index++) {
        const cleanup = cleanups[index];
        if (cleanup) cleanup();
        else setMainThreadRef(refs[index], null);
      }
    };
  };
}
function composeHandlers(
  next: (...args: unknown[]) => unknown,
  previous: (...args: unknown[]) => unknown,
) {
  return (...args: unknown[]) => {
    "background only";
    next(...args);
    previous(...args);
  };
}
function composeMainThreadHandlers(
  next: (...args: unknown[]) => unknown,
  previous: (...args: unknown[]) => unknown,
) {
  return (...args: unknown[]) => {
    "main thread";
    next(...args);
    previous(...args);
  };
}

const nativeEvent = /^(?:main-thread:)?(?:(?:capture|global)-)?(?:bind|catch)[a-z]/;
// 같은 key의 사용자 handler가 먼저 실행되며 ref cleanup도 보존한다.
export function mergeNativeProps<T extends object>(...sources: Partial<T>[]): T {
  const result: Record<string, unknown> = {};
  const refs: NativeRef<unknown>[] = [];
  const mainThreadRefs: NativeRef<unknown>[] = [];
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      const previous = result[key];
      if (key === "ref" || key === "main-thread:ref") {
        if (value !== null)
          (key === "ref" ? refs : mainThreadRefs).push(value as NativeRef<unknown>);
      } else if (
        nativeEvent.test(key) &&
        typeof previous === "function" &&
        typeof value === "function"
      ) {
        const compose = key.startsWith("main-thread:")
          ? composeMainThreadHandlers
          : composeHandlers;
        result[key] = compose(
          value as (...args: unknown[]) => unknown,
          previous as (...args: unknown[]) => unknown,
        );
      } else result[key] = value;
    }
  }
  if (refs.length) result["ref"] = refs.length === 1 ? refs[0] : mergeRefs(refs);
  if (mainThreadRefs.length)
    result["main-thread:ref"] =
      mainThreadRefs.length === 1 ? mainThreadRefs[0] : mergeMainThreadRefs(mainThreadRefs);
  return result as T;
}
