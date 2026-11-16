import { elementProps } from "@seed-design/dom-utils";
import * as React from "react";
import { useNextAppScreenContext } from "../NextAppScreen/useNextAppScreenContext";
import { useElementOffset } from "../private/useElementOffset";

const useLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Read by `--app-bar-offset` in the NextAppScreen recipe. */
const ACCESSORY_HEIGHT_VAR = "--app-bar-accessory-height";

export type UseNextAppBarReturn = ReturnType<typeof useNextAppBar>;

/**
 * Writes the accessory's height onto the screen root, where content padding reads it. Written
 * straight from the observer rather than through React state, which would land the content a
 * frame after the accessory resizes.
 */
function useAccessoryHeight(accessory: HTMLElement | null) {
  const screenRoot = useNextAppScreenContext({ strict: false })?.refs.root;

  useLayoutEffect(() => {
    if (!accessory || !screenRoot) return;

    let written: HTMLElement | null = null;

    // The screen root's ref is attached after this child effect runs, so it is read on each
    // write; the observer's first callback still lands before the first paint.
    const write = () => {
      const target = screenRoot.current;
      // A hidden ancestor (an inactive tab, a parked screen) reports 0 without the accessory
      // having shrunk; keeping the last height stops the content jumping when it shows again.
      if (!target || accessory.getClientRects().length === 0) return;

      target.style.setProperty(
        ACCESSORY_HEIGHT_VAR,
        `${accessory.getBoundingClientRect().height}px`,
      );
      written = target;
    };

    write();
    const observer = new ResizeObserver(write);
    observer.observe(accessory);

    return () => {
      observer.disconnect();
      written?.style.removeProperty(ACCESSORY_HEIGHT_VAR);
    };
  }, [accessory, screenRoot]);
}

/**
 * Unlike the legacy AppBar, the NextAppBar is embedded in the screen layer and
 * moves with it as one piece, so it carries no per-screen state attributes —
 * only the centered-title measurement for the cupertino layout and the
 * accessory height for the screen's content offset.
 */
export function useNextAppBar() {
  const [root, rootRef] = React.useState<HTMLElement | null>(null);
  const [left, leftRef] = React.useState<HTMLElement | null>(null);
  const [right, rightRef] = React.useState<HTMLElement | null>(null);
  const [accessory, accessoryRef] = React.useState<HTMLElement | null>(null);

  useAccessoryHeight(accessory);

  const leftOffset = useElementOffset(left);
  const rightOffset = useElementOffset(right);

  // Reported separately rather than as one `Math.max`: the grid in `next-app-bar-main` uses each
  // side as its own floor, so a title that outgrows the centre keeps expanding into whichever
  // side is wider instead of being capped by the narrower one on both edges.
  const centeredTitleLeft = root ? `${leftOffset?.fromLeft ?? 0}px` : "initial";
  const centeredTitleRight = root ? `${rightOffset?.fromRight ?? 0}px` : "initial";

  return React.useMemo(
    () => ({
      refs: {
        root: rootRef,
        left: leftRef,
        right: rightRef,
        accessory: accessoryRef,
      },
      rootProps: elementProps({
        style: {
          "--centered-title-left": centeredTitleLeft,
          "--centered-title-right": centeredTitleRight,
        } as React.CSSProperties,
      }),
    }),
    [centeredTitleLeft, centeredTitleRight],
  );
}
