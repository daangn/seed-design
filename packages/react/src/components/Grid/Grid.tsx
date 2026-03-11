import { mergeProps } from "@seed-design/dom-utils";
import * as React from "react";
import type { BreakpointThreshold, ResponsiveValue } from "../../types/responsive";
import { resolveResponsive } from "../../utils/styled";
import { resolveThreshold } from "../../utils/visibility";
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
  columns?: ResponsiveValue<number | string>;

  /**
   * Shorthand for `gridTemplateRows`.
   * If number, `repeat({rows}, minmax(0, 1fr))` is applied.
   */
  rows?: ResponsiveValue<number | string>;

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

  hideFrom?: BreakpointThreshold;

  showFrom?: BreakpointThreshold;
}

function handleGridTemplate(v: number | string): string {
  return typeof v === "number" ? `repeat(${v}, minmax(0, 1fr))` : v;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const {
    align,
    justify,
    justifyItems,
    columns,
    rows,
    autoFlow,
    autoColumns,
    autoRows,
    display,
    hideFrom,
    showFrom,
    ...rest
  } = props;
  const resolvedDisplay =
    resolveThreshold(display ?? "grid", "none", hideFrom) ??
    resolveThreshold("none", display ?? "grid", showFrom) ??
    "grid";

  return (
    <Box
      ref={ref}
      display={resolvedDisplay}
      alignItems={align}
      justifyContent={justify}
      {...mergeProps(rest, {
        className: "seed-grid",
        style: {
          ...(columns !== undefined &&
            resolveResponsive("--seed-grid-columns", columns, handleGridTemplate)),
          ...(rows !== undefined &&
            resolveResponsive("--seed-grid-rows", rows, handleGridTemplate)),
          "--seed-grid-auto-flow": autoFlow,
          "--seed-grid-auto-columns": autoColumns,
          "--seed-grid-auto-rows": autoRows,
          "--seed-grid-justify-items": justifyItems,
        } as React.CSSProperties,
      })}
    />
  );
});
