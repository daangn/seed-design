import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useState } from "react";

import { dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";

export interface UseCheckboxStateProps {
  checked?: boolean;

  defaultChecked?: boolean;

  onCheckedChange?: (checked: boolean) => void;
}

export function useCheckboxState(props: UseCheckboxStateProps) {
  const [isChecked, setIsChecked] = useControllableState({
    prop: props.checked,
    defaultProp: props.defaultChecked,
    onChange: props.onCheckedChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  return {
    isChecked,
    setIsChecked,
    isHovered,
    setIsHovered,
    isPressed,
    setIsPressed,
    isFocused,
    setIsFocused,
    isFocusVisible,
    setIsFocusVisible,
  };
}

export interface UseCheckboxProps extends UseCheckboxStateProps {
  disabled?: boolean;

  invalid?: boolean;
}

export function useCheckbox(props: UseCheckboxProps) {
  const { checked, defaultChecked, disabled, invalid, onCheckedChange, ...restProps } = props;

  const {
    setIsChecked,
    isChecked,
    setIsHovered,
    isHovered,
    setIsPressed,
    isPressed,
    setIsFocused,
    isFocused,
    setIsFocusVisible,
    isFocusVisible,
  } = useCheckboxState(props);

  const stateProps = {
    "data-checked": dataAttr(isChecked),
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isPressed),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-disabled": dataAttr(props.disabled),
  };

  const isControlled = checked != null;

  return {
    isChecked,
    setIsChecked,
    isFocused,
    setIsFocused,
    setIsFocusVisible,

    restProps,
    stateProps,
    rootProps: labelProps({
      ...stateProps,
      onPointerMove() {
        setIsHovered(true);
      },
      onPointerDown() {
        setIsPressed(true);
      },
      onPointerUp() {
        setIsPressed(false);
      },
      onPointerLeave() {
        setIsHovered(false);
        setIsPressed(false);
      },
    }),

    controlProps: elementProps({
      ...stateProps,
      "aria-hidden": true,
    }),

    hiddenInputProps: inputProps({
      type: "checkbox",
      defaultChecked,
      checked: isControlled ? isChecked : undefined,
      "aria-invalid": invalid,
      ...stateProps,
      onChange(event) {
        setIsChecked(event.currentTarget.checked);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
      },
      onKeyDown(event) {
        if (event.key === " ") {
          setIsPressed(true);
        }
      },
      onKeyUp(event) {
        if (event.key === " ") {
          setIsPressed(false);
        }
      },
    }),
  };
}
