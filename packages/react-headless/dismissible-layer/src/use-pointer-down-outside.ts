"use client";

import { useEffect, useRef } from "react";
import {
  isBelowPointerBlockingLayer,
  isInBranch,
  isInNestedLayer,
  isTopMost,
  type LayerStackContextValue,
} from "./layer-stack";

export interface UsePointerDownOutsideOptions {
  enabled: boolean;
  exclude?: (target: HTMLElement) => boolean;
  onPressOutside: (event: PointerEvent) => void;

  /**
   * Determines when an outside press triggers dismiss.
   *
   * - `"confirm"` (default): Both mouse and touch defer to the `click` event,
   *   requiring a full press-and-release before dismiss.
   *
   * - `"eager"`: Mouse dismisses on `pointerdown` immediately.
   *   Touch defers to the `click` event to prevent click-through.
   *
   * - `"drag"`: Mouse dismisses on `pointerdown` immediately.
   *   Touch tracks movement and dismisses when the finger moves beyond a
   *   distance threshold (>10px immediate, >5px on touchend).
   *   Suppresses the synthetic click/pointerdown that follows for 1000ms.
   */
  pressBehavior?: "eager" | "confirm" | "drag";
}

interface TouchState {
  startX: number;
  startY: number;
  dismissOnTouchEnd: boolean;
  startedOnExcluded: boolean;
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
  const callbackRef = useRef(options.onPressOutside);
  callbackRef.current = options.onPressOutside;

  const excludeRef = useRef(options.exclude);
  excludeRef.current = options.exclude;

  const pressBehaviorRef = useRef(options.pressBehavior);
  pressBehaviorRef.current = options.pressBehavior;

  const isPointerInsideReactTreeRef = useRef(false);
  const handleClickRef = useRef<() => void>(() => {});

  // Touch drag state (only used in "drag" mode)
  const touchStateRef = useRef<TouchState | null>(null);
  const suppressPointerRef = useRef(false);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!node || !options.enabled) return;

    const ownerDocument = node.ownerDocument ?? document;

    function isOutsideLayer(target: HTMLElement): boolean {
      if (!isTopMost(ctx, node!)) return false;
      if (isBelowPointerBlockingLayer(ctx, node!)) return false;
      if (isInBranch(ctx, target)) return false;
      if (isInNestedLayer(ctx, node!, target)) return false;
      return true;
    }

    function isOutsideTarget(target: HTMLElement): boolean {
      if (!isOutsideLayer(target)) return false;
      if (excludeRef.current?.(target)) return false;
      return true;
    }

    function deferToClick(handleAndDispatch: () => void) {
      ownerDocument.removeEventListener("click", handleClickRef.current);
      handleClickRef.current = handleAndDispatch;
      ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target && !isPointerInsideReactTreeRef.current) {
        if (!isOutsideTarget(target)) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }

        // In drag mode, suppress synthetic pointerdown that follows a touch dismiss.
        if (pressBehaviorRef.current === "drag" && suppressPointerRef.current) {
          isPointerInsideReactTreeRef.current = false;
          return;
        }

        function handleAndDispatch() {
          callbackRef.current(event);
        }

        const behavior = pressBehaviorRef.current ?? "confirm";

        if (behavior === "confirm") {
          // Both mouse and touch defer to click
          deferToClick(handleAndDispatch);
        } else if (behavior === "drag") {
          // Touch is handled by touchstart/move/end listeners.
          // Only process non-touch pointerdown (mouse, pen).
          if (event.pointerType === "touch") {
            isPointerInsideReactTreeRef.current = false;
            return;
          }
          handleAndDispatch();
        } else {
          // "eager" (default): mouse immediate, touch defers to click
          if (event.pointerType === "touch") {
            deferToClick(handleAndDispatch);
          } else {
            handleAndDispatch();
          }
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }

      isPointerInsideReactTreeRef.current = false;
    };

    // -- Touch drag handlers (only active in "drag" mode) --

    const isTouchInsideReactTreeRef = { current: false };

    const handleTouchStartCapture = () => {
      isTouchInsideReactTreeRef.current = true;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (pressBehaviorRef.current !== "drag") return;
      if (isTouchInsideReactTreeRef.current) {
        isTouchInsideReactTreeRef.current = false;
        return;
      }

      const target = event.target as HTMLElement;
      if (!target || !isOutsideLayer(target)) return;

      const touch = event.touches[0];
      if (!touch) return;

      const startedOnExcluded = !!excludeRef.current?.(target);

      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        dismissOnTouchEnd: false,
        startedOnExcluded,
      };

      // Activate click-through guard
      suppressPointerRef.current = true;
      clearTimeout(suppressTimerRef.current);
      suppressTimerRef.current = setTimeout(() => {
        suppressPointerRef.current = false;
        if (touchStateRef.current) {
          touchStateRef.current.dismissOnTouchEnd = false;
        }
      }, 1000);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (pressBehaviorRef.current !== "drag" || !touchStateRef.current) return;

      const target = event.target as HTMLElement;
      if (target && node!.contains(target)) return;

      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - touchStateRef.current.startX);
      const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 5) {
        touchStateRef.current.dismissOnTouchEnd = true;
      }

      if (distance > 10) {
        callbackRef.current(event as unknown as PointerEvent);
        clearTimeout(suppressTimerRef.current);
        suppressTimerRef.current = setTimeout(() => {
          suppressPointerRef.current = false;
        }, 1000);
        touchStateRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      if (pressBehaviorRef.current !== "drag" || !touchStateRef.current) return;

      if (touchStateRef.current.dismissOnTouchEnd) {
        // Drag detected (>5px): dismiss immediately
        callbackRef.current(new PointerEvent("pointerdown"));
        clearTimeout(suppressTimerRef.current);
        suppressTimerRef.current = setTimeout(() => {
          suppressPointerRef.current = false;
        }, 1000);
      } else if (!touchStateRef.current.startedOnExcluded) {
        // Tap (no significant movement): defer to click, like "confirm" mode.
        // Skip if tap started on an excluded target (e.g., trigger) — toggle handles it.
        suppressPointerRef.current = false;
        clearTimeout(suppressTimerRef.current);
        deferToClick(() => callbackRef.current(new PointerEvent("pointerdown")));
      } else {
        // Tap on excluded target — clean up guard without dismissing
        suppressPointerRef.current = false;
        clearTimeout(suppressTimerRef.current);
      }

      touchStateRef.current = null;
    };

    // Delay registration to prevent the mount-triggering pointerdown from
    // being detected as "outside". This is a DOM behavior, not React-specific.
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);

      if (pressBehaviorRef.current === "drag") {
        ownerDocument.addEventListener("touchstart", handleTouchStart);
        ownerDocument.addEventListener("touchmove", handleTouchMove);
        ownerDocument.addEventListener("touchend", handleTouchEnd);
      }
    }, 0);

    // Register capture handler on node for React tree detection
    if (pressBehaviorRef.current === "drag") {
      node.addEventListener("touchstart", handleTouchStartCapture, true);
    }

    return () => {
      window.clearTimeout(timerId);
      clearTimeout(suppressTimerRef.current);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
      ownerDocument.removeEventListener("touchstart", handleTouchStart);
      ownerDocument.removeEventListener("touchmove", handleTouchMove);
      ownerDocument.removeEventListener("touchend", handleTouchEnd);
      node?.removeEventListener("touchstart", handleTouchStartCapture, true);
      touchStateRef.current = null;
      suppressPointerRef.current = false;
    };
  }, [node, ctx, options.enabled]);

  return {
    // React synthetic event — fires for React-tree descendants (including Portals).
    onPointerDownCapture: () => {
      isPointerInsideReactTreeRef.current = true;
    },
  };
}
