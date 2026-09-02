import { actionButton } from "@seed-design/lynx-css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/lynx-css/recipes/action-button";
import { progressCircleVariantMap } from "@seed-design/lynx-css/recipes/progress-circle";
import { actionButton as actionButtonVars } from "@seed-design/lynx-css/vars/component";
import clsx from "clsx";
import * as React from "@lynx-js/react";
import { isValidElement, useMemo } from "@lynx-js/react";

import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxTouchProps,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { toArray } from "../../utils/children";
import { capitalize, resolveRecipeToken } from "../../utils/resolve-recipe-token";
import { resolveFlexValue, type StyleProps } from "../../utils/styled";
import {
  ProgressCircleRange,
  ProgressCircleRoot,
  type ProgressCircleRootProps,
} from "../ProgressCircle";
import {
  Icon,
  IconRequired,
  IconSlotProvider,
  PrefixIcon,
  SuffixIcon,
  getIconSlotName,
  type IconProps,
  type PrefixIconProps,
  type SuffixIconProps,
} from "../Icon/Icon";

// Root/TextSlot 은 `withProvider("view", ...)` / `withContext("text", ...)` 를 쓰지 않는다.
// intrinsic string 인자는 `React.createElement("view", ...)` 로 컴파일되어 Lynx 컴파일러의
// 리터럴 JSX 정적 분석을 우회하고 `BackgroundSnapshot not found: view` 런타임 에러를 유발한다.
// (자세한 내용: `packages/lynx-react/AGENTS.md` 의 "Native tag literal JSX constraint" 섹션)
const { ClassNamesProvider, useClassNames, PropsProvider } = createSlotRecipeContext(actionButton);

////////////////////////////////////////////////////////////////////////////////////

interface ActionButtonContentProps extends LynxElementProps {
  isIconOnly: boolean;
  icon?: IconProps["icon"];
  prefixIcon?: PrefixIconProps["icon"];
  suffixIcon?: SuffixIconProps["icon"];
}

interface ActionButtonAccessibilityProps {
  "accessibility-label"?: LynxViewProps["accessibility-label"];
  "accessibility-element"?: LynxViewProps["accessibility-element"];
  "accessibility-traits"?: LynxViewProps["accessibility-traits"];
}

interface ActionButtonRootOwnProps
  extends LynxStyledElementProps,
    LynxTouchProps,
    ActionButtonAccessibilityProps {}

interface ActionButtonRootProps extends ActionButtonVariantProps, ActionButtonRootOwnProps {}

function resolveProgressCircleSize(
  actionButtonSize: ActionButtonVariantProps["size"],
): ProgressCircleRootProps["size"] {
  const size = actionButtonSize ?? "medium";
  const token = resolveRecipeToken(actionButtonVars, [
    `size${capitalize(size)}`,
    "enabled",
    "progressCircle",
    "size",
  ]);
  const normalized = token?.endsWith("px") ? token.slice(0, -2) : token;

  return progressCircleVariantMap.size.find((size) => size === normalized) ?? "16";
}

////////////////////////////////////////////////////////////////////////////////////

const ActionButtonRoot = React.forwardRef<unknown, ActionButtonRootProps>((innerProps, ref) => {
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
  const iconSlotContextValue = useMemo(
    () => ({
      classNames: {
        icon: classNames.icon,
        prefixIcon: classNames.prefixIcon,
        suffixIcon: classNames.suffixIcon,
      },
      deps: [
        variantProps.variant ?? null,
        variantProps.disabled ?? false,
        variantProps.loading ?? false,
        variantProps.pressed ?? false,
      ],
    }),
    [
      classNames.icon,
      classNames.prefixIcon,
      classNames.suffixIcon,
      variantProps.variant,
      variantProps.disabled,
      variantProps.loading,
      variantProps.pressed,
    ],
  );
  return (
    <ClassNamesProvider value={classNames}>
      <PropsProvider value={propsForContext}>
        <IconSlotProvider value={iconSlotContextValue}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...rest}
            className={clsx(classNames.root, userClassName)}
          >
            {children as React.ReactNode}
          </view>
        </IconSlotProvider>
      </PropsProvider>
    </ClassNamesProvider>
  );
});
ActionButtonRoot.displayName = "ActionButtonRoot";

////////////////////////////////////////////////////////////////////////////////////

interface ActionButtonTextSlotProps extends LynxElementProps {}

const ActionButtonTextSlot = React.forwardRef<unknown, ActionButtonTextSlotProps>((props, ref) => {
  const { children, className: userClassName, ...rest } = props;
  const classNames = useClassNames();
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...rest}
      className={clsx(classNames.text, userClassName)}
    >
      {children}
    </text>
  );
});
ActionButtonTextSlot.displayName = "ActionButtonTextSlot";

////////////////////////////////////////////////////////////////////////////////////

function ActionButtonContent({
  children,
  isIconOnly,
  icon,
  prefixIcon,
  suffixIcon,
}: ActionButtonContentProps) {
  const childArray = toArray(children);
  const prefixIconChildren: React.ReactNode[] = [];
  const suffixIconChildren: React.ReactNode[] = [];
  const iconChildren: React.ReactNode[] = [];
  const textChildren: React.ReactNode[] = [];

  for (const child of childArray) {
    const slotName = getIconSlotName(child);

    if (slotName === "prefixIcon") {
      prefixIconChildren.push(child);
      continue;
    }
    if (slotName === "suffixIcon") {
      suffixIconChildren.push(child);
      continue;
    }
    if (slotName === "icon") {
      iconChildren.push(child);
      continue;
    }

    textChildren.push(child);
  }

  if (isIconOnly) {
    if (icon != null && isValidElement(icon)) return <Icon icon={icon} />;
    return iconChildren.length > 0 ? <>{iconChildren}</> : null;
  }

  return (
    <>
      {prefixIcon != null && isValidElement(prefixIcon) ? <PrefixIcon icon={prefixIcon} /> : null}
      {prefixIconChildren}
      {textChildren.length > 0 ? <ActionButtonTextSlot>{textChildren}</ActionButtonTextSlot> : null}
      {suffixIconChildren}
      {suffixIcon != null && isValidElement(suffixIcon) ? <SuffixIcon icon={suffixIcon} /> : null}
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////////

function ActionButtonLoadingContent(props: ActionButtonContentProps) {
  const classNames = useClassNames();

  return (
    <view className={classNames.content}>
      <ActionButtonContent {...props} />
    </view>
  );
}

////////////////////////////////////////////////////////////////////////////////////

function ActionButtonLoadingIndicator({ size }: { size: ActionButtonVariantProps["size"] }) {
  const classNames = useClassNames();
  const progressCircleSize = resolveProgressCircleSize(size);

  return (
    <view className={classNames.loadingIndicator}>
      <ProgressCircleRoot size={progressCircleSize} tone="inherit">
        <ProgressCircleRange />
      </ProgressCircleRoot>
    </view>
  );
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 차이:
 * - 아이콘 렌더링: 웹의 SVG `currentColor` 대신 Lynx `<image>` 의 `tint-color` 를
 *   `Icon` / `PrefixIcon` / `SuffixIcon` wrapper 가 동기화한다.
 * - 호환 API: 기존 `prefixIcon` / `suffixIcon` / `icon` prop 도 유지한다.
 * - 미지원 prop: `color`, `fontWeight`, `bleedX`, `bleedY` (CSS variable 동적 주입 제한)
 *
 * ```tsx
 * import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
 * import IconChevronDownFill from "@karrotmarket/lynx-monochrome-icon/IconChevronDownFill";
 * import { Icon, PrefixIcon, SuffixIcon } from "@seed-design/lynx-react";
 *
 * // withText (기본)
 * <ActionButton variant="brandSolid">
 *   <PrefixIcon icon={<IconPlusFill />} />
 *   라벨
 *   <SuffixIcon icon={<IconChevronDownFill />} />
 * </ActionButton>
 *
 * // iconOnly — `<Icon />` child 와 `accessibility-label` 필수
 * <ActionButton
 *   layout="iconOnly"
 *   variant="neutralSolid"
 *   accessibility-label="추가"
 * >
 *   <Icon icon={<IconPlusFill />} />
 * </ActionButton>
 * ```
 */
export interface ActionButtonProps
  extends Omit<ActionButtonVariantProps, "pressed">,
    Pick<StyleProps, "flexGrow">,
    LynxElementProps,
    LynxPressableProps,
    ActionButtonAccessibilityProps {
  icon?: IconProps["icon"];
  prefixIcon?: PrefixIconProps["icon"];
  suffixIcon?: SuffixIconProps["icon"];
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
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
    ...variantAndRest
  } = props;
  const { disabled = false, loading = false } = variantAndRest;
  const isInteractive = !disabled && !loading;
  const isIconOnly = layout === "iconOnly";
  const size = variantAndRest.size;

  if (
    process.env.NODE_ENV !== "production" &&
    isIconOnly &&
    accessibilityElement &&
    !accessibilityLabel
  ) {
    console.warn(
      'ActionButton: `layout="iconOnly"` requires `accessibility-label` for accessibility.',
    );
  }

  const {
    pressed,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...pressTapHandlers
  } = usePressTap({
    disabled: !isInteractive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: !isInteractive,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  return (
    <IconRequired enabled={isIconOnly}>
      <ActionButtonRoot
        {...variantAndRest}
        layout={layout}
        pressed={pressed}
        ref={ref}
        style={flexGrow != null ? { flexGrow: resolveFlexValue(flexGrow) } : undefined}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-traits={accessibilityTraits}
        {...scaleFeedbackTargetProps}
        {...scaleFeedbackTriggerProps}
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
    </IconRequired>
  );
});
ActionButton.displayName = "ActionButton";
