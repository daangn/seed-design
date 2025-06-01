import {
  contextualFloatingButton,
  type ContextualFloatingButtonVariantProps,
} from "@seed-design/css/recipes/contextual-floating-button";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { IconRequired } from "../Icon/Icon";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

export interface ContextualFloatingButtonProps
  extends ContextualFloatingButtonVariantProps,
    UsePendingButtonProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ContextualFloatingButton = React.forwardRef<
  HTMLButtonElement,
  ContextualFloatingButtonProps
>(({ variant, loading = false, layout = "withText", className, children, ...otherProps }, ref) => {
  const recipeClassName = contextualFloatingButton({ variant, layout });
  const api = usePendingButton({ loading, disabled: otherProps.disabled });

  if (layout === "iconOnly" && !(otherProps["aria-label"] || otherProps["aria-labelledby"])) {
    console.warn(
      "When layout is 'iconOnly', 'aria-label' or 'aria-labelledby' should be provided.",
    );
  }

  return (
    <PendingButtonProvider value={api}>
      <IconRequired enabled={layout === "iconOnly"}>
        <Primitive.button
          ref={ref}
          className={clsx(recipeClassName, className)}
          {...api.stateProps}
          {...otherProps}
        >
          {children}
        </Primitive.button>
      </IconRequired>
    </PendingButtonProvider>
  );
});
ContextualFloatingButton.displayName = "ContextualFloatingButton";
