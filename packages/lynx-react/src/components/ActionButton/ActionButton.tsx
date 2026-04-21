import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import * as React from "react";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { usePressTap, type UsePressTapReturn } from "../../hooks/use-press-tap";

const { withProvider, withContext } = createSlotRecipeContext(actionButton);

type ActionButtonRootOwnProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  bindtouchstart?: UsePressTapReturn["bindtouchstart"];
  bindtouchend?: UsePressTapReturn["bindtouchend"];
  bindtouchcancel?: UsePressTapReturn["bindtouchcancel"];
  bindtap?: UsePressTapReturn["bindtap"];
  "main-thread:bindtap"?: UsePressTapReturn["main-thread:bindtap"];
};

const ActionButtonRoot = withProvider<unknown, ActionButtonVariantProps & ActionButtonRootOwnProps>(
  "view",
  "root",
  { defaultProps: { layout: "withText" } },
);

const ActionButtonTextSlot = withContext<
  unknown,
  { children?: React.ReactNode; className?: string }
>("text", "text");

/**
 * @platform Lynx
 *
 * 미지원 기능 (Lynx 3.7 SVG 지원 후 추가 예정):
 * - layout: "iconOnly": SVG 아이콘 렌더링 필요
 * - PrefixIcon / SuffixIcon: SVG 아이콘 렌더링 필요
 *
 * 웹 대비 미지원 기능:
 * - color / fontWeight props: CSS variable 동적 주입 제한
 * - bleedX / bleedY props: CSS variable 동적 주입 제한
 */
export interface ActionButtonProps extends Omit<ActionButtonVariantProps, "layout"> {
  children?: React.ReactNode;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export const ActionButton = React.forwardRef<unknown, ActionButtonProps>((props, ref) => {
  const {
    children,
    flexGrow,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...variantAndRest
  } = props;
  const { disabled = false, loading = false } = variantAndRest;
  const isInteractive = !disabled && !loading;

  const { pressed: _pressed, ...pressTapHandlers } = usePressTap({
    disabled: !isInteractive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });

  return (
    <ActionButtonRoot
      {...variantAndRest}
      ref={ref}
      style={flexGrow != null ? { flexGrow } : undefined}
      {...pressTapHandlers}
    >
      {loading ? children : <ActionButtonTextSlot>{children}</ActionButtonTextSlot>}
    </ActionButtonRoot>
  );
});
ActionButton.displayName = "ActionButton";
