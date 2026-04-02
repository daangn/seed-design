import { text } from "@seed-design/lynx-css/recipes/text";
import type { TextVariantProps } from "@seed-design/lynx-css/recipes/text";
import {
  vars,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type ScopedColorFg,
  type ScopedColorPalette,
} from "@seed-design/css/vars";
import clsx from "clsx";
import type { ReactNode } from "react";
import { forwardRef, useMemo } from "react";
import { dynamicStyle } from "../../utils/dynamic-style";

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

export interface TextProps extends Pick<TextVariantProps, "textStyle"> {
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
   * The maximum number of lines to display. If the text overflows, it will be truncated with ellipsis.
   */
  maxLines?: number;

  /**
   * The alignment of the text.
   */
  align?: "left" | "center" | "right";

  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
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

export const Text = forwardRef<any, TextProps>(
  (
    {
      color,
      textStyle,
      fontSize,
      lineHeight,
      fontWeight,
      maxLines,
      align,
      children,
      className,
      style,
    },
    ref,
  ) => {
    const classes = useMemo(
      () =>
        text({
          textStyle,
          maxLines: mapMaxLines(maxLines),
        }),
      [textStyle, maxLines],
    );

    const cssVars = dynamicStyle({
      "--seed-max-lines": maxLines,
      "--seed-text-color": handleColor(color),
      "--seed-font-size": handleFontSize(fontSize),
      "--seed-line-height": handleLineHeight(lineHeight ?? fontSize),
      "--seed-font-weight": handleFontWeight(fontWeight),
      "--seed-text-align": align,
      ...style,
    });

    return (
      <view ref={ref} className={clsx(classes.root, className)} style={cssVars as any}>
        <text className={classes.text}>{children}</text>
      </view>
    );
  },
);

Text.displayName = "Text";
