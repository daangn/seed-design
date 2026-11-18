import { useContext, useMemo } from "@lynx-js/react";
import { SafeAreaContext } from "@seed-design/lynx-react-use-safe-area";

/**
 * Padding for the dialog positioners. The block padding is the larger of the top and bottom insets
 * on both sides, so the content stays at the viewport's vertical center. Lynx has no `max()`, so
 * it is computed here from the provider's numeric insets. Without a provider, every inset is 0.
 */
export function useDialogSafeAreaStyle() {
  const insets = useContext(SafeAreaContext);

  return useMemo(() => {
    const { top = 0, right = 0, bottom = 0, left = 0 } = insets ?? {};
    const blockInset = `${Math.max(top, bottom)}px`;

    return {
      paddingTop: blockInset,
      paddingRight: `${right}px`,
      paddingBottom: blockInset,
      paddingLeft: `${left}px`,
    };
  }, [insets]);
}
