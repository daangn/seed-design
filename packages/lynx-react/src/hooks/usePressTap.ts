import { useState } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { BaseTouchEvent, EventHandler, Target } from "@lynx-js/types";

import type { LynxTouchProps } from "../types";

type TouchHandler = EventHandler<BaseTouchEvent<Target>>;
type PressStateHandler = TouchHandler & (() => void);

export interface UsePressTapOptions {
  disabled?: boolean;
  onTap?: TouchHandler;
  mainThreadOnTap?: LynxTouchProps["main-thread:bindtap"];
}

export interface UsePressTapReturn {
  pressed: boolean;
  bindtap: TouchHandler;
  bindtouchstart: PressStateHandler;
  bindtouchend: PressStateHandler;
  bindtouchcancel: PressStateHandler;
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

  const handleTap = useMemoizedFn((...args: Parameters<TouchHandler>) => {
    if (disabled) return;
    setPressed(false);
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
