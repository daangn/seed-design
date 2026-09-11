import * as React from "@lynx-js/react";
import { FloatingActionButton as SeedFloatingActionButton } from "@seed-design/lynx-react";

export interface FloatingActionButtonProps
  extends Omit<SeedFloatingActionButton.RootProps, "children"> {
  icon: SeedFloatingActionButton.IconProps["icon"];

  label: string;
}

/**
 * @see https://seed-design.io/lynx/components/floating-action-button
 */
export const FloatingActionButton = React.forwardRef<unknown, FloatingActionButtonProps>(
  ({ icon, label, "accessibility-label": accessibilityLabel, ...otherProps }, ref) => {
    return (
      <SeedFloatingActionButton.Root
        ref={ref}
        accessibility-label={accessibilityLabel ?? label}
        {...otherProps}
      >
        <SeedFloatingActionButton.Icon icon={icon} />
        <SeedFloatingActionButton.Label>{label}</SeedFloatingActionButton.Label>
      </SeedFloatingActionButton.Root>
    );
  },
);
FloatingActionButton.displayName = "FloatingActionButton";
