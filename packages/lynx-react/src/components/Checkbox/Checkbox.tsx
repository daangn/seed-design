import * as React from "react";
import { isValidElement, type ReactElement } from "react";
import clsx from "clsx";

import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import type { CheckboxVariantProps } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import type { CheckmarkVariantProps } from "@seed-design/lynx-css/recipes/checkmark";
import { checkboxGroup } from "@seed-design/lynx-css/recipes/checkbox-group";
import {
  CheckboxRoot as HeadlessCheckboxRoot,
  useCheckboxContext as useHeadlessCheckboxContext,
} from "@seed-design/lynx-checkbox";

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
  checkboxVariantProps: CheckboxVariantProps;
  checkmarkVariantProps: CheckmarkVariantProps;
}

const CheckboxRecipeContext = React.createContext<CheckboxApi | null>(null);

function useCheckboxRecipeContext(consumer: string): CheckboxApi {
  const ctx = React.useContext(CheckboxRecipeContext);
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
    style,
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    onCheckedChange,
    ...restProps
  } = props;
  const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, nativeProps] =
    splitMultipleVariantsProps(restProps, { checkbox, checkmark });

  const rootClassName = checkbox({ ...checkboxVariantProps, disabled }).root;

  const api = React.useMemo<CheckboxApi>(
    () => ({
      checkboxVariantProps,
      checkmarkVariantProps,
    }),
    [checkboxVariantProps, checkmarkVariantProps],
  );

  return (
    <HeadlessCheckboxRoot
      {...nativeProps}
      ref={ref}
      checked={checkedProp}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      className={clsx(rootClassName, className)}
      style={style}
    >
      <CheckboxRecipeContext.Provider value={api}>{children}</CheckboxRecipeContext.Provider>
    </HeadlessCheckboxRoot>
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
  const api = useCheckboxRecipeContext("CheckboxControl");
  const state = useHeadlessCheckboxContext("CheckboxControl");
  const checkmarkVariantProps: CheckmarkVariantProps = {
    ...api.checkmarkVariantProps,
    ...variantProps,
    checked: state.checked,
    disabled: state.disabled,
    indeterminate: state.indeterminate,
    pressed: state.active,
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
  const state = useHeadlessCheckboxContext("CheckboxIndicator");
  const { iconClassName, checkmarkVariantProps } = useCheckmarkControlContext("CheckboxIndicator");

  if (process.env.NODE_ENV !== "production" && state.indeterminate && !indeterminateIcon) {
    console.warn(
      "[seed-design] CheckboxIndicator: `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
    );
  }

  const icon = state.indeterminate ? indeterminateIcon : state.checked ? checkedIcon : unchecked;
  if (!icon || !isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <InternalIcon
      icon={icon}
      className={clsx(iconClassName, className)}
      style={style}
      deps={[
        state.checked,
        state.indeterminate,
        state.disabled,
        state.active,
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
  const api = useCheckboxRecipeContext("CheckboxLabel");
  const state = useHeadlessCheckboxContext("CheckboxLabel");
  const labelClassName = checkbox({ ...api.checkboxVariantProps, disabled: state.disabled }).label;

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
