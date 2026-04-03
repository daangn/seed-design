import clsx from "clsx";
import * as React from "react";
import type { BreakpointThreshold } from "../../types/responsive";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { Slot } from "@radix-ui/react-slot";

export interface BoxProps extends StyleProps, Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  as?: React.ElementType;

  asChild?: boolean;

  hideFrom?: BreakpointThreshold;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { hideFrom, ...rest } = props;
  const { style, restProps } = useStyleProps(rest);
  const { as: Comp = "div", asChild = false, className, ...nativeProps } = restProps;

  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={clsx("seed-box", className)}
        style={{
          ...style,
          ...(hideFrom && { [`--seed-box-display-${hideFrom}`]: "none" }),
        }}
        {...nativeProps}
      />
    );
  }

  return (
    <Comp
      ref={ref}
      className={clsx("seed-box", className)}
      style={{
        ...style,
        ...(hideFrom && { [`--seed-box-display-${hideFrom}`]: "none" }),
      }}
      {...nativeProps}
    />
  );
});
