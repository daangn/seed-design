import type * as React from "react";
import type {
  Dimension,
  FontSize,
  FontWeight,
  LineHeight,
  Radius,
  ScopedColorBanner,
  ScopedColorBg,
  ScopedColorFg,
  ScopedColorPalette,
  ScopedColorStroke,
  SpacingX,
  SpacingY,
} from "@seed-design/lynx-css/vars";
import { vars } from "@seed-design/lynx-css/vars";

import { getSafeAreaInset } from "./safe-area";

export function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-expect-error token category is derived from the public string contract.
  return vars.$color[type]?.[value] ?? color;
}

export function handleDimension(dimension: number | string | undefined): string | undefined {
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

  // @ts-expect-error token category is derived from the public string contract.
  return vars.$dimension[dimension] ?? vars.$dimension[type]?.[value] ?? dimension;
}

export function resolveFlexValue(
  value: number | string | boolean | undefined,
): number | string | undefined {
  if (value === true) return 1;
  if (value === false) return 0;
  return value;
}

function handleBorderWidth(width: 0 | 1 | (string & {}) | undefined) {
  if (width == null) {
    return undefined;
  }

  if (typeof width === "number") {
    return `${width}px`;
  }

  return width;
}

export function handlePaddingWithSafeArea(
  padding: string | 0 | undefined,
  direction: "top" | "bottom",
): string | undefined {
  if (padding === "safeArea") {
    return getSafeAreaInset(direction);
  }

  return handleDimension(padding);
}

export function handleRadius(radius: string | 0 | undefined) {
  if (radius == null) {
    return undefined;
  }
  // @ts-expect-error token category is derived from the public string contract.
  return vars.$radius[radius] ?? radius;
}

function handleDisplay(display: string | undefined) {
  if (!display) {
    return undefined;
  }

  return (
    {
      flex: "flex",
      none: "none",
    }[display] ?? display
  );
}

function handleFlexDirection(flexDirection: string | undefined) {
  if (!flexDirection) {
    return undefined;
  }

  return (
    {
      row: "row",
      column: "column",
      rowReverse: "row-reverse",
      columnReverse: "column-reverse",
    }[flexDirection] ?? flexDirection
  );
}

function handleJustifyContent(justifyContent: string | undefined) {
  if (!justifyContent) {
    return undefined;
  }

  return (
    {
      flexStart: "flex-start",
      flexEnd: "flex-end",
      center: "center",
      spaceBetween: "space-between",
      spaceAround: "space-around",
    }[justifyContent] ?? justifyContent
  );
}

function handleAlignItems(alignItems: string | undefined) {
  if (!alignItems) {
    return undefined;
  }

  return (
    {
      flexStart: "flex-start",
      flexEnd: "flex-end",
      center: "center",
      stretch: "stretch",
    }[alignItems] ?? alignItems
  );
}

export function handleFontWeight(fontWeight: string | undefined) {
  if (!fontWeight) {
    return undefined;
  }
  // @ts-expect-error token category is derived from the public string contract.
  return vars.$fontWeight[fontWeight] ?? fontWeight;
}

export function handleFontSize(size: string | undefined) {
  if (!size) {
    return undefined;
  }
  // @ts-expect-error token category is derived from the public string contract.
  return vars.$fontSize[size] ?? size;
}

export function handleLineHeight(lineHeight: string | undefined) {
  if (!lineHeight) {
    return undefined;
  }
  // @ts-expect-error token category is derived from the public string contract.
  return vars.$lineHeight[lineHeight] ?? lineHeight;
}

export interface StyleProps {
  bg?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});
  background?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});
  color?: ScopedColorFg | ScopedColorPalette | (string & {});
  borderColor?: ScopedColorStroke | ScopedColorPalette | (string & {});
  borderWidth?: 0 | 1 | (string & {});
  borderTopWidth?: 0 | 1 | (string & {});
  borderRightWidth?: 0 | 1 | (string & {});
  borderBottomWidth?: 0 | 1 | (string & {});
  borderLeftWidth?: 0 | 1 | (string & {});
  borderRadius?: Radius | 0 | (string & {});
  borderTopLeftRadius?: Radius | 0 | (string & {});
  borderTopRightRadius?: Radius | 0 | (string & {});
  borderBottomRightRadius?: Radius | 0 | (string & {});
  borderBottomLeftRadius?: Radius | 0 | (string & {});
  width?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  minWidth?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  maxWidth?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  height?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  minHeight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  maxHeight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {});
  top?: 0 | (string & {});
  left?: 0 | (string & {});
  right?: 0 | (string & {});
  bottom?: 0 | (string & {});
  padding?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  p?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  paddingX?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  px?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  paddingY?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  py?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  paddingTop?:
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | "safeArea"
    | (string & {});
  pt?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {});
  paddingRight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  pr?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  paddingBottom?:
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | "safeArea"
    | (string & {});
  pb?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {});
  paddingLeft?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  pl?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
  display?: "flex" | "none" | (string & {});
  position?: "relative" | "absolute" | "fixed" | (string & {});
  overflowX?: "visible" | "hidden" | (string & {});
  overflowY?: "visible" | "hidden" | (string & {});
  zIndex?: React.CSSProperties["zIndex"];
  flexGrow?: React.CSSProperties["flexGrow"] | boolean;
  flexShrink?: React.CSSProperties["flexShrink"] | boolean;
  flexDirection?: "row" | "column" | "rowReverse" | "columnReverse" | (string & {});
  flexWrap?: "nowrap" | "wrap" | boolean;
  justifyContent?:
    | "flexStart"
    | "flexEnd"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | (string & {});
  justifySelf?: React.CSSProperties["justifySelf"];
  alignItems?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  alignContent?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  alignSelf?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
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
    bg,
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
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    bottom,
    left,
    right,
    top,
    display,
    position,
    overflowX,
    overflowY,
    zIndex,
    flexGrow,
    flexShrink,
    flexDirection,
    flexWrap,
    justifyContent,
    justifySelf,
    alignItems,
    alignContent,
    alignSelf,
    gap,
    style,
    ...restProps
  } = props;

  const backgroundValue = handleColor(background ?? bg);
  const paddingValue = handleDimension(padding ?? p);
  const paddingXValue = handleDimension(paddingX ?? px) ?? paddingValue;
  const paddingYValue = handleDimension(paddingY ?? py) ?? paddingValue;
  const paddingTopValue = handlePaddingWithSafeArea(paddingTop ?? pt, "top") ?? paddingYValue;
  const paddingRightValue = handleDimension(paddingRight ?? pr) ?? paddingXValue;
  const paddingBottomValue =
    handlePaddingWithSafeArea(paddingBottom ?? pb, "bottom") ?? paddingYValue;
  const paddingLeftValue = handleDimension(paddingLeft ?? pl) ?? paddingXValue;
  const hasBorderStyle =
    borderColor != null ||
    borderWidth != null ||
    borderTopWidth != null ||
    borderRightWidth != null ||
    borderBottomWidth != null ||
    borderLeftWidth != null;

  return {
    style: {
      background: backgroundValue,
      color: handleColor(color),
      borderStyle: hasBorderStyle ? "solid" : undefined,
      borderColor: handleColor(borderColor),
      borderWidth: handleBorderWidth(borderWidth),
      borderTopWidth: handleBorderWidth(borderTopWidth),
      borderRightWidth: handleBorderWidth(borderRightWidth),
      borderBottomWidth: handleBorderWidth(borderBottomWidth),
      borderLeftWidth: handleBorderWidth(borderLeftWidth),
      borderRadius: handleRadius(borderRadius),
      borderTopLeftRadius: handleRadius(borderTopLeftRadius),
      borderTopRightRadius: handleRadius(borderTopRightRadius),
      borderBottomRightRadius: handleRadius(borderBottomRightRadius),
      borderBottomLeftRadius: handleRadius(borderBottomLeftRadius),
      width: handleDimension(width),
      minWidth: handleDimension(minWidth),
      maxWidth: handleDimension(maxWidth),
      height: handleDimension(height),
      minHeight: handleDimension(minHeight),
      maxHeight: handleDimension(maxHeight),
      paddingTop: paddingTopValue,
      paddingRight: paddingRightValue,
      paddingBottom: paddingBottomValue,
      paddingLeft: paddingLeftValue,
      top: handleDimension(top),
      left: handleDimension(left),
      right: handleDimension(right),
      bottom: handleDimension(bottom),
      gap: handleDimension(gap),
      display: handleDisplay(display),
      position,
      overflowX,
      overflowY,
      zIndex,
      flexGrow: resolveFlexValue(flexGrow),
      flexShrink: resolveFlexValue(flexShrink),
      flexDirection: handleFlexDirection(flexDirection),
      flexWrap: flexWrap === true ? "wrap" : flexWrap === false ? "nowrap" : flexWrap,
      justifyContent: handleJustifyContent(justifyContent),
      justifySelf,
      alignItems: handleAlignItems(alignItems),
      alignContent: handleAlignItems(alignContent),
      alignSelf: handleAlignItems(alignSelf),
      ...style,
    } as React.CSSProperties,
    restProps,
  };
}

export type TextStyle =
  | "screenTitle"
  | "articleBody"
  | "articleNote"
  | "t1Regular"
  | "t1Medium"
  | "t1Bold"
  | "t2Regular"
  | "t2Medium"
  | "t2Bold"
  | "t3Regular"
  | "t3Medium"
  | "t3Bold"
  | "t4Regular"
  | "t4Medium"
  | "t4Bold"
  | "t5Regular"
  | "t5Medium"
  | "t5Bold"
  | "t6Regular"
  | "t6Medium"
  | "t6Bold"
  | "t7Regular"
  | "t7Medium"
  | "t7Bold"
  | "t8Bold"
  | "t9Bold"
  | "t10Bold"
  | "t1StaticRegular"
  | "t1StaticMedium"
  | "t1StaticBold"
  | "t2StaticRegular"
  | "t2StaticMedium"
  | "t2StaticBold"
  | "t3StaticRegular"
  | "t3StaticMedium"
  | "t3StaticBold"
  | "t4StaticRegular"
  | "t4StaticMedium"
  | "t4StaticBold"
  | "t5StaticRegular"
  | "t5StaticMedium"
  | "t5StaticBold"
  | "t6StaticRegular"
  | "t6StaticMedium"
  | "t6StaticBold"
  | "t7StaticRegular"
  | "t7StaticMedium"
  | "t7StaticBold"
  | "t8StaticBold"
  | "t9StaticBold"
  | "t10StaticBold";

export interface TextStyleProps {
  color?: ScopedColorFg | ScopedColorPalette | (string & {});
  fontSize?: FontSize | (string & {});
  lineHeight?: LineHeight | (string & {});
  fontWeight?: FontWeight;
  textStyle?: TextStyle;
  align?: "left" | "center" | "right";
}
