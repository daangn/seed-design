import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { badge, type BadgeVariantProps } from "@seed-design/css/recipes/badge";
import type * as React from "react";
import { forwardRef } from "react";
import clsx from "clsx";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeProps
  extends BadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, ...props }, ref) => {
    const { root, label } = badge(props);

    return (
      <Primitive.span className={clsx(root, className)} {...props} ref={ref}>
        <Primitive.span className={label}>{children}</Primitive.span>
      </Primitive.span>
    );
  },
);
Badge.displayName = "Badge";
