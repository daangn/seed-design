import { elementProps } from "@seed-design/dom-utils";
import { useMemo, useState } from "react";
import { useElementOffset } from "../private/useElementOffset";
import { nextAppBarAnatomy } from "./anatomy";

// biome-ignore lint/suspicious/noEmptyInterface: intentionally empty for future extension
export interface UseNextAppBarProps {}

export type UseNextAppBarReturn = ReturnType<typeof useNextAppBar>;

/**
 * Unlike the legacy AppBar, the NextAppBar is embedded in the screen layer and
 * moves with it as one piece, so it carries no per-screen state attributes —
 * only the centered-title measurement for the cupertino layout.
 */
export function useNextAppBar(_props: UseNextAppBarProps) {
  const [root, rootRef] = useState<HTMLElement | null>(null);
  const [left, leftRef] = useState<HTMLElement | null>(null);
  const [right, rightRef] = useState<HTMLElement | null>(null);

  const leftOffset = useElementOffset(left);
  const rightOffset = useElementOffset(right);
  const centeredTitlePaddingX = root
    ? `${Math.max(leftOffset?.fromLeft ?? 0, rightOffset?.fromRight ?? 0)}px`
    : "initial";

  return useMemo(
    () => ({
      refs: {
        root: rootRef,
        left: leftRef,
        right: rightRef,
      },
      rootProps: elementProps({
        "data-part": nextAppBarAnatomy.root,
        style: {
          "--centered-title-padding-x": centeredTitlePaddingX,
        } as React.CSSProperties,
      }),
    }),
    [centeredTitlePaddingX],
  );
}
