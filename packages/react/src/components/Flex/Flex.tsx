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
   * If true, flex-wrap will be set to `wrap`.
   */
  wrap?: BoxProps["flexWrap"] | true;

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
   * If true, flex-grow will be set to `1`.
   */
  grow?: BoxProps["flexGrow"] | true;

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
      flexWrap={wrap === true ? "wrap" : wrap}
      alignItems={align}
      justifyContent={justify}
      flexGrow={grow === true ? 1 : grow}
      flexShrink={shrink}
      {...rest}
    />
  );
});
