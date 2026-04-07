import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import clsx from "clsx";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

export interface ActionButtonProps extends Omit<ActionButtonVariantProps, "layout"> {
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

/**
 * @see https://seed-design.io/lynx/components/action-button
 */
export const ActionButton = React.forwardRef<unknown, ActionButtonProps>((props, ref) => {
  const [variantProps, restProps] = actionButton.splitVariantProps(props);
  const {
    children,
    className,
    flexGrow,
    loading = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = restProps;

  const { disabled = false } = variantProps;
  const classes = actionButton({
    ...variantProps,
    layout: "withText",
    loading: loading ? true : undefined,
    disabled: disabled ? true : undefined,
  });
  const isInteractive = !disabled && !loading;

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      className={clsx(classes.root, className)}
      style={flexGrow != null ? { flexGrow } : undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
      {...nativeProps}
    >
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
          <text className={classes.text} style={{ opacity: 0 }}>
            {children}
          </text>
        </>
      ) : (
        <text className={classes.text}>{children}</text>
      )}
    </view>
  );
});
ActionButton.displayName = "ActionButton";
