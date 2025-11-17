import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, dataAttr, elementProps, inputProps, labelProps } from "@seed-design/dom-utils";
import { useCallback, useId, useMemo, useState } from "react";
import { splitGraphemes } from "unicode-segmenter/grapheme";
import { getDescriptionId, getErrorMessageId, getInputId, getLabelId } from "./dom";
import { memoize } from "./memoize";
import { useSupports } from "@seed-design/react-supports";

export interface UseTextFieldStateProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (values: {
    value: string;
    graphemes: string[];
    slicedValue: string;
    slicedGraphemes: string[];
  }) => void;
  maxGraphemeCount?: number | undefined;
}

const getGraphemes = (string: string) => Array.from(splitGraphemes(string));
const memoizedGetGraphemes = memoize(getGraphemes);

export function useTextFieldState({
  value: __value,
  defaultValue,
  onValueChange: __onValueChange,
  maxGraphemeCount,
}: UseTextFieldStateProps) {
  const onValueChange = useCallbackRef(__onValueChange);

  const handleValueChange = useCallback(
    (value: string) => {
      const graphemes = memoizedGetGraphemes(value);
      const slicedGraphemes = maxGraphemeCount ? graphemes.slice(0, maxGraphemeCount) : graphemes;
      const slicedValue = slicedGraphemes.join("");

      onValueChange({ value, graphemes, slicedValue, slicedGraphemes });
    },
    [maxGraphemeCount, onValueChange],
  );

  const [value, setValue] = useControllableState({
    prop: __value,
    defaultProp: defaultValue,
    onChange: handleValueChange,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const graphemes = useMemo(() => memoizedGetGraphemes(value ?? ""), [value]);

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

    value,
    graphemes,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

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

  name?: string;
}

export type UseTextFieldReturn = ReturnType<typeof useTextField>;

export function useTextField(props: UseTextFieldProps) {
  const id = useId();
  const {
    value: propValue,
    defaultValue,
    onValueChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    maxGraphemeCount,
  } = props;

  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const {
    refs,
    renderedElements,
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
  });

  const isUncontrolled = propValue === undefined;

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
    "data-empty": dataAttr(stateValue === ""),
    "data-grapheme-count-exceeded": dataAttr(
      graphemes.length > (maxGraphemeCount ?? Number.POSITIVE_INFINITY),
    ),
  });

  return {
    refs,

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

    labelProps: labelProps({
      ...stateProps,
      id: getLabelId(id),
      htmlFor: getInputId(id),
    }),

    inputProps: inputProps({
      ...stateProps,
      ...(isUncontrolled && defaultValue && { defaultValue }),
      ...(!isUncontrolled && { value: stateValue }),
      ...(renderedElements.label && { "aria-labelledby": getLabelId(id) }),
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaAttr(required),
      "aria-invalid": ariaAttr(invalid),
      disabled,
      readOnly,
      id: getInputId(id),
      name: props.name || id,
      onChange: (event) => {
        setValue(event.target.value);
        if (isFocusVisibleSupported) {
          setIsFocusVisible(event.target.matches(":focus-visible"));
        }
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
