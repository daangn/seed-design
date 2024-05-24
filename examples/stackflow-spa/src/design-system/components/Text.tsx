"use client";

import * as React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "neutral";
  size?: "xSmall" | "small" | "medium";
  weight?: "default" | "strong";
}

const fgColorMap = {
  neutral: "var(--seed-color-fg-neutral)",
};

const fontSizeMap = {
  xSmall: "var(--seed-font-size-50)",
  small: "var(--seed-font-size-75)",
  medium: "var(--seed-font-size-100)",
};

const fontWeightMap = {
  default: "var(--seed-font-weight-regular)",
  strong: "var(--seed-font-weight-bold)",
};

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, children, color, size, weight, ...otherProps }, ref) => {
    return (
      <span
        ref={ref}
        style={{
          color: color ? fgColorMap[color] : undefined,
          fontSize: size ? fontSizeMap[size] : undefined,
          fontWeight: weight ? fontWeightMap[weight] : undefined,
        }}
        {...otherProps}
      >
        {children}
      </span>
    );
  },
);
Text.displayName = "Text";
