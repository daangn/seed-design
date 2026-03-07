import { actionButton } from "@seed-design/css/recipes/action-button.lynx";
import type { ActionButtonVariantProps } from "@seed-design/css/recipes/action-button.lynx";
import type { ReactNode } from "react";
import { useState, useCallback } from "react";
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
  const [active, setActive] = useState(false);
  const classes = actionButton({ variant, size, layout });
  const isInteractive = !disabled && !loading;

  const handleTouchStart = useCallback(() => {
    if (isInteractive) setActive(true);
  }, [isInteractive]);

  const handleTouchEnd = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <view
      className={clsx(classes.root, className)}
      style={flexGrow != null ? { flexGrow } : undefined}
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(isInteractive && {
        bindtouchstart: handleTouchStart,
        bindtouchend: handleTouchEnd,
        bindtouchcancel: handleTouchEnd,
      })}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
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
