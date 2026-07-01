import { useState, useMemo, useCallback } from "react";
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

export function useTextFieldWithGraphemes({
  maxGraphemeCount,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams) {
  const getGraphemes = useMemo(() => {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return memoize((string: string) =>
      Array.from(segmenter.segment(string), ({ segment }) => segment),
    );
  }, []);

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const graphemes = useMemo(() => getGraphemes(value), [value, getGraphemes]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newGraphemes = getGraphemes(newValue);
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
    [isControlled, maxGraphemeCount, onValueChange, getGraphemes],
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
