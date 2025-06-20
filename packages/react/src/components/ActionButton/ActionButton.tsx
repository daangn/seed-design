import {
  actionButton,
  type ActionButtonVariantProps,
} from "@seed-design/css/recipes/action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { IconRequired } from "../Icon/Icon";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";
import type { ScopedColorFg, ScopedColorPalette } from "@seed-design/css/vars";

export interface ActionButtonProps
  extends ActionButtonVariantProps,
    UsePendingButtonProps,
    PrimitiveProps,
    Pick<StyleProps, "flexGrow" | "bleedX" | "bleedY">,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Color of the label and icons inside the button.
   * Works only when `variant` is `ghost`.
   * @default "fg.neutral"
   */
  color?: ScopedColorFg | ScopedColorPalette;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      variant,
      size,
      loading = false,
      layout = "withText",
      color,
      className,
      children,
      ...otherProps
    },
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
            style={{ ...style, "--seed-box-color": color } as React.CSSProperties}
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
