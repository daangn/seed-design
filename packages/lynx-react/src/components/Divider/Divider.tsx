import * as React from "@lynx-js/react";

import type { LynxAccessibilityProps, LynxStyledElementProps } from "../../types";
import type { StyleProps } from "../../utils/styled";
import { Box } from "../Box";

export interface DividerProps
  extends Omit<LynxStyledElementProps, "children">,
    LynxAccessibilityProps {
  /**
   * @default "stroke.neutralMuted"
   */
  color?: StyleProps["borderColor"];

  /**
   * @default 1
   */
  thickness?: StyleProps["borderWidth"];

  /**
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Adds 16px of spacing to both ends of the divider.
   * @default false
   */
  inset?: boolean;
}

/**
 * @platform Lynx
 *
 * 웹의 `<hr>` 대신 native `<view>`를 렌더링합니다. 구분선은 기본적으로 접근성
 * 요소로 노출되며 `accessibility-role-description="separator"`를 사용합니다.
 * 장식용 구분선은 `accessibility-element={false}`로 접근성 트리에서 제외하세요.
 */
export const Divider = React.forwardRef<unknown, DividerProps>((props, ref) => {
  const {
    color = "stroke.neutralMuted",
    thickness = 1,
    orientation = "horizontal",
    inset = false,
    style,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "separator",
    ...nativeProps
  } = props;

  const isHorizontal = orientation === "horizontal";

  return (
    <Box
      {...nativeProps}
      ref={ref}
      borderColor={color}
      borderWidth={0}
      borderBottomWidth={isHorizontal ? thickness : 0}
      borderRightWidth={isHorizontal ? 0 : thickness}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      style={{
        width: isHorizontal ? (inset ? "calc(100% - 32px)" : "100%") : undefined,
        height: isHorizontal ? undefined : inset ? "calc(100% - 32px)" : "100%",
        marginLeft: inset && isHorizontal ? "16px" : undefined,
        marginRight: inset && isHorizontal ? "16px" : undefined,
        marginTop: inset && !isHorizontal ? "16px" : undefined,
        marginBottom: inset && !isHorizontal ? "16px" : undefined,
        ...style,
      }}
    />
  );
});

Divider.displayName = "Divider";
