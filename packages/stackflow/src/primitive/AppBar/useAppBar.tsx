import { elementProps } from "@seed-design/dom-utils";
import { useMemo, useState } from "react";
import { useAppScreenContext } from "../AppScreen";
import { useElementOffset } from "../private/useElementOffset";

// biome-ignore lint/suspicious/noEmptyInterface: intentionally empty for future extension
export interface UseAppBarProps {}

export type UseAppBarReturn = ReturnType<typeof useAppBar>;

export function useAppBar(_props: UseAppBarProps) {
  const { stateProps } = useAppScreenContext();

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
      stateProps,
      rootProps: elementProps({
        "data-part": "appBar",
        ...stateProps,
        style: {
          "--centered-title-padding-x": centeredTitlePaddingX,
        } as React.CSSProperties,
      }),
    }),
    [stateProps, centeredTitlePaddingX],
  );
}
