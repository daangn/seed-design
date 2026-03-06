import {
  actionButton,
  type ActionButtonVariantProps,
} from '@seed-design/css/recipes/action-button.lynx';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface ActionButtonProps extends ActionButtonVariantProps {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  'main-thread:bindtap'?: () => void;
}

export function ActionButton({
  variant,
  size,
  layout = 'withText',
  disabled = false,
  loading = false,
  children,
  className,
  flexGrow,
  ...rest
}: ActionButtonProps) {
  const classes = actionButton({ variant, size, layout });

  return (
    <view
      className={clsx(classes.root, className)}
      style={{ flexGrow }}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...rest}
    >
      <text className={classes.text}>{children}</text>
    </view>
  );
}
