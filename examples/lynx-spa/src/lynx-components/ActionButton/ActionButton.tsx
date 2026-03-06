import type { ReactNode } from '@lynx-js/react';
import {
  type ActionButtonVariantProps,
  actionButton,
} from '../../lynx-recipes/action-button';
import type { WithMainThread } from '../../types/events.ts';

export interface ActionButtonProps
  extends ActionButtonVariantProps,
    WithMainThread<{ bindtap?: () => void }> {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  flexGrow?: number;
}

export default function ActionButton(props: ActionButtonProps) {
  const {
    children,
    variant = 'brandSolid',
    size = 'medium',
    layout = 'withText',
    disabled = false,
    loading = false,
    flexGrow,
  } = props;

  const classes = actionButton({ variant, size, layout });

  return (
    <view
      className={classes.root}
      style={{ flexGrow }}
      {...(!disabled &&
        !loading &&
        props.bindtap && { bindtap: props.bindtap })}
      {...(!disabled &&
        !loading &&
        props['main-thread:bindtap'] && {
          'main-thread:bindtap': props['main-thread:bindtap'],
        })}
    >
      <text className={classes.text}>{children}</text>
    </view>
  );
}
