import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type { ReactNode, Ref } from "react";

import { ButtonRoot } from "@seed-design/lynx-button";
import type { ButtonNativeProps, ButtonRootProps } from "@seed-design/lynx-button";
import { useControllableState } from "@seed-design/lynx-use-controllable-state";

import { cx, renderWithState } from "./utils";

export interface CheckboxState {
  active: boolean;
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
}

export interface CheckboxNativeProps extends ButtonNativeProps {}

export interface CheckboxRootProps
  extends Omit<ButtonRootProps, "buttonProps" | "children" | "onClick"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode | ((state: CheckboxState) => ReactNode);
  checkboxProps?: CheckboxNativeProps;
}

export interface CheckboxControlProps extends CheckboxNativeProps {
  children?: ReactNode;
  checkboxProps?: CheckboxNativeProps;
}

export interface CheckboxIndicatorProps extends CheckboxNativeProps {
  forceMount?: boolean;
  children?: ReactNode | ((state: CheckboxState) => ReactNode);
  indicatorProps?: CheckboxNativeProps;
}

const CheckboxContext = createContext<CheckboxState | null>(null);

export function useCheckboxContext(consumer = "useCheckboxContext"): CheckboxState {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used inside <CheckboxRoot/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export const CheckboxRoot = forwardRef<unknown, CheckboxRootProps>((props, ref) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    onCheckedChange,
    children,
    className,
    style,
    checkboxProps,
    "accessibility-role-description": accessibilityRoleDescription = "checkbox",
    ...rootProps
  } = props;
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const toggle = () => {
    if (disabled) return;
    setChecked(!checked);
  };

  return (
    <ButtonRoot
      {...rootProps}
      ref={ref}
      disabled={disabled}
      onClick={toggle}
      className={cx(className, checked && "ui-checked", indeterminate && "ui-indeterminate")}
      style={style}
      buttonProps={checkboxProps}
      accessibility-role-description={accessibilityRoleDescription}
    >
      {(buttonState) => {
        const state: CheckboxState = {
          active: buttonState.active,
          checked,
          disabled: buttonState.disabled,
          indeterminate,
        };

        return (
          <CheckboxContext.Provider value={state}>
            {renderWithState(children, state)}
          </CheckboxContext.Provider>
        );
      }}
    </ButtonRoot>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

////////////////////////////////////////////////////////////////////////////////////

export const CheckboxControl = forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const { children, className, style, checkboxProps, ...controlProps } = props;
  const state = useCheckboxContext("CheckboxControl");

  return (
    <view
      {...controlProps}
      {...checkboxProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={cx(
        checkboxProps?.className,
        className,
        state.active && "ui-active",
        state.checked && "ui-checked",
        state.disabled && "ui-disabled",
        state.indeterminate && "ui-indeterminate",
      )}
      style={style ?? checkboxProps?.style}
    >
      {children}
    </view>
  );
});
CheckboxControl.displayName = "CheckboxControl";

////////////////////////////////////////////////////////////////////////////////////

export const CheckboxIndicator = forwardRef<unknown, CheckboxIndicatorProps>((props, ref) => {
  const { forceMount = false, children, className, style, indicatorProps, ...rootProps } = props;
  const state = useCheckboxContext("CheckboxIndicator");
  const shouldRender = forceMount || state.checked || state.indeterminate;

  if (!shouldRender) return null;

  return (
    <view
      {...rootProps}
      {...indicatorProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={cx(
        indicatorProps?.className,
        className,
        state.active && "ui-active",
        state.checked && "ui-checked",
        state.disabled && "ui-disabled",
        state.indeterminate && "ui-indeterminate",
      )}
      style={style ?? indicatorProps?.style}
    >
      {renderWithState(children, state)}
    </view>
  );
});
CheckboxIndicator.displayName = "CheckboxIndicator";
