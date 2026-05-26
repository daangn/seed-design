import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type { CSSProperties, ReactNode, Ref } from "react";

import { ButtonRoot } from "@seed-design/lynx-button";
import { useControllableState } from "@seed-design/lynx-use-controllable-state";

import { cx, renderWithState } from "./utils";

export interface SwitchState {
  active: boolean;
  checked: boolean;
  disabled: boolean;
}

export interface SwitchRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode | ((state: SwitchState) => ReactNode);
  className?: string;
  style?: CSSProperties;
  switchProps?: Record<string, unknown>;
}

export interface SwitchControlProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  switchProps?: Record<string, unknown>;
}

export interface SwitchThumbProps {
  className?: string;
  style?: CSSProperties;
  thumbProps?: Record<string, unknown>;
}

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
    switchProps,
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
      ref={ref}
      disabled={disabled}
      onClick={toggle}
      className={cx(className, checked && "ui-checked")}
      style={style}
      buttonProps={switchProps}
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
  const { children, className, style, switchProps } = props;
  const state = useSwitchContext("SwitchControl");

  return (
    <view
      {...switchProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={cx(
        className,
        state.active && "ui-active",
        state.checked && "ui-checked",
        state.disabled && "ui-disabled",
      )}
      style={style}
    >
      {children}
    </view>
  );
});
SwitchControl.displayName = "SwitchControl";

////////////////////////////////////////////////////////////////////////////////////

export const SwitchThumb = forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { className, style, thumbProps } = props;
  const state = useSwitchContext("SwitchThumb");

  return (
    <view
      {...thumbProps}
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      className={cx(
        className,
        state.active && "ui-active",
        state.checked && "ui-checked",
        state.disabled && "ui-disabled",
      )}
      style={style}
    />
  );
});
SwitchThumb.displayName = "SwitchThumb";
