import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useId, useState } from "react";

interface UseTextFieldStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function useTextFieldState({
  value: __value,
  defaultValue,
  onValueChange,
}: UseTextFieldStateProps) {
  const [value, setValue] = useControllableState({
    prop: __value,
    defaultProp: defaultValue ?? "",
    onChange: onValueChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  return {
    value,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,

    setValue,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  };
}

export interface UseTextFieldProps extends UseTextFieldStateProps {
  /**
   * @default false
   */
  required?: boolean;
  /**
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  readOnly?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;

  name?: string;
}

export type UseTextFieldReturn = ReturnType<typeof useTextField>;

export function useTextField(props: UseTextFieldProps) {
  const id = useId();
  const {
    value: propValue,
    defaultValue,
    onValueChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
  } = props;

  const {
    value: stateValue,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    setValue,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  } = useTextFieldState({
    value: propValue,
    defaultValue,
    onValueChange,
  });

  const isUncontrolled = propValue === undefined;

  const stateProps = elementProps({
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isActive),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-readonly": dataAttr(readOnly),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-empty": dataAttr(stateValue === ""),
  });

  return {
    value: stateValue,
    active: isActive,
    focused: isFocused,
    invalid,
    required,

    setIsFocused,
    setIsFocusVisible,

    stateProps,

    rootProps: elementProps({
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

    inputProps: inputProps({
      ...stateProps,
      ...(isUncontrolled && defaultValue && { defaultValue }),
      ...(!isUncontrolled && { value: stateValue }),
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      disabled,
      readOnly,
      name: props.name || id,

      onChange: (event) => {
        setIsFocusVisible(event.target.matches(":focus-visible"));
        setValue(event.target.value);
      },
      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
    }) as
      | React.InputHTMLAttributes<HTMLInputElement>
      | React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  };
}
