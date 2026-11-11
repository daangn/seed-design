import { useEffect, useMemo, useRef, useState } from "react";

const SAFE_AREA_VARIABLE = "--seed-safe-area-bottom";

function getSafeOffset(rects: DOMRect[], elementHeight: number, safeAreaBottom: number) {
  // If server-side rendering, return 0.
  if (typeof window === "undefined") {
    return 0;
  }

  const viewportHeight = window.innerHeight - safeAreaBottom;
  const sorted = rects
    .filter((rect) => rect.top < viewportHeight)
    .sort((a, b) => b.bottom - a.bottom);

  // If there is no element, Snackbar should be shown at the bottom of the viewport.
  if (sorted.length === 0) {
    return 0;
  }

  const bottomGap = viewportHeight - sorted[0].bottom;

  // If the bottom gap is bigger than the element height,
  // it means that Snackbar can be shown at the bottom of the viewport.
  if (bottomGap > elementHeight) {
    return 0;
  }

  // Otherwise, we should check the gap between elements.
  // If the gap is bigger than the element height, Snackbar can be shown there.
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const gap = current.top - next.bottom;
    if (gap > elementHeight) {
      return viewportHeight - current.top;
    }
  }

  // If there is not enough space between elements,
  // we should check the gap between the top of the viewport and the top of the element.
  if (sorted[sorted.length - 1].top > elementHeight) {
    return viewportHeight - sorted[sorted.length - 1].top;
  }

  // If none of the above conditions are met,
  // fallback to 0.
  return 0;
}

export function useSafeOffset() {
  const [trackedEls, setTrackedEls] = useState<Record<string, Element>>({});
  const [regionHeight, setElementHeight] = useState(0);
  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setElementHeight((entries[0].target as HTMLElement).offsetHeight);
    });
    if (regionRef.current) {
      setElementHeight(regionRef.current.offsetHeight);
      observer.observe(regionRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const safeOffset = useMemo(() => {
    const els = Object.values(trackedEls);
    const rects = els.map((el) => el.getBoundingClientRect());
    const safeAreaBottom = regionRef.current
      ? Number.parseInt(
          getComputedStyle(regionRef.current).getPropertyValue(SAFE_AREA_VARIABLE),
          10,
        )
      : 0;
    return getSafeOffset(rects, regionHeight, safeAreaBottom);
  }, [trackedEls, regionHeight]);

  const overlapTracker = useMemo(
    () => ({
      upsert: (id: string, el: Element) => {
        setTrackedEls((prev) => ({ ...prev, [id]: el }));
      },
      remove: (id: string) => {
        setTrackedEls((prev) => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      },
      forceUpdate: () => {
        setTrackedEls((prev) => ({ ...prev }));
      },
    }),
    [],
  );

  return {
    safeOffset,
    overlapTracker,
    regionRef,
    regionStyle: useMemo(
      () => ({
        [SAFE_AREA_VARIABLE]: "env(safe-area-inset-bottom)",
      }),
      [],
    ),
  };
}
