import { Slot } from "@radix-ui/react-slot";
import { badge, type BadgeVariantProps } from "@seed-design/recipe/badge";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/badge.css";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    BadgeVariantProps {
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      size = "medium",
      shape = "rectangle",
      variant = "soft",
      tone = "neutral",
      children,
      asChild = false,
      ...otherProps
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";
    const classNames = badge({ size, shape, variant, tone });
    return (
      <Comp
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      >
        <span className={classNames.label}>{children}</span>
      </Comp>
    );
  },
);
Badge.displayName = "Badge";
