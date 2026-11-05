import { useCallback, useMemo, useState } from "@lynx-js/react";
import { splitGraphemes } from "unicode-segmenter/grapheme";

import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./useTextFieldInput.js";

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

/**
 * @platform Lynx
 *
 * 값을 grapheme(사용자가 한 글자로 보는 단위)으로 나누고 `maxGraphemeCount`로 자른 결과를 만듭니다.
 * `textFieldRootProps`를 `TextFieldRoot`에 펼치면 `onValueChange`가 grapheme 결과를 함께 받고,
 * 최대 개수에 도달한 동안 native 입력에 UTF-16 삽입 상한을 적용합니다.
 * `counterProps`는 글자 수 표시에 씁니다.
 */
export function useTextFieldWithGraphemes({
  maxGraphemeCount,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: UseTextFieldWithGraphemesParams) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const graphemes = useMemo(() => getGraphemes(value), [value]);

  const handleValueChange = useCallback(
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
