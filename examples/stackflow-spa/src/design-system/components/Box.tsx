import React, { forwardRef } from "react";

export type Element = "div" | "span" | "section" | "legend" | "ul" | "li";

type ColorBg = string;
type ColorStroke = string;
type Unit = string;
type Radii = string;
type LineStyles = "solid" | "dashed";
type Overflow = "hidden" | "scroll" | "clip";
type Position = "relative" | "absolute" | "fixed" | "sticky";

export interface BoxProps extends React.AriaAttributes {
  children?: React.ReactNode;
  /** HTML Element type
   * @default 'div'
   */
  as?: Element;
  /** Background color */
  background?: ColorBg;
  /** Border color */
  borderColor?: ColorStroke | "transparent";
  /** Border style */
  borderStyle?: LineStyles;
  /** Border radius */
  borderRadius?: Radii;
  /** Vertical end horizontal start border radius */
  borderEndStartRadius?: Radii;
  /** Vertical end horizontal end border radius */
  borderEndEndRadius?: Radii;
  /** Vertical start horizontal start border radius */
  borderStartStartRadius?: Radii;
  /** Vertical start horizontal end border radius */
  borderStartEndRadius?: Radii;
  /** Border width */
  borderWidth?: string;
  /** Vertical start border width */
  borderBlockStartWidth?: string;
  /** Vertical end border width */
  borderBlockEndWidth?: string;
  /** Horizontal start border width */
  borderInlineStartWidth?: string;
  /** Horizontal end border width */
  borderInlineEndWidth?: string;
  /** HTML id attribute */
  id?: string;
  /** Minimum height of container */
  minHeight?: Unit;
  /** Minimum width of container */
  minWidth?: Unit;
  /** Maximum width of container */
  maxWidth?: Unit;
  /** Clip horizontal content of children */
  overflowX?: Overflow;
  /** Clip vertical content of children */
  overflowY?: Overflow;
  /** Spacing around children. */
  padding?: Unit;
  /** Vertical start and end spacing around children. */
  paddingBlock?: Unit;
  /** Vertical start spacing around children. */
  paddingBlockStart?: Unit;
  /** Vertical end spacing around children. */
  paddingBlockEnd?: Unit;
  /** Horizontal start and end spacing around children. */
  paddingInline?: Unit;
  /** Horizontal start spacing around children. */
  paddingInlineStart?: Unit;
  /** Horizontal end spacing around children. */
  paddingInlineEnd?: Unit;
  /** Aria role */
  role?: Extract<
    React.AriaRole,
    "status" | "presentation" | "menu" | "listbox" | "combobox" | "group"
  >;
  /** Set tab order */
  tabIndex?: Extract<React.AllHTMLAttributes<HTMLElement>["tabIndex"], number>;
  /** Width of container */
  width?: string;
  /** Position of box */
  position?: Position;
  /** Top position of box */
  insetBlockStart?: Unit;
  /** Bottom position of box */
  insetBlockEnd?: Unit;
  /** Left position of box */
  insetInlineStart?: Unit;
  /** Right position of box */
  insetInlineEnd?: Unit;
  /** Opacity of box */
  opacity?: string;
  /** z-index of box */
  zIndex?: string;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      as = "div",
      background,
      borderColor,
      borderStyle,
      borderWidth,
      borderBlockStartWidth,
      borderBlockEndWidth,
      borderInlineStartWidth,
      borderInlineEndWidth,
      borderRadius,
      borderEndStartRadius,
      borderEndEndRadius,
      borderStartStartRadius,
      borderStartEndRadius,
      children,
      id,
      minHeight,
      minWidth,
      maxWidth,
      overflowX,
      overflowY,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      role,
      tabIndex,
      width,
      position,
      insetBlockStart,
      insetBlockEnd,
      insetInlineStart,
      insetInlineEnd,
      zIndex,
      opacity,
      ...restProps
    },
    ref,
  ) => {
    const borderStyleValue = borderStyle
      ? borderStyle
      : borderColor ||
          borderWidth ||
          borderBlockStartWidth ||
          borderBlockEndWidth ||
          borderInlineStartWidth ||
          borderInlineEndWidth
        ? "solid"
        : undefined;

    const style = {
      "--seed-box-background": background ? `var(--p-color-${background})` : undefined,
      "--seed-box-border-color": borderColor
        ? borderColor === "transparent"
          ? "transparent"
          : `var(--p-color-${borderColor})`
        : undefined,
      "--seed-box-border-style": borderStyleValue,
      "--seed-box-border-radius": borderRadius ? `var(--seed-radii-${borderRadius})` : undefined,
      "--seed-box-border-end-start-radius": borderEndStartRadius
        ? `var(--seed-radii-${borderEndStartRadius})`
        : undefined,
      "--seed-box-border-end-end-radius": borderEndEndRadius
        ? `var(--seed-radii-${borderEndEndRadius})`
        : undefined,
      "--seed-box-border-start-start-radius": borderStartStartRadius
        ? `var(--seed-radii-${borderStartStartRadius})`
        : undefined,
      "--seed-box-border-start-end-radius": borderStartEndRadius
        ? `var(--seed-radii-${borderStartEndRadius})`
        : undefined,
      "--seed-box-border-width": borderWidth,
      "--seed-box-border-block-start-width": borderBlockStartWidth,
      "--seed-box-border-block-end-width": borderBlockEndWidth,
      "--seed-box-border-inline-start-width": borderInlineStartWidth,
      "--seed-box-border-inline-end-width": borderInlineEndWidth,
      "--seed-box-min-height": minHeight ? `var(--seed-unit-${minHeight})` : undefined,
      "--seed-box-min-width": minWidth ? `var(--seed-unit-${minWidth})` : undefined,
      "--seed-box-max-width": maxWidth ? `var(--seed-unit-${maxWidth})` : undefined,
      "--seed-box-overflow-x": overflowX,
      "--seed-box-overflow-y": overflowY,
      "--seed-box-padding-block-start":
        paddingBlockStart || paddingBlock || padding
          ? `var(--seed-unit-${paddingBlockStart || paddingBlock || padding})`
          : undefined,
      "--seed-box-padding-block-end":
        paddingBlockEnd || paddingBlock || padding
          ? `var(--seed-unit-${paddingBlockEnd || paddingBlock || padding})`
          : undefined,
      "--seed-box-padding-inline-start":
        paddingInlineStart || paddingInline || padding
          ? `var(--seed-unit-${paddingInlineStart || paddingInline || padding})`
          : undefined,
      "--seed-box-padding-inline-end":
        paddingInlineEnd || paddingInline || padding
          ? `var(--seed-unit-${paddingInlineEnd || paddingInline || padding})`
          : undefined,
      "--seed-box-width": width,
      position,
      zIndex,
      opacity,
    } as React.CSSProperties;

    return React.createElement(
      as,
      {
        id,
        className: "seed-box",
        ref,
        style,
        role,
        tabIndex,
        ...restProps,
      },
      children,
    );
  },
);

Box.displayName = "Box";
