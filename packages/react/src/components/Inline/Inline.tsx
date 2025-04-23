import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

/**
 * @deprecated Use `HStack` instead.
 */
export interface InlineProps extends Omit<BoxProps, "display" | "direction" | "flexWrap"> {}

/**
 * @deprecated Use `HStack` instead.
 */
export const Inline = React.forwardRef<HTMLDivElement, InlineProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="flex-start"
      justifyContent="flex-start"
      {...props}
    />
  );
});
