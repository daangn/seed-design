import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useToggle, type UseToggleProps } from "./useToggle.js";
import { ToggleContext } from "./useToggleContext.js";

type ViewProps = IntrinsicElements["view"];
export interface ToggleRootProps extends UseToggleProps, ViewProps {}

export const ToggleRoot = React.forwardRef<unknown, ToggleRootProps>((props, ref) => {
  const {
    pressed,
    defaultPressed,
    onPressedChange,
    disabled = false,
    children,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = props;
  const api = useToggle({ pressed, defaultPressed, onPressedChange, disabled });
  return (
    <ToggleContext.Provider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-role-description="toggle button"
        accessibility-value={api.pressed ? "pressed" : "not pressed"}
        {...nativeProps}
        bindtap={
          disabled
            ? undefined
            : (event) => {
                bindtap?.(event);
                api.rootProps.bindtap(event);
              }
        }
        main-thread:bindtap={disabled ? undefined : mainThreadBindtap}
        bindtouchstart={(event) => {
          bindtouchstart?.(event);
          api.rootProps.bindtouchstart(event);
        }}
        bindtouchend={(event) => {
          bindtouchend?.(event);
          api.rootProps.bindtouchend(event);
        }}
        bindtouchcancel={(event) => {
          bindtouchcancel?.(event);
          api.rootProps.bindtouchcancel(event);
        }}
      >
        {children}
      </view>
    </ToggleContext.Provider>
  );
});
ToggleRoot.displayName = "ToggleRoot";
