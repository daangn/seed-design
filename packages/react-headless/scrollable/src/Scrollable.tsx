import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useScrollable, type UseScrollableProps } from "./useScrollable";

export interface ScrollableProps
  extends UseScrollableProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const Scrollable = forwardRef<HTMLDivElement, ScrollableProps>((props, ref) => {
  const api = useScrollable(props);
  return <Primitive.div ref={api.refs.root} {...mergeProps(api.rootProps, props)} />;
});

Scrollable.displayName = "Scrollable";
