import { useState } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";

import type { LynxTouchProps } from "../types";

type TapHandler = NonNullable<LynxTouchProps["bindtap"]>;
type TouchStartHandler = NonNullable<LynxTouchProps["bindtouchstart"]>;
type TouchEndHandler = NonNullable<LynxTouchProps["bindtouchend"]>;
type TouchCancelHandler = NonNullable<LynxTouchProps["bindtouchcancel"]>;

export interface UsePressTapOptions {
  disabled?: boolean;
  onTap?: LynxTouchProps["bindtap"];
  mainThreadOnTap?: LynxTouchProps["main-thread:bindtap"];
}

export interface UsePressTapReturn {
  pressed: boolean;
  bindtap: TapHandler;
  bindtouchstart: TouchStartHandler;
  bindtouchend: TouchEndHandler;
  bindtouchcancel: TouchCancelHandler;
  "main-thread:bindtap"?: LynxTouchProps["main-thread:bindtap"];
}

/**
 * Hook that provides press/tap interaction state for Lynx elements.
 *
 * - Tracks `pressed` state via touch events.
 * - When `disabled` is true, the element cannot become active and no tap fires.
 * - If the element becomes disabled during a press, the active state is cleared.
 * - `main-thread:bindtap` is conditionally included (only when enabled and provided).
 */
export function usePressTap(options: UsePressTapOptions = {}): UsePressTapReturn {
  const { disabled = false, onTap, mainThreadOnTap } = options;
  const [pressed, setPressed] = useState(false);

  const press = useMemoizedFn(() => {
    if (disabled) return;
    setPressed(true);
  });

  const reset = useMemoizedFn(() => {
    setPressed(false);
  });

  const handleTap = useMemoizedFn((...args: Parameters<TapHandler>) => {
    if (disabled) return;
    onTap?.(...args);
  });

  return {
    pressed,
    bindtap: handleTap,
    bindtouchstart: press,
    bindtouchend: reset,
    bindtouchcancel: reset,
    ...(!disabled && mainThreadOnTap ? { "main-thread:bindtap": mainThreadOnTap } : {}),
  };
}
