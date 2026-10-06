import { useCallback, useEffect, useMemo, useRef, type Ref } from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import { createKeyboardAvoidingEngine, type KeyboardAvoidingScheduler } from "./engine.js";
import { lynxKeyboardEventSource } from "./keyboard-event-source.js";
import { lynxKeyboardAvoidingNativeDriver } from "./native-driver.js";
import type { UseKeyboardAvoidingScrollViewContext } from "./useKeyboardAvoidingScrollViewContext.js";

type ScrollViewProps = IntrinsicElements["scroll-view"];
type LayoutChangeHandler = NonNullable<ScrollViewProps["bindlayoutchange"]>;
type ScrollHandler = NonNullable<ScrollViewProps["bindscroll"]>;
type ScrollEndHandler = NonNullable<ScrollViewProps["bindscrollend"]>;
type TouchStartHandler = NonNullable<ScrollViewProps["bindtouchstart"]>;
type TouchEndHandler = NonNullable<ScrollViewProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<ScrollViewProps["bindtouchcancel"]>;

export type KeyboardAvoidingScrollBehavior = "smooth" | "instant";

/**
 * focus된 native 입력 하나를 회피 대상으로 등록하는 값입니다.
 * 키보드가 열리면 `fieldRef` → `controlRef` → `nativeRef` 순서로 safe area에 들어가는 가장 큰 영역을 고릅니다.
 */
export interface KeyboardAvoidanceRegistration {
  /** 등록을 구분하는 객체입니다. 입력이 mount된 동안 같은 객체를 유지합니다. */
  owner: object;
  /** focus된 native `<input>`·`<textarea>`의 ref입니다. */
  nativeRef: { current: NodesRef | null };
  /** 입력 테두리처럼 native 입력을 감싸는 영역의 ref입니다. */
  controlRef?: { current: NodesRef | null };
  /** label·description·footer까지 포함한 Field 전체의 ref입니다. */
  fieldRef?: { current: NodesRef | null };
  /**
   * `false`이면 등록하지 않고 현재 활성 입력의 회피를 해제합니다.
   * disabled·readOnly 입력은 `false`를 넘깁니다.
   * @default true
   */
  enabled?: boolean;
}

export interface UseKeyboardAvoidingScrollViewProps {
  /** 회피 위치 재계산을 예약한 뒤 호출됩니다. */
  bindlayoutchange?: ScrollViewProps["bindlayoutchange"];
  bindscroll?: ScrollViewProps["bindscroll"];
  /** 사용자 스크롤 중 멈춘 자동 회피를 재개한 뒤 호출됩니다. */
  bindscrollend?: ScrollViewProps["bindscrollend"];
  /** 자동 회피를 멈춘 뒤 호출됩니다. */
  bindtouchstart?: ScrollViewProps["bindtouchstart"];
  bindtouchend?: ScrollViewProps["bindtouchend"];
  bindtouchcancel?: ScrollViewProps["bindtouchcancel"];
  /** `scrollViewProps.ref`와 함께 연결할 scroll-view ref입니다. */
  ref?: Ref<NodesRef>;
  /**
   * 키보드와 활성 입력 영역 사이에 확보할 간격(px)입니다.
   * @default 24
   */
  keyboardGap?: number;
  /**
   * 회피 위치로 이동할 때 사용할 스크롤 방식입니다.
   * @default "smooth"
   */
  scrollBehavior?: KeyboardAvoidingScrollBehavior;
}

export type KeyboardAvoidingScrollViewNativeProps = Required<
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
  "scroll-orientation": "vertical";
  flatten: false;
};

export type KeyboardAvoidingSpacerNativeProps = {
  ref: Ref<NodesRef>;
  "accessibility-elements-hidden": true;
  flatten: false;
};

export interface UseKeyboardAvoidingScrollViewReturn {
  /** 하위 입력이 등록할 때 쓰는 Provider 값입니다. 엔진이 살아 있는 동안 같은 객체입니다. */
  context: UseKeyboardAvoidingScrollViewContext;
  /**
   * 세로 `<scroll-view>`에 마지막으로 펼칩니다. 회피 상태를 먼저 갱신한 뒤 사용자 handler를 호출합니다.
   * `scroll-orientation`은 `"vertical"`로 고정됩니다.
   */
  scrollViewProps: KeyboardAvoidingScrollViewNativeProps;
  /** scroll-view의 마지막 자식 `<view>`에 펼칩니다. 키보드가 열린 동안 이 view의 높이를 늘립니다. */
  spacerProps: KeyboardAvoidingSpacerNativeProps;
}

const lynxKeyboardAvoidingScheduler: KeyboardAvoidingScheduler = {
  scheduleFrame(callback) {
    "background only";

    const frame = requestAnimationFrame(() => {
      "background only";
      void callback();
    });

    return () => {
      "background only";
      cancelAnimationFrame(frame);
    };
  },
  scheduleTimer(callback, delayMs) {
    "background only";

    const timer = setTimeout(() => {
      "background only";
      void callback();
    }, delayMs);

    return () => {
      "background only";
      clearTimeout(timer);
    };
  },
};

/**
 * @platform Lynx
 *
 * 세로 `<scroll-view>` 안의 활성 입력이 소프트 키보드에 가려지지 않도록 하단 spacer와 스크롤 위치를 조정합니다.
 * keyboard 구독, 입력 등록, 측정, 스크롤 예약, 사용자 스크롤 중 자동 이동 중단을 소유합니다.
 *
 * - Lynx 4.0 이후 입력 요소의 `avoid-keyboard`와 함께 쓰지 않습니다. 엔진이 LynxView 자체를 옮겨 회피가 겹칩니다.
 * - 가로 스크롤과 중첩 스크롤, 키보드 툴바 높이, 큰 textarea의 caret 단위 회피는 지원하지 않습니다.
 */
export function useKeyboardAvoidingScrollView(
  props: UseKeyboardAvoidingScrollViewProps = {},
): UseKeyboardAvoidingScrollViewReturn {
  const {
    ref: forwardedRef,
    keyboardGap = 24,
    scrollBehavior = "smooth",
    bindlayoutchange: userBindLayoutChange,
    bindscroll: userBindScroll,
    bindscrollend: userBindScrollEnd,
    bindtouchstart: userBindTouchStart,
    bindtouchend: userBindTouchEnd,
    bindtouchcancel: userBindTouchCancel,
  } = props;
  const scrollRef = useRef<NodesRef | null>(null);
  const spacerRef = useRef<NodesRef | null>(null);
  const keyboardGapRef = useRef(keyboardGap);
  const committedKeyboardGapRef = useRef(keyboardGap);
  const scrollBehaviorRef = useRef(scrollBehavior);
  const touchActiveRef = useRef(false);
  const didScrollDuringTouchRef = useRef(false);

  keyboardGapRef.current = keyboardGap;
  scrollBehaviorRef.current = scrollBehavior;

  const engine = useMemo(
    () =>
      createKeyboardAvoidingEngine<NodesRef>({
        driver: lynxKeyboardAvoidingNativeDriver,
        scheduler: lynxKeyboardAvoidingScheduler,
        getScrollNode: () => scrollRef.current,
        getSpacerNode: () => spacerRef.current,
        getKeyboardGap: () => keyboardGapRef.current,
        getToolbarHeight: () => 0,
        getSmooth: () => scrollBehaviorRef.current === "smooth",
      }),
    [],
  );

  const ref = useMemo<Ref<NodesRef>>(() => {
    if (!forwardedRef) return scrollRef;

    return (node: NodesRef | null) => {
      scrollRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    };
  }, [forwardedRef]);

  const context = useMemo<UseKeyboardAvoidingScrollViewContext>(
    () => ({
      focus(registration) {
        "background only";
        engine.focus(registration);
      },
      blur(owner) {
        "background only";
        engine.blur(owner);
      },
      layoutChanged(owner) {
        "background only";
        engine.layoutChanged(owner);
      },
      unregister(owner) {
        "background only";
        engine.unregister(owner);
      },
    }),
    [engine],
  );

  useEffect(() => {
    const unsubscribe = lynxKeyboardEventSource.subscribe((state) => {
      "background only";
      engine.keyboardChanged(state);
    });

    return () => {
      unsubscribe();
      engine.dispose();
    };
  }, [engine]);

  useEffect(() => {
    if (Object.is(committedKeyboardGapRef.current, keyboardGap)) return;

    committedKeyboardGapRef.current = keyboardGap;
    engine.viewportChanged();
  }, [engine, keyboardGap]);

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

  return useMemo<UseKeyboardAvoidingScrollViewReturn>(
    () => ({
      context,
      scrollViewProps: {
        ref,
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
      context,
      ref,
      handleLayoutChange,
      handleScroll,
      handleScrollEnd,
      handleTouchStart,
      handleTouchEnd,
      handleTouchCancel,
    ],
  );
}
