import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import type {
  ViewPagerChangeEvent,
  ViewPagerWillChangeEvent,
  ViewPagerOffsetChangeEvent,
} from "@lynx-js/types";
import { useTabsContext } from "./useTabsContext.js";
import { useTabsCarouselContext } from "./useTabsCarouselContext.js";
type NativeViewPagerProps = IntrinsicElements["viewpager"];
type TouchEndHandler = NonNullable<NativeViewPagerProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<NativeViewPagerProps["bindtouchcancel"]>;
export interface UseTabsCarouselCameraProps {
  bindchange?: NativeViewPagerProps["bindchange"];
  bindwillchange?: NativeViewPagerProps["bindwillchange"];
  bindoffsetchange?: NativeViewPagerProps["bindoffsetchange"];
}

export function useTabsCarouselCamera({
  bindchange,
  bindwillchange,
  bindoffsetchange,
}: UseTabsCarouselCameraProps = {}) {
  const tabsContext = useTabsContext();
  const carouselContext = useTabsCarouselContext();
  const swipingRef = React.useRef(false);
  const { indicatorRef, pagerValues, triggerRects } = tabsContext;
  const indicatorRects = React.useMemo(
    () => pagerValues.map((value) => triggerRects[value] ?? null),
    [pagerValues, triggerRects],
  );
  const finishSwipe = React.useCallback(() => {
    "background only";
    if (!swipingRef.current) return;
    swipingRef.current = false;
    carouselContext.onSwipeEnd?.();
  }, [carouselContext.onSwipeEnd]);

  const handleTouchEnd = React.useCallback<TouchEndHandler>(() => {
    "background only";
    finishSwipe();
  }, [finishSwipe]);

  const handleTouchCancel = React.useCallback<TouchCancelHandler>(() => {
    "background only";
    finishSwipe();
  }, [finishSwipe]);

  const handleWillChange = React.useCallback(
    (event: ViewPagerWillChangeEvent) => {
      "background only";
      bindwillchange?.(event);
      if (event.detail.isDragged) {
        tabsContext.handlePagerWillChange(event.detail.index);
        if (carouselContext.swipeable && !swipingRef.current) {
          swipingRef.current = true;
          carouselContext.onSwipeStart?.();
        }
      }
    },
    [
      bindwillchange,
      carouselContext.onSwipeStart,
      carouselContext.swipeable,
      tabsContext.handlePagerWillChange,
    ],
  );

  const handleChange = React.useCallback(
    (event: ViewPagerChangeEvent) => {
      "background only";
      bindchange?.(event);
      // 페이지 추가·제거 때 native pager가 보내는 change는 선택 변경이 아니다.
      if (event.detail.isDragged) tabsContext.handlePagerChange(event.detail.index);
      carouselContext.onSettle?.();
    },
    [bindchange, carouselContext.onSettle, tabsContext.handlePagerChange],
  );

  const handleOffsetChange = React.useCallback(
    (event: ViewPagerOffsetChangeEvent) => {
      "background only";
      bindoffsetchange?.(event);
    },
    [bindoffsetchange],
  );

  const handleIndicatorOffsetChange = React.useCallback(
    (event: ViewPagerOffsetChangeEvent) => {
      "main thread";

      const position = Number(event.detail.offset);
      if (!Number.isFinite(position)) return;

      const lowerIndex = Math.max(0, Math.floor(position));
      const upperIndex = Math.min(indicatorRects.length - 1, Math.ceil(position));
      const progress = Math.max(0, Math.min(1, position - lowerIndex));
      const lowerRect = indicatorRects[lowerIndex];
      const upperRect = indicatorRects[upperIndex] ?? lowerRect;
      if (!lowerRect) return;

      const x = lowerRect.left + ((upperRect?.left ?? lowerRect.left) - lowerRect.left) * progress;
      const width =
        lowerRect.width + ((upperRect?.width ?? lowerRect.width) - lowerRect.width) * progress;

      indicatorRef.current?.setStyleProperties({
        "--tabs-indicator-x": `${x}px`,
        "--tabs-indicator-width": `${width}px`,
      });
    },
    [indicatorRects, indicatorRef],
  );

  return React.useMemo(
    () => ({
      cameraProps: {
        ref: tabsContext.setPagerRef,
        bindtouchend: handleTouchEnd,
        bindtouchcancel: handleTouchCancel,
        bindwillchange: handleWillChange,
        bindchange: handleChange,
        bindoffsetchange: handleOffsetChange,
        "main-thread:bindoffsetchange": handleIndicatorOffsetChange,
        "initial-select-index": Math.max(0, tabsContext.selectedPagerIndex),
        "enable-scroll": carouselContext.swipeable,
        "ios-gesture-offset": carouselContext.iosBackGestureEdgeWidth,
      },
    }),
    [
      tabsContext.setPagerRef,
      tabsContext.selectedPagerIndex,
      handleTouchEnd,
      handleTouchCancel,
      handleWillChange,
      handleChange,
      handleOffsetChange,
      handleIndicatorOffsetChange,
      carouselContext.swipeable,
      carouselContext.iosBackGestureEdgeWidth,
    ],
  );
}
export type UseTabsCarouselCameraReturn = ReturnType<typeof useTabsCarouselCamera>;
