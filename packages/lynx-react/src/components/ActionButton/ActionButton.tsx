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
import {
  ProgressCircleRange,
  ProgressCircleRoot,
  type ProgressCircleRootProps,
} from "../ProgressCircle";

// Root/TextSlot 은 `withProvider("view", ...)` / `withContext("text", ...)` 를 쓰지 않는다.
// intrinsic string 인자는 `React.createElement("view", ...)` 로 컴파일되어 Lynx 컴파일러의
// 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다.
// (자세한 내용: `packages/lynx-react/AGENTS.md` 의 "Native tag literal JSX constraint" 섹션)
const { ClassNamesProvider, useClassNames, PropsProvider, useProps } =
  createSlotRecipeContext(actionButton);

type IconSlotKey = "prefixIcon" | "suffixIcon" | "icon";
type ActionButtonSize = NonNullable<ActionButtonVariantProps["size"]>;

type IconElementProps = {
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<MainThread.Element>;
};

type ActionButtonContentProps = {
  children?: React.ReactNode;
  isIconOnly: boolean;
  icon?: ReactElement<IconElementProps>;
  prefixIcon?: ReactElement<IconElementProps>;
  suffixIcon?: ReactElement<IconElementProps>;
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

const progressCircleSizeMap = {
  xsmall: "14",
  small: "14",
  medium: "16",
  large: "18",
} as const satisfies Record<ActionButtonSize, NonNullable<ProgressCircleRootProps["size"]>>;

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
  const propsForContext = useMemo(
    () => variantProps,
    [
      variantProps.variant,
      variantProps.size,
      variantProps.layout,
      variantProps.pressed,
      variantProps.disabled,
      variantProps.loading,
    ],
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
  variantProps: ActionButtonVariantProps | null,
  slot: IconSlotKey,
): string | undefined {
  const size = variantProps?.size ?? "medium";
  // `icon` slot is only rendered under `layout="iconOnly"` and keyed at
  // `sizeXxxLayoutIconOnly.enabled.icon.size`. prefixIcon/suffixIcon follow
  // the current `layout` (`withText` by default) path.
  const layout = slot === "icon" ? "iconOnly" : (variantProps?.layout ?? "withText");
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
  const variantProps = useProps() as ActionButtonVariantProps | null;
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

function ActionButtonContent({
  children,
  isIconOnly,
  icon,
  prefixIcon,
  suffixIcon,
}: ActionButtonContentProps) {
  if (isIconOnly) {
    return icon != null && isValidElement(icon) ? (
      <ActionButtonIconSlot icon={icon} slot="icon" />
    ) : null;
  }

  return (
    <>
      {prefixIcon != null && isValidElement(prefixIcon) ? (
        <ActionButtonIconSlot icon={prefixIcon} slot="prefixIcon" />
      ) : null}
      <ActionButtonTextSlot>{children}</ActionButtonTextSlot>
      {suffixIcon != null && isValidElement(suffixIcon) ? (
        <ActionButtonIconSlot icon={suffixIcon} slot="suffixIcon" />
      ) : null}
    </>
  );
}

function ActionButtonLoadingContent(props: ActionButtonContentProps) {
  const classNames = useClassNames();

  return (
    <view className={classNames.content}>
      <ActionButtonContent {...props} />
    </view>
  );
}

function ActionButtonLoadingIndicator({ size }: { size: ActionButtonSize }) {
  const classNames = useClassNames();

  return (
    <view className={classNames.loadingIndicator}>
      <ProgressCircleRoot size={progressCircleSizeMap[size]} tone="inherit">
        <ProgressCircleRange />
      </ProgressCircleRoot>
    </view>
  );
}

/**
 * @platform Lynx
 *
 * 웹 대비 차이:
 * - 아이콘 전달 방식: 웹의 `<ActionButton.PrefixIcon svg={...} />` 가 아니라 `prefixIcon` /
 *   `suffixIcon` / `icon` prop 으로 ReactElement 를 직접 넘긴다. Lynx `<text>` 가 flex
 *   컨테이너가 아니라 children 전체를 text 로 감싸면 아이콘이 flex item 이 안 되기 때문.
 * - 미지원 prop: `color`, `fontWeight`, `bleedX`, `bleedY` (CSS variable 동적 주입 제한)
 *
 * ```tsx
 * import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
 * import IconChevronDownFill from "@karrotmarket/lynx-monochrome-icon/IconChevronDownFill";
 *
 * // withText (기본)
 * <ActionButton
 *   variant="brandSolid"
 *   prefixIcon={<IconPlusFill />}
 *   suffixIcon={<IconChevronDownFill />}
 * >
 *   라벨
 * </ActionButton>
 *
 * // iconOnly — `icon` prop 과 `aria-label` 필수
 * <ActionButton
 *   layout="iconOnly"
 *   variant="neutralSolid"
 *   icon={<IconPlusFill />}
 *   aria-label="추가"
 * />
 * ```
 */
export interface ActionButtonProps extends Omit<ActionButtonVariantProps, "layout" | "pressed"> {
  children?: React.ReactNode;
  className?: string;
  flexGrow?: number;
  layout?: "withText" | "iconOnly";
  icon?: ReactElement<IconElementProps>;
  prefixIcon?: ReactElement<IconElementProps>;
  suffixIcon?: ReactElement<IconElementProps>;
  "aria-label"?: string;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export const ActionButton = React.forwardRef<unknown, ActionButtonProps>((props, ref) => {
  const {
    children,
    flexGrow,
    layout,
    icon,
    prefixIcon,
    suffixIcon,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...variantAndRest
  } = props;
  const { disabled = false, loading = false } = variantAndRest;
  const isInteractive = !disabled && !loading;
  const isIconOnly = layout === "iconOnly";
  const size = variantAndRest.size ?? "medium";

  if (process.env.NODE_ENV !== "production" && isIconOnly && !props["aria-label"]) {
    console.warn('ActionButton: `layout="iconOnly"` requires `aria-label` for accessibility.');
  }

  const { pressed, ...pressTapHandlers } = usePressTap({
    disabled: !isInteractive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });

  return (
    <ActionButtonRoot
      {...variantAndRest}
      layout={layout}
      pressed={pressed}
      ref={ref}
      style={flexGrow != null ? { flexGrow } : undefined}
      {...pressTapHandlers}
    >
      {loading ? (
        <>
          <ActionButtonLoadingIndicator size={size} />
          <ActionButtonLoadingContent
            isIconOnly={isIconOnly}
            icon={icon}
            prefixIcon={prefixIcon}
            suffixIcon={suffixIcon}
          >
            {children}
          </ActionButtonLoadingContent>
        </>
      ) : (
        <ActionButtonContent
          isIconOnly={isIconOnly}
          icon={icon}
          prefixIcon={prefixIcon}
          suffixIcon={suffixIcon}
        >
          {children}
        </ActionButtonContent>
      )}
    </ActionButtonRoot>
  );
});
ActionButton.displayName = "ActionButton";
