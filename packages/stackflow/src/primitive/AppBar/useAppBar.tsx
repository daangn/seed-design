import { elementProps } from "@seed-design/dom-utils";
import { useMemo, useState } from "react";
import { useAppScreenContext } from "../AppScreen";
import { useElementOffset } from "../private/useElementOffset";
import { appBarAnatomy } from "./anatomy";

// biome-ignore lint/suspicious/noEmptyInterface: intentionally empty for future extension
export interface UseAppBarProps {}

export type UseAppBarReturn = ReturnType<typeof useAppBar>;

export function useAppBar(_props: UseAppBarProps) {
  const { stateProps } = useAppScreenContext();

  const [left, leftRef] = useState<HTMLElement | null>(null);
  const [right, rightRef] = useState<HTMLElement | null>(null);

  const leftOffset = useElementOffset(left);
  const rightOffset = useElementOffset(right);
  const extents = [leftOffset?.fromLeft, rightOffset?.fromRight].filter(
    (extent) => extent !== undefined,
  );
  // `initial` leaves the variable unset, which the recipe reads as having no area to clear.
  const areaExtent = extents.length > 0 ? `${Math.max(...extents)}px` : "initial";

  return useMemo(
    () => ({
      refs: {
        left: leftRef,
        right: rightRef,
      },
      stateProps,
      rootProps: elementProps({
        "data-part": appBarAnatomy.root,
        ...stateProps,
        style: {
          "--app-bar-area-extent": areaExtent,
        } as React.CSSProperties,
      }),
    }),
    [stateProps, areaExtent],
  );
}
