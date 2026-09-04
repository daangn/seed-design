import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
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
      className={clsx("seed-consistent-width", className)}
      {...otherProps}
    />
  );
});
