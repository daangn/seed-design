import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useId, useState } from "react";
import { graphemeSegments } from "unicode-segmenter/grapheme";

import {
  dataAttr,
  ariaAttr,
  elementProps,
  inputProps,
  labelProps,
} from "@seed-design/dom-utils";

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
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  placeholder?: string;
  autoComplete?: "none" | "inline" | "list" | "both";

  type?:
    | "text"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "password"
    | (string & {});

  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";

  
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;

  /**
   * @default false
   */
  invalid?: boolean;

  /**
   * @default "input"
   */
  elementType?: "input" | "textarea";

  allowExceedLength?: boolean;
}

const getGraphemes = (value?: string) => {
  return Array.from(graphemeSegments(value || "")).map((g) => g.segment);
};

export function useTextField(props: UseTextFieldProps) {
  const id = useId();
  const {
    elementType = "input",
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    pattern,
    autoComplete,
    autoFocus,
    allowExceedLength,
    defaultValue,
    minLength,
    maxLength,
    placeholder,
    inputMode,
    name,
    onBlur,
    onFocus,
    type = "text",
    ...restProps
  } = props;
  
  const {
    setValue,
    value,
    setIsHovered,
    isHovered,
    setIsPressed,
    isPressed,
    setIsFocused,
    isFocused,
    setIsFocusVisible,
    isFocusVisible,
  } = useTextFieldState(props);

  const inputOnlyProps =
  elementType === "input"
    ? {
        type,
        pattern,
      }
    : {};

  const graphemes = getGraphemes(value);
  
  const slicedGraphemes = allowExceedLength
    ? graphemes
    : graphemes.slice(0, maxLength);
  
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

    restProps,
    stateProps,

    rootProps: elementProps({
      ...stateProps,
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
    }),

    inputProps: inputProps({
      ...inputOnlyProps,
      ...stateProps,
      disabled,
      readOnly,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      "aria-autocomplete": autoComplete,
      defaultValue,
      autoFocus,
      onChange: (e) => {
        setValue(e.target.value);
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
      autoComplete,
      // NOTE: graphemes로 처리하므로 maxLength를 사용하지 않음
      minLength,
      name: props.name || id,
      value: slicedValue,
      placeholder,
      inputMode,
    }),
    descriptionProps: elementProps({
      ...stateProps,
    }),
    errorMessageProps: elementProps({
      ...stateProps,
    }),
  };
}
