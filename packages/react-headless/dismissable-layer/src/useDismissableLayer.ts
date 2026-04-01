"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  addLayer,
  removeLayer,
  isTopMost,
  getPointerEventsEnabled,
  useLayerStackContext,
  LAYER_UPDATE_EVENT,
  type CascadeDismissDetail,
} from "./layer-stack";
import { useEscapeKeydown } from "./use-escape-keydown";
import { usePointerDownOutside } from "./use-pointer-down-outside";
import { useFocusOutside } from "./use-focus-outside";

export interface UseDismissableLayerOptions {
  /**
   * Whether the dismissible layer is active. When false, the layer is not
   * registered in the stack and no event listeners are attached.
   */
  enabled: boolean;

  /**
   * When true, disables pointer events on elements outside this layer.
   * Used for modal overlays (Dialog, BottomSheet).
   */
  blockPointerEvents?: boolean;

  /**
   * Called when escape key is pressed while this layer is topmost.
   * Call `event.preventDefault()` to prevent dismiss.
   */
  onEscapeKeyDown: (event: KeyboardEvent) => void;

  /**
   * Called when a pointer-down occurs outside the layer.
   * Call `event.preventDefault()` to signal that the event is handled.
   */
  onPointerDownOutside: (event: PointerEvent) => void;

  /**
   * Called when focus moves outside the layer.
   * Call `event.preventDefault()` to signal that the event is handled.
   */
  onFocusOutside: (event: FocusEvent) => void;

  /**
   * Called when a parent layer is removed and this layer should close as a consequence.
   * Unlike escape/outside/focus callbacks, this is not preventable.
   */
  onCascadeDismiss: (detail: CascadeDismissDetail) => void;

  /**
   * Custom function to determine if a target should be treated as "inside".
   * Useful for trigger elements that are outside the layer DOM but should
   * not trigger dismiss (e.g., Menu trigger).
   */
  exclude?: (target: HTMLElement) => boolean;
}

const NOOP = () => {};

export function useDismissableLayer(options: UseDismissableLayerOptions) {
  const {
    enabled,
    blockPointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onCascadeDismiss,
    exclude,
  } = options;

  const ctx = useLayerStackContext();
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [, forceRender] = useState({});

  // Callback ref — fires when element mounts/unmounts.
  // Drives `node` state which triggers registration and event listener setup.
  const dismissibleRef = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  // Stable callback refs
  const onCascadeDismissRef = useRef(onCascadeDismiss);
  onCascadeDismissRef.current = onCascadeDismiss;

  const onEscapeKeyDownRef = useRef(onEscapeKeyDown);
  onEscapeKeyDownRef.current = onEscapeKeyDown;

  // -- Layer registration --
  useEffect(() => {
    if (!node || !enabled) return;

    const layer = {
      node,
      dismiss: (detail: CascadeDismissDetail) => onCascadeDismissRef.current?.(detail),
      blockPointerEvents,
    };

    addLayer(ctx, layer);

    return () => {
      removeLayer(ctx, node);
    };
  }, [node, enabled, blockPointerEvents, ctx]);

  // -- Pointer event blocking --
  useEffect(() => {
    if (!node || !enabled || !blockPointerEvents) return;

    const ownerDocument = node.ownerDocument ?? document;
    const hasExistingBlocking = ctx.layers.some((l) => l.blockPointerEvents && l.node !== node);

    const savedPointerEvents = hasExistingBlocking ? null : ownerDocument.body.style.pointerEvents;

    if (savedPointerEvents !== null) {
      ownerDocument.body.style.pointerEvents = "none";
    }

    return () => {
      const remainingBlocking = ctx.layers.filter((l) => l.blockPointerEvents && l.node !== node);
      if (remainingBlocking.length === 0 && savedPointerEvents !== null) {
        ownerDocument.body.style.pointerEvents = savedPointerEvents;
      }
    };
  }, [node, enabled, blockPointerEvents, ctx]);

  // -- Subscribe to layer changes for style updates --
  useEffect(() => {
    if (!enabled) return;
    const handler = () => forceRender({});
    document.addEventListener(LAYER_UPDATE_EVENT, handler);
    return () => document.removeEventListener(LAYER_UPDATE_EVENT, handler);
  }, [enabled]);

  // -- Escape keydown --
  const handleEscapeKeyDown = useCallback((event: KeyboardEvent) => {
    onEscapeKeyDownRef.current?.(event);
  }, []);

  useEscapeKeydown(enabled ? node : null, ctx, handleEscapeKeyDown);

  // -- Pointer down outside --
  const handlePointerDownOutside = useCallback(
    (event: PointerEvent) => {
      onPointerDownOutside(event);
    },
    [onPointerDownOutside],
  );

  const pointerDownOutsideProps = usePointerDownOutside(enabled ? node : null, ctx, {
    enabled,
    exclude,
    onPointerDownOutside: handlePointerDownOutside,
  });

  // -- Focus outside --
  const handleFocusOutside = useCallback(
    (event: FocusEvent) => {
      onFocusOutside(event);
    },
    [onFocusOutside],
  );

  const focusOutsideProps = useFocusOutside(enabled ? node : null, ctx, {
    enabled,
    exclude,
    onFocusOutside: handleFocusOutside,
  });

  // -- Compute pointer-events style --
  const hasBlocking = ctx.layers.some((l) => l.blockPointerEvents);
  const pointerEventsEnabled = node ? getPointerEventsEnabled(ctx, node) : true;

  const style: CSSProperties = hasBlocking
    ? { pointerEvents: pointerEventsEnabled ? "auto" : "none" }
    : {};

  const topLayer = node ? isTopMost(ctx, node) : true;

  if (!enabled) {
    return {
      dismissibleRef,
      dismissibleProps: {
        onPointerDownCapture: NOOP,
        onFocusCapture: NOOP,
        onBlurCapture: NOOP,
      },
      isTopLayer: true,
    };
  }

  return {
    dismissibleRef,
    dismissibleProps: {
      onPointerDownCapture: pointerDownOutsideProps.onPointerDownCapture,
      onFocusCapture: focusOutsideProps.onFocusCapture,
      onBlurCapture: focusOutsideProps.onBlurCapture,
      style,
    },
    isTopLayer: topLayer,
  };
}
