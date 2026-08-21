import { useState, useMemo, useCallback } from "react";
import { collectGraphemes } from "unicode-segmenter/grapheme";

export interface UseTextFieldWithGraphemesParams {
  maxGraphemeCount?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (values: {
    value: string;
    graphemes: string[];
    slicedValue: string;
    slicedGraphemes: string[];
  }) => void;
}

export function useTextFieldWithGraphemes({
  maxGraphemeCount,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const graphemes = useMemo(() => collectGraphemes(value), [value]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newGraphemes = collectGraphemes(newValue);
      const newSlicedGraphemes =
        maxGraphemeCount === undefined ? newGraphemes : newGraphemes.slice(0, maxGraphemeCount);
      const newSlicedValue = newSlicedGraphemes.join("");

      // Update internal state if uncontrolled
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      onValueChange?.({
        value: newValue,
        graphemes: newGraphemes,
        slicedValue: newSlicedValue,
        slicedGraphemes: newSlicedGraphemes,
      });
    },
    [isControlled, maxGraphemeCount, onValueChange],
  );

  return {
    textFieldRootProps: {
      value,
      onValueChange: handleValueChange,
    },
    counterProps: {
      current: graphemes.length,
      max: maxGraphemeCount ?? 0,
    },
    graphemes,
  };
}
