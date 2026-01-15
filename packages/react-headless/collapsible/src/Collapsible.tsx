"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import type { UseCollapsibleProps } from "./useCollapsible";
import { useCollapsible } from "./useCollapsible";
import { CollapsibleProvider, useCollapsibleContext } from "./useCollapsibleContext";

export interface CollapsibleRootProps
  extends UseCollapsibleProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>((props, ref) => {
  const { open, defaultOpen, onOpenChange, disabled, ...otherProps } = props;

  const api = useCollapsible({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
  });

  return (
    <CollapsibleProvider value={api}>
      <Primitive.div ref={ref} {...mergeProps(api.stateProps, otherProps)} />
    </CollapsibleProvider>
  );
});
CollapsibleRoot.displayName = "CollapsibleRoot";

export interface CollapsibleTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  (props, ref) => {
    const api = useCollapsibleContext();

    return (
      <Primitive.button
        ref={ref}
        {...mergeProps(api.stateProps, api.triggerAriaProps, api.triggerHandlers, props)}
      />
    );
  },
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  (props, ref) => {
    const api = useCollapsibleContext();

    return (
      <Primitive.div
        ref={composeRefs(ref, api.refs.content)}
        {...mergeProps(api.contentProps, props)}
      />
    );
  },
);
CollapsibleContent.displayName = "CollapsibleContent";
