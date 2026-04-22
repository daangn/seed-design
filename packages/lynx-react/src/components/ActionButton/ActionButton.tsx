import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import { actionButton as actionButtonVars } from "@seed-design/lynx-css/vars/component";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "react";
import { cloneElement, isValidElement, type ReactElement } from "react";

import { useIconColor } from "../../hooks/use-icon-color";
import { usePressTap, type UsePressTapReturn } from "../../hooks/use-press-tap";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { capitalize, resolveRecipeToken } from "../../utils/resolve-recipe-token";

// Root/TextSlot 은 `withProvider("view", ...)` / `withContext("text", ...)` 를 사용하지 않는다.
// intrinsic string 인자는 `React.createElement("view", ...)` 로 컴파일되어 Lynx 컴파일러의
// 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다.
// 대신 아래처럼 이 파일 안에 `forwardRef` + 리터럴 `<view>` / `<text>` JSX 를 직접 작성한다.
// (자세한 내용: `packages/lynx-react/AGENTS.md` 의 "Native tag literal JSX constraint" 섹션)
const { ClassNamesProvider, useClassNames, PropsProvider, useProps } =
  createSlotRecipeContext(actionButton);

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

const ActionButtonRoot = React.forwardRef<
  unknown,
  ActionButtonRuntimeVariantProps & ActionButtonRootOwnProps
>((innerProps, ref) => {
  const props = { layout: "withText" as const, ...innerProps };
  const [variantProps, otherProps] = actionButton.splitVariantProps(props);
  const classNames = actionButton(variantProps);
  const {
    className: userClassName,
    children,
    ...rest
  } = otherProps as ActionButtonRootOwnProps & Record<string, unknown>;
  // 자식 슬롯(PrefixIcon/SuffixIcon)의 useIconColor 훅이 variant/disabled/loading 변경을
  // deps 로 감지할 수 있게 state modifier 까지 Props context 에 함께 저장한다.
  const propsForContext = {
    ...variantProps,
    ...(innerProps as { disabled?: boolean; loading?: boolean }),
  } as ActionButtonVariantProps;
  return (
    <ClassNamesProvider value={classNames}>
      <PropsProvider value={propsForContext}>
        <view
          {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
          {...rest}
          className={clsx(classNames.root, userClassName)}
        >
          {children as React.ReactNode}
        </view>
      </PropsProvider>
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
 * prefix/suffix 아이콘 슬롯.
 *
 * 사용법 — `@karrotmarket/lynx-monochrome-icon` 1.9.0+ 의 `forwardRef` 아이콘 컴포넌트를
 * children 으로 넘긴다. 슬롯은 slot className 을 주입하고(`recipe` 의 `color: var(--...)`
 * 가 적용되도록), `useIconColor` 훅이 main-thread 로 건너가 resolved color 를 읽어
 * `tint-color` attribute 로 mirror 한다. variant / disabled / loading 변경 시 훅이
 * 재실행되어 색이 따라 바뀐다.
 *
 * ```tsx
 * import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
 * import IconChevronDownFill from "@karrotmarket/lynx-monochrome-icon/IconChevronDownFill";
 *
 * <ActionButton variant="brandSolid">
 *   <ActionButton.PrefixIcon><IconPlusFill /></ActionButton.PrefixIcon>
 *   라벨
 *   <ActionButton.SuffixIcon><IconChevronDownFill /></ActionButton.SuffixIcon>
 * </ActionButton>
 * ```
 */
interface ActionButtonIconSlotProps {
  children: ReactElement<{
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<MainThread.Element>;
  }>;
}

function useIconDepKey(): string {
  const variantProps = useProps() as ActionButtonRuntimeVariantProps | null;
  return JSON.stringify({
    variant: variantProps?.variant ?? null,
    disabled: variantProps?.disabled ?? false,
    loading: variantProps?.loading ?? false,
  });
}

/**
 * 현재 variant/size/layout 조합에 해당하는 `prefixIcon` / `suffixIcon` 의 `size` 토큰 스트링
 * (예: `"var(--seed-dimension-x4)"`) 을 rootage vars 에서 꺼낸다. Lynx `<image>` 를
 * wrap 하는 icon 컴포넌트가 inline `style={{ width, height }}` 를 박기 때문에, 여기서
 * 계산한 CSS var 스트링을 style prop 으로 덮어 씌워 recipe 가 지정한 크기로 렌더되게 한다.
 */
function resolveIconSize(
  variantProps: ActionButtonRuntimeVariantProps | null,
  slot: "prefixIcon" | "suffixIcon",
): string | undefined {
  const size = variantProps?.size ?? "medium";
  const layout = variantProps?.layout ?? "withText";
  return resolveRecipeToken(actionButtonVars as unknown as Record<string, unknown>, [
    `size${capitalize(size)}Layout${capitalize(layout)}`,
    "enabled",
    slot,
    "size",
  ]);
}

const ActionButtonPrefixIcon = ({ children }: ActionButtonIconSlotProps) => {
  if (!isValidElement(children)) return null;
  const classNames = useClassNames();
  const variantProps = useProps() as ActionButtonRuntimeVariantProps | null;
  const depKey = useIconDepKey();
  const { ref } = useIconColor(depKey);
  const sizeVar = resolveIconSize(variantProps, "prefixIcon");
  const childProps = children.props as {
    className?: string;
    style?: React.CSSProperties;
  };
  return cloneElement(children, {
    className: clsx(classNames.prefixIcon, childProps.className),
    style:
      sizeVar != null ? { width: sizeVar, height: sizeVar, ...childProps.style } : childProps.style,
    ref: ref as React.Ref<MainThread.Element>,
  });
};
ActionButtonPrefixIcon.displayName = "ActionButton.PrefixIcon";

const ActionButtonSuffixIcon = ({ children }: ActionButtonIconSlotProps) => {
  if (!isValidElement(children)) return null;
  const classNames = useClassNames();
  const variantProps = useProps() as ActionButtonRuntimeVariantProps | null;
  const depKey = useIconDepKey();
  const { ref } = useIconColor(depKey);
  const sizeVar = resolveIconSize(variantProps, "suffixIcon");
  const childProps = children.props as {
    className?: string;
    style?: React.CSSProperties;
  };
  return cloneElement(children, {
    className: clsx(classNames.suffixIcon, childProps.className),
    style:
      sizeVar != null ? { width: sizeVar, height: sizeVar, ...childProps.style } : childProps.style,
    ref: ref as React.Ref<MainThread.Element>,
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
