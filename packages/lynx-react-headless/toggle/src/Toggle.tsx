import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useToggle, type UseToggleProps } from "./useToggle.js";
import { ToggleProvider } from "./useToggleContext.js";

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
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    ...nativeProps
  } = props;
  const api = useToggle({
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  });
  const {
    bindtap: pressTap,
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...mainThreadTouchProps
  } = api.rootProps;

  return (
    <ToggleProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-role-description="toggle button"
        accessibility-value={api.pressed ? "pressed" : "not pressed"}
        {...nativeProps}
        {...mainThreadTouchProps}
        bindtap={
          disabled
            ? undefined
            : (event) => {
                bindtap?.(event);
                pressTap(event);
              }
        }
        main-thread:bindtap={disabled ? undefined : mainThreadBindtap}
        bindtouchstart={(event) => {
          bindtouchstart?.(event);
          pressStart(event);
        }}
        bindtouchend={(event) => {
          bindtouchend?.(event);
          pressEnd(event);
        }}
        bindtouchcancel={(event) => {
          bindtouchcancel?.(event);
          pressCancel(event);
        }}
      >
        {children}
      </view>
    </ToggleProvider>
  );
});
ToggleRoot.displayName = "ToggleRoot";
