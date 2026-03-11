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
import { forwardRef } from "react";
import { type ResponsiveValue, isResponsiveObject } from "../types/responsive";

export function resolveResponsive<T>(
  varName: string,
  value: ResponsiveValue<T>,
  transform: (v: T) => string | number | undefined,
): Record<string, string | number> {
  if (!isResponsiveObject(value)) {
    const transformed = transform(value);
    if (transformed === undefined) return {};

    return { [`${varName}-base`]: transformed };
  }

  const result: Record<string, string | number> = {};

  for (const [breakpoint, breakpointValue] of Object.entries(value)) {
    if (breakpointValue === undefined) continue;

    const transformed = transform(breakpointValue);

    if (transformed === undefined) continue;

    result[`${varName}-${breakpoint}`] = transformed;
  }

  return result;
}

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

function handlePaddingWithSafeArea(
  padding: string | 0 | undefined,
  direction: "top" | "bottom",
): string | undefined {
  if (padding === "safeArea") {
    return `var(--seed-safe-area-${direction})`;
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
        `[SEED Design System] display='${display}' is deprecated and will be removed in @seed-design/react@1.3.0. Use display='${display === "inlineFlex" ? "inline-flex" : "inline-block"}' instead.`,
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
        `[SEED Design System] flexDirection='${flexDirection}' is deprecated and will be removed in @seed-design/react@1.3.0. Use flexDirection='${flexDirection === "rowReverse" ? "row-reverse" : "column-reverse"}' instead.`,
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
        `[SEED Design System] justifyContent='${justifyContent}' is deprecated and will be removed in @seed-design/react@1.3.0. Use justifyContent='${justifyContent === "flexStart" ? "flex-start" : "flex-end"}' instead.`,
      );
    }
    if (justifyContent === "spaceBetween" || justifyContent === "spaceAround") {
      console.warn(
        `[SEED Design System] justifyContent='${justifyContent}' is deprecated and will be removed in @seed-design/react@1.3.0. Use justifyContent='${justifyContent === "spaceBetween" ? "space-between" : "space-around"}' instead.`,
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
        `[SEED Design System] alignItems='${alignItems}' is deprecated and will be removed in @seed-design/react@1.3.0. Use alignItems='${alignItems === "flexStart" ? "flex-start" : "flex-end"}' instead.`,
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

  width?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  minWidth?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  maxWidth?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  height?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  minHeight?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  maxHeight?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | "full" | (string & {})
  >;

  top?: 0 | (string & {});

  left?: 0 | (string & {});

  right?: 0 | (string & {});

  bottom?: 0 | (string & {});

  padding?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Shorthand for `padding`.
   */
  p?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  paddingX?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Shorthand for `paddingX`.
   */
  px?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  paddingY?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Shorthand for `paddingY`.
   */
  py?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  paddingTop?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {})
  >;

  /**
   * Shorthand for `paddingTop`.
   */
  pt?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {})
  >;

  paddingRight?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Shorthand for `paddingRight`.
   */
  pr?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  paddingBottom?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {})
  >;

  /**
   * Shorthand for `paddingBottom`.
   */
  pb?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | "safeArea" | (string & {})
  >;

  paddingLeft?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Shorthand for `paddingLeft`.
   */
  pl?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative x-axis margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedX?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative y-axis margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedY?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative top margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedTop?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative right margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedRight?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative bottom margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedBottom?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  /**
   * Negative left margin to extend the element outside its parent.
   * If set to "asPadding", it will use the padding value in the same direction.
   */
  bleedLeft?: ResponsiveValue<
    "asPadding" | Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

  display?: ResponsiveValue<
    | "block"
    | "flex"
    | "inline-flex"
    | "inline"
    | "inline-block"
    | "none"
    | "inlineFlex" // @deprecated Use `inline-flex` instead.
    | "inlineBlock" // @deprecated Use `inline-block` instead.
  >;

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
  flexDirection?: ResponsiveValue<
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse"
    | "rowReverse" // @deprecated Use `row-reverse` instead.
    | "columnReverse" // @deprecated Use `column-reverse` instead.
  >;

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

  gap?: ResponsiveValue<
    Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {})
  >;

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
      // Non-responsive props
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
      "--seed-box-box-shadow": handleShadow(boxShadow),
      "--seed-box-top": top,
      "--seed-box-left": left,
      "--seed-box-right": right,
      "--seed-box-bottom": bottom,
      "--seed-box-position": position,
      "--seed-box-overflow-x": overflowX,
      "--seed-box-overflow-y": overflowY,
      "--seed-box-z-index": zIndex,
      "--seed-box-flex-grow": flexGrow === true ? 1 : flexGrow,
      "--seed-box-flex-shrink": flexShrink === true ? 1 : flexShrink,
      "--seed-box-flex-wrap": flexWrap === true ? "wrap" : flexWrap,
      "--seed-box-justify-content": handleJustifyContent(justifyContent),
      "--seed-box-justify-self": justifySelf,
      "--seed-box-align-items": handleAlignItems(alignItems),
      "--seed-box-align-content": handleAlignItems(alignContent),
      "--seed-box-align-self": handleAlignItems(alignSelf),
      "--seed-box-grid-column": gridColumn,
      "--seed-box-grid-row": gridRow,
      "--seed-box-unstable-transform": unstable_transform,

      // Active
      "--seed-box-background--active": handleColor(_active?.bg ?? _active?.background),

      // Responsive props (breakpoint-suffixed)
      ...(width !== undefined && resolveResponsive("--seed-box-width", width, handleDimension)),
      ...(minWidth !== undefined &&
        resolveResponsive("--seed-box-min-width", minWidth, handleDimension)),
      ...(maxWidth !== undefined &&
        resolveResponsive("--seed-box-max-width", maxWidth, handleDimension)),
      ...(height !== undefined && resolveResponsive("--seed-box-height", height, handleDimension)),
      ...(minHeight !== undefined &&
        resolveResponsive("--seed-box-min-height", minHeight, handleDimension)),
      ...(maxHeight !== undefined &&
        resolveResponsive("--seed-box-max-height", maxHeight, handleDimension)),
      ...((padding ?? p) !== undefined &&
        resolveResponsive("--seed-box-padding", padding ?? p, handleDimension)),
      ...((paddingX ?? px) !== undefined &&
        resolveResponsive("--seed-box-padding-x", paddingX ?? px, handleDimension)),
      ...((paddingY ?? py) !== undefined &&
        resolveResponsive("--seed-box-padding-y", paddingY ?? py, handleDimension)),
      ...((paddingTop ?? pt) !== undefined &&
        resolveResponsive("--seed-box-padding-top", paddingTop ?? pt, (v) =>
          handlePaddingWithSafeArea(v, "top"),
        )),
      ...((paddingRight ?? pr) !== undefined &&
        resolveResponsive("--seed-box-padding-right", paddingRight ?? pr, handleDimension)),
      ...((paddingBottom ?? pb) !== undefined &&
        resolveResponsive("--seed-box-padding-bottom", paddingBottom ?? pb, (v) =>
          handlePaddingWithSafeArea(v, "bottom"),
        )),
      ...((paddingLeft ?? pl) !== undefined &&
        resolveResponsive("--seed-box-padding-left", paddingLeft ?? pl, handleDimension)),
      ...((bleedTop ?? bleedY) !== undefined &&
        resolveResponsive("--seed-box-bleed-top", bleedTop ?? bleedY, (v) =>
          handleBleed(v, "top"),
        )),
      ...((bleedRight ?? bleedX) !== undefined &&
        resolveResponsive("--seed-box-bleed-right", bleedRight ?? bleedX, (v) =>
          handleBleed(v, "right"),
        )),
      ...((bleedBottom ?? bleedY) !== undefined &&
        resolveResponsive("--seed-box-bleed-bottom", bleedBottom ?? bleedY, (v) =>
          handleBleed(v, "bottom"),
        )),
      ...((bleedLeft ?? bleedX) !== undefined &&
        resolveResponsive("--seed-box-bleed-left", bleedLeft ?? bleedX, (v) =>
          handleBleed(v, "left"),
        )),
      ...(gap !== undefined && resolveResponsive("--seed-box-gap", gap, handleDimension)),
      ...(display !== undefined && resolveResponsive("--seed-box-display", display, handleDisplay)),
      ...(flexDirection !== undefined &&
        resolveResponsive("--seed-box-flex-direction", flexDirection, handleFlexDirection)),
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
