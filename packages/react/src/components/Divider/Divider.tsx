import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface DividerProps extends Omit<BoxProps, "display"> {
  /**
   * @default "hr"
   */
  as?: "hr" | "div";

  /**
   * @default "stroke.neutral"
   */
  borderColor?: BoxProps["borderColor"];

  /**
   * @default 1
   */
  borderWidth?: BoxProps["borderWidth"];
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  const { as = "hr", borderColor = "stroke.neutral", borderWidth = 1, ...rest } = props;

  return (
    <Box
      ref={ref}
      as={as}
      display="block"
      borderColor={borderColor}
      borderWidth={borderWidth}
      {...rest}
    />
  );
});
