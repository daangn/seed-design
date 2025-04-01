import {
  ReactionButton as SeedReactionButton,
  type ReactionButtonProps as SeedReactionButtonProps,
} from "@seed-design/react";
import * as React from "react";
import { LoadingIndicator } from "./loading-indicator";

export interface ReactionButtonProps extends SeedReactionButtonProps {}

/**
 * @see https://seed-design.io/react/components/reaction-button
 * If `asChild` is enabled, manual handling of `LoadingIndicator` is required.
 */
export const ReactionButton = React.forwardRef<
  React.ElementRef<typeof SeedReactionButton>,
  ReactionButtonProps
>(({ loading = false, children, ...otherProps }, ref) => {
  return (
    <SeedReactionButton ref={ref} loading={loading} {...otherProps}>
      {loading ? <LoadingIndicator>{children}</LoadingIndicator> : children}
    </SeedReactionButton>
  );
});
ReactionButton.displayName = "ReactionButton";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
