import { Toggle as TogglePrimitive } from "@seed-design/react-toggle";
import {
  toggleButton,
  type ToggleButtonVariantProps,
} from "@seed-design/css/recipes/toggle-button";
import clsx from "clsx";
import * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

const { ClassNameProvider } = createRecipeContext(toggleButton);

export interface ToggleButtonProps
  extends ToggleButtonVariantProps,
    UsePendingButtonProps,
    TogglePrimitive.RootProps {}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ variant = "brandSolid", size = "small", loading = false, className, ...otherProps }, ref) => {
    const recipeClassName = toggleButton({ variant, size });
    const api = usePendingButton({ loading, disabled: otherProps.disabled });

    return (
      <ClassNameProvider value={recipeClassName}>
        <PendingButtonProvider value={api}>
          <TogglePrimitive.Root
            ref={ref}
            className={clsx(recipeClassName, className)}
            {...api.stateProps}
            {...otherProps}
          />
        </PendingButtonProvider>
      </ClassNameProvider>
    );
  },
);
ToggleButton.displayName = "ToggleButton";
