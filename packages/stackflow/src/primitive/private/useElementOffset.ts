import * as React from "react";

const useLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Measured from the offset parent's content edges: the parent's padding carries the safe-area
// insets, which can move to the other side (a 180° rotation) without resizing anything, so a value
// that included the padding would go stale with no resize to trigger a re-measure.
function measure(element: HTMLElement) {
  const parent = element.offsetParent ?? document.body;
  const { paddingLeft, paddingRight } = getComputedStyle(parent);

  return {
    fromLeft: element.offsetLeft + element.offsetWidth - Number.parseFloat(paddingLeft),
    fromRight: parent.clientWidth - Number.parseFloat(paddingRight) - element.offsetLeft,
  };
}

export function useElementOffset(element: HTMLElement | null) {
  const [offset, setOffset] = React.useState<ReturnType<typeof measure> | undefined>(undefined);

  useLayoutEffect(() => {
    if (!element) {
      setOffset(undefined);
      return;
    }

    // provide as early as possible
    setOffset(measure(element));

    const resizeObserver = new ResizeObserver(() => setOffset(measure(element)));
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [element]);

  return offset;
}
