import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useId, useState } from "react";
import { graphemeSegments } from "unicode-segmenter/grapheme";

import { dataAttr, ariaAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { getDescriptionId, getErrorMessageId, getInputId, getLabelId } from "./dom";

export interface UseTextFieldStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function useTextFieldState(props: UseTextFieldStateProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  return {
    value,
    setValue,
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

export interface UseTextFieldProps extends UseTextFieldStateProps {
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;

  name?: string;

  minLength?: number;
  maxGraphemeCount?: number;

  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;

  /**
   * @default false
   */
  invalid?: boolean;

  description?: string;

  errorMessage?: string;
}

const getSlicedGraphemes = ({
  value,
  maxGraphemeCount,
}: Pick<UseTextFieldProps, "value" | "maxGraphemeCount">) => {
  const graphemes = Array.from(graphemeSegments(value || "")).map((g) => g.segment);
  return maxGraphemeCount === undefined ? graphemes : graphemes.slice(0, maxGraphemeCount);
};

export function useTextField(props: UseTextFieldProps) {
  const id = useId();
  const {
    value,
    description,
    errorMessage,
    defaultValue,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    autoFocus,
    maxGraphemeCount,
    onBlur,
    onFocus,
    onValueChange,
    ...restProps
  } = props;

  const {
    setValue,
    value: currentValue,
    setIsHovered,
    isHovered,
    setIsPressed,
    isPressed,
    setIsFocused,
    isFocused,
    setIsFocusVisible,
    isFocusVisible,
  } = useTextFieldState({
    defaultValue,
    onValueChange,
    value,
  });

  const showErrorMessage = invalid && !!errorMessage;
  const showDescription = !showErrorMessage && !!description;
  const ariaDescribedBy =
    [
      showDescription ? getDescriptionId(id) : false,
      showErrorMessage ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const slicedGraphemes = getSlicedGraphemes({
    maxGraphemeCount,
    value: currentValue,
  });

  const slicedValue = slicedGraphemes.join("");

  const stateProps = {
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isPressed),
    "data-focus": dataAttr(isFocused),
    "data-readonly": dataAttr(readOnly),
    "data-invalid": dataAttr(invalid),
    "data-grapheme-count": `${slicedGraphemes.length}`,
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-disabled": dataAttr(props.disabled),
  };

  return {
    value: slicedValue,
    graphemes: slicedGraphemes,
    setValue,
    isFocused,
    isInvalid: invalid,
    isRequired: required,
    setIsFocused,
    setIsFocusVisible,

    stateProps,
    restProps,

    rootProps: elementProps({
      ...stateProps,
      "aria-labelledby": getLabelId(id),
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
      htmlFor: getInputId(id),
    }),

    inputProps: inputProps({
      ...stateProps,
      disabled,
      readOnly,
      autoFocus,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      "aria-describedby": ariaDescribedBy,
      onChange: (e) => {
        const givenValue = e.target.value;

        const slicedGraphemes = getSlicedGraphemes({
          maxGraphemeCount,
          value: givenValue,
        });

        const value = slicedGraphemes.join("");

        setValue(value);
        setIsFocusVisible(e.target.matches(":focus-visible"));
      },
      onBlur(e) {
        setIsFocused(false);
        setIsFocusVisible(false);
        onBlur?.(e);
      },
      onFocus(e) {
        setIsFocused(true);
        setIsFocusVisible(e.target.matches(":focus-visible"));
        onFocus?.(e);
      },
      name: props.name || id,
      id: getInputId(id),
      value: slicedValue,
    }),
    descriptionProps: elementProps({
      id: getDescriptionId(id),
      ...stateProps,
    }),
    errorMessageProps: elementProps({
      id: getErrorMessageId(id),
      ...stateProps,
    }),
  };
}
