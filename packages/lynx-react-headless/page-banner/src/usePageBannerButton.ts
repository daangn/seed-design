import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";

type ViewProps = IntrinsicElements["view"];
type ButtonAccessibilityProps = Pick<ViewProps, "accessibility-element" | "accessibility-traits">;

export interface UsePageBannerButtonProps extends ButtonAccessibilityProps {}

export interface UsePageBannerButtonReturn {
  /**
   * Button native element에 펼칩니다. `accessibility-element={true}`, `accessibility-traits="button"`
   * 기본값을 포함합니다. Root tap과 분리하려면 최종 props에 `getIndependentActionProps`를 적용합니다.
   */
  buttonProps: Required<ButtonAccessibilityProps>;
}

/**
 * @platform Lynx
 *
 * PageBanner 안에서 Root와 독립적으로 실행되는 Button의 접근성 기본값을 제공하는 headless 훅입니다.
 */
export function usePageBannerButton(
  props: UsePageBannerButtonProps = {},
): UsePageBannerButtonReturn {
  const {
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
  } = props;

  return useMemo(
    () => ({
      buttonProps: {
        "accessibility-element": accessibilityElement,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [accessibilityElement, accessibilityTraits],
  );
}
