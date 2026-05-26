import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "@lynx-js/react";
import type { TouchEvent } from "@lynx-js/types";
import type { CSSProperties, ReactNode, Ref } from "react";

import { cx, renderWithState } from "./utils";

export interface ButtonState {
  active: boolean;
  disabled: boolean;
}

export interface ButtonRootProps {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode | ((state: ButtonState) => ReactNode);
  className?: string;
  style?: CSSProperties;
  buttonProps?: Record<string, unknown>;
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
  const { disabled = false, onClick, children, className, style, buttonProps } = props;
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

  const handleTouchStart = (_event: TouchEvent) => {
    if (disabled) return;
    setActive(true);
  };

  const handleTouchEnd = (_event: TouchEvent) => {
    setActive(false);
  };

  const handleTap = (_event: TouchEvent) => {
    if (disabled) return;
    onClick?.();
  };

  const interactionProps = {
    bindtap: handleTap,
    bindtouchcancel: handleTouchEnd,
    bindtouchend: handleTouchEnd,
    bindtouchstart: handleTouchStart,
  };

  return (
    <ButtonContext.Provider value={state}>
      <view
        {...buttonProps}
        {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
        {...interactionProps}
        className={cx(className, state.active && "ui-active", disabled && "ui-disabled")}
        style={style}
      >
        {renderWithState(children, state)}
      </view>
    </ButtonContext.Provider>
  );
});
ButtonRoot.displayName = "ButtonRoot";
