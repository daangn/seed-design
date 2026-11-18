import { useState } from "react";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";

import type { ElementSize } from "./useElementSizesMap";

const isRendered = (element: HTMLElement) => element.getClientRects().length > 0;

/**
 * `@radix-ui/react-use-size`와 같지만, 요소가 렌더되지 않은 동안(조상이 `display: none`)의
 * 측정값은 버리고 마지막 값을 유지한다. 0을 그대로 쓰면 다시 보일 때 0에서 transition된다.
 */
export function useRenderedSize(element: HTMLElement | null) {
  const [size, setSize] = useState<ElementSize | undefined>(undefined);

  useLayoutEffect(() => {
    if (!element) {
      setSize(undefined);
      return;
    }

    if (isRendered(element)) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (!isRendered(element)) return;

      const borderSize = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;

      setSize(
        borderSize
          ? { width: borderSize.inlineSize, height: borderSize.blockSize }
          : { width: element.offsetWidth, height: element.offsetHeight },
      );
    });

    resizeObserver.observe(element, { box: "border-box" });
    return () => resizeObserver.unobserve(element);
  }, [element]);

  return size;
}
