import * as React from "react";
import { cloneElement, isValidElement, type CSSProperties, type ReactElement } from "react";
import clsx from "clsx";
import type { MainThread } from "@lynx-js/types";

import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import type { CheckboxVariantProps } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import type { CheckmarkVariantProps } from "@seed-design/lynx-css/recipes/checkmark";
import { checkboxGroup } from "@seed-design/lynx-css/recipes/checkbox-group";
import { vars as checkmarkVars } from "@seed-design/lynx-css/vars/component/checkmark";

import { useControllableState } from "../../hooks/use-controllable-state";
import { useIconColor } from "../../hooks/use-icon-color";
import { usePressTap } from "../../hooks/use-press-tap";
import { capitalize, resolveRecipeToken } from "../../utils/resolve-recipe-token";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / value / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - onChange (raw DOM event): 의미 없음. 토글 이벤트는 onCheckedChange로만 노출
 * - weight="default" | "stronger" 호환 매핑: Lynx 신규 컴포넌트이므로 처음부터 "regular" | "bold" 만 노출
 *
 * Indicator 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를
 * 받는다. 내부에서 `<image tint-color=...>` 로 렌더되므로 `useIconColor` 훅이
 * recipe 의 `color` 토큰을 `tint-color` 로 동기화한다. raw SVG 주입은 Lynx 범위 밖.
 */

type CheckboxSize = NonNullable<CheckboxVariantProps["size"]>;
type CheckboxWeight = NonNullable<CheckboxVariantProps["weight"]>;
type CheckmarkTone = NonNullable<CheckmarkVariantProps["tone"]>;
type CheckmarkVariant = NonNullable<CheckmarkVariantProps["variant"]>;

interface CheckboxContextValue {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  pressed: boolean;
  size: CheckboxSize;
  weight: CheckboxWeight;
  tone: CheckmarkTone;
  variant: CheckmarkVariant;
}

const CheckboxContext = React.createContext<CheckboxContextValue | null>(null);

function useCheckboxContext(consumer: string): CheckboxContextValue {
  const ctx = React.useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <CheckboxRoot/>.`);
  }
  return ctx;
}

const CheckmarkIconClassContext = React.createContext<string | null>(null);

function useCheckmarkIconClass(consumer: string): string {
  const ctx = React.useContext(CheckmarkIconClassContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <CheckboxControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxRootProps
  extends CheckboxVariantProps,
    Omit<CheckmarkVariantProps, "size" | "checked" | "disabled" | "indeterminate"> {
  children?: React.ReactNode;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxRoot = React.forwardRef<unknown, CheckboxRootProps>((props, ref) => {
  const {
    children,
    className,
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    readOnly = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { checkbox, checkmark });
  const weight: CheckboxWeight = checkboxVariantProps.weight ?? "regular";
  const size: CheckboxSize = checkboxVariantProps.size ?? "medium";
  const tone: CheckmarkTone = checkmarkVariantProps.tone ?? "brand";
  const variant: CheckmarkVariant = checkmarkVariantProps.variant ?? "square";

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const { pressed, ...pressHandlers } = usePressTap({
    disabled: disabled || readOnly,
    onTap: () => setChecked(!checked),
  });

  const rootClassName = checkbox({ weight, size, disabled }).root;

  const ctx = React.useMemo<CheckboxContextValue>(
    () => ({ checked, indeterminate, disabled, pressed, size, weight, tone, variant }),
    [checked, indeterminate, disabled, pressed, size, weight, tone, variant],
  );

  return (
    <CheckboxContext.Provider value={ctx}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(rootClassName, className)}
        {...pressHandlers}
        {...nativeProps}
      >
        {children}
      </view>
    </CheckboxContext.Provider>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxControlProps
  extends Pick<CheckmarkVariantProps, "tone" | "variant" | "size"> {
  children?: React.ReactNode;
  className?: string;
}

export const CheckboxControl = React.forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const [variantProps, restProps] = checkmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const {
    checked,
    indeterminate,
    disabled,
    pressed,
    tone: ctxTone,
    variant: ctxVariant,
    size: ctxSize,
  } = useCheckboxContext("CheckboxControl");

  const tone: CheckmarkTone = variantProps.tone ?? ctxTone;
  const variant: CheckmarkVariant = variantProps.variant ?? ctxVariant;
  const size: CheckboxSize = (variantProps.size as CheckboxSize | undefined) ?? ctxSize;

  const classes = React.useMemo(
    () => checkmark({ variant, tone, size, checked, disabled, indeterminate, pressed }),
    [variant, tone, size, checked, disabled, indeterminate, pressed],
  );

  return (
    <CheckmarkIconClassContext.Provider value={classes.icon}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </CheckmarkIconClassContext.Provider>
  );
});
CheckboxControl.displayName = "CheckboxControl";

////////////////////////////////////////////////////////////////////////////////////

type IconElementProps = {
  className?: string;
  style?: CSSProperties;
  ref?: React.Ref<MainThread.Element>;
};

export interface CheckboxIndicatorProps {
  /** Icon rendered when neither checked nor indeterminate. Optional. */
  unchecked?: ReactElement<IconElementProps>;
  /** Icon rendered when `checked=true` and `indeterminate=false`. */
  checked: ReactElement<IconElementProps>;
  /** Icon rendered when `indeterminate=true`. */
  indeterminate?: ReactElement<IconElementProps>;
  className?: string;
  style?: CSSProperties;
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const {
    unchecked,
    checked: checkedIcon,
    indeterminate: indeterminateIcon,
    className,
    style,
  } = props;
  const { checked, indeterminate, disabled, pressed, tone, variant, size } =
    useCheckboxContext("CheckboxIndicator");
  const iconClassName = useCheckmarkIconClass("CheckboxIndicator");
  const { ref: tintRef } = useIconColor([
    checked,
    indeterminate,
    disabled,
    pressed,
    tone,
    variant,
    size,
  ]);

  if (process.env.NODE_ENV !== "production" && indeterminate && !indeterminateIcon) {
    console.warn(
      "[seed-design] CheckboxIndicator: `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
    );
  }

  const icon = indeterminate ? indeterminateIcon : checked ? checkedIcon : unchecked;
  if (!icon || !isValidElement<IconElementProps>(icon)) return null;

  // lynx-monochrome-icon 이 `<image style={{ width, height, ...style }}>` 로 자체 default size 를 박으므로
  // recipe 토큰에서 꺼낸 사이즈를 inline 으로 주입해 덮는다.
  const iconSize = resolveRecipeToken(checkmarkVars, [
    `variant${capitalize(variant)}Size${capitalize(size)}`,
    "enabled",
    "icon",
    "size",
  ]);

  return cloneElement(icon, {
    className: clsx(iconClassName, icon.props.className, className),
    style: iconSize
      ? { width: iconSize, height: iconSize, ...icon.props.style, ...style }
      : { ...icon.props.style, ...style },
    ref: tintRef,
  });
}
CheckboxIndicator.displayName = "CheckboxIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const CheckboxLabel = React.forwardRef<unknown, CheckboxLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { disabled, weight, size } = useCheckboxContext("CheckboxLabel");
  const labelClassName = checkbox({ weight, size, disabled }).label;

  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      className={clsx(labelClassName, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
CheckboxLabel.displayName = "CheckboxLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxGroupProps {
  children?: React.ReactNode;
  className?: string;
}

export const CheckboxGroup = React.forwardRef<unknown, CheckboxGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = checkboxGroup();

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      className={clsx(classes, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";
