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
} from "@seed-design/css/vars";
import { vars } from "@seed-design/css/vars";
import { forwardRef } from "react";

export function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-ignore
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

  // @ts-ignore
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

export function handlePaddingWithSafeArea(
  padding: string | 0 | undefined,
  direction: "top" | "bottom",
): string | undefined {
  if (padding === "safeArea") {
    return `var(--seed-safe-area-${direction})`;
  }

  const paddingValue = handleDimension(padding);

  return paddingValue;
}

function handleRadius(radius: string | 0 | undefined) {
  if (radius == null) {
    return undefined;
  }
  // @ts-ignore
  return vars.$radius[radius] ?? radius;
}

function handleGradient(gradientToken: string | undefined, direction: string | undefined) {
  if (!gradientToken || !direction) {
    return undefined;
  }

  // @ts-ignore
  const colorStops = vars.$gradient[gradientToken];
  if (!colorStops) {
    return undefined;
  }

  return `linear-gradient(${direction}, ${colorStops})`;
}

function handleDisplay(display: string | undefined) {
  if (!display) {
    return undefined;
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    if (display === "inlineFlex" || display === "inlineBlock") {
      console.warn(
        `[SEED Design System] ${display} is deprecated. Use inline-flex or inline-block instead.`,
      );
    }
  }

  return (
    {
      flex: "flex",
      inlineFlex: "inline-flex", // @deprecated Use `inline-flex` instead.
      inlineBlock: "inline-block", // @deprecated Use `inline-block` instead.
      none: "none",
    }[display] ?? display
  );
}

function handleFlexDirection(flexDirection: string | undefined) {
  if (!flexDirection) {
    return undefined;
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    if (flexDirection === "rowReverse" || flexDirection === "columnReverse") {
      console.warn(
        `[SEED Design System] ${flexDirection} is deprecated. Use row-reverse or column-reverse instead.`,
      );
    }
  }

  return (
    {
      row: "row",
      column: "column",
      rowReverse: "row-reverse", // @deprecated Use `row-reverse` instead.
      columnReverse: "column-reverse", // @deprecated Use `column-reverse` instead.
    }[flexDirection] ?? flexDirection
  );
}

function handleJustifyContent(justifyContent: string | undefined) {
  if (!justifyContent) {
    return undefined;
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    if (justifyContent === "flexStart" || justifyContent === "flexEnd") {
      console.warn(
        `[SEED Design System] ${justifyContent} is deprecated. Use flex-start or flex-end instead.`,
      );
    }
    if (justifyContent === "spaceBetween" || justifyContent === "spaceAround") {
      console.warn(
        `[SEED Design System] ${justifyContent} is deprecated. Use space-between or space-around instead.`,
      );
    }
  }

  return (
    {
      flexStart: "flex-start", // @deprecated Use `flex-start` instead.
      flexEnd: "flex-end", // @deprecated Use `flex-end` instead.
      center: "center",
      spaceBetween: "space-between", // @deprecated Use `space-between` instead.
      spaceAround: "space-around", // @deprecated Use `space-around` instead.
    }[justifyContent] ?? justifyContent
  );
}

function handleAlignItems(alignItems: string | undefined) {
  if (!alignItems) {
    return undefined;
  }

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    if (alignItems === "flexStart" || alignItems === "flexEnd") {
      console.warn(
        `[SEED Design System] ${alignItems} is deprecated. Use flex-start or flex-end instead.`,
      );
    }
  }

  return (
    {
      flexStart: "flex-start", // @deprecated Use `flex-start` instead.
      flexEnd: "flex-end", // @deprecated Use `flex-end` instead.
      center: "center",
      stretch: "stretch",
    }[alignItems] ?? alignItems
  );
}

export interface StyleProps {
  /**
   * Shorthand for `background`.
   */
  bg?: ScopedColorBg | ScopedColorPalette | (string & {});

  background?: ScopedColorBg | ScopedColorPalette | (string & {});

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

  /**
   * e.g. `43deg`
   */
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

  /**
   * Negative x-axis margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedX?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  /**
   * Negative y-axis margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedY?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  /**
   * Negative top margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedTop?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  /**
   * Negative right margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedRight?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  /**
   * Negative bottom margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedBottom?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  /**
   * Negative left margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedLeft?:
    | "asPadding"
    | Dimension
    | `spacingX.${SpacingX}`
    | `spacingY.${SpacingY}`
    | 0
    | (string & {});

  display?:
    | "block"
    | "flex"
    | "inline-flex"
    | "inline"
    | "inline-block"
    | "none"
    | "inlineFlex" // @deprecated Use `inline-flex` instead.
    | "inlineBlock"; // @deprecated Use `inline-block` instead.

  position?: "relative" | "absolute" | "fixed" | "sticky";

  overflowX?: "visible" | "hidden" | "scroll" | "auto";

  overflowY?: "visible" | "hidden" | "scroll" | "auto";

  zIndex?: number | (string & {});

  flexGrow?: 0 | 1 | (number & {});

  flexShrink?: 0 | (number & {});

  // Flex
  flexDirection?:
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse"
    | "rowReverse" // @deprecated Use `row-reverse` instead.
    | "columnReverse"; // @deprecated Use `column-reverse` instead.

  flexWrap?: "wrap" | "wrap-reverse" | "nowrap";

  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "flexStart" // @deprecated Use `flex-start` instead.
    | "flexEnd" // @deprecated Use `flex-end` instead.
    | "spaceBetween" // @deprecated Use `space-between` instead.
    | "spaceAround"; // @deprecated Use `space-around` instead.

  alignItems?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "flexStart" // @deprecated Use `flex-start` instead.
    | "flexEnd"; // @deprecated Use `flex-end` instead.

  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "flexStart" // @deprecated Use `flex-start` instead.
    | "flexEnd"; // @deprecated Use `flex-end` instead.

  alignSelf?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "flexStart" // @deprecated Use `flex-start` instead.
    | "flexEnd"; // @deprecated Use `flex-end` instead.

  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  // NOTE: Not sure how to treat transform/translate right now, mark as unstable until we have a better solution.
  unstable_transform?: string;

  _active?: {
    bg?: ScopedColorBg | ScopedColorPalette | (string & {});

    background?: ScopedColorBg | ScopedColorPalette | (string & {});
  };
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
    alignItems,
    alignContent,
    alignSelf,
    gap,
    unstable_transform,
    _active,
    style,
    ...restProps
  } = props;

  const gradientValue = handleGradient(
    bgGradient ?? backgroundGradient,
    bgGradientDirection ?? backgroundGradientDirection,
  );

  return {
    style: {
      "--seed-box-background": handleColor(background ?? bg) ?? gradientValue,
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
      "--seed-box-display": handleDisplay(display),
      "--seed-box-position": position,
      "--seed-box-overflow-x": overflowX,
      "--seed-box-overflow-y": overflowY,
      "--seed-box-z-index": zIndex,
      "--seed-box-flex-grow": flexGrow,
      "--seed-box-flex-shrink": flexShrink,
      "--seed-box-flex-direction": handleFlexDirection(flexDirection),
      "--seed-box-flex-wrap": flexWrap,
      "--seed-box-justify-content": handleJustifyContent(justifyContent),
      "--seed-box-align-items": handleAlignItems(alignItems),
      "--seed-box-align-content": handleAlignItems(alignContent),
      "--seed-box-align-self": handleAlignItems(alignSelf),
      "--seed-box-unstable-transform": unstable_transform,

      // Active
      "--seed-box-background--active": handleColor(_active?.bg ?? _active?.background),
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
