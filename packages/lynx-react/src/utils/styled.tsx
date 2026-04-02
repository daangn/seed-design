/**
 * StyleProps utilities for Lynx.
 * Based on packages/react/src/utils/styled.tsx, adapted for Lynx environment.
 */
import { dynamicStyle } from "./dynamic-style";
import type {
  ScopedColorBg,
  ScopedColorFg,
  ScopedColorPalette,
  ScopedColorStroke,
  Dimension,
  Radius,
  SpacingX,
  SpacingY,
  Gradient,
  Shadow,
  ScopedColorBanner,
} from "@seed-design/css/vars";
import { vars } from "@seed-design/css/vars";

export function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-expect-error
  return vars.$color[type]?.[value] ?? color;
}

export function handleDimension(dimension: string | 0 | undefined): string | undefined {
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

  // @ts-expect-error
  return vars.$dimension[dimension] ?? vars.$dimension[type]?.[value] ?? dimension;
}

function handleBleed(
  dimension: "asPadding" | string | 0 | undefined,
  direction: "top" | "right" | "bottom" | "left",
) {
  if (dimension === "asPadding") {
    return `var(--seed-box-padding-${direction})`;
  }

  return handleDimension(dimension);
}

function handleShadow(shadow: Shadow | (string & {}) | undefined) {
  if (!shadow) {
    return undefined;
  }

  // @ts-expect-error
  return vars.$shadow[shadow] ?? shadow;
}

export function handlePaddingWithSafeArea(
  padding: string | 0 | undefined,
  direction: "top" | "bottom",
): string | undefined {
  if (padding === "safeArea") {
    return `var(--seed-safe-area-${direction})`;
  }

  return handleDimension(padding);
}

export function handleRadius(radius: string | 0 | undefined) {
  if (radius == null) {
    return undefined;
  }
  // @ts-expect-error
  return vars.$radius[radius] ?? radius;
}

function handleGradient(gradientToken: string | undefined, direction: string | undefined) {
  if (!gradientToken || !direction) {
    return undefined;
  }

  // @ts-expect-error
  const colorStops = vars.$gradient[gradientToken];
  if (!colorStops) {
    return undefined;
  }

  return `linear-gradient(${direction}, ${colorStops})`;
}

export interface StyleProps {
  /**
   * Shorthand for `background`.
   */
  bg?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});

  background?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});

  /**
   * Shorthand for `backgroundGradient`.
   */
  bgGradient?: Gradient;

  backgroundGradient?: Gradient;

  /**
   * Shorthand for `backgroundGradientDirection`.
   * e.g. `43deg`
   */
  bgGradientDirection?:
    | "to right"
    | "to left"
    | "to top"
    | "to bottom"
    | "to top right"
    | "to top left"
    | "to bottom right"
    | "to bottom left"
    | (string & {});

  backgroundGradientDirection?:
    | "to right"
    | "to left"
    | "to top"
    | "to bottom"
    | "to top right"
    | "to top left"
    | "to bottom right"
    | "to bottom left"
    | (string & {});

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

  boxShadow?: Shadow | (string & {});

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

  /**
   * Shorthand for `padding`.
   */
  p?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingX?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingX`.
   */
  px?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingY?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingY`.
   */
  py?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingTop?:
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | "safeArea"
    | (string & {});

  /**
   * Shorthand for `paddingTop`.
   */
  pt?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {});

  paddingRight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingRight`.
   */
  pr?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingBottom?:
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | "safeArea"
    | (string & {});

  /**
   * Shorthand for `paddingBottom`.
   */
  pb?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {});

  paddingLeft?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingLeft`.
   */
  pl?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  bleedX?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  bleedY?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  bleedTop?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  bleedRight?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  bleedBottom?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  bleedLeft?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  display?: "flex" | "none" | "block";

  position?: "relative" | "absolute" | "fixed" | "sticky";

  overflowX?: "visible" | "hidden";

  overflowY?: "visible" | "hidden";

  zIndex?: number | (string & {});

  /**
   * If true, flex-grow will be set to `1`.
   */
  flexGrow?: 0 | 1 | (number & {}) | true;

  /**
   * If true, flex-shrink will be set to `1`.
   */
  flexShrink?: 0 | (number & {}) | true;

  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";

  /**
   * If true, flex-wrap will be set to `wrap`.
   */
  flexWrap?: "wrap" | "wrap-reverse" | "nowrap" | true;

  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";

  justifySelf?: "center" | "start" | "end" | "stretch";

  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";

  alignContent?: "flex-start" | "flex-end" | "center" | "stretch";

  alignSelf?: "flex-start" | "flex-end" | "center" | "stretch";

  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
}

interface UseStyleProps extends StyleProps {
  style?: React.CSSProperties;
}

export function useStyleProps<T extends UseStyleProps>(
  props: T,
): {
  style: string;
  restProps: Omit<T, keyof UseStyleProps>;
} {
  const {
    background,
    bg,
    bgGradient,
    backgroundGradient,
    bgGradientDirection,
    backgroundGradientDirection,
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
    boxShadow,
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

  const gradientValue = handleGradient(
    bgGradient ?? backgroundGradient,
    bgGradientDirection ?? backgroundGradientDirection,
  );

  const rawStyle: Record<string, unknown> = {
    "--seed-box-background": handleColor(background ?? bg) ?? gradientValue,
    "--seed-box-color": handleColor(color),
    "--seed-box-border-color": handleColor(borderColor),
    "--seed-box-border-width": borderWidth !== undefined ? `${borderWidth}px` : undefined,
    "--seed-box-border-top-width": borderTopWidth !== undefined ? `${borderTopWidth}px` : undefined,
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
    "--seed-box-box-shadow": handleShadow(boxShadow),
    "--seed-box-width": handleDimension(width),
    "--seed-box-min-width": handleDimension(minWidth),
    "--seed-box-max-width": handleDimension(maxWidth),
    "--seed-box-height": handleDimension(height),
    "--seed-box-min-height": handleDimension(minHeight),
    "--seed-box-max-height": handleDimension(maxHeight),
    "--seed-box-padding": handleDimension(padding ?? p),
    "--seed-box-padding-x": handleDimension(paddingX ?? px),
    "--seed-box-padding-y": handleDimension(paddingY ?? py),
    "--seed-box-padding-top": handlePaddingWithSafeArea(paddingTop ?? pt, "top"),
    "--seed-box-padding-right": handleDimension(paddingRight ?? pr),
    "--seed-box-padding-bottom": handlePaddingWithSafeArea(paddingBottom ?? pb, "bottom"),
    "--seed-box-padding-left": handleDimension(paddingLeft ?? pl),
    "--seed-box-bleed-top": handleBleed(bleedTop ?? bleedY, "top"),
    "--seed-box-bleed-right": handleBleed(bleedRight ?? bleedX, "right"),
    "--seed-box-bleed-bottom": handleBleed(bleedBottom ?? bleedY, "bottom"),
    "--seed-box-bleed-left": handleBleed(bleedLeft ?? bleedX, "left"),
    "--seed-box-top": top,
    "--seed-box-left": left,
    "--seed-box-right": right,
    "--seed-box-bottom": bottom,
    "--seed-box-gap": handleDimension(gap),
    "--seed-box-display": display,
    "--seed-box-position": position,
    "--seed-box-overflow-x": overflowX,
    "--seed-box-overflow-y": overflowY,
    "--seed-box-z-index": zIndex,
    "--seed-box-flex-grow": flexGrow === true ? 1 : flexGrow,
    "--seed-box-flex-shrink": flexShrink === true ? 1 : flexShrink,
    "--seed-box-flex-direction": flexDirection,
    "--seed-box-flex-wrap": flexWrap === true ? "wrap" : flexWrap,
    "--seed-box-justify-content": justifyContent,
    "--seed-box-justify-self": justifySelf,
    "--seed-box-align-items": alignItems,
    "--seed-box-align-content": alignContent,
    "--seed-box-align-self": alignSelf,
    ...style,
  };

  return {
    style: dynamicStyle(rawStyle),
    restProps: restProps as Omit<T, keyof UseStyleProps>,
  };
}
