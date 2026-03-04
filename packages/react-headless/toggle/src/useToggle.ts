import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useMemo } from "react";

import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";

export interface UseToggleStateProps {
  pressed?: boolean;

  defaultPressed?: boolean;

  onPressedChange?: (pressed: boolean) => void;
}

export function useToggleState(props: UseToggleStateProps) {
  const [isPressed, setIsPressed] = useControllableState({
    prop: props.pressed,
    defaultProp: props.defaultPressed,
    onChange: props.onPressedChange,
  });

  const toggle = useCallback(() => {
    setIsPressed((prev) => !prev);
  }, [setIsPressed]);

  return useMemo(
    () => ({
      isPressed,
      toggle,
    }),
    [isPressed, toggle],
  );
}

export interface UseToggleProps extends UseToggleStateProps {
  disabled?: boolean;
}

export type UseToggleReturn = ReturnType<typeof useToggle>;

export function useToggle(props: UseToggleProps) {
  const { toggle, isPressed } = useToggleState(props);

  const stateProps = elementProps({
    "data-pressed": dataAttr(isPressed),
    "data-disabled": dataAttr(props.disabled),
  });

  return {
    pressed: isPressed,
    toggle,

    stateProps,
    rootProps: buttonProps({
      ...stateProps,
      "aria-pressed": isPressed ?? false,
      "aria-disabled": ariaAttr(props.disabled),
      onClick() {
        if (props.disabled) return;
        toggle();
      },
    }),
  };
}
