import { elementProps } from "@seed-design/dom-utils";
import { useMemo, useState } from "react";
import { useAppScreenContext } from "../AppScreen";
import type { UseAppScreenProps } from "../AppScreen/useAppScreen";
import { useElementOffset } from "../private/useElementOffset";

export interface UseAppBarProps extends Pick<UseAppScreenProps, "tone"> {}

export type UseAppBarReturn = ReturnType<typeof useAppBar>;

export function useAppBar(props: UseAppBarProps) {
  const { tone: appBarTone } = props;
  const { stateProps, tone: screenTone } = useAppScreenContext();
  const tone = screenTone ?? appBarTone;

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
      tone,
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
    [stateProps, centeredTitlePaddingX, tone],
  );
}
