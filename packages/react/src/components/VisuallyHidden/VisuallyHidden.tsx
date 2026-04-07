import { visuallyHidden } from "@ride-developer/dom-utils";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";

export interface VisuallyHiddenProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const VisuallyHidden = forwardRef<HTMLDivElement, VisuallyHiddenProps>((props, ref) => {
  const { style, ...otherProps } = props;
  return <Primitive.div ref={ref} style={{ ...visuallyHidden, ...style }} {...otherProps} />;
});
