"use client";

import * as React from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: "neutral" | "brand" | "brandEmphasis";
  gap?: 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  flexDirection?: "row" | "column";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between";
  alignItems?: "flex-start" | "flex-end" | "center";
}

const bgTokenMap = {
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

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      children,
      backgroundColor,
      gap,
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
          flexDirection,
        }}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);
Flex.displayName = "Flex";
