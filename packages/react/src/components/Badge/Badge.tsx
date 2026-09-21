"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { badge, type BadgeSlotName, type BadgeVariantProps } from "@seed-design/css/recipes/badge";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import * as React from "react";

type BadgeClassNames = Record<BadgeSlotName, string>;

interface BadgeSlotContextValue {
  classNames: BadgeClassNames;
}

const BadgeSlotContext = React.createContext<BadgeSlotContextValue | null>(null);

function useBadgeSlotContext() {
  const context = React.useContext(BadgeSlotContext);

  if (!context) {
    throw new Error("Badge slots must be rendered within Badge.Root.");
  }

  return context;
}

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeRootProps
  extends BadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const BadgeRoot = React.forwardRef<HTMLSpanElement, BadgeRootProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, restProps] = badge.splitVariantProps(props);
    const classNames = badge(variantProps);
    const contextValue: BadgeSlotContextValue = { classNames };

    return (
      <BadgeSlotContext.Provider value={contextValue}>
        <Primitive.span ref={ref} className={clsx(classNames.root, className)} {...restProps} />
      </BadgeSlotContext.Provider>
    );
  },
);
BadgeRoot.displayName = "Badge.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgePrefixProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const BadgePrefix = React.forwardRef<HTMLSpanElement, BadgePrefixProps>(
  ({ className, ...props }, ref) => {
    const { classNames } = useBadgeSlotContext();

    return <Primitive.span ref={ref} className={clsx(classNames.prefix, className)} {...props} />;
  },
);
BadgePrefix.displayName = "Badge.Prefix";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const BadgeLabel = React.forwardRef<HTMLSpanElement, BadgeLabelProps>(
  ({ className, ...props }, ref) => {
    const { classNames } = useBadgeSlotContext();

    return <Primitive.span ref={ref} className={clsx(classNames.label, className)} {...props} />;
  },
);
BadgeLabel.displayName = "Badge.Label";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeActionProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const BadgeAction = React.forwardRef<HTMLButtonElement, BadgeActionProps>(
  ({ className, ...props }, ref) => {
    const { classNames } = useBadgeSlotContext();
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <Primitive.button
        ref={useComposedRefs(scaleFeedbackRef, ref)}
        type="button"
        className={clsx(classNames.action, scaleFeedbackClassName, className)}
        {...props}
      />
    );
  },
);
BadgeAction.displayName = "Badge.Action";
