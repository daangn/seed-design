import {
  actionButton,
  type ActionButtonVariantProps,
} from "@seed-design/css/recipes/action-button.lynx";
import clsx from "clsx";
import type { ReactNode } from "react";

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
  variant,
  size,
  layout = "withText",
  disabled = false,
  loading = false,
  children,
  className,
  flexGrow,
  bindtap,
  "main-thread:bindtap": mainThreadBindtap,
  ...rest
}: ActionButtonProps) {
  const classes = actionButton({ variant, size, layout });
  const isInteractive = !disabled && !loading;

  return (
    <view
      className={clsx(classes.root, className)}
      style={flexGrow != null ? { flexGrow } : undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive && mainThreadBindtap && { "main-thread:bindtap": mainThreadBindtap })}
      {...rest}
    >
      <text
        className={classes.text}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
      >
        {children}
      </text>
    </view>
  );
}
