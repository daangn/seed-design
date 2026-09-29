import { useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { IntrinsicElements } from "@lynx-js/types";
import { useBottomSheetContext } from "./useBottomSheetContext.js";

type TapHandler = NonNullable<IntrinsicElements["view"]["bindtap"]>;

export interface UseBottomSheetTriggerProps {
  /** 시트를 연 뒤 호출합니다. */
  bindtap?: TapHandler;
}

export interface UseBottomSheetTriggerReturn {
  /** Trigger native view에 펼칩니다. 렌더 사이에 같은 객체를 유지합니다. */
  triggerProps: { bindtap: TapHandler };
}

/**
 * @platform Lynx
 *
 * tap으로 BottomSheet를 여는 Trigger props를 제공합니다. Root의 `skipAnimation`이면
 * 애니메이션 없이 엽니다.
 */
export function useBottomSheetTrigger(
  props: UseBottomSheetTriggerProps = {},
): UseBottomSheetTriggerReturn {
  const { bindtap } = props;
  const { rootRef, skipAnimation } = useBottomSheetContext();
  const handleTap = useMemoizedFn<TapHandler>((event, instance) => {
    "background only";
    if (skipAnimation) {
      rootRef.current?.open({ animate: false });
    } else {
      rootRef.current?.open();
    }
    bindtap?.(event, instance);
  });

  return useMemo(() => ({ triggerProps: { bindtap: handleTap } }), [handleTap]);
}
