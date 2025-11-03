import { ariaAttr, dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId, getInputId, getLabelId } from "./dom";

function useFieldState() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLLabelElement | null) => {
    setIsLabelRendered(!!node);
  }, []);
  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);
  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

  return {
    refs: {
      label: labelRef,
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },

    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  };
}

export interface UseFieldProps {
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

export type UseFieldReturn = ReturnType<typeof useField>;

export function useField(props: UseFieldProps) {
  const id = useId();
  const { disabled = false, invalid = false, readOnly = false, required = false } = props;

  const {
    refs,
    renderedElements,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  } = useFieldState();

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
  });

  return {
    refs,

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

    labelProps: labelProps({
      ...stateProps,
      id: getLabelId(id),
      htmlFor: getInputId(id),
    }),

    inputProps: inputProps({
      disabled,
      readOnly,
      name: props.name || id,
      id: getInputId(id),
    }),

    inputAriaAttributes: elementProps({
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      "aria-readonly": ariaAttr(readOnly),
      "aria-disabled": ariaAttr(disabled),
    }),
    inputHandlers: inputProps({
      onChange: (event) => {
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
      onBlur() {
        setIsFocused(false);
        setIsFocusVisible(false);
      },
      onFocus(event) {
        setIsFocused(true);
        setIsFocusVisible(event.target.matches(":focus-visible"));
      },
    }),

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
