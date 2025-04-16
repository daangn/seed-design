import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useFormControlContext } from "@seed-design/react-form-control";
import { useCallback, useMemo, useState } from "react";
import { useGraphemes } from "./useGraphemes";

export interface UseTextFieldStateProps {
  value?: string;

  defaultValue?: string;

  onValueChange?: (values: {
    value: string;
    graphemes: string[];
  }) => void;

  /**
   * Grapheme 기준 최대 길이
   */
  maxGraphemeCount?: number | undefined;

  /**
   * 최대 길이를 초과할 시 자동으로 잘라낼지 여부
   * @default true
   */
  enforceMaxGraphemeCount?: boolean;
}

export function useTextFieldState({
  value: __value,
  defaultValue,
  onValueChange: __onValueChange,
  maxGraphemeCount,
  enforceMaxGraphemeCount = true,
}: UseTextFieldStateProps) {
  const getGraphemes = useGraphemes();
  const onValueChange = useCallbackRef(__onValueChange);

  const handleValueChange = useCallback(
    (value: string) => {
      const graphemes = getGraphemes(value);
      const enforcedGraphemes = enforceMaxGraphemeCount
        ? graphemes.slice(0, maxGraphemeCount)
        : graphemes;

      onValueChange({
        value: enforceMaxGraphemeCount ? enforcedGraphemes.join("") : value,
        graphemes: enforcedGraphemes,
      });
    },
    [enforceMaxGraphemeCount, maxGraphemeCount, getGraphemes, onValueChange],
  );

  const [value = "", setValue] = useControllableState({
    prop: __value,
    defaultProp: defaultValue,
    onChange: handleValueChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const graphemes = useMemo(() => getGraphemes(value), [getGraphemes, value]);

  return {
    value,
    graphemes,
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
}

export type UseTextFieldReturn = ReturnType<typeof useTextField>;

export function useTextField(props: UseTextFieldProps) {
  const ctx = useFormControlContext({ strict: false });

  const {
    value: propValue,
    defaultValue,
    onValueChange,
    disabled = ctx?.disabled ?? false,
    invalid = ctx?.invalid ?? false,
    readOnly = ctx?.readOnly ?? false,
    required = ctx?.required ?? false,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
  } = props;

  const {
    value: stateValue,
    graphemes,
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
    maxGraphemeCount,
    enforceMaxGraphemeCount,
  });

  const isUncontrolled = propValue === undefined;

  const stateProps = elementProps({
    "data-hover": dataAttr(isHovered),
    "data-active": dataAttr(isActive),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-readonly": dataAttr(readOnly),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-empty": dataAttr(stateValue === ""),
    "data-grapheme-count-exceeded": dataAttr(
      graphemes.length > (maxGraphemeCount ?? Number.POSITIVE_INFINITY),
    ),
  });

  return {
    value: stateValue,
    graphemes,
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

    inputProps: inputProps({
      id: ctx?.inputProps.id,
      ...stateProps,
      ...(isUncontrolled && defaultValue && { defaultValue }),
      ...(!isUncontrolled && { value: stateValue }),
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      disabled,
      readOnly,
      onChange: (event) => {
        setIsFocusVisible(event.target.matches(":focus-visible"));
        setValue(event.target.value);
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
  };
}
