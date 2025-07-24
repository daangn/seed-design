import {
  actionButton,
  type ActionButtonVariantProps,
} from "@seed-design/css/recipes/action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { useStyleProps, type OverridableStyleProps, type StyleProps } from "../../utils/styled";
import { IconRequired } from "../Icon/Icon";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

export interface ActionButtonProps
  extends ActionButtonVariantProps,
    UsePendingButtonProps,
    PrimitiveProps,
    Pick<StyleProps, "flexGrow" | "bleedX" | "bleedY">,
    OverridableStyleProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { variant, size, loading = false, layout = "withText", className, children, ...otherProps },
    ref,
  ) => {
    const recipeClassName = actionButton({ variant, layout, size });
    const api = usePendingButton({ loading, disabled: otherProps.disabled });
    const { style, restProps } = useStyleProps(otherProps);

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
            style={style}
            {...api.stateProps}
            {...restProps}
          >
            {children}
          </Primitive.button>
        </IconRequired>
      </PendingButtonProvider>
    );
  },
);
ActionButton.displayName = "ActionButton";
