import { typography } from "@seed-design/lynx-css/vars/component";
import type { CSSProperties } from "@lynx-js/types";
import { clsx } from "cn";
import * as React from "@lynx-js/react";

import {
  handleColor,
  handleFontSize,
  handleFontWeight,
  handleLineHeight,
  type TextStyle,
  type TextStyleProps,
} from "../../utils/styled";
import type { LynxStyledElementProps, LynxTextRef } from "../../types";

function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>;
}

function getTypographyStyle(textStyle: TextStyle | undefined) {
  const key = `textStyle${capitalize(textStyle ?? "t5Regular")}`;
  const value = typography[key as keyof typeof typography];
  return value.enabled.root;
}

export interface TextProps extends TextStyleProps, LynxStyledElementProps {}

export const Text = React.forwardRef<unknown, TextProps>((props, ref) => {
  const {
    color,
    textStyle,
    fontSize,
    lineHeight,
    fontWeight,
    align,
    children,
    className,
    style,
    ...nativeProps
  } = props;
  const typographyStyle = getTypographyStyle(textStyle);

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(className)}
      style={
        {
          color: handleColor(color),
          fontSize: handleFontSize(fontSize) ?? typographyStyle.fontSize,
          lineHeight: handleLineHeight(lineHeight ?? fontSize) ?? typographyStyle.lineHeight,
          fontWeight: handleFontWeight(fontWeight) ?? typographyStyle.fontWeight,
          textAlign: align,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </text>
  );
});

Text.displayName = "Text";
