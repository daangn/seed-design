import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface FlexProps extends Omit<BoxProps, "display"> {
  /**
   * @default "flex"
   */
  display?: "flex" | "none";

  /**
   * Shorthand for `flexDirection`.
   */
  direction?: BoxProps["flexDirection"];

  /**
   * Shorthand for `flexWrap`.
   */
  wrap?: BoxProps["flexWrap"];

  /**
   * Shorthand for `alignItems`.
   */
  align?: BoxProps["alignItems"];

  /**
   * Shorthand for `justifyContent`.
   */
  justify?: BoxProps["justifyContent"];

  /**
   * Shorthand for `flexGrow`.
   */
  grow?: BoxProps["flexGrow"];

  /**
   * Shorthand for `flexShrink`.
   */
  shrink?: BoxProps["flexShrink"];
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const { direction, wrap, align, justify, grow, shrink, ...rest } = props;

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={direction}
      flexWrap={wrap}
      alignItems={align}
      justifyContent={justify}
      flexGrow={grow}
      flexShrink={shrink}
      {...rest}
    />
  );
});
