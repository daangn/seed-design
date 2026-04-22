import { useState } from "@lynx-js/react";
import type { TouchEvent } from "@lynx-js/types";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";

export interface UsePressTapOptions {
  disabled?: boolean;
  onTap?: () => void;
  mainThreadOnTap?: () => void;
}

export interface UsePressTapReturn {
  pressed: boolean;
  bindtap: (e: TouchEvent) => void;
  bindtouchstart: (e: TouchEvent) => void;
  bindtouchend: (e: TouchEvent) => void;
  bindtouchcancel: (e: TouchEvent) => void;
  "main-thread:bindtap"?: () => void;
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

  const handleTap = useMemoizedFn(() => {
    if (disabled) return;
    onTap?.();
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
