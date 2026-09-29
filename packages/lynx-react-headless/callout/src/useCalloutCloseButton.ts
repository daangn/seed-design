import { useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { IntrinsicElements } from "@lynx-js/types";
import { useCalloutContext } from "./useCalloutContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type CloseButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-label" | "accessibility-traits"
>;

export interface UseCalloutCloseButtonProps extends CloseButtonAccessibilityProps {
  /** `dismiss`보다 먼저 실행됩니다. */
  bindtap?: ViewProps["bindtap"];
}

export interface UseCalloutCloseButtonReturn {
  /**
   * CloseButton native view에 펼칩니다. `bindtap`은 사용자 handler를 실행한 뒤 `dismiss`를 호출합니다.
   * tap 전파는 막지 않으므로 탭할 수 있는 Root의 `bindtap`도 이어서 실행될 수 있습니다.
   */
  closeButtonProps: Required<
    Pick<CloseButtonAccessibilityProps, "accessibility-element" | "accessibility-traits">
  > &
    Pick<CloseButtonAccessibilityProps, "accessibility-label"> & { bindtap: TapHandler };
}

/**
 * @platform Lynx
 *
 * `CalloutRoot` 안에서 Callout을 닫는 버튼의 tap과 접근성 기본값을 제공하는 headless 훅입니다.
 */
export function useCalloutCloseButton(
  props: UseCalloutCloseButtonProps = {},
): UseCalloutCloseButtonReturn {
  const {
    bindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
  } = props;
  const { dismiss } = useCalloutContext("CalloutCloseButton");
  const handleTap = useMemoizedFn<TapHandler>((event) => {
    "background only";
    bindtap?.(event);
    dismiss();
  });

  if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
    console.warn("CalloutCloseButton requires `accessibility-label` for accessibility.");
  }

  return useMemo(
    () => ({
      closeButtonProps: {
        bindtap: handleTap,
        "accessibility-element": accessibilityElement,
        "accessibility-label": accessibilityLabel,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [handleTap, accessibilityElement, accessibilityLabel, accessibilityTraits],
  );
}
