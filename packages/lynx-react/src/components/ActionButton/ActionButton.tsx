import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import * as React from "react";
import clsx from "clsx";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { usePressTap, type UsePressTapReturn } from "../../hooks/use-press-tap";

// Root/TextSlot 은 `withProvider("view", ...)` / `withContext("text", ...)` 를 사용하지 않는다.
// intrinsic string 인자는 `React.createElement("view", ...)` 로 컴파일되어 Lynx 컴파일러의
// 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다.
// 대신 아래처럼 이 파일 안에 `forwardRef` + 리터럴 `<view>` / `<text>` JSX 를 직접 작성한다.
// (자세한 내용: `packages/lynx-react/AGENTS.md` 의 "Native tag literal JSX constraint" 섹션)
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(actionButton);

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

const ActionButtonRoot = React.forwardRef<
  unknown,
  ActionButtonVariantProps & ActionButtonRootOwnProps
>((innerProps, ref) => {
  const props = { layout: "withText" as const, ...innerProps };
  const [variantProps, otherProps] = actionButton.splitVariantProps(props);
  const classNames = actionButton(variantProps);
  const {
    className: userClassName,
    children,
    ...rest
  } = otherProps as ActionButtonRootOwnProps & Record<string, unknown>;
  return (
    <ClassNamesProvider value={classNames}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        {...rest}
        className={clsx(classNames.root, userClassName)}
      >
        {children as React.ReactNode}
      </view>
    </ClassNamesProvider>
  );
});
ActionButtonRoot.displayName = "ActionButtonRoot";

const ActionButtonTextSlot = React.forwardRef<
  unknown,
  { children?: React.ReactNode; className?: string }
>((props, ref) => {
  const { children, className: userClassName, ...rest } = props;
  const classNames = useClassNames();
  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      {...rest}
      className={clsx(classNames.text, userClassName)}
    >
      {children}
    </text>
  );
});
ActionButtonTextSlot.displayName = "ActionButtonTextSlot";

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
