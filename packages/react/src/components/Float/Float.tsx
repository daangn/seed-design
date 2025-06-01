import * as React from "react";
import { Box } from "../Box/Box";

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
  offsetX?: 0 | (string & {});

  /**
   * @default 0
   */
  offsetY?: 0 | (string & {});

  zIndex?: number | (string & {});
}

function getPlacementStyle(
  placement: FloatProps["placement"],
  offsetX: 0 | (string & {}) | undefined,
  offsetY: 0 | (string & {}) | undefined,
) {
  const centerLeft = offsetX ? `calc(50% + ${offsetX}px)` : "50%";
  const middleTop = offsetY ? `calc(50% + ${offsetY}px)` : "50%";

  const shiftLeft = "translateX(-50%)";
  const shiftTop = "translateY(-50%)";
  const shiftBoth = "translate(-50%, -50%)";

  switch (placement) {
    case "top-start":
      return {
        top: offsetY ?? 0,
        left: offsetX ?? 0,
      };
    case "top-center":
      return {
        top: offsetY ?? 0,
        left: centerLeft,
        unstable_transform: shiftLeft,
      };
    case "top-end":
      return {
        top: offsetY ?? 0,
        right: offsetX ?? 0,
      };
    case "middle-start":
      return {
        top: middleTop,
        left: offsetX ?? 0,
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
        right: offsetX ?? 0,
        unstable_transform: shiftLeft,
      };
    case "bottom-start":
      return {
        bottom: offsetY ?? 0,
        left: offsetX ?? 0,
      };
    case "bottom-center":
      return {
        bottom: offsetY ?? 0,
        left: centerLeft,
        unstable_transform: shiftLeft,
      };
    case "bottom-end":
      return {
        bottom: offsetY ?? 0,
        right: offsetX ?? 0,
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
