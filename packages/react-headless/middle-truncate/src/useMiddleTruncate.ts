// Visual behavior is verified in Storybook: docs/stories/MiddleTruncate.stories.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMiddleTruncateProps {
  /**
   * Number of characters to preserve from the end of the text.
   * @default 0
   */
  end?: number;

  /**
   * @default "…"
   */
  ellipsis?: string;

  /**
   * @default 1
   */
  maxLines?: number;

  onTruncate?: (isTruncated: boolean) => void;
}

export interface UseMiddleTruncateReturn {
  displayText: string | null;
  rootRef: React.RefObject<HTMLElement | null>;
  rootProps: { style: React.CSSProperties };
  registerText: (text: string) => void;
  text: string;
}

export function useMiddleTruncate(props: UseMiddleTruncateProps = {}): UseMiddleTruncateReturn {
  const { end = 0, ellipsis = "…", maxLines = 1, onTruncate } = props;

  const rootRef = useRef<HTMLElement | null>(null);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState<string | null>(null);

  const registerText = useCallback((incoming: string) => {
    setText(incoming);
  }, []);

  const compute = useCallback(() => {
    const root = rootRef.current;
    if (!root || !text) {
      setDisplayText(null);
      onTruncate?.(false);
      return;
    }

    const computed = getComputedStyle(root);

    const contentWidth = Math.floor(
      root.clientWidth -
        (Number.parseFloat(computed.paddingLeft) || 0) -
        (Number.parseFloat(computed.paddingRight) || 0),
    );

    if (contentWidth <= 0) {
      setDisplayText(null);
      onTruncate?.(false);
      return;
    }

    const measurer = document.createElement("span");

    measurer.style.cssText = [
      "position:absolute",
      "visibility:hidden",
      "pointer-events:none",
      "display:block",
      `width:${contentWidth}px`,
      `font:${computed.font}`,
      `letter-spacing:${computed.letterSpacing}`,
      `word-break:${computed.wordBreak}`,
      `line-height:${computed.lineHeight}`,
      "white-space:nowrap",
    ].join(";");
    measurer.textContent = text;
    document.body.appendChild(measurer);

    const lineHeight = measurer.scrollHeight;
    const maxHeight = lineHeight * maxLines;

    measurer.style.whiteSpace = "normal";

    // text fits without truncation
    if (measurer.scrollHeight <= maxHeight + 1) {
      setDisplayText(text);
      onTruncate?.(false);
      measurer.remove();
      return;
    }

    // binary search
    const safeEnd = Math.min(Math.abs(end), text.length);
    const endFragment = safeEnd > 0 ? text.slice(-safeEnd) : "";
    const startSource = safeEnd > 0 ? text.slice(0, -safeEnd) : text;

    // If ellipsis + endFragment alone overflows, reduce endFragment first
    measurer.textContent = ellipsis + endFragment;
    if (measurer.scrollHeight > maxHeight + 1) {
      let eLow = 0;
      let eHigh = endFragment.length;
      while (eLow <= eHigh) {
        const eMid = Math.floor((eLow + eHigh) / 2);
        measurer.textContent = ellipsis + endFragment.slice(-eMid || undefined);
        if (measurer.scrollHeight <= maxHeight + 1) {
          eLow = eMid + 1;
        } else {
          eHigh = eMid - 1;
        }
      }
      const trimmedEnd = eHigh > 0 ? endFragment.slice(-eHigh) : "";
      setDisplayText(ellipsis + trimmedEnd);
      onTruncate?.(true);
      measurer.remove();
      return;
    }

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
  }, [text, end, ellipsis, maxLines, onTruncate]);

  useEffect(() => {
    compute();
  }, [compute]);

  // recompute on resize
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => compute());
    ro.observe(root);

    return () => ro.disconnect();
  }, [compute]);

  const rootProps = {
    style: {
      overflow: "hidden" as const,
      wordBreak: "break-all" as const,
    },
  };

  return {
    displayText,
    rootRef,
    rootProps,
    registerText,
    text,
  };
}
