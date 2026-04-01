"use client";

import { useEffect, useRef } from "react";
import { isInBranch, isInNestedLayer, type LayerStackContextValue } from "./layer-stack";

export interface UseFocusOutsideOptions {
  enabled: boolean;
  exclude?: (target: HTMLElement) => boolean;
  onFocusOutside: (event: FocusEvent) => void;
}

/**
 * Detects focus events outside a React subtree.
 * Uses `onFocusCapture`/`onBlurCapture` for React-tree-based detection.
 *
 * Ported from Radix's useFocusOutside with layer stack integration.
 */
export function useFocusOutside(
  node: HTMLElement | null,
  ctx: LayerStackContextValue,
  options: UseFocusOutsideOptions,
): { onFocusCapture: () => void; onBlurCapture: () => void } {
  const callbackRef = useRef(options.onFocusOutside);
  callbackRef.current = options.onFocusOutside;

  const excludeRef = useRef(options.exclude);
  excludeRef.current = options.exclude;

  const isFocusInsideReactTreeRef = useRef(false);

  useEffect(() => {
    if (!node || !options.enabled) return;

    const ownerDocument = node.ownerDocument ?? document;

    const handleFocus = (event: FocusEvent) => {
      const target = event.target;

      if (target && !isFocusInsideReactTreeRef.current) {
        if (isInBranch(ctx, target)) return;
        if (isInNestedLayer(ctx, node, target)) return;
        if (target instanceof HTMLElement && excludeRef.current?.(target)) return;
        callbackRef.current(event);
      }
    };

    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [node, ctx, options.enabled]);

  return {
    onFocusCapture: () => {
      isFocusInsideReactTreeRef.current = true;
    },
    onBlurCapture: () => {
      isFocusInsideReactTreeRef.current = false;
    },
  };
}
