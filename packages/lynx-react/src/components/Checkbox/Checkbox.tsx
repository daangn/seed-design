import * as React from "react";
import { isValidElement, type ReactElement } from "react";
import clsx from "clsx";

import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import type { CheckboxVariantProps } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import type { CheckmarkVariantProps } from "@seed-design/lynx-css/recipes/checkmark";
import { checkboxGroup } from "@seed-design/lynx-css/recipes/checkbox-group";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type { LynxIconElementProps, LynxStyledElementProps } from "../../types";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { InternalIcon } from "../Icon/Icon";

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

interface CheckboxApi {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  pressed: boolean;
  checkboxVariantProps: CheckboxVariantProps;
  checkmarkVariantProps: CheckmarkVariantProps;
  toggle: () => void;
}

const CheckboxContext = React.createContext<CheckboxApi | null>(null);

function useCheckboxContext(consumer: string): CheckboxApi {
  const ctx = React.useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <CheckboxRoot/>.`);
  }
  return ctx;
}

interface CheckmarkControlContextValue {
  iconClassName: string;
  checkmarkVariantProps: CheckmarkVariantProps;
}

const CheckmarkControlContext = React.createContext<CheckmarkControlContextValue | null>(null);

function useCheckmarkControlContext(consumer: string): CheckmarkControlContextValue {
  const ctx = React.useContext(CheckmarkControlContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <CheckboxControl/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxRootProps
  extends CheckboxVariantProps,
    Omit<CheckmarkVariantProps, "size" | "checked" | "disabled" | "indeterminate">,
    LynxStyledElementProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
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
    onCheckedChange,
    ...restProps
  } = props;
  const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { checkbox, checkmark });

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const toggle = React.useCallback(() => setChecked(!checked), [checked, setChecked]);

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: toggle,
  });

  const rootClassName = checkbox({ ...checkboxVariantProps, disabled }).root;

  const api = React.useMemo<CheckboxApi>(
    () => ({
      checked,
      indeterminate,
      disabled,
      pressed,
      checkboxVariantProps,
      checkmarkVariantProps,
      toggle,
    }),
    [
      checked,
      indeterminate,
      disabled,
      pressed,
      checkboxVariantProps,
      checkmarkVariantProps,
      toggle,
    ],
  );

  return (
    <CheckboxContext.Provider value={api}>
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
  extends Pick<CheckmarkVariantProps, "tone" | "variant" | "size">,
    LynxStyledElementProps {}

export const CheckboxControl = React.forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const [variantProps, restProps] = checkmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const api = useCheckboxContext("CheckboxControl");
  const checkmarkVariantProps: CheckmarkVariantProps = {
    ...api.checkmarkVariantProps,
    ...variantProps,
    checked: api.checked,
    disabled: api.disabled,
    indeterminate: api.indeterminate,
    pressed: api.pressed,
  };
  const classes = checkmark(checkmarkVariantProps);

  return (
    <CheckmarkControlContext.Provider
      value={{ iconClassName: classes.icon, checkmarkVariantProps }}
    >
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </CheckmarkControlContext.Provider>
  );
});
CheckboxControl.displayName = "CheckboxControl";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxIndicatorProps
  extends Pick<LynxStyledElementProps, "className" | "style"> {
  /** Icon rendered when neither checked nor indeterminate. Optional. */
  unchecked?: ReactElement<LynxIconElementProps>;
  /** Icon rendered when `checked=true` and `indeterminate=false`. */
  checked: ReactElement<LynxIconElementProps>;
  /** Icon rendered when `indeterminate=true`. */
  indeterminate?: ReactElement<LynxIconElementProps>;
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const {
    unchecked,
    checked: checkedIcon,
    indeterminate: indeterminateIcon,
    className,
    style,
  } = props;
  const api = useCheckboxContext("CheckboxIndicator");
  const { iconClassName, checkmarkVariantProps } = useCheckmarkControlContext("CheckboxIndicator");

  if (process.env.NODE_ENV !== "production" && api.indeterminate && !indeterminateIcon) {
    console.warn(
      "[seed-design] CheckboxIndicator: `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
    );
  }

  const icon = api.indeterminate ? indeterminateIcon : api.checked ? checkedIcon : unchecked;
  if (!icon || !isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <InternalIcon
      icon={icon}
      className={clsx(iconClassName, className)}
      style={style}
      deps={[
        api.checked,
        api.indeterminate,
        api.disabled,
        api.pressed,
        checkmarkVariantProps.tone,
        checkmarkVariantProps.variant,
        checkmarkVariantProps.size,
      ]}
    />
  );
}
CheckboxIndicator.displayName = "CheckboxIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxLabelProps extends LynxStyledElementProps {}

export const CheckboxLabel = React.forwardRef<unknown, CheckboxLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const api = useCheckboxContext("CheckboxLabel");
  const labelClassName = checkbox({ ...api.checkboxVariantProps, disabled: api.disabled }).label;

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

export interface CheckboxGroupProps extends LynxStyledElementProps {}

export const CheckboxGroup = React.forwardRef<unknown, CheckboxGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = checkboxGroup();

  return (
    <view
      {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
      className={clsx(classes.root, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";
