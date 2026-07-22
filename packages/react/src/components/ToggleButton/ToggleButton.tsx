import {
  toggleButton,
  type ToggleButtonVariantProps,
} from "@seed-design/css/recipes/toggle-button";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Toggle as TogglePrimitive } from "@seed-design/react-toggle";
import clsx from "clsx";
import * as React from "react";
import { usePressScale } from "../../utils/pressScale";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

export interface ToggleButtonProps
  extends ToggleButtonVariantProps,
    UsePendingButtonProps,
    TogglePrimitive.RootProps {}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ variant = "brandSolid", size = "small", loading = false, className, ...otherProps }, ref) => {
    const recipeClassName = toggleButton({ variant, size });
    const api = usePendingButton({ loading, disabled: otherProps.disabled });
    const { pressScaleRef, pressScaleClassName } = usePressScale();

    return (
      <PendingButtonProvider value={api}>
        <TogglePrimitive.Root
          ref={useComposedRefs(pressScaleRef, ref)}
          className={clsx(recipeClassName, pressScaleClassName, className)}
          {...api.stateProps}
          {...otherProps}
        />
      </PendingButtonProvider>
    );
  },
);
ToggleButton.displayName = "ToggleButton";
