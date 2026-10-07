import { useCallback, useMemo, useRef, type Ref } from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";

import { useComposedNodeRef } from "./useComposedNodeRef.js";
import { useKeyboardAvoidingScrollViewRootContext } from "./useKeyboardAvoidingScrollView.js";

type ScrollViewProps = IntrinsicElements["scroll-view"];
type LayoutChangeHandler = NonNullable<ScrollViewProps["bindlayoutchange"]>;
type ScrollHandler = NonNullable<ScrollViewProps["bindscroll"]>;
type ScrollEndHandler = NonNullable<ScrollViewProps["bindscrollend"]>;
type TouchStartHandler = NonNullable<ScrollViewProps["bindtouchstart"]>;
type TouchEndHandler = NonNullable<ScrollViewProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<ScrollViewProps["bindtouchcancel"]>;

export interface UseKeyboardAvoidingScrollViewContentProps
  extends Pick<ScrollViewProps, "bindscroll" | "bindtouchend" | "bindtouchcancel"> {
  /** `<scroll-view>`와 함께 연결할 ref입니다. */
  ref?: Ref<NodesRef>;
  /** `<scroll-view>`의 style입니다. Root의 남은 높이를 채우는 flex 값은 덮어쓸 수 없습니다. */
  style?: CSSProperties;
  /** 회피 위치 재계산을 예약한 뒤 호출됩니다. */
  bindlayoutchange?: ScrollViewProps["bindlayoutchange"];
  /** 사용자 스크롤 중 멈춘 자동 회피를 재개한 뒤 호출됩니다. */
  bindscrollend?: ScrollViewProps["bindscrollend"];
  /** 자동 회피를 멈춘 뒤 호출됩니다. */
  bindtouchstart?: ScrollViewProps["bindtouchstart"];
}

export interface UseKeyboardAvoidingScrollViewContentReturn {
  /** 세로 `<scroll-view>`에 마지막으로 펼칩니다. `scroll-orientation`은 `"vertical"`로 고정됩니다. */
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
    style: CSSProperties;
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

      engine.viewportChanged();
      userBindLayoutChange?.(...args);
    },
    [engine, userBindLayoutChange],
  );

  const handleTouchStart = useCallback<TouchStartHandler>(
    (...args) => {
      "background only";

      touchActiveRef.current = true;
      didScrollDuringTouchRef.current = false;
      engine.userScrollStarted();
      userBindTouchStart?.(...args);
    },
    [engine, userBindTouchStart],
  );

  const handleScroll = useCallback<ScrollHandler>(
    (...args) => {
      "background only";

      if (touchActiveRef.current) {
        didScrollDuringTouchRef.current = true;
      }
      userBindScroll?.(...args);
    },
    [userBindScroll],
  );

  const handleTouchEnd = useCallback<TouchEndHandler>(
    (...args) => {
      "background only";

      touchActiveRef.current = false;
      if (!didScrollDuringTouchRef.current) {
        engine.userScrollEnded();
      }
      userBindTouchEnd?.(...args);
    },
    [engine, userBindTouchEnd],
  );

  const handleTouchCancel = useCallback<TouchCancelHandler>(
    (...args) => {
      "background only";

      touchActiveRef.current = false;
      didScrollDuringTouchRef.current = false;
      engine.userScrollEnded();
      userBindTouchCancel?.(...args);
    },
    [engine, userBindTouchCancel],
  );

  const handleScrollEnd = useCallback<ScrollEndHandler>(
    (...args) => {
      "background only";

      touchActiveRef.current = false;
      didScrollDuringTouchRef.current = false;
      engine.userScrollEnded();
      userBindScrollEnd?.(...args);
    },
    [engine, userBindScrollEnd],
  );

  const scrollViewStyle = useMemo<CSSProperties>(
    () => ({ ...style, flexGrow: 1, flexShrink: 1, flexBasis: "0px", minHeight: "0px" }),
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
