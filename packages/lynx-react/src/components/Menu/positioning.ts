import {
  computePosition,
  flip,
  offset,
  shift,
  size,
  type Platform,
  type Rect,
} from "@floating-ui/core";

export type MenuSide = "top" | "right" | "bottom" | "left";
export type MenuPlacement = MenuSide | `${MenuSide}-${"start" | "end"}`;

export interface MenuRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface MenuPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  placement: MenuPlacement;
  transformOrigin: string;
}

interface MenuReferenceElement {
  rect: Rect;
}

interface MenuFloatingElement {
  dimensions: {
    width: number;
    height: number;
  };
}

const minimumHeight = 200;

function getTransformOrigin(placement: MenuPlacement) {
  const [side, align] = placement.split("-") as [MenuSide, "start" | "end" | undefined];
  const crossOrigin = align === "start" ? "0%" : align === "end" ? "100%" : "50%";
  return side === "top"
    ? `${crossOrigin} 100%`
    : side === "bottom"
      ? `${crossOrigin} 0%`
      : side === "left"
        ? `100% ${crossOrigin}`
        : `0% ${crossOrigin}`;
}

/** All inputs and output coordinates use the same screen-relative coordinate space. */
export async function positionMenu({
  reference,
  boundary,
  width,
  height,
  placement,
  gutter,
  overflowPadding,
}: {
  reference: MenuRect;
  boundary: MenuRect;
  width: number;
  height: number;
  placement: MenuPlacement;
  gutter: number;
  overflowPadding: number;
}): Promise<MenuPosition> {
  const referenceElement: MenuReferenceElement = {
    rect: {
      x: reference.left,
      y: reference.top,
      width: reference.width,
      height: reference.height,
    },
  };
  const floatingElement: MenuFloatingElement = {
    dimensions: {
      width: Math.max(0, width),
      height: Math.max(0, height),
    },
  };
  const clippingRect: Rect = {
    x: boundary.left,
    y: boundary.top,
    width: boundary.width,
    height: boundary.height,
  };
  const maximumHeight = floatingElement.dimensions.height;
  const platform: Platform = {
    getElementRects: () => ({
      reference: referenceElement.rect,
      floating: {
        x: 0,
        y: 0,
        ...floatingElement.dimensions,
      },
    }),
    getClippingRect: () => clippingRect,
    getDimensions: () => floatingElement.dimensions,
    isElement: () => true,
    isRTL: () => false,
  };

  const result = await computePosition(referenceElement, floatingElement, {
    placement,
    strategy: "absolute",
    platform,
    middleware: [
      offset(gutter),
      size({
        padding: overflowPadding,
        apply({ availableHeight }) {
          floatingElement.dimensions.height = Math.min(
            maximumHeight,
            Math.max(minimumHeight, availableHeight),
          );
        },
      }),
      flip({
        padding: overflowPadding,
        fallbackStrategy: "bestFit",
      }),
      shift({ padding: overflowPadding, crossAxis: true }),
    ],
  });
  const resolvedPlacement = result.placement as MenuPlacement;

  return {
    left: result.x,
    top: result.y,
    width: floatingElement.dimensions.width,
    height: floatingElement.dimensions.height,
    placement: resolvedPlacement,
    transformOrigin: getTransformOrigin(resolvedPlacement),
  };
}
