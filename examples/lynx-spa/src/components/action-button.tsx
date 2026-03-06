import {
  type ActionButtonVariantProps,
  actionButton,
} from "@seed-design/css/recipes/action-button.lynx";
import type { ReactNode } from "react";
import type { WithMainThread } from "../types/events.ts";

export interface ActionButtonProps
  extends ActionButtonVariantProps,
    WithMainThread<{
      bindtap?: () => void;
    }> {
  children?: ReactNode;
  fontWeight?: "regular" | "medium" | "bold" | undefined;
  disabled?: boolean;
  loading?: boolean;
  flexGrow?: number | undefined;
}

export default function ActionButton(props: ActionButtonProps) {
  const {
    children,
    variant = "brandSolid",
    size = "medium",
    layout = "withText",
    disabled = false,
    loading = false,
    flexGrow,
  } = props;

  const className = actionButton({ variant, size, layout });

  return (
    <view
      className={className}
      style={{ flexGrow: flexGrow }}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(!disabled && !loading && props.bindtap && { bindtap: props.bindtap })}
      {...(!disabled &&
        !loading &&
        props["main-thread:bindtap"] && {
          "main-thread:bindtap": props["main-thread:bindtap"],
        })}
    >
      <text className={className}>{children}</text>
    </view>
  );
}
