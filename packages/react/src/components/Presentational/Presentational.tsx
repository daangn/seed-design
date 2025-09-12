import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";

export interface PresentationalProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const Presentational = forwardRef<HTMLDivElement, PresentationalProps>((props, ref) => {
  return <Primitive.div ref={ref} aria-hidden="true" {...props} />;
});
