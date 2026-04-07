import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { badge, type BadgeVariantProps } from "@ride-developer/css/recipes/badge";
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
    const [variantProps, restProps] = badge.splitVariantProps(props);
    const { root, label } = badge(variantProps);

    return (
      <Primitive.span className={clsx(root, className)} {...restProps} ref={ref}>
        <Primitive.span className={label}>{children}</Primitive.span>
      </Primitive.span>
    );
  },
);
Badge.displayName = "Badge";
