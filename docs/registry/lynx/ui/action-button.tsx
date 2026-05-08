import {
  ActionButton as SeedActionButton,
  type ActionButtonProps as SeedActionButtonProps,
} from "@seed-design/lynx-react";
import * as React from "@lynx-js/react";

export interface ActionButtonProps extends SeedActionButtonProps {}

/**
 * @see https://seed-design.io/lynx/components/action-button
 */
export const ActionButton = React.forwardRef<
  React.ElementRef<typeof SeedActionButton>,
  ActionButtonProps
>((props, ref) => {
  return <SeedActionButton ref={ref} {...props} />;
});
ActionButton.displayName = "ActionButton";
