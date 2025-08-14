import { useState, useMemo, useCallback } from "react";
import { splitGraphemes } from "unicode-segmenter/grapheme";
import { memoize } from "./memoize";

interface UseTextFieldWithGraphemesParams {
  maxGraphemes?: number;
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

export type UseTextFieldWithGraphemesReturn = ReturnType<typeof useTextFieldWithGraphemes>;

export function useTextFieldWithGraphemes({
  maxGraphemes,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams = {}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const graphemes = useMemo(() => memoizedGetGraphemes(value), [value]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newGraphemes = memoizedGetGraphemes(newValue);
      const newSlicedGraphemes = maxGraphemes ? newGraphemes.slice(0, maxGraphemes) : newGraphemes;
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
    [isControlled, maxGraphemes, onValueChange],
  );

  return {
    textFieldRootProps: {
      value,
      onValueChange: handleValueChange,
    },
    // should handle maxGraphemes of 0
    ...(maxGraphemes !== undefined && {
      counterProps: {
        current: graphemes.length,
        max: maxGraphemes,
      },
    }),
    graphemes,
  };
}
