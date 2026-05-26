import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "@lynx-js/react";
import type { ViewProps } from "@lynx-js/types";
import type { CSSProperties, ReactNode, Ref } from "react";

import { cx, renderWithState } from "./utils";

export interface ButtonState {
  active: boolean;
  disabled: boolean;
}

export interface ButtonNativeProps extends Omit<ViewProps, "children" | "ref" | "style"> {
  style?: CSSProperties;
}

export interface ButtonRootProps extends ButtonNativeProps {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode | ((state: ButtonState) => ReactNode);
  buttonProps?: ButtonNativeProps;
}

const ButtonContext = createContext<ButtonState | null>(null);

export function useButtonContext(consumer = "useButtonContext"): ButtonState {
  const ctx = useContext(ButtonContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used inside <ButtonRoot/>.`);
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

export const ButtonRoot = forwardRef<unknown, ButtonRootProps>((props, ref) => {
  const {
    disabled = false,
    onClick,
    children,
    className,
    style,
    buttonProps,
    bindtap,
    bindtouchcancel,
    bindtouchend,
    bindtouchstart,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    "event-through": eventThrough,
    ...rootProps
  } = props;
  const [active, setActive] = useState(false);
  const state = useMemo<ButtonState>(
    () => ({ active: active && !disabled, disabled }),
    [active, disabled],
  );

  useEffect(() => {
    if (disabled) {
      setActive(false);
    }
  }, [disabled]);

  const handleTouchStart: NonNullable<ViewProps["bindtouchstart"]> = (event) => {
    buttonProps?.bindtouchstart?.(event);
    bindtouchstart?.(event);
    if (disabled) return;
    setActive(true);
  };

  const handleTouchEnd: NonNullable<ViewProps["bindtouchend"]> = (event) => {
    buttonProps?.bindtouchend?.(event);
    bindtouchend?.(event);
    setActive(false);
  };

  const handleTouchCancel: NonNullable<ViewProps["bindtouchcancel"]> = (event) => {
    buttonProps?.bindtouchcancel?.(event);
    bindtouchcancel?.(event);
    setActive(false);
  };

  const handleTap: NonNullable<ViewProps["bindtap"]> = (event) => {
    buttonProps?.bindtap?.(event);
    bindtap?.(event);
    if (disabled) return;
    onClick?.();
  };

  const interactionProps: Pick<
    ViewProps,
    "bindtap" | "bindtouchcancel" | "bindtouchend" | "bindtouchstart"
  > = {
    bindtap: handleTap,
    bindtouchcancel: handleTouchCancel,
    bindtouchend: handleTouchEnd,
    bindtouchstart: handleTouchStart,
  };

  return (
    <ButtonContext.Provider value={state}>
      <view
        {...rootProps}
        {...buttonProps}
        {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
        {...interactionProps}
        accessibility-element={
          accessibilityElement ?? buttonProps?.["accessibility-element"] ?? true
        }
        accessibility-label={accessibilityLabel ?? buttonProps?.["accessibility-label"]}
        accessibility-role-description={
          accessibilityRoleDescription ?? buttonProps?.["accessibility-role-description"]
        }
        accessibility-traits={
          accessibilityTraits ?? buttonProps?.["accessibility-traits"] ?? "button"
        }
        accessibility-value={accessibilityValue ?? buttonProps?.["accessibility-value"]}
        event-through={eventThrough ?? buttonProps?.["event-through"] ?? false}
        className={cx(
          buttonProps?.className,
          className,
          state.active && "ui-active",
          disabled && "ui-disabled",
        )}
        style={style ?? buttonProps?.style}
      >
        {renderWithState(children, state)}
      </view>
    </ButtonContext.Provider>
  );
});
ButtonRoot.displayName = "ButtonRoot";
