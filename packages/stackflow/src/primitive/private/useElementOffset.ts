import * as React from "react";

const useLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// `fromLeft`/`fromRight` are measured from the offset parent's content edges: the parent's padding
// carries the safe-area insets, which can move to the other side (a 180° rotation) without resizing
// anything, so a value that included the padding would go stale with no resize to trigger a
// re-measure. The padding-edge pair is what `@seed-design/css` <= 1.2.19 reads, where the parent's
// padding holds no inset.
function measure(element: HTMLElement) {
  const parent = element.offsetParent ?? document.body;
  const { paddingLeft, paddingRight } = getComputedStyle(parent);
  const fromParentLeft = element.offsetLeft + element.offsetWidth;
  const fromParentRight = parent.clientWidth - element.offsetLeft;

  return {
    fromLeft: fromParentLeft - Number.parseFloat(paddingLeft),
    fromRight: fromParentRight - Number.parseFloat(paddingRight),
    fromParentLeft,
    fromParentRight,
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
