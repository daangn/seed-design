import { ariaAttr, dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { useId } from "react";
import {
  getDecrementButtonId,
  getDescriptionId,
  getErrorMessageId,
  getIncrementButtonId,
  getInputId,
  getLabelId,
} from "./dom";
import { useNumberFieldState, type UseNumberFieldStateProps } from "./useNumberFieldState";

export interface UseNumberFieldProps extends UseNumberFieldStateProps {
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

export type UseNumberFieldReturn = ReturnType<typeof useNumberField>;

export function useNumberField(props: UseNumberFieldProps) {
  const id = useId();
  const {
    value: propValue,
    defaultValue,
    onValueChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    min,
    max,
    step,
    formatOptions,
    locale,
  } = props;

  const {
    refs,
    renderedElements,
    value: stateValue,
    inputValue,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    canIncrement,
    canDecrement,
    hasMin,
    hasMax,
    setInputValue,
    increment,
    decrement,
    commitValue,
    setToMin,
    setToMax,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  } = useNumberFieldState({
    value: propValue,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    formatOptions,
    locale,
  });

  const ariaDescribedBy =
    [
      renderedElements.description ? getDescriptionId(id) : false,
      renderedElements.errorMessage ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const stateProps = elementProps({
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isActive),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-readonly": dataAttr(readOnly),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-empty": dataAttr(stateValue === undefined),
  });

  return {
    refs,

    value: stateValue,
    inputValue,
    active: isActive,
    focused: isFocused,
    invalid,
    required,
    canIncrement,
    canDecrement,

    increment,
    decrement,
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

    labelProps: labelProps({
      ...stateProps,
      id: getLabelId(id),
      htmlFor: getInputId(id),
    }),

    inputProps: inputProps({
      ...stateProps,
      value: inputValue,
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": stateValue,
      disabled,
      readOnly,
      type: "text",
      inputMode: "decimal",
      role: "spinbutton",
      id: getInputId(id),
      name: props.name || id,
      onChange: (event) => {
        setIsFocusVisible(event.target.matches(":focus-visible"));
        setInputValue(event.target.value);
      },
      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
        commitValue();
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
      onKeyDown(event) {
        if (disabled || readOnly) return;

        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            increment();
            break;
          case "ArrowDown":
            event.preventDefault();
            decrement();
            break;
          case "Home":
            if (hasMin) {
              event.preventDefault();
              setToMin();
            }
            break;
          case "End":
            if (hasMax) {
              event.preventDefault();
              setToMax();
            }
            break;
        }
      },
    }) as React.InputHTMLAttributes<HTMLInputElement>,

    incrementButtonProps: {
      ...stateProps,
      id: getIncrementButtonId(id),
      type: "button" as const,
      tabIndex: -1,
      disabled: disabled || !canIncrement,
      "aria-label": "Increment",
      "aria-controls": getInputId(id),
      onClick: (event: React.MouseEvent) => {
        event.preventDefault();
        if (!disabled && !readOnly) {
          increment();
        }
      },
    } as React.ButtonHTMLAttributes<HTMLButtonElement>,

    decrementButtonProps: {
      ...stateProps,
      id: getDecrementButtonId(id),
      type: "button" as const,
      tabIndex: -1,
      disabled: disabled || !canDecrement,
      "aria-label": "Decrement",
      "aria-controls": getInputId(id),
      onClick: (event: React.MouseEvent) => {
        event.preventDefault();
        if (!disabled && !readOnly) {
          decrement();
        }
      },
    } as React.ButtonHTMLAttributes<HTMLButtonElement>,

    descriptionProps: elementProps({
      ...stateProps,
      ...(invalid && { style: { display: "none" } }),
      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      ...stateProps,
      id: getErrorMessageId(id),
    }),
  };
}
