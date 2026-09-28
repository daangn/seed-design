import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useAppBarContext } from "./useAppBarContext.js";

type LayoutChangeHandler = NonNullable<IntrinsicElements["view"]["bindlayoutchange"]>;
type LayoutChangeEvent = Parameters<LayoutChangeHandler>[0];

/**
 * `layoutchange` 이벤트에서 폭을 읽는다. `detail`, `params`, 이벤트 자체의 `width` 순으로 확인한다.
 * 음수는 0으로 보정하고, 숫자가 아니거나 유한하지 않으면 `null`을 반환한다.
 */
export function getLayoutWidth(event: LayoutChangeEvent): number | null {
  const eventWithWidth = event as LayoutChangeEvent & { width?: number };
  const width = event.detail?.width ?? event.params?.width ?? eventWithWidth.width;
  if (typeof width !== "number" || !Number.isFinite(width)) return null;

  return Math.max(0, width);
}

export interface UseAppBarSideProps {
  side: "left" | "right";
  /** 폭을 기록하기 전에 먼저 호출한다. */
  bindlayoutchange?: LayoutChangeHandler;
}

export interface UseAppBarSideReturn {
  sideProps: { bindlayoutchange: LayoutChangeHandler };
}

export function useAppBarSide({ side, bindlayoutchange }: UseAppBarSideProps): UseAppBarSideReturn {
  const { setLeftWidth, setRightWidth } = useAppBarContext(
    side === "left" ? "AppBarLeft" : "AppBarRight",
  );
  const setWidth = side === "left" ? setLeftWidth : setRightWidth;
  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (event) => {
      bindlayoutchange?.(event);
      const width = getLayoutWidth(event);
      if (width != null) setWidth(width);
    },
    [bindlayoutchange, setWidth],
  );

  return React.useMemo(
    () => ({ sideProps: { bindlayoutchange: handleLayoutChange } }),
    [handleLayoutChange],
  );
}
