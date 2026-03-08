import { actionButton } from "@seed-design/css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/css/recipes/action-button";
import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import clsx from "clsx";

/**
 * Web recipe (single className) workaround for comparison testing.
 * Unlike lynx-react's ActionButton which uses slot recipe (root + text),
 * this uses the web recipe which returns a single className string.
 */
export interface WorkingActionButtonProps extends ActionButtonVariantProps {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  bindtap?: () => void;
}

export function WorkingActionButton({
  variant = "brandSolid",
  size = "medium",
  layout = "withText",
  disabled = false,
  loading = false,
  children,
  className,
  bindtap,
}: WorkingActionButtonProps) {
  const [active, setActive] = useState(false);
  const cls = actionButton({ variant, size, layout });
  const isInteractive = !disabled && !loading;

  const handleTouchStart = useCallback(() => {
    if (isInteractive) setActive(true);
  }, [isInteractive]);

  const handleTouchEnd = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <view
      className={clsx(cls, className)}
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(isInteractive && {
        bindtouchstart: handleTouchStart,
        bindtouchend: handleTouchEnd,
        bindtouchcancel: handleTouchEnd,
      })}
      {...(isInteractive && bindtap && { bindtap })}
    >
      <text>{children}</text>
    </view>
  );
}
