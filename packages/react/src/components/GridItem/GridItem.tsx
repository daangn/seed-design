import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface GridItemProps extends Omit<BoxProps, "gridColumn" | "gridRow" | "gridArea"> {
  /**
   * If true, the component will render its children directly without a wrapper element.
   * @default true
   */
  asChild?: boolean;

  /**
   * Number of columns to span, or "full" for full width (1 / -1).
   * @example 2, "full"
   */
  colSpan?: number | "full";

  /**
   * Number of rows to span, or "full" for full height (1 / -1).
   * @example 2, "full"
   */
  rowSpan?: number | "full";

  /**
   * Starting column (1-indexed).
   * @example 1, "auto"
   */
  colStart?: number | "auto";

  /**
   * Ending column.
   * @example 3, -1
   */
  colEnd?: number | "auto";

  /**
   * Starting row (1-indexed).
   * @example 1, "auto"
   */
  rowStart?: number | "auto";

  /**
   * Ending row.
   * @example 3, -1
   */
  rowEnd?: number | "auto";

  // NOTE: grid-area is not currently supported here: see Grid.tsx
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
  const { asChild = true, colSpan, colStart, colEnd, rowSpan, rowStart, rowEnd, ...rest } = props;

  const gridColumn = getGridLine(colSpan, colStart, colEnd);
  const gridRow = getGridLine(rowSpan, rowStart, rowEnd);

  return <Box ref={ref} asChild={asChild} gridColumn={gridColumn} gridRow={gridRow} {...rest} />;
});
GridItem.displayName = "GridItem";

function getGridLine(
  span: GridItemProps["colSpan"] & GridItemProps["rowSpan"],
  start: GridItemProps["colStart"] & GridItemProps["rowStart"],
  end: GridItemProps["colEnd"] & GridItemProps["rowEnd"],
): (BoxProps["gridRow"] & BoxProps["gridColumn"]) | undefined {
  if (span === "full") return "1 / -1";

  if (start !== undefined && end !== undefined) return `${start} / ${end}`;

  if (start !== undefined) return `${start}`;

  if (end !== undefined) return `auto / ${end}`;

  if (span !== undefined) return `span ${span}`;

  return undefined;
}
