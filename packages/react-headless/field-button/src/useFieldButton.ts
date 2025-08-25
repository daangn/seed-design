import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId, getLabelId } from "./dom";

interface UseFieldButtonStateProps {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  onClear?: () => void;
}

function useFieldButtonState({
  values: __values,
  defaultValues,
  onValuesChange,
  onClear,
}: UseFieldButtonStateProps) {
  const [values, setValues] = useControllableState({
    prop: __values,
    defaultProp: defaultValues ?? [],
    onChange: (values) => {
      onValuesChange?.(values);

      if (values.length === 0) {
        onClear?.();
      }
    },
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLElement | null) => {
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
    values,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,

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

    setValues,
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

export type UseFieldButtonReturn = ReturnType<typeof useFieldButton>;

export function useFieldButton(props: UseFieldButtonProps) {
  const id = useId();
  const {
    values: propValues,
    defaultValues,
    onValuesChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    name,
  } = props;

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
  } = useFieldButtonState({ values: propValues, defaultValues, onValuesChange });

  const isUncontrolled = propValues === undefined;

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
    values: stateValues,
    active: isActive,
    focused: isFocused,
    invalid,
    required,

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

    labelProps: elementProps({
      ...stateProps,
      id: getLabelId(id),
    }),

    buttonProps: buttonProps({
      // TODO: aria property 적절히 들어갈 수 있게 보기
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),

      disabled,
      "aria-disabled": ariaAttr(disabled),

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
        ...(isUncontrolled && defaultValues && { defaultValue: value }),
        ...(!isUncontrolled && { value }),
        readOnly: true,
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
    }),
  };
}
