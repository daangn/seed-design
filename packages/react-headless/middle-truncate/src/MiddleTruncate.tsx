"use client";

import * as React from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

export interface MiddleTruncateProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
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
    const canvasRef = useRef<CanvasRenderingContext2D | null>(null);
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

      // Get or create canvas context
      if (!canvasRef.current) {
        const canvas = document.createElement("canvas");
        canvasRef.current = canvas.getContext("2d");
      }
      const ctx = canvasRef.current;
      if (!ctx) return;

      // Copy font from computed style (like react-truncate Truncate.tsx:58-69)
      const style = getComputedStyle(el);
      ctx.font = [style.fontWeight, style.fontStyle, style.fontSize, style.fontFamily].join(" ");
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = style.letterSpacing;
      }

      // Get container width from parent (like react-truncate Truncate.tsx:47-50)
      const lineWidth = el.parentElement
        ? Math.floor(el.parentElement.getBoundingClientRect().width)
        : 0;

      if (lineWidth <= 0) {
        setDisplayText(children);
        onTruncate?.(false);
        return;
      }

      const totalBudget = lineWidth * maxLines;
      const measure = (text: string) => ctx.measureText(text).width;
      const fullWidth = measure(children);

      // Text fits — no truncation needed
      if (fullWidth <= totalBudget) {
        setDisplayText(children);
        onTruncate?.(false);
        return;
      }

      // Need truncation — binary search for optimal start length
      const safeEnd = Math.min(Math.abs(end), children.length);
      const endFragment = safeEnd > 0 ? children.slice(-safeEnd) : "";
      const startSource = safeEnd > 0 ? children.slice(0, -safeEnd) : children;
      const ellipsisWidth = measure(ellipsis);
      const endWidth = measure(endFragment);
      const startBudget = totalBudget - endWidth - ellipsisWidth;

      if (startBudget <= 0) {
        setDisplayText(ellipsis + endFragment);
        onTruncate?.(true);
        return;
      }

      // Binary search (like react-truncate Truncate.tsx:158-173)
      let low = 0;
      let high = startSource.length;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const testWidth = measure(startSource.slice(0, mid));

        if (testWidth <= startBudget) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const startFragment = startSource.slice(0, Math.max(high, 0));
      setDisplayText(startFragment + ellipsis + endFragment);
      onTruncate?.(true);
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
      <span ref={setRefs} {...spanProps}>
        {displayText}
      </span>
    );
  },
);
MiddleTruncate.displayName = "MiddleTruncate";
