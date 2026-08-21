import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTouchProps,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { KeyboardAvoidanceActionsContext, type KeyboardAvoidanceActions } from "./context";
import { createKeyboardAvoidingEngine, type KeyboardAvoidingScheduler } from "./engine";
import { lynxKeyboardEventSource } from "./keyboard-event-source";
import { lynxKeyboardAvoidingNativeDriver } from "./native-driver";

type NativeScrollViewProps = IntrinsicElements["scroll-view"];
type LayoutChangeHandler = NonNullable<NativeScrollViewProps["bindlayoutchange"]>;
type ScrollHandler = NonNullable<NativeScrollViewProps["bindscroll"]>;
type ScrollEndHandler = NonNullable<NativeScrollViewProps["bindscrollend"]>;
type TouchStartHandler = NonNullable<NativeScrollViewProps["bindtouchstart"]>;
type TouchEndHandler = NonNullable<NativeScrollViewProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<NativeScrollViewProps["bindtouchcancel"]>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

export type KeyboardAvoidingScrollBehavior = "smooth" | "instant";

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

const spacerProps = {
  "accessibility-elements-hidden": true,
  flatten: false,
} satisfies LynxViewProps;

/**
 * @platform Lynx
 *
 * 세로 `<scroll-view>` 안의 활성 입력 요소가 키보드에 가려지지 않도록 한다.
 * `TextField.Input`과 `TextField.Textarea`는 focus 시 자동으로 이 컴포넌트에 등록된다.
 *
 * 현재 미지원 기능:
 * - 가로 스크롤과 중첩 스크롤
 * - 키보드 툴바 높이 반영
 * - 큰 Textarea의 caret 단위 회피
 */
export interface KeyboardAvoidingScrollViewProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxTouchProps {
  id?: NativeScrollViewProps["id"];
  hidden?: NativeScrollViewProps["hidden"];
  focusable?: NativeScrollViewProps["focusable"];
  bounces?: NativeScrollViewProps["bounces"];
  "enable-scroll"?: NativeScrollViewProps["enable-scroll"];
  "scroll-bar-enable"?: NativeScrollViewProps["scroll-bar-enable"];
  "upper-threshold"?: NativeScrollViewProps["upper-threshold"];
  "lower-threshold"?: NativeScrollViewProps["lower-threshold"];
  "initial-scroll-offset"?: NativeScrollViewProps["initial-scroll-offset"];
  "initial-scroll-to-index"?: NativeScrollViewProps["initial-scroll-to-index"];
  bindlayoutchange?: NativeScrollViewProps["bindlayoutchange"];
  bindscrolltoupper?: NativeScrollViewProps["bindscrolltoupper"];
  bindscrolltolower?: NativeScrollViewProps["bindscrolltolower"];
  bindscroll?: NativeScrollViewProps["bindscroll"];
  bindscrollend?: NativeScrollViewProps["bindscrollend"];
  bindcontentsizechanged?: NativeScrollViewProps["bindcontentsizechanged"];
  /** 키보드와 활성 입력 요소 사이에 확보할 간격(px). @defaultValue 24 */
  keyboardGap?: number;
  /** 회피 위치로 이동할 때 사용할 스크롤 방식. @defaultValue "smooth" */
  scrollBehavior?: KeyboardAvoidingScrollBehavior;
}

export const KeyboardAvoidingScrollView: LynxForwardRefComponent<
  NodesRef,
  KeyboardAvoidingScrollViewProps
> = forwardRef<NodesRef, KeyboardAvoidingScrollViewProps>((props, forwardedRef) => {
  const {
    children,
    keyboardGap = 24,
    scrollBehavior = "smooth",
    bindlayoutchange: userBindLayoutChange,
    bindscroll: userBindScroll,
    bindscrollend: userBindScrollEnd,
    bindtouchstart: userBindTouchStart,
    bindtouchend: userBindTouchEnd,
    bindtouchcancel: userBindTouchCancel,
    ...nativeProps
  } = props;
  const scrollRef = useRef<NodesRef>(null);
  const spacerRef = useRef<NodesRef>(null);
  const keyboardGapRef = useRef(keyboardGap);
  const committedKeyboardGapRef = useRef(keyboardGap);
  const scrollBehaviorRef = useRef(scrollBehavior);
  const touchActiveRef = useRef(false);
  const didScrollDuringTouchRef = useRef(false);

  keyboardGapRef.current = keyboardGap;
  scrollBehaviorRef.current = scrollBehavior;

  const engine = useMemo(
    () =>
      createKeyboardAvoidingEngine({
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

  const mergedRef = useCallback(
    (node: NodesRef | null) => {
      "background only";

      scrollRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const actions = useMemo<KeyboardAvoidanceActions>(
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

  return (
    <KeyboardAvoidanceActionsContext.Provider value={actions}>
      <scroll-view
        {...nativeProps}
        ref={mergedRef}
        scroll-orientation="vertical"
        flatten={false}
        bindlayoutchange={handleLayoutChange}
        bindtouchstart={handleTouchStart}
        bindtouchend={handleTouchEnd}
        bindtouchcancel={handleTouchCancel}
        bindscroll={handleScroll}
        bindscrollend={handleScrollEnd}
      >
        {children}
        <view
          {...({ ref: spacerRef as LynxViewRef } as Record<string, unknown>)}
          {...spacerProps}
        />
      </scroll-view>
    </KeyboardAvoidanceActionsContext.Provider>
  );
});
KeyboardAvoidingScrollView.displayName = "KeyboardAvoidingScrollView";
