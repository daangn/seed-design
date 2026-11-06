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
  // 조상이 `display: none`이면 trigger 폭이 0으로 보고된다. 위치는 앞선 trigger 폭의 합이므로
  // 앞선 trigger까지 모두 측정돼야 한다.
  const isMeasured =
    lowerRect !== undefined &&
    items
      .slice(0, Math.max(lowerIndex, upperIndex) + 1)
      .every((item) => (triggerRects[item.value]?.width ?? 0) > 0);

  return React.useMemo(
    () => ({
      transitionsEnabled,
      /** 표시할 위치의 trigger 폭이 0보다 크게 측정됐는지 여부입니다. `false`이면 Indicator를 숨겨야 합니다. */
      isMeasured,
      indicatorProps: {
        "main-thread:ref": indicatorRef,
        "accessibility-elements-hidden": true,
        style: {
          transform: `translateX(${x}px)`,
          width: `${width}px`,
        },
      },
    }),
    [indicatorRef, transitionsEnabled, isMeasured, x, width],
  );
}
export type UseTabsIndicatorReturn = ReturnType<typeof useTabsIndicator>;
