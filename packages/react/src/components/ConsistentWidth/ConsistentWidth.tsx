import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";

export interface ConsistentWidthProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: string;
}

export const ConsistentWidth = forwardRef<HTMLSpanElement, ConsistentWidthProps>((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <Primitive.span
      data-text={props.children}
      ref={ref}
      className={clsx("ride-consistent-width", className)}
      {...otherProps}
    />
  );
});
