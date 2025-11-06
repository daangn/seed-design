import { useState, useMemo, useCallback } from "react";
import { splitGraphemes } from "unicode-segmenter/grapheme";
import { memoize } from "./memoize";

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

const getGraphemes = (string: string) => Array.from(splitGraphemes(string));
const memoizedGetGraphemes = memoize(getGraphemes);

export function useTextFieldWithGraphemes({
  maxGraphemeCount,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const graphemes = useMemo(() => memoizedGetGraphemes(value), [value]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newGraphemes = memoizedGetGraphemes(newValue);
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
