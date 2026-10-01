import * as React from "@lynx-js/react";
export interface UseTabsCarouselProps {
  swipeable?: boolean;
  /** iOS 뒤로가기 제스처를 우선하는 화면 왼쪽 가장자리 너비입니다. */
  iosBackGestureEdgeWidth?: number;
  onSettle?: () => void;
  /** 네이티브 pager가 drag를 감지했을 때 호출합니다. */
  onSwipeStart?: () => void;
  /** 시작된 스와이프가 끝나거나 취소되면 호출합니다. */
  onSwipeEnd?: () => void;
}

export function useTabsCarousel({
  swipeable = false,
  iosBackGestureEdgeWidth = 32,
  onSettle,
  onSwipeStart,
  onSwipeEnd,
}: UseTabsCarouselProps) {
  return React.useMemo(
    () => ({ swipeable, iosBackGestureEdgeWidth, onSettle, onSwipeStart, onSwipeEnd }),
    [swipeable, iosBackGestureEdgeWidth, onSettle, onSwipeStart, onSwipeEnd],
  );
}
export type UseTabsCarouselReturn = ReturnType<typeof useTabsCarousel>;
