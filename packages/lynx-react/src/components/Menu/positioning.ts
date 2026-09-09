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

const opposite: Record<MenuSide, MenuSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** All inputs and output coordinates use the same screen-relative coordinate space. */
export function positionMenu({
  reference,
  boundary,
  width,
  height,
  placement,
  gutter,
}: {
  reference: MenuRect;
  boundary: MenuRect;
  width: number;
  height: number;
  placement: MenuPlacement;
  gutter: number;
}): MenuPosition {
  const requestedSide: MenuSide = placement.startsWith("top")
    ? "top"
    : placement.startsWith("right")
      ? "right"
      : placement.startsWith("left")
        ? "left"
        : "bottom";
  const align = placement.endsWith("-start")
    ? "start"
    : placement.endsWith("-end")
      ? "end"
      : undefined;
  const available: Record<MenuSide, number> = {
    top: Math.max(0, reference.top - boundary.top - gutter),
    bottom: Math.max(0, boundary.bottom - reference.bottom - gutter),
    left: Math.max(0, reference.left - boundary.left - gutter),
    right: Math.max(0, boundary.right - reference.right - gutter),
  };
  const vertical = requestedSide === "top" || requestedSide === "bottom";
  const desired = vertical ? Math.min(height, boundary.height) : Math.min(width, boundary.width);
  const flipped = opposite[requestedSide];
  const side =
    available[requestedSide] < desired && available[flipped] > available[requestedSide]
      ? flipped
      : requestedSide;
  const finalWidth = Math.max(
    0,
    Math.min(width, boundary.width, vertical ? boundary.width : available[side]),
  );
  const finalHeight = Math.max(
    0,
    Math.min(height, boundary.height, vertical ? available[side] : boundary.height),
  );
  const alignedX =
    align === "start"
      ? reference.left
      : align === "end"
        ? reference.right - finalWidth
        : (reference.left + reference.right - finalWidth) / 2;
  const alignedY =
    align === "start"
      ? reference.top
      : align === "end"
        ? reference.bottom - finalHeight
        : (reference.top + reference.bottom - finalHeight) / 2;
  const x = vertical
    ? alignedX
    : side === "left"
      ? reference.left - gutter - finalWidth
      : reference.right + gutter;
  const y = vertical
    ? side === "top"
      ? reference.top - gutter - finalHeight
      : reference.bottom + gutter
    : alignedY;
  const crossOrigin = align === "start" ? "0%" : align === "end" ? "100%" : "50%";
  const resolvedPlacement: MenuPlacement =
    align === "start" ? `${side}-start` : align === "end" ? `${side}-end` : side;

  return {
    left: Math.max(
      boundary.left,
      Math.min(x, Math.max(boundary.left, boundary.right - finalWidth)),
    ),
    top: Math.max(boundary.top, Math.min(y, Math.max(boundary.top, boundary.bottom - finalHeight))),
    width: finalWidth,
    height: finalHeight,
    placement: resolvedPlacement,
    transformOrigin: vertical
      ? `${crossOrigin} ${side === "top" ? "100%" : "0%"}`
      : `${side === "left" ? "100%" : "0%"} ${crossOrigin}`,
  };
}
