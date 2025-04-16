import { ariaAttr, dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId, getInputId, getLabelId } from "./dom";

export function useFormControlState() {
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

    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },
  };
}

export interface UseFormControlProps {
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

export type UseFormControlReturn = ReturnType<typeof useFormControl>;

export function useFormControl(props: UseFormControlProps) {
  const id = useId();
  const { disabled = false, invalid = false, readOnly = false, required = false } = props;

  const { refs, renderedElements } = useFormControlState();

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
  });

  return {
    refs,

    disabled,
    readOnly,
    invalid,
    required,
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
