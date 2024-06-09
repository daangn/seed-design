import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useId, useState } from "react";

import {
  dataAttr,
  elementProps,
  inputProps,
  labelProps,
} from "@seed-design/dom-utils";

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

  required?: boolean;

  invalid?: boolean;

  name?: string;

  form?: string;

  value?: string;
}

const getLabelId = (id: string) => `checkbox:${id}:label`;

export function useCheckbox(props: UseCheckboxProps) {
  const id = useId();
  const {
    checked,
    defaultChecked,
    disabled,
    form,
    invalid,
    name,
    onCheckedChange,
    required,
    value,
    ...restProps
  } = props;
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

  return {
    isChecked,
    setIsChecked,
    isFocused,
    setIsFocused,
    setIsFocusVisible,

    restProps,
    stateProps,
    rootProps: elementProps({
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

    labelProps: labelProps({
      ...stateProps,
      id: getLabelId(id),
    }),

    controlProps: elementProps({
      ...stateProps,
      "aria-hidden": true,
    }),

    hiddenInputProps: inputProps({
      type: "checkbox",
      checked: isChecked,
      disabled: props.disabled,
      required: props.required,
      "aria-invalid": props.invalid,
      name: props.name || id,
      form: props.form,
      value: props.value,
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