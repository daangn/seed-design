import { runOnBackground, useEffect, useMemo, useState } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { BaseTouchEvent, EventHandler, IntrinsicElements, Target } from "@lynx-js/types";

type MainThreadBindtap = IntrinsicElements["view"]["main-thread:bindtap"];
type MainThreadTouchHandler = NonNullable<IntrinsicElements["view"]["main-thread:bindtouchstart"]>;

type TouchHandler = EventHandler<BaseTouchEvent<Target>>;
type PressStateHandler = TouchHandler & (() => void);

export interface UsePressTapOptions {
  disabled?: boolean;
  onTap?: TouchHandler;
  mainThreadOnTap?: MainThreadBindtap;
  /**
   * 소비자의 `main-thread:bindtouchstart`입니다. 이 handler를 실행한 뒤 눌림 상태 갱신을 Background로
   * 넘기는 합성 handler를 반환합니다. native는 같은 이벤트의 Background·Main Thread handler를 모두
   * 실행하지만 `@lynx-js/react/testing-library`는 한 key에 덮어쓰므로, 합성 handler로 두 환경의
   * 눌림 상태를 맞춥니다.
   */
  mainThreadOnTouchStart?: MainThreadTouchHandler;
  /** 소비자의 `main-thread:bindtouchend`입니다. 합성 방식은 `mainThreadOnTouchStart`와 같습니다. */
  mainThreadOnTouchEnd?: MainThreadTouchHandler;
  /** 소비자의 `main-thread:bindtouchcancel`입니다. 합성 방식은 `mainThreadOnTouchStart`와 같습니다. */
  mainThreadOnTouchCancel?: MainThreadTouchHandler;
}

export interface UsePressTapReturn {
  pressed: boolean;
  bindtap: TouchHandler;
  bindtouchstart: PressStateHandler;
  bindtouchend: PressStateHandler;
  bindtouchcancel: PressStateHandler;
  "main-thread:bindtap"?: MainThreadBindtap;
  "main-thread:bindtouchstart"?: MainThreadTouchHandler;
  "main-thread:bindtouchend"?: MainThreadTouchHandler;
  "main-thread:bindtouchcancel"?: MainThreadTouchHandler;
}

/**
 * Hook that provides press/tap interaction state for Lynx elements.
 *
 * - Tracks `pressed` state via touch events.
 * - When `disabled` is true, the element cannot become active and no tap fires.
 * - If the element becomes disabled during a press, the active state is cleared.
 * - `main-thread:bindtap` is included only when `mainThreadOnTap` is provided. It stays bound while
 *   disabled and skips the consumer handler, because ReactLynx re-registers a removed Main Thread
 *   handler as an empty worklet instead of unbinding it.
 * - `main-thread:bindtouch*` is included only when the matching consumer handler is provided.
 *   It runs the consumer handler first, then forwards the press state update to Background.
 */
export function usePressTap(options: UsePressTapOptions = {}): UsePressTapReturn {
  const {
    disabled = false,
    onTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  } = options;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (disabled) setPressed(false);
  }, [disabled]);

  const press = useMemoizedFn(() => {
    "background only";
    if (disabled) return;
    setPressed(true);
  });

  const reset = useMemoizedFn(() => {
    "background only";
    setPressed(false);
  });

  const handleTap = useMemoizedFn((...args: Parameters<TouchHandler>) => {
    "background only";
    if (disabled) return;
    setPressed(false);
    onTap?.(...args);
  });

  const mainThreadTap = useMemo<MainThreadBindtap>(
    () =>
      mainThreadOnTap
        ? (event) => {
            "main thread";
            if (disabled) return;
            mainThreadOnTap(event);
          }
        : undefined,
    [disabled, mainThreadOnTap],
  );

  const result: UsePressTapReturn = {
    pressed: !disabled && pressed,
    bindtap: handleTap,
    bindtouchstart: press,
    bindtouchend: reset,
    bindtouchcancel: reset,
    ...(mainThreadTap ? { "main-thread:bindtap": mainThreadTap } : {}),
  };

  if (mainThreadOnTouchStart) {
    result["main-thread:bindtouchstart"] = (event) => {
      "main thread";
      mainThreadOnTouchStart(event);
      runOnBackground(press)();
    };
  }
  if (mainThreadOnTouchEnd) {
    result["main-thread:bindtouchend"] = (event) => {
      "main thread";
      mainThreadOnTouchEnd(event);
      runOnBackground(reset)();
    };
  }
  if (mainThreadOnTouchCancel) {
    result["main-thread:bindtouchcancel"] = (event) => {
      "main thread";
      mainThreadOnTouchCancel(event);
      runOnBackground(reset)();
    };
  }

  return result;
}
