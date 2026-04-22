import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import { actionButton as actionButtonVars } from "@seed-design/lynx-css/vars/component";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "react";
import { cloneElement, isValidElement, useMemo, type ReactElement } from "react";

import { useIconColor } from "../../hooks/use-icon-color";
import { usePressTap, type UsePressTapReturn } from "../../hooks/use-press-tap";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { capitalize, resolveRecipeToken } from "../../utils/resolve-recipe-token";

// Root/TextSlot 은 `withProvider("view", ...)` / `withContext("text", ...)` 를 쓰지 않는다.
// intrinsic string 인자는 `React.createElement("view", ...)` 로 컴파일되어 Lynx 컴파일러의
// 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다.
// (자세한 내용: `packages/lynx-react/AGENTS.md` 의 "Native tag literal JSX constraint" 섹션)
const { ClassNamesProvider, useClassNames, PropsProvider, useProps } =
  createSlotRecipeContext(actionButton);

// recipe .d.ts 는 CSS variant 만 선언하지만 런타임은 state modifier 도 지원
// (postcss-lynx-compat 이 pseudo selector 를 class modifier 로 변환).
type ActionButtonRuntimeVariantProps = ActionButtonVariantProps & {
  disabled?: boolean;
  loading?: boolean;
};

type IconSlotKey = "prefixIcon" | "suffixIcon";

type IconElementProps = {
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<MainThread.Element>;
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
  const { disabled, loading } = innerProps;
  const propsForContext = useMemo(
    () => ({ ...variantProps, disabled, loading }) as ActionButtonRuntimeVariantProps,
    [variantProps.variant, variantProps.size, variantProps.layout, disabled, loading],
  );
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
 * rootage vars 에서 현재 variant/size/layout 조합의 slot `size` 토큰
 * (예: `"var(--seed-dimension-x4)"`) 을 꺼낸다. 아이콘 컴포넌트가 inline
 * `style={{ width, height }}` 를 박기 때문에 style prop 으로 덮어 씌워야 recipe 사이즈가 적용된다.
 */
function resolveIconSize(
  variantProps: ActionButtonRuntimeVariantProps | null,
  slot: IconSlotKey,
): string | undefined {
  const size = variantProps?.size ?? "medium";
  const layout = variantProps?.layout ?? "withText";
  return resolveRecipeToken(actionButtonVars, [
    `size${capitalize(size)}Layout${capitalize(layout)}`,
    "enabled",
    slot,
    "size",
  ]);
}

/**
 * `prefixIcon` / `suffixIcon` prop 으로 전달된 아이콘 element 에 slot className +
 * size(style) + main-thread tint-color ref 를 주입한다.
 */
function ActionButtonIconSlot({
  icon,
  slot,
}: {
  icon: ReactElement<IconElementProps>;
  slot: IconSlotKey;
}) {
  const classNames = useClassNames();
  const variantProps = useProps() as ActionButtonRuntimeVariantProps | null;
  const { ref } = useIconColor([
    variantProps?.variant ?? null,
    variantProps?.disabled ?? false,
    variantProps?.loading ?? false,
  ]);
  const sizeVar = resolveIconSize(variantProps, slot);
  const childProps = icon.props;
  return cloneElement(icon, {
    className: clsx(classNames[slot], childProps.className),
    style:
      sizeVar != null ? { width: sizeVar, height: sizeVar, ...childProps.style } : childProps.style,
    ref: ref as React.Ref<MainThread.Element>,
  });
}

/**
 * @platform Lynx
 *
 * 미지원 기능 (Lynx 3.7 SVG 지원 후 추가 예정):
 * - layout: "iconOnly": SVG 아이콘 렌더링 필요
 *
 * 웹 대비 차이:
 * - 아이콘 전달 방식: 웹의 `<ActionButton.PrefixIcon svg={...} />` 가 아니라 `prefixIcon` /
 *   `suffixIcon` prop 으로 ReactElement 를 직접 넘긴다. Lynx `<text>` 가 flex 컨테이너가
 *   아니라 children 전체를 text 로 감싸면 아이콘이 flex item 이 안 되기 때문.
 * - 미지원 prop: `color`, `fontWeight`, `bleedX`, `bleedY` (CSS variable 동적 주입 제한)
 *
 * ```tsx
 * import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
 * import IconChevronDownFill from "@karrotmarket/lynx-monochrome-icon/IconChevronDownFill";
 *
 * <ActionButton
 *   variant="brandSolid"
 *   prefixIcon={<IconPlusFill />}
 *   suffixIcon={<IconChevronDownFill />}
 * >
 *   라벨
 * </ActionButton>
 * ```
 */
export interface ActionButtonProps extends Omit<ActionButtonRuntimeVariantProps, "layout"> {
  children?: React.ReactNode;
  className?: string;
  flexGrow?: number;
  prefixIcon?: ReactElement<IconElementProps>;
  suffixIcon?: ReactElement<IconElementProps>;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export const ActionButton = React.forwardRef<unknown, ActionButtonProps>((props, ref) => {
  const {
    children,
    flexGrow,
    prefixIcon,
    suffixIcon,
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
      {prefixIcon != null && isValidElement(prefixIcon) ? (
        <ActionButtonIconSlot icon={prefixIcon} slot="prefixIcon" />
      ) : null}
      {loading ? children : <ActionButtonTextSlot>{children}</ActionButtonTextSlot>}
      {suffixIcon != null && isValidElement(suffixIcon) ? (
        <ActionButtonIconSlot icon={suffixIcon} slot="suffixIcon" />
      ) : null}
    </ActionButtonRoot>
  );
});
ActionButton.displayName = "ActionButton";
