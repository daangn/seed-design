import { useState, useMemo, useCallback } from "react";
import { splitGraphemes } from "unicode-segmenter/grapheme";

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
  slicedValue: string;
  slicedGraphemes: string[];
}

/**
 * Hook for managing text input with grapheme counting.
 * Provides both the raw value and sliced value, allowing users to control how to handle limits.
 *
 * @example
 * ```tsx
 * // Auto-slice at limit
 * const [value, setValue] = useState("");
 * const bio = useTextFieldWithGraphemes({ 
 *   maxGraphemes: 200,
 *   value,
 *   onValueChange: ({ slicedValue }) => setValue(slicedValue)
 * });
 *
 * // Or allow overflow with visual feedback
 * const bio = useTextFieldWithGraphemes({ 
 *   maxGraphemes: 200,
 *   value,
 *   onValueChange: ({ value }) => setValue(value)
 * });
 * ```
 */
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

  // Calculate graphemes from current value
  const graphemes = useMemo(() => Array.from(splitGraphemes(value)), [value]);
  
  // Calculate sliced values
  const slicedGraphemes = useMemo(
    () => maxGraphemes ? graphemes.slice(0, maxGraphemes) : graphemes,
    [graphemes, maxGraphemes]
  );
  const slicedValue = useMemo(
    () => slicedGraphemes.join(""),
    [slicedGraphemes]
  );

  // Handle change - provide both raw and sliced values
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      const newGraphemes = Array.from(splitGraphemes(newValue));
      const newSlicedGraphemes = maxGraphemes 
        ? newGraphemes.slice(0, maxGraphemes)
        : newGraphemes;
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
    slicedValue,
    slicedGraphemes,
  };
}
