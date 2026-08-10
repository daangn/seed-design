import {
  reactionButton,
  type ReactionButtonVariantProps,
} from "@seed-design/css/recipes/reaction-button";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Toggle as TogglePrimitive } from "@seed-design/react-toggle";
import clsx from "clsx";
import * as React from "react";
import { useScaleFeedback } from "../../utils/scaleFeedback";
import {
  PendingButtonProvider,
  usePendingButton,
  type UsePendingButtonProps,
} from "../LoadingIndicator/usePendingButton";

export interface ReactionButtonProps
  extends ReactionButtonVariantProps,
    UsePendingButtonProps,
    TogglePrimitive.RootProps {}

export const ReactionButton = React.forwardRef<HTMLButtonElement, ReactionButtonProps>(
  ({ size = "small", loading = false, className, ...otherProps }, ref) => {
    const recipeClassName = reactionButton({ size });
    const api = usePendingButton({ loading, disabled: otherProps.disabled });
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <PendingButtonProvider value={api}>
        <TogglePrimitive.Root
          ref={useComposedRefs(scaleFeedbackRef, ref)}
          className={clsx(recipeClassName, scaleFeedbackClassName, className)}
          {...api.stateProps}
          {...otherProps}
        />
      </PendingButtonProvider>
    );
  },
);
ReactionButton.displayName = "ReactionButton";
