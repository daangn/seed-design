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
} from "@ride-developer/css/vars";
import { vars } from "@ride-developer/css/vars";
import { forwardRef } from "react";

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
    return `var(--ride-box-padding-${direction})`;
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
    return `var(--ride-safe-area-${direction})`;
  }

  const paddingValue = handleDimension(padding);

  return paddingValue;
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

function handleDisplay(display: string | undefined) {
  if (!display) {
    return undefined;
  }

  if (process.env.NODE_ENV !== "production") {
    if (display === "inlineFlex" || display === "inlineBlock") {
      console.warn(
        `[Ride Design System] display='${display}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use display='${display === "inlineFlex" ? "inline-flex" : "inline-block"}' instead.`,
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

  if (process.env.NODE_ENV !== "production") {
    if (flexDirection === "rowReverse" || flexDirection === "columnReverse") {
      console.warn(
        `[Ride Design System] flexDirection='${flexDirection}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use flexDirection='${flexDirection === "rowReverse" ? "row-reverse" : "column-reverse"}' instead.`,
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

  if (process.env.NODE_ENV !== "production") {
    if (justifyContent === "flexStart" || justifyContent === "flexEnd") {
      console.warn(
        `[Ride Design System] justifyContent='${justifyContent}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use justifyContent='${justifyContent === "flexStart" ? "flex-start" : "flex-end"}' instead.`,
      );
    }
    if (justifyContent === "spaceBetween" || justifyContent === "spaceAround") {
      console.warn(
        `[Ride Design System] justifyContent='${justifyContent}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use justifyContent='${justifyContent === "spaceBetween" ? "space-between" : "space-around"}' instead.`,
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

  if (process.env.NODE_ENV !== "production") {
    if (alignItems === "flexStart" || alignItems === "flexEnd") {
      console.warn(
        `[Ride Design System] alignItems='${alignItems}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use alignItems='${alignItems === "flexStart" ? "flex-start" : "flex-end"}' instead.`,
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

  /**
   * If true, flex-grow will be set to `1`.
   */
  flexGrow?: 0 | 1 | (number & {}) | true;

  /**
   * If true, flex-shrink will be set to `1`.
   */
  flexShrink?: 0 | (number & {}) | true;

  // Flex
  flexDirection?:
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse"
    | "rowReverse" // @deprecated Use `row-reverse` instead.
    | "columnReverse"; // @deprecated Use `column-reverse` instead.

  /**
   * If true, flex-wrap will be set to `wrap`.
   */
  flexWrap?: "wrap" | "wrap-reverse" | "nowrap" | true;

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

  /**
   * In flexbox layout, this property is ignored.
   */
  justifySelf?: "center" | "start" | "end" | "stretch";

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

  // Grid Item
  // NOTE: gridArea는 지원하지 않습니다.
  // grid-area가 grid-column/row의 shorthand이므로 CSS 변수로 동시에 바인딩하면 충돌합니다.
  gridColumn?: string;

  gridRow?: string;

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
    gridColumn,
    gridRow,
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
      "--ride-box-background": handleColor(background ?? bg) ?? gradientValue,
      "--ride-box-color": handleColor(color),
      "--ride-box-border-color": handleColor(borderColor),
      "--ride-box-border-width": borderWidth !== undefined ? `${borderWidth}px` : undefined,
      "--ride-box-border-top-width":
        borderTopWidth !== undefined ? `${borderTopWidth}px` : undefined,
      "--ride-box-border-right-width":
        borderRightWidth !== undefined ? `${borderRightWidth}px` : undefined,
      "--ride-box-border-bottom-width":
        borderBottomWidth !== undefined ? `${borderBottomWidth}px` : undefined,
      "--ride-box-border-left-width":
        borderLeftWidth !== undefined ? `${borderLeftWidth}px` : undefined,
      "--ride-box-border-radius": handleRadius(borderRadius),
      "--ride-box-border-top-left-radius": handleRadius(borderTopLeftRadius),
      "--ride-box-border-top-right-radius": handleRadius(borderTopRightRadius),
      "--ride-box-border-bottom-right-radius": handleRadius(borderBottomRightRadius),
      "--ride-box-border-bottom-left-radius": handleRadius(borderBottomLeftRadius),
      "--ride-box-box-shadow": handleShadow(boxShadow),
      "--ride-box-width": handleDimension(width),
      "--ride-box-min-width": handleDimension(minWidth),
      "--ride-box-max-width": handleDimension(maxWidth),
      "--ride-box-height": handleDimension(height),
      "--ride-box-min-height": handleDimension(minHeight),
      "--ride-box-max-height": handleDimension(maxHeight),
      "--ride-box-padding": handleDimension(padding ?? p),
      "--ride-box-padding-x": handleDimension(paddingX ?? px),
      "--ride-box-padding-y": handleDimension(paddingY ?? py),
      "--ride-box-padding-top": handlePaddingWithSafeArea(paddingTop ?? pt, "top"),
      "--ride-box-padding-right": handleDimension(paddingRight ?? pr),
      "--ride-box-padding-bottom": handlePaddingWithSafeArea(paddingBottom ?? pb, "bottom"),
      "--ride-box-padding-left": handleDimension(paddingLeft ?? pl),
      "--ride-box-bleed-top": handleBleed(bleedTop ?? bleedY, "top"),
      "--ride-box-bleed-right": handleBleed(bleedRight ?? bleedX, "right"),
      "--ride-box-bleed-bottom": handleBleed(bleedBottom ?? bleedY, "bottom"),
      "--ride-box-bleed-left": handleBleed(bleedLeft ?? bleedX, "left"),
      "--ride-box-top": top,
      "--ride-box-left": left,
      "--ride-box-right": right,
      "--ride-box-bottom": bottom,
      "--ride-box-gap": handleDimension(gap),
      "--ride-box-display": handleDisplay(display),
      "--ride-box-position": position,
      "--ride-box-overflow-x": overflowX,
      "--ride-box-overflow-y": overflowY,
      "--ride-box-z-index": zIndex,
      "--ride-box-flex-grow": flexGrow === true ? 1 : flexGrow,
      "--ride-box-flex-shrink": flexShrink === true ? 1 : flexShrink,
      "--ride-box-flex-direction": handleFlexDirection(flexDirection),
      "--ride-box-flex-wrap": flexWrap === true ? "wrap" : flexWrap,
      "--ride-box-justify-content": handleJustifyContent(justifyContent),
      "--ride-box-justify-self": justifySelf,
      "--ride-box-align-items": handleAlignItems(alignItems),
      "--ride-box-align-content": handleAlignItems(alignContent),
      "--ride-box-align-self": handleAlignItems(alignSelf),
      "--ride-box-grid-column": gridColumn,
      "--ride-box-grid-row": gridRow,
      "--ride-box-unstable-transform": unstable_transform,

      // Active
      "--ride-box-background--active": handleColor(_active?.bg ?? _active?.background),
      ...style,
    } as React.CSSProperties,
    restProps: {
      ...restProps,

      // see global.ts to understand why we need this
      ...((_active?.bg != null || _active?.background != null) && { "data-has-active-bg": "" }),
    },
  };
}

export function withStyleProps<P extends {}, R>(
  Component: React.ComponentType<P & React.RefAttributes<R>>,
) {
  const Node = forwardRef<R, P>((props, ref) => {
    const { style, restProps } = useStyleProps(props);

    // @ts-expect-error
    return <Component ref={ref} style={style} {...restProps} />;
  });

  Node.displayName = Component.displayName || Component.name;

  return Node;
}
