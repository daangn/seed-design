import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useState } from "react";

import {
  dataAttr,
  elementProps,
  inputProps,
  labelProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";

interface UseSwitchStateProps {
  checked?: boolean;

  defaultChecked?: boolean;

  onCheckedChange?: (checked: boolean) => void;
}

function useSwitchState(props: UseSwitchStateProps) {
  const [isChecked, setIsChecked] = useControllableState({
    prop: props.checked,
    defaultProp: props.defaultChecked,
    onChange: props.onCheckedChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  return {
    isChecked,
    setIsChecked,
    isHovered,
    setIsHovered,
    isActive,
    setIsActive,
    isFocused,
    setIsFocused,
    isFocusVisible,
    setIsFocusVisible,
  };
}

export interface UseSwitchProps extends UseSwitchStateProps {
  disabled?: boolean;

  invalid?: boolean;

  required?: boolean;
}

export type UseSwitchReturn = ReturnType<typeof useSwitch>;

export function useSwitch(props: UseSwitchProps) {
  const {
    setIsChecked,
    isChecked,
    setIsHovered,
    isHovered,
    setIsActive,
    isActive,
    setIsFocused,
    isFocused,
    setIsFocusVisible,
    isFocusVisible,
  } = useSwitchState(props);

  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const stateProps = elementProps({
    "data-checked": dataAttr(isChecked),
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isActive),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-disabled": dataAttr(props.disabled),
    "data-invalid": dataAttr(props.invalid),
    "data-required": dataAttr(props.required),
  });

  const isControlled = props.checked != null;

  return {
    checked: isChecked,
    setChecked: setIsChecked,
    focused: isFocused,
    setFocused: setIsFocused,
    focusVisible: isFocusVisible,
    setFocusVisible: setIsFocusVisible,

    stateProps,
    rootProps: labelProps({
      ...stateProps,
      onPointerMove() {
        setIsHovered(true);
      },
      onPointerDown() {
        setIsActive(true);
      },
      onPointerUp() {
        setIsActive(false);
      },
      onPointerLeave() {
        setIsHovered(false);
        setIsActive(false);
      },
    }),

    controlProps: elementProps({
      ...stateProps,
      "aria-hidden": true,
    }),

    thumbProps: elementProps({
      ...stateProps,
      "aria-hidden": true,
    }),

    hiddenInputProps: inputProps({
      type: "checkbox",
      role: "switch",
      checked: isControlled ? isChecked : undefined,
      defaultChecked: !isControlled ? isChecked : undefined,
      disabled: props.disabled,
      required: props.required,
      "aria-invalid": props.invalid,
      style: visuallyHidden,
      ...stateProps,
      onChange(event) {
        setIsChecked(event.currentTarget.checked);
        if (isFocusVisibleSupported) {
          setIsFocusVisible(event.target.matches(":focus-visible"));
        }
      },
      onFocus(event) {
        setIsFocused(true);
        if (isFocusVisibleSupported) {
          setIsFocusVisible(event.target.matches(":focus-visible"));
        }
      },
      onBlur() {
        setIsFocused(false);
        if (isFocusVisibleSupported) {
          setIsFocusVisible(false);
        }
      },
      onKeyDown(event) {
        if (event.key === " ") {
          setIsActive(true);
        }
      },
      onKeyUp(event) {
        if (event.key === " ") {
          setIsActive(false);
        }
      },
    }),
  };
}
