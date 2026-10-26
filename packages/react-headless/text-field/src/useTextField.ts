import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import {
  useId,
  useRef,
  useState,
  type TextareaHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { useSupports } from "@seed-design/react-supports";

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

/**
 * Sets the value through the native setter and dispatches an `input` event, so React's `onChange`
 * runs as if the user typed. This updates both controlled and uncontrolled inputs.
 */
function clearInputValue(input: HTMLInputElement | HTMLTextAreaElement) {
  const prototype =
    input instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

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

  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

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

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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

    inputRef,

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
        setValue(event.target.value);
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
      onFocus(event) {
        setIsFocused(true);
        if (isFocusVisibleSupported) {
          setIsFocusVisible(event.target.matches(":focus-visible"));
        }
      },
    }) as InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>,

    clearButtonProps: buttonProps({
      type: "button",
      disabled: disabled || readOnly,
      hidden: disabled || readOnly,

      // Keep the focus where it is: a focused input stays focused, and an unfocused one stays unfocused.
      onMouseDown(event) {
        event.preventDefault();
      },
      onClick(event) {
        const input = inputRef.current;
        if (!input) return;

        // Activated with the keyboard: the button is about to unmount, so hand the focus to the input.
        const shouldFocusInput =
          event.currentTarget === event.currentTarget.ownerDocument.activeElement;

        clearInputValue(input);

        if (shouldFocusInput) {
          input.focus();
        }
      },
    }),
  };
}
