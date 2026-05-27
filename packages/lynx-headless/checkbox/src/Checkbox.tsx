import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type { ReactNode, Ref } from "react";

import { ButtonRoot } from "@seed-design/lynx-button";
import type { ButtonNativeProps, ButtonRootProps } from "@seed-design/lynx-button";
import { useControllableState } from "@seed-design/lynx-use-controllable-state";

import { renderWithState } from "./utils";

export interface CheckboxState {
  active: boolean;
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
}

export interface CheckboxNativeProps extends ButtonNativeProps {}

export interface CheckboxRootProps extends Omit<ButtonRootProps, "children" | "onClick"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode | ((state: CheckboxState) => ReactNode);
}

export interface CheckboxControlProps extends CheckboxNativeProps {
  children?: ReactNode;
}

export interface CheckboxIndicatorProps extends CheckboxNativeProps {
  forceMount?: boolean;
  children?: ReactNode | ((state: CheckboxState) => ReactNode);
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
      className={className}
      style={style}
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
  const { children, className, style, ...controlProps } = props;
  useCheckboxContext("CheckboxControl");

  return (
    <view
      {...controlProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={className}
      style={style}
    >
      {children}
    </view>
  );
});
CheckboxControl.displayName = "CheckboxControl";

////////////////////////////////////////////////////////////////////////////////////

export const CheckboxIndicator = forwardRef<unknown, CheckboxIndicatorProps>((props, ref) => {
  const { forceMount = false, children, className, style, ...rootProps } = props;
  const state = useCheckboxContext("CheckboxIndicator");
  const shouldRender = forceMount || state.checked || state.indeterminate;

  if (!shouldRender) return null;

  return (
    <view
      {...rootProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={className}
      style={style}
    >
      {renderWithState(children, state)}
    </view>
  );
});
CheckboxIndicator.displayName = "CheckboxIndicator";
