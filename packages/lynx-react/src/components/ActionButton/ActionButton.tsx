import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import type { ReactNode } from "react";
import clsx from "clsx";

export interface ActionButtonProps extends ActionButtonVariantProps {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export function ActionButton({
  variant = "brandSolid",
  size = "medium",
  layout = "withText",
  disabled = false,
  loading = false,
  children,
  className,
  flexGrow,
  bindtap,
  "main-thread:bindtap": mainThreadBindtap,
}: ActionButtonProps) {
  const classes = actionButton({
    variant,
    size,
    layout,
    disabled: disabled || undefined,
    loading: loading || undefined,
  });
  const isInteractive = !disabled && !loading;

  return (
    <view
      className={clsx(classes.root, className)}
      style={flexGrow != null ? { flexGrow } : undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
    >
      <text className={classes.text}>{children}</text>
    </view>
  );
}
