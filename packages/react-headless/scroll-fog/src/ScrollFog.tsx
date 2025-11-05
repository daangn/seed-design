"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useScrollFog, type UseScrollFogProps } from "./useScrollFog";

export interface ScrollFogProps
  extends UseScrollFogProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ScrollFog = forwardRef<HTMLDivElement, ScrollFogProps>(
  (
    { placement = ["top", "bottom"], size = 20, sizes, onVisibilityChange, children, ...props },
    ref,
  ) => {
    const api = useScrollFog({ placement, size, sizes, onVisibilityChange });
    return (
      <Primitive.div ref={composeRefs(ref, api.refs.root)} {...mergeProps(props, api.rootProps)}>
        {children}
      </Primitive.div>
    );
  },
);
ScrollFog.displayName = "ScrollFog";
