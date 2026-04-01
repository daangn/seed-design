"use client";

import { useEffect, useRef } from "react";
import {
  isBelowPointerBlockingLayer,
  isInBranch,
  isInNestedLayer,
  type LayerStackContextValue,
} from "./layer-stack";

export interface UsePointerDownOutsideOptions {
  enabled: boolean;
  exclude?: (target: HTMLElement) => boolean;
  onPointerDownOutside: (event: PointerEvent) => void;
}

/**
 * Detects pointer-down events outside a React subtree.
 * Uses `onPointerDownCapture` on the element to distinguish React-tree-inside
 * from DOM-tree-inside (Portal support).
 *
 * Ported from Radix's usePointerDownOutside with layer stack integration.
 */
export function usePointerDownOutside(
  node: HTMLElement | null,
  ctx: LayerStackContextValue,
  options: UsePointerDownOutsideOptions,
): { onPointerDownCapture: () => void } {
  const callbackRef = useRef(options.onPointerDownOutside);
  callbackRef.current = options.onPointerDownOutside;

  const excludeRef = useRef(options.exclude);
  excludeRef.current = options.exclude;

  const isPointerInsideReactTreeRef = useRef(false);
  const handleClickRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!node || !options.enabled) return;

    const ownerDocument = node.ownerDocument ?? document;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target && !isPointerInsideReactTreeRef.current) {
        // Check layer stack conditions
        if (isBelowPointerBlockingLayer(ctx, node)) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }
        if (isInBranch(ctx, target)) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }
        if (isInNestedLayer(ctx, node, target)) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }
        if (excludeRef.current?.(target)) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }

        function handleAndDispatch() {
          callbackRef.current(event);
        }

        // On touch devices, defer to click event because browsers implement
        // a ~350ms delay between touch end and click.
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatch;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatch();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }

      isPointerInsideReactTreeRef.current = false;
    };

    // Delay registration to prevent the mount-triggering pointerdown from
    // being detected as "outside". This is a DOM behavior, not React-specific.
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [node, ctx, options.enabled]);

  return {
    // React synthetic event — fires for React-tree descendants (including Portals).
    onPointerDownCapture: () => {
      isPointerInsideReactTreeRef.current = true;
    },
  };
}
