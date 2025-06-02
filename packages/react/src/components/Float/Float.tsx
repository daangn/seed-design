import type { Dimension } from "@seed-design/css/vars";
import * as React from "react";
import { Box } from "../Box/Box";
import { handleDimension } from "../../utils/styled";

export interface FloatProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;

  placement:
    | "bottom-end"
    | "bottom-start"
    | "top-end"
    | "top-start"
    | "bottom-center"
    | "top-center"
    | "middle-center"
    | "middle-end"
    | "middle-start";

  /**
   * @default 0
   */
  offsetX?: 0 | Dimension | (string & {});

  /**
   * @default 0
   */
  offsetY?: 0 | Dimension | (string & {});

  zIndex?: number | (string & {});
}

function getPlacementStyle(
  placement: FloatProps["placement"],
  offsetX: 0 | (string & {}) | undefined,
  offsetY: 0 | (string & {}) | undefined,
): {
  top?: 0 | string | undefined;
  left?: 0 | string | undefined;
  right?: 0 | string | undefined;
  bottom?: 0 | string | undefined;
  unstable_transform?: string | undefined;
} {
  const offsetXValue = handleDimension(offsetX);
  const offsetYValue = handleDimension(offsetY);

  const centerLeft = offsetXValue ? `calc(50% + ${offsetXValue})` : "50%";
  const middleTop = offsetYValue ? `calc(50% + ${offsetYValue})` : "50%";

  const shiftLeft = "translateX(-50%)";
  const shiftTop = "translateY(-50%)";
  const shiftBoth = "translate(-50%, -50%)";

  switch (placement) {
    case "top-start":
      return {
        top: offsetYValue ?? 0,
        left: offsetXValue ?? 0,
      };
    case "top-center":
      return {
        top: offsetYValue ?? 0,
        left: centerLeft,
        unstable_transform: shiftLeft,
      };
    case "top-end":
      return {
        top: offsetYValue ?? 0,
        right: offsetXValue ?? 0,
      };
    case "middle-start":
      return {
        top: middleTop,
        left: offsetXValue ?? 0,
        unstable_transform: shiftTop,
      };
    case "middle-center":
      return {
        top: middleTop,
        left: centerLeft,
        unstable_transform: shiftBoth,
      };
    case "middle-end":
      return {
        top: middleTop,
        right: offsetXValue ?? 0,
        unstable_transform: shiftTop,
      };
    case "bottom-start":
      return {
        bottom: offsetYValue ?? 0,
        left: offsetXValue ?? 0,
      };
    case "bottom-center":
      return {
        bottom: offsetYValue ?? 0,
        left: centerLeft,
        unstable_transform: shiftLeft,
      };
    case "bottom-end":
      return {
        bottom: offsetYValue ?? 0,
        right: offsetXValue ?? 0,
      };
  }
}

export const Float = React.forwardRef<HTMLDivElement, FloatProps>((props, ref) => {
  const { as, placement, offsetX, offsetY, zIndex, ...rest } = props;

  const placementStyle = getPlacementStyle(placement, offsetX, offsetY);

  return (
    <Box ref={ref} as={as} position="absolute" zIndex={zIndex} {...placementStyle} {...rest} />
  );
});
