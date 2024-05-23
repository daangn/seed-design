"use client";

import * as React from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: "neutral" | "brand" | "brandEmphasis" | "layer1";
  gap?: 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  padding?: 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  flexDirection?: "row" | "column";
  justifyContent?: "flexStart" | "flexEnd" | "center" | "spaceBetween";
  alignItems?: "flexStart" | "flexEnd" | "center";
}

const bgTokenMap = {
  layer1: "var(--seed-color-bg-layer-1)",
  neutral: "var(--seed-color-bg-neutral)",
  brand: "var(--seed-color-bg-brand)",
  brandEmphasis: "var(--seed-color-bg-brand-emphasis)",
};

const unitTokenMap = {
  1: "var(--seed-unit-1)",
  1.5: "var(--seed-unit-1\\.5)",
  2: "var(--seed-unit-2)",
  2.5: "var(--seed-unit-2\\.5)",
  3: "var(--seed-unit-3)",
  4: "var(--seed-unit-4)",
  5: "var(--seed-unit-5)",
  6: "var(--seed-unit-6)",
  7: "var(--seed-unit-7)",
  8: "var(--seed-unit-8)",
  9: "var(--seed-unit-9)",
  10: "var(--seed-unit-10)",
};

const justifyContentMap = {
  flexStart: "flex-start",
  flexEnd: "flex-end",
  center: "center",
  spaceBetween: "space-between",
};

const alignItemsMap = {
  flexStart: "flex-start",
  flexEnd: "flex-end",
  center: "center",
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      children,
      backgroundColor,
      gap,
      padding,
      flexDirection,
      justifyContent,
      alignItems,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          backgroundColor: backgroundColor
            ? bgTokenMap[backgroundColor]
            : undefined,
          gap: gap ? unitTokenMap[gap] : undefined,
          padding: padding ? unitTokenMap[padding] : undefined,
          flexDirection,
          justifyContent: justifyContent
            ? justifyContentMap[justifyContent]
            : undefined,
          alignItems: alignItems ? alignItemsMap[alignItems] : undefined,
        }}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);
Flex.displayName = "Flex";
