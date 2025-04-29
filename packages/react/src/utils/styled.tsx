import type {
  Dimension,
  Radius,
  ScopedColorBg,
  ScopedColorFg,
  ScopedColorPalette,
  ScopedColorStroke,
  SpacingX,
  SpacingY,
} from "@seed-design/css/vars";
import { vars } from "@seed-design/css/vars";
import clsx from "clsx";
import { forwardRef } from "react";

/**
 * variable handlers
 */

export function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-ignore
  return vars.$color[type]?.[value] ?? color;
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

/**
 * className handlers
 */

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

  return {
    inlineFlex: "seed-inline-flex", // @deprecated Use `inline-flex` instead.
    inlineBlock: "seed-inline-block", // @deprecated Use `inline-block` instead.
    flex: "seed-flex",
    none: "seed-none",
    "inline-flex": "seed-inline-flex",
    "inline-block": "seed-inline-block",
  }[display];
}

function handleOverflow(overflow: string | undefined) {
  if (!overflow) {
    return undefined;
  }

  return {
    visible: "seed-overflow-visible",
    hidden: "seed-overflow-hidden",
    scroll: "seed-overflow-scroll",
    auto: "seed-overflow-auto",
  }[overflow];
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

  return {
    rowReverse: "seed-flex-row-reverse", // @deprecated Use `row-reverse` instead.
    columnReverse: "seed-flex-column-reverse", // @deprecated Use `column-reverse` instead.
    row: "seed-flex-row",
    column: "seed-flex-column",
    "row-reverse": "seed-flex-row-reverse",
    "column-reverse": "seed-flex-column-reverse",
  }[flexDirection];
}

function handleFlexWrap(flexWrap: string | undefined) {
  if (!flexWrap) {
    return undefined;
  }

  return {
    wrap: "seed-flex-wrap",
    "wrap-reverse": "seed-flex-wrap-reverse",
    nowrap: "seed-flex-nowrap",
  }[flexWrap];
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

  return {
    flexStart: "seed-flex-start", // @deprecated Use `flex-start` instead.
    flexEnd: "seed-flex-end", // @deprecated Use `flex-end` instead.
    spaceBetween: "seed-space-between", // @deprecated Use `space-between` instead.
    spaceAround: "seed-space-around", // @deprecated Use `space-around` instead.
    "flex-start": "seed-flex-start",
    "flex-end": "seed-flex-end",
    "space-between": "seed-space-between",
    "space-around": "seed-space-around",
    center: "seed-center",
  }[justifyContent];
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

  return {
    flexStart: "seed-flex-start", // @deprecated Use `flex-start` instead.
    flexEnd: "seed-flex-end", // @deprecated Use `flex-end` instead.
    "flex-start": "seed-flex-start",
    "flex-end": "seed-flex-end",
    center: "seed-center",
    stretch: "seed-self-stretch",
  }[alignItems];
}

export interface StyleProps {
  background?: ScopedColorBg | ScopedColorPalette | (string & {});

  /**
   * Shorthand for `background`.
   */
  bg?: ScopedColorBg | ScopedColorPalette | (string & {});

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

  paddingTop?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingTop`.
   */
  pt?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingRight?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingRight`.
   */
  pr?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingBottom?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingBottom`.
   */
  pb?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  paddingLeft?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

  /**
   * Shorthand for `paddingLeft`.
   */
  pl?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});

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

  alignSelf?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "flexStart" // @deprecated Use `flex-start` instead.
    | "flexEnd"; // @deprecated Use `flex-end` instead.

  gap?: Dimension | `spacingX.${SpacingX}` | `spacingY.${SpacingY}` | 0 | (string & {});
}

interface CreateStyleProps extends StyleProps {
  style?: React.CSSProperties;
  className?: string;
}

export function createStyleProps<T extends CreateStyleProps>(
  props: T,
): {
  style: React.CSSProperties;
  className: string;
  restProps: Omit<T, keyof CreateStyleProps>;
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
    flexGrow,
    flexShrink,
    gap,
    // classNames
    display,
    position,
    overflowX,
    overflowY,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    alignSelf,
    // props
    style,
    className,
    ...restProps
  } = props;

  const variableObj = {
    "--seed-box-background": handleColor(background ?? bg),
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
    "--seed-box-width": handleDimension(width),
    "--seed-box-min-width": handleDimension(minWidth),
    "--seed-box-max-width": handleDimension(maxWidth),
    "--seed-box-height": handleDimension(height),
    "--seed-box-min-height": handleDimension(minHeight),
    "--seed-box-max-height": handleDimension(maxHeight),
    "--seed-box-padding": handleDimension(padding ?? p),
    "--seed-box-padding-top": handleDimension(paddingTop ?? pt ?? paddingY ?? py),
    "--seed-box-padding-right": handleDimension(paddingRight ?? pr ?? paddingX ?? px),
    "--seed-box-padding-bottom": handleDimension(paddingBottom ?? pb ?? paddingY ?? py),
    "--seed-box-padding-left": handleDimension(paddingLeft ?? pl ?? paddingX ?? px),
    "--seed-box-top": top,
    "--seed-box-left": left,
    "--seed-box-right": right,
    "--seed-box-bottom": bottom,
    "--seed-box-flex-grow": flexGrow,
    "--seed-box-flex-shrink": flexShrink,
  } as Record<string, string | number | undefined>;

  const variableResult: Record<string, string | number | undefined> = {};
  for (const key in variableObj) {
    if (variableObj[key] !== undefined) {
      variableResult[key] = variableObj[key];
    }
  }

  const classNames = [
    handleDisplay(display),
    handleOverflow(overflowX),
    handleOverflow(overflowY),
    handleFlexDirection(flexDirection),
    handleFlexWrap(flexWrap),
    handleJustifyContent(justifyContent),
    handleAlignItems(alignItems),
    handleAlignItems(alignSelf),
    variableResult["--seed-box-background"] && "seed-box-background",
    variableResult["--seed-box-color"] && "seed-box-color",
    variableResult["--seed-box-border-color"] && "seed-box-border-color",
    variableResult["--seed-box-padding"] && "seed-box-padding",
    variableResult["--seed-box-padding-top"] && "seed-box-padding-top",
    variableResult["--seed-box-padding-bottom"] && "seed-box-padding-bottom",
    variableResult["--seed-box-padding-left"] && "seed-box-padding-left",
    variableResult["--seed-box-padding-right"] && "seed-box-padding-right",
    variableResult["--seed-box-radius"] && "seed-box-radius",
    variableResult["--seed-box-radius-top-left"] && "seed-box-radius-top-left",
    variableResult["--seed-box-radius-top-right"] && "seed-box-radius-top-right",
    variableResult["--seed-box-radius-bottom-right"] && "seed-box-radius-bottom-right",
    variableResult["--seed-box-radius-bottom-left"] && "seed-box-radius-bottom-left",
    variableResult["--seed-box-border-width"] && "seed-box-border",
    variableResult["--seed-box-border-top-width"] && "seed-box-border-top",
    variableResult["--seed-box-border-right-width"] && "seed-box-border-right",
    variableResult["--seed-box-border-bottom-width"] && "seed-box-border-bottom",
    variableResult["--seed-box-border-left-width"] && "seed-box-border-left",
    variableResult["--seed-box-width"] && "seed-box-width",
    variableResult["--seed-box-min-width"] && "seed-box-min-width",
    variableResult["--seed-box-max-width"] && "seed-box-max-width",
    variableResult["--seed-box-height"] && "seed-box-height",
    variableResult["--seed-box-min-height"] && "seed-box-min-height",
    variableResult["--seed-box-max-height"] && "seed-box-max-height",
    (variableResult["--seed-box-top"] ||
      variableResult["--seed-box-left"] ||
      variableResult["--seed-box-right"] ||
      variableResult["--seed-box-bottom"]) &&
      "seed-box-inset",
    variableResult["--seed-box-flex-grow"] && "seed-box-flex-grow",
    variableResult["--seed-box-flex-shrink"] && "seed-box-flex-shrink",

    // default border style
    (variableResult["--seed-box-border-width"] ||
      variableResult["--seed-box-border-top-width"] ||
      variableResult["--seed-box-border-right-width"] ||
      variableResult["--seed-box-border-bottom-width"] ||
      variableResult["--seed-box-border-left-width"]) &&
      "seed-border-solid",
  ].filter(Boolean);

  return {
    style: style
      ? {
          ...variableResult,
          ...style,
        }
      : variableResult,
    className: clsx(classNames, className),
    restProps,
  };
}

export function withStyleProps<P extends {}, R>(
  Component: React.ComponentType<P & React.RefAttributes<R>>,
) {
  const Node = forwardRef<R, P>((props, ref) => {
    const { style, className, restProps } = createStyleProps(props);

    // @ts-ignore
    return <Component ref={ref} className={className} style={style} {...restProps} />;
  });

  Node.displayName = Component.displayName || Component.name;

  return Node;
}
