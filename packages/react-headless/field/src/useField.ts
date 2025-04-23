import { ariaAttr, dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId, getInputId, getLabelId } from "./dom";

export function useFieldState() {
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

  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [__data, __setData] = useState<{ type: "grapheme"; count: number }>();

  return {
    refs: {
      label: labelRef,
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },

    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

    isFocused,
    isFocusVisible,
    setIsFocused,
    setIsFocusVisible,

    __data,
    __setData,
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
}

export type UseFieldReturn = ReturnType<typeof useField>;

export function useField(props: UseFieldProps) {
  const id = useId();
  const { disabled = false, invalid = false, readOnly = false, required = false } = props;

  const {
    refs,
    renderedElements,
    isFocused,
    isFocusVisible,
    setIsFocused,
    setIsFocusVisible,
    __data,
    __setData,
  } = useFieldState();

  const ariaDescribedBy =
    [
      renderedElements.description ? getDescriptionId(id) : false,
      renderedElements.errorMessage ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const stateProps = elementProps({
    "data-readonly": dataAttr(readOnly),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
  });

  return {
    refs,

    disabled,
    readOnly,
    invalid,
    required,
    focused: isFocused,
    focusVisible: isFocusVisible,

    __data,
    __setData,

    stateProps,

    rootProps: elementProps({
      ...stateProps,
    }),

    labelProps: labelProps({
      ...stateProps,
      id: getLabelId(id),
      htmlFor: getInputId(id),
    }),

    inputProps: inputProps({
      ...stateProps,
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      disabled,
      readOnly,
      id: getInputId(id),
      name: id,
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
    }) as
      | React.InputHTMLAttributes<HTMLInputElement>
      | React.TextareaHTMLAttributes<HTMLTextAreaElement>,

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
