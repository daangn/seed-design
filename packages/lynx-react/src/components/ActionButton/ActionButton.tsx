import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/lynx-primitive";
import clsx from "clsx";
import * as React from "react";

/**
 * @platform Lynx
 *
 * 미지원 기능 (Lynx 3.7 SVG 지원 후 추가 예정):
 * - loading: SVG 기반 spinner 필요
 * - layout: "iconOnly": SVG 아이콘 렌더링 필요
 * - PrefixIcon / SuffixIcon: SVG 아이콘 렌더링 필요
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

export const ActionButton = React.forwardRef<unknown, ActionButtonProps>((props, ref) => {
  const [variantProps, restProps] = actionButton.splitVariantProps(props);
  const {
    children,
    className,
    flexGrow,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = restProps;

  const { disabled = false } = variantProps;
  const classes = actionButton({
    ...variantProps,
    layout: "withText",
    disabled: disabled ? true : undefined,
  });
  const isInteractive = !disabled;

  return (
    <Primitive.view
      ref={ref}
      className={clsx(classes.root, className)}
      style={flexGrow != null ? { flexGrow } : undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
      {...nativeProps}
    >
      <text className={classes.text}>{children}</text>
    </Primitive.view>
  );
});
ActionButton.displayName = "ActionButton";
