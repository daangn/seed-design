import * as React from "@lynx-js/react";
import { splitGraphemes } from "unicode-segmenter/grapheme";

import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./context";

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

let cachedValue = "";
let cachedGraphemes: string[] = [];

function getGraphemes(value: string): string[] {
  if (value === cachedValue) return cachedGraphemes;

  cachedValue = value;
  cachedGraphemes = Array.from(splitGraphemes(value));
  return cachedGraphemes;
}

export function useTextFieldWithGraphemes({
  maxGraphemeCount,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const graphemes = React.useMemo(() => getGraphemes(value), [value]);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      "background only";

      const nextGraphemes = getGraphemes(nextValue);
      const slicedGraphemes =
        maxGraphemeCount === undefined ? nextGraphemes : nextGraphemes.slice(0, maxGraphemeCount);

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.({
        value: nextValue,
        graphemes: nextGraphemes,
        slicedValue: slicedGraphemes.join(""),
        slicedGraphemes,
      });
    },
    [isControlled, maxGraphemeCount, onValueChange],
  );

  return {
    textFieldRootProps: {
      value,
      onValueChange: handleValueChange,
      nativeInsertionMaxLength:
        maxGraphemeCount === undefined
          ? undefined
          : graphemes.length >= maxGraphemeCount
            ? value.length
            : NATIVE_TEXT_MAX_LENGTH_UNLIMITED,
    },
    counterProps: {
      current: graphemes.length,
      max: maxGraphemeCount ?? 0,
    },
    graphemes,
  };
}
