import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type { ReactNode, Ref } from "react";

import { ButtonRoot } from "@seed-design/lynx-button";
import type { ButtonNativeProps, ButtonRootProps } from "@seed-design/lynx-button";
import { useControllableState } from "@seed-design/lynx-use-controllable-state";

import { renderWithState } from "./utils";

export interface SwitchState {
  active: boolean;
  checked: boolean;
  disabled: boolean;
}

export interface SwitchNativeProps extends ButtonNativeProps {}

export interface SwitchRootProps extends Omit<ButtonRootProps, "children" | "onClick"> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode | ((state: SwitchState) => ReactNode);
}

export interface SwitchControlProps extends SwitchNativeProps {
  children?: ReactNode;
}

export interface SwitchThumbProps extends SwitchNativeProps {}

const SwitchContext = createContext<SwitchState | null>(null);

export function useSwitchContext(consumer = "useSwitchContext"): SwitchState {
  const ctx = useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used inside <SwitchRoot/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export const SwitchRoot = forwardRef<unknown, SwitchRootProps>((props, ref) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    children,
    className,
    style,
    "accessibility-role-description": accessibilityRoleDescription = "switch",
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
        const state: SwitchState = {
          active: buttonState.active,
          checked,
          disabled: buttonState.disabled,
        };

        return (
          <SwitchContext.Provider value={state}>
            {renderWithState(children, state)}
          </SwitchContext.Provider>
        );
      }}
    </ButtonRoot>
  );
});
SwitchRoot.displayName = "SwitchRoot";

////////////////////////////////////////////////////////////////////////////////////

export const SwitchControl = forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const { children, className, style, ...controlProps } = props;
  useSwitchContext("SwitchControl");

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
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export const SwitchThumb = forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, style, ...rootProps } = props;
  useSwitchContext("SwitchThumb");

  return (
    <view
      {...rootProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={className}
      style={style}
    />
  );
});
SwitchThumb.displayName = "SwitchThumb";
