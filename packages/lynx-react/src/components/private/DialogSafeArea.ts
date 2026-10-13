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
 * Custom properties the dialog positioner recipes read for their padding and default width.
 * `--dialog-safe-area-block` may hold a `calc()`, which Lynx resolves only when a declaration
 * uses the variable on its own, not inside another `calc()`.
 */
export function useDialogSafeAreaStyle() {
  const safeArea = useSafeArea();

  return useMemo(
    () => ({
      "--seed-safe-area-left": safeArea.safeAreaInsetLeft,
      "--seed-safe-area-right": safeArea.safeAreaInsetRight,
      "--dialog-safe-area-block": getBlockInset(safeArea),
    }),
    [safeArea],
  );
}
