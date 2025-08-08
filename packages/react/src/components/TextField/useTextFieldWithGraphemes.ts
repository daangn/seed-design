import { useState, useMemo, useCallback } from "react";
import { splitGraphemes } from "unicode-segmenter/grapheme";
import { memoize } from "./memoize";

interface UseTextFieldWithGraphemesOptions {
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

interface UseTextFieldWithGraphemesReturn {
  inputProps: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  counterProps?: {
    current: number;
    max: number;
  };
  graphemes: string[];
}

export function useTextFieldWithGraphemes({
  maxGraphemes,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesOptions = {}): UseTextFieldWithGraphemesReturn {
  // Handle controlled/uncontrolled state
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const graphemes = useMemo(() => memoizedGetGraphemes(value), [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      const newGraphemes = memoizedGetGraphemes(newValue);
      const newSlicedGraphemes = maxGraphemes ? newGraphemes.slice(0, maxGraphemes) : newGraphemes;
      const newSlicedValue = newSlicedGraphemes.join("");

      // Update internal state if uncontrolled
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      // Call onChange with all values - let user decide what to use
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
    inputProps: {
      value,
      onChange: handleChange,
    },
    counterProps: maxGraphemes
      ? {
          current: graphemes.length,
          max: maxGraphemes,
        }
      : undefined,
    graphemes,
  };
}
