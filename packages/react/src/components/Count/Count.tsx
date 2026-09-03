import { Primitive } from "@seed-design/react-primitive";
import { clsx } from "cn";
import { forwardRef } from "react";

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Count = forwardRef<HTMLSpanElement, CountProps>((props, ref) => {
  const { className, ...otherProps } = props;
  return <Primitive.span ref={ref} className={clsx("seed-count", className)} {...otherProps} />;
});
