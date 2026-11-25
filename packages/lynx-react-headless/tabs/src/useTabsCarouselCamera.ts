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

      // ReactLynx의 MT style setter는 custom property를 지원하지 않으므로 실제 CSS 속성을 갱신한다.
      // host에 따라 inline 값의 var()·calc()를 해석하지 않으므로 px 값만 쓰고 inset은 recipe가 맡는다.
      // pager가 페이지 사이에 있으면 매 frame 위치가 바뀌어 recipe transition이 frame마다 다시 시작되고,
      // 느리게 출발하는 easing 때문에 Indicator가 거의 따라오지 못한다. 그동안만 transition을 끄고,
      // 페이지에 닿으면 inline 값을 지워(`undefined`) recipe transition으로 돌아간다.
      // background commit이 inline style을 통째로 바꾸므로 매 frame 다시 쓴다.
      const transitionDuration = position === Math.round(position) ? undefined : "0s";
      indicatorRef.current?.setStyleProperties({
        transform: `translateX(${x}px)`,
        width: `${width}px`,
        "transition-duration": transitionDuration as string,
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
