"use client";

import { useEffect, useRef } from "react";
import { isTopMost, type LayerStackContextValue } from "./layer-stack";

/**
 * Tracks escape keydown on the document (capture phase).
 * Only fires callback when the given node is the topmost layer.
 */
export function useEscapeKeydown(
  node: HTMLElement | null,
  ctx: LayerStackContextValue,
  onEscapeKeyDown: (event: KeyboardEvent) => void,
) {
  const callbackRef = useRef(onEscapeKeyDown);
  callbackRef.current = onEscapeKeyDown;

  useEffect(() => {
    if (!node) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.isComposing) return;
      if (!isTopMost(ctx, node)) return;
      callbackRef.current(event);
    };

    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, [node, ctx]);
}
