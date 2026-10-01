import { useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { IntrinsicElements } from "@lynx-js/types";
import { useBottomSheetContext } from "./useBottomSheetContext.js";

type TapHandler = NonNullable<IntrinsicElements["view"]["bindtap"]>;

export interface UseBottomSheetCloseButtonProps {
  /** 시트를 닫은 뒤 호출합니다. */
  bindtap?: TapHandler;
}

export interface UseBottomSheetCloseButtonReturn {
  /** CloseButton native view에 펼칩니다. 렌더 사이에 같은 객체를 유지합니다. */
  closeButtonProps: { bindtap: TapHandler };
}

/**
 * @platform Lynx
 *
 * tap으로 BottomSheet를 닫는 CloseButton props를 제공합니다. `onOpenChange`에는 `"closeButton"`
 * reason을 전달하고, Root의 `skipAnimation`이면 애니메이션 없이 닫습니다.
 */
export function useBottomSheetCloseButton(
  props: UseBottomSheetCloseButtonProps = {},
): UseBottomSheetCloseButtonReturn {
  const { bindtap } = props;
  const { setOpen } = useBottomSheetContext();
  const handleTap = useMemoizedFn<TapHandler>((event, instance) => {
    "background only";
    setOpen(false, { reason: "closeButton" });
    bindtap?.(event, instance);
  });

  return useMemo(() => ({ closeButtonProps: { bindtap: handleTap } }), [handleTap]);
}
