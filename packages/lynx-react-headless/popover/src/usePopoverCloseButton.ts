import { useCallback, useEffect } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { usePopoverContext } from "./usePopoverContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type CloseButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-label" | "accessibility-traits"
>;

export interface UsePopoverCloseButtonProps extends CloseButtonAccessibilityProps {
  /** 닫기보다 먼저 실행됩니다. */
  bindtap?: ViewProps["bindtap"];
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
  "main-thread:bindtouchstart"?: ViewProps["main-thread:bindtouchstart"];
  "main-thread:bindtouchend"?: ViewProps["main-thread:bindtouchend"];
  "main-thread:bindtouchcancel"?: ViewProps["main-thread:bindtouchcancel"];
}

export interface UsePopoverCloseButtonReturn {
  /** 누르고 있는 동안 `true`입니다. */
  pressed: boolean;
  /**
   * CloseButton native view에 펼칩니다. `bindtap`은 사용자 handler를 실행한 뒤 Popover를 닫습니다.
   * `accessibility-element={true}`, `accessibility-traits="button"`을 기본값으로 둡니다.
   */
  closeButtonProps: Omit<UsePressTapReturn, "pressed"> &
    Required<
      Pick<CloseButtonAccessibilityProps, "accessibility-element" | "accessibility-traits">
    > &
    Pick<CloseButtonAccessibilityProps, "accessibility-label">;
}

/**
 * @platform Lynx
 *
 * `PopoverRoot` 안에서 Popover를 닫는 버튼의 tap, 눌림 상태, 접근성 기본값을 제공하는 headless 훅입니다.
 */
export function usePopoverCloseButton(
  props: UsePopoverCloseButtonProps = {},
): UsePopoverCloseButtonReturn {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
  } = props;
  const { setOpen } = usePopoverContext();
  const handleTap = useCallback<TapHandler>(
    (...args) => {
      "background only";
      bindtap?.(...args);
      setOpen(false);
    },
    [bindtap, setOpen],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("PopoverCloseButton requires `accessibility-label` for accessibility.");
    }
  }, [accessibilityElement, accessibilityLabel]);

  return {
    pressed,
    closeButtonProps: {
      ...pressHandlers,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    },
  };
}
