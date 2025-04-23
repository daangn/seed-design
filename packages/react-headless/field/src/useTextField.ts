import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { dataAttr, elementProps, inputProps, mergeProps } from "@seed-design/dom-utils";
import { useCallback, useMemo } from "react";
import { useField, type UseFieldProps } from "./useField";
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
      const enforcedValue = enforceMaxGraphemeCount ? enforcedGraphemes.join("") : value;

      // TODO: apply enforcedValue to input when it's uncontrolled

      onValueChange({
        value: enforcedValue,
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

  const graphemes = useMemo(() => getGraphemes(value), [getGraphemes, value]);

  return {
    value,
    graphemes,

    setValue,
  };
}

export interface UseTextFieldProps extends UseFieldProps, UseGraphemeInputStateProps {}

export type UseTextFieldReturn = ReturnType<typeof useTextField>;

export function useTextField(props: UseTextFieldProps) {
  const {
    value: propValue,
    defaultValue,
    onValueChange,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
    ...restProps
  } = props;

  const {
    value: stateValue,
    graphemes,
    setValue,
  } = useGraphemeInputState({
    value: propValue,
    defaultValue,
    onValueChange,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
  });
  const ctx = useField(restProps);

  const isUncontrolled = propValue === undefined;

  const stateProps = elementProps({
    ...ctx.stateProps,
    "data-empty": dataAttr(stateValue === ""),
    "data-grapheme-count-exceeded": dataAttr(
      graphemes.length > (maxGraphemeCount ?? Number.POSITIVE_INFINITY),
    ),
  });

  return {
    ...ctx,

    value: stateValue,
    graphemes,

    stateProps,

    rootProps: mergeProps(ctx.rootProps, stateProps),

    labelProps: mergeProps(ctx.labelProps, stateProps),

    inputProps: mergeProps(
      ctx.inputProps,
      inputProps({
        ...stateProps,
        ...(isUncontrolled && defaultValue && { defaultValue }),
        ...(!isUncontrolled && { value: stateValue }),
        onChange: (event) => {
          setValue(event.target.value);
        },
      }),
    ) as
      | React.InputHTMLAttributes<HTMLInputElement>
      | React.TextareaHTMLAttributes<HTMLTextAreaElement>,

    descriptionProps: mergeProps(ctx.descriptionProps, stateProps),

    errorMessageProps: mergeProps(ctx.errorMessageProps, stateProps),
  };
}
