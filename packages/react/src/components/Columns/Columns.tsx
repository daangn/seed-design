import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

/**
 * @deprecated Use `HStack` instead.
 */
export interface ColumnsProps extends Omit<BoxProps, "display" | "direction"> {}

/**
 * @deprecated Use `HStack` instead.
 */
export const Columns = React.forwardRef<HTMLDivElement, ColumnsProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="flex-start"
      {...props}
    />
  );
});

/**
 * @deprecated Use `HStack` instead.
 */
export interface ColumnProps extends Omit<BoxProps, "display" | "flexDirection" | "width"> {
  width?: BoxProps["width"] | "content";
}

/**
 * @deprecated Use `HStack` instead.
 */
export const Column = React.forwardRef<HTMLDivElement, ColumnProps>((props, ref) => {
  const { width, ...otherProps } = props;

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      width={width !== "content" ? "full" : undefined}
      flexShrink={width ? 0 : undefined}
      flexGrow={width ? 0 : 1}
      {...otherProps}
    />
  );
});
