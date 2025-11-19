import { useState } from "react";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Tracks the border-box sizes of multiple elements using ResizeObserver.
 *
 * Unlike `useSize` from Radix which tracks a single element, this hook
 * efficiently tracks multiple elements without requiring a fixed number
 * of hook calls.
 *
 * Based on @radix-ui/react-use-size but extended for multiple elements.
 *
 * @param elementsMap - A ref to a Map of elements to observe
 * @returns Map of element indices to their sizes
 *
 * @example
 * const sizes = useElementSizesMap(myRefsMap);
 * const width = sizes.get(0)?.width ?? 0;
 */
export function useElementSizesMap(
  elementsMap: React.RefObject<Map<number, HTMLElement | null>>,
): ReadonlyMap<number, ElementSize> {
  const [sizes, setSizes] = useState<Map<number, ElementSize>>(new Map());

  useLayoutEffect(() => {
    const currentElements = elementsMap.current;

    // Provide sizes as early as possible using offsetWidth/Height
    const initialSizes = new Map<number, ElementSize>();
    for (const [index, element] of currentElements.entries()) {
      if (element) {
        initialSizes.set(index, {
          width: element.offsetWidth,
          height: element.offsetHeight,
        });
      }
    }
    setSizes(initialSizes);

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }

      setSizes((prevSizes) => {
        const nextSizes = new Map(prevSizes);

        for (const entry of entries) {
          // Find the index for this observed element
          for (const [index, element] of currentElements.entries()) {
            if (element === entry.target) {
              let width: number;
              let height: number;

              if ("borderBoxSize" in entry) {
                const borderSizeEntry = entry.borderBoxSize;
                // Iron out differences between browsers
                const borderSize = Array.isArray(borderSizeEntry)
                  ? borderSizeEntry[0]
                  : borderSizeEntry;
                width = borderSize.inlineSize;
                height = borderSize.blockSize;
              } else {
                // For browsers that don't support `borderBoxSize`
                // we calculate it ourselves to get the correct border box
                width = element.offsetWidth;
                height = element.offsetHeight;
              }

              nextSizes.set(index, { width, height });
              break;
            }
          }
        }

        return nextSizes;
      });
    });

    // Observe all elements in the map
    for (const element of currentElements.values()) {
      if (element) {
        resizeObserver.observe(element, { box: "border-box" });
      }
    }

    return () => {
      // Unobserve each element individually for cleaner cleanup
      for (const element of currentElements.values()) {
        if (element) {
          resizeObserver.unobserve(element);
        }
      }
    };
  }, []); // Intentionally empty - observer tracks ref changes automatically

  return sizes;
}
