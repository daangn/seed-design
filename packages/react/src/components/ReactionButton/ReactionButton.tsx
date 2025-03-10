import {
  reactionButton,
  type ReactionButtonVariantProps,
} from "@seed-design/css/recipes/reaction-button";
import { Toggle as TogglePrimitive } from "@seed-design/react-toggle";
import clsx from "clsx";
import * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

const { ClassNameProvider } = createRecipeContext(reactionButton);

export interface ReactionButtonProps
  extends ReactionButtonVariantProps,
    UsePendingButtonProps,
    TogglePrimitive.RootProps {}

export const ReactionButton = React.forwardRef<HTMLButtonElement, ReactionButtonProps>(
  ({ size = "small", loading = false, className, ...otherProps }, ref) => {
    const recipeClassName = reactionButton({ size });
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
ReactionButton.displayName = "ReactionButton";
