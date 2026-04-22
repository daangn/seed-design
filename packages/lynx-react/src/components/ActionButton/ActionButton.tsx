import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import clsx from "clsx";
import * as React from "react";
import { cloneElement, isValidElement, type ReactElement } from "react";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { usePressTap, type UsePressTapReturn } from "../../utils/use-press-tap";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(actionButton);

// recipe .d.ts 는 CSS variant 만 선언하지만 런타임은 state modifier도 지원
// (postcss-lynx-compat 이 pseudo selector 를 class modifier 로 변환).
// local alias 로 타입 갭 우회.
type ActionButtonRuntimeVariantProps = ActionButtonVariantProps & {
  disabled?: boolean;
  loading?: boolean;
};

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

const ActionButtonRoot = withProvider<
  unknown,
  ActionButtonRuntimeVariantProps & ActionButtonRootOwnProps
>("view", "root", { defaultProps: { layout: "withText" } });

const ActionButtonTextSlot = withContext<
  unknown,
  { children?: React.ReactNode; className?: string }
>("text", "text");

/**
 * @platform Lynx
 *
 * prefix/suffix 아이콘 슬롯.
 *
 * 사용법 — `@karrotmarket/lynx-monochrome-icon` 1.9.0+ 의 `forwardRef` 아이콘 컴포넌트를
 * children 으로 넘긴다. 슬롯은 자동으로 slot className 을 주입하고, recipe CSS 가
 * variant/state 에 맞는 `tint-color` 를 적용한다. `color` prop 을 생략해야 CSS 의
 * `tint-color` 가 attribute 로 덮이지 않는다.
 *
 * ```tsx
 * import { IconPlusFill } from "@karrotmarket/lynx-monochrome-icon";
 *
 * <ActionButton variant="brandSolid">
 *   <ActionButton.PrefixIcon><IconPlusFill /></ActionButton.PrefixIcon>
 *   라벨
 *   <ActionButton.SuffixIcon><IconChevronDown /></ActionButton.SuffixIcon>
 * </ActionButton>
 * ```
 */
interface ActionButtonIconSlotProps {
  children: ReactElement<{ className?: string; color?: string }>;
}

const ActionButtonPrefixIcon = ({ children }: ActionButtonIconSlotProps) => {
  if (!isValidElement(children)) return null;
  const { prefixIcon } = useClassNames();
  const childProps = children.props as { className?: string };
  return cloneElement(children, {
    className: clsx(prefixIcon, childProps.className),
  });
};
ActionButtonPrefixIcon.displayName = "ActionButton.PrefixIcon";

const ActionButtonSuffixIcon = ({ children }: ActionButtonIconSlotProps) => {
  if (!isValidElement(children)) return null;
  const { suffixIcon } = useClassNames();
  const childProps = children.props as { className?: string };
  return cloneElement(children, {
    className: clsx(suffixIcon, childProps.className),
  });
};
ActionButtonSuffixIcon.displayName = "ActionButton.SuffixIcon";

/**
 * @platform Lynx
 *
 * 미지원 기능 (Lynx 3.7 SVG 지원 후 추가 예정):
 * - layout: "iconOnly": SVG 아이콘 렌더링 필요
 *
 * 웹 대비 미지원 기능:
 * - color / fontWeight props: CSS variable 동적 주입 제한
 * - bleedX / bleedY props: CSS variable 동적 주입 제한
 */
export interface ActionButtonProps extends Omit<ActionButtonRuntimeVariantProps, "layout"> {
  children?: React.ReactNode;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

interface ActionButtonComponent
  extends React.ForwardRefExoticComponent<ActionButtonProps & React.RefAttributes<unknown>> {
  PrefixIcon: typeof ActionButtonPrefixIcon;
  SuffixIcon: typeof ActionButtonSuffixIcon;
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
}) as ActionButtonComponent;
ActionButton.displayName = "ActionButton";
ActionButton.PrefixIcon = ActionButtonPrefixIcon;
ActionButton.SuffixIcon = ActionButtonSuffixIcon;
