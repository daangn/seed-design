import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useCallback, useMemo, useState } from "react";
import { useFieldContext } from "./useFieldContext";
import { useGraphemes } from "./useGraphemes";

export interface UseGraphemeInputStateProps {
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

export function useGraphemeInputState({
  value: __value,
  defaultValue,
  onValueChange: __onValueChange,
  maxGraphemeCount,
  enforceMaxGraphemeCount = true,
}: UseGraphemeInputStateProps) {
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
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const graphemes = useMemo(() => getGraphemes(value), [getGraphemes, value]);

  return {
    value,
    graphemes,
    isFocused,
    isFocusVisible,

    setValue,
    setIsFocused,
    setIsFocusVisible,
  };
}

export interface UseGraphemeInputProps extends UseGraphemeInputStateProps {
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

export type UseGraphemeInputReturn = ReturnType<typeof useGraphemeInput>;

export function useGraphemeInput(props: UseGraphemeInputProps) {
  const ctx = useFieldContext({ strict: false });

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
    isFocused,
    isFocusVisible,
    setValue,
    setIsFocused,
    setIsFocusVisible,
  } = useGraphemeInputState({
    value: propValue,
    defaultValue,
    onValueChange,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
  });

  const isUncontrolled = propValue === undefined;

  const stateProps = elementProps({
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
    focused: isFocused,
    invalid,
    required,

    setIsFocused,
    setIsFocusVisible,

    stateProps,

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
