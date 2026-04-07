import {
  ActionButton as SeedActionButton,
  type ActionButtonProps as SeedActionButtonProps,
} from "@seed-design/lynx-react";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

export interface ActionButtonProps extends SeedActionButtonProps {}

/**
 * @see https://seed-design.io/lynx/components/action-button
 */
export const ActionButton = React.forwardRef<
  React.ElementRef<typeof SeedActionButton>,
  ActionButtonProps
>(({ loading = false, children, ...otherProps }, ref) => {
  return (
    <SeedActionButton ref={ref} loading={loading} {...otherProps}>
      {loading ? (
        <>
          <view
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              inset: 0,
            }}
          >
            <ProgressCircle size="inherit" tone="inherit" />
          </view>
          <view style={{ opacity: 0, display: "inherit", gap: "inherit" }}>{children}</view>
        </>
      ) : (
        children
      )}
    </SeedActionButton>
  );
});
ActionButton.displayName = "ActionButton";
