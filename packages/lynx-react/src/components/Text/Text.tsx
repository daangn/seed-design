import type { CSSProperties } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import {
  handleColor,
  handleFontSize,
  handleFontWeight,
  handleLineHeight,
  type TextStyle,
  type TextStyleProps,
} from "../../utils/styled";
import type { LynxHostProps, LynxTextRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { typographyTokens } from "@seed-design/lynx-css/vars/runtime";
import { expandToken } from "../../utils/runtime-token";

function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>;
}

function getTypographyTokens(textStyle: TextStyle | undefined) {
  const key = capitalize(textStyle ?? "t5Regular");
  return typographyTokens[key]!;
}

export interface TextProps
  extends TextStyleProps,
    Omit<LynxHostProps<"text">, keyof TextStyleProps> {
  /**
   * The maximum number of lines to display. If the text overflows, it will be truncated with an ellipsis.
   */
  maxLines?: number;

  /**
   * The decoration line of the text.
   */
  textDecorationLine?: "none" | "underline" | "line-through";
}

export const Text = React.forwardRef<unknown, TextProps>((props, ref) => {
  const {
    color,
    textStyle,
    fontSize,
    lineHeight,
    fontWeight,
    align,
    maxLines,
    textDecorationLine,
    children,
    className,
    style,
    ...nativeProps
  } = props;
  const [typographyFontSize, typographyLineHeight, typographyFontWeight] =
    getTypographyTokens(textStyle);

  const truncated = maxLines !== undefined;

  return (
    <text
      {...mergeProps(
        { "text-maxline": truncated ? String(maxLines) : undefined },
        ref ? { ref: ref as LynxTextRef } : {},
        nativeProps,
      )}
      className={clsx(className)}
      style={
        {
          color: handleColor(color),
          fontSize:
            handleFontSize(fontSize) ?? expandToken(typographyFontSize, "var(--seed-font-size-"),
          lineHeight:
            handleLineHeight(lineHeight ?? fontSize) ??
            expandToken(typographyLineHeight, "var(--seed-line-height-"),
          fontWeight:
            handleFontWeight(fontWeight) ??
            expandToken(typographyFontWeight, "var(--seed-font-weight-"),
          textAlign: align,
          textDecoration: textDecorationLine,
          ...(truncated ? { overflow: "hidden", textOverflow: "ellipsis" } : {}),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </text>
  );
});

Text.displayName = "Text";
