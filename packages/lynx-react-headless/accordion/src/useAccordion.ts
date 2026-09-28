import * as React from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

export interface UseAccordionProps {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

export interface UseAccordionReturn {
  values: string[];
  disabled: boolean;
  multiple: boolean;
  toggle: (value: string) => void;
}

export function useAccordion({
  values: valuesProp,
  defaultValues = [],
  onValuesChange,
  disabled = false,
  multiple = false,
}: UseAccordionProps): UseAccordionReturn {
  const [rawValues, setValues] = useControllableState({
    value: valuesProp,
    defaultValue: defaultValues,
    onChange: onValuesChange,
  });
  const values = multiple ? rawValues : rawValues.slice(0, 1);
  const toggle = React.useCallback(
    (value: string) => {
      if (disabled) return;
      if (!multiple) {
        setValues(values[0] === value ? [] : [value]);
        return;
      }
      setValues(
        values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      );
    },
    [disabled, multiple, setValues, values],
  );

  return React.useMemo(
    () => ({ values, disabled, multiple, toggle }),
    [values, disabled, multiple, toggle],
  );
}
