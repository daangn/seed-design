import { useContext, useMemo } from "@lynx-js/react";

import { SafeAreaContext, type UseSafeAreaReturn, useSafeArea } from "../../hooks/useSafeArea";

const toPx = (inset: string) => (inset.endsWith("px") ? Number.parseFloat(inset) : undefined);

/**
 * TODO(next major): remove with the global props and `env()` fallback in `useSafeArea`.
 *
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
 * stays at the viewport's vertical center. With a safe area provider, the larger block inset is
 * computed from its numeric insets.
 */
export function useDialogSafeAreaStyle() {
  const insets = useContext(SafeAreaContext);
  const safeArea = useSafeArea();

  return useMemo(() => {
    if (insets) {
      const blockInset = `${Math.max(insets.top, insets.bottom)}px`;

      return {
        paddingTop: blockInset,
        paddingRight: `${insets.right}px`,
        paddingBottom: blockInset,
        paddingLeft: `${insets.left}px`,
      };
    }

    const blockInset = getBlockInset(safeArea);

    return {
      paddingTop: blockInset,
      paddingRight: safeArea.safeAreaInsetRight,
      paddingBottom: blockInset,
      paddingLeft: safeArea.safeAreaInsetLeft,
    };
  }, [insets, safeArea]);
}
