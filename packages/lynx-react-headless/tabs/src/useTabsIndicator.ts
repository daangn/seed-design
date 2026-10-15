import * as React from "@lynx-js/react";
import { useTabsContext } from "./useTabsContext.js";
export interface UseTabsIndicatorProps {}
export function useTabsIndicator() {
  const { indicatorRef, items, indicatorIndex, triggerRects, transitionsEnabled } =
    useTabsContext();
  const position = indicatorIndex;
  const lowerIndex = Math.max(0, Math.floor(position));
  const upperIndex = Math.min(items.length - 1, Math.ceil(position));
  const progress = Math.max(0, Math.min(1, position - lowerIndex));
  const lowerRect = triggerRects[items[lowerIndex]?.value ?? ""];
  const upperRect = triggerRects[items[upperIndex]?.value ?? ""] ?? lowerRect;
  const x = lowerRect
    ? lowerRect.left + ((upperRect?.left ?? lowerRect.left) - lowerRect.left) * progress
    : 0;
  const width = lowerRect
    ? lowerRect.width + ((upperRect?.width ?? lowerRect.width) - lowerRect.width) * progress
    : 0;

  return React.useMemo(
    () => ({
      transitionsEnabled,
      indicatorProps: {
        "main-thread:ref": indicatorRef,
        "accessibility-elements-hidden": true,
        style: {
          transform: `translateX(${x}px)`,
          width: `${width}px`,
        },
      },
    }),
    [indicatorRef, transitionsEnabled, x, width],
  );
}
export type UseTabsIndicatorReturn = ReturnType<typeof useTabsIndicator>;
