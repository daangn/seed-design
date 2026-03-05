// Truncation accuracy depends on real browser rendering.
// Visual behavior is verified in Storybook: docs/stories/MiddleTruncate.stories.tsx

"use client";

import type * as React from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";

export interface MiddleTruncateProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * The text content to truncate.
   */
  children: string;

  /**
   * Number of characters to preserve from the end of the text.
   * Useful for keeping file extensions visible.
   *
   * @default 0
   */
  end?: number;

  /**
   * The ellipsis string to display at the truncation point.
   *
   * @default "…"
   */
  ellipsis?: string;

  /**
   * Maximum number of lines before truncation occurs.
   * Assumes `word-break: break-all` styling on the container,
   * where characters fill each line sequentially.
   *
   * @default 1
   */
  maxLines?: number;

  /**
   * Callback fired when truncation state changes.
   */
  onTruncate?: (isTruncated: boolean) => void;
}

export const MiddleTruncate = forwardRef<HTMLSpanElement, MiddleTruncateProps>(
  (
    { children, end = 0, ellipsis = "\u2026", maxLines = 1, onTruncate, ...spanProps },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLSpanElement>(null);
    const [displayText, setDisplayText] = useState(children);

    const setRefs = useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const compute = useCallback(() => {
      const el = innerRef.current;
      if (!el || !children) {
        setDisplayText(children);
        onTruncate?.(false);
        return;
      }

      const parent = el.parentElement;
      if (!parent) return;

      const parentWidth = Math.floor(parent.getBoundingClientRect().width);
      if (parentWidth <= 0) {
        setDisplayText(children);
        onTruncate?.(false);
        return;
      }

      // Use DOM measurement instead of Canvas for accurate multi-line wrapping.
      // Canvas measureText doesn't account for per-line pixel waste at wrap boundaries.
      const cs = getComputedStyle(parent);
      const lineHeight = Number.parseFloat(cs.lineHeight) || Number.parseFloat(cs.fontSize) * 1.2;
      const maxHeight = lineHeight * maxLines;

      const measurer = document.createElement("span");
      measurer.style.cssText = [
        "position:absolute",
        "visibility:hidden",
        "pointer-events:none",
        "white-space:normal",
        "display:block",
        `width:${parentWidth}px`,
        `font:${cs.font}`,
        `letter-spacing:${cs.letterSpacing}`,
        `word-break:${cs.wordBreak}`,
        `line-height:${cs.lineHeight}`,
      ].join(";");
      document.body.appendChild(measurer);

      // Check if full text fits
      measurer.textContent = children;
      if (measurer.scrollHeight <= maxHeight + 1) {
        setDisplayText(children);
        onTruncate?.(false);
        measurer.remove();
        return;
      }

      // Need truncation — binary search with DOM measurement
      const safeEnd = Math.min(Math.abs(end), children.length);
      const endFragment = safeEnd > 0 ? children.slice(-safeEnd) : "";
      const startSource = safeEnd > 0 ? children.slice(0, -safeEnd) : children;

      let low = 0;
      let high = startSource.length;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        measurer.textContent = startSource.slice(0, mid) + ellipsis + endFragment;

        if (measurer.scrollHeight <= maxHeight + 1) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const startFragment = startSource.slice(0, Math.max(high, 0));
      setDisplayText(startFragment + ellipsis + endFragment);
      onTruncate?.(true);
      measurer.remove();
    }, [children, end, ellipsis, maxLines, onTruncate]);

    // Compute on mount and when deps change
    useEffect(() => {
      compute();
    }, [compute]);

    // Recompute on resize via ResizeObserver
    useEffect(() => {
      const el = innerRef.current?.parentElement;
      if (!el) return;

      const ro = new ResizeObserver(() => compute());
      ro.observe(el);
      return () => ro.disconnect();
    }, [compute]);

    return (
      <Primitive.span ref={setRefs} {...spanProps}>
        {displayText}
      </Primitive.span>
    );
  },
);
MiddleTruncate.displayName = "MiddleTruncate";
