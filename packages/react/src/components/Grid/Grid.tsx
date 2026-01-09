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

  justifyItems?: "flex-start" | "flex-end" | "center" | "stretch";

  /**
   * Shorthand for `gridTemplateColumns`.
   * If number, `repeat({columns}, minmax(0, 1fr))` is applied.
   */
  columns?: number | string;

  /**
   * Shorthand for `gridTemplateRows`.
   * If number, `repeat({rows}, minmax(0, 1fr))` is applied.
   */
  rows?: number | string;

  // NOTE: grid-template-areas not currently supported here.
  // since grid-area is a shorthand of grid-column/row (in a grid item),
  // if we bind grid-area CSS variable together, it causes conflict.

  /**
   * Shorthand for `gridAutoFlow`.
   */
  autoFlow?: "row" | "column" | "row dense" | "column dense";

  /**
   * Shorthand for `gridAutoColumns`.
   */
  autoColumns?: string;

  /**
   * Shorthand for `gridAutoRows`.
   */
  autoRows?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { align, justify, justifyItems, columns, rows, autoFlow, autoColumns, autoRows, ...rest } =
    props;

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
          "--seed-grid-rows": typeof rows === "number" ? `repeat(${rows}, minmax(0, 1fr))` : rows,
          "--seed-grid-auto-flow": autoFlow,
          "--seed-grid-auto-columns": autoColumns,
          "--seed-grid-auto-rows": autoRows,
          "--seed-grid-justify-items": justifyItems,
        } as React.CSSProperties,
      })}
    />
  );
});
