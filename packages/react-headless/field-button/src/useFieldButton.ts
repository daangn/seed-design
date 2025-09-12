import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId } from "./dom";

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

  name?: string;
}

export type UseFieldButtonReturn = ReturnType<typeof useFieldButton>;

export function useFieldButton(props: UseFieldButtonProps) {
  const id = useId();
  const { values: propValues, onValuesChange, disabled = false, name } = props;

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
  });

  return {
    values: stateValues,
    active: isActive,
    focused: isFocused,

    setIsFocused,
    setIsFocusVisible,

    refs,

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

    buttonProps: buttonProps({
      disabled,
      "aria-disabled": ariaAttr(disabled),

      "aria-describedby": ariaDescribedBy,

      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
    }),

    clearButtonProps: buttonProps({
      onClick: useCallback(() => setValues([]), [setValues]),
    }),

    hiddenInputsProps: stateValues.map((value) =>
      inputProps({
        ...stateProps,
        type: "hidden",
        value,
        name: name || id,
      }),
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
