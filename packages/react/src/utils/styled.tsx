import type {
  ColorBg,
  ColorFg,
  ColorPalette,
  ColorStroke,
  Dimension,
  Radius,
  SpacingX,
  SpacingY,
} from "@seed-design/css/vars";
import { vars } from "@seed-design/css/vars";
import { forwardRef } from "react";

export function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-ignore
  return vars.$color[type][value] ?? undefined;
}

export function handleDimension(dimension: string | 0 | undefined) {
  if (dimension == null) {
    return undefined;
  }

  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  if (dimension === "full") {
    return "100%";
  }

  const [type, value] = dimension.split(".");

  // @ts-ignore
  return vars.$dimension[dimension] ?? vars.$dimension[type]?.[value] ?? dimension;
}

function handleRadius(radius: string | 0 | undefined) {
  if (radius == null) {
    return undefined;
  }
  // @ts-ignore
  return vars.$radius[radius] ?? radius;
}

function handleDisplay(
  display: "block" | "flex" | "inlineFlex" | "inline" | "inlineBlock" | "none" | undefined,
) {
  if (!display) {
    return undefined;
  }

  return {
    block: "block",
    flex: "flex",
    inlineFlex: "inline-flex",
    inline: "inline",
    inlineBlock: "inline-block",
    none: "none",
  }[display];
}

function handleFlexDirection(flexDirection: string | undefined) {
  if (!flexDirection) {
    return undefined;
  }

  return {
    row: "row",
    column: "column",
    rowReverse: "row-reverse",
    columnReverse: "column-reverse",
  }[flexDirection];
}

function handleJustifyContent(justifyContent: string | undefined) {
  if (!justifyContent) {
    return undefined;
  }

  return {
    flexStart: "flex-start",
    flexEnd: "flex-end",
    center: "center",
    spaceBetween: "space-between",
    spaceAround: "space-around",
  }[justifyContent];
}

function handleAlignItems(alignItems: string | undefined) {
  if (!alignItems) {
    return undefined;
  }

  return {
    flexStart: "flex-start",
    flexEnd: "flex-end",
    center: "center",
    stretch: "stretch",
  }[alignItems];
}

export interface StyleProps {
  background?: `bg.${ColorBg}` | `palette.${ColorPalette}`;

  color?: `fg.${ColorFg}` | `palette.${ColorPalette}`;

  borderColor?: `stroke.${ColorStroke}` | `palette.${ColorPalette}`;

  borderWidth?: 0 | 1 | (number & {});

  borderTopWidth?: 0 | 1 | (number & {});

  borderRightWidth?: 0 | 1 | (number & {});

  borderBottomWidth?: 0 | 1 | (number & {});

  borderLeftWidth?: 0 | 1 | (number & {});

  borderRadius?: Radius | 0;

  borderTopLeftRadius?: Radius | 0;

  borderTopRightRadius?: Radius | 0;

  borderBottomRightRadius?: Radius | 0;

  borderBottomLeftRadius?: Radius | 0;

  width?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  minWidth?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  maxWidth?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  height?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  minHeight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  maxHeight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});

  top?: 0;

  left?: 0;

  right?: 0;

  bottom?: 0;

  padding?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingX?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingY?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingTop?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingRight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingBottom?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  paddingLeft?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;

  display?: "block" | "flex" | "inlineFlex" | "inline" | "inlineBlock" | "none";

  position?: "relative" | "absolute" | "fixed" | "sticky";

  overflowX?: "visible" | "hidden" | "scroll" | "auto";

  overflowY?: "visible" | "hidden" | "scroll" | "auto";

  flexGrow?: 0 | 1 | (number & {});

  flexShrink?: 0 | (number & {});

  // Flex
  flexDirection?: "row" | "column" | "rowReverse" | "columnReverse";

  flexWrap?: "wrap" | "nowrap";

  justifyContent?: "flexStart" | "flexEnd" | "center" | "spaceBetween" | "spaceAround";

  alignItems?: "flexStart" | "flexEnd" | "center" | "stretch";

  alignContent?: "flexStart" | "flexEnd" | "center" | "stretch";

  alignSelf?: "flexStart" | "flexEnd" | "center" | "stretch";

  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0;
}

interface UseStyleProps extends StyleProps {
  style?: React.CSSProperties;
}

export function useStyleProps<T extends UseStyleProps>(
  props: T,
): {
  style: React.CSSProperties;
  restProps: Omit<T, keyof UseStyleProps>;
} {
  const {
    background,
    color,
    borderColor,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    bottom,
    left,
    right,
    top,
    display,
    position,
    overflowX,
    overflowY,
    flexGrow,
    flexShrink,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    alignContent,
    alignSelf,
    gap,
    style,
    ...restProps
  } = props;

  return {
    style: {
      "--seed-box-background": handleColor(background),
      "--seed-box-color": handleColor(color),
      "--seed-box-border-color": handleColor(borderColor),
      "--seed-box-border-width": borderWidth !== undefined ? `${borderWidth}px` : undefined,
      "--seed-box-border-top-width":
        borderTopWidth !== undefined ? `${borderTopWidth}px` : undefined,
      "--seed-box-border-right-width":
        borderRightWidth !== undefined ? `${borderRightWidth}px` : undefined,
      "--seed-box-border-bottom-width":
        borderBottomWidth !== undefined ? `${borderBottomWidth}px` : undefined,
      "--seed-box-border-left-width":
        borderLeftWidth !== undefined ? `${borderLeftWidth}px` : undefined,
      "--seed-box-border-radius": handleRadius(borderRadius),
      "--seed-box-border-top-left-radius": handleRadius(borderTopLeftRadius),
      "--seed-box-border-top-right-radius": handleRadius(borderTopRightRadius),
      "--seed-box-border-bottom-right-radius": handleRadius(borderBottomRightRadius),
      "--seed-box-border-bottom-left-radius": handleRadius(borderBottomLeftRadius),
      "--seed-box-width": handleDimension(width),
      "--seed-box-min-width": handleDimension(minWidth),
      "--seed-box-max-width": handleDimension(maxWidth),
      "--seed-box-height": handleDimension(height),
      "--seed-box-min-height": handleDimension(minHeight),
      "--seed-box-max-height": handleDimension(maxHeight),
      "--seed-box-padding": handleDimension(padding),
      "--seed-box-padding-x": handleDimension(paddingX),
      "--seed-box-padding-y": handleDimension(paddingY),
      "--seed-box-padding-top": handleDimension(paddingTop),
      "--seed-box-padding-right": handleDimension(paddingRight),
      "--seed-box-padding-bottom": handleDimension(paddingBottom),
      "--seed-box-padding-left": handleDimension(paddingLeft),
      "--seed-box-top": top,
      "--seed-box-left": left,
      "--seed-box-right": right,
      "--seed-box-bottom": bottom,
      "--seed-box-gap": handleDimension(gap),
      "--seed-box-display": handleDisplay(display),
      "--seed-box-position": position,
      "--seed-box-overflow-x": overflowX,
      "--seed-box-overflow-y": overflowY,
      "--seed-box-flex-grow": flexGrow,
      "--seed-box-flex-shrink": flexShrink,
      "--seed-box-flex-direction": handleFlexDirection(flexDirection),
      "--seed-box-flex-wrap": flexWrap,
      "--seed-box-justify-content": handleJustifyContent(justifyContent),
      "--seed-box-align-items": handleAlignItems(alignItems),
      "--seed-box-align-content": handleAlignItems(alignContent),
      "--seed-box-align-self": handleAlignItems(alignSelf),
      ...style,
    } as React.CSSProperties,
    restProps,
  };
}

export function withStyleProps<P extends {}, R>(
  Component: React.ComponentType<P & React.RefAttributes<R>>,
) {
  const Node = forwardRef<R, P>((props, ref) => {
    const { style, restProps } = useStyleProps(props);

    // @ts-ignore
    return <Component ref={ref} style={style} {...restProps} />;
  });

  Node.displayName = Component.displayName || Component.name;

  return Node;
}
