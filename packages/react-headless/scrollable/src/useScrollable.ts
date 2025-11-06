import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useEffect, useMemo, useRef, useState } from "react";

type ScrollPlacement = "top" | "bottom" | "left" | "right";

interface VisibilityState {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface UseScrollableProps {
  /**
   * Placement of scroll detection
   * @default ["top", "bottom"]
   */
  placement?: ScrollPlacement[];
  /**
   * Callback when scroll visibility changes
   */
  onVisibilityChange?: (visible: VisibilityState) => void;
}

export type UseScrollableReturn = ReturnType<typeof useScrollable>;

export function useScrollable(props: UseScrollableProps) {
  const { placement = ["top", "bottom"], onVisibilityChange } = props;

  // Root element ref
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Scroll state for each direction
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // onScroll + ResizeObserver
  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const handleScroll = () => {
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
        rootEl;

      // Vertical scroll
      if (placement.includes("top") || placement.includes("bottom")) {
        const hasVerticalScroll = scrollHeight > clientHeight;
        if (hasVerticalScroll) {
          const isAtTop = scrollTop === 0;
          const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
          setCanScrollTop(!isAtTop && placement.includes("top"));
          setCanScrollBottom(!isAtBottom && placement.includes("bottom"));
        } else {
          setCanScrollTop(false);
          setCanScrollBottom(false);
        }
      } else {
        setCanScrollTop(false);
        setCanScrollBottom(false);
      }

      // Horizontal scroll
      if (placement.includes("left") || placement.includes("right")) {
        const hasHorizontalScroll = scrollWidth > clientWidth;
        if (hasHorizontalScroll) {
          const isAtLeft = scrollLeft === 0;
          const isAtRight = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1;
          setCanScrollLeft(!isAtLeft && placement.includes("left"));
          setCanScrollRight(!isAtRight && placement.includes("right"));
        } else {
          setCanScrollLeft(false);
          setCanScrollRight(false);
        }
      } else {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    };

    handleScroll(); // Initial check
    rootEl?.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(rootEl);

    return () => {
      rootEl.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [placement]);

  // Notify visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange({
        top: canScrollTop,
        bottom: canScrollBottom,
        left: canScrollLeft,
        right: canScrollRight,
      });
    }
  }, [canScrollTop, canScrollBottom, canScrollLeft, canScrollRight, onVisibilityChange]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-scrollable-top": dataAttr(canScrollTop),
        "data-scrollable-bottom": dataAttr(canScrollBottom),
        "data-scrollable-left": dataAttr(canScrollLeft),
        "data-scrollable-right": dataAttr(canScrollRight),
      }),
    [canScrollTop, canScrollBottom, canScrollLeft, canScrollRight],
  );

  return useMemo(
    () => ({
      refs: { root: rootRef },
      rootProps: elementProps({
        ...stateProps,
        style: {
          "--scrollable-top": canScrollTop ? "1" : "0",
          "--scrollable-bottom": canScrollBottom ? "1" : "0",
          "--scrollable-left": canScrollLeft ? "1" : "0",
          "--scrollable-right": canScrollRight ? "1" : "0",
        } as React.CSSProperties,
      }),
    }),
    [stateProps, canScrollTop, canScrollBottom, canScrollLeft, canScrollRight],
  );
}
