import { mergeProps } from "@ride-developer/dom-utils";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { forwardRef } from "react";
import { useScrollable, type UseScrollableProps } from "./useScrollable";

export interface ScrollableProps
  extends UseScrollableProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const Scrollable = forwardRef<HTMLDivElement, ScrollableProps>((props, ref) => {
  const { placement = ["top", "bottom"], onVisibilityChange, ...restProps } = props;
  const api = useScrollable({ placement, onVisibilityChange });
  return (
    <Primitive.div
      ref={composeRefs(api.refs.root, ref)}
      {...mergeProps(api.rootProps, restProps)}
    />
  );
});

Scrollable.displayName = "Scrollable";
