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
  const stateClasses = [
    classes.root,
    disabled ? 'data-disabled__' : '',
    loading ? 'data-loading__' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <view
      className={stateClasses}
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
      <text
        className={
          disabled
            ? `${classes.text} seed-action-button__text--disabled`
            : classes.text
        }
      >
        {children}
      </text>
    </view>
  );
}
