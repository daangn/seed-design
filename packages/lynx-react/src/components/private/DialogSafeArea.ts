import { useMemo } from "@lynx-js/react";

import { type UseSafeAreaReturn, useSafeArea } from "../../hooks/useSafeArea";

const toPx = (inset: string) => (inset.endsWith("px") ? Number.parseFloat(inset) : undefined);

/**
 * Lynx has no `max()`, so the larger block inset is picked here when both are numbers. An `env()`
 * fallback can't be compared, so the sum stands in: it equals the larger inset while the other
 * side is 0 and otherwise clears more than needed rather than overlapping either inset.
 */
function getBlockInset({ safeAreaInsetTop, safeAreaInsetBottom }: UseSafeAreaReturn) {
  const top = toPx(safeAreaInsetTop);
  const bottom = toPx(safeAreaInsetBottom);
  if (top === undefined || bottom === undefined)
    return `calc(${safeAreaInsetTop} + ${safeAreaInsetBottom})`;

  return `${Math.max(top, bottom)}px`;
}

/**
 * Padding for the dialog positioners. The block padding is the same on both sides, so the content
 * stays at the viewport's vertical center.
 */
export function useDialogSafeAreaStyle() {
  const safeArea = useSafeArea();

  return useMemo(() => {
    const blockInset = getBlockInset(safeArea);

    return {
      paddingTop: blockInset,
      paddingRight: safeArea.safeAreaInsetRight,
      paddingBottom: blockInset,
      paddingLeft: safeArea.safeAreaInsetLeft,
    };
  }, [safeArea]);
}
