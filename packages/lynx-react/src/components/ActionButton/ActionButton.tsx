import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/lynx-primitive";
import clsx from "clsx";
import * as React from "react";

/**
 * @platform Lynx
 *
 * 미지원 기능 (Lynx 아이콘 인터페이스 확정 후 추가 예정):
 * - loading: Lynx용 loading indicator 컴포넌트 미구현
 * - layout: "iconOnly": 아이콘 인터페이스 확정 후 지원
 * - PrefixIcon / SuffixIcon: 아이콘 인터페이스 확정 후 지원
 *
 * 웹 대비 미지원 기능:
 * - color / fontWeight props: CSS variable 동적 주입 제한
 * - bleedX / bleedY props: CSS variable 동적 주입 제한
 */
export interface ActionButtonProps
  extends Omit<ActionButtonVariantProps, "loading" | "layout">,
    PrimitiveProps {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export const ActionButton = React.forwardRef<unknown, ActionButtonProps>(
  (
    {
      variant = "brandSolid",
      size = "medium",
      disabled = false,
      children,
      className,
      flexGrow,
      asChild,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      ...restProps
    },
    ref,
  ) => {
    const classes = actionButton({
      variant,
      size,
      layout: "withText",
      disabled: disabled ? true : undefined,
    });
    const isInteractive = !disabled;

    return (
      <Primitive.view
        ref={ref}
        asChild={asChild}
        className={clsx(classes.root, className)}
        style={flexGrow != null ? { flexGrow } : undefined}
        {...(isInteractive && bindtap && { bindtap })}
        {...(isInteractive &&
          mainThreadBindtap && {
            "main-thread:bindtap": mainThreadBindtap,
          })}
        {...restProps}
      >
        <text className={classes.text}>{children}</text>
      </Primitive.view>
    );
  },
);
ActionButton.displayName = "ActionButton";
