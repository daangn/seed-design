'use client';
import { Primitive } from "@ride-developer/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Count = forwardRef<HTMLSpanElement, CountProps>((props, ref) => {
  const { className, ...otherProps } = props;
  return <Primitive.span ref={ref} className={clsx("ride-count", className)} {...otherProps} />;
});
