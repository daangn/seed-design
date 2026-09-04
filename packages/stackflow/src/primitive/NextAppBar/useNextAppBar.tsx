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

  // Reported separately rather than as one `Math.max`: the grid in `next-app-bar-main` uses each
  // side as its own floor, so a title that outgrows the centre keeps expanding into whichever
  // side is wider instead of being capped by the narrower one on both edges.
  const centeredTitleLeft = root ? `${leftOffset?.fromLeft ?? 0}px` : "initial";
  const centeredTitleRight = root ? `${rightOffset?.fromRight ?? 0}px` : "initial";

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
          "--centered-title-left": centeredTitleLeft,
          "--centered-title-right": centeredTitleRight,
        } as React.CSSProperties,
      }),
    }),
    [centeredTitleLeft, centeredTitleRight],
  );
}
