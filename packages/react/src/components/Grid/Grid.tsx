import { mergeProps } from "@seed-design/dom-utils";
import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface GridProps extends Omit<BoxProps, "display"> {
  /**
   * @default "grid"
   */
  display?: "grid" | "none";

  /**
   * Shorthand for `alignItems`.
   */
  align?: BoxProps["alignItems"];

  /**
   * Shorthand for `justifyContent`.
   */
  justify?: BoxProps["justifyContent"];

  /**
   * Shorthand for `gridTemplateColumns`.
   * If number, `repeat({columns}, minmax(0, 1fr))` is applied.
   *
   * @default 2
   */
  columns?: number | string;

  /**
   * Shorthand for `gridTemplateRows`.
   *
   * @default undefined
   */
  rows?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { align, justify, columns, rows, ...rest } = props;

  return (
    // @ts-expect-error: display: "grid" is not allowed in the Box component
    <Box
      ref={ref}
      alignItems={align}
      justifyContent={justify}
      {...mergeProps(rest, {
        className: "seed-grid",
        style: {
          "--seed-grid-columns":
            typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns,
          "--seed-grid-rows": rows,
        } as React.CSSProperties,
      })}
    />
  );
});
