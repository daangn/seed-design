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
   * The alignment of the text.
   */
  align?: "left" | "center" | "right";

  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export const Text = forwardRef<any, TextProps>(
  (
    { color, textStyle, fontSize, lineHeight, fontWeight, align, children, className, style },
    ref,
  ) => {
    const classes = useMemo(() => text({ textStyle }), [textStyle]);

    const textStyleStr = dynamicStyle({
      color: handleColor(color),
      "font-size": handleFontSize(fontSize),
      "line-height": handleLineHeight(lineHeight ?? fontSize),
      "font-weight": handleFontWeight(fontWeight),
      "text-align": align,
      ...style,
    });

    return (
      <text
        {...(ref ? { ref } : {})}
        className={clsx(classes.text, className)}
        style={textStyleStr as any}
      >
        {children}
      </text>
    );
  },
);

Text.displayName = "Text";
