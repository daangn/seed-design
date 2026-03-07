import {
  type ActionButtonVariantProps,
  actionButton,
} from "@seed-design/css/recipes/action-button";
import type { ReactNode } from "react";
import type { WithMainThread } from "./types/events";

export interface WorkingActionButtonProps
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

export default function WorkingActionButton(props: WorkingActionButtonProps) {
  const {
    children,
    variant = "brandSolid",
    size = "medium",
    layout = "withText",
    disabled = false,
    loading = false,
    fontWeight = "bold",
    flexGrow,
  } = props;

  const classes = actionButton({ variant, size, layout });

  return (
    <view
      className={`${classes}`}
      style={{ flexGrow: flexGrow }}
      {...(!disabled &&
        !loading &&
        props.bindtap && { bindtap: props.bindtap })}
      {...(!disabled &&
        !loading &&
        props["main-thread:bindtap"] && {
          "main-thread:bindtap": props["main-thread:bindtap"],
        })}
    >
      <text
        className={`seed-action-button--variant_${variant} seed-action-button--size_${size}-layout_withText`}
      >
        {children}
      </text>
    </view>
  );
}
