import type { CSSProperties } from "@lynx-js/types";
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

import { useSafeArea } from "../hooks/useSafeArea";

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
  safeAreaInset: string,
): string | undefined {
  if (padding === "safeArea") {
    return safeAreaInset;
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
  zIndex?: CSSProperties["zIndex"];
  flexGrow?: CSSProperties["flexGrow"] | boolean;
  flexShrink?: CSSProperties["flexShrink"] | boolean;
  flexDirection?: "row" | "column" | "rowReverse" | "columnReverse" | (string & {});
  flexWrap?: "nowrap" | "wrap" | boolean;
  justifyContent?:
    | "flexStart"
    | "flexEnd"
    | "center"
    | "spaceBetween"
    | "spaceAround"
    | (string & {});
  justifySelf?: CSSProperties["justifySelf"];
  alignItems?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  alignContent?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  alignSelf?: "flexStart" | "flexEnd" | "center" | "stretch" | (string & {});
  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
}

type MarginValue =
  | Dimension
  | `spacingX.${SpacingX}`
  | `spacingY.${SpacingY}`
  | 0
  | "auto"
  | (string & {});

type BleedValue = Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

interface MarginStyleProps {
  margin?: MarginValue;
  /**
   * Shorthand for `margin`.
   */
  m?: MarginValue;
  marginX?: MarginValue;
  /**
   * Shorthand for `marginX`.
   */
  mx?: MarginValue;
  marginY?: MarginValue;
  /**
   * Shorthand for `marginY`.
   */
  my?: MarginValue;
  marginTop?: MarginValue;
  /**
   * Shorthand for `marginTop`.
   */
  mt?: MarginValue;
  marginRight?: MarginValue;
  /**
   * Shorthand for `marginRight`.
   */
  mr?: MarginValue;
  marginBottom?: MarginValue;
  /**
   * Shorthand for `marginBottom`.
   */
  mb?: MarginValue;
  marginLeft?: MarginValue;
  /**
   * Shorthand for `marginLeft`.
   */
  ml?: MarginValue;
}

interface BleedStyleProps {
  /**
   * Negative margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleed?: BleedValue;
  /**
   * Negative horizontal margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedX?: BleedValue;
  /**
   * Negative vertical margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedY?: BleedValue;
  /**
   * Negative top margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedTop?: BleedValue;
  /**
   * Negative right margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedRight?: BleedValue;
  /**
   * Negative bottom margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedBottom?: BleedValue;
  /**
   * Negative left margin to extend the element outside its parent.
   *
   * Cannot be combined with any `margin*` prop.
   */
  bleedLeft?: BleedValue;
}

/**
 * Margin and bleed props both resolve to `margin-*` values, so they are mutually exclusive at
 * the type level.
 */
export type MarginBleedStyleProps =
  | (BleedStyleProps & { [K in keyof MarginStyleProps]?: never })
  | (MarginStyleProps & { [K in keyof BleedStyleProps]?: never });

type UseStyleProps = StyleProps &
  MarginStyleProps &
  BleedStyleProps & {
    className?: string;
    style?: CSSProperties;
  };

type BoxStyleValue = string | number | undefined;

/**
 * `--seed-box-<name>` 변수와 `seed-box-<name>` class 쌍으로 style prop을 전달합니다. 실제 CSS
 * 속성은 `@seed-design/lynx-css`의 전역 `.seed-box.seed-box-<name>` 규칙이 적용합니다.
 */
export function resolveBoxStyleProps<T extends UseStyleProps>(
  props: T,
  options: {
    safeAreaInsetTop: string;
    safeAreaInsetBottom: string;
    /**
     * `gap`을 적용할 축입니다. 생략하면 두 축에 모두 적용합니다.
     */
    gapAxis?: "row" | "column";
  },
) {
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
    margin,
    m,
    marginX,
    mx,
    marginY,
    my,
    marginTop,
    mt,
    marginRight,
    mr,
    marginBottom,
    mb,
    marginLeft,
    ml,
    bleed,
    bleedX,
    bleedY,
    bleedTop,
    bleedRight,
    bleedBottom,
    bleedLeft,
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
  const { safeAreaInsetTop, safeAreaInsetBottom, gapAxis } = options;

  const entries: [name: string, value: BoxStyleValue][] = [
    ["background", handleColor(background ?? bg)],
    ["color", handleColor(color)],
    ["border-color", handleColor(borderColor)],
    ["border-width", handleBorderWidth(borderWidth)],
    ["border-top-width", handleBorderWidth(borderTopWidth)],
    ["border-right-width", handleBorderWidth(borderRightWidth)],
    ["border-bottom-width", handleBorderWidth(borderBottomWidth)],
    ["border-left-width", handleBorderWidth(borderLeftWidth)],
    ["border-radius", handleRadius(borderRadius)],
    ["border-top-left-radius", handleRadius(borderTopLeftRadius)],
    ["border-top-right-radius", handleRadius(borderTopRightRadius)],
    ["border-bottom-right-radius", handleRadius(borderBottomRightRadius)],
    ["border-bottom-left-radius", handleRadius(borderBottomLeftRadius)],
    ["width", handleDimension(width)],
    ["min-width", handleDimension(minWidth)],
    ["max-width", handleDimension(maxWidth)],
    ["height", handleDimension(height)],
    ["min-height", handleDimension(minHeight)],
    ["max-height", handleDimension(maxHeight)],
    ["top", handleDimension(top)],
    ["right", handleDimension(right)],
    ["bottom", handleDimension(bottom)],
    ["left", handleDimension(left)],
    ["padding", handleDimension(padding ?? p)],
    ["padding-x", handleDimension(paddingX ?? px)],
    ["padding-y", handleDimension(paddingY ?? py)],
    ["padding-top", handlePaddingWithSafeArea(paddingTop ?? pt, safeAreaInsetTop)],
    ["padding-right", handleDimension(paddingRight ?? pr)],
    ["padding-bottom", handlePaddingWithSafeArea(paddingBottom ?? pb, safeAreaInsetBottom)],
    ["padding-left", handleDimension(paddingLeft ?? pl)],
    ["bleed", handleDimension(bleed)],
    ["bleed-x", handleDimension(bleedX)],
    ["bleed-y", handleDimension(bleedY)],
    ["bleed-top", handleDimension(bleedTop)],
    ["bleed-right", handleDimension(bleedRight)],
    ["bleed-bottom", handleDimension(bleedBottom)],
    ["bleed-left", handleDimension(bleedLeft)],
    ["margin", handleDimension(margin ?? m)],
    ["margin-x", handleDimension(marginX ?? mx)],
    ["margin-y", handleDimension(marginY ?? my)],
    ["margin-top", handleDimension(marginTop ?? mt)],
    ["margin-right", handleDimension(marginRight ?? mr)],
    ["margin-bottom", handleDimension(marginBottom ?? mb)],
    ["margin-left", handleDimension(marginLeft ?? ml)],
    ["display", handleDisplay(display)],
    ["position", position],
    ["overflow-x", overflowX],
    ["overflow-y", overflowY],
    ["z-index", zIndex],
    ["flex-grow", resolveFlexValue(flexGrow)],
    ["flex-shrink", resolveFlexValue(flexShrink)],
    ["flex-direction", handleFlexDirection(flexDirection)],
    ["flex-wrap", flexWrap === true ? "wrap" : flexWrap === false ? "nowrap" : flexWrap],
    ["justify-content", handleJustifyContent(justifyContent)],
    ["justify-self", justifySelf],
    ["align-items", handleAlignItems(alignItems)],
    ["align-content", handleAlignItems(alignContent)],
    ["align-self", handleAlignItems(alignSelf)],
    ["gap", handleDimension(gap)],
  ];

  const boxClassNames: string[] = [];
  const boxStyle: Record<string, string> = {};

  for (const [name, value] of entries) {
    if (value == null) continue;

    boxClassNames.push(name === "gap" && gapAxis ? `seed-box-${gapAxis}-gap` : `seed-box-${name}`);
    boxStyle[`--seed-box-${name}`] = String(value);
  }

  return {
    className: boxClassNames.length > 0 ? `seed-box ${boxClassNames.join(" ")}` : undefined,
    style: { ...boxStyle, ...style } as CSSProperties,
    restProps,
  };
}

export const useStyleProps = <T extends UseStyleProps>(
  props: T,
  options?: Pick<Parameters<typeof resolveBoxStyleProps>[1], "gapAxis">,
) => resolveBoxStyleProps(props, { ...useSafeArea(), ...options });

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
