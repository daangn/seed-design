import { text, type TextVariantProps } from "@ride-developer/css/recipes/text";
import {
  vars,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type ScopedColorFg,
  type ScopedColorPalette,
} from "@ride-developer/css/vars";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useMemo } from "react";
import type * as CSS from "csstype";

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");
  // @ts-expect-error
  return vars.$color[type]?.[value] ?? color;
}

function handleFontWeight(fontWeight: string | undefined) {
  if (!fontWeight) {
    return undefined;
  }
  // @ts-expect-error
  return vars.$fontWeight[fontWeight] ?? undefined;
}

function handleFontSize(size: string | undefined) {
  if (!size) {
    return undefined;
  }
  // @ts-expect-error
  return vars.$fontSize[size] ?? size;
}

function handleLineHeight(lineHeight: string | undefined) {
  if (!lineHeight) {
    return undefined;
  }
  // @ts-expect-error
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
  color?: ScopedColorFg | ScopedColorPalette | (string & {});

  /**
   * The font size of the text. Partially overrides the textStyle.
   */
  fontSize?: FontSize | (string & {});

  /**
   * The line height of the text. Partially overrides the textStyle.
   */
  lineHeight?: LineHeight | (string & {});

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
  align?: Extract<CSS.Property.TextAlign, "left" | "center" | "right">;

  /**
   * The user-select behavior of the text.
   */
  userSelect?: Extract<CSS.Property.UserSelect, "none" | "text" | "auto">;

  /**
   * The white-space behavior of the text.
   */
  whiteSpace?: Extract<
    CSS.Property.WhiteSpace,
    "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces"
  >;
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
      textDecorationLine,
      align,
      userSelect,
      whiteSpace,
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
          textDecorationLine,
          maxLines: mapMaxLines(maxLines),
        }),
      [textStyle, textDecorationLine, maxLines],
    );

    return (
      <Comp
        // @ts-expect-error: We might need overloading for ref types, not a big deal for now.
        ref={ref}
        className={clsx(textClassName, className)}
        style={
          {
            "--seed-max-lines": maxLines,
            "--seed-text-color": handleColor(color),
            "--seed-font-size": handleFontSize(fontSize),
            "--seed-line-height": handleLineHeight(lineHeight ?? fontSize),
            "--seed-font-weight": handleFontWeight(fontWeight),
            "--seed-text-align": align,
            "--seed-user-select": userSelect,
            "--seed-white-space": whiteSpace,
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
