import { useCallback, useMemo, useRef, type Ref } from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import { mergeStyle } from "./mergeStyle.js";
import { useComposedNodeRef } from "./useComposedNodeRef.js";
import { useKeyboardAvoidingScrollViewRootContext } from "./useKeyboardAvoidingScrollView.js";

type ScrollViewProps = IntrinsicElements["scroll-view"];
type LayoutChangeHandler = NonNullable<ScrollViewProps["bindlayoutchange"]>;
type ScrollHandler = NonNullable<ScrollViewProps["bindscroll"]>;
type ScrollEndHandler = NonNullable<ScrollViewProps["bindscrollend"]>;
type TouchStartHandler = NonNullable<ScrollViewProps["bindtouchstart"]>;
type TouchEndHandler = NonNullable<ScrollViewProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<ScrollViewProps["bindtouchcancel"]>;

export interface UseKeyboardAvoidingScrollViewContentProps {
  /** `<scroll-view>`와 함께 연결할 ref입니다. */
  ref?: Ref<NodesRef>;
  /** `<scroll-view>`의 style입니다. Root의 남은 높이를 채우는 기본 flex 값보다 사용자 값이 우선합니다. */
  style?: ScrollViewProps["style"];
  /** 사용자 handler를 호출하고 회피 위치 재계산을 예약합니다. */
  bindlayoutchange?: ScrollViewProps["bindlayoutchange"];
  bindscroll?: ScrollViewProps["bindscroll"];
  /** 사용자 handler를 호출하고 사용자 스크롤 중 멈춘 자동 회피를 재개합니다. */
  bindscrollend?: ScrollViewProps["bindscrollend"];
  /** 사용자 handler를 호출하고 자동 회피를 멈춥니다. */
  bindtouchstart?: ScrollViewProps["bindtouchstart"];
  bindtouchend?: ScrollViewProps["bindtouchend"];
  bindtouchcancel?: ScrollViewProps["bindtouchcancel"];
}

export interface UseKeyboardAvoidingScrollViewContentReturn {
  /** `<scroll-view>`의 기본 props입니다. 기본 방향은 세로이며 사용자 native props로 변경할 수 있습니다. */
  scrollViewProps: Required<
    Pick<
      ScrollViewProps,
      | "bindlayoutchange"
      | "bindscroll"
      | "bindscrollend"
      | "bindtouchstart"
      | "bindtouchend"
      | "bindtouchcancel"
    >
  > & {
    ref: Ref<NodesRef>;
    style: NonNullable<ScrollViewProps["style"]>;
    "scroll-orientation": "vertical";
    flatten: false;
  };
  /** scroll-view의 마지막 자식 `<view>`에 펼칩니다. 키보드가 열린 동안 이 view의 높이를 늘립니다. */
  spacerProps: {
    ref: Ref<NodesRef>;
    "accessibility-elements-hidden": true;
    flatten: false;
  };
}

/**
 * 가까운 Root의 회피 엔진에 세로 `<scroll-view>`를 연결합니다.
 * Root의 남은 높이를 채우고, 사용자 스크롤 중에는 자동 회피를 멈춥니다.
 */
export function useKeyboardAvoidingScrollViewContent(
  props: UseKeyboardAvoidingScrollViewContentProps = {},
): UseKeyboardAvoidingScrollViewContentReturn {
  const {
    ref: forwardedRef,
    style,
    bindlayoutchange: userBindLayoutChange,
    bindscroll: userBindScroll,
    bindscrollend: userBindScrollEnd,
    bindtouchstart: userBindTouchStart,
    bindtouchend: userBindTouchEnd,
    bindtouchcancel: userBindTouchCancel,
  } = props;
  const { engine, scrollRef, spacerRef } = useKeyboardAvoidingScrollViewRootContext(
    "KeyboardAvoidingScrollViewContent",
  );
  const touchActiveRef = useRef(false);
  const didScrollDuringTouchRef = useRef(false);
  const ref = useComposedNodeRef(scrollRef, forwardedRef);

  const handleLayoutChange = useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";

      userBindLayoutChange?.(...args);
      engine.viewportChanged();
    },
    [engine, userBindLayoutChange],
  );

  const handleTouchStart = useCallback<TouchStartHandler>(
    (...args) => {
      "background only";

      userBindTouchStart?.(...args);
      touchActiveRef.current = true;
      didScrollDuringTouchRef.current = false;
      engine.userScrollStarted();
    },
    [engine, userBindTouchStart],
  );

  const handleScroll = useCallback<ScrollHandler>(
    (...args) => {
      "background only";
      userBindScroll?.(...args);

      if (touchActiveRef.current) {
        didScrollDuringTouchRef.current = true;
      }
    },
    [userBindScroll],
  );

  const handleTouchEnd = useCallback<TouchEndHandler>(
    (...args) => {
      "background only";

      userBindTouchEnd?.(...args);
      touchActiveRef.current = false;
      if (!didScrollDuringTouchRef.current) {
        engine.userScrollEnded();
      }
    },
    [engine, userBindTouchEnd],
  );

  const handleTouchCancel = useCallback<TouchCancelHandler>(
    (...args) => {
      "background only";

      userBindTouchCancel?.(...args);
      touchActiveRef.current = false;
      didScrollDuringTouchRef.current = false;
      engine.userScrollEnded();
    },
    [engine, userBindTouchCancel],
  );

  const handleScrollEnd = useCallback<ScrollEndHandler>(
    (...args) => {
      "background only";

      userBindScrollEnd?.(...args);
      touchActiveRef.current = false;
      didScrollDuringTouchRef.current = false;
      engine.userScrollEnded();
    },
    [engine, userBindScrollEnd],
  );

  const scrollViewStyle = useMemo(
    () => mergeStyle({ flexGrow: 1, flexShrink: 1, flexBasis: "0px", minHeight: "0px" }, style),
    [style],
  );

  return useMemo<UseKeyboardAvoidingScrollViewContentReturn>(
    () => ({
      scrollViewProps: {
        ref,
        style: scrollViewStyle,
        bindlayoutchange: handleLayoutChange,
        bindscroll: handleScroll,
        bindscrollend: handleScrollEnd,
        bindtouchstart: handleTouchStart,
        bindtouchend: handleTouchEnd,
        bindtouchcancel: handleTouchCancel,
        "scroll-orientation": "vertical",
        flatten: false,
      },
      spacerProps: {
        ref: spacerRef,
        "accessibility-elements-hidden": true,
        flatten: false,
      },
    }),
    [
      ref,
      scrollViewStyle,
      spacerRef,
      handleLayoutChange,
      handleScroll,
      handleScrollEnd,
      handleTouchStart,
      handleTouchEnd,
      handleTouchCancel,
    ],
  );
}
