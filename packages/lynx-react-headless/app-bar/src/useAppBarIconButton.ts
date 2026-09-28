import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";

type ViewProps = IntrinsicElements["view"];
type IconButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-label" | "accessibility-traits"
>;

export interface UseAppBarIconButtonProps extends IconButtonAccessibilityProps {}

export interface UseAppBarIconButtonReturn {
  iconButtonProps: IconButtonAccessibilityProps;
}

/**
 * 아이콘 버튼을 native 접근성 요소로 노출한다. `accessibility-element`는 `true`,
 * `accessibility-traits`는 `"button"`이 기본값이며, 라벨이 없으면 개발 모드에서 경고한다.
 */
export function useAppBarIconButton({
  "accessibility-element": accessibilityElement = true,
  "accessibility-label": accessibilityLabel,
  "accessibility-traits": accessibilityTraits = "button",
}: UseAppBarIconButtonProps = {}): UseAppBarIconButtonReturn {
  if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
    console.warn("AppBarIconButton requires `accessibility-label` for accessibility.");
  }

  return React.useMemo(
    () => ({
      iconButtonProps: {
        "accessibility-element": accessibilityElement,
        "accessibility-label": accessibilityLabel,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [accessibilityElement, accessibilityLabel, accessibilityTraits],
  );
}
