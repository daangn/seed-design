import {
  actionButton,
  type ActionButtonVariantProps,
} from "@seed-design/css/recipes/action-button";
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
  const classes = actionButton({ variant, size, layout });
  const isInteractive = !disabled && !loading;

  return (
    <view
      className={className ? `${classes} ${className}` : `${classes}`}
      style={flexGrow != null ? { flexGrow } : undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
    >
      <text
        className={`seed-action-button--variant_${variant} seed-action-button--size_${size}-layout_${layout}`}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
      >
        {children}
      </text>
    </view>
  );
}
