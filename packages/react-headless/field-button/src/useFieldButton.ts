import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@ride-developer/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId } from "./dom";
import { useSupports } from "@ride-developer/react-supports";

interface UseFieldButtonStateProps {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}

function useFieldButtonState({ values = [], onValuesChange = () => {} }: UseFieldButtonStateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);
  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

  return {
    values,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,

    refs: {
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },
    renderedElements: {
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

    setValues: onValuesChange,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  };
}

export interface UseFieldButtonProps extends UseFieldButtonStateProps {
  /**
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  invalid?: boolean;

  /**
   * @default false
   */
  readOnly?: boolean;

  name?: string;
}

export type UseFieldButtonReturn = ReturnType<typeof useFieldButton>;

export function useFieldButton({
  values: propValues,
  onValuesChange,
  disabled = false,
  invalid = false,
  readOnly = false,
  name,
}: UseFieldButtonProps) {
  const id = useId();
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const {
    values: stateValues,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    refs,
    renderedElements,
    setValues,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  } = useFieldButtonState({ values: propValues, onValuesChange });

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
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-readonly": dataAttr(readOnly),
  });

  return {
    values: stateValues,
    active: isActive,
    focused: isFocused,
    invalid,
    disabled,
    readOnly,

    setIsFocused,
    setIsFocusVisible,

    refs,

    stateProps,

    rootProps: elementProps({
      ...stateProps,

      onPointerMove() {
        setIsHovered(true);
      },
      onPointerLeave() {
        setIsHovered(false);
        setIsActive(false);
      },
    }),

    buttonProps: buttonProps({
      ...stateProps,

      type: "button",
      disabled: disabled || readOnly,

      "aria-disabled": ariaAttr(disabled || readOnly),
      "aria-describedby": ariaDescribedBy,

      // note that pointerdown and pointerup are attached to the button, not the root
      // this is for preventing setting isActive to true when the clear button is pressed
      onPointerDown() {
        setIsActive(true);
      },
      onPointerUp() {
        setIsActive(false);
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
    }),

    clearButtonProps: buttonProps({
      type: "button",
      disabled: disabled || readOnly,

      onClick: useCallback(() => setValues([]), [setValues]),

      hidden: disabled || readOnly,
    }),

    getHiddenInputProps: useCallback(
      (index: number) => {
        const value = stateValues[index];

        if (value === undefined) return null;

        return inputProps({
          type: "hidden",
          value,
          disabled, // disabled field button should not submit values, while readonly field button should submit values
          name: name || id,
        });
      },
      [stateValues, name, id, disabled],
    ),

    descriptionProps: elementProps({
      ...stateProps,
      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      ...stateProps,
      id: getErrorMessageId(id),
      "aria-live": "polite",
    }),
  };
}
