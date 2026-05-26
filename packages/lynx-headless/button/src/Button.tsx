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
    bindtouchstart?.(event);
    if (disabled) return;
    setActive(true);
  };

  const handleTouchEnd: NonNullable<ViewProps["bindtouchend"]> = (event) => {
    bindtouchend?.(event);
    setActive(false);
  };

  const handleTouchCancel: NonNullable<ViewProps["bindtouchcancel"]> = (event) => {
    bindtouchcancel?.(event);
    setActive(false);
  };

  const handleTap: NonNullable<ViewProps["bindtap"]> = (event) => {
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
        {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
        {...interactionProps}
        accessibility-element={accessibilityElement ?? true}
        accessibility-label={accessibilityLabel}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits ?? "button"}
        accessibility-value={accessibilityValue}
        event-through={eventThrough ?? false}
        className={cx(className, state.active && "ui-active", disabled && "ui-disabled")}
        style={style}
      >
        {renderWithState(children, state)}
      </view>
    </ButtonContext.Provider>
  );
});
ButtonRoot.displayName = "ButtonRoot";
