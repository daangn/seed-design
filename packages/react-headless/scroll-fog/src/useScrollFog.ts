import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ScrollPlacement, SizesConfig, VisibilityState } from "./types";

export interface UseScrollFogProps {
  /**
   * Placement of the fog effect
   * @default ["top", "bottom"]
   */
  placement?: ScrollPlacement[];
  /**
   * Size of the fog effect
   * @default 20
   */
  size?: number;
  /**
   * Custom sizes for each direction
   */
  sizes?: SizesConfig;
  /**
   * Callback when scroll visibility changes
   */
  onVisibilityChange?: (visible: VisibilityState) => void;
}

export type UseScrollFogReturn = ReturnType<typeof useScrollFog>;

export function useScrollFog(props: UseScrollFogProps) {
  const { placement = ["top", "bottom"], size = 20, sizes, onVisibilityChange } = props;

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

  const scrollState = useMemo(
    () => ({
      canScrollTop,
      canScrollBottom,
      canScrollLeft,
      canScrollRight,
    }),
    [canScrollTop, canScrollBottom, canScrollLeft, canScrollRight],
  );

  const getMaskImage = useCallback(() => {
    const hasTop = placement.includes("top");
    const hasBottom = placement.includes("bottom");
    const hasLeft = placement.includes("left");
    const hasRight = placement.includes("right");

    const topSize = sizes?.top ?? size;
    const bottomSize = sizes?.bottom ?? size;
    const leftSize = sizes?.left ?? size;
    const rightSize = sizes?.right ?? size;

    // 2D: vertical + horizontal
    if ((hasTop || hasBottom) && (hasLeft || hasRight)) {
      const topPart =
        hasTop && scrollState.canScrollTop ? `transparent 0px, black ${topSize}px` : "black 0px";
      const bottomPart =
        hasBottom && scrollState.canScrollBottom
          ? `black calc(100% - ${bottomSize}px), transparent 100%`
          : "black 100%";
      const leftPart =
        hasLeft && scrollState.canScrollLeft ? `transparent 0px, black ${leftSize}px` : "black 0px";
      const rightPart =
        hasRight && scrollState.canScrollRight
          ? `black calc(100% - ${rightSize}px), transparent 100%`
          : "black 100%";

      return `linear-gradient(to bottom, ${topPart}, ${bottomPart}), linear-gradient(to right, ${leftPart}, ${rightPart})`;
    }

    // 1D: vertical only
    if (hasTop || hasBottom) {
      const topPart =
        hasTop && scrollState.canScrollTop ? `transparent 0px, black ${topSize}px` : "black 0px";
      const bottomPart =
        hasBottom && scrollState.canScrollBottom
          ? `black calc(100% - ${bottomSize}px), transparent 100%`
          : "black 100%";
      return `linear-gradient(to bottom, ${topPart}, ${bottomPart})`;
    }

    // 1D: horizontal only
    if (hasLeft || hasRight) {
      const leftPart =
        hasLeft && scrollState.canScrollLeft ? `transparent 0px, black ${leftSize}px` : "black 0px";
      const rightPart =
        hasRight && scrollState.canScrollRight
          ? `black calc(100% - ${rightSize}px), transparent 100%`
          : "black 100%";
      return `linear-gradient(to right, ${leftPart}, ${rightPart})`;
    }

    return "none";
  }, [placement, size, sizes, scrollState]);

  return useMemo(
    () => ({
      refs: { root: rootRef },
      rootProps: elementProps({
        ...stateProps,
        style: {
          ...stateProps.style,
          "--fog-mask-image": getMaskImage(),
        } as React.CSSProperties,
      }),
    }),
    [stateProps, getMaskImage],
  );
}
