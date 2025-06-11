import { text, type TextVariantProps } from "@seed-design/css/recipes/text";
import {
  vars,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type ScopedColorFg,
  type ScopedColorPalette,
} from "@seed-design/css/vars";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useMemo } from "react";

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-ignore
  return vars.$color[type][value] ?? undefined;
}

function handleFontWeight(fontWeight: string | undefined) {
  if (!fontWeight) {
    return undefined;
  }
  // @ts-ignore
  return vars.$fontWeight[fontWeight] ?? undefined;
}

function handleFontSize(size: string | undefined) {
  if (!size) {
    return undefined;
  }
  // @ts-ignore
  return vars.$fontSize[size] ?? size;
}

function handleLineHeight(lineHeight: string | undefined) {
  if (!lineHeight) {
    return undefined;
  }
  // @ts-ignore
  return vars.$lineHeight[lineHeight] ?? lineHeight;
}

export interface TextProps
  extends Omit<TextVariantProps, "maxLines">,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The element to render as
   * @default "span"
   */
  as?: "dt" | "dd" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "legend";

  /**
   * The color of the text.
   */
  color?: ScopedColorFg | ScopedColorPalette;

  /**
   * The font size of the text. Partially overrides the textStyle.
   */
  fontSize?: FontSize;

  /**
   * The line height of the text. Partially overrides the textStyle.
   */
  lineHeight?: LineHeight;

  /**
   * The font weight of the text. Partially overrides the textStyle.
   */
  fontWeight?: FontWeight;

  /**
   * The maximum number of lines to display. If the text overflows, it will be truncated.
   */
  maxLines?: number;

  /**
   * The alignment of the text.
   */
  align?: "left" | "center" | "right";
}

function mapMaxLines(maxLines: number | undefined): "none" | "single" | "multi" {
  if (maxLines === undefined) {
    return "none";
  }
  if (maxLines === 1) {
    return "single";
  }
  return "multi";
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      as,
      color,
      textStyle,
      fontSize,
      lineHeight,
      fontWeight,
      maxLines,
      children,
      className,
      style,
      ...otherProps
    },
    ref,
  ) => {
    const Comp = as || "span";
    const textClassName = useMemo(
      () =>
        text({
          textStyle,
          maxLines: mapMaxLines(maxLines),
        }),
      [textStyle, maxLines],
    );

    return (
      <Comp
        // @ts-ignore: We might need overloading for ref types, not a big deal for now.
        ref={ref}
        className={clsx(textClassName, className)}
        style={
          {
            "--seed-max-lines": maxLines,
            "--seed-text-color": handleColor(color),
            "--seed-font-size": handleFontSize(fontSize),
            "--seed-line-height": handleLineHeight(lineHeight ?? fontSize),
            "--seed-font-weight": handleFontWeight(fontWeight),
            "--seed-text-align": otherProps.align,
            ...style,
          } as React.CSSProperties
        }
        {...otherProps}
      >
        {children}
      </Comp>
    );
  },
);

Text.displayName = "Text";
