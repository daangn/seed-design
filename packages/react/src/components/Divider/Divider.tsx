import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface DividerProps {
  /**
   * @default "hr"
   */
  as?: "hr" | "div";

  /**
   * @default "stroke.neutral"
   */
  color?: BoxProps["borderColor"];

  /**
   * @default 1
   */
  thickness?: BoxProps["borderBottomWidth"];
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  const { as = "hr", color = "stroke.neutral", thickness = 1, ...rest } = props;

  return (
    <Box
      ref={ref}
      as={as}
      display="block"
      borderColor={color}
      borderWidth={0}
      borderBottomWidth={thickness}
      {...rest}
    />
  );
});
