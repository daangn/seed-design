import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Provider,
  type Ref,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import {
  createKeyboardAvoidingEngine,
  type KeyboardAvoidancePlacement,
  type KeyboardAvoidingEngine,
  type KeyboardAvoidingScheduler,
} from "./engine.js";
import { lynxKeyboardEventSource } from "./keyboard-event-source.js";
import { lynxKeyboardAvoidingNativeDriver } from "./native-driver.js";
import { mergeStyle } from "./mergeStyle.js";
import { useComposedNodeRef, type NodeRefObject } from "./useComposedNodeRef.js";
import type { UseKeyboardAvoidingScrollViewContext } from "./useKeyboardAvoidingScrollViewContext.js";

type ViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<ViewProps["bindlayoutchange"]>;

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
  /** Root `<view>`와 함께 연결할 ref입니다. */
  ref?: Ref<NodesRef>;
  /** Root `<view>`의 style입니다. 기본 `display`·`flexDirection`보다 사용자 값이 우선합니다. */
  style?: ViewProps["style"];
  /** 사용자 handler를 호출하고 Root 위치·크기 변화에 따른 회피 위치 재계산을 예약합니다. */
  bindlayoutchange?: ViewProps["bindlayoutchange"];
  /**
   * 키보드와 활성 입력 영역 사이에 확보할 간격(px)입니다. Footer가 있으면 Footer와 활성 입력 영역 사이의 간격입니다.
   * @default 24
   */
  keyboardGap?: number;
  /**
   * 회피 위치로 이동할 때 사용할 스크롤 방식입니다.
   * @default "smooth"
   */
  scrollBehavior?: KeyboardAvoidingScrollBehavior;
}

/** Root가 Content·Footer에 내려주는 회피 엔진과 노드입니다. */
export interface KeyboardAvoidingScrollViewRootContextValue {
  engine: KeyboardAvoidingEngine<NodesRef>;
  scrollRef: NodeRefObject;
  spacerRef: NodeRefObject;
  /** Footer를 위로 옮길 거리(px)입니다. 키보드가 Root 아래쪽을 가린 높이와 같습니다. */
  footerOffset: number;
  /** Footer의 첫 위치가 정해졌는지입니다. 그전에는 잘못된 위치가 보이지 않도록 Footer를 숨깁니다. */
  footerPlaced: boolean;
  /** Footer가 자리 잡고 입력이 focus된 다음 업데이트부터 `true`입니다. 그전에는 이동을 애니메이션하지 않습니다. */
  footerTransitionEnabled: boolean;
  /** Footer 안의 입력이 등록할 때 쓰는 Provider 값입니다. 이 입력은 Content를 스크롤하지 않습니다. */
  footerContext: UseKeyboardAvoidingScrollViewContext;
  /** Footer가 mount될 때 호출하고, 반환한 함수를 unmount될 때 호출합니다. */
  registerFooter(): () => void;
}

export interface UseKeyboardAvoidingScrollViewReturn {
  /** Content 안의 입력이 등록할 때 쓰는 Provider 값입니다. 엔진이 살아 있는 동안 같은 객체입니다. */
  context: UseKeyboardAvoidingScrollViewContext;
  rootContext: KeyboardAvoidingScrollViewRootContextValue;
  /** Root `<view>`의 기본 props입니다. style은 사용자 값이 우선하며 layout handler와 ref는 합성됩니다. */
  rootProps: {
    ref: Ref<NodesRef>;
    style: NonNullable<ViewProps["style"]>;
    bindlayoutchange: LayoutChangeHandler;
    flatten: false;
  };
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

function createRegistrationContext(
  engine: KeyboardAvoidingEngine<NodesRef>,
  placement: KeyboardAvoidancePlacement,
  onFocus: () => void,
): UseKeyboardAvoidingScrollViewContext {
  return {
    focus(registration) {
      "background only";
      onFocus();
      engine.focus(placement === "footer" ? { ...registration, placement } : registration);
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
  };
}

const KeyboardAvoidingScrollViewRootContext =
  createContext<KeyboardAvoidingScrollViewRootContextValue | null>(null);

export const KeyboardAvoidingScrollViewRootProvider: Provider<KeyboardAvoidingScrollViewRootContextValue | null> =
  KeyboardAvoidingScrollViewRootContext.Provider;

export function useKeyboardAvoidingScrollViewRootContext(
  part: string,
): KeyboardAvoidingScrollViewRootContextValue {
  const context = useContext(KeyboardAvoidingScrollViewRootContext);
  if (!context) {
    throw new Error(`${part} must be used within a KeyboardAvoidingScrollViewRoot`);
  }
  return context;
}

/**
 * @platform Lynx
 *
 * keyboard 구독, 입력 등록, 측정, 스크롤 예약, 사용자 스크롤 중 자동 이동 중단, Footer 위치를 소유합니다.
 * Content의 `<scroll-view>`는 spacer와 스크롤 위치로, Footer는 키보드가 Root를 가린 높이만큼 위로 이동해 회피합니다.
 */
export function useKeyboardAvoidingScrollView(
  props: UseKeyboardAvoidingScrollViewProps = {},
): UseKeyboardAvoidingScrollViewReturn {
  const {
    ref: forwardedRef,
    style,
    bindlayoutchange: userBindLayoutChange,
    keyboardGap = 24,
    scrollBehavior = "smooth",
  } = props;
  const rootRef = useRef<NodesRef | null>(null);
  const scrollRef = useRef<NodesRef | null>(null);
  const spacerRef = useRef<NodesRef | null>(null);
  const footerCountRef = useRef(0);
  const keyboardGapRef = useRef(keyboardGap);
  const committedKeyboardGapRef = useRef(keyboardGap);
  const scrollBehaviorRef = useRef(scrollBehavior);
  const [footerOffset, setFooterOffset] = useState(0);
  const [footerPlaced, setFooterPlaced] = useState(false);
  const [footerTransitionEnabled, setFooterTransitionEnabled] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  keyboardGapRef.current = keyboardGap;
  scrollBehaviorRef.current = scrollBehavior;

  const engine = useMemo(
    () =>
      createKeyboardAvoidingEngine<NodesRef>({
        driver: lynxKeyboardAvoidingNativeDriver,
        scheduler: lynxKeyboardAvoidingScheduler,
        getRootNode: () => rootRef.current,
        getScrollNode: () => scrollRef.current,
        getSpacerNode: () => spacerRef.current,
        hasFooter: () => footerCountRef.current > 0,
        setFooterOffset,
        onEvaluated: () => {
          "background only";
          // Android의 초기 상태(내비게이션 바 높이)가 오기 전에 놓은 위치는 첫 위치로 보지 않는다.
          if (footerCountRef.current > 0 && lynxKeyboardEventSource.getInitialStateDelay() === 0) {
            setFooterPlaced(true);
          }
        },
        getKeyboardGap: () => keyboardGapRef.current,
        getToolbarHeight: () => 0,
        getSmooth: () => scrollBehaviorRef.current === "smooth",
      }),
    [],
  );

  const ref = useComposedNodeRef(rootRef, forwardedRef);
  const markInputFocused = useCallback(() => {
    "background only";
    setInputFocused(true);
  }, []);
  const context = useMemo(
    () => createRegistrationContext(engine, "content", markInputFocused),
    [engine, markInputFocused],
  );
  const footerContext = useMemo(
    () => createRegistrationContext(engine, "footer", markInputFocused),
    [engine, markInputFocused],
  );

  useEffect(() => {
    const unsubscribe = lynxKeyboardEventSource.subscribe((state) => {
      "background only";
      engine.keyboardChanged(state);
    });
    // 초기 상태가 오지 않는 화면도 대기 시간이 지나면 다시 평가해 Footer를 보이게 한다.
    const initialStateDelay = lynxKeyboardEventSource.getInitialStateDelay();
    const cancelInitialStateWait =
      initialStateDelay > 0
        ? lynxKeyboardAvoidingScheduler.scheduleTimer(() => {
            engine.viewportChanged();
          }, initialStateDelay)
        : null;

    return () => {
      cancelInitialStateWait?.();
      unsubscribe();
      engine.dispose();
    };
  }, [engine]);

  useEffect(() => {
    if (Object.is(committedKeyboardGapRef.current, keyboardGap)) return;

    committedKeyboardGapRef.current = keyboardGap;
    engine.viewportChanged();
  }, [engine, keyboardGap]);

  // 값이 정해진 업데이트에서 transition을 함께 켜면 Lynx 기기에서 첫 위치도 애니메이션된다.
  // 첫 평가가 끝난 다음 업데이트에서 켠다. 입력 focus 전의 이동도 첫 위치로 본다.
  // Lynx Go는 내비게이션 바 높이를 키보드 이벤트로 첫 평가 뒤에 보낼 수 있다.
  useEffect(() => {
    setFooterTransitionEnabled(footerPlaced && inputFocused);
  }, [footerPlaced, inputFocused]);

  const registerFooter = useCallback(() => {
    "background only";

    footerCountRef.current += 1;
    engine.viewportChanged();

    return () => {
      "background only";

      footerCountRef.current -= 1;
      // 다시 mount되는 Footer의 첫 위치도 애니메이션하지 않는다.
      if (footerCountRef.current === 0) setFooterPlaced(false);
      engine.viewportChanged();
    };
  }, [engine]);

  const handleLayoutChange = useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";

      userBindLayoutChange?.(...args);
      engine.viewportChanged();
    },
    [engine, userBindLayoutChange],
  );

  const rootStyle = useMemo(
    () => mergeStyle({ display: "flex", flexDirection: "column" }, style),
    [style],
  );

  const rootContext = useMemo<KeyboardAvoidingScrollViewRootContextValue>(
    () => ({
      engine,
      scrollRef,
      spacerRef,
      footerOffset,
      footerPlaced,
      footerTransitionEnabled,
      footerContext,
      registerFooter,
    }),
    [engine, footerOffset, footerPlaced, footerTransitionEnabled, footerContext, registerFooter],
  );

  return useMemo<UseKeyboardAvoidingScrollViewReturn>(
    () => ({
      context,
      rootContext,
      rootProps: {
        ref,
        style: rootStyle,
        bindlayoutchange: handleLayoutChange,
        flatten: false,
      },
    }),
    [context, rootContext, ref, rootStyle, handleLayoutChange],
  );
}
